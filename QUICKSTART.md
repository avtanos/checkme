# Быстрый старт

## Шаг 1: Установка зависимостей Backend

```bash
cd backend
pip install -r requirements.txt
```

## Шаг 2: Инициализация тестовых данных (опционально)

```bash
cd backend
python init_data.py
```

Это создаст несколько тестовых провайдеров услуг в базе данных.

## Шаг 3: Запуск Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend будет доступен на http://localhost:8000
API документация: http://localhost:8000/docs

## Шаг 4: Установка зависимостей Frontend

Откройте новый терминал:

```bash
cd frontend
npm install
```

## Шаг 5: Запуск Frontend

```bash
npm start
```

Frontend будет доступен на http://localhost:3000

## Использование

1. Откройте http://localhost:3000 в браузере
2. Вы увидите карту с провайдерами услуг
3. Кликните на маркер или элемент в списке для просмотра деталей
4. Отправьте сообщение провайдеру
5. Для управления данными провайдера откройте `/cabinet/{id}` (например, `/cabinet/1`)

## Создание нового провайдера через API

```bash
curl -X POST "http://localhost:8000/api/providers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый провайдер",
    "category": "cargo",
    "description": "Описание",
    "latitude": 55.7558,
    "longitude": 37.6173,
    "phone": "+7 (495) 123-45-67",
    "email": "test@example.com"
  }'
```

