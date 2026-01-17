/**
 * Question hooks using React Query
 * Manages question data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as questionService from '../services/api/question.service';
import toast from 'react-hot-toast';

/**
 * Get all questions for a survey
 */
export const useQuestions = (surveyId: string) => {
  return useQuery({
    queryKey: ['questions', surveyId],
    queryFn: () => questionService.getQuestions(surveyId),
    enabled: !!surveyId,
  });
};

/**
 * Create question mutation
 */
export const useCreateQuestion = (surveyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: questionService.CreateQuestionRequest) =>
      questionService.createQuestion(surveyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم إضافة السؤال بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل إضافة السؤال';
      toast.error(message);
    },
  });
};

/**
 * Update question mutation
 */
export const useUpdateQuestion = (surveyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: questionService.UpdateQuestionRequest }) =>
      questionService.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم تحديث السؤال بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل تحديث السؤال';
      toast.error(message);
    },
  });
};

/**
 * Delete question mutation
 */
export const useDeleteQuestion = (surveyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionService.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم حذف السؤال بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل حذف السؤال';
      toast.error(message);
    },
  });
};

/**
 * Reorder questions mutation
 */
export const useReorderQuestions = (surveyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: questionService.ReorderQuestionsRequest) =>
      questionService.reorderQuestions(surveyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      toast.success('تم إعادة ترتيب الأسئلة بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل إعادة ترتيب الأسئلة';
      toast.error(message);
    },
  });
};
