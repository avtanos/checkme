import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated, getUserRole } from '../utils/auth';
import './TopBar.css';

function TopBar() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
      setUserRole(getUserRole());
    };
    
    checkAuth();
    // Проверяем аутентификацию при изменении localStorage
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Также проверяем при фокусе окна (на случай, если пользователь вышел в другой вкладке)
    window.addEventListener('focus', checkAuth);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUserRole(null);
    navigate('/');
    // Обновляем страницу для синхронизации состояния
    window.location.reload();
  };

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <div className="brandline">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div className="logo-mini">KG</div>
            <div className="brandtext">
              <strong>Карта провайдеров услуг</strong>
              <span>Найти мастера и связаться</span>
            </div>
          </Link>
        </div>

        <div className="actions">
          {authenticated && (userRole === 'admin' || userRole === 'super_admin') && (
            <Link to="/admin" className="btn btn--primary">Админ-панель</Link>
          )}
          {authenticated && userRole === 'user' && (
            <Link to="/cabinet" className="btn btn--primary">Кабинет</Link>
          )}
          {authenticated && (
            <button onClick={handleLogout} className="btn">Выйти</button>
          )}
          {!authenticated && (
            <>
              <Link to="/login" className="btn btn--primary">Войти</Link>
              <Link to="/register" className="btn">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
