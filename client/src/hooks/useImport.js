import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Hook to upload and import Excel file
 */
export function useImportExcel() {
    return useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${api.baseURL}/import/excel`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to import Excel file');
            }

            return response.json();
        },
    });
}

/**
 * Hook to preview Excel file before importing
 */
export function usePreviewExcel() {
    return useMutation({
        mutationFn: async ({ file, limit = 10 }) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${api.baseURL}/import/preview?limit=${limit}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to preview Excel file');
            }

            return response.json();
        },
    });
}

/**
 * Hook to check import status (if database has imported loads)
 */
export function useImportStatus() {
    return useQuery({
        queryKey: ['importStatus'],
        queryFn: async () => {
            const response = await fetch(`${api.baseURL}/import/status`);

            if (!response.ok) {
                throw new Error('Failed to fetch import status');
            }

            return response.json();
        },
    });
}

/**
 * Hook to fetch distinct values for a column (for filters)
 */
export function useDistinctValues(column, enabled = true) {
    return useQuery({
        queryKey: ['distinctValues', column],
        queryFn: async () => {
            const response = await api.get(`/loads/distinct/${column}`);
            return response.data;
        },
        enabled: enabled && !!column,
    });
}

/**
 * Hook to replace all imported loads with new Excel file
 * Preserves user-created loads
 */
export function useReplaceImportedLoads() {
    return useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/import/replace', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        },
    });
}
