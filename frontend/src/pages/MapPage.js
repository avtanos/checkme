import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Map from '../components/Map';
import ProviderList from '../components/ProviderList';
import ProviderModal from '../components/ProviderModal';
import FilterBar from '../components/FilterBar';
import { getProviders, getCategories } from '../api/client';
import './MapPage.css';

function MapPage() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [selectedCategory, providers]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProviders = async () => {
    try {
      const data = await getProviders();
      setProviders(data);
      setFilteredProviders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading providers:', error);
      setLoading(false);
    }
  };

  const filterProviders = () => {
    if (!selectedCategory) {
      setFilteredProviders(providers);
    } else {
      setFilteredProviders(providers.filter(p => p.category === selectedCategory));
    }
  };

  const handleMarkerClick = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="map-page">
      <header className="map-header">
        <div className="map-header-top">
          <h1>Карта провайдеров услуг Кыргызстана</h1>
          <div className="auth-links">
            <Link to="/login" className="auth-link-btn">
              Вход
            </Link>
            <Link to="/register" className="auth-link-btn register-btn">
              Регистрация
            </Link>
          </div>
        </div>
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </header>
      <div className="map-container">
        <Map
          providers={filteredProviders}
          onMarkerClick={handleMarkerClick}
        />
        <ProviderList
          providers={filteredProviders}
          onProviderClick={handleProviderClick}
        />
      </div>
      {isModalOpen && selectedProvider && (
        <ProviderModal
          provider={selectedProvider}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default MapPage;

