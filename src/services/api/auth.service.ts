/**
 * Authentication API Service - DEMO VERSION
 * Uses mock data instead of real backend
 */

import { authApi } from '../mockApi';
import { User } from '../../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  department: string;
  position?: string;
  phone?: string;
  employee_id?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const result = await authApi.login(credentials.email, credentials.password);

  // Store tokens in localStorage for demo
  localStorage.setItem('accessToken', result.token);
  localStorage.setItem('refreshToken', result.refreshToken);

  return result;
};

/**
 * Register new user
 */
export const register = async (userData: RegisterRequest): Promise<LoginResponse> => {
  const result = await authApi.register(userData);

  // Store tokens in localStorage for demo
  localStorage.setItem('accessToken', result.token);
  localStorage.setItem('refreshToken', result.refreshToken);

  return result;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await authApi.logout();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * Request password reset (demo - just logs)
 */
export const forgotPassword = async (_data: ForgotPasswordRequest): Promise<void> => {
  console.log('Password reset requested (demo mode)');
  await new Promise(resolve => setTimeout(resolve, 500));
};

/**
 * Reset password with token (demo - just logs)
 */
export const resetPassword = async (_data: ResetPasswordRequest): Promise<void> => {
  console.log('Password reset (demo mode)');
  await new Promise(resolve => setTimeout(resolve, 500));
};

/**
 * Change password (demo - just logs)
 */
export const changePassword = async (_data: ChangePasswordRequest): Promise<void> => {
  console.log('Password changed (demo mode)');
  await new Promise(resolve => setTimeout(resolve, 500));
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (_refreshToken: string): Promise<LoginResponse> => {
  const result = await authApi.refreshToken();

  localStorage.setItem('accessToken', result.token);
  localStorage.setItem('refreshToken', result.refreshToken);

  // Return a mock user for demo
  const storedAuth = localStorage.getItem('auth-storage');
  const userData = storedAuth ? JSON.parse(storedAuth).state.user : null;

  return {
    user: userData,
    token: result.token,
    refreshToken: result.refreshToken,
  };
};

/**
 * Get demo credentials for display
 */
export const getDemoCredentials = () => {
  return authApi.getDemoCredentials();
};

export default {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshAccessToken,
  getDemoCredentials,
};
