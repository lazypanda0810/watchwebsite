const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getAdminOrders,
  updateOrderStatus
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getAdminUsers);
router.put('/users/:id/status', updateUserStatus);

// Order management
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;