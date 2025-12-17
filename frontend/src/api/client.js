import axios from 'axios';

// Автоматическое определение API URL в зависимости от окружения
const getApiBaseUrl = () => {
  // Если есть переменная окружения, используем её
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Если мы на GitHub Pages или другом домене (не localhost)
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // Для production можно указать публичный URL backend
    // Если backend не развернут публично, вернем null для показа сообщения
    return null; // или 'https://your-backend-url.com' если backend развернут
  }
  
  // Для localhost используем локальный backend
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

// Если API URL не настроен, создаем клиент с заглушкой
const apiClient = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000', // fallback для предотвращения ошибок
  headers: {
    'Content-Type': 'application/json',
  },
});

// Обработка ошибок подключения
apiClient.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      const error = new Error('Backend API не настроен. Для работы приложения необходимо запустить backend сервер локально или настроить публичный API URL через переменную окружения REACT_APP_API_URL.');
      error.isConfigError = true;
      return Promise.reject(error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.isConfigError) {
      return Promise.reject(error);
    }
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
      error.message = 'Не удалось подключиться к серверу. Убедитесь, что backend сервер запущен на ' + (API_BASE_URL || 'http://localhost:8000');
      error.isNetworkError = true;
    }
    return Promise.reject(error);
  }
);

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

// Админ-панель: Управление пользователями
export const getAllUsers = async () => {
  const response = await apiClient.get('/api/admin/users');
  return response.data;
};

export const getUser = async (userId) => {
  const response = await apiClient.get(`/api/admin/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await apiClient.put(`/api/admin/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/api/admin/users/${userId}`);
  return response.data;
};

// Админ-панель: Управление контентом
export const deleteProviderAdmin = async (providerId) => {
  const response = await apiClient.delete(`/api/admin/providers/${providerId}`);
  return response.data;
};

export const toggleProviderActive = async (providerId) => {
  const response = await apiClient.put(`/api/admin/providers/${providerId}/toggle-active`);
  return response.data;
};

// Админ-панель: Управление категориями
export const getAllCategoriesAdmin = async () => {
  const response = await apiClient.get('/api/admin/categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await apiClient.post('/api/admin/categories', categoryData);
  return response.data;
};

export const deleteCategory = async (categoryValue) => {
  const response = await apiClient.delete(`/api/admin/categories/${categoryValue}`);
  return response.data;
};

// Админ-панель: Статистика
export const getAdminStats = async () => {
  const response = await apiClient.get('/api/admin/stats');
  return response.data;
};

