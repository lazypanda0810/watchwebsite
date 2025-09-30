const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Process checkout and create order
// @route   POST /api/checkout
// @access  Private
const processCheckout = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingPartner,
      couponCode,
      isGift,
      giftMessage
    } = req.body;

    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability and create order items
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      const variant = product.variants.find(v => v.sku === cartItem.variant.sku);

      if (!product.isActive || !variant.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is no longer available`
        });
      }

      if (variant.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${variant.stock} available.`
        });
      }

      const orderItem = {
        product: product._id,
        productSnapshot: {
          name: product.name,
          brand: product.brand,
          model: product.model,
          image: variant.images[0]?.url || ''
        },
        variant: {
          color: variant.color,
          strap: variant.strap,
          sku: variant.sku
        },
        quantity: cartItem.quantity,
        price: cartItem.priceAtTime,
        totalPrice: cartItem.totalPrice
      };

      orderItems.push(orderItem);
      subtotal += cartItem.totalPrice;
    }

    // Calculate shipping cost (simplified)
    const shippingCost = calculateShippingCost(subtotal, shippingPartner);

    // Calculate GST (18% for watches in India)
    const gstRate = 0.18;
    const gstAmount = subtotal * gstRate;

    // Apply coupon if provided (simplified)
    let discountAmount = 0;
    if (couponCode) {
      discountAmount = applyCoupon(couponCode, subtotal);
    }

    const totalAmount = subtotal + shippingCost + gstAmount - discountAmount;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentDetails: {
        method: paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending'
      },
      shippingDetails: {
        partner: shippingPartner,
        shippingCost
      },
      pricing: {
        subtotal,
        shippingCost,
        tax: {
          gst: gstAmount,
          igst: gstAmount // Assuming inter-state for simplicity
        },
        discount: {
          couponCode,
          discountAmount
        },
        totalAmount
      },
      isGift,
      giftMessage
    });

    // Calculate GST breakdown
    order.calculateGST();

    await order.save();

    // Update product stock
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product._id);
      const variantIndex = product.variants.findIndex(v => v.sku === cartItem.variant.sku);
      
      product.variants[variantIndex].stock -= cartItem.quantity;
      product.soldCount += cartItem.quantity;
      await product.save();
    }

    // Process payment based on method
    let paymentResult = {};
    if (paymentMethod === 'COD') {
      paymentResult = { status: 'pending', message: 'Order placed successfully. Pay on delivery.' };
    } else {
      paymentResult = await processPayment(paymentMethod, totalAmount, order._id);
    }

    // Update order with payment details
    order.paymentDetails.transactionId = paymentResult.transactionId;
    order.paymentDetails.paymentStatus = paymentResult.status;
    order.orderStatus = paymentResult.status === 'completed' ? 'confirmed' : 'pending';
    await order.save();

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    // Create shipping label (mock)
    const shippingResult = await createShippingLabel(order, shippingPartner);
    order.shippingDetails.trackingNumber = shippingResult.trackingNumber;
    order.shippingDetails.estimatedDelivery = shippingResult.estimatedDelivery;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name brand model');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: populatedOrder,
        payment: paymentResult
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during checkout',
      error: error.message
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = { user: req.user.id };
    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name brand model')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalOrders: total,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name brand model');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      const variantIndex = product.variants.findIndex(v => v.sku === item.variant.sku);
      
      product.variants[variantIndex].stock += item.quantity;
      product.soldCount -= item.quantity;
      await product.save();
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status) {
      filter.orderStatus = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name brand model')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    // Get order statistics
    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.totalAmount' },
          averageOrderValue: { $avg: '$pricing.totalAmount' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalOrders: total,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        statistics: stats[0] || {
          totalRevenue: 0,
          averageOrderValue: 0,
          totalOrders: 0
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;
    
    if (note) {
      order.orderNotes.push({
        note,
        addedBy: req.user.id
      });
    }

    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper functions
const calculateShippingCost = (subtotal, partner) => {
  // Free shipping for orders above ₹5000
  if (subtotal >= 5000) return 0;
  
  // Different rates for different partners
  const rates = {
    delhivery: 150,
    shiprocket: 140,
    bluedart: 200
  };
  
  return rates[partner] || 150;
};

const applyCoupon = (couponCode, subtotal) => {
  // Mock coupon system
  const coupons = {
    'WELCOME10': { type: 'percentage', value: 10, minOrder: 1000 },
    'FLAT500': { type: 'fixed', value: 500, minOrder: 2000 },
    'FIRST20': { type: 'percentage', value: 20, minOrder: 1500 }
  };
  
  const coupon = coupons[couponCode];
  if (!coupon || subtotal < coupon.minOrder) return 0;
  
  if (coupon.type === 'percentage') {
    return (subtotal * coupon.value) / 100;
  } else {
    return coupon.value;
  }
};

const processPayment = async (method, amount, orderId) => {
  // Mock payment processing
  // In real implementation, integrate with Razorpay, Stripe, etc.
  
  const mockResults = {
    UPI: { status: 'completed', transactionId: `UPI_${Date.now()}` },
    credit_card: { status: 'completed', transactionId: `CC_${Date.now()}` },
    debit_card: { status: 'completed', transactionId: `DC_${Date.now()}` },
    paypal: { status: 'completed', transactionId: `PP_${Date.now()}` }
  };
  
  return mockResults[method] || { status: 'failed', transactionId: null };
};

const createShippingLabel = async (order, partner) => {
  // Mock shipping label creation
  // In real implementation, integrate with Delhivery, Shiprocket, BlueDart APIs
  
  const trackingNumber = `${partner.toUpperCase()}${Date.now()}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // 7 days from now
  
  return {
    trackingNumber,
    estimatedDelivery
  };
};

module.exports = {
  processCheckout,
  getOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};