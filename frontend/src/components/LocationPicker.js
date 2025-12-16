import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import './LocationPicker.css';

// Фикс для иконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, onPositionChange }) {
  const [markerPosition, setMarkerPosition] = useState(position || [42.8746, 74.5698]);

  useEffect(() => {
    if (position) {
      setMarkerPosition(position);
    }
  }, [position]);

  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(newPosition);
      onPositionChange(newPosition);
    },
  });

  return (
    <Marker position={markerPosition} draggable={true} eventHandlers={{
      dragend(e) {
        const newPosition = [e.target.getLatLng().lat, e.target.getLatLng().lng];
        setMarkerPosition(newPosition);
        onPositionChange(newPosition);
      },
    }} />
  );
}

function LocationPicker({ latitude, longitude, onLocationChange }) {
  const [position, setPosition] = useState(
    latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : [42.8746, 74.5698]
  );

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([parseFloat(latitude), parseFloat(longitude)]);
    }
  }, [latitude, longitude]);

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    onLocationChange(newPosition[0], newPosition[1]);
  };

  return (
    <div className="location-picker">
      <div className="location-picker-map">
        <MapContainer
          center={position}
          zoom={12}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onPositionChange={handlePositionChange} />
        </MapContainer>
      </div>
      <div className="location-picker-info">
        <p>Кликните на карте или перетащите маркер для выбора местоположения</p>
        <div className="location-coords">
          <span>Широта: {position[0].toFixed(6)}</span>
          <span>Долгота: {position[1].toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;

