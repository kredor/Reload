import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate axios instance for file uploads (no default Content-Type)
const uploadApi = axios.create({
  baseURL: API_URL,
});

export const loadsAPI = {
  // Get all loads with optional filters
  getAll: (params) => api.get('/loads', { params }).then(res => res.data),

  // Get single load by ID
  getById: (id) => api.get(`/loads/${id}`).then(res => res.data),

  // Create new load
  create: (data) => {
    // Use uploadApi for FormData (no default Content-Type), regular api for JSON
    if (data instanceof FormData) {
      return uploadApi.post('/loads', data).then(res => res.data);
    }
    return api.post('/loads', data).then(res => res.data);
  },

  // Update existing load
  update: (id, data) => {
    // Use uploadApi for FormData (no default Content-Type), regular api for JSON
    if (data instanceof FormData) {
      return uploadApi.put(`/loads/${id}`, data).then(res => res.data);
    }
    return api.put(`/loads/${id}`, data).then(res => res.data);
  },

  // Delete load
  delete: (id) => api.delete(`/loads/${id}`).then(res => res.data),

  // Get filter options
  getFilters: () => api.get('/loads/filters').then(res => res.data),
};

export default api;
