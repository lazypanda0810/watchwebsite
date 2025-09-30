const express = require('express');
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/cartController');

const { protect } = require('../middleware/auth');
const { validateAddToCart, validateObjectId } = require('../middleware/validation');

// All cart routes require authentication
router.use(protect);

// Cart routes
router.route('/')
  .get(getCart)
  .post(validateAddToCart, addToCart)
  .delete(clearCart);

router.route('/:productId')
  .put(validateObjectId('productId'), updateCartItem)
  .delete(validateObjectId('productId'), removeFromCart);

// Wishlist routes
router.route('/wishlist')
  .get(getWishlist)
  .post(addToWishlist);

router.delete('/wishlist/:productId', validateObjectId('productId'), removeFromWishlist);

module.exports = router;