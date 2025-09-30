const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  addProductReview
} = require('../controllers/productController');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const { validateProduct, validateProductQuery, validateObjectId } = require('../middleware/validation');

// Public routes - Products
router.get('/', validateProductQuery, getProducts);
router.get('/:id', validateObjectId('id'), getProduct);
router.get('/category/:categoryId', validateObjectId('categoryId'), getProductsByCategory);

// Public routes - Categories
router.get('/categories/all', getCategories);
router.get('/categories/:id', validateObjectId('id'), getCategory);

// Protected routes - Reviews (require authentication)
router.post('/:id/reviews', protect, validateObjectId('id'), addProductReview);

// Admin routes - Products
router.post('/admin/products', protect, adminOnly, validateProduct, createProduct);
router.put('/admin/products/:id', protect, adminOnly, validateObjectId('id'), updateProduct);
router.delete('/admin/products/:id', protect, adminOnly, validateObjectId('id'), deleteProduct);

// Admin routes - Categories
router.post('/admin/categories', protect, adminOnly, createCategory);
router.put('/admin/categories/:id', protect, adminOnly, validateObjectId('id'), updateCategory);
router.delete('/admin/categories/:id', protect, adminOnly, validateObjectId('id'), deleteCategory);

module.exports = router;