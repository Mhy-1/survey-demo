/**
 * Survey API Service - DEMO VERSION
 * Uses mock data instead of real backend
 */

import { surveyApi } from '../mockApi';

export interface Survey {
  id: string;
  title: string;
  description?: string;
  survey_type: 'internal' | 'external';
  status: 'draft' | 'active' | 'paused' | 'closed' | 'expired';
  duration_type: 'limited' | 'unlimited';
  start_date?: string;
  end_date?: string;
  client_name?: string;
  admin_id: string;
  admin_name?: string;
  slug: string;
  total_responses: number;
  completed_responses: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  closed_at?: string;
}

export interface CreateSurveyRequest {
  title: string;
  description?: string;
  survey_type?: 'internal' | 'external';
  duration_type?: 'limited' | 'unlimited';
  start_date?: string;
  end_date?: string;
  client_name?: string;
  type?: string; // Alias for survey_type
}

export interface UpdateSurveyRequest {
  title?: string;
  description?: string;
  duration_type?: 'limited' | 'unlimited';
  start_date?: string;
  end_date?: string;
  client_name?: string;
}

export interface SurveyListParams {
  page?: number;
  limit?: number;
  status?: string;
  survey_type?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedSurveys {
  data: Survey[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Get all surveys with pagination and filters
 */
export const getSurveys = async (params?: SurveyListParams): Promise<PaginatedSurveys> => {
  const result = await surveyApi.getSurveys(params);

  // Map to expected format
  return {
    data: result.data.map(s => ({
      ...s,
      slug: s.unique_slug,
    })) as Survey[],
    pagination: result.pagination,
  };
};

/**
 * Get survey by ID
 */
export const getSurveyById = async (id: string): Promise<Survey> => {
  const survey = await surveyApi.getSurveyById(id);
  return {
    ...survey,
    slug: survey.unique_slug,
  } as Survey;
};

/**
 * Get survey by slug
 */
export const getSurveyBySlug = async (slug: string): Promise<Survey> => {
  const survey = await surveyApi.getSurveyBySlug(slug);
  return {
    ...survey,
    slug: survey.unique_slug,
  } as Survey;
};

/**
 * Create new survey
 */
export const createSurvey = async (data: CreateSurveyRequest): Promise<Survey> => {
  const survey = await surveyApi.createSurvey({
    title: data.title,
    description: data.description,
    survey_type: data.survey_type || data.type as any || 'internal',
    duration_type: data.duration_type || 'unlimited',
    start_date: data.start_date,
    end_date: data.end_date,
    client_name: data.client_name,
  });
  return {
    ...survey,
    slug: survey.unique_slug,
  } as Survey;
};

/**
 * Update survey
 */
export const updateSurvey = async (id: string, data: UpdateSurveyRequest): Promise<Survey> => {
  const survey = await surveyApi.updateSurvey(id, data);
  return {
    ...survey,
    slug: survey.unique_slug,
  } as Survey;
};

/**
 * Delete survey
 */
export const deleteSurvey = async (id: string): Promise<void> => {
  await surveyApi.deleteSurvey(id);
};

/**
 * Publish survey
 */
export const publishSurvey = async (id: string): Promise<Survey> => {
  const survey = await surveyApi.publishSurvey(id);
  return {
    ...survey,
    slug: survey.unique_slug,
  } as Survey;
};

/**
 * Pause survey
 */
export const pauseSurvey = async (id: string): Promise<Survey> => {
  const survey = await surveyApi.pauseSurvey(id);
  return {
    ...survey,
    slug: survey.unique_slug,
  } as Survey;
};

/**
 * Close survey
 */
export const closeSurvey = async (id: string): Promise<Survey> => {
  const survey = await surveyApi.closeSurvey(id);
  return {
    ...survey,
    slug: survey.unique_slug,
  } as Survey;
};

/**
 * Duplicate survey
 */
export const duplicateSurvey = async (id: string): Promise<Survey> => {
  const survey = await surveyApi.duplicateSurvey(id);
  return {
    ...survey,
    slug: survey.unique_slug,
  } as Survey;
};

/**
 * Get survey share info (public link, QR code)
 */
export const getSurveyShareInfo = async (id: string): Promise<any> => {
  return surveyApi.getSurveyShareInfo(id);
};

/**
 * Get survey analytics
 */
export const getSurveyAnalytics = async (id: string): Promise<any> => {
  return surveyApi.getSurveyAnalytics(id);
};

export default {
  getSurveys,
  getSurveyById,
  getSurveyBySlug,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  publishSurvey,
  pauseSurvey,
  closeSurvey,
  duplicateSurvey,
  getSurveyShareInfo,
  getSurveyAnalytics,
};
