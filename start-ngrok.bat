@echo off
echo ========================================
echo   Starting ngrok tunnels
echo ========================================
echo.
echo Make sure you updated ngrok-config.yml with your authtoken!
echo Get it from: https://dashboard.ngrok.com/get-started/your-authtoken
echo.
pause
echo.
echo Starting both tunnels (backend: 3000, frontend: 5173)...
echo.
ngrok start --all --config ngrok-config.yml
