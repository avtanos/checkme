import React from 'react';
import { getCategoryIcon } from '../utils/categoryIcons';
import './FilterBar.css';

function FilterBar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="filter-bar">
      <div className="category-icons">
        <button
          className={`category-icon-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => onCategoryChange('')}
          title="Все категории"
        >
          <span className="category-emoji">📍</span>
          <span className="category-label">Все</span>
        </button>
        {categories.map((cat) => {
          const icon = getCategoryIcon(cat.value);
          return (
            <button
              key={cat.value}
              className={`category-icon-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.value)}
              title={icon.label}
            >
              <span className="category-emoji">{icon.emoji}</span>
              <span className="category-label">{icon.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;

