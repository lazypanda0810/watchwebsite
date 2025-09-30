const express = require('express');
const razorpayService = require('../services/razorpayService');
const { ensureDoubleChecked } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * Get Razorpay configuration status
 * GET /api/payment/config
 */
router.get('/config', (req, res) => {
  try {
    const configStatus = razorpayService.getConfigStatus();
    res.json({
      success: true,
      ...configStatus,
      message: configStatus.configured 
        ? 'Razorpay is properly configured' 
        : 'Razorpay configuration required'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get payment configuration'
    });
  }
});

/**
 * Create payment order
 * POST /api/payment/create-order
 * Body: { amount, currency?, notes?, receipt? }
 */
router.post('/create-order', ensureDoubleChecked, async (req, res) => {
  try {
    const { amount, currency, notes, receipt } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required'
      });
    }

    // Check if Razorpay is configured
    if (!razorpayService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Payment gateway not configured'
      });
    }

    // Create order data
    const orderData = {
      amount: parseFloat(amount),
      currency: currency || process.env.CURRENCY || 'INR',
      receipt: receipt || `order_${uuidv4()}`,
      notes: {
        userId: req.user?.id || 'anonymous',
        userEmail: req.user?.email || 'unknown',
        ...notes
      }
    };

    const result = await razorpayService.createOrder(orderData);

    if (result.success) {
      // Store order in session for verification
      req.session.pendingOrder = {
        razorpayOrderId: result.order.id,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        createdAt: new Date(),
        userId: req.user?.id
      };

      res.json({
        success: true,
        order: result.order,
        keyId: result.keyId,
        user: {
          name: req.user?.displayName || 'Customer',
          email: req.user?.email || ''
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to create payment order'
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * Verify payment
 * POST /api/payment/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
router.post('/verify', ensureDoubleChecked, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment verification data'
      });
    }

    // Check if we have a pending order in session
    const pendingOrder = req.session.pendingOrder;
    if (!pendingOrder || pendingOrder.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired order session'
      });
    }

    // Verify payment signature
    const isValid = razorpayService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (isValid) {
      // Get payment details from Razorpay
      const paymentDetails = await razorpayService.getPaymentDetails(razorpay_payment_id);

      if (paymentDetails.success) {
        // Clear pending order from session
        delete req.session.pendingOrder;

        // In a real application, you would:
        // 1. Update order status in database
        // 2. Send confirmation email
        // 3. Update inventory
        // 4. Generate invoice

        const successData = {
          success: true,
          message: 'Payment verified successfully',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          amount: pendingOrder.amount,
          currency: pendingOrder.currency,
          status: paymentDetails.payment.status,
          method: paymentDetails.payment.method,
          timestamp: new Date(),
          receipt: pendingOrder.receipt
        };

        // Store successful payment in session for success page
        req.session.successfulPayment = successData;

        res.json(successData);
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch payment details'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment signature verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
});

/**
 * Get payment status
 * GET /api/payment/status/:paymentId
 */
router.get('/status/:paymentId', ensureDoubleChecked, async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      });
    }

    const result = await razorpayService.getPaymentDetails(paymentId);

    if (result.success) {
      res.json({
        success: true,
        payment: {
          id: result.payment.id,
          amount: result.payment.amount / 100, // Convert from paise to rupees
          currency: result.payment.currency,
          status: result.payment.status,
          method: result.payment.method,
          createdAt: result.payment.created_at,
          orderId: result.payment.order_id
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status'
    });
  }
});

/**
 * Initiate refund
 * POST /api/payment/refund
 * Body: { paymentId, amount? }
 */
router.post('/refund', ensureDoubleChecked, async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      });
    }

    // In a real application, you would check if the user has permission to refund this payment
    const result = await razorpayService.refundPayment(paymentId, amount);

    if (result.success) {
      res.json({
        success: true,
        message: 'Refund initiated successfully',
        refund: {
          id: result.refund.id,
          amount: result.refund.amount / 100, // Convert from paise
          status: result.refund.status,
          createdAt: result.refund.created_at
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to initiate refund'
      });
    }
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process refund'
    });
  }
});

/**
 * Get successful payment details (for success page)
 * GET /api/payment/success-details
 */
router.get('/success-details', (req, res) => {
  try {
    const successfulPayment = req.session.successfulPayment;
    
    if (successfulPayment) {
      // Clear it after retrieving (one-time use)
      delete req.session.successfulPayment;
      
      res.json({
        success: true,
        payment: successfulPayment
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No successful payment found'
      });
    }
  } catch (error) {
    console.error('Get success details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment details'
    });
  }
});

module.exports = router;