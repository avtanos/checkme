import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import Map from '../components/Map';
import ProviderList from '../components/ProviderList';
import ProviderModal from '../components/ProviderModal';
import FilterBar from '../components/FilterBar';
import ApiUnavailable from '../components/ApiUnavailable';
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
  const [showFilters, setShowFilters] = useState(true);
  const [mapRef, setMapRef] = useState(null);
  const [apiError, setApiError] = useState(null);

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
      setApiError(null);
    } catch (error) {
      console.error('Error loading providers:', error);
      if (error.isConfigError || error.isNetworkError) {
        setApiError(error.message || 'Backend API недоступен');
      }
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

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef) {
            mapRef.setView([latitude, longitude], 15);
          }
        },
        (error) => {
          alert('Не удалось получить ваше местоположение. Проверьте настройки геолокации.');
        }
      );
    } else {
      alert('Геолокация не поддерживается вашим браузером.');
    }
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (apiError) {
    return (
      <div className="page">
        <TopBar />
        <ApiUnavailable message={apiError} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <TopBar />
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <TopBar />

      {showFilters && (
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      <main className="main">
        <div className="container">
          <div className="layout">
            <section className="panel panel--map">
              <div className="panel__head">
                <h3>Карта</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-sm" type="button" onClick={handleMyLocation}>
                    Моё местоположение
                  </button>
                  <button className="btn-sm" type="button" onClick={handleToggleFilters}>
                    {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
                  </button>
                </div>
              </div>
              <div className="panel__body">
                <Map
                  providers={filteredProviders}
                  onMarkerClick={handleMarkerClick}
                  onMapReady={setMapRef}
                />
              </div>
            </section>

            <ProviderList
              providers={filteredProviders}
              onProviderClick={handleProviderClick}
            />
          </div>
        </div>
      </main>

      {isModalOpen && selectedProvider && (
        <ProviderModal
          provider={selectedProvider}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </div>
  );
}

export default MapPage;

