/**
 * Export API Service - DEMO VERSION
 * Uses mock data instead of real backend
 */

import { exportApi } from '../mockApi';

export interface ExportRequest {
  survey_ids: string[];
}

/**
 * Download file from blob response
 */
const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate filename with timestamp
 */
const generateFilename = (prefix: string, extension: string): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * Export to CSV
 */
export const exportToCSV = async (surveyIds: string[]): Promise<void> => {
  await exportApi.exportCSV(surveyIds);
};

/**
 * Export to Excel (Admin only)
 */
export const exportToExcel = async (surveyIds: string[]): Promise<void> => {
  await exportApi.exportExcel(surveyIds);
};

/**
 * Export to PDF
 */
export const exportToPDF = async (surveyIds: string[]): Promise<void> => {
  // Create a simple PDF-like HTML for demo
  const { mockSurveys } = await import('../../data/mockData');

  const surveys = surveyIds.map(id => mockSurveys.find(s => s.id === id)).filter(Boolean);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Survey Export</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        .survey { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; }
        .survey h2 { margin: 0 0 10px 0; }
        .stat { margin: 5px 0; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Survey Export Report</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      ${surveys.map(survey => `
        <div class="survey">
          <h2>${survey?.title}</h2>
          <p>${survey?.description || 'No description'}</p>
          <div class="stat"><span class="label">Status:</span> ${survey?.status}</div>
          <div class="stat"><span class="label">Type:</span> ${survey?.survey_type}</div>
          <div class="stat"><span class="label">Total Responses:</span> ${survey?.total_responses}</div>
          <div class="stat"><span class="label">Completed:</span> ${survey?.completed_responses}</div>
        </div>
      `).join('')}
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });

  // Open in new window for print-to-PDF
  const url = window.URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');

  if (newWindow) {
    newWindow.onload = () => {
      setTimeout(() => {
        newWindow.print();
      }, 250);
    };
  }
};

export default {
  exportToCSV,
  exportToExcel,
  exportToPDF,
};
