/**
 * Утилиты для работы с аутентификацией
 */

/**
 * Очищает все данные аутентификации из localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('provider_id');
  localStorage.removeItem('user_role');
};

/**
 * Проверяет, авторизован ли пользователь
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Получает роль пользователя
 */
export const getUserRole = () => {
  return localStorage.getItem('user_role');
};

/**
 * Получает ID пользователя
 */
export const getUserId = () => {
  return localStorage.getItem('user_id');
};
