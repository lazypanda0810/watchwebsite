# Chronos Watch Shop - Database Schema

## Overview

This document describes the MongoDB database schema for the Chronos Watch Shop e-commerce platform. The application uses **Mongoose ODM** for data modeling and validation.

## Database: `chronos_watch_shop`

### Collections Overview

- **users** - User accounts and authentication data
- **products** - Watch catalog and inventory
- **orders** - Customer orders and order items
- **payments** - Payment transactions and status
- **categories** - Product categories and classifications
- **reviews** - Product reviews and ratings
- **carts** - Shopping cart data
- **sessions** - User session management

---

## 🔐 Users Collection

### Schema: `users`

```javascript
const userSchema = new mongoose.Schema({
  // Authentication
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    code: String,
    generatedAt: Date,
    expiresAt: Date
  },

  // Profile Information
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  firstName: String,
  lastName: String,
  profilePicture: String,
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please enter a valid 10-digit phone number'
    }
  },

  // Address Information
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    name: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
  }],

  // User Preferences
  preferences: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },

  // Account Status
  role: {
    type: String,
    enum: ['customer', 'admin', 'moderator'],
    default: 'customer'
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  
  // Security
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, isActive: 1 });
```

### Sample Data: Users

```javascript
// Sample User Documents
const sampleUsers = [
  {
    _id: ObjectId("64f8e1234567890123456789"),
    googleId: "108234567890123456789",
    email: "john.doe@gmail.com",
    emailVerified: true,
    displayName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    profilePicture: "https://lh3.googleusercontent.com/a/default-user",
    phone: "9876543210",
    addresses: [{
      type: "home",
      name: "John Doe",
      addressLine1: "123 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
      isDefault: true
    }],
    preferences: {
      currency: "INR",
      language: "en",
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    },
    role: "customer",
    isActive: true,
    lastLogin: new Date("2025-09-28T10:30:00Z"),
    createdAt: new Date("2025-09-20T08:15:00Z"),
    updatedAt: new Date("2025-09-28T10:30:00Z")
  }
];
```

---

## 💳 Payments Collection

### Schema: `payments`

```javascript
const paymentSchema = new mongoose.Schema({
  // Order Reference
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Payment Gateway Data
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    index: true
  },
  razorpaySignature: String,

  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'authorized', 'captured', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  
  // Payment Method
  method: {
    type: String,
    enum: ['card', 'netbanking', 'wallet', 'upi', 'emi', 'other']
  },
  
  // Gateway Response
  gatewayResponse: {
    acquirerData: Object,
    bankTransactionId: String,
    errorCode: String,
    errorDescription: String
  },

  // Refund Information
  refunds: [{
    razorpayRefundId: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    },
    reason: String,
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    initiatedAt: Date,
    processedAt: Date
  }],

  // Customer Details
  customerDetails: {
    name: String,
    email: String,
    phone: String
  },

  // Timestamps
  authorizedAt: Date,
  capturedAt: Date,
  failedAt: Date,
  cancelledAt: Date,
  
  // Metadata
  receipt: String,
  notes: Object,
  
  // Audit
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ orderId: 1, status: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });
```

### Sample Data: Payments

```javascript
// Sample Payment Documents
const samplePayments = [
  {
    _id: ObjectId("64f8e2345678901234567890"),
    orderId: ObjectId("64f8e3456789012345678901"),
    userId: ObjectId("64f8e1234567890123456789"),
    razorpayOrderId: "order_MnK7z8r9P0q1R2s3",
    razorpayPaymentId: "pay_N4o5P6q7R8s9T0u1",
    razorpaySignature: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    amount: 25000,
    currency: "INR",
    status: "captured",
    method: "card",
    gatewayResponse: {
      acquirerData: {
        bankTransactionId: "B123456789"
      }
    },
    customerDetails: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      phone: "9876543210"
    },
    authorizedAt: new Date("2025-09-28T10:35:00Z"),
    capturedAt: new Date("2025-09-28T10:35:30Z"),
    receipt: "receipt_ChronosWatch_001",
    notes: {
      productType: "premium_watch",
      orderNumber: "CW2025092801"
    },
    createdAt: new Date("2025-09-28T10:30:00Z"),
    updatedAt: new Date("2025-09-28T10:35:30Z")
  }
];
```

---

## 📦 Orders Collection

### Schema: `orders`

```javascript
const orderSchema = new mongoose.Schema({
  // Order Identity
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Customer Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Order Items
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    sku: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    
    // Product snapshot at time of order
    productSnapshot: {
      images: [String],
      specifications: Object,
      brand: String,
      model: String
    }
  }],

  // Pricing
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  shipping: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },

  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true
  },
  
  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
    index: true
  },

  // Shipping Information
  shippingAddress: {
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: String
  },

  // Tracking
  tracking: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },

  // Timeline
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Metadata
  notes: String,
  internalNotes: String,
  
  // Timestamps
  placedAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
```

---

## ⌚ Products Collection

### Schema: `products`

```javascript
const productSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  sku: { type: String, required: true, unique: true, index: true },
  brand: { type: String, required: true, index: true },
  model: String,
  
  // Description
  shortDescription: { type: String, maxlength: 200 },
  fullDescription: String,
  
  // Pricing
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, min: 0 },
  costPrice: { type: Number, min: 0 },
  
  // Inventory
  stock: { type: Number, default: 0, min: 0 },
  trackInventory: { type: Boolean, default: true },
  allowBackorders: { type: Boolean, default: false },
  
  // Categories
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  subcategory: String,
  tags: [{ type: String, index: true }],
  
  // Images
  images: [{
    url: { type: String, required: true },
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Specifications
  specifications: {
    movement: String,
    caseMaterial: String,
    caseSize: String,
    dialColor: String,
    strapMaterial: String,
    waterResistance: String,
    warranty: String,
    weight: Number,
    features: [String]
  },
  
  // SEO
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'discontinued'],
    default: 'draft',
    index: true
  },
  featured: { type: Boolean, default: false, index: true },
  
  // Analytics
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 'text', shortDescription: 'text' });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1, featured: -1 });
productSchema.index({ 'rating.average': -1 });
```

---

## 🗂️ Categories Collection

### Schema: `categories`

```javascript
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: String,
  
  // Hierarchy
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: { type: Number, default: 0 },
  
  // Display
  image: String,
  icon: String,
  color: String,
  
  // SEO
  seoTitle: String,
  seoDescription: String,
  
  // Status
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
categorySchema.index({ parent: 1, sortOrder: 1 });
categorySchema.index({ isActive: 1, level: 1 });
```

---

## ⭐ Reviews Collection

### Schema: `reviews`

```javascript
const reviewSchema = new mongoose.Schema({
  // References
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Review Content
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 100 },
  content: { type: String, required: true, maxlength: 1000 },
  
  // Media
  images: [String],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  
  // Verification
  isVerifiedPurchase: { type: Boolean, default: false },
  
  // Interaction
  helpfulVotes: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
```

---

## 🛒 Carts Collection

### Schema: `carts`

```javascript
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Totals
  subtotal: { type: Number, default: 0 },
  
  // Timestamps
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: false, updatedAt: true }
});

// Indexes
cartSchema.index({ userId: 1 });
cartSchema.index({ 'items.productId': 1 });
```

---

## 📊 Sample Queries

### User Queries

```javascript
// Find user by email
const user = await User.findOne({ email: 'john.doe@gmail.com' });

// Find users with verified emails
const verifiedUsers = await User.find({ emailVerified: true });

// Find admin users
const admins = await User.find({ role: 'admin', isActive: true });

// Update user's last login
await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
```

### Payment Queries

```javascript
// Find payments by user
const userPayments = await Payment.find({ userId: userId })
  .populate('orderId')
  .sort({ createdAt: -1 });

// Find successful payments in date range
const successfulPayments = await Payment.find({
  status: 'captured',
  createdAt: {
    $gte: new Date('2025-09-01'),
    $lte: new Date('2025-09-30')
  }
});

// Calculate total revenue
const totalRevenue = await Payment.aggregate([
  { $match: { status: 'captured' } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
]);

// Find failed payments for retry
const failedPayments = await Payment.find({
  status: 'failed',
  createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
});
```

### Order Queries

```javascript
// Find user's orders
const userOrders = await Order.find({ userId: userId })
  .populate('items.productId')
  .sort({ createdAt: -1 });

// Find orders by status
const pendingOrders = await Order.find({ status: 'pending' });

// Update order status
await Order.findByIdAndUpdate(orderId, {
  status: 'shipped',
  shippedAt: new Date(),
  $push: {
    timeline: {
      status: 'shipped',
      timestamp: new Date(),
      note: 'Order shipped via courier'
    }
  }
});

// Find orders requiring attention
const requiresAttention = await Order.find({
  status: { $in: ['pending', 'processing'] },
  createdAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
});
```

### Product Queries

```javascript
// Search products
const products = await Product.find({
  $text: { $search: 'luxury watch' },
  status: 'active',
  stock: { $gt: 0 }
}).populate('category');

// Find products by category
const categoryProducts = await Product.find({
  category: categoryId,
  status: 'active'
}).sort({ featured: -1, 'rating.average': -1 });

// Update product rating
await Product.findByIdAndUpdate(productId, {
  'rating.average': averageRating,
  'rating.count': totalReviews
});

// Find low stock products
const lowStock = await Product.find({
  stock: { $lte: 5 },
  trackInventory: true,
  status: 'active'
});
```

---

## 🔍 Database Indexes Summary

### Performance Indexes

```javascript
// User Collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "googleId": 1 }, { sparse: true })
db.users.createIndex({ "role": 1, "isActive": 1 })

// Payment Collection
db.payments.createIndex({ "razorpayOrderId": 1 }, { unique: true })
db.payments.createIndex({ "userId": 1, "createdAt": -1 })
db.payments.createIndex({ "status": 1, "createdAt": -1 })

// Order Collection
db.orders.createIndex({ "orderNumber": 1 }, { unique: true })
db.orders.createIndex({ "userId": 1, "createdAt": -1 })
db.orders.createIndex({ "status": 1, "createdAt": -1 })

// Product Collection
db.products.createIndex({ "name": "text", "shortDescription": "text" })
db.products.createIndex({ "sku": 1 }, { unique: true })
db.products.createIndex({ "brand": 1, "category": 1 })
db.products.createIndex({ "status": 1, "featured": -1 })
```

---

## 🚀 Database Setup Commands

### Initialize Database

```javascript
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chronos_watch_shop');

// Create collections with validation
await db.createCollection('users', { validator: { /* user schema */ } });
await db.createCollection('payments', { validator: { /* payment schema */ } });
await db.createCollection('orders', { validator: { /* order schema */ } });
await db.createCollection('products', { validator: { /* product schema */ } });

// Create indexes
await User.createIndexes();
await Payment.createIndexes();
await Order.createIndexes();
await Product.createIndexes();
```

### Sample Data Insertion

```javascript
// Insert sample users
await User.insertMany(sampleUsers);

// Insert sample products
await Product.insertMany(sampleProducts);

// Insert sample categories
await Category.insertMany(sampleCategories);
```

---

This database schema provides a solid foundation for the Chronos Watch Shop e-commerce platform with proper indexing, validation, and relationships between collections.