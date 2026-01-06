# Railway Deployment Setup Guide

## Важные настройки в Railway

### 1. Root Directory
**КРИТИЧЕСКИ ВАЖНО!** В настройках сервиса в Railway:

1. Откройте сервис "checkme"
2. Перейдите в **Settings** → **Source**
3. Установите **Root Directory** = `backend`
4. Сохраните изменения

Без этой настройки Railway не сможет найти `requirements.txt` и другие файлы!

### 2. Custom Start Command (опционально)
Если Railway не использует автоматически `Procfile` или `railway.json`:

1. Settings → **Deploy** → **Custom Start Command**
2. Введите: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Или оставьте пустым - Railway использует `Procfile` или `railway.json`

### 3. Custom Build Command
**УДАЛИТЕ** любую команду типа `npm run build` - это для Node.js проектов!

1. Settings → **Build** → **Custom Build Command**
2. Оставьте пустым - Railway автоматически определит Python проект

### 4. Переменные окружения
Обычно не требуются для базовой настройки, но можно добавить:
- `PORT` - устанавливается автоматически Railway
- `PYTHONUNBUFFERED=1` - для лучшего логирования (опционально)

## Проверка деплоя

После настройки Root Directory:

1. Railway автоматически запустит новый деплой
2. Проверьте логи в разделе **Logs**
3. Проверьте статус в разделе **Deployments**

## Проверка работы API

После успешного деплоя проверьте:

```bash
# Проверка основного endpoint
curl https://checkme-production.up.railway.app/

# Проверка health check
curl https://checkme-production.up.railway.app/health

# Проверка API
curl https://checkme-production.up.railway.app/api/providers
```

## Возможные проблемы

### 502 Bad Gateway
- **Причина**: Root Directory не установлен или приложение не запускается
- **Решение**: Установите Root Directory = `backend` и проверьте логи

### Build failed
- **Причина**: Railway не может найти `requirements.txt`
- **Решение**: Убедитесь, что Root Directory = `backend`

### Application failed to respond
- **Причина**: Приложение падает при запуске
- **Решение**: Проверьте логи в Railway → Logs для деталей ошибки

