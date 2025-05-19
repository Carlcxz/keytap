@echo off
:: Check if node is available
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

:: Run your Node.js app
node index.js

:: Keep window open
echo.
echo Press any key to exit...
pause >nul
