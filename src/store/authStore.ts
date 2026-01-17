import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'
import * as authService from '../services/api/auth.service'
import { setTokens, clearTokens } from '../lib/api-client'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: authService.RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
  setToken: (token: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUser: (user: Partial<User>) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })

          const { user, token, refreshToken } = await authService.login({ email, password })

          setTokens(token, refreshToken)
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Login failed. Please try again.'
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null
          })
          throw error
        }
      },

      register: async (userData: authService.RegisterRequest) => {
        try {
          set({ isLoading: true, error: null })

          const { user, token, refreshToken } = await authService.register(userData)

          setTokens(token, refreshToken)
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.'
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null
          })
          throw error
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })
          await authService.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          clearTokens()
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setToken: (token: string, refreshToken: string) => {
        setTokens(token, refreshToken)
        set({ token, refreshToken })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)

// Helper functions for role checking
export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role
}

export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  return user ? roles.includes(user.role) : false
}

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin')
}

export const isManager = (user: User | null): boolean => {
  return hasRole(user, 'manager')
}

export const isEmployee = (user: User | null): boolean => {
  return hasRole(user, 'employee')
}

export const canManageSurveys = (user: User | null): boolean => {
  return hasAnyRole(user, ['admin', 'manager'])
}

export const canViewAllData = (user: User | null): boolean => {
  return hasRole(user, 'admin')
}

export const canManageUsers = (user: User | null): boolean => {
  return hasRole(user, 'admin')
}

export const canExportExcel = (user: User | null): boolean => {
  return hasRole(user, 'admin')
}
