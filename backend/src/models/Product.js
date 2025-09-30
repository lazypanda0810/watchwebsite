const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  },
  colorCode: {
    type: String, // Hex color code
    required: true
  },
  strap: {
    material: {
      type: String,
      required: true,
      enum: ['leather', 'metal', 'rubber', 'fabric', 'ceramic']
    },
    color: String,
    width: Number // in mm
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const specificationSchema = new mongoose.Schema({
  movement: {
    type: String,
    enum: ['automatic', 'quartz', 'mechanical', 'smartwatch']
  },
  caseSize: {
    type: Number, // in mm
    min: 20,
    max: 60
  },
  caseMaterial: {
    type: String,
    enum: ['stainless steel', 'titanium', 'gold', 'platinum', 'ceramic', 'carbon fiber', 'aluminum']
  },
  dialColor: String,
  crystalType: {
    type: String,
    enum: ['sapphire', 'mineral', 'acrylic']
  },
  waterResistance: {
    type: Number, // in meters
    min: 0
  },
  powerReserve: {
    type: Number, // in hours
    min: 0
  },
  functions: [{
    type: String,
    enum: ['chronograph', 'date', 'day-date', 'moon phase', 'GMT', 'alarm', 'timer']
  }],
  warranty: {
    type: Number, // in years
    default: 2
  }
});

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxLength: [100, 'Review title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: true,
    maxLength: [1000, 'Review comment cannot exceed 1000 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: false,
    unique: true,
    lowercase: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxLength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  variants: [variantSchema],
  specifications: specificationSchema,
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalStock: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [reviewSchema],
  seoTitle: {
    type: String,
    maxLength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    maxLength: [160, 'SEO description cannot exceed 160 characters']
  },
  seoKeywords: [{
    type: String
  }],
  launchDate: {
    type: Date,
    default: Date.now
  },
  weight: {
    type: Number // in grams
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// Create slug from name and model before saving
productSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name') || this.isModified('model') || this.isModified('brand')) {
    this.slug = `${this.brand}-${this.model}-${this.name}`
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  
  // Calculate total stock from variants
  this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
  
  // Calculate discount percentage if discount price is set
  if (this.discountPrice && this.basePrice) {
    this.discountPercentage = Math.round(((this.basePrice - this.discountPrice) / this.basePrice) * 100);
  }
  
  next();
});

// Calculate average rating when reviews are updated
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = (totalRating / this.reviews.length).toFixed(1);
  this.rating.count = this.reviews.length;
};

// Index for search optimization
productSchema.index({ name: 'text', brand: 'text', model: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);