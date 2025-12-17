import React, { useState, useEffect, useRef } from 'react';
import { getCategoryIcon } from '../utils/categoryIcons';
import './ProviderList.css';

function ProviderList({ providers, onProviderClick }) {
  const [sortBy, setSortBy] = useState('name');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef(null);

  const sortedProviders = [...providers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortMenu(false);
  };

  // Закрываем меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };

    if (showSortMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortMenu]);
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
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-sm" 
            type="button" 
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            Сортировка
          </button>
          {showSortMenu && (
            <div className="sort-menu" ref={sortMenuRef}>
              <button 
                className={`sort-option ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => handleSortChange('name')}
              >
                По имени
              </button>
              <button 
                className={`sort-option ${sortBy === 'category' ? 'active' : ''}`}
                onClick={() => handleSortChange('category')}
              >
                По категории
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="panel__body">
        <div className="list" aria-label="Список провайдеров">
          {sortedProviders.map((provider) => {
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

