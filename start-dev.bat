@echo off
echo ========================================
echo   Habit Tracker - Development Mode
echo ========================================
echo.
echo Starting Backend and Frontend...
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop all servers
echo ========================================
echo.

start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 2 >nul
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo All servers started!
echo.
echo Next steps:
echo 1. Start ngrok for backend: ngrok http 3000
echo 2. Start ngrok for frontend: ngrok http 5173
echo 3. Update client/.env with backend ngrok URL
echo 4. Restart frontend after updating .env
echo.
