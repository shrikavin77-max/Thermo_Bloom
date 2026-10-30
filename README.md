# THERMO-BLOOM AI 🌿⚡
> **Elite Industrial Digital Twin & Orchestration Platform Linking Data Center Thermal/Water Management with Microalgae Cultivation**

---

## 🏆 System Architecture Overview

THERMO-BLOOM AI transforms enterprise and AI hyperscale data center operations by turning thermal dissipation and cooling tower blowdown wastewater into high-value microalgae bioproducts (*Chlorella vulgaris*, *Spirulina*, *Haematococcus pluvialis*).

```
                      +---------------------------------------+
                      |       AI GPU Server Cluster           |
                      |  Dynamic Workload Simulation (0-100%) |
                      |    Stochastic LLM Batch Surges        |
                      +-------------------+-------------------+
                                          |
                                          | Coolant Loop: Q = ṁ·Cp·ΔT (35°C - 52°C)
                                          v
                      +-------------------+-------------------+
                      |      Thermal & Workload Engine        |
                      |  - 45s Physical Inertia Lag (τ)       |
                      |  - Feed-Forward Predictive Valve Ctrl |
                      |  - Auto Emergency Heat Dump (>28.5°C) |
                      +---------+-------------------+---------+
                                |                   |
               (Bypass to Tower)|                   |(Target: 22°C - 28°C)
                                v                   v
   +----------------------------+--+     +----------+----------------------------+
   |   Cooling Tower Blowdown      |     |     Photobioreactor Cultivation       |
   |      Water Screener           |     |         & Bio-Vision Engine           |
   |  - pH, TDS, ORP, Biocide      |     |  - OpenCV OD680 & Biomass (g/L)       |
   |  - SAFE / PRE-TREAT / REJECT  |     |  - Hue Shift (Chlorosis Detection)    |
   |  - UV Photolysis Decay Model  |---->|  - Cell Flocculation & Clumping Index |
   |  - Safe Dilution Ratio (SDR)  |     |  - Container Wall Biofilm Inspection  |
   +-------------------------------+     +------------------+--------------------+
                                                            |
                                                            v
                      +-------------------------------------+--------------------+
                      |         Tri-Objective Dynamic Optimization Engine         |
                      |  1. MAX_COMPUTE_COOLING : Zero Throttling, Max PUE Cut    |
                      |  2. BIO_HARVEST_MAXIMIZER: PBR Locked 24-26°C, Peak Yield |
                      |  3. ECO_BALANCED (Pareto): Multi-Objective OPEX Optimum   |
                      +----------------------------------------------------------+
```

---

## 🔬 Core Components

### 1. Thermal & Workload Engine (`backend/thermal_engine.py`)
- **GPU Telemetry Simulation:** Generates dynamic server rack load data (0–100%) featuring realistic intermittent bursts (e.g., LLM batch training bursts).
- **Thermodynamics & Inertia:** Models server coolant outlet temperatures (35°C to 52°C) with realistic physical delay (30–60 second thermal lag, $\tau = 45\text{s}$) based on heat rejection ($Q = \dot{m} C_p \Delta T$).
- **Predictive Mixing Valve Control:** Feed-forward control loop. The microalgae biological window is strictly 22°C–28°C (lethal threshold >34°C). The algorithm calculates derivatives $\frac{d(\text{Load})}{dt}$ and predicted thermal waves to pre-buffer surges via a 3-way proportional mixing valve (0–100%).
- **Emergency Dump:** Triggers automatic bypass if incoming thermal loads exceed safe dissipation capacities or if reactor temperature breaches 28.5°C, slamming valve to 0% bypass.

### 2. Bio-Vision & Stress Diagnostics (`backend/algae_vision.py`)
- **OpenCV Biomass & Optical Density Processing:** Accepts camera frames of microalgae cultures, filters background reflections and glare, converts to HSV and CIE $L^*a^*b^*$ color spaces to calculate green pixel ratio and optical density ($\text{OD}_{680}$ mapped to 0.1–3.0 g/L).
- **Early Warning Health Diagnostics:**
  - *Color Hue Shift:* Detects shifts from deep green toward yellow/brown (signaling chlorosis, nitrogen depletion, or thermal stress).
  - *Cell Flocculation / Clumping:* Uses Canny edge-detection and contour area variance to identify rapid cell aggregation (stress response to heat or biocides).
  - *Wall Biofilm Buildup:* Measures opacity/contrast changes along container edges to track biofouling and flag required cleaning cycles.
- **Visual Annotations & Headless Generation:** Outputs clean annotated frames with HUD overlays, bounding boxes, and an exportable JSON health payload:
  ```json
  {
    "od680": 1.84,
    "biomass_g_L": 1.67,
    "health_status": "OPTIMAL",
    "clumping_index": 0.08,
    "fouling_detected": false,
    "action": "Culture parameters within optimal photosynthetic productivity zone."
  }
  ```
  Includes high-fidelity synthetic culture generator streaming multipart MJPEG (`/api/vision/stream`) and base64 payloads.

### 3. Cooling Tower Water Suitability & Toxicity Screener (`backend/water_screener.py`)
- **Multi-Parameter Chemical Screening:** Evaluates pH (6.0–9.5), Total Dissolved Solids / TDS (ppm), Oxidation-Reduction Potential / ORP (mV), Turbidity (NTU), and active biocide levels (ppm, e.g. isothiazolinone or free chlorine).
- **Automated Classification & Decay Modeling:**
  - `SAFE_REUSE`: Low TDS (<800 ppm), ORP < 250 mV, biocide < 0.1 ppm.
  - `PRE_TREAT_REQUIRED`: Biocide 0.1–2.0 ppm or TDS 800–1800 ppm. Calculates UV/aeration retention time ($C(t) = C_0 e^{-kt}$) and Safe Dilution Ratio (SDR) with makeup water:
    $$SDR = \max\left(0, \frac{TDS_{\text{blowdown}} - 750}{750 - TDS_{\text{makeup}}}\right)$$
  - `REJECT_TO_DRAIN`: Dangerous biocide (>2.0 ppm) or high TDS (>2000 ppm).
- **Cumulative Metrics:** Tracks daily freshwater saved and projected 24-hour water recovery.

### 4. Tri-Objective Optimization Engine (`backend/optimizer.py`)
Dynamic mode switch solving trade-offs between competing operational priorities:
- **`MAX_COMPUTE_COOLING`:** Maximizes heat rejection rate and PUE reduction; aggressively uses emergency bypass to ensure servers never throttle.
- **`BIO_HARVEST_MAXIMIZER`:** Locks photobioreactor temperature strictly to 24°C–26°C and rejects borderline water streams to maximize biomass yield (up to 2.45 g/L/day).
- **`ECO_BALANCED` (Pareto Mode):** Co-optimizes PUE reduction, blowdown water recovery (>88%), and net OPEX savings (+$1,071/day net value).

### 5. Interactive UI Dashboard (`src/pages/OrchestratorDashboardPage.tsx`)
High-contrast industrial dark-mode theme (slate/charcoal `#0B0F17`, emerald bio-green `#10B981`, thermal orange `#F97316`):
- **Live Telemetry Strip:** Real-time GPU Load (%), Coolant Temp (°C), Bioreactor Temp (°C), Valve Position (%), and Water Suitability status.
- **Interactive Controls:** Toggle between the 3 optimization modes; sliders to inject simulated GPU workload surges (+15% to +50%) or cooling tower biocide spikes (0.05 to 2.5 ppm); vision stress presets; manual vs autonomous feed-forward valve authority.
- **Vision Stream Card:** Live annotated OpenCV feed with live $\text{OD}_{680}$, cell stress warnings, biomass yield projections, and interactive sample upload tool.
- **Water Screener Panel:** Full chemical parameter telemetry, UV-C retention timer, and interactive custom water screener.
- **Impact Metrics:** Display concrete, auditable metrics:
  - $\Delta \text{PUE}$ reduction: From 1.350 down to 1.180 (-0.170 PUE)
  - Daily cooling water saved: ~39,500 L/day
  - Biomass produced: 11.7 kg/day ($877/day market value)
  - Chiller energy avoided: 460.8 kWh/day & 7.8 metric tons $\text{CO}_2$/year captured.

---

## ⚡ Quick Start & Running the Stack

You can launch both the Python backend and Vite frontend with a single command.

### Option A: One-Click Dual Launcher (Windows)
Double-click or run from PowerShell:
```cmd
.\run_all.bat
```
*Starts the Python FastAPI backend on port 8000 and the Vite frontend on port 5173 simultaneously, automatically opening your browser at `http://localhost:5173/orchestrator`.*

### Option B: Cross-Platform Python Launcher (Windows / Linux / macOS)
```bash
python run_all.py
```

### Option C: Manual Launch (Separate Terminals)

**Terminal 1 — Backend (FastAPI + OpenCV):**
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`
- WebSocket Telemetry: `ws://localhost:8000/ws/telemetry`
- Live MJPEG Stream: `http://localhost:8000/api/vision/stream`

**Terminal 2 — Frontend (React 19 + Vite):**
```bash
npm run dev
```
- Open: `http://localhost:5173/orchestrator`

---

## ☁️ Cloud Deployment Guide (Vercel + Render)

THERMO-BLOOM AI is engineered for two-tier cloud deployment: the **FastAPI + OpenCV backend on Render** and the **React + Vite frontend on Vercel**.

### Step 1: Deploy Backend to Render

1. Sign in to [Render](https://render.com) and click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository.
3. Configure the following service settings:
   - **Name:** `thermo-bloom-backend` (or your choice)
   - **Environment:** `Python 3`
   - **Region:** Choose the region closest to your users
   - **Branch:** `main`
   - **Root Directory:** *(leave blank for repository root)*
   - **Build Command:**
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command:**
     ```bash
     uvicorn backend.main:app --host 0.0.0.0 --port $PORT
     ```
4. In **Environment Variables**, add:
   - `CORS_ORIGINS`: Set to your Vercel frontend URL (e.g. `https://your-thermo-bloom.vercel.app`) once known, or comma-separated list of origins.
   - `CORS_ORIGIN_REGEX`: `https://.*\.vercel\.app` *(automatically permits Vercel preview branch deployments)*.
5. Click **Create Web Service**. Once deployed, copy your backend URL (e.g. `https://thermo-bloom-backend.onrender.com`).

---

### Step 2: Deploy Frontend to Vercel

1. Sign in to [Vercel](https://vercel.com) and click **Add New...** $\rightarrow$ **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-service.onrender.com` *(your live Render backend URL, without a trailing slash)*
5. Click **Deploy**.
   - React Router SPA deep links are handled automatically by [`vercel.json`](./vercel.json).
   - The frontend will automatically derive `wss://` for secure live WebSocket telemetry.

---

## 🧪 Automated Test Suite

THERMO-BLOOM AI comes with a comprehensive automated test suite verifying all 4 mathematical engines and REST endpoints:

```bash
# Run all unit and integration tests:
python -m unittest discover -s backend -p "test_*.py" -v
```

Output:
```
test_optimizer_modes_and_pareto (backend.test_suite.TestThermoBloomSystem) ... ok
test_thermal_predictive_valve_and_emergency_dump (backend.test_suite.TestThermoBloomSystem) ... ok
test_thermal_steady_state_and_inertia (backend.test_suite.TestThermoBloomSystem) ... ok
test_vision_biomass_and_od_extraction (backend.test_suite.TestThermoBloomSystem) ... ok
test_vision_stress_diagnostics (backend.test_suite.TestThermoBloomSystem) ... ok
test_water_screener_classification (backend.test_suite.TestThermoBloomSystem) ... ok
test_impact_metrics_endpoint (backend.test_api.TestFastAPIEndpoints) ... ok
test_mode_change (backend.test_api.TestFastAPIEndpoints) ... ok
test_root_and_status (backend.test_api.TestFastAPIEndpoints) ... ok
test_spike_injection (backend.test_api.TestFastAPIEndpoints) ... ok
test_telemetry (backend.test_api.TestFastAPIEndpoints) ... ok
test_vision_frame_endpoint (backend.test_api.TestFastAPIEndpoints) ... ok
test_water_screening_endpoint (backend.test_api.TestFastAPIEndpoints) ... ok

----------------------------------------------------------------------
Ran 13 tests in 0.222s

OK
```

---

## 📊 Concrete Impact Accounting

| Impact Dimension | Traditional Data Center | THERMO-BLOOM AI Digital Twin | Net Difference |
|---|---|---|---|
| **PUE (Power Usage Effectiveness)** | 1.350 | **1.180** (down to 1.15 in Cooling Mode) | **-0.170 PUE (-12.6% facility power)** |
| **Cooling Tower Water Loss** | 45,000 L / day blowdown drain | **Recycles 39,500 L / day** (>88% reuse) | **+14.4 Million Liters saved/year** |
| **Mechanical Chiller Load** | 100% mechanical compressor load | **Offloads 460+ kWh/day** waste heat | **-$20,184 / year electricity cut** |
| **Bioproduct Revenue** | $0 (waste thermal venting) | **11.7 kg/day** nutraceutical biomass | **+$320,287 / year revenue (@$75/kg)** |
| **Carbon Sequestration** | 0 t CO₂ captured | **7.81 metric tons CO₂ / year** fixed | **Net carbon-negative thermal loop** |
| **Net OPEX Savings** | Baseline | **+$390,933 / year net savings** | **Payback Period: < 14 months** |
