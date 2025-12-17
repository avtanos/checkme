import React from 'react';
import './ApiUnavailable.css';

function ApiUnavailable({ message }) {
  return (
    <div className="api-unavailable">
      <div className="api-unavailable-content">
        <h2>⚠️ Backend API недоступен</h2>
        <p>{message || 'Для работы приложения необходимо запустить backend сервер локально.'}</p>
        <div className="api-instructions">
          <h3>Инструкция по запуску:</h3>
          <ol>
            <li>Откройте терминал в папке <code>backend</code></li>
            <li>Установите зависимости: <code>pip install -r requirements.txt</code></li>
            <li>Запустите сервер: <code>python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000</code></li>
            <li>Обновите страницу в браузере</li>
          </ol>
          <p className="api-note">
            <strong>Примечание:</strong> Если backend развернут публично, настройте переменную окружения 
            <code>REACT_APP_API_URL</code> с URL вашего backend сервера.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApiUnavailable;
