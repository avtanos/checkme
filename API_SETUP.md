# Настройка API для GitHub Pages

Чтобы приложение заработало на GitHub Pages, необходимо настроить публичный URL backend API.

## Вариант 1: Использование api-config.json (Рекомендуется)

1. Отредактируйте файл `docs/api-config.json` в репозитории
2. Укажите URL вашего backend API:

```json
{
  "apiUrl": "https://your-backend-url.com"
}
```

3. Закоммитьте и запушьте изменения:
```bash
git add docs/api-config.json
git commit -m "Configure API URL"
git push
```

## Вариант 2: Использование переменной окружения при сборке

1. Создайте файл `.env` в папке `frontend/`:
```
REACT_APP_API_URL=https://your-backend-url.com
```

2. Пересоберите frontend:
```bash
cd frontend
npm run build
```

3. Скопируйте build в docs и запушьте:
```bash
cd ..
rm -rf docs/*
cp -r frontend/build/* docs/
git add docs/
git commit -m "Update build with API URL"
git push
```

## Развертывание Backend

Если у вас еще нет развернутого backend, вы можете использовать бесплатные хостинги:

### Render (Рекомендуется - бесплатный план)
1. Зарегистрируйтесь на https://render.com
2. Создайте новый Web Service
3. Подключите ваш GitHub репозиторий
4. Укажите:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. После развертывания скопируйте URL и укажите его в `api-config.json`

### Railway
1. Зарегистрируйтесь на https://railway.app
2. Создайте новый проект из GitHub репозитория
3. Добавьте переменную окружения `PORT`
4. Railway автоматически определит FastAPI приложение
5. После развертывания скопируйте URL и укажите его в `api-config.json`

## Важно

- Убедитесь, что backend настроен для работы с CORS и разрешает запросы с `https://avtanos.github.io`
- Backend должен быть доступен по HTTPS
- После изменения `api-config.json` обновите страницу в браузере (Ctrl+F5)
