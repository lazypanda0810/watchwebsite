// Main entry point for the Premium Watch E-commerce Backend
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const session = require('express-session');
require('dotenv').config();

// Import passport configuration
const { passport } = require('../middleware/auth');

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('../routes/auth');
const paymentRoutes = require('../routes/payment');
const webhookRoutes = require('../routes/webhook');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter, authLimiter, apiLimiter, checkoutLimiter } = require('./middleware/rateLimiter');
const { handleMulterError } = require('./middleware/upload');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Session middleware (must be before passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['sort', 'page', 'limit', 'brand', 'category', 'color', 'price']
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/checkout', checkoutLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'Premium Watch E-commerce API',
    version: '1.0.0',
    status: 'running',
    features: [
      'JWT Authentication',
      'Role-based Access Control',
      'Product Management',
      'Shopping Cart',
      'Order Processing',
      'Payment Integration Ready',
      'Shipping Partners Integration',
      'Advanced Search & Filtering',
      'Inventory Management',
      'GST Calculation'
    ],
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      checkout: '/api/checkout'
    }
  });
});

// Webhook routes (before body parsing middleware)
app.use('/webhook', webhookRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes); // Google OAuth routes
app.use('/api/payment', paymentRoutes); // Payment routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes); // checkout and orders

// Admin routes (for categories via products router)
// Additional admin-specific routes can be added here

// File upload error handling
app.use(handleMulterError);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    console.log('🔒 HTTP server closed');
    
    // Close database connection
    require('mongoose').connection.close(() => {
      console.log('🔌 Database connection closed');
      process.exit(0);
    });
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╭─────────────────────────────────────────────────────────╮
│                                                         │
│   🏪 Premium Watch E-commerce Backend API              │
│                                                         │
│   🚀 Server running on port ${PORT}                         │
│   📍 Environment: ${process.env.NODE_ENV || 'development'}                   │
│   🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}     │
│   📊 Health Check: http://localhost:${PORT}/health          │
│   📋 API Status: http://localhost:${PORT}/api/status        │
│                                                         │
│   📚 API Endpoints:                                     │
│   🔐 Auth: /api/auth                                    │
│   ⌚ Products: /api/products                            │
│   🛒 Cart: /api/cart                                    │
│   📦 Orders: /api/orders                                │
│   💳 Checkout: /api/checkout                            │
│                                                         │
│   🛡️  Security Features Enabled:                       │
│   ✅ Helmet (Security headers)                          │
│   ✅ CORS (Cross-origin protection)                     │
│   ✅ Rate Limiting                                      │
│   ✅ Data Sanitization                                  │
│   ✅ XSS Protection                                     │
│   ✅ Parameter Pollution Prevention                     │
│                                                         │
│   🔧 Ready for 5,000+ concurrent users                 │
│                                                         │
╰─────────────────────────────────────────────────────────╯
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle SIGTERM and SIGINT
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;