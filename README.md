# Habit Tracker - Telegram Mini App

Трекер привычек для Telegram Mini App с визуализацией прогресса и статистикой.

## Структура проекта

```
mini_app_new/
├── client/          # Frontend (React + TypeScript + Vite)
├── server/          # Backend (Node.js + Express + Prisma)
└── SPECIFICATION.md # Детальная спецификация проекта
```

## Установка

### Требования
- Node.js 20+
- PostgreSQL (или используйте SQLite в development)

### Backend

1. Перейдите в папку server:
```bash
cd server
```

2. Скопируйте `.env.example` в `.env` и заполните переменные:
```bash
cp .env.example .env
```

3. Установите зависимости:
```bash
npm install
```

4. Настройте базу данных:
```bash
# Сгенерировать Prisma Client
npm run prisma:generate

# Создать миграции
npm run prisma:migrate
```

5. Запустите сервер:
```bash
npm run dev
```

Сервер будет доступен на `http://localhost:3000`

### Frontend

1. Перейдите в папку client:
```bash
cd client
```

2. Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

3. Установите зависимости:
```bash
npm install
```

4. Запустите dev сервер:
```bash
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

## Разработка

### Dev режим с автоматической перезагрузкой:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### Работа с базой данных:

**Открыть Prisma Studio (GUI для БД):**
```bash
cd server
npm run prisma:studio
```

**Создать новую миграцию:**
```bash
cd server
npm run prisma:migrate
```

## Настройка Telegram Mini App

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите Bot Token и добавьте в `server/.env`
3. Настройте Mini App URL в BotFather
4. Разверните frontend на хостинге (Vercel/Netlify)
5. Укажите URL вашего frontend в настройках бота

## Основные фичи

- **Bottom Tab Navigation** - 3 вкладки (Главная, Привычки, Профиль)
- **Отслеживание привычек** - быстрое выполнение и streak счетчик
- **Статистика** - визуализация прогресса по дням недели
- **Безопасность** - каждый пользователь видит только свои привычки
- **Telegram интеграция** - аутентификация через Telegram

## Технологии

### Frontend
- React 18 + TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Zustand (state management)
- Telegram Mini App SDK
- Recharts (графики)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Telegram Web App authentication

## Безопасность

**ВАЖНО:** Все данные фильтруются по `user_id`. Каждый пользователь видит только свои привычки благодаря:
- Валидации Telegram `initData`
- Автоматической привязке привычек к `user_id`
- Проверке принадлежности данных при каждом запросе

## Деплой

См. раздел "Этап 7: Деплой" в [SPECIFICATION.md](./SPECIFICATION.md)

## Лицензия

ISC
