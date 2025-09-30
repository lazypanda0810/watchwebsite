import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Order } from '@/contexts/AppContext'

// Order API functions
export const orderAPI = {
  // Get user's orders
  getOrders: async () => {
    const { data } = await api.get('/orders')
    return data
  },

  // Get single order by ID
  getOrder: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  // Create new order
  createOrder: async (orderData: {
    items: Array<{ productId: string; quantity: number }>
    shippingAddress: {
      name: string
      email: string
      phone: string
      address: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    paymentMethod: string
  }) => {
    const { data } = await api.post('/orders', orderData)
    return data
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}/status`, { status })
    return data
  },

  // Cancel order
  cancelOrder: async (id: string) => {
    const { data } = await api.put(`/orders/${id}/cancel`)
    return data
  },

  // Admin: Get all orders
  getAllOrders: async (params?: {
    page?: number
    limit?: number
    status?: string
    userId?: string
  }) => {
    const { data } = await api.get('/admin/orders', { params })
    return data
  },
}

// React Query hooks for orders
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderAPI.getOrders,
  })
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderAPI.getOrder(id),
    enabled: !!id,
  })
}

export const useAllOrders = (params?: {
  page?: number
  limit?: number
  status?: string
  userId?: string
}) => {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => orderAPI.getAllOrders(params),
  })
}

// Mutation hooks
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: orderAPI.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderAPI.updateOrderStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: orderAPI.cancelOrder,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
  })
}