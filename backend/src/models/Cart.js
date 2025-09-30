const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    color: String,
    strap: {
      material: String,
      color: String
    },
    sku: String,
    price: Number
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 1
  },
  priceAtTime: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  appliedCoupon: {
    code: String,
    discount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // 7 days in seconds
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);
  
  // Apply discount if coupon is applied
  if (this.appliedCoupon) {
    if (this.appliedCoupon.discountType === 'percentage') {
      this.discountAmount = (this.totalAmount * this.appliedCoupon.discount) / 100;
    } else {
      this.discountAmount = this.appliedCoupon.discount;
    }
  }
  
  this.finalAmount = this.totalAmount - this.discountAmount;
  next();
});

// Update item total price before saving
cartItemSchema.pre('save', function(next) {
  this.totalPrice = this.priceAtTime * this.quantity;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);