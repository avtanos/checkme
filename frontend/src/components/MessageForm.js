import React, { useState } from 'react';
import { sendMessage } from '../api/client';
import './MessageForm.css';

function MessageForm({ provider, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    message_text: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.client_name || !formData.client_phone || !formData.message_text) {
      setError('Заполните все обязательные поля');
      setLoading(false);
      return;
    }

    try {
      await sendMessage(provider.id, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при отправке сообщения');
      setLoading(false);
    }
  };

  return (
    <div className="message-form-container">
      <h2>Отправить сообщение</h2>
      <p className="message-form-provider">Провайдер: <strong>{provider.name}</strong></p>
      
      <form onSubmit={handleSubmit} className="message-form">
        <div className="form-group">
          <label htmlFor="client_name">Ваше имя *</label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
            placeholder="Введите ваше имя"
          />
        </div>

        <div className="form-group">
          <label htmlFor="client_phone">Телефон *</label>
          <input
            type="tel"
            id="client_phone"
            name="client_phone"
            value={formData.client_phone}
            onChange={handleChange}
            required
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div className="form-group">
          <label htmlFor="client_email">Email</label>
          <input
            type="email"
            id="client_email"
            name="client_email"
            value={formData.client_email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message_text">Сообщение *</label>
          <textarea
            id="message_text"
            name="message_text"
            value={formData.message_text}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Опишите вашу задачу или вопрос..."
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageForm;

