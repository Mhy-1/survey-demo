/**
 * Response hooks using React Query
 * Manages response data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as responseService from '../services/api/response.service';
import toast from 'react-hot-toast';

/**
 * Get responses for a survey
 */
export const useSurveyResponses = (
  surveyId: string,
  params?: responseService.ResponseListParams
) => {
  return useQuery({
    queryKey: ['responses', surveyId, params],
    queryFn: () => responseService.getSurveyResponses(surveyId, params),
    enabled: !!surveyId,
  });
};

/**
 * Get response by ID
 */
export const useResponse = (responseId: string) => {
  return useQuery({
    queryKey: ['response', responseId],
    queryFn: () => responseService.getResponseById(responseId),
    enabled: !!responseId,
  });
};

/**
 * Submit response mutation
 */
export const useSubmitResponse = () => {
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: responseService.SubmitResponseRequest }) =>
      responseService.submitResponse(slug, data),
    onSuccess: () => {
      toast.success('تم إرسال الاستطلاع بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل إرسال الاستطلاع';
      toast.error(message);
    },
  });
};

/**
 * Delete response mutation
 */
export const useDeleteResponse = (surveyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: responseService.deleteResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responses', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم حذف الرد بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل حذف الرد';
      toast.error(message);
    },
  });
};

/**
 * Bulk delete responses mutation
 */
export const useBulkDeleteResponses = (surveyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: responseService.bulkDeleteResponses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responses', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم حذف الردود بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل حذف الردود';
      toast.error(message);
    },
  });
};
