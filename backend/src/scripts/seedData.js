const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { generateSKU } = require('../utils/helpers');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/premium_watches_store');
    console.log('🗄️  MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Sample categories
const categories = [
  {
    name: 'Luxury Watches',
    slug: 'luxury-watches',
    description: 'Premium and luxury timepieces from renowned brands',
    sortOrder: 1,
    seoTitle: 'Luxury Watches - Premium Timepieces',
    seoDescription: 'Discover our collection of luxury watches from top brands'
  },
  {
    name: 'Sports Watches',
    slug: 'sports-watches',
    description: 'Durable and functional watches for active lifestyle',
    sortOrder: 2,
    seoTitle: 'Sports Watches - Active Lifestyle Timepieces',
    seoDescription: 'Find the perfect sports watch for your active lifestyle'
  },
  {
    name: 'Smart Watches',
    slug: 'smart-watches',
    description: 'Technology-integrated timepieces with smart features',
    sortOrder: 3,
    seoTitle: 'Smart Watches - Technology Meets Time',
    seoDescription: 'Explore our range of smart watches with latest technology'
  },
  {
    name: 'Classic Watches',
    slug: 'classic-watches',
    description: 'Timeless and elegant traditional timepieces',
    sortOrder: 4,
    seoTitle: 'Classic Watches - Timeless Elegance',
    seoDescription: 'Classic watches that never go out of style'
  },
  {
    name: 'Dress Watches',
    slug: 'dress-watches',
    description: 'Sophisticated watches perfect for formal occasions',
    sortOrder: 5,
    seoTitle: 'Dress Watches - Formal Elegance',
    seoDescription: 'Elegant dress watches for formal occasions'
  }
];

// Premium watch brands and their models
const watchData = [
  // Rolex
  {
    brand: 'Rolex',
    models: [
      'Submariner', 'GMT-Master II', 'Daytona', 'Datejust', 'Explorer',
      'Sea-Dweller', 'Yacht-Master', 'Air-King', 'Milgauss', 'Cellini'
    ],
    category: 'Luxury Watches',
    priceRange: [50000, 500000],
    materials: ['stainless steel', 'gold', 'platinum'],
    movements: ['automatic']
  },
  // Omega
  {
    brand: 'Omega',
    models: [
      'Speedmaster', 'Seamaster', 'Constellation', 'De Ville', 'Planet Ocean',
      'Aqua Terra', 'Moonwatch', 'Railmaster', 'Globemaster', 'Ladymatic'
    ],
    category: 'Luxury Watches',
    priceRange: [30000, 200000],
    materials: ['stainless steel', 'titanium', 'gold'],
    movements: ['automatic', 'quartz']
  },
  // Tag Heuer
  {
    brand: 'Tag Heuer',
    models: [
      'Carrera', 'Monaco', 'Formula 1', 'Aquaracer', 'Link',
      'Autavia', 'Connected', 'Kirium', 'Alter Ego', 'Grand Carrera'
    ],
    category: 'Sports Watches',
    priceRange: [25000, 150000],
    materials: ['stainless steel', 'titanium', 'ceramic'],
    movements: ['automatic', 'quartz']
  },
  // Apple
  {
    brand: 'Apple',
    models: [
      'Watch Series 9', 'Watch Ultra 2', 'Watch SE', 'Watch Series 8',
      'Watch Ultra', 'Watch Series 7', 'Watch Nike', 'Watch Hermès'
    ],
    category: 'Smart Watches',
    priceRange: [25000, 80000],
    materials: ['aluminum', 'stainless steel', 'titanium'],
    movements: ['smartwatch']
  },
  // Tissot
  {
    brand: 'Tissot',
    models: [
      'T-Touch', 'PRC 200', 'Seastar', 'Le Locle', 'Tradition',
      'V8', 'Carson', 'Couturier', 'Gentleman', 'Supersport'
    ],
    category: 'Classic Watches',
    priceRange: [15000, 80000],
    materials: ['stainless steel', 'titanium'],
    movements: ['automatic', 'quartz']
  },
  // Casio
  {
    brand: 'Casio',
    models: [
      'G-Shock', 'Pro Trek', 'Edifice', 'Baby-G', 'Wave Ceptor',
      'Outgear', 'Sports Gear', 'Vintage', 'Oceanus', 'Sheen'
    ],
    category: 'Sports Watches',
    priceRange: [5000, 50000],
    materials: ['stainless steel', 'ceramic', 'aluminum'],
    movements: ['quartz']
  },
  // Seiko
  {
    brand: 'Seiko',
    models: [
      'Prospex', 'Presage', 'Astron', 'Premier', 'Core',
      'Lukia', 'Criteria', 'Alba', 'Pulsar', 'Lorus'
    ],
    category: 'Classic Watches',
    priceRange: [8000, 100000],
    materials: ['stainless steel', 'titanium'],
    movements: ['automatic', 'quartz']
  },
  // Citizen
  {
    brand: 'Citizen',
    models: [
      'Eco-Drive', 'Promaster', 'Satellite Wave', 'Chrono', 'Titanium',
      'Elegant', 'Sports', 'Classic', 'Aviation', 'Marine'
    ],
    category: 'Sports Watches',
    priceRange: [10000, 75000],
    materials: ['stainless steel', 'titanium'],
    movements: ['quartz']
  },
  // Fossil
  {
    brand: 'Fossil',
    models: [
      'Gen 6', 'Sport', 'Venture', 'Explorist', 'Julianna',
      'Carlyle', 'Garrett', 'Neutra', 'Machine', 'Grant'
    ],
    category: 'Smart Watches',
    priceRange: [8000, 35000],
    materials: ['stainless steel', 'leather'],
    movements: ['smartwatch', 'quartz']
  },
  // Hamilton
  {
    brand: 'Hamilton',
    models: [
      'Khaki Field', 'Jazzmaster', 'Ventura', 'Broadway', 'Valiant',
      'Pan Europ', 'Navy', 'Aviation', 'Railroad', 'American Classic'
    ],
    category: 'Dress Watches',
    priceRange: [20000, 120000],
    materials: ['stainless steel', 'gold'],
    movements: ['automatic', 'quartz']
  }
];

// Color variations
const colors = [
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Silver', code: '#C0C0C0' },
  { name: 'Gold', code: '#FFD700' },
  { name: 'Blue', code: '#0000FF' },
  { name: 'Green', code: '#008000' },
  { name: 'Red', code: '#FF0000' },
  { name: 'Brown', code: '#8B4513' },
  { name: 'Rose Gold', code: '#E8B4A0' },
  { name: 'Navy', code: '#000080' }
];

// Strap materials
const strapMaterials = ['leather', 'metal', 'rubber', 'fabric', 'ceramic'];

// Case materials (valid enum values)
const caseMaterials = ['stainless steel', 'titanium', 'gold', 'platinum', 'ceramic', 'carbon fiber', 'aluminum'];

// Watch functions
const watchFunctions = ['chronograph', 'date', 'day-date', 'moon phase', 'GMT', 'alarm', 'timer'];

// Generate sample product
const generateProduct = (brandData, model, categoryId, index) => {
  const basePrice = Math.floor(Math.random() * (brandData.priceRange[1] - brandData.priceRange[0]) + brandData.priceRange[0]);
  const discountPrice = Math.random() > 0.7 ? Math.floor(basePrice * (1 - Math.random() * 0.3)) : null;
  
  // Generate 2-4 variants per product
  const variantCount = Math.floor(Math.random() * 3) + 2;
  const variants = [];
  
  for (let i = 0; i < variantCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const strapMaterial = strapMaterials[Math.floor(Math.random() * strapMaterials.length)];
    const variantPrice = basePrice + (Math.random() * 10000 - 5000); // ±5000 variation
    
    const variant = {
      color: color.name,
      colorCode: color.code,
      strap: {
        material: strapMaterial,
        color: color.name.toLowerCase(),
        width: Math.floor(Math.random() * 10) + 18 // 18-28mm
      },
      images: [
        {
          url: `https://example.com/watches/${brandData.brand.toLowerCase()}-${model.toLowerCase()}-${color.name.toLowerCase()}-1.jpg`,
          alt: `${brandData.brand} ${model} ${color.name}`,
          isPrimary: true
        },
        {
          url: `https://example.com/watches/${brandData.brand.toLowerCase()}-${model.toLowerCase()}-${color.name.toLowerCase()}-2.jpg`,
          alt: `${brandData.brand} ${model} ${color.name} Side View`,
          isPrimary: false
        }
      ],
      stock: Math.floor(Math.random() * 50) + 5,
      price: Math.max(variantPrice, brandData.priceRange[0]),
      sku: generateSKU(brandData.brand, model, color.name, strapMaterial),
      isActive: true
    };
    
    variants.push(variant);
  }
  
  const caseSize = Math.floor(Math.random() * 20) + 35; // 35-55mm
  const selectedFunctions = watchFunctions.slice(0, Math.floor(Math.random() * 4) + 1);
  
  const product = {
    name: `${brandData.brand} ${model}`,
    brand: brandData.brand,
    model: model,
    slug: `${brandData.brand}-${model}-${index}`
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-'),
    description: `Experience the perfect blend of style and functionality with the ${brandData.brand} ${model}. This exceptional timepiece represents the pinnacle of watchmaking craftsmanship, featuring precision engineering and elegant design that makes it perfect for any occasion. Whether you're attending a business meeting or enjoying a casual weekend, this watch delivers both performance and style.`,
    shortDescription: `Premium ${brandData.brand} ${model} with sophisticated design and reliable performance.`,
    category: categoryId,
    variants: variants,
    specifications: {
      movement: brandData.movements[Math.floor(Math.random() * brandData.movements.length)],
      caseSize: caseSize,
      caseMaterial: caseMaterials[Math.floor(Math.random() * caseMaterials.length)],
      dialColor: colors[Math.floor(Math.random() * colors.length)].name,
      crystalType: ['sapphire', 'mineral'][Math.floor(Math.random() * 2)],
      waterResistance: [30, 50, 100, 200, 300][Math.floor(Math.random() * 5)],
      powerReserve: Math.floor(Math.random() * 40) + 20, // 20-60 hours
      functions: selectedFunctions,
      warranty: 2
    },
    basePrice: basePrice,
    discountPrice: discountPrice,
    tags: [brandData.brand.toLowerCase(), model.toLowerCase(), brandData.category.toLowerCase().replace(' ', '-')],
    isFeatured: Math.random() > 0.8,
    isActive: true,
    rating: {
      average: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      count: Math.floor(Math.random() * 100) + 5
    },
    seoTitle: `${brandData.brand} ${model} - Premium Watch Collection`,
    seoDescription: `Shop the ${brandData.brand} ${model} watch. Premium quality, elegant design, and reliable performance.`,
    seoKeywords: [brandData.brand.toLowerCase(), model.toLowerCase(), 'watch', 'timepiece', 'premium'],
    weight: Math.floor(Math.random() * 100) + 50, // 50-150 grams
    dimensions: {
      length: caseSize,
      width: caseSize,
      height: Math.floor(Math.random() * 5) + 10 // 10-15mm
    }
  };
  
  return product;
};

// Create admin user
const createAdminUser = async () => {
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@premiumwatches.com' });
  
  if (!adminExists) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'SecureAdminPassword123!', salt);
    
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@premiumwatches.com',
      password: hashedPassword,
      phone: '9999999999',
      role: 'admin',
      isVerified: true,
      isActive: true
    });
    
    await admin.save();
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️  Admin user already exists');
  }
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({})
    ]);
    
    // Create admin user
    await createAdminUser();
    
    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    // Create products
    console.log('⌚ Creating products...');
    const products = [];
    
    for (const brandData of watchData) {
      const categoryId = categoryMap[brandData.category];
      
      for (let i = 0; i < brandData.models.length; i++) {
        const model = brandData.models[i];
        const product = generateProduct(brandData, model, categoryId, i);
        products.push(product);
      }
    }
    
    // Insert products in batches
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`✅ Created products ${i + 1}-${Math.min(i + batchSize, products.length)}`);
    }
    
    console.log('🎉 Seed data created successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Brands: ${watchData.length}`);
    
    // Generate some sample reviews for random products
    console.log('📝 Adding sample reviews...');
    const sampleProducts = await Product.find().limit(20);
    
    for (const product of sampleProducts) {
      const reviewCount = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < reviewCount; i++) {
        const sampleReviews = [
          { rating: 5, title: 'Excellent quality!', comment: 'Amazing watch, great build quality and looks fantastic.' },
          { rating: 4, title: 'Very good product', comment: 'Good watch for the price, would recommend.' },
          { rating: 5, title: 'Love it!', comment: 'Perfect watch, exactly what I was looking for.' },
          { rating: 4, title: 'Good value', comment: 'Nice watch, good value for money.' },
          { rating: 3, title: 'Decent watch', comment: 'It\'s okay, nothing exceptional but does the job.' }
        ];
        
        const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
        
        // Create a dummy user ID (in real scenario, you'd have actual user IDs)
        const dummyUserId = new mongoose.Types.ObjectId();
        
        product.reviews.push({
          user: dummyUserId,
          rating: randomReview.rating,
          title: randomReview.title,
          comment: randomReview.comment,
          isVerified: true
        });
      }
      
      product.calculateAverageRating();
      await product.save();
    }
    
    console.log('✅ Sample reviews added');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    try {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    } catch (closeError) {
      console.error('❌ Error closing database connection:', closeError);
    }
  }
};

// Run seeding
if (require.main === module) {
  seedData();
}

module.exports = { seedData, createDefaultAdmin: createAdminUser };