@echo off
title THERMO-BLOOM AI - React Vite Frontend
echo ===================================================================
echo       Starting THERMO-BLOOM AI Vite Frontend Dashboard
echo ===================================================================
echo [INFO] Node version:
node -v
echo [INFO] Starting Vite development server on http://localhost:5173
echo.
call npm run dev -- --open
pause

