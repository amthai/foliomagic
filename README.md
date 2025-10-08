# Resume Generator

Генератор резюме на основе вакансий с HeadHunter.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне проекта:
```bash
cp env-template.txt .env
```

3. Получите API ключ OpenRouter:
   - Зайдите на https://openrouter.ai/keys
   - Создайте аккаунт и получите API ключ
   - Откройте файл `.env` и замените `your_api_key_here` на ваш ключ

4. Запустите сервер:
```bash
npm start
```

## Использование

Откройте http://localhost:3000 в браузере и заполните форму для генерации резюме.
