# Настройка ngrok для двух туннелей

## Проблема
Бесплатная версия ngrok позволяет только 1 одновременную сессию. Но нам нужно 2 туннеля: для backend (3000) и frontend (5173).

## Решение: Использовать ngrok config файл

### Шаг 1: Получите ваш authtoken

1. Зайдите на https://dashboard.ngrok.com/get-started/your-authtoken
2. Скопируйте ваш authtoken (выглядит как: `2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p`)

### Шаг 2: Обновите конфигурационный файл

1. Откройте файл: `ngrok-config.yml` (он уже создан в папке проекта)
2. Замените `YOUR_AUTHTOKEN_HERE` на ваш authtoken:

```yaml
version: "2"
authtoken: 2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p
tunnels:
  backend:
    proto: http
    addr: 3000
  frontend:
    proto: http
    addr: 5173
```

### Шаг 3: Запустите оба туннеля одной командой

Откройте командную строку и выполните:

```bash
cd C:\Users\badre\OneDrive\Рабочий стол\mini_app_new
ngrok start --all --config ngrok-config.yml
```

Или если ngrok в другой папке:
```bash
cd C:\путь\к\ngrok
ngrok start --all --config "C:\Users\badre\OneDrive\Рабочий стол\mini_app_new\ngrok-config.yml"
```

Вы увидите:

```
Session Status                online
Account                       ваш_аккаунт
Version                       3.x.x

Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
Forwarding                    https://def456.ngrok.io -> http://localhost:5173
```

**СКОПИРУЙТЕ ОБА URL!**

---

## Альтернатива: Использовать только 1 ngrok для frontend + localtunnel для backend

Если ngrok config не работает, можно использовать разные сервисы:

### Вариант A: localtunnel для backend

1. **Установите localtunnel** (один раз):
```bash
npm install -g localtunnel
```

2. **Запустите localtunnel для backend**:
```bash
lt --port 3000
```

Вы получите URL типа: `https://random-name-123.loca.lt`

3. **Запустите ngrok для frontend**:
```bash
ngrok http 5173
```

### Вариант B: Cloudflare Tunnel (бесплатно, без ограничений)

1. **Установите cloudflared**:
   - Скачайте: https://github.com/cloudflare/cloudflared/releases
   - Или через winget: `winget install Cloudflare.cloudflared`

2. **Запустите туннель для backend**:
```bash
cloudflared tunnel --url http://localhost:3000
```

3. **Запустите ngrok для frontend**:
```bash
ngrok http 5173
```

---

## Следующие шаги после запуска туннелей

1. **Обновите `client\.env`**:
```env
VITE_API_URL=https://ваш-backend-url.ngrok.io/api
```
(Используйте URL backend туннеля)

2. **Перезапустите frontend**:
   - Нажмите Ctrl+C в окне с `npm run dev` (client)
   - Запустите снова: `npm run dev`

3. **Настройте бота**:
   - [@BotFather](https://t.me/BotFather) → `/mybots` → ваш бот
   - Bot Settings → Menu Button → Configure
   - URL: `https://ваш-frontend-url.ngrok.io`

4. **Откройте в Telegram!**

---

## Рекомендация

Самый простой способ для локальной разработки:
- **ngrok config файл** (если у вас есть authtoken)
- **Cloudflare Tunnel для backend + ngrok для frontend** (если config не работает)

Cloudflare Tunnel бесплатный и без ограничений, отличная альтернатива!
