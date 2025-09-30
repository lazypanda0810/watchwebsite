import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/data/products';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  color?: string;
  strap?: string;
}

export interface AppState {
  user: User | null;
  cart: CartItem[];
  wishlist: Product[];
  products: Product[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  user: null,
  cart: [],
  wishlist: [],
  products: [],
  loading: true,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => 
        item.product.id === action.payload.product.id &&
        item.color === action.payload.color &&
        item.strap === action.payload.strap
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'ADD_TO_WISHLIST':
      if (!state.wishlist.find(item => item.id === action.payload.id)) {
        return { ...state, wishlist: [...state.wishlist, action.payload] };
      }
      return state;
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(item => item.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchProducts: (filters?: any) => Promise<void>;
    addToCart: (product: Product, quantity: number, color?: string, strap?: string) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    fetchCart: () => Promise<void>;
  };
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize authentication check
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Add timeout to prevent hanging
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await axios.get('/api/auth/me', {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          dispatch({ type: 'SET_USER', payload: response.data.data.user });
        } catch (error) {
          console.log('Auth check failed:', error);
          // Token is invalid or server unreachable, remove it
          localStorage.removeItem('auth_token');
          dispatch({ type: 'SET_USER', payload: null });
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    };
    
    checkAuthStatus();
  }, []);

  // Setup axios interceptors
  useEffect(() => {
    // Use empty baseURL since Vite proxy handles API routing
    axios.defaults.baseURL = '';
    
    // Request interceptor to add auth token
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          dispatch({ type: 'SET_USER', payload: null });
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const actions = {
    login: async (email: string, password: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await axios.post('/api/auth/login', { email, password });
        const { token, user } = response.data.data;
        
        localStorage.setItem('auth_token', token);
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    logout: () => {
      localStorage.removeItem('auth_token');
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_CART', payload: [] });
    },

    fetchProducts: async (filters?: any) => {
      try {
        // Only show loading on initial fetch, not on filter changes
        const isInitialFetch = !state.products || state.products.length === 0;
        if (isInitialFetch) {
          dispatch({ type: 'SET_LOADING', payload: true });
        }
        
        const response = await axios.get('/api/products', { params: filters });
        
        // Transform API data to match frontend expectations
        const apiProducts = response.data.data.products || [];
        const transformedProducts = apiProducts.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.basePrice,
          originalPrice: product.discountPrice ? product.basePrice : undefined,
          image: product.variants?.[0]?.images?.[0]?.url || '/placeholder.svg',
          rating: parseFloat(product.rating?.average || '0'),
          reviews: product.rating?.count || 0,
          category: product.category?.name || '',
          isNew: product.isFeatured || false,
          description: product.description || '',
          features: product.specifications ? Object.values(product.specifications).filter(Boolean) : [],
          colors: product.variants?.map((v: any) => v.color) || [],
          straps: product.variants?.map((v: any) => v.strap?.material) || []
        }));
        
        dispatch({ type: 'SET_PRODUCTS', payload: transformedProducts });
      } catch (error: any) {
        console.log('API failed, using local data');
        // Fallback to local data only if we don't have any products yet
        if (!state.products || state.products.length === 0) {
          const { products } = await import('@/data/products');
          dispatch({ type: 'SET_PRODUCTS', payload: products });
        }
        dispatch({ type: 'SET_ERROR', payload: null }); // Clear error since we have fallback data
      } finally {
        if (!state.products || state.products.length === 0) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    },

    addToCart: async (product: Product, quantity: number, color?: string, strap?: string) => {
      try {
        const cartItem: CartItem = {
          id: `${product.id}-${color}-${strap}`,
          product,
          quantity,
          color,
          strap,
        };

        if (state.user) {
          try {
            await axios.post('/api/cart', cartItem);
          } catch (error) {
            console.log('API failed, using local cart');
          }
        }
        dispatch({ type: 'ADD_TO_CART', payload: cartItem });
      } catch (error: any) {
        // Even if API fails, still add to local cart
        const cartItem: CartItem = {
          id: `${product.id}-${color}-${strap}`,
          product,
          quantity,
          color,
          strap,
        };
        dispatch({ type: 'ADD_TO_CART', payload: cartItem });
      }
    },

    removeFromCart: async (itemId: string) => {
      try {
        if (state.user) {
          try {
            await axios.delete(`/api/cart/${itemId}`);
          } catch (error) {
            console.log('API failed, using local cart');
          }
        }
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
      } catch (error: any) {
        // Even if API fails, still remove from local cart
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
      }
    },

    updateCartQuantity: async (itemId: string, quantity: number) => {
      try {
        if (state.user) {
          try {
            await axios.put(`/api/cart/${itemId}`, { quantity });
          } catch (error) {
            console.log('API failed, using local cart');
          }
        }
        dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity } });
      } catch (error: any) {
        // Even if API fails, still update local cart
        dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity } });
      }
    },

    fetchCart: async () => {
      try {
        if (state.user) {
          const response = await axios.get('/api/cart');
          dispatch({ type: 'SET_CART', payload: response.data });
        }
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch cart' });
      }
    },

    addToWishlist: (product: Product) => {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    },

    removeFromWishlist: (productId: string) => {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    },
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {state.loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};