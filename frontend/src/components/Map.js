import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCategoryIcon } from '../utils/categoryIcons';
import './Map.css';

// Фикс для иконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultCenter = [42.8746, 74.5698]; // Бишкек, Кыргызстан (fallback)
const defaultZoom = 12;

function createCustomIcon(category) {
  const iconData = getCategoryIcon(category);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${iconData.color}; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">${iconData.emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapBounds({ providers, userLocation, shouldFitBounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (shouldFitBounds && providers.length > 0) {
      const bounds = L.latLngBounds(
        providers.map(p => [p.latitude, p.longitude])
      );
      // Если есть геолокация пользователя, добавляем её в границы
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [providers, userLocation, shouldFitBounds, map]);
  
  return null;
}

function MapCenter({ center, zoom, shouldCenter }) {
  const map = useMap();
  
  useEffect(() => {
    if (shouldCenter && center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, shouldCenter, map]);
  
  return null;
}

function Map({ providers, onMarkerClick }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(defaultZoom);
  const [shouldCenter, setShouldCenter] = useState(true);
  const [shouldFitBounds, setShouldFitBounds] = useState(false);

  useEffect(() => {
    // Получаем геолокацию пользователя
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          setMapZoom(defaultZoom);
          setShouldCenter(true);
          setShouldFitBounds(false);
        },
        (error) => {
          console.log('Геолокация недоступна:', error.message);
          setLocationError(error.message);
          // Используем центр по умолчанию (Бишкек)
          setMapCenter(defaultCenter);
          setShouldCenter(true);
          setShouldFitBounds(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.log('Геолокация не поддерживается браузером');
      setLocationError('Геолокация не поддерживается');
      setMapCenter(defaultCenter);
      setShouldCenter(true);
      setShouldFitBounds(false);
    }
  }, []);

  // Когда провайдеры загружены, переключаемся на fitBounds
  useEffect(() => {
    if (providers.length > 0) {
      setShouldFitBounds(true);
      setShouldCenter(false);
    }
  }, [providers.length]);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenter center={mapCenter} zoom={mapZoom} shouldCenter={shouldCenter} />
        <MapBounds providers={providers} userLocation={userLocation} shouldFitBounds={shouldFitBounds} />
        
        {/* Маркер местоположения пользователя */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>Ваше местоположение</Popup>
          </Marker>
        )}
        
        {/* Маркеры провайдеров */}
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.latitude, provider.longitude]}
            icon={createCustomIcon(provider.category)}
            eventHandlers={{
              click: () => onMarkerClick(provider),
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                  {getCategoryIcon(provider.category).emoji}
                </div>
                <strong>{provider.name}</strong>
                <br />
                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                  {getCategoryIcon(provider.category).label}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;

