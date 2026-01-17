/**
 * Survey hooks using React Query
 * Manages survey data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as surveyService from '../services/api/survey.service';
import toast from 'react-hot-toast';

/**
 * Get all surveys with pagination
 */
export const useSurveys = (params?: surveyService.SurveyListParams) => {
  return useQuery({
    queryKey: ['surveys', params],
    queryFn: () => surveyService.getSurveys(params),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};

/**
 * Get survey by ID
 */
export const useSurvey = (id: string) => {
  return useQuery({
    queryKey: ['survey', id],
    queryFn: () => surveyService.getSurveyById(id),
    enabled: !!id,
  });
};

/**
 * Create survey mutation
 */
export const useCreateSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: surveyService.createSurvey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('تم إنشاء الاستطلاع بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل إنشاء الاستطلاع';
      toast.error(message);
    },
  });
};

/**
 * Update survey mutation
 */
export const useUpdateSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: surveyService.UpdateSurveyRequest }) =>
      surveyService.updateSurvey(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey', variables.id] });
      toast.success('تم تحديث الاستطلاع بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل تحديث الاستطلاع';
      toast.error(message);
    },
  });
};

/**
 * Delete survey mutation
 */
export const useDeleteSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: surveyService.deleteSurvey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('تم حذف الاستطلاع بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل حذف الاستطلاع';
      toast.error(message);
    },
  });
};

/**
 * Publish survey mutation
 */
export const usePublishSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: surveyService.publishSurvey,
    onSuccess: (_, surveyId) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم نشر الاستطلاع بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل نشر الاستطلاع';
      toast.error(message);
    },
  });
};

/**
 * Pause survey mutation
 */
export const usePauseSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: surveyService.pauseSurvey,
    onSuccess: (_, surveyId) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم إيقاف الاستطلاع مؤقتاً');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل إيقاف الاستطلاع';
      toast.error(message);
    },
  });
};

/**
 * Close survey mutation
 */
export const useCloseSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: surveyService.closeSurvey,
    onSuccess: (_, surveyId) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم إغلاق الاستطلاع بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل إغلاق الاستطلاع';
      toast.error(message);
    },
  });
};

/**
 * Duplicate survey mutation
 */
export const useDuplicateSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: surveyService.duplicateSurvey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('تم نسخ الاستطلاع بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل نسخ الاستطلاع';
      toast.error(message);
    },
  });
};

/**
 * Get survey share info
 */
export const useSurveyShareInfo = (id: string) => {
  return useQuery({
    queryKey: ['survey-share', id],
    queryFn: () => surveyService.getSurveyShareInfo(id),
    enabled: !!id,
  });
};

/**
 * Get survey analytics
 */
export const useSurveyAnalytics = (id: string) => {
  return useQuery({
    queryKey: ['survey-analytics', id],
    queryFn: () => surveyService.getSurveyAnalytics(id),
    enabled: !!id,
  });
};
