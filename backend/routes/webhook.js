const express = require('express');
const razorpayService = require('../services/razorpayService');

const router = express.Router();

/**
 * Razorpay Webhook Handler
 * POST /webhook/razorpay
 * 
 * Handles webhook events from Razorpay for payment status updates
 * Events: payment.authorized, payment.captured, payment.failed, etc.
 */
router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    // Verify webhook signature
    const isValid = razorpayService.verifyWebhookSignature(body.toString(), signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(400).json({
        success: false,
        error: 'Invalid signature'
      });
    }

    // Parse webhook data
    const event = JSON.parse(body.toString());
    const { event: eventType, payload } = event;

    console.log(`Received Razorpay webhook: ${eventType}`);

    // Handle different event types
    switch (eventType) {
      case 'payment.authorized':
        await handlePaymentAuthorized(payload.payment.entity);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;

      case 'order.paid':
        await handleOrderPaid(payload.order.entity, payload.payment.entity);
        break;

      case 'refund.created':
        await handleRefundCreated(payload.refund.entity);
        break;

      case 'refund.processed':
        await handleRefundProcessed(payload.refund.entity);
        break;

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    // Acknowledge webhook receipt
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed'
    });
  }
});

/**
 * Handle payment authorized event
 * @param {Object} payment - Payment entity from webhook
 */
async function handlePaymentAuthorized(payment) {
  try {
    console.log(`Payment authorized: ${payment.id}`);
    
    // In a real application, you would:
    // 1. Update order status to 'authorized'
    // 2. Send confirmation email to customer
    // 3. Update inventory (if not already done)
    // 4. Log the event for audit purposes

    // Example: Update order in database
    // await Order.findOneAndUpdate(
    //   { razorpayOrderId: payment.order_id },
    //   { 
    //     status: 'authorized',
    //     paymentId: payment.id,
    //     authorizedAt: new Date(payment.created_at * 1000)
    //   }
    // );

    console.log(`Order ${payment.order_id} marked as authorized`);
  } catch (error) {
    console.error('Error handling payment authorized:', error);
  }
}

/**
 * Handle payment captured event
 * @param {Object} payment - Payment entity from webhook
 */
async function handlePaymentCaptured(payment) {
  try {
    console.log(`Payment captured: ${payment.id}`);
    
    // In a real application, you would:
    // 1. Update order status to 'paid'
    // 2. Send order confirmation email
    // 3. Generate invoice
    // 4. Notify fulfillment team
    // 5. Update customer loyalty points

    // Example: Update order in database
    // await Order.findOneAndUpdate(
    //   { razorpayOrderId: payment.order_id },
    //   { 
    //     status: 'paid',
    //     paymentId: payment.id,
    //     paidAt: new Date(payment.created_at * 1000),
    //     amount: payment.amount / 100, // Convert from paise
    //     paymentMethod: payment.method
    //   }
    // );

    // Send confirmation email
    // await sendOrderConfirmationEmail(payment.order_id);

    console.log(`Order ${payment.order_id} marked as paid`);
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

/**
 * Handle payment failed event
 * @param {Object} payment - Payment entity from webhook
 */
async function handlePaymentFailed(payment) {
  try {
    console.log(`Payment failed: ${payment.id}`);
    
    // In a real application, you would:
    // 1. Update order status to 'failed'
    // 2. Release reserved inventory
    // 3. Send payment failure notification
    // 4. Log failure reason for analytics

    // Example: Update order in database
    // await Order.findOneAndUpdate(
    //   { razorpayOrderId: payment.order_id },
    //   { 
    //     status: 'failed',
    //     paymentId: payment.id,
    //     failedAt: new Date(payment.created_at * 1000),
    //     failureReason: payment.error_reason
    //   }
    // );

    // Release inventory
    // await releaseInventory(payment.order_id);

    console.log(`Order ${payment.order_id} marked as failed`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

/**
 * Handle order paid event
 * @param {Object} order - Order entity from webhook
 * @param {Object} payment - Payment entity from webhook
 */
async function handleOrderPaid(order, payment) {
  try {
    console.log(`Order paid: ${order.id}`);
    
    // This event is triggered when an order is fully paid
    // Usually happens after payment.captured
    
    // In a real application, you would:
    // 1. Final order confirmation
    // 2. Start fulfillment process
    // 3. Update analytics/reporting

    console.log(`Order ${order.id} fully paid with payment ${payment.id}`);
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}

/**
 * Handle refund created event
 * @param {Object} refund - Refund entity from webhook
 */
async function handleRefundCreated(refund) {
  try {
    console.log(`Refund created: ${refund.id}`);
    
    // In a real application, you would:
    // 1. Update order status to 'refund_initiated'
    // 2. Send refund notification to customer
    // 3. Update financial records

    // Example: Update order in database
    // await Order.findOneAndUpdate(
    //   { paymentId: refund.payment_id },
    //   { 
    //     refundStatus: 'initiated',
    //     refundId: refund.id,
    //     refundAmount: refund.amount / 100,
    //     refundInitiatedAt: new Date(refund.created_at * 1000)
    //   }
    // );

    console.log(`Refund ${refund.id} initiated for payment ${refund.payment_id}`);
  } catch (error) {
    console.error('Error handling refund created:', error);
  }
}

/**
 * Handle refund processed event
 * @param {Object} refund - Refund entity from webhook
 */
async function handleRefundProcessed(refund) {
  try {
    console.log(`Refund processed: ${refund.id}`);
    
    // In a real application, you would:
    // 1. Update order status to 'refunded'
    // 2. Send refund completion notification
    // 3. Update financial reconciliation

    // Example: Update order in database
    // await Order.findOneAndUpdate(
    //   { paymentId: refund.payment_id },
    //   { 
    //     refundStatus: 'completed',
    //     refundCompletedAt: new Date()
    //   }
    // );

    console.log(`Refund ${refund.id} completed for payment ${refund.payment_id}`);
  } catch (error) {
    console.error('Error handling refund processed:', error);
  }
}

/**
 * Test webhook endpoint (for development)
 * POST /webhook/test
 */
router.post('/test', express.json(), (req, res) => {
  try {
    console.log('Test webhook received:', req.body);
    
    res.json({
      success: true,
      message: 'Test webhook received',
      data: req.body,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Test webhook failed'
    });
  }
});

module.exports = router;