// Utility functions for the application

// Generate random string
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate SKU
const generateSKU = (brand, model, color, material) => {
  const brandCode = brand.substring(0, 3).toUpperCase();
  const modelCode = model.substring(0, 3).toUpperCase();
  const colorCode = color.substring(0, 2).toUpperCase();
  const materialCode = material.substring(0, 2).toUpperCase();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${brandCode}${modelCode}${colorCode}${materialCode}${random}`;
};

// Format currency (Indian Rupees)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate distance between two coordinates (for shipping calculation)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Validate Indian PIN code
const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Validate Indian phone number
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Generate order tracking URL
const generateTrackingURL = (partner, trackingNumber) => {
  const urls = {
    delhivery: `https://www.delhivery.com/track/package/${trackingNumber}`,
    shiprocket: `https://shiprocket.in/tracking/${trackingNumber}`,
    bluedart: `https://www.bluedart.com/tracking?trackAwbNo=${trackingNumber}`
  };
  
  return urls[partner] || null;
};

// Sanitize search query
const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  
  // Remove special characters except spaces and hyphens
  return query
    .replace(/[^\w\s-]/gi, '')
    .trim()
    .substring(0, 100); // Limit length
};

// Calculate estimated delivery date
const calculateEstimatedDelivery = (shippingPartner, pincode) => {
  const deliveryDays = {
    delhivery: {
      metro: 2,
      urban: 4,
      rural: 7
    },
    shiprocket: {
      metro: 3,
      urban: 5,
      rural: 8
    },
    bluedart: {
      metro: 1,
      urban: 3,
      rural: 6
    }
  };

  // Simplified logic - in real app, use pincode database
  const metroAreas = ['110', '400', '600', '560', '700', '500']; // Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad
  const isMetro = metroAreas.some(code => pincode.startsWith(code));
  const isUrban = !isMetro && parseInt(pincode.substring(0, 2)) < 80;
  
  let days;
  if (isMetro) {
    days = deliveryDays[shippingPartner]?.metro || 3;
  } else if (isUrban) {
    days = deliveryDays[shippingPartner]?.urban || 5;
  } else {
    days = deliveryDays[shippingPartner]?.rural || 7;
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate;
};

// Generate slug from text
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// Paginate results
const paginate = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};

// Calculate discount percentage
const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Convert bytes to human readable format
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

module.exports = {
  generateRandomString,
  generateSKU,
  formatCurrency,
  calculateDistance,
  validatePincode,
  validatePhoneNumber,
  generateTrackingURL,
  sanitizeSearchQuery,
  calculateEstimatedDelivery,
  generateSlug,
  paginate,
  calculateDiscountPercentage,
  validateEmail,
  formatBytes
};