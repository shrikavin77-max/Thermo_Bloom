"""
THERMO-BLOOM AI - Orchestrator & Digital Twin Server
===================================================
Production FastAPI application linking:
1. ThermalEngine (backend/thermal_engine.py)
2. AlgaeVisionDiagnostics (backend/algae_vision.py)
3. WaterScreener (backend/water_screener.py)
4. TriObjectiveOptimizer (backend/optimizer.py)

Exposes WebSocket and REST endpoints for real-time telemetry, MJPEG vision stream,
and dynamic mode/surge control.
"""

import asyncio
import time
import json
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import cv2
import numpy as np

from backend.thermal_engine import ThermalEngine
from backend.algae_vision import AlgaeVisionDiagnostics
from backend.water_screener import WaterScreener
from backend.optimizer import TriObjectiveOptimizer, OptimizationMode


# Pydantic Schemas for API Requests
class ModeChangeRequest(BaseModel):
    mode: OptimizationMode

class SpikeInjectionRequest(BaseModel):
    type: str  # "gpu_surge" | "water_contamination" | "vision_stress"
    magnitude: Optional[float] = None
    duration_seconds: Optional[float] = None
    stress_type: Optional[str] = None  # For vision: "CHLOROSIS", "THERMAL_SHOCK", "BIOCIDE_TOXICITY", "OPTIMAL"

class WaterScreenRequest(BaseModel):
    ph: Optional[float] = None
    tds_ppm: Optional[float] = None
    orp_mv: Optional[float] = None
    turbidity_ntu: Optional[float] = None
    biocide_ppm: Optional[float] = None

class ValveOverrideRequest(BaseModel):
    valve_position_pct: float
    manual: bool = False


# System Global Orchestrator State
class SystemOrchestrator:
    def __init__(self):
        self.thermal = ThermalEngine()
        self.vision = AlgaeVisionDiagnostics()
        self.water = WaterScreener()
        self.optimizer = TriObjectiveOptimizer()

        self.vision_stress_mode = "OPTIMAL"
        self.vision_clumping = 0.05
        self.vision_fouling = 0.0
        self.manual_valve_override = False
        self.manual_valve_pct = 50.0

        # Latest cache
        self.latest_thermal: Dict[str, Any] = {}
        self.latest_water: Dict[str, Any] = {}
        self.latest_vision_payload: Dict[str, Any] = {}
        self.latest_optimizer: Dict[str, Any] = {}
        self.latest_annotated_frame: Optional[np.ndarray] = None

        # WebSocket subscribers
        self.active_websockets: set[WebSocket] = set()
        self.is_running = True

        # Initial tick to populate all caches immediately
        self.update_tick(0.1)

    def update_tick(self, dt: float = 0.5):
        # 1. Thermal Step
        self.latest_thermal = self.thermal.step(dt)
        if self.manual_valve_override:
            self.thermal.valve_position_pct = self.manual_valve_pct

        # 2. Water Step
        self.latest_water = self.water.step(dt)

        # 3. Algae Vision Step
        # Auto-link thermal or water stress to vision if appropriate
        current_stress = self.vision_stress_mode
        if self.thermal.emergency_dump_active or self.thermal.bioreactor_temp_c > 29.5:
            current_stress = "THERMAL_SHOCK"
        elif self.water.current_stream["biocide_ppm"] > 0.8:
            current_stress = "BIOCIDE_TOXICITY"

        raw_frame = self.vision.generate_synthetic_culture_frame(
            stress_mode=current_stress,
            clumping_severity=self.vision_clumping,
            fouling_severity=self.vision_fouling
        )
        self.latest_annotated_frame, self.latest_vision_payload = self.vision.process_frame(raw_frame)

        # 4. Tri-Objective Optimizer Step
        self.latest_optimizer = self.optimizer.optimize(
            self.latest_thermal,
            self.latest_water,
            self.latest_vision_payload
        )

    def get_unified_telemetry(self) -> Dict[str, Any]:
        return {
            "timestamp": time.time(),
            "thermal": self.latest_thermal,
            "water": self.latest_water,
            "vision": self.latest_vision_payload,
            "optimizer": self.latest_optimizer,
            "orchestrator": {
                "active_mode": self.optimizer.current_mode.value,
                "manual_valve_override": self.manual_valve_override,
                "vision_stress_mode": self.vision_stress_mode,
            }
        }


orchestrator = SystemOrchestrator()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize first tick
    orchestrator.update_tick(0.5)

    # Start continuous background simulation loop (2 Hz = 500 ms ticks)
    async def simulation_loop():
        while orchestrator.is_running:
            try:
                orchestrator.update_tick(0.5)
                # Broadcast to connected WebSockets
                if orchestrator.active_websockets:
                    payload = orchestrator.get_unified_telemetry()
                    text_msg = json.dumps(payload)
                    disconnected = []
                    for ws in orchestrator.active_websockets:
                        try:
                            await ws.send_text(text_msg)
                        except Exception:
                            disconnected.append(ws)
                    for dead in disconnected:
                        orchestrator.active_websockets.discard(dead)
            except Exception as e:
                print(f"[ERROR in simulation_loop]: {e}")
            await asyncio.sleep(0.5)

    bg_task = asyncio.create_task(simulation_loop())
    yield
    orchestrator.is_running = False
    bg_task.cancel()


app = FastAPI(
    title="THERMO-BLOOM AI Digital Twin API",
    description="Backend orchestration engine linking data center thermal/water management with microalgae cultivation.",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "system": "THERMO-BLOOM AI Digital Twin",
        "status": "ONLINE",
        "docs_url": "/docs",
        "active_mode": orchestrator.optimizer.current_mode.value
    }


@app.get("/api/status")
def get_status():
    return {
        "status": "ONLINE",
        "telemetry_tick_hz": 2,
        "active_mode": orchestrator.optimizer.current_mode.value,
        "bioreactor_temp": orchestrator.latest_thermal.get("bioreactor_temp_c"),
        "valve_position": orchestrator.latest_thermal.get("valve_position_pct"),
        "emergency_bypass": orchestrator.latest_thermal.get("emergency_dump_active"),
        "water_suitability": orchestrator.latest_water.get("classification"),
        "culture_health": orchestrator.latest_vision_payload.get("health_status"),
        "active_ws_clients": len(orchestrator.active_websockets)
    }


@app.get("/api/telemetry")
def get_telemetry():
    """Returns instantaneous unified telemetry snapshot."""
    return orchestrator.get_unified_telemetry()


@app.post("/api/control/mode")
def set_optimization_mode(req: ModeChangeRequest):
    """Dynamically switch between MAX_COMPUTE_COOLING, BIO_HARVEST_MAXIMIZER, and ECO_BALANCED."""
    orchestrator.optimizer.set_mode(req.mode)
    orchestrator.update_tick(0.1)
    return {
        "status": "SUCCESS",
        "new_mode": req.mode.value,
        "optimizer": orchestrator.latest_optimizer
    }


@app.post("/api/control/inject-spike")
def inject_spike(req: SpikeInjectionRequest):
    """
    Inject simulated workloads or contamination:
    - gpu_surge: intense GPU batch training burst.
    - water_contamination: biocide / TDS spike.
    - vision_stress: shift culture to CHLOROSIS, THERMAL_SHOCK, BIOCIDE_TOXICITY, or OPTIMAL.
    """
    if req.type == "gpu_surge":
        mag = req.magnitude or 38.0
        dur = req.duration_seconds or 25.0
        orchestrator.thermal.inject_workload_surge(mag, dur)
        return {"status": "INJECTED", "type": "gpu_surge", "magnitude": mag, "duration_s": dur}

    elif req.type == "water_contamination":
        biocide = req.magnitude or 1.65
        tds = 1450.0
        orchestrator.water.inject_contamination_surge(biocide, tds)
        return {"status": "INJECTED", "type": "water_contamination", "biocide_ppm": biocide, "tds_ppm": tds}

    elif req.type == "vision_stress":
        stress_mode = req.stress_type or "THERMAL_SHOCK"
        orchestrator.vision_stress_mode = stress_mode
        if stress_mode == "BIOCIDE_TOXICITY":
            orchestrator.vision_clumping = 0.82
            orchestrator.vision_fouling = 0.4
        elif stress_mode == "THERMAL_SHOCK":
            orchestrator.vision_clumping = 0.65
            orchestrator.vision_fouling = 0.6
        elif stress_mode == "CHLOROSIS":
            orchestrator.vision_clumping = 0.15
            orchestrator.vision_fouling = 0.2
        else: # OPTIMAL
            orchestrator.vision_clumping = 0.05
            orchestrator.vision_fouling = 0.0

        return {"status": "INJECTED", "type": "vision_stress", "stress_mode": stress_mode}

    raise HTTPException(status_code=400, detail=f"Unknown spike type: {req.type}")


@app.post("/api/control/valve")
def override_valve(req: ValveOverrideRequest):
    """Manual override or re-engagement of feed-forward proportional mixing valve."""
    orchestrator.manual_valve_override = req.manual
    if req.manual:
        orchestrator.manual_valve_pct = max(0.0, min(100.0, req.valve_position_pct))
    orchestrator.update_tick(0.1)
    return {
        "status": "UPDATED",
        "manual_override": orchestrator.manual_valve_override,
        "valve_position_pct": orchestrator.thermal.valve_position_pct
    }


@app.post("/api/water/screen")
def screen_water_sample(req: WaterScreenRequest):
    """Run chemical screening and decay modeling on custom water parameters."""
    res = orchestrator.water.screen_stream(
        ph=req.ph,
        tds_ppm=req.tds_ppm,
        orp_mv=req.orp_mv,
        turbidity_ntu=req.turbidity_ntu,
        biocide_ppm=req.biocide_ppm
    )
    return res


@app.get("/api/vision/frame")
def get_vision_frame():
    """Returns base64 data URI encoded annotated frame + diagnostics JSON."""
    if orchestrator.latest_annotated_frame is None:
        orchestrator.update_tick(0.1)
    b64_img = orchestrator.vision.frame_to_base64_jpeg(orchestrator.latest_annotated_frame)
    return {
        "frame_base64": b64_img,
        "diagnostics": orchestrator.latest_vision_payload
    }


@app.get("/api/vision/stream")
def get_mjpeg_stream():
    """High-performance multipart MJPEG streaming endpoint for direct <img> tags."""
    def generate():
        while True:
            if orchestrator.latest_annotated_frame is not None:
                jpeg_bytes = orchestrator.vision.frame_to_mjpeg_bytes(orchestrator.latest_annotated_frame)
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" + jpeg_bytes + b"\r\n"
                )
            time.sleep(0.1)  # ~10 FPS stream

    return StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")


@app.post("/api/vision/analyze")
async def analyze_uploaded_image(file: UploadFile = File(...)):
    """Accepts an uploaded image file of microalgae culture and performs full OpenCV diagnostics."""
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Could not decode image file.")

    annotated, payload = orchestrator.vision.process_frame(img)
    b64_result = orchestrator.vision.frame_to_base64_jpeg(annotated)
    return {
        "annotated_frame": b64_result,
        "diagnostics": payload
    }


@app.get("/api/impact/metrics")
def get_impact_metrics():
    """Concrete, auditable impact & sustainability metrics."""
    return orchestrator.latest_optimizer.get("auditable_impact_metrics", {})


@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    """High-frequency synchronized WebSocket stream broadcasting digital twin telemetry at 2 Hz."""
    await websocket.accept()
    orchestrator.active_websockets.add(websocket)
    try:
        # Send initial snapshot immediately
        await websocket.send_text(json.dumps(orchestrator.get_unified_telemetry()))
        while True:
            # Keep socket open and listen for optional client commands
            data = await websocket.receive_text()
            try:
                cmd = json.loads(data)
                if cmd.get("action") == "set_mode":
                    mode_val = cmd.get("mode")
                    orchestrator.optimizer.set_mode(OptimizationMode(mode_val))
                elif cmd.get("action") == "inject_spike":
                    orchestrator.thermal.inject_workload_surge(35.0, 20.0)
            except Exception:
                pass
    except WebSocketDisconnect:
        orchestrator.active_websockets.discard(websocket)
    except Exception:
        orchestrator.active_websockets.discard(websocket)
