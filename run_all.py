"""
THERMO-BLOOM AI - Cross-Platform Dual Runner
============================================
Launches both the FastAPI Digital Twin backend and Vite frontend simultaneously.
Usage: python run_all.py
"""

import subprocess
import sys
import os
import time
import webbrowser

def main():
    print("=" * 65)
    print("      THERMO-BLOOM AI - Dual Process Launcher")
    print("=" * 65)

    base_dir = os.path.dirname(os.path.abspath(__file__))

    # 1. Start FastAPI Backend
    print("[1/2] Launching FastAPI Digital Twin Engine (port 8000)...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=base_dir)

    # 2. Wait 1.5s for backend socket
    time.sleep(1.5)

    # 3. Start Frontend
    print("[2/2] Launching Vite Frontend Dev Server (port 5173)...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen([npm_cmd, "run", "dev"], cwd=base_dir)

    time.sleep(2.0)
    print("\n" + "=" * 65)
    print("  System Online!")
    print("  - Frontend: http://localhost:5173/orchestrator")
    print("  - Backend:  http://localhost:8000")
    print("  - Swagger:  http://localhost:8000/docs")
    print("  Press Ctrl+C to terminate both servers.")
    print("=" * 65 + "\n")

    try:
        webbrowser.open("http://localhost:5173/orchestrator")
    except Exception:
        pass

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None or frontend_proc.poll() is not None:
                break
    except KeyboardInterrupt:
        print("\n[INFO] Shutting down THERMO-BLOOM AI servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        backend_proc.wait()
        frontend_proc.wait()
        print("[INFO] Both servers successfully stopped.")

if __name__ == "__main__":
    main()

