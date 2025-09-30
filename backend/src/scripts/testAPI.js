#!/usr/bin/env node

// Simple script to test API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test functions
const testHealthCheck = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    log('✅ Health check passed', 'green');
    console.log(response.data);
  } catch (error) {
    log('❌ Health check failed', 'red');
    console.error(error.message);
  }
};

const testAPIStatus = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/status`);
    log('✅ API status check passed', 'green');
    console.log(response.data);
  } catch (error) {
    log('❌ API status check failed', 'red');
    console.error(error.message);
  }
};

const testUserRegistration = async () => {
  try {
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      phone: '9876543210'
    };

    const response = await axios.post(`${BASE_URL}/api/auth/signup`, testUser);
    log('✅ User registration passed', 'green');
    authToken = response.data.data.token;
    console.log('User created:', response.data.data.user);
    return testUser;
  } catch (error) {
    log('❌ User registration failed', 'red');
    console.error(error.response?.data || error.message);
  }
};

const testUserLogin = async (user) => {
  try {
    const loginData = {
      email: user.email,
      password: user.password
    };

    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    log('✅ User login passed', 'green');
    authToken = response.data.data.token;
    console.log('Login successful');
  } catch (error) {
    log('❌ User login failed', 'red');
    console.error(error.response?.data || error.message);
  }
};

const testGetProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products?limit=5`);
    log('✅ Get products passed', 'green');
    console.log(`Found ${response.data.data.products.length} products`);
    return response.data.data.products[0]; // Return first product for testing
  } catch (error) {
    log('❌ Get products failed', 'red');
    console.error(error.response?.data || error.message);
  }
};

const testGetCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products/categories/all`);
    log('✅ Get categories passed', 'green');
    console.log(`Found ${response.data.data.categories.length} categories`);
  } catch (error) {
    log('❌ Get categories failed', 'red');
    console.error(error.response?.data || error.message);
  }
};

const testAddToCart = async (product) => {
  if (!authToken || !product) return;

  try {
    const cartData = {
      productId: product._id,
      variantSku: product.variants[0].sku,
      quantity: 1
    };

    const response = await axios.post(`${BASE_URL}/api/cart`, cartData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('✅ Add to cart passed', 'green');
    console.log('Item added to cart');
  } catch (error) {
    log('❌ Add to cart failed', 'red');
    console.error(error.response?.data || error.message);
  }
};

const testGetCart = async () => {
  if (!authToken) return;

  try {
    const response = await axios.get(`${BASE_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('✅ Get cart passed', 'green');
    console.log(`Cart has ${response.data.data.cart.totalItems} items`);
  } catch (error) {
    log('❌ Get cart failed', 'red');
    console.error(error.response?.data || error.message);
  }
};

const testAdminLogin = async () => {
  try {
    const adminLogin = {
      email: 'admin@premiumwatches.com',
      password: 'SecureAdminPassword123!'
    };

    const response = await axios.post(`${BASE_URL}/api/auth/login`, adminLogin);
    log('✅ Admin login passed', 'green');
    const adminToken = response.data.data.token;
    console.log('Admin login successful');
    return adminToken;
  } catch (error) {
    log('❌ Admin login failed', 'red');
    console.error(error.response?.data || error.message);
  }
};

const testGetAllOrders = async (adminToken) => {
  if (!adminToken) return;

  try {
    const response = await axios.get(`${BASE_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log('✅ Get all orders (admin) passed', 'green');
    console.log(`Found ${response.data.data.orders.length} orders`);
  } catch (error) {
    log('❌ Get all orders failed', 'red');
    console.error(error.response?.data || error.message);
  }
};

// Main test runner
const runTests = async () => {
  log('🚀 Starting API tests...', 'blue');
  log('====================================', 'blue');

  // Basic tests
  await testHealthCheck();
  await testAPIStatus();
  
  // User tests
  const testUser = await testUserRegistration();
  if (testUser) {
    await testUserLogin(testUser);
  }

  // Product tests
  const product = await testGetProducts();
  await testGetCategories();

  // Cart tests
  if (product) {
    await testAddToCart(product);
    await testGetCart();
  }

  // Admin tests
  const adminToken = await testAdminLogin();
  if (adminToken) {
    await testGetAllOrders(adminToken);
  }

  log('====================================', 'blue');
  log('🏁 API tests completed!', 'blue');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };