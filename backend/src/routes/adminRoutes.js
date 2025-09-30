const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getAdminOrders,
  updateOrderStatus,
  clearSampleData,
  initProductionData
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

// Data management (PRODUCTION TOOLS)
router.delete('/clear-data', clearSampleData);
router.post('/init-production', initProductionData);

module.exports = router;