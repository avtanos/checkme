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

// Создаем клиент только если API URL настроен
const apiClient = API_BASE_URL ? axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) : null;

// Обработка ошибок подключения
if (apiClient) {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        error.message = 'Не удалось подключиться к серверу. Убедитесь, что backend сервер запущен на ' + API_BASE_URL;
        error.isNetworkError = true;
      }
      return Promise.reject(error);
    }
  );
}

// Добавляем токен к запросам, если он есть
if (apiClient) {
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
}

// Функция-обертка для проверки доступности API
const checkApiAvailable = () => {
  if (!apiClient) {
    const error = new Error('Backend API не настроен. Для работы приложения необходимо запустить backend сервер локально или настроить публичный API URL через переменную окружения REACT_APP_API_URL.');
    error.isConfigError = true;
    throw error;
  }
};

export const getProviders = async (params = {}) => {
  checkApiAvailable();
  const response = await apiClient.get('/api/providers', { params });
  return response.data;
};

export const getProvider = async (id) => {
  checkApiAvailable();
  const response = await apiClient.get(`/api/providers/${id}`);
  return response.data;
};

export const createProvider = async (data) => {
  checkApiAvailable();
  const response = await apiClient.post('/api/providers', data);
  return response.data;
};

export const updateProvider = async (id, formData) => {
  checkApiAvailable();
  const response = await apiClient.put(`/api/providers/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProvider = async (id) => {
  checkApiAvailable();
  const response = await apiClient.delete(`/api/providers/${id}`);
  return response.data;
};

export const getCategories = async () => {
  checkApiAvailable();
  const response = await apiClient.get('/api/categories');
  return response.data;
};

export const sendMessage = async (providerId, messageData) => {
  checkApiAvailable();
  const response = await apiClient.post(`/api/providers/${providerId}/messages`, messageData);
  return response.data;
};

export const getProviderMessages = async (providerId) => {
  checkApiAvailable();
  const response = await apiClient.get(`/api/providers/${providerId}/messages`);
  return response.data;
};

// Аутентификация
export const register = async (formData) => {
  checkApiAvailable();
  const response = await apiClient.post('/api/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadFile = async (file) => {
  checkApiAvailable();
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
  checkApiAvailable();
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
  checkApiAvailable();
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};

export const getMyProvider = async () => {
  checkApiAvailable();
  const response = await apiClient.get('/api/auth/my-provider');
  return response.data;
};

// Админ-панель: Управление пользователями
export const getAllUsers = async () => {
  checkApiAvailable();
  const response = await apiClient.get('/api/admin/users');
  return response.data;
};

export const getUser = async (userId) => {
  checkApiAvailable();
  const response = await apiClient.get(`/api/admin/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  checkApiAvailable();
  const response = await apiClient.put(`/api/admin/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  checkApiAvailable();
  const response = await apiClient.delete(`/api/admin/users/${userId}`);
  return response.data;
};

// Админ-панель: Управление контентом
export const deleteProviderAdmin = async (providerId) => {
  checkApiAvailable();
  const response = await apiClient.delete(`/api/admin/providers/${providerId}`);
  return response.data;
};

export const toggleProviderActive = async (providerId) => {
  checkApiAvailable();
  const response = await apiClient.put(`/api/admin/providers/${providerId}/toggle-active`);
  return response.data;
};

// Админ-панель: Управление категориями
export const getAllCategoriesAdmin = async () => {
  checkApiAvailable();
  const response = await apiClient.get('/api/admin/categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  checkApiAvailable();
  const response = await apiClient.post('/api/admin/categories', categoryData);
  return response.data;
};

export const deleteCategory = async (categoryValue) => {
  checkApiAvailable();
  const response = await apiClient.delete(`/api/admin/categories/${categoryValue}`);
  return response.data;
};

// Админ-панель: Статистика
export const getAdminStats = async () => {
  checkApiAvailable();
  const response = await apiClient.get('/api/admin/stats');
  return response.data;
};

