/**
 * User hooks using React Query
 * Manages user data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userService from '../services/api/user.service';
import toast from 'react-hot-toast';

/**
 * Get current user profile
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getCurrentUser,
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Update current user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('تم تحديث الملف الشخصي بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل تحديث الملف الشخصي';
      toast.error(message);
    },
  });
};

/**
 * Get all users (Admin only)
 */
export const useUsers = (params?: userService.UserListParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Get user by ID (Admin only)
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Update user mutation (Admin only)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: userService.UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast.success('تم تحديث المستخدم بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل تحديث المستخدم';
      toast.error(message);
    },
  });
};

/**
 * Delete user mutation (Admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('تم حذف المستخدم بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل حذف المستخدم';
      toast.error(message);
    },
  });
};

/**
 * Activate user mutation (Admin only)
 */
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.activateUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      toast.success('تم تفعيل المستخدم بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل تفعيل المستخدم';
      toast.error(message);
    },
  });
};

/**
 * Deactivate user mutation (Admin only)
 */
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deactivateUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      toast.success('تم إلغاء تفعيل المستخدم بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل إلغاء تفعيل المستخدم';
      toast.error(message);
    },
  });
};
