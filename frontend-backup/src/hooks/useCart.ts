import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useApp } from '@/contexts/AppContext'

// Cart API functions
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    const { data } = await api.get('/cart')
    return data
  },

  // Add item to cart
  addToCart: async (productId: string, quantity: number) => {
    const { data } = await api.post('/cart/add', { productId, quantity })
    return data
  },

  // Update cart item quantity
  updateCartItem: async (productId: string, quantity: number) => {
    const { data } = await api.put('/cart/update', { productId, quantity })
    return data
  },

  // Remove item from cart
  removeFromCart: async (productId: string) => {
    const { data } = await api.delete(`/cart/remove/${productId}`)
    return data
  },

  // Clear entire cart
  clearCart: async () => {
    const { data } = await api.delete('/cart/clear')
    return data
  },

  // Sync local cart with server (for when user logs in)
  syncCart: async (cartItems: any[]) => {
    const { data } = await api.post('/cart/sync', { items: cartItems })
    return data
  },
}

// React Query hooks for cart operations
export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const { addToCart: addToLocalCart } = useApp()
  
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartAPI.addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      // Also update local cart if needed
    },
    onError: (error, { productId, quantity }) => {
      // If API call fails, still add to local cart
      console.error('Failed to add to cart on server:', error)
    },
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartAPI.updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cartAPI.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useClearCart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cartAPI.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useSyncCart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cartAPI.syncCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}