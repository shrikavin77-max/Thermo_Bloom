@echo off
title THERMO-BLOOM AI - FastAPI Digital Twin Backend
echo ===================================================================
echo       Starting THERMO-BLOOM AI Digital Twin Engine (FastAPI)
echo ===================================================================
echo [INFO] Python version:
python --version
echo [INFO] Verifying core modules:
python -c "import cv2, fastapi, uvicorn, numpy; print('OpenCV:', cv2.__version__, '| FastAPI:', fastapi.__version__)"
echo.
echo [INFO] Launching Digital Twin Uvicorn server on http://localhost:8000
echo [INFO] Swagger Docs: http://localhost:8000/docs
echo [INFO] WebSocket Telemetry: ws://localhost:8000/ws/telemetry
echo [INFO] Vision Stream: http://localhost:8000/api/vision/stream
echo.
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause

