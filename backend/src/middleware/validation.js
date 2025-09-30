const { body, param, query } = require('express-validator');

// User validation rules
const validateSignup = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  
  body('dateOfBirth')
    .optional()
    .isDate()
    .withMessage('Please provide a valid date of birth'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name cannot exceed 200 characters'),
  
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  
  body('basePrice')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  
  body('variants')
    .isArray({ min: 1 })
    .withMessage('At least one variant is required'),
  
  body('variants.*.color')
    .trim()
    .notEmpty()
    .withMessage('Variant color is required'),
  
  body('variants.*.colorCode')
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Valid hex color code is required'),
  
  body('variants.*.strap.material')
    .isIn(['leather', 'metal', 'rubber', 'fabric', 'ceramic'])
    .withMessage('Invalid strap material'),
  
  body('variants.*.stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('variants.*.price')
    .isFloat({ min: 0 })
    .withMessage('Variant price must be a positive number'),
  
  body('variants.*.sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required for each variant')
];

// Cart validation rules
const validateAddToCart = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  
  body('variantSku')
    .trim()
    .notEmpty()
    .withMessage('Variant SKU is required'),
  
  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10')
];

// Order validation rules
const validateCheckout = [
  body('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required in shipping address'),
  
  body('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required in shipping address'),
  
  body('shippingAddress.email')
    .isEmail()
    .withMessage('Valid email is required in shipping address'),
  
  body('shippingAddress.phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Valid 10-digit phone number is required'),
  
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('shippingAddress.pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Valid 6-digit pincode is required'),
  
  body('paymentMethod')
    .isIn(['UPI', 'credit_card', 'debit_card', 'COD', 'paypal'])
    .withMessage('Invalid payment method'),
  
  body('shippingPartner')
    .isIn(['delhivery', 'shiprocket', 'bluedart'])
    .withMessage('Invalid shipping partner')
];

// Query validation rules
const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'rating_desc', 'newest'])
    .withMessage('Invalid sort option'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('brand')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Brand filter cannot be empty'),
  
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Category must be a valid ID')
];

// Parameter validation rules
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`)
];

module.exports = {
  validateSignup,
  validateLogin,
  validateProduct,
  validateAddToCart,
  validateCheckout,
  validateProductQuery,
  validateObjectId
};