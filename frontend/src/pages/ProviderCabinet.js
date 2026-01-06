import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProvider, updateProvider, getProviderMessages, getPhotoUrl } from '../api/client';
import LocationPicker from '../components/LocationPicker';
import { getCategoryIcon } from '../utils/categoryIcons';
import ApiUnavailable from '../components/ApiUnavailable';
import Footer from '../components/Footer';
import { logout, isAuthenticated } from '../utils/auth';
import './ProviderCabinet.css';

const categoryOptions = [
  { value: 'cargo', label: 'Грузовые машины' },
  { value: 'plumber', label: 'Сантехники' },
  { value: 'tow_truck', label: 'Эвакуаторы' },
  { value: 'electrician', label: 'Электрики' },
  { value: 'other', label: 'Другое' },
];

function ProviderCabinet() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    phone: '',
    address: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    // Проверяем наличие токена
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    loadProvider();
  }, []);

  useEffect(() => {
    if (provider) {
      loadMessages();
    }
  }, [provider]);

  const loadProvider = async () => {
    try {
      const data = await getMyProvider();
      setProvider(data);
      setFormData({
        name: data.name || '',
        category: data.category || '',
        description: data.description || '',
        latitude: data.latitude?.toString() || '42.8746',
        longitude: data.longitude?.toString() || '74.5698',
        phone: data.phone || '',
        address: data.address || '',
      });
      if (data.photo) {
        setPhotoPreview(getPhotoUrl(data.photo));
      }
      setLoading(false);
    } catch (err) {
      if (err.isConfigError || err.isNetworkError) {
        setError(err.message || 'Backend API недоступен. Для работы приложения необходимо запустить backend сервер локально.');
      } else if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError('Провайдер не найден. Возможно, ваш аккаунт не привязан к провайдеру.');
      } else {
        setError(err.response?.data?.detail || 'Ошибка загрузки данных провайдера');
      }
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!provider) return;
    try {
      const data = await getProviderMessages(provider.id);
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (file) {
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleLocationChange = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      if (formData.phone) {
        formDataToSend.append('phone', formData.phone);
      }
      if (formData.address) {
        formDataToSend.append('address', formData.address);
      }
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }
      
      const updated = await updateProvider(provider.id, formDataToSend);
      setProvider(updated);
      if (updated.photo) {
        setPhotoPreview(getPhotoUrl(updated.photo));
      }
      setPhotoFile(null);
      setSuccess('Данные успешно сохранены!');
      setSaving(false);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.detail || 'Ошибка при сохранении данных');
        setSaving(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading && error && (error.includes('Backend API') || error.includes('подключиться к серверу'))) {
    return <ApiUnavailable message={error} />;
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!provider && error) {
    if (error.includes('Backend API') || error.includes('подключиться к серверу')) {
      return <ApiUnavailable message={error} />;
    }
    return <div className="error">{error}</div>;
  }

  if (!provider) {
    return <div className="error">Провайдер не найден</div>;
  }

  return (
    <div className="cabinet-page">
      <header className="cabinet-header">
        <div className="cabinet-header-left">
          <button onClick={() => navigate('/')} className="back-button">
            ← Назад к карте
          </button>
          <h1>Кабинет провайдера</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </header>

      <div className="cabinet-content">
        <div className="cabinet-section">
          <h2>Редактирование данных</h2>
          
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="cabinet-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Название *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Категория *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Местоположение на карте *</label>
              <LocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={handleLocationChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Адрес</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+996 (312) 123-45-67"
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Фото</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />
              {photoPreview && (
                <div className="photo-preview">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </form>
        </div>

        <div className="cabinet-section">
          <h2>Сообщения от клиентов ({messages.length})</h2>
          {messages.length === 0 ? (
            <div className="empty-messages">Нет сообщений</div>
          ) : (
            <div className="messages-list">
              {messages.map((message) => (
                <div key={message.id} className="message-card">
                  <div className="message-header">
                    <div>
                      <strong>{message.client_name}</strong>
                      {message.client_phone && (
                        <span className="message-phone"> 📞 {message.client_phone}</span>
                      )}
                    </div>
                    <span className="message-date">
                      {new Date(message.created_at).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  {message.client_email && (
                    <div className="message-email">✉️ {message.client_email}</div>
                  )}
                  <div className="message-text">{message.message_text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProviderCabinet;

