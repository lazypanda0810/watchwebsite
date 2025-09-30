import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/data/products';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
  loading: false,
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

  // Initialize with local data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const { products } = await import('@/data/products');
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      } catch (error) {
        console.error('Failed to load local data:', error);
      }
    };
    initializeData();
  }, []);

  // Setup axios interceptors
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    
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
        const response = await axios.post('/auth/login', { email, password });
        const { token, user } = response.data;
        
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
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await axios.get('/products', { params: filters });
        dispatch({ type: 'SET_PRODUCTS', payload: response.data });
      } catch (error: any) {
        console.log('API failed, using local data');
        // Fallback to local data
        const { products } = await import('@/data/products');
        dispatch({ type: 'SET_PRODUCTS', payload: products });
        dispatch({ type: 'SET_ERROR', payload: null }); // Clear error since we have fallback data
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
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
            await axios.post('/cart', cartItem);
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
            await axios.delete(`/cart/${itemId}`);
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
            await axios.put(`/cart/${itemId}`, { quantity });
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
          const response = await axios.get('/cart');
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
      {children}
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