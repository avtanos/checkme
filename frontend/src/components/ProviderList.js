import React from 'react';
import { getCategoryIcon } from '../utils/categoryIcons';
import './ProviderList.css';

function ProviderList({ providers, onProviderClick }) {
  if (providers.length === 0) {
    return (
      <aside className="panel panel--list">
        <div className="panel__head">
          <h3>Провайдеры</h3>
        </div>
        <div className="panel__body">
          <div className="list-empty">Нет доступных провайдеров</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="panel panel--list">
      <div className="panel__head">
        <h3>Провайдеры</h3>
        <button className="btn-sm" type="button">Сортировка</button>
      </div>
      <div className="panel__body">
        <div className="list" aria-label="Список провайдеров">
          {providers.map((provider) => {
            const categoryIcon = getCategoryIcon(provider.category);
            return (
              <article
                key={provider.id}
                className="card"
                onClick={() => onProviderClick(provider)}
              >
                <div className="badge">
                  <span style={{ background: categoryIcon.color || 'var(--teal)' }}></span>
                </div>
                <div>
                  <h4>{provider.name}</h4>
                  {provider.description && (
                    <p>{provider.description}</p>
                  )}
                  <div className="meta">
                    {provider.phone && (
                      <span><b>Тел:</b> {provider.phone}</span>
                    )}
                    {provider.address && (
                      <span><b>Адрес:</b> {provider.address}</span>
                    )}
                  </div>
                  <div className="card__actions">
                    {provider.phone && (
                      <a
                        href={`tel:${provider.phone}`}
                        className="btn-sm btn-sm--call"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Позвонить
                      </a>
                    )}
                    <button
                      className="btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProviderClick(provider);
                      }}
                    >
                      Показать на карте
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default ProviderList;

