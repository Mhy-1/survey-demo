/**
 * Export hooks using React Query
 * Manages data export operations (CSV, Excel, PDF)
 */

import { useMutation } from '@tanstack/react-query';
import * as exportService from '../services/api/export.service';
import toast from 'react-hot-toast';

/**
 * Export to CSV mutation
 */
export const useExportCSV = () => {
  return useMutation({
    mutationFn: exportService.exportToCSV,
    onSuccess: () => {
      toast.success('تم تصدير الملف بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل تصدير الملف';
      toast.error(message);
    },
  });
};

/**
 * Export to Excel mutation (Admin only)
 */
export const useExportExcel = () => {
  return useMutation({
    mutationFn: exportService.exportToExcel,
    onSuccess: () => {
      toast.success('تم تصدير ملف Excel بنجاح');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل تصدير ملف Excel';
      toast.error(message);
    },
  });
};

/**
 * Export to PDF mutation
 */
export const useExportPDF = () => {
  return useMutation({
    mutationFn: exportService.exportToPDF,
    onSuccess: () => {
      toast.success('جاري فتح نافذة الطباعة...');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'فشل تصدير ملف PDF';
      toast.error(message);
    },
  });
};
