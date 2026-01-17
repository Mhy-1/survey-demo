/**
 * User API Service - DEMO VERSION
 * Uses mock data instead of real backend
 */

import { userApi } from '../mockApi';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  client_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  department?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  email?: string;
  role?: 'admin' | 'manager' | 'employee';
  department?: string;
  client_name?: string;
  is_active?: boolean;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
  client_name?: string;
  search?: string;
}

export interface PaginatedUsers {
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  // Get user from localStorage
  const storedAuth = localStorage.getItem('auth-storage');
  if (storedAuth) {
    const authData = JSON.parse(storedAuth);
    if (authData.state.user) {
      return authData.state.user as User;
    }
  }
  throw new Error('User not found');
};

/**
 * Update current user profile
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const storedAuth = localStorage.getItem('auth-storage');
  if (storedAuth) {
    const authData = JSON.parse(storedAuth);
    if (authData.state.user) {
      const updatedUser = { ...authData.state.user, ...data };
      authData.state.user = updatedUser;
      localStorage.setItem('auth-storage', JSON.stringify(authData));
      return updatedUser as User;
    }
  }
  throw new Error('User not found');
};

/**
 * Get all users (Admin only)
 */
export const getUsers = async (params?: UserListParams): Promise<PaginatedUsers> => {
  const users = await userApi.getUsers();

  let filtered = [...users];

  if (params?.role) {
    filtered = filtered.filter(u => u.role === params.role);
  }

  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(u =>
      u.full_name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
    );
  }

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    data: paginated as User[],
    pagination: {
      total: filtered.length,
      page,
      limit,
      total_pages: Math.ceil(filtered.length / limit),
    },
  };
};

/**
 * Get user by ID (Admin only)
 */
export const getUserById = async (id: string): Promise<User> => {
  return userApi.getUserById(id) as Promise<User>;
};

/**
 * Update user (Admin only)
 */
export const updateUser = async (id: string, data: UpdateUserRequest): Promise<User> => {
  return userApi.updateUser(id, data) as Promise<User>;
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (id: string): Promise<void> => {
  await userApi.deleteUser(id);
};

/**
 * Activate user (Admin only)
 */
export const activateUser = async (id: string): Promise<User> => {
  return userApi.updateUser(id, { is_active: true }) as Promise<User>;
};

/**
 * Deactivate user (Admin only)
 */
export const deactivateUser = async (id: string): Promise<User> => {
  return userApi.updateUser(id, { is_active: false }) as Promise<User>;
};

export default {
  getCurrentUser,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
};
