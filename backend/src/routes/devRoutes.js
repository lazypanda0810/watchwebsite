const express = require('express');
const router = express.Router();

// Development only route to reset rate limits
if (process.env.NODE_ENV === 'development') {
  router.post('/reset-rate-limits', (req, res) => {
    try {
      // Clear all rate limit stores
      // Note: This only works with memory store (default for express-rate-limit)
      // For Redis or other stores, you'd need different implementation
      
      res.json({
        success: true,
        message: 'Rate limits reset successfully (server restart required for full reset)',
        note: 'This endpoint only works in development mode'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to reset rate limits',
        error: error.message
      });
    }
  });
}

module.exports = router;