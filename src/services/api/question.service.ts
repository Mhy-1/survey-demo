/**
 * Question API Service - DEMO VERSION
 * Uses mock data instead of real backend
 */

import { questionApi } from '../mockApi';

export interface Question {
  id: string;
  survey_id: string;
  question_type: string;
  question_text: string;
  description?: string;
  is_required: boolean;
  order_index: number;
  options?: any;
  validation_rules?: any;
  conditional_logic?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionRequest {
  question_type: string;
  question_text: string;
  description?: string;
  is_required?: boolean;
  order_index: number;
  options?: any;
  validation_rules?: any;
  conditional_logic?: any;
}

export interface UpdateQuestionRequest {
  question_type?: string;
  question_text?: string;
  description?: string;
  is_required?: boolean;
  order_index?: number;
  options?: any;
  validation_rules?: any;
  conditional_logic?: any;
}

export interface ReorderQuestionsRequest {
  question_orders: Array<{ id: string; order_index: number }>;
}

/**
 * Get all questions for a survey
 */
export const getQuestions = async (surveyId: string): Promise<Question[]> => {
  return questionApi.getQuestions(surveyId);
};

/**
 * Create new question
 */
export const createQuestion = async (
  surveyId: string,
  data: CreateQuestionRequest
): Promise<Question> => {
  return questionApi.createQuestion(surveyId, data);
};

/**
 * Update question
 */
export const updateQuestion = async (
  questionId: string,
  data: UpdateQuestionRequest
): Promise<Question> => {
  return questionApi.updateQuestion(questionId, data);
};

/**
 * Delete question
 */
export const deleteQuestion = async (questionId: string): Promise<void> => {
  await questionApi.deleteQuestion(questionId);
};

/**
 * Reorder questions
 */
export const reorderQuestions = async (
  surveyId: string,
  data: ReorderQuestionsRequest
): Promise<void> => {
  const questionIds = data.question_orders
    .sort((a, b) => a.order_index - b.order_index)
    .map(q => q.id);
  await questionApi.reorderQuestions(surveyId, questionIds);
};

export default {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
};
