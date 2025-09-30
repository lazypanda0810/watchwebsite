import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useApp } from '@/contexts/AppContext'

// Auth API functions
export const authAPI = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  // Register
  register: async (userData: {
    name: string
    email: string
    password: string
  }) => {
    const { data } = await api.post('/auth/register', userData)
    return data
  },

  // Logout
  logout: async () => {
    const { data } = await api.post('/auth/logout')
    return data
  },

  // Get current user
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },

  // Update profile
  updateProfile: async (userData: {
    name?: string
    email?: string
    currentPassword?: string
    newPassword?: string
  }) => {
    const { data } = await api.put('/auth/profile', userData)
    return data
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const { data } = await api.post('/auth/reset-password', { token, password })
    return data
  },
}

// React Query hooks for authentication
export const useLogin = () => {
  const { dispatch } = useApp()
  
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token)
      dispatch({ type: 'SET_USER', payload: data.user })
    },
  })
}

export const useRegister = () => {
  const { dispatch } = useApp()
  
  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token)
      dispatch({ type: 'SET_USER', payload: data.user })
    },
  })
}

export const useLogout = () => {
  const { dispatch } = useApp()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('authToken')
      dispatch({ type: 'SET_USER', payload: null })
      dispatch({ type: 'CLEAR_CART' })
      queryClient.clear()
    },
  })
}

export const useUpdateProfile = () => {
  const { dispatch } = useApp()
  
  return useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user })
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authAPI.forgotPassword,
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authAPI.resetPassword(token, password),
  })
}

// Hook to initialize user on app start
export const useInitializeAuth = () => {
  const { dispatch } = useApp()
  
  return useMutation({
    mutationFn: authAPI.getCurrentUser,
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user })
    },
    onError: () => {
      // Token is invalid, remove it
      localStorage.removeItem('authToken')
    },
  })
}