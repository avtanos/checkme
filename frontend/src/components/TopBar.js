import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';

function TopBar() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setUserRole(role);
  }, []);

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <div className="brandline">
          <div className="logo-mini">KG</div>
          <div className="brandtext">
            <strong>Карта провайдеров услуг</strong>
            <span>Найти мастера и связаться</span>
          </div>
        </div>

        <div className="actions">
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <Link to="/admin" className="btn btn--primary">Админ-панель</Link>
          )}
          {!userRole && (
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
