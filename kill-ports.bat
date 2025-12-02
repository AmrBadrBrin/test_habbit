@echo off
echo Stopping all Node processes on ports 3000 and 5173...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if not "%%a"=="0" (
        echo Killing process %%a on port 3000
        taskkill /F /PID %%a 2>nul
    )
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    if not "%%a"=="0" (
        echo Killing process %%a on port 5173
        taskkill /F /PID %%a 2>nul
    )
)

echo.
echo Done! Ports 3000 and 5173 are now free.
echo.
pause
