@echo off
title THERMO-BLOOM AI - Dual Launch Orchestrator
echo ===================================================================
echo       Launching THERMO-BLOOM AI Full-Stack Platform
echo ===================================================================
echo [1/2] Starting Python FastAPI Digital Twin Backend (Port 8000)...
start "THERMO-BLOOM Backend" cmd /k run_backend.bat

echo [2/2] Starting Vite Frontend Dashboard (Port 5173)...
start "THERMO-BLOOM Frontend" cmd /k run_frontend.bat

echo ===================================================================
echo System launched!
echo - Frontend:  http://localhost:5173/orchestrator
echo - Backend:   http://localhost:8000
echo - Swagger:   http://localhost:8000/docs
echo ===================================================================

