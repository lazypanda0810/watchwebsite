import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Product } from '@/contexts/AppContext'

// Product API functions
export const productAPI = {
  // Get all products with optional filters
  getProducts: async (params?: {
    page?: number
    limit?: number
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    search?: string
    featured?: boolean
  }) => {
    const { data } = await api.get('/products', { params })
    return data
  },

  // Get single product by ID
  getProduct: async (id: string) => {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const { data } = await api.get('/products?featured=true')
    return data
  },

  // Search products
  searchProducts: async (query: string) => {
    const { data } = await api.get(`/products/search?q=${encodeURIComponent(query)}`)
    return data
  },

  // Admin functions
  createProduct: async (productData: Partial<Product>) => {
    const { data } = await api.post('/products', productData)
    return data
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    const { data } = await api.put(`/products/${id}`, productData)
    return data
  },

  deleteProduct: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`)
    return data
  },
}

// React Query hooks for products
export const useProducts = (params?: {
  page?: number
  limit?: number
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  featured?: boolean
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productAPI.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProduct(id),
    enabled: !!id,
  })
}

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productAPI.getFeaturedProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productAPI.searchProducts(query),
    enabled: !!query && query.length > 2,
  })
}

// Mutation hooks for admin operations
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productAPI.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}