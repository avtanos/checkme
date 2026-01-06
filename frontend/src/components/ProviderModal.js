import React, { useState } from 'react';
import { getCategoryIcon } from '../utils/categoryIcons';
import { getPhotoUrl } from '../api/client';
import './ProviderModal.css';

function ProviderModal({ provider, onClose }) {
  const [isMapsOpen, setIsMapsOpen] = useState(false);

  // Функция для генерации WhatsApp URL
  const getWhatsAppUrl = () => {
    // Очищаем номер телефона от всех символов кроме цифр
    const cleanPhone = provider.phone?.replace(/\D/g, '') || '';
    // Формируем сообщение
    const message = encodeURIComponent(`Здравствуйте! Меня интересуют услуги: ${provider.name}`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Функции для генерации URL для разных картографических сервисов
  const get2GISUrl = () => {
    // 2GIS поддерживает координаты в URL
    return `https://2gis.kg/bishkek/geo/${provider.longitude},${provider.latitude}`;
  };

  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps?q=${provider.latitude},${provider.longitude}`;
  };

  const getYandexMapsUrl = () => {
    return `https://yandex.ru/maps/?pt=${provider.longitude},${provider.latitude}&z=15&l=map`;
  };

  const getOpenStreetMapUrl = () => {
    return `https://www.openstreetmap.org/?mlat=${provider.latitude}&mlon=${provider.longitude}&zoom=15`;
  };

  const handleMapClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsMapsOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <>
          <div className="modal-header">
            <div className="modal-header-title">
              <span className="modal-category-icon">{getCategoryIcon(provider.category).emoji}</span>
              <h2>{provider.name}</h2>
            </div>
            <span className="modal-category">
              {getCategoryIcon(provider.category).label}
            </span>
          </div>
          
          <div className="modal-body">
            {provider.photo && (
              <div className="modal-photo">
                <img 
                  src={getPhotoUrl(provider.photo)} 
                  alt={provider.name} 
                />
              </div>
            )}
            
            {provider.description && (
              <div className="modal-section">
                <h3>Описание</h3>
                <p>{provider.description}</p>
              </div>
            )}
            
            <div className="modal-section">
              <h3>Контакты</h3>
              {provider.phone && (
                <div className="contact-item">
                  <strong>Телефон:</strong> <a href={`tel:${provider.phone}`}>{provider.phone}</a>
                </div>
              )}
              {provider.address && (
                <div className="contact-item">
                  <strong>Адрес:</strong> {provider.address}
                </div>
              )}
            </div>
            
            <div className="modal-section">
              <h3>Местоположение</h3>
              <div className="map-buttons">
                <button
                  type="button"
                  className="map-main-btn"
                  onClick={() => setIsMapsOpen((prev) => !prev)}
                >
                  <span className="map-btn-icon">🗺️</span>
                  <span>Открыть в картах</span>
                  <span className={`map-btn-arrow ${isMapsOpen ? 'open' : ''}`}>▾</span>
                </button>
                {isMapsOpen && (
                  <div className="map-dropdown">
                    <button
                      type="button"
                      className="map-dropdown-item map-dropdown-2gis"
                      onClick={() => handleMapClick(get2GISUrl())}
                    >
                      2GIS
                    </button>
                    <button
                      type="button"
                      className="map-dropdown-item map-dropdown-google"
                      onClick={() => handleMapClick(getGoogleMapsUrl())}
                    >
                      Google Maps
                    </button>
                    <button
                      type="button"
                      className="map-dropdown-item map-dropdown-yandex"
                      onClick={() => handleMapClick(getYandexMapsUrl())}
                    >
                      Yandex Maps
                    </button>
                    <button
                      type="button"
                      className="map-dropdown-item map-dropdown-osm"
                      onClick={() => handleMapClick(getOpenStreetMapUrl())}
                    >
                      OpenStreetMap
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            {provider.phone && (
              <a
                href={getWhatsAppUrl()}
                className="btn btn-primary btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="whatsapp-icon">💬</span>
                Написать в WhatsApp
              </a>
            )}
          </div>
        </>
      </div>
    </div>
  );
}

export default ProviderModal;

