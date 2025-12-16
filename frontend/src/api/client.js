import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к запросам, если он есть
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getProviders = async (params = {}) => {
  const response = await apiClient.get('/api/providers', { params });
  return response.data;
};

export const getProvider = async (id) => {
  const response = await apiClient.get(`/api/providers/${id}`);
  return response.data;
};

export const createProvider = async (data) => {
  const response = await apiClient.post('/api/providers', data);
  return response.data;
};

export const updateProvider = async (id, formData) => {
  const response = await apiClient.put(`/api/providers/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProvider = async (id) => {
  const response = await apiClient.delete(`/api/providers/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get('/api/categories');
  return response.data;
};

export const sendMessage = async (providerId, messageData) => {
  const response = await apiClient.post(`/api/providers/${providerId}/messages`, messageData);
  return response.data;
};

export const getProviderMessages = async (providerId) => {
  const response = await apiClient.get(`/api/providers/${providerId}/messages`);
  return response.data;
};

// Аутентификация
export const register = async (formData) => {
  const response = await apiClient.post('/api/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  const response = await apiClient.post('/api/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};

export const getMyProvider = async () => {
  const response = await apiClient.get('/api/auth/my-provider');
  return response.data;
};

