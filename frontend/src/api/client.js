import axios from 'axios';

// Загружаем конфигурацию API из публичного файла
let apiConfigCache = null;

const loadApiConfig = async () => {
  if (apiConfigCache !== null) {
    return apiConfigCache;
  }
  
  try {
    // Пытаемся загрузить из корня сайта (для GitHub Pages)
    const paths = [
      '/checkme/api-config.json',
      '/api-config.json',
      './api-config.json'
    ];
    
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const config = await response.json();
          apiConfigCache = config.apiUrl;
          return config.apiUrl;
        }
      } catch (e) {
        continue;
      }
    }
  } catch (error) {
    console.log('Не удалось загрузить api-config.json, используем дефолтные настройки');
  }
  
  apiConfigCache = null;
  return null;
};

// Автоматическое определение API URL в зависимости от окружения
const getApiBaseUrl = async () => {
  // Если есть переменная окружения, используем её
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Пытаемся загрузить конфигурацию из файла
  const configUrl = await loadApiConfig();
  if (configUrl) {
    return configUrl;
  }
  
  // Если мы на GitHub Pages или другом домене (не localhost)
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // Для production используем Railway backend URL
    return 'https://checkme-production.up.railway.app';
  }
  
  // Для localhost используем локальный backend
  return 'http://localhost:8000';
};

let API_BASE_URL = null;
let apiClient = null;

// Инициализация API клиента
const initApiClient = async () => {
  if (apiClient !== null) {
    return apiClient;
  }
  
  API_BASE_URL = await getApiBaseUrl();
  
  // Создаем клиент только если API URL настроен
  apiClient = API_BASE_URL ? axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }) : null;
  
  // Настраиваем перехватчики только если клиент создан
  if (apiClient) {
    // Добавляем токен к запросам
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
    
    // Обработка ошибок подключения
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
  
  return apiClient;
};

// Экспортируем функцию для получения базового URL API
export const getApiBaseUrlSync = () => {
  return API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8000' 
    : 'https://checkme-production.up.railway.app');
};

// Функция для получения полного URL фото
export const getPhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http')) return photoPath;
  const baseUrl = getApiBaseUrlSync();
  return `${baseUrl}${photoPath}`;
};

// Функция-обертка для проверки доступности API
const checkApiAvailable = async () => {
  await initApiClient();
  if (!apiClient) {
    const error = new Error('Backend API не настроен. Для работы приложения необходимо запустить backend сервер локально или настроить публичный API URL через переменную окружения REACT_APP_API_URL.');
    error.isConfigError = true;
    throw error;
  }
};

export const getProviders = async (params = {}) => {
  await checkApiAvailable();
  const response = await apiClient.get('/api/providers', { params });
  return response.data;
};

export const getProvider = async (id) => {
  await checkApiAvailable();
  const response = await apiClient.get(`/api/providers/${id}`);
  return response.data;
};

export const createProvider = async (data) => {
  await checkApiAvailable();
  const response = await apiClient.post('/api/providers', data);
  return response.data;
};

export const updateProvider = async (id, formData) => {
  await checkApiAvailable();
  const response = await apiClient.put(`/api/providers/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProvider = async (id) => {
  await checkApiAvailable();
  const response = await apiClient.delete(`/api/providers/${id}`);
  return response.data;
};

export const getCategories = async () => {
  await checkApiAvailable();
  const response = await apiClient.get('/api/categories');
  return response.data;
};

export const sendMessage = async (providerId, messageData) => {
  await checkApiAvailable();
  const response = await apiClient.post(`/api/providers/${providerId}/messages`, messageData);
  return response.data;
};

export const getProviderMessages = async (providerId) => {
  await checkApiAvailable();
  const response = await apiClient.get(`/api/providers/${providerId}/messages`);
  return response.data;
};

// Аутентификация
export const register = async (formData) => {
  await checkApiAvailable();
  const response = await apiClient.post('/api/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadFile = async (file) => {
  await checkApiAvailable();
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
  await checkApiAvailable();
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
  await checkApiAvailable();
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};

export const getMyProvider = async () => {
  await checkApiAvailable();
  const response = await apiClient.get('/api/auth/my-provider');
  return response.data;
};

// Админ-панель: Управление пользователями
export const getAllUsers = async () => {
  await checkApiAvailable();
  const response = await apiClient.get('/api/admin/users');
  return response.data;
};

export const getUser = async (userId) => {
  await checkApiAvailable();
  const response = await apiClient.get(`/api/admin/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  await checkApiAvailable();
  const response = await apiClient.put(`/api/admin/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  await checkApiAvailable();
  const response = await apiClient.delete(`/api/admin/users/${userId}`);
  return response.data;
};

// Админ-панель: Управление контентом
export const deleteProviderAdmin = async (providerId) => {
  await checkApiAvailable();
  const response = await apiClient.delete(`/api/admin/providers/${providerId}`);
  return response.data;
};

export const toggleProviderActive = async (providerId) => {
  await checkApiAvailable();
  const response = await apiClient.put(`/api/admin/providers/${providerId}/toggle-active`);
  return response.data;
};

// Админ-панель: Управление категориями
export const getAllCategoriesAdmin = async () => {
  await checkApiAvailable();
  const response = await apiClient.get('/api/admin/categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  await checkApiAvailable();
  const response = await apiClient.post('/api/admin/categories', categoryData);
  return response.data;
};

export const deleteCategory = async (categoryValue) => {
  await checkApiAvailable();
  const response = await apiClient.delete(`/api/admin/categories/${categoryValue}`);
  return response.data;
};

// Админ-панель: Статистика
export const getAdminStats = async () => {
  await checkApiAvailable();
  const response = await apiClient.get('/api/admin/stats');
  return response.data;
};

