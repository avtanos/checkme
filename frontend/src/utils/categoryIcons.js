// Иконки и цвета для категорий
export const categoryIcons = {
  cargo: { emoji: '🚚', label: 'Грузовые машины', color: '#FF6B6B' },
  plumber: { emoji: '🔧', label: 'Сантехники', color: '#4ECDC4' },
  tow_truck: { emoji: '🚑', label: 'Эвакуаторы', color: '#FFE66D' },
  electrician: { emoji: '⚡', label: 'Электрики', color: '#95E1D3' },
  other: { emoji: '📦', label: 'Другое', color: '#A8A8A8' },
};

export const getCategoryIcon = (category) => {
  return categoryIcons[category] || categoryIcons.other;
};

export const getCategoryEmoji = (category) => {
  return getCategoryIcon(category).emoji;
};

export const getCategoryLabel = (category) => {
  return getCategoryIcon(category).label;
};

export const getCategoryColor = (category) => {
  return getCategoryIcon(category).color;
};

