import React from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';

function TopBar() {
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
          <Link to="/login" className="btn btn--primary">Войти</Link>
          <Link to="/register" className="btn">Регистрация</Link>
          <button className="icon-btn" type="button" aria-label="Меню">
            <div className="burger"><span></span></div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
