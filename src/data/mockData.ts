/**
 * Mock Data for Survey Demo
 * Contains sample surveys, responses, users, and analytics data
 */

import { User, Survey, Question, Response, Answer, DashboardStats } from '../types';

// ============================================================================
// USERS
// ============================================================================
export const mockUsers: User[] = [
  {
    id: 'user-1',
    role: 'admin',
    full_name: 'Ahmed Al-Rashid',
    email: 'admin@amsteel.demo',
    phone: '+966-50-123-4567',
    employee_id: 'EMP001',
    department: 'Management',
    position: 'System Administrator',
    is_active: true,
    email_verified: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-12-01T10:30:00Z',
    last_login_at: '2024-12-15T09:00:00Z',
  },
  {
    id: 'user-2',
    role: 'employee',
    full_name: 'Sarah Johnson',
    email: 'sarah@amsteel.demo',
    phone: '+966-50-234-5678',
    employee_id: 'EMP002',
    department: 'Engineering',
    position: 'Senior Engineer',
    is_active: true,
    email_verified: true,
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-11-15T14:20:00Z',
    last_login_at: '2024-12-14T11:30:00Z',
  },
  {
    id: 'user-3',
    role: 'employee',
    full_name: 'Mohammed Al-Salem',
    email: 'mohammed@amsteel.demo',
    department: 'Operations',
    position: 'Operations Manager',
    is_active: true,
    email_verified: true,
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-10-20T16:45:00Z',
  },
  {
    id: 'user-4',
    role: 'employee',
    full_name: 'Fatima Hassan',
    email: 'fatima@amsteel.demo',
    department: 'HR',
    position: 'HR Specialist',
    is_active: true,
    email_verified: true,
    created_at: '2024-04-05T11:00:00Z',
    updated_at: '2024-09-30T09:15:00Z',
  },
];

// Demo credentials for login
export const demoCredentials = {
  admin: { email: 'admin@amsteel.demo', password: 'demo123' },
  employee: { email: 'sarah@amsteel.demo', password: 'demo123' },
};

// ============================================================================
// SURVEYS
// ============================================================================
export const mockSurveys: Survey[] = [
  {
    id: 'survey-1',
    admin_id: 'user-1',
    title: 'Employee Satisfaction Survey 2024',
    description: 'Annual employee satisfaction survey to measure workplace happiness and engagement',
    welcome_message: 'Thank you for taking the time to complete this survey. Your feedback is valuable!',
    thank_you_message: 'Thank you for completing the survey. Your responses have been recorded.',
    survey_type: 'internal',
    target_department: 'All',
    duration_type: 'limited',
    start_date: '2024-12-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    status: 'active',
    unique_slug: 'employee-satisfaction-2024',
    is_anonymous: true,
    allow_multiple: false,
    requires_auth: true,
    track_ip: false,
    track_location: false,
    allow_editing: false,
    show_progress_bar: true,
    created_at: '2024-11-15T10:00:00Z',
    updated_at: '2024-12-01T08:00:00Z',
    published_at: '2024-12-01T08:00:00Z',
    total_responses: 87,
    completed_responses: 72,
    total_views: 156,
  },
  {
    id: 'survey-2',
    admin_id: 'user-1',
    title: 'Customer Feedback - Project Alpha',
    description: 'Gathering feedback from Project Alpha stakeholders about service quality',
    welcome_message: 'We value your partnership. Please share your thoughts about our service.',
    thank_you_message: 'Thank you for your valuable feedback!',
    survey_type: 'external',
    client_name: 'ACME Corporation',
    client_company: 'ACME Corp',
    duration_type: 'unlimited',
    status: 'active',
    unique_slug: 'customer-feedback-alpha',
    is_anonymous: false,
    allow_multiple: false,
    requires_auth: false,
    track_ip: true,
    track_location: false,
    allow_editing: true,
    show_progress_bar: true,
    created_at: '2024-10-20T14:00:00Z',
    updated_at: '2024-12-10T16:30:00Z',
    published_at: '2024-10-25T09:00:00Z',
    total_responses: 45,
    completed_responses: 41,
    total_views: 89,
  },
  {
    id: 'survey-3',
    admin_id: 'user-1',
    title: 'Safety Training Evaluation',
    description: 'Evaluate the effectiveness of the recent safety training program',
    survey_type: 'internal',
    target_department: 'Operations',
    duration_type: 'limited',
    start_date: '2024-11-01T00:00:00Z',
    end_date: '2024-11-30T23:59:59Z',
    status: 'closed',
    unique_slug: 'safety-training-eval',
    is_anonymous: true,
    allow_multiple: false,
    requires_auth: true,
    track_ip: false,
    track_location: false,
    allow_editing: false,
    show_progress_bar: true,
    created_at: '2024-10-15T09:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    published_at: '2024-11-01T00:00:00Z',
    closed_at: '2024-12-01T00:00:00Z',
    total_responses: 124,
    completed_responses: 118,
    total_views: 145,
  },
  {
    id: 'survey-4',
    admin_id: 'user-1',
    title: 'New Product Launch Feedback',
    description: 'Collect customer feedback on our new steel product line',
    survey_type: 'external',
    client_name: 'Global Construction Ltd',
    duration_type: 'unlimited',
    status: 'draft',
    unique_slug: 'new-product-feedback',
    is_anonymous: false,
    allow_multiple: true,
    requires_auth: false,
    track_ip: true,
    track_location: true,
    allow_editing: true,
    show_progress_bar: true,
    created_at: '2024-12-10T11:00:00Z',
    updated_at: '2024-12-12T15:00:00Z',
    total_responses: 0,
    completed_responses: 0,
    total_views: 12,
  },
  {
    id: 'survey-5',
    admin_id: 'user-1',
    title: 'Quarterly Performance Review',
    description: 'Q4 2024 performance review feedback collection',
    survey_type: 'internal',
    target_department: 'All',
    duration_type: 'limited',
    start_date: '2024-12-15T00:00:00Z',
    end_date: '2024-12-30T23:59:59Z',
    status: 'active',
    unique_slug: 'q4-performance-review',
    is_anonymous: false,
    allow_multiple: false,
    requires_auth: true,
    track_ip: false,
    track_location: false,
    allow_editing: false,
    show_progress_bar: true,
    created_at: '2024-12-01T08:00:00Z',
    updated_at: '2024-12-15T09:00:00Z',
    published_at: '2024-12-15T09:00:00Z',
    total_responses: 23,
    completed_responses: 19,
    total_views: 67,
  },
];

// ============================================================================
// QUESTIONS
// ============================================================================
export const mockQuestions: Record<string, Question[]> = {
  'survey-1': [
    {
      id: 'q1-1',
      survey_id: 'survey-1',
      question_type: 'rating_scale',
      question_text: 'How satisfied are you with your overall job?',
      description: 'Rate from 1 (Very Dissatisfied) to 5 (Very Satisfied)',
      is_required: true,
      order_index: 1,
      options: { min: 1, max: 5, labels: { 1: 'Very Dissatisfied', 5: 'Very Satisfied' } },
      created_at: '2024-11-15T10:00:00Z',
      updated_at: '2024-11-15T10:00:00Z',
    },
    {
      id: 'q1-2',
      survey_id: 'survey-1',
      question_type: 'single_choice',
      question_text: 'How would you rate your work-life balance?',
      is_required: true,
      order_index: 2,
      options: { choices: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] },
      created_at: '2024-11-15T10:00:00Z',
      updated_at: '2024-11-15T10:00:00Z',
    },
    {
      id: 'q1-3',
      survey_id: 'survey-1',
      question_type: 'multiple_choice',
      question_text: 'Which benefits do you value most? (Select all that apply)',
      is_required: true,
      order_index: 3,
      options: { choices: ['Health Insurance', 'Retirement Plan', 'Paid Time Off', 'Training Opportunities', 'Flexible Hours', 'Remote Work Options'] },
      created_at: '2024-11-15T10:00:00Z',
      updated_at: '2024-11-15T10:00:00Z',
    },
    {
      id: 'q1-4',
      survey_id: 'survey-1',
      question_type: 'nps',
      question_text: 'How likely are you to recommend our company as a great place to work?',
      description: '0 = Not at all likely, 10 = Extremely likely',
      is_required: true,
      order_index: 4,
      created_at: '2024-11-15T10:00:00Z',
      updated_at: '2024-11-15T10:00:00Z',
    },
    {
      id: 'q1-5',
      survey_id: 'survey-1',
      question_type: 'textarea',
      question_text: 'What suggestions do you have for improving the workplace?',
      is_required: false,
      order_index: 5,
      validation_rules: { maxLength: 1000 },
      created_at: '2024-11-15T10:00:00Z',
      updated_at: '2024-11-15T10:00:00Z',
    },
  ],
  'survey-2': [
    {
      id: 'q2-1',
      survey_id: 'survey-2',
      question_type: 'rating',
      question_text: 'How would you rate the quality of our products?',
      is_required: true,
      order_index: 1,
      options: { maxRating: 5 },
      created_at: '2024-10-20T14:00:00Z',
      updated_at: '2024-10-20T14:00:00Z',
    },
    {
      id: 'q2-2',
      survey_id: 'survey-2',
      question_type: 'rating',
      question_text: 'How would you rate our customer service?',
      is_required: true,
      order_index: 2,
      options: { maxRating: 5 },
      created_at: '2024-10-20T14:00:00Z',
      updated_at: '2024-10-20T14:00:00Z',
    },
    {
      id: 'q2-3',
      survey_id: 'survey-2',
      question_type: 'yes_no',
      question_text: 'Would you recommend our services to others?',
      is_required: true,
      order_index: 3,
      created_at: '2024-10-20T14:00:00Z',
      updated_at: '2024-10-20T14:00:00Z',
    },
    {
      id: 'q2-4',
      survey_id: 'survey-2',
      question_type: 'textarea',
      question_text: 'Please share any additional feedback about your experience with us.',
      is_required: false,
      order_index: 4,
      created_at: '2024-10-20T14:00:00Z',
      updated_at: '2024-10-20T14:00:00Z',
    },
  ],
  'survey-5': [
    {
      id: 'q5-1',
      survey_id: 'survey-5',
      question_type: 'text',
      question_text: 'What were your main achievements this quarter?',
      is_required: true,
      order_index: 1,
      created_at: '2024-12-01T08:00:00Z',
      updated_at: '2024-12-01T08:00:00Z',
    },
    {
      id: 'q5-2',
      survey_id: 'survey-5',
      question_type: 'rating_scale',
      question_text: 'How would you rate your performance this quarter?',
      is_required: true,
      order_index: 2,
      options: { min: 1, max: 10 },
      created_at: '2024-12-01T08:00:00Z',
      updated_at: '2024-12-01T08:00:00Z',
    },
    {
      id: 'q5-3',
      survey_id: 'survey-5',
      question_type: 'multiple_choice',
      question_text: 'Which skills would you like to develop?',
      is_required: false,
      order_index: 3,
      options: { choices: ['Technical Skills', 'Leadership', 'Communication', 'Project Management', 'Data Analysis'] },
      created_at: '2024-12-01T08:00:00Z',
      updated_at: '2024-12-01T08:00:00Z',
    },
    {
      id: 'q5-4',
      survey_id: 'survey-5',
      question_type: 'textarea',
      question_text: 'What goals do you have for next quarter?',
      is_required: true,
      order_index: 4,
      created_at: '2024-12-01T08:00:00Z',
      updated_at: '2024-12-01T08:00:00Z',
    },
  ],
};

// ============================================================================
// RESPONSES
// ============================================================================
export const mockResponses: Response[] = [
  {
    id: 'resp-1',
    survey_id: 'survey-1',
    employee_id: 'user-2',
    status: 'completed',
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    started_at: '2024-12-05T10:30:00Z',
    completed_at: '2024-12-05T10:45:00Z',
    duration_seconds: 900,
    created_at: '2024-12-05T10:30:00Z',
    updated_at: '2024-12-05T10:45:00Z',
  },
  {
    id: 'resp-2',
    survey_id: 'survey-1',
    employee_id: 'user-3',
    status: 'completed',
    device_type: 'mobile',
    browser: 'Safari',
    os: 'iOS',
    started_at: '2024-12-06T14:00:00Z',
    completed_at: '2024-12-06T14:20:00Z',
    duration_seconds: 1200,
    created_at: '2024-12-06T14:00:00Z',
    updated_at: '2024-12-06T14:20:00Z',
  },
  {
    id: 'resp-3',
    survey_id: 'survey-2',
    respondent_name: 'John Smith',
    respondent_email: 'john.smith@acme.com',
    status: 'completed',
    ip_address: '192.168.1.100',
    device_type: 'desktop',
    browser: 'Firefox',
    os: 'macOS',
    started_at: '2024-11-15T09:00:00Z',
    completed_at: '2024-11-15T09:15:00Z',
    duration_seconds: 900,
    created_at: '2024-11-15T09:00:00Z',
    updated_at: '2024-11-15T09:15:00Z',
  },
  {
    id: 'resp-4',
    survey_id: 'survey-1',
    status: 'in_progress',
    device_type: 'tablet',
    browser: 'Chrome',
    os: 'Android',
    started_at: '2024-12-15T11:00:00Z',
    created_at: '2024-12-15T11:00:00Z',
    updated_at: '2024-12-15T11:00:00Z',
  },
];

// ============================================================================
// ANSWERS
// ============================================================================
export const mockAnswers: Answer[] = [
  // Response 1 answers
  { id: 'ans-1-1', response_id: 'resp-1', question_id: 'q1-1', answer_number: 4, created_at: '2024-12-05T10:35:00Z', updated_at: '2024-12-05T10:35:00Z' },
  { id: 'ans-1-2', response_id: 'resp-1', question_id: 'q1-2', answer_text: 'Good', created_at: '2024-12-05T10:38:00Z', updated_at: '2024-12-05T10:38:00Z' },
  { id: 'ans-1-3', response_id: 'resp-1', question_id: 'q1-3', answer_json: { selected: ['Health Insurance', 'Paid Time Off', 'Flexible Hours'] }, created_at: '2024-12-05T10:40:00Z', updated_at: '2024-12-05T10:40:00Z' },
  { id: 'ans-1-4', response_id: 'resp-1', question_id: 'q1-4', answer_number: 8, created_at: '2024-12-05T10:42:00Z', updated_at: '2024-12-05T10:42:00Z' },
  { id: 'ans-1-5', response_id: 'resp-1', question_id: 'q1-5', answer_text: 'More team building activities would be great!', created_at: '2024-12-05T10:45:00Z', updated_at: '2024-12-05T10:45:00Z' },

  // Response 2 answers
  { id: 'ans-2-1', response_id: 'resp-2', question_id: 'q1-1', answer_number: 5, created_at: '2024-12-06T14:05:00Z', updated_at: '2024-12-06T14:05:00Z' },
  { id: 'ans-2-2', response_id: 'resp-2', question_id: 'q1-2', answer_text: 'Excellent', created_at: '2024-12-06T14:10:00Z', updated_at: '2024-12-06T14:10:00Z' },
  { id: 'ans-2-3', response_id: 'resp-2', question_id: 'q1-3', answer_json: { selected: ['Training Opportunities', 'Remote Work Options'] }, created_at: '2024-12-06T14:15:00Z', updated_at: '2024-12-06T14:15:00Z' },
  { id: 'ans-2-4', response_id: 'resp-2', question_id: 'q1-4', answer_number: 9, created_at: '2024-12-06T14:18:00Z', updated_at: '2024-12-06T14:18:00Z' },

  // Response 3 answers (external survey)
  { id: 'ans-3-1', response_id: 'resp-3', question_id: 'q2-1', answer_number: 5, created_at: '2024-11-15T09:05:00Z', updated_at: '2024-11-15T09:05:00Z' },
  { id: 'ans-3-2', response_id: 'resp-3', question_id: 'q2-2', answer_number: 4, created_at: '2024-11-15T09:08:00Z', updated_at: '2024-11-15T09:08:00Z' },
  { id: 'ans-3-3', response_id: 'resp-3', question_id: 'q2-3', answer_boolean: true, created_at: '2024-11-15T09:10:00Z', updated_at: '2024-11-15T09:10:00Z' },
  { id: 'ans-3-4', response_id: 'resp-3', question_id: 'q2-4', answer_text: 'Excellent service and product quality. Very satisfied with the partnership.', created_at: '2024-11-15T09:15:00Z', updated_at: '2024-11-15T09:15:00Z' },
];

// ============================================================================
// DASHBOARD STATS
// ============================================================================
export const mockDashboardStats: DashboardStats = {
  total_employees: 156,
  total_admins: 4,
  total_surveys: 12,
  total_responses: 279,
  active_surveys: 3,
  completed_surveys: 7,
  new_employees_this_week: 3,
  new_employees_today: 1,
};

// ============================================================================
// ANALYTICS DATA
// ============================================================================
export const mockAnalytics = {
  'survey-1': {
    summary: {
      totalResponses: 87,
      completedResponses: 72,
      completionRate: 82.8,
      averageTime: 945, // seconds
      npsScore: 42,
    },
    questionBreakdown: {
      'q1-1': {
        question: 'How satisfied are you with your overall job?',
        type: 'rating_scale',
        responses: 72,
        average: 3.8,
        distribution: { 1: 3, 2: 5, 3: 12, 4: 28, 5: 24 },
      },
      'q1-2': {
        question: 'How would you rate your work-life balance?',
        type: 'single_choice',
        responses: 72,
        distribution: { 'Excellent': 18, 'Good': 32, 'Fair': 15, 'Poor': 5, 'Very Poor': 2 },
      },
      'q1-3': {
        question: 'Which benefits do you value most?',
        type: 'multiple_choice',
        responses: 72,
        distribution: {
          'Health Insurance': 65,
          'Paid Time Off': 58,
          'Flexible Hours': 52,
          'Retirement Plan': 45,
          'Training Opportunities': 38,
          'Remote Work Options': 34,
        },
      },
      'q1-4': {
        question: 'How likely are you to recommend our company?',
        type: 'nps',
        responses: 72,
        promoters: 38,
        passives: 22,
        detractors: 12,
        npsScore: 36,
      },
    },
    trends: {
      daily: [
        { date: '2024-12-01', responses: 12 },
        { date: '2024-12-02', responses: 8 },
        { date: '2024-12-03', responses: 15 },
        { date: '2024-12-04', responses: 10 },
        { date: '2024-12-05', responses: 18 },
        { date: '2024-12-06', responses: 14 },
        { date: '2024-12-07', responses: 5 },
      ],
    },
    demographics: {
      byDepartment: {
        'Engineering': 28,
        'Operations': 22,
        'HR': 12,
        'Finance': 8,
        'Sales': 15,
        'Management': 2,
      },
      byDevice: {
        'desktop': 45,
        'mobile': 20,
        'tablet': 7,
      },
    },
  },
  'survey-2': {
    summary: {
      totalResponses: 45,
      completedResponses: 41,
      completionRate: 91.1,
      averageTime: 720,
      satisfactionScore: 4.3,
    },
    questionBreakdown: {
      'q2-1': {
        question: 'Product Quality Rating',
        type: 'rating',
        responses: 41,
        average: 4.5,
        distribution: { 1: 0, 2: 1, 3: 3, 4: 15, 5: 22 },
      },
      'q2-2': {
        question: 'Customer Service Rating',
        type: 'rating',
        responses: 41,
        average: 4.2,
        distribution: { 1: 1, 2: 2, 3: 5, 4: 18, 5: 15 },
      },
      'q2-3': {
        question: 'Would recommend?',
        type: 'yes_no',
        responses: 41,
        yes: 38,
        no: 3,
      },
    },
    trends: {
      weekly: [
        { week: 'Week 1', responses: 12 },
        { week: 'Week 2', responses: 15 },
        { week: 'Week 3', responses: 10 },
        { week: 'Week 4', responses: 8 },
      ],
    },
  },
};

// ============================================================================
// CLIENT TRACKING DATA
// ============================================================================
export const mockClients = [
  {
    id: 'client-1',
    name: 'ACME Corporation',
    company: 'ACME Corp',
    email: 'contact@acme.com',
    totalSurveys: 3,
    totalResponses: 89,
    averageRating: 4.5,
    lastSurveyDate: '2024-12-10',
    status: 'active',
  },
  {
    id: 'client-2',
    name: 'Global Construction Ltd',
    company: 'Global Construction',
    email: 'info@globalconstruction.com',
    totalSurveys: 2,
    totalResponses: 45,
    averageRating: 4.2,
    lastSurveyDate: '2024-11-25',
    status: 'active',
  },
  {
    id: 'client-3',
    name: 'Saudi Steel Industries',
    company: 'Saudi Steel',
    email: 'contact@saudisteel.sa',
    totalSurveys: 5,
    totalResponses: 156,
    averageRating: 4.7,
    lastSurveyDate: '2024-12-14',
    status: 'active',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Simulate API delay
 */
export const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get survey by ID
 */
export const getSurveyById = (id: string): Survey | undefined => {
  return mockSurveys.find(s => s.id === id);
};

/**
 * Get survey by slug
 */
export const getSurveyBySlug = (slug: string): Survey | undefined => {
  return mockSurveys.find(s => s.unique_slug === slug);
};

/**
 * Get questions for a survey
 */
export const getQuestionsBySurveyId = (surveyId: string): Question[] => {
  return mockQuestions[surveyId] || [];
};

/**
 * Get responses for a survey
 */
export const getResponsesBySurveyId = (surveyId: string): Response[] => {
  return mockResponses.filter(r => r.survey_id === surveyId);
};

/**
 * Get analytics for a survey
 */
export const getAnalyticsBySurveyId = (surveyId: string) => {
  return mockAnalytics[surveyId as keyof typeof mockAnalytics] || null;
};

/**
 * Validate demo login
 */
export const validateDemoLogin = (email: string, password: string): User | null => {
  if (email === demoCredentials.admin.email && password === demoCredentials.admin.password) {
    return mockUsers[0];
  }
  if (email === demoCredentials.employee.email && password === demoCredentials.employee.password) {
    return mockUsers[1];
  }
  return null;
};
