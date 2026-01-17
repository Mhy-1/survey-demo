/**
 * Mock API Service
 * Replaces backend API calls with mock data for demo purposes
 */

import {
  mockUsers,
  mockSurveys,
  mockQuestions,
  mockResponses,
  mockAnswers,
  mockDashboardStats,
  mockAnalytics,
  mockClients,
  delay,
  validateDemoLogin,
  demoCredentials,
} from '../data/mockData';
import { User, Survey, Question, Response } from '../types';

// ============================================================================
// AUTH MOCK API
// ============================================================================

export const authApi = {
  async login(email: string, password: string) {
    await delay(500);

    const user = validateDemoLogin(email, password);
    if (!user) {
      throw new Error('Invalid email or password. Use demo credentials.');
    }

    return {
      user,
      token: 'demo-token-' + Date.now(),
      refreshToken: 'demo-refresh-' + Date.now(),
    };
  },

  async register(userData: any) {
    await delay(500);
    // In demo mode, just create a mock user
    const newUser: User = {
      id: 'user-' + Date.now(),
      role: 'employee',
      full_name: userData.full_name,
      email: userData.email,
      department: userData.department,
      position: userData.position,
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return {
      user: newUser,
      token: 'demo-token-' + Date.now(),
      refreshToken: 'demo-refresh-' + Date.now(),
    };
  },

  async logout() {
    await delay(200);
    return { success: true };
  },

  async refreshToken() {
    await delay(200);
    return {
      token: 'demo-token-refreshed-' + Date.now(),
      refreshToken: 'demo-refresh-refreshed-' + Date.now(),
    };
  },

  getDemoCredentials() {
    return demoCredentials;
  },
};

// ============================================================================
// SURVEY MOCK API
// ============================================================================

export const surveyApi = {
  async getSurveys(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    survey_type?: string;
  }) {
    await delay(300);

    let filtered = [...mockSurveys];

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(s => s.status === params.status);
    }

    if (params?.survey_type && params.survey_type !== 'all') {
      filtered = filtered.filter(s => s.survey_type === params.survey_type);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchLower) ||
        s.description?.toLowerCase().includes(searchLower) ||
        s.client_name?.toLowerCase().includes(searchLower)
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      data: paginated,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  },

  async getSurveyById(id: string) {
    await delay(200);
    const survey = mockSurveys.find(s => s.id === id);
    if (!survey) {
      throw new Error('Survey not found');
    }
    return survey;
  },

  async getSurveyBySlug(slug: string) {
    await delay(200);
    const survey = mockSurveys.find(s => s.unique_slug === slug);
    if (!survey) {
      throw new Error('Survey not found');
    }
    return survey;
  },

  async createSurvey(data: Partial<Survey>) {
    await delay(400);
    const newSurvey: Survey = {
      id: 'survey-' + Date.now(),
      admin_id: 'user-1',
      title: data.title || 'New Survey',
      description: data.description || '',
      survey_type: data.survey_type || 'internal',
      duration_type: data.duration_type || 'unlimited',
      status: 'draft',
      unique_slug: 'survey-' + Date.now(),
      is_anonymous: false,
      allow_multiple: false,
      requires_auth: false,
      track_ip: false,
      track_location: false,
      allow_editing: false,
      show_progress_bar: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_responses: 0,
      completed_responses: 0,
      total_views: 0,
      ...data,
    } as Survey;

    mockSurveys.unshift(newSurvey);
    return newSurvey;
  },

  async updateSurvey(id: string, data: Partial<Survey>) {
    await delay(300);
    const index = mockSurveys.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Survey not found');
    }

    mockSurveys[index] = {
      ...mockSurveys[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return mockSurveys[index];
  },

  async deleteSurvey(id: string) {
    await delay(300);
    const index = mockSurveys.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Survey not found');
    }
    mockSurveys.splice(index, 1);
    return { success: true };
  },

  async publishSurvey(id: string) {
    await delay(300);
    return this.updateSurvey(id, {
      status: 'active',
      published_at: new Date().toISOString()
    });
  },

  async pauseSurvey(id: string) {
    await delay(300);
    return this.updateSurvey(id, { status: 'paused' });
  },

  async closeSurvey(id: string) {
    await delay(300);
    return this.updateSurvey(id, {
      status: 'closed',
      closed_at: new Date().toISOString()
    });
  },

  async duplicateSurvey(id: string) {
    await delay(400);
    const original = mockSurveys.find(s => s.id === id);
    if (!original) {
      throw new Error('Survey not found');
    }

    const copy: Survey = {
      ...original,
      id: 'survey-' + Date.now(),
      title: original.title + ' (Copy)',
      unique_slug: original.unique_slug + '-copy-' + Date.now(),
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: undefined,
      closed_at: undefined,
      total_responses: 0,
      completed_responses: 0,
      total_views: 0,
    };

    mockSurveys.unshift(copy);
    return copy;
  },

  async getSurveyShareInfo(id: string) {
    await delay(200);
    const survey = mockSurveys.find(s => s.id === id);
    if (!survey) {
      throw new Error('Survey not found');
    }

    return {
      publicUrl: `https://survey.lab.mdajam.com/survey/${survey.unique_slug}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://survey.lab.mdajam.com/survey/${survey.unique_slug}`,
      embedCode: `<iframe src="https://survey.lab.mdajam.com/survey/${survey.unique_slug}" width="100%" height="600"></iframe>`,
    };
  },

  async getSurveyAnalytics(id: string) {
    await delay(300);
    const analytics = mockAnalytics[id as keyof typeof mockAnalytics];
    if (!analytics) {
      // Return default analytics structure
      return {
        summary: {
          totalResponses: 0,
          completedResponses: 0,
          completionRate: 0,
          averageTime: 0,
        },
        questionBreakdown: {},
        trends: { daily: [] },
      };
    }
    return analytics;
  },
};

// ============================================================================
// QUESTIONS MOCK API
// ============================================================================

export const questionApi = {
  async getQuestions(surveyId: string) {
    await delay(200);
    return mockQuestions[surveyId] || [];
  },

  async createQuestion(surveyId: string, data: Partial<Question>) {
    await delay(300);
    const questions = mockQuestions[surveyId] || [];
    const newQuestion: Question = {
      id: 'q-' + Date.now(),
      survey_id: surveyId,
      question_type: data.question_type || 'text',
      question_text: data.question_text || 'New Question',
      is_required: data.is_required || false,
      order_index: questions.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    } as Question;

    if (!mockQuestions[surveyId]) {
      mockQuestions[surveyId] = [];
    }
    mockQuestions[surveyId].push(newQuestion);

    return newQuestion;
  },

  async updateQuestion(questionId: string, data: Partial<Question>) {
    await delay(300);
    for (const surveyId in mockQuestions) {
      const index = mockQuestions[surveyId].findIndex(q => q.id === questionId);
      if (index !== -1) {
        mockQuestions[surveyId][index] = {
          ...mockQuestions[surveyId][index],
          ...data,
          updated_at: new Date().toISOString(),
        };
        return mockQuestions[surveyId][index];
      }
    }
    throw new Error('Question not found');
  },

  async deleteQuestion(questionId: string) {
    await delay(300);
    for (const surveyId in mockQuestions) {
      const index = mockQuestions[surveyId].findIndex(q => q.id === questionId);
      if (index !== -1) {
        mockQuestions[surveyId].splice(index, 1);
        return { success: true };
      }
    }
    throw new Error('Question not found');
  },

  async reorderQuestions(surveyId: string, questionIds: string[]) {
    await delay(300);
    const questions = mockQuestions[surveyId];
    if (!questions) {
      throw new Error('Survey not found');
    }

    questionIds.forEach((id, index) => {
      const q = questions.find(q => q.id === id);
      if (q) {
        q.order_index = index + 1;
      }
    });

    return questions.sort((a, b) => a.order_index - b.order_index);
  },
};

// ============================================================================
// RESPONSES MOCK API
// ============================================================================

export const responseApi = {
  async getResponses(surveyId?: string) {
    await delay(300);
    if (surveyId) {
      return mockResponses.filter(r => r.survey_id === surveyId);
    }
    return mockResponses;
  },

  async getResponseById(responseId: string) {
    await delay(200);
    const response = mockResponses.find(r => r.id === responseId);
    if (!response) {
      throw new Error('Response not found');
    }
    return {
      ...response,
      answers: mockAnswers.filter(a => a.response_id === responseId),
    };
  },

  async submitResponse(surveyId: string, answers: any[]) {
    await delay(500);
    const newResponse: Response = {
      id: 'resp-' + Date.now(),
      survey_id: surveyId,
      status: 'completed',
      device_type: 'desktop',
      browser: 'Chrome',
      os: navigator.platform || 'Unknown',
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      duration_seconds: 300,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockResponses.push(newResponse);

    // Update survey response counts
    const survey = mockSurveys.find(s => s.id === surveyId);
    if (survey) {
      survey.total_responses++;
      survey.completed_responses++;
    }

    return newResponse;
  },

  async deleteResponse(responseId: string) {
    await delay(300);
    const index = mockResponses.findIndex(r => r.id === responseId);
    if (index === -1) {
      throw new Error('Response not found');
    }
    mockResponses.splice(index, 1);
    return { success: true };
  },
};

// ============================================================================
// ANALYTICS MOCK API
// ============================================================================

export const analyticsApi = {
  async getDashboardStats() {
    await delay(300);
    return { data: mockDashboardStats };
  },

  async getSurveyAnalytics(surveyId: string) {
    await delay(300);
    return surveyApi.getSurveyAnalytics(surveyId);
  },

  async getGlobalAnalytics() {
    await delay(400);
    return {
      totalSurveys: mockSurveys.length,
      activeSurveys: mockSurveys.filter(s => s.status === 'active').length,
      totalResponses: mockSurveys.reduce((sum, s) => sum + s.total_responses, 0),
      completionRate: 85.2,
      averageNps: 42,
      trendsData: [
        { month: 'Jul', surveys: 3, responses: 145 },
        { month: 'Aug', surveys: 4, responses: 189 },
        { month: 'Sep', surveys: 2, responses: 98 },
        { month: 'Oct', surveys: 5, responses: 267 },
        { month: 'Nov', surveys: 3, responses: 178 },
        { month: 'Dec', surveys: 4, responses: 201 },
      ],
    };
  },
};

// ============================================================================
// USER MOCK API
// ============================================================================

export const userApi = {
  async getUsers() {
    await delay(300);
    return mockUsers;
  },

  async getUserById(id: string) {
    await delay(200);
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async updateUser(id: string, data: Partial<User>) {
    await delay(300);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return mockUsers[index];
  },

  async deleteUser(id: string) {
    await delay(300);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(index, 1);
    return { success: true };
  },
};

// ============================================================================
// CLIENT MOCK API
// ============================================================================

export const clientApi = {
  async getClients() {
    await delay(300);
    return mockClients;
  },

  async getClientById(id: string) {
    await delay(200);
    const client = mockClients.find(c => c.id === id);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  },
};

// ============================================================================
// EXPORT MOCK API
// ============================================================================

export const exportApi = {
  async exportCSV(surveyIds: string[]) {
    await delay(500);
    // Generate mock CSV data
    const csvContent = surveyIds.map(id => {
      const survey = mockSurveys.find(s => s.id === id);
      return survey ? `"${survey.title}","${survey.status}","${survey.total_responses}"` : '';
    }).join('\n');

    const blob = new Blob([`Title,Status,Responses\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surveys-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true };
  },

  async exportExcel(surveyIds: string[]) {
    await delay(700);
    // In demo mode, just download CSV (actual Excel would need a library)
    return this.exportCSV(surveyIds);
  },

  async exportPDF(surveyIds: string[]) {
    await delay(800);
    // Mock PDF export
    console.log('PDF export for surveys:', surveyIds);
    return { success: true, message: 'PDF export would be implemented with a PDF library' };
  },
};
