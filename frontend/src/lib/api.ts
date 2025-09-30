/**
 * API Configuration and utilities for Chronos Watch Shop Frontend
 */

// Environment-based configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  PAYMENT_SUCCESS_URL: import.meta.env.VITE_PAYMENT_SUCCESS_URL || 'http://localhost:8080/payment/success',
  PAYMENT_FAILURE_URL: import.meta.env.VITE_PAYMENT_FAILURE_URL || 'http://localhost:8080/payment/failure',
  GOOGLE_OAUTH_REDIRECT_URL: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL || 'http://localhost:5000/auth/google',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development'
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    USER: '/auth/user',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
    VERIFY_CODE: '/auth/verify-code',
    RESEND_CODE: '/auth/resend-code'
  },
  
  // Payment
  PAYMENT: {
    CONFIG: '/api/payment/config',
    CREATE_ORDER: '/api/payment/create-order',
    VERIFY: '/api/payment/verify',
    STATUS: (paymentId: string) => `/api/payment/status/${paymentId}`,
    SUCCESS_DETAILS: '/api/payment/success-details'
  },
  
  // Products
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`
  },
  
  // Cart
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart/add',
    UPDATE: '/api/cart/update',
    REMOVE: '/api/cart/remove',
    CLEAR: '/api/cart/clear'
  },
  
  // Orders
  ORDERS: {
    LIST: '/api/orders',
    DETAIL: (id: string) => `/api/orders/${id}`,
    CREATE: '/api/orders'
  },
  
  // Health
  HEALTH: '/health',
  API_STATUS: '/api/status'
} as const;

/**
 * Fetch wrapper with default configuration
 */
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  // Handle relative URLs
  const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, finalOptions);
    
    // Log errors in development
    if (!response.ok && API_CONFIG.NODE_ENV === 'development') {
      console.error(`API Error: ${response.status} ${response.statusText} - ${url}`);
    }
    
    return response;
  } catch (error) {
    if (API_CONFIG.NODE_ENV === 'development') {
      console.error(`Network Error: ${error} - ${url}`);
    }
    throw error;
  }
};

/**
 * JSON API request helper
 */
export const apiRequestJson = async <T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const response = await apiRequest(endpoint, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * GET request helper
 */
export const get = <T = any>(endpoint: string): Promise<T> => 
  apiRequestJson<T>(endpoint, { method: 'GET' });

/**
 * POST request helper
 */
export const post = <T = any>(endpoint: string, data?: any): Promise<T> => 
  apiRequestJson<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  });

/**
 * PUT request helper
 */
export const put = <T = any>(endpoint: string, data?: any): Promise<T> => 
  apiRequestJson<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  });

/**
 * DELETE request helper
 */
export const del = <T = any>(endpoint: string): Promise<T> => 
  apiRequestJson<T>(endpoint, { method: 'DELETE' });

/**
 * Check if API is available
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiRequest(API_ENDPOINTS.HEALTH);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Configuration validation
 */
export const validateConfiguration = (): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  if (!API_CONFIG.BASE_URL) {
    issues.push('VITE_API_BASE_URL is not configured');
  }
  
  if (!API_CONFIG.RAZORPAY_KEY_ID) {
    issues.push('VITE_RAZORPAY_KEY_ID is not configured');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};

// Export configuration for debugging
if (API_CONFIG.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', API_CONFIG);
  
  const validation = validateConfiguration();
  if (!validation.valid) {
    console.warn('⚠️ Configuration issues found:', validation.issues);
  }
}