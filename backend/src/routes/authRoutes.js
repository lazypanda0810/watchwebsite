const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  getMe,
  updateProfile,
  addAddress,
  logout
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes
router.use(protect); // All routes below require authentication

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.post('/addresses', addAddress);
router.post('/logout', logout);

module.exports = router;