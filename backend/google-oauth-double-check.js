// Entry point for the secure web app with Google OAuth and double-check email verification
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// User serialization
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Only basic profile info for now
  return done(null, profile);
}));

// Nodemailer transporter (configure with your SMTP details)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to check if user is authenticated and double-checked
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.session.doubleChecked) {
    return next();
  }
  res.redirect('/login');
}

// Routes
app.get('/', (req, res) => {
  if (req.isAuthenticated() && req.session.doubleChecked) {
    res.send('Welcome, ' + req.user.displayName + '! <a href="/logout">Logout</a>');
  } else if (req.isAuthenticated()) {
    res.redirect('/double-check');
  } else {
    res.send('<a href="/auth/google">Login with Google</a>');
  }
});

app.get('/login', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // After Google login, send code and redirect to double-check
  const code = crypto.randomInt(100000, 999999).toString();
  req.session.doubleCheckCode = code;
  req.session.doubleChecked = false;
  // Send code to user's email
  const email = req.user.emails[0].value;
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`,
  }, (err) => {
    if (err) {
      return res.send('Error sending email. <a href="/logout">Logout</a>');
    }
    res.redirect('/double-check');
  });
});

app.get('/double-check', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  if (req.session.doubleChecked) return res.redirect('/');
  res.send('<form method="POST" action="/double-check">Enter code sent to your email: <input name="code" required><button type="submit">Verify</button></form>');
});

app.post('/double-check', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  if (req.body.code === req.session.doubleCheckCode) {
    req.session.doubleChecked = true;
    return res.redirect('/');
  }
  res.send('Invalid code. <a href="/double-check">Try again</a>');
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

// Example protected route
app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('This is a protected page. <a href="/logout">Logout</a>');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
