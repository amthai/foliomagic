# Инструкция по деплою Resume Generator

## Варианты хостинга

### 1. Railway (Рекомендуется - простой и быстрый)

1. **Регистрация:**
   - Зайди на https://railway.app
   - Войди через GitHub

2. **Деплой:**
   ```bash
   # Установи Railway CLI
   npm install -g @railway/cli
   
   # Войди в аккаунт
   railway login
   
   # Инициализируй проект
   railway init
   
   # Добавь переменные окружения
   railway variables set OPENROUTER_API_KEY=your_api_key_here
   
   # Деплой
   railway up
   ```

3. **Настройка:**
   - Railway автоматически определит Dockerfile
   - Добавь переменную `OPENROUTER_API_KEY` в настройках проекта
   - Приложение будет доступно по URL вида: `https://your-app-name.railway.app`

### 2. Render

1. **Регистрация:**
   - Зайди на https://render.com
   - Подключи GitHub репозиторий

2. **Настройка сервиса:**
   - Выбери "New Web Service"
   - Подключи GitHub репозиторий
   - Настройки:
     - **Build Command:** `docker build -t resume-generator .`
     - **Start Command:** `npm start`
     - **Environment:** Node.js

3. **Переменные окружения:**
   - `OPENROUTER_API_KEY` = твой API ключ
   - `NODE_ENV` = production

### 3. DigitalOcean App Platform

1. **Создание приложения:**
   - Зайди в DigitalOcean App Platform
   - "Create App" → "GitHub"
   - Выбери репозиторий

2. **Настройка:**
   - **Source Directory:** `/`
   - **Build Command:** `docker build -t resume-generator .`
   - **Run Command:** `npm start`

3. **Переменные окружения:**
   - Добавь `OPENROUTER_API_KEY`

### 4. Heroku

1. **Установка Heroku CLI:**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Деплой:**
   ```bash
   # Войди в аккаунт
   heroku login
   
   # Создай приложение
   heroku create your-app-name
   
   # Добавь переменные
   heroku config:set OPENROUTER_API_KEY=your_api_key_here
   
   # Деплой
   git push heroku main
   ```

3. **Добавь в package.json:**
   ```json
   "engines": {
     "node": "18.x"
   }
   ```

### 5. VPS (Ubuntu/Debian)

1. **Подготовка сервера:**
   ```bash
   # Обновление системы
   sudo apt update && sudo apt upgrade -y
   
   # Установка Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Установка Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Деплой приложения:**
   ```bash
   # Клонируй репозиторий
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   
   # Создай .env файл
   echo "OPENROUTER_API_KEY=your_api_key_here" > .env
   
   # Запусти контейнер
   docker-compose up -d
   ```

3. **Настройка Nginx (опционально):**
   ```bash
   sudo apt install nginx
   
   # Создай конфиг
   sudo nano /etc/nginx/sites-available/resume-generator
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Локальное тестирование

Перед деплоем протестируй локально:

```bash
# Собери Docker образ
docker build -t resume-generator .

# Запусти контейнер
docker run -p 3000:3000 -e OPENROUTER_API_KEY=your_key resume-generator

# Или используй docker-compose
docker-compose up
```

## Проверка деплоя

После деплоя проверь:
1. `https://your-app-url/health` - должен вернуть `{"ok": true}`
2. `https://your-app-url/` - должен открыться интерфейс
3. Попробуй сгенерировать резюме

## Мониторинг

- **Railway:** встроенный мониторинг
- **Render:** логи в дашборде
- **VPS:** `docker-compose logs -f`

## Обновление

```bash
# Для VPS
git pull
docker-compose down
docker-compose up -d --build

# Для облачных платформ - автоматически при push в main ветку
```

## Безопасность

1. **Никогда не коммить .env файл**
2. **Используй HTTPS** (большинство платформ предоставляют автоматически)
3. **Ограничь доступ к API** если нужно
4. **Регулярно обновляй зависимости**

## Troubleshooting

**Проблема:** Puppeteer не работает
**Решение:** Убедись что в Dockerfile установлен Chromium

**Проблема:** Приложение не запускается
**Решение:** Проверь логи и переменные окружения

**Проблема:** Медленная генерация PDF
**Решение:** Увеличь ресурсы на хостинге или оптимизируй код
