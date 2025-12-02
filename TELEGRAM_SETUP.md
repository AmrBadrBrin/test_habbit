# Запуск Habit Tracker в Telegram Mini App

## Шаг 1: Установка ngrok (для туннелирования локального сервера)

### Windows:
1. Скачайте ngrok с https://ngrok.com/download
2. Распакуйте в удобную папку
3. Зарегистрируйтесь на https://ngrok.com/ и получите authtoken
4. Откройте командную строку и выполните:
```bash
ngrok authtoken YOUR_AUTH_TOKEN
```

## Шаг 2: Создание Telegram бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)

2. Отправьте команду `/newbot`

3. Введите имя бота (например: "My Habit Tracker")

4. Введите username бота (должен заканчиваться на "bot", например: "my_habit_tracker_bot")

5. **Сохраните Bot Token** - он вам понадобится!
   Формат: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

6. **Уже добавлен в .env**: Ваш токен уже добавлен в `server/.env`

## Шаг 3: Запуск серверов

### Терминал 1 - Backend:
```bash
cd server
npm run dev
```
Должно появиться: `Server running on port 3000`

### Терминал 2 - Frontend:
```bash
cd client
npm run dev
```
Должно появиться: `Local: http://localhost:5173/`

### Терминал 3 - ngrok для Backend:
```bash
ngrok http 3000
```
**ВАЖНО**: Скопируйте URL из строки "Forwarding", например:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### Терминал 4 - ngrok для Frontend:
```bash
ngrok http 5173
```
**ВАЖНО**: Скопируйте URL из строки "Forwarding", например:
```
Forwarding  https://def456.ngrok.io -> http://localhost:5173
```

## Шаг 4: Обновление конфигурации

1. Откройте `client/.env` и измените API URL:
```env
VITE_API_URL=https://abc123.ngrok.io/api
```
(Используйте URL из ngrok для backend)

2. **Перезапустите Frontend** после изменения .env:
- Нажмите `Ctrl+C` в терминале с frontend
- Запустите снова: `npm run dev`

## Шаг 5: Создание Mini App в Telegram

1. Вернитесь к [@BotFather](https://t.me/BotFather)

2. Отправьте команду `/mybots`

3. Выберите ваш бот

4. Нажмите `Bot Settings` → `Menu Button`

5. Нажмите `Configure Menu Button` или `Edit Menu Button URL`

6. Введите название кнопки: `Открыть трекер`

7. **Введите URL из ngrok для Frontend**:
```
https://def456.ngrok.io
```

8. Готово! Нажмите `Back to Bot` → `View Bot`

## Шаг 6: Тестирование в Telegram

1. Найдите вашего бота в Telegram (по username)

2. Нажмите `START`

3. Нажмите на кнопку меню (иконка в нижнем левом углу) или нажмите кнопку `Открыть трекер`

4. Приложение должно открыться в Mini App!

## Проверка работы

### Если приложение не открывается:
1. Проверьте, что все 4 процесса запущены:
   - Backend (порт 3000)
   - Frontend (порт 5173)
   - ngrok для backend
   - ngrok для frontend

2. Проверьте консоль браузера (F12) в Telegram Web:
   - Откройте https://web.telegram.org/
   - Найдите бота и откройте Mini App
   - Проверьте ошибки в консоли

3. Проверьте правильность URL в .env:
   - `client/.env` должен содержать ngrok URL для backend
   - URL должен начинаться с `https://`

### Тестирование API:
Откройте в браузере:
```
https://abc123.ngrok.io/health
```
Должно вернуть: `{"status":"ok"}`

## Важные замечания

1. **ngrok бесплатная версия**:
   - URL меняется при каждом перезапуске ngrok
   - Нужно будет обновлять URL в .env и BotFather
   - Подписка ngrok дает статичный URL

2. **CORS**:
   - Backend настроен на принятие запросов от любых источников
   - В production нужно ограничить до конкретного домена

3. **Режим разработки**:
   - Аутентификация упрощена для локальной разработки
   - В production будет полная проверка Telegram initData

## Структура запущенных процессов

```
┌─────────────────────────────────────────┐
│         Telegram Mini App               │
│    (в приложении Telegram)              │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│     ngrok Frontend (5173)               │
│   https://def456.ngrok.io               │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│     Frontend (Vite)                     │
│   http://localhost:5173                 │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│     ngrok Backend (3000)                │
│   https://abc123.ngrok.io               │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│     Backend (Express)                   │
│   http://localhost:3000                 │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│     SQLite Database                     │
│   server/prisma/habits.db               │
└─────────────────────────────────────────┘
```

## Альтернатива ngrok

Если ngrok не работает, можно использовать:
- **localtunnel**: `npx localtunnel --port 3000`
- **Cloudflare Tunnel**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **serveo.net**: `ssh -R 80:localhost:3000 serveo.net`

## Следующие шаги

После успешного тестирования локально:
1. Деплой backend на Railway/Render
2. Деплой frontend на Vercel/Netlify
3. Обновление URL в BotFather на production URL
4. Переход на PostgreSQL для production
