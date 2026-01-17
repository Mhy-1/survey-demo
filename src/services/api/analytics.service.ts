/**
 * Analytics API Service - DEMO VERSION
 * Uses mock data instead of real backend
 */

import { analyticsApi, clientApi } from '../mockApi';

export interface DashboardStats {
  total_surveys: number;
  active_surveys: number;
  draft_surveys: number;
  closed_surveys: number;
  internal_surveys: number;
  external_surveys: number;
  total_responses: number;
  completed_responses: number;
  total_users?: number;
  total_employees?: number;
  completion_rate?: number;
  surveys_this_month?: number;
  surveys_last_month?: number;
  total_clients?: number;
}

export interface SurveyAnalytics {
  survey_id: string;
  survey_title: string;
  total_responses: number;
  completed_responses: number;
  completion_rate: number;
  average_completion_time?: number;
  response_by_date: Array<{
    date: string;
    count: number;
  }>;
  question_stats?: Array<{
    question_id: string;
    question_text: string;
    question_type: string;
    total_answers: number;
    answer_distribution?: any;
  }>;
}

export interface ClientProgress {
  client_name: string;
  total_surveys: number;
  active_surveys: number;
  total_responses: number;
  completion_rate: number;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<{ data: DashboardStats }> => {
  const result = await analyticsApi.getDashboardStats();
  return {
    data: {
      ...result.data,
      draft_surveys: 2,
      closed_surveys: 7,
      internal_surveys: 8,
      external_surveys: 4,
      total_users: 156,
      total_employees: 152,
      completion_rate: 85,
      surveys_this_month: 4,
      surveys_last_month: 3,
      total_clients: 5,
    },
  };
};

/**
 * Get survey analytics
 */
export const getSurveyAnalytics = async (surveyId: string): Promise<SurveyAnalytics> => {
  const analytics = await analyticsApi.getSurveyAnalytics(surveyId);
  return {
    survey_id: surveyId,
    survey_title: 'Survey Analytics',
    total_responses: analytics?.summary?.totalResponses || 0,
    completed_responses: analytics?.summary?.completedResponses || 0,
    completion_rate: analytics?.summary?.completionRate || 0,
    average_completion_time: analytics?.summary?.averageTime,
    response_by_date: analytics?.trends?.daily || [],
    question_stats: Object.entries(analytics?.questionBreakdown || {}).map(([id, data]: [string, any]) => ({
      question_id: id,
      question_text: data.question || '',
      question_type: data.type || 'text',
      total_answers: data.responses || 0,
      answer_distribution: data.distribution,
    })),
  };
};

/**
 * Get client progress
 */
export const getClientProgress = async (clientName: string): Promise<ClientProgress> => {
  const clients = await clientApi.getClients();
  const client = clients.find(c => c.name === clientName);

  return {
    client_name: clientName,
    total_surveys: client?.totalSurveys || 0,
    active_surveys: 1,
    total_responses: client?.totalResponses || 0,
    completion_rate: 85,
  };
};

/**
 * Get all clients
 */
export const getClients = async (): Promise<Array<{ client_name: string; survey_count: number }>> => {
  const clients = await clientApi.getClients();
  return clients.map(c => ({
    client_name: c.name,
    survey_count: c.totalSurveys,
  }));
};

export default {
  getDashboardStats,
  getSurveyAnalytics,
  getClientProgress,
  getClients,
};
