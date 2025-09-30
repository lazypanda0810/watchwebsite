const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSnapshot: {
    name: String,
    brand: String,
    model: String,
    image: String
  },
  variant: {
    color: String,
    strap: {
      material: String,
      color: String
    },
    sku: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' }
});

const paymentDetailsSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['UPI', 'credit_card', 'debit_card', 'COD', 'paypal', 'razorpay', 'stripe']
  },
  transactionId: String,
  paymentGateway: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paidAmount: Number,
  paymentDate: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: Date
});

const shippingDetailsSchema = new mongoose.Schema({
  partner: {
    type: String,
    enum: ['delhivery', 'shiprocket', 'bluedart'],
    required: true
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  shippingCost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned'],
    default: 'pending'
  },
  updates: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: String
  }]
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema,
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentDetails: paymentDetailsSchema,
  shippingDetails: shippingDetailsSchema,
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    tax: {
      gst: {
        type: Number,
        default: 0
      },
      cgst: {
        type: Number,
        default: 0
      },
      sgst: {
        type: Number,
        default: 0
      },
      igst: {
        type: Number,
        default: 0
      }
    },
    discount: {
      couponCode: String,
      discountAmount: {
        type: Number,
        default: 0
      }
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  orderNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  estimatedDelivery: Date,
  actualDelivery: Date,
  cancellationReason: String,
  returnReason: String,
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin'],
    default: 'web'
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.orderNumber = `WW${timestamp}${random}`;
  }
  next();
});

// Calculate GST (18% for watches in India)
orderSchema.methods.calculateGST = function() {
  const gstRate = 0.18; // 18%
  const subtotal = this.pricing.subtotal;
  
  // For intra-state (same state), divide GST into CGST and SGST
  // For inter-state, use IGST
  const totalGST = subtotal * gstRate;
  
  // Assuming inter-state for simplicity
  this.pricing.tax.igst = totalGST;
  this.pricing.tax.gst = totalGST;
  
  return totalGST;
};

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
// orderNumber index is already created by unique: true
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);