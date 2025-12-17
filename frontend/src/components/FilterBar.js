import React from 'react';
import { getCategoryIcon } from '../utils/categoryIcons';
import './FilterBar.css';

function FilterBar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <section className="filters">
      <div className="container">
        <div className="pillbar" aria-label="Фильтры">
          <button
            className={`chip ${selectedCategory === '' ? 'is-active' : ''}`}
            onClick={() => onCategoryChange('')}
          >
            Все
          </button>
          {categories.map((cat) => {
            const icon = getCategoryIcon(cat.value);
            return (
              <button
                key={cat.value}
                className={`chip ${selectedCategory === cat.value ? 'is-active' : ''}`}
                onClick={() => onCategoryChange(cat.value)}
              >
                {icon.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FilterBar;

