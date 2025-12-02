@echo off
echo ========================================
echo   Habit Tracker - Starting All Services
echo ========================================
echo.
echo This will open 4 windows:
echo 1. Backend Server (port 3000)
echo 2. Frontend Server (port 5173)
echo 3. Localtunnel for Backend
echo 4. Ready for ngrok (you'll start manually)
echo.
pause
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm run dev"
timeout /t 3 >nul

echo Starting Localtunnel for Backend...
start "Localtunnel Backend" cmd /k "npx localtunnel --port 3000"
timeout /t 2 >nul

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for all windows to show "ready" or "running"
echo 2. Copy the URL from Localtunnel window
echo 3. Open http://localhost:5173 in browser to check frontend
echo 4. Run: ngrok http 5173 (in a new cmd window)
echo 5. Copy ngrok URL
echo.
echo Press any key to exit this window...
pause >nul
