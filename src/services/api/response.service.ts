/**
 * Response API Service - DEMO VERSION
 * Uses mock data instead of real backend
 */

import { responseApi, surveyApi } from '../mockApi';

export interface Response {
  id: string;
  survey_id: string;
  employee_id?: string;
  employee_name?: string;
  employee_email?: string;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  response_id: string;
  question_id: string;
  question_text?: string;
  question_type?: string;
  answer_text?: string;
  answer_number?: number;
  answer_boolean?: boolean;
  answer_array?: any[];
  created_at: string;
}

export interface SubmitResponseRequest {
  answers: Array<{
    question_id: string;
    answer_text?: string;
    answer_number?: number;
    answer_boolean?: boolean;
    answer_array?: any[];
  }>;
}

export interface ResponseListParams {
  page?: number;
  limit?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export interface PaginatedResponses {
  data: Response[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Get responses for a survey
 */
export const getSurveyResponses = async (
  surveyId: string,
  params?: ResponseListParams
): Promise<PaginatedResponses> => {
  const responses = await responseApi.getResponses(surveyId);

  let filtered = [...responses];

  if (params?.status) {
    filtered = filtered.filter(r => r.status === params.status);
  }

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    data: paginated as Response[],
    pagination: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
};

/**
 * Get response by ID with answers
 */
export const getResponseById = async (responseId: string): Promise<Response> => {
  return responseApi.getResponseById(responseId) as Promise<Response>;
};

/**
 * Submit response (public or employee)
 */
export const submitResponse = async (
  surveySlug: string,
  data: SubmitResponseRequest
): Promise<Response> => {
  // Find the survey by slug first
  const survey = await surveyApi.getSurveyBySlug(surveySlug);
  return responseApi.submitResponse(survey.id, data.answers) as Promise<Response>;
};

/**
 * Delete response
 */
export const deleteResponse = async (responseId: string): Promise<void> => {
  await responseApi.deleteResponse(responseId);
};

/**
 * Bulk delete responses
 */
export const bulkDeleteResponses = async (responseIds: string[]): Promise<void> => {
  // Delete one by one for demo
  for (const id of responseIds) {
    await responseApi.deleteResponse(id);
  }
};

export default {
  getSurveyResponses,
  getResponseById,
  submitResponse,
  deleteResponse,
  bulkDeleteResponses,
};
