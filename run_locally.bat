@echo off
title Thermo-Bloom Local Launcher
echo ===================================================
echo        Starting THERMO-BLOOM Locally...
echo ===================================================
echo.

:: Check for node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system PATH.
    echo Please install Node.js from https://nodejs.org/ to run this project.
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] node_modules not detected. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo [INFO] Launching Vite development server...
echo [INFO] Your browser will open at http://localhost:5173/
echo [INFO] Press Ctrl+C in this window anytime to stop the server.
echo.

call npm run dev -- --open
pause
