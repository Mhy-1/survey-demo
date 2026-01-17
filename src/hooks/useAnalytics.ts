/**
 * Analytics hooks using React Query
 * Manages analytics and statistics data fetching
 */

import { useQuery } from '@tanstack/react-query';
import * as analyticsService from '../services/api/analytics.service';

/**
 * Get dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: analyticsService.getDashboardStats,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Get survey analytics
 */
export const useSurveyAnalytics = (surveyId: string) => {
  return useQuery({
    queryKey: ['surveyAnalytics', surveyId],
    queryFn: () => analyticsService.getSurveyAnalytics(surveyId),
    enabled: !!surveyId,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Get client progress
 */
export const useClientProgress = (clientName: string) => {
  return useQuery({
    queryKey: ['clientProgress', clientName],
    queryFn: () => analyticsService.getClientProgress(clientName),
    enabled: !!clientName,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Get all clients
 */
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: analyticsService.getClients,
    staleTime: 300000, // 5 minutes
  });
};
