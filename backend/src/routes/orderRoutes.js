const express = require('express');
const router = express.Router();

const {
  processCheckout,
  getOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/auth');
const { validateCheckout, validateObjectId } = require('../middleware/validation');

// Customer routes
router.post('/checkout', protect, validateCheckout, processCheckout);
router.get('/orders', protect, getOrders);
router.get('/orders/:id', protect, validateObjectId('id'), getOrder);
router.put('/orders/:id/cancel', protect, validateObjectId('id'), cancelOrder);

// Admin routes
router.get('/admin/orders', protect, adminOnly, getAllOrders);
router.put('/admin/orders/:id/status', protect, adminOnly, validateObjectId('id'), updateOrderStatus);

module.exports = router;