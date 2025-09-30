const Razorpay = require('razorpay');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class RazorpayService {
  constructor() {
    // Initialize Razorpay instance
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'demo_key_id',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_key_secret',
    });

    this.currency = process.env.CURRENCY || 'INR';
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'demo_webhook_secret';
  }

  /**
   * Create a Razorpay order
   * @param {Object} orderData - Order details
   * @param {number} orderData.amount - Amount in paise (INR) or smallest currency unit
   * @param {string} orderData.receipt - Unique receipt ID
   * @param {Object} orderData.notes - Additional notes
   * @returns {Promise<Object>} Razorpay order object
   */
  async createOrder(orderData) {
    try {
      const options = {
        amount: orderData.amount * 100, // Convert to paise (smallest currency unit)
        currency: this.currency,
        receipt: orderData.receipt || `receipt_${uuidv4()}`,
        notes: orderData.notes || {},
        payment_capture: 1, // Auto capture payment
      };

      const order = await this.razorpay.orders.create(options);
      return {
        success: true,
        order,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify payment signature
   * @param {Object} paymentData - Payment verification data
   * @param {string} paymentData.razorpay_order_id - Order ID from Razorpay
   * @param {string} paymentData.razorpay_payment_id - Payment ID from Razorpay
   * @param {string} paymentData.razorpay_signature - Signature from Razorpay
   * @returns {boolean} True if signature is valid
   */
  verifyPaymentSignature(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
      
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpay_signature;
    } catch (error) {
      console.error('Payment signature verification error:', error);
      return false;
    }
  }

  /**
   * Verify webhook signature
   * @param {string} body - Raw webhook body
   * @param {string} signature - X-Razorpay-Signature header
   * @returns {boolean} True if webhook signature is valid
   */
  verifyWebhookSignature(body, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Get payment details by payment ID
   * @param {string} paymentId - Razorpay payment ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentDetails(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment,
      };
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Refund a payment
   * @param {string} paymentId - Razorpay payment ID
   * @param {number} amount - Refund amount in paise (optional, full refund if not provided)
   * @returns {Promise<Object>} Refund details
   */
  async refundPayment(paymentId, amount = null) {
    try {
      const refundData = {};
      if (amount) {
        refundData.amount = amount * 100; // Convert to paise
      }

      const refund = await this.razorpay.payments.refund(paymentId, refundData);
      return {
        success: true,
        refund,
      };
    } catch (error) {
      console.error('Payment refund error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get order details by order ID
   * @param {string} orderId - Razorpay order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderDetails(orderId) {
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if Razorpay is properly configured
   * @returns {boolean} True if configuration is valid
   */
  isConfigured() {
    return !!(process.env.RAZORPAY_KEY_ID && 
             process.env.RAZORPAY_KEY_SECRET && 
             process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id');
  }

  /**
   * Get configuration status
   * @returns {Object} Configuration status and details
   */
  getConfigStatus() {
    return {
      configured: this.isConfigured(),
      mode: process.env.PAYMENT_MODE || 'test',
      currency: this.currency,
      keyId: process.env.RAZORPAY_KEY_ID ? 
        process.env.RAZORPAY_KEY_ID.substring(0, 8) + '...' : 
        'Not configured',
    };
  }
}

module.exports = new RazorpayService();