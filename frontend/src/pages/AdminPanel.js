import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getProviders,
  deleteProviderAdmin,
  toggleProviderActive,
  getAllCategoriesAdmin,
  createCategory,
  deleteCategory,
  getAdminStats,
  getCurrentUser,
} from '../api/client';
import Footer from '../components/Footer';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
        navigate('/');
        return;
      }
      setUser(currentUser);
    } catch (err) {
      navigate('/login');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'stats') {
        const statsData = await getAdminStats();
        setStats(statsData);
      } else if (activeTab === 'users' && user?.role === 'super_admin') {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } else if (activeTab === 'providers') {
        const providersData = await getProviders();
        setProviders(providersData);
      } else if (activeTab === 'categories') {
        const categoriesData = await getAllCategoriesAdmin();
        setCategories(categoriesData);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка удаления пользователя');
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const updated = await updateUser(userId, userData);
      setUsers(users.map(u => u.id === userId ? updated : u));
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка обновления пользователя');
    }
  };

  const handleDeleteProvider = async (providerId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого провайдера?')) {
      return;
    }
    try {
      await deleteProviderAdmin(providerId);
      setProviders(providers.filter(p => p.id !== providerId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка удаления провайдера');
    }
  };

  const handleToggleProviderActive = async (providerId) => {
    try {
      const updated = await toggleProviderActive(providerId);
      setProviders(providers.map(p => p.id === providerId ? updated : p));
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка обновления провайдера');
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const newCategory = await createCategory(categoryData);
      setCategories([...categories, newCategory]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка создания категории');
    }
  };

  const handleDeleteCategory = async (categoryValue) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }
    try {
      await deleteCategory(categoryValue);
      setCategories(categories.filter(c => c.value !== categoryValue));
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка удаления категории');
    }
  };

  if (!user) {
    return <div className="admin-loading">Загрузка...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Админ-панель</h1>
        <div className="admin-user-info">
          <span>{user.username} ({user.role})</span>
          <button onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}>Выйти</button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-tabs">
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Статистика
        </button>
        {user.role === 'super_admin' && (
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
        )}
        <button
          className={activeTab === 'providers' ? 'active' : ''}
          onClick={() => setActiveTab('providers')}
        >
          Провайдеры
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Категории
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="admin-loading">Загрузка...</div>
        ) : (
          <>
            {activeTab === 'stats' && <StatsTab stats={stats} />}
            {activeTab === 'users' && user.role === 'super_admin' && (
              <UsersTab
                users={users}
                onUpdate={handleUpdateUser}
                onDelete={handleDeleteUser}
              />
            )}
            {activeTab === 'providers' && (
              <ProvidersTab
                providers={providers}
                onDelete={handleDeleteProvider}
                onToggleActive={handleToggleProviderActive}
              />
            )}
            {activeTab === 'categories' && (
              <CategoriesTab
                categories={categories}
                onCreate={handleCreateCategory}
                onDelete={handleDeleteCategory}
                isSuperAdmin={user.role === 'super_admin'}
              />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

function StatsTab({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Пользователи</h3>
        <p className="stat-value">{stats.total_users}</p>
      </div>
      <div className="stat-card">
        <h3>Провайдеры</h3>
        <p className="stat-value">{stats.total_providers}</p>
        <p className="stat-detail">Активных: {stats.active_providers}</p>
        <p className="stat-detail">Неактивных: {stats.inactive_providers}</p>
      </div>
      <div className="stat-card">
        <h3>Сообщения</h3>
        <p className="stat-value">{stats.total_messages}</p>
      </div>
      <div className="stat-card">
        <h3>Категории</h3>
        <p className="stat-value">{stats.total_categories}</p>
      </div>
    </div>
  );
}

function UsersTab({ users, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditData({ role: user.role, is_active: user.is_active });
  };

  const handleSave = (userId) => {
    onUpdate(userId, editData);
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Активен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {editingId === user.id ? (
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="checkbox"
                    checked={editData.is_active}
                    onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                  />
                ) : (
                  user.is_active ? 'Да' : 'Нет'
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <>
                    <button onClick={() => handleSave(user.id)}>Сохранить</button>
                    <button onClick={() => setEditingId(null)}>Отмена</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Редактировать</button>
                    <button onClick={() => onDelete(user.id)} className="delete-btn">
                      Удалить
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProvidersTab({ providers, onDelete, onToggleActive }) {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Телефон</th>
            <th>Активен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.id}</td>
              <td>{provider.name}</td>
              <td>{provider.category}</td>
              <td>{provider.phone || '-'}</td>
              <td>{provider.is_active ? 'Да' : 'Нет'}</td>
              <td>
                <button onClick={() => onToggleActive(provider.id)}>
                  {provider.is_active ? 'Деактивировать' : 'Активировать'}
                </button>
                <button onClick={() => onDelete(provider.id)} className="delete-btn">
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoriesTab({ categories, onCreate, onDelete, isSuperAdmin }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ value: '', label: '' });

  const handleCreate = () => {
    if (newCategory.value && newCategory.label) {
      onCreate(newCategory);
      setNewCategory({ value: '', label: '' });
      setShowCreateForm(false);
    }
  };

  return (
    <div>
      {isSuperAdmin && (
        <div className="category-actions">
          <button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Отмена' : 'Создать категорию'}
          </button>
          {showCreateForm && (
            <div className="create-category-form">
              <input
                type="text"
                placeholder="Значение (value)"
                value={newCategory.value}
                onChange={(e) => setNewCategory({ ...newCategory, value: e.target.value })}
              />
              <input
                type="text"
                placeholder="Название (label)"
                value={newCategory.label}
                onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
              />
              <button onClick={handleCreate}>Создать</button>
            </div>
          )}
        </div>
      )}
      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.value} className="category-item">
            <span className="category-value">{category.value}</span>
            <span className="category-label">{category.label}</span>
            {isSuperAdmin && (
              <button
                onClick={() => onDelete(category.value)}
                className="delete-btn"
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
