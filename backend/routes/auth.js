const express = require('express');
const { 
  passport, 
  generateVerificationCode, 
  sendVerificationEmail,
  ensureAuthenticated 
} = require('../middleware/auth');

const router = express.Router();

// Check OAuth configuration
router.get('/config', (req, res) => {
  const isConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  res.json({
    oauthConfigured: isConfigured,
    message: isConfigured 
      ? 'Google OAuth is properly configured'
      : 'Google OAuth credentials missing. Please update .env file with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET'
  });
});

// Google OAuth initiate
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect('/secure-login?error=oauth_not_configured');
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
  async (req, res) => {
    try {
      // Generate verification code
      const code = generateVerificationCode();
      req.session.doubleCheckCode = code;
      req.session.doubleChecked = false;
      req.session.codeGeneratedAt = Date.now();
      
      // Send verification email
      const email = req.user.email;
      const emailResult = await sendVerificationEmail(email, code);
      
      if (!emailResult.success) {
        return res.redirect('/login?error=email_failed');
      }
      
      // Redirect to verification page
      res.redirect('/verify-email');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('/login?error=server_error');
    }
  }
);

// Verify email code
router.post('/verify-code', ensureAuthenticated, (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Verification code is required' });
  }
  
  // Check if code has expired (10 minutes)
  const codeAge = Date.now() - req.session.codeGeneratedAt;
  const maxAge = parseInt(process.env.VERIFICATION_CODE_EXPIRES) || 600000; // 10 minutes
  
  if (codeAge > maxAge) {
    return res.status(400).json({ error: 'Verification code has expired' });
  }
  
  if (code === req.session.doubleCheckCode) {
    req.session.doubleChecked = true;
    req.session.doubleCheckCode = null; // Clear the code
    req.session.codeGeneratedAt = null;
    
    return res.json({ 
      success: true, 
      message: 'Verification successful',
      user: req.user 
    });
  }
  
  res.status(400).json({ error: 'Invalid verification code' });
});

// Resend verification code
router.post('/resend-code', ensureAuthenticated, async (req, res) => {
  try {
    // Generate new verification code
    const code = generateVerificationCode();
    req.session.doubleCheckCode = code;
    req.session.codeGeneratedAt = Date.now();
    
    // Send verification email
    const email = req.user.email;
    const emailResult = await sendVerificationEmail(email, code);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }
    
    res.json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user info
router.get('/user', ensureAuthenticated, (req, res) => {
  res.json({
    user: req.user,
    doubleChecked: req.session.doubleChecked || false
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
});

module.exports = router;