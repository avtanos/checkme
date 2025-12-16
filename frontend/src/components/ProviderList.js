import React from 'react';
import { getCategoryIcon } from '../utils/categoryIcons';
import './ProviderList.css';

function ProviderList({ providers, onProviderClick }) {
  if (providers.length === 0) {
    return (
      <div className="provider-list">
        <div className="provider-list-empty">Нет доступных провайдеров</div>
      </div>
    );
  }

  return (
    <div className="provider-list">
      <div className="provider-list-header">
        <h3>Список провайдеров ({providers.length})</h3>
      </div>
      <div className="provider-list-items">
        {providers.map((provider) => {
          const categoryIcon = getCategoryIcon(provider.category);
          return (
            <div
              key={provider.id}
              className="provider-item"
              onClick={() => onProviderClick(provider)}
            >
              <div className="provider-item-header">
                <div className="provider-item-title">
                  <span className="provider-category-icon">{categoryIcon.emoji}</span>
                  <h4>{provider.name}</h4>
                </div>
                <span className="provider-category">
                  {categoryIcon.label}
                </span>
              </div>
              {provider.description && (
                <p className="provider-description">{provider.description}</p>
              )}
              {provider.phone && (
                <div className="provider-contact">
                  <span>📞 {provider.phone}</span>
                </div>
              )}
              {provider.address && (
                <div className="provider-address">
                  <span>📍 {provider.address}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProviderList;

