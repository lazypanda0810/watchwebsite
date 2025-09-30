const rateLimit = require('express-rate-limit');

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 15 * 60 * 1000, // 5 minutes for dev, 15 for production
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // 100 for dev, 5 for production
  message: {
    success: false,
    message: `Too many authentication attempts from this IP, please try again after ${process.env.NODE_ENV === 'development' ? '5' : '15'} minutes.`
  },
  skipSuccessfulRequests: true,
  // In development, use memory store which resets on server restart
  // In production, you might want to use Redis for persistence
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: 'API rate limit exceeded, please try again later.'
  },
});

// Checkout rate limiting
const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 checkout attempts per hour
  message: {
    success: false,
    message: 'Too many checkout attempts, please try again after an hour.'
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter,
  checkoutLimiter
};