/**
 * THERMO-BLOOM AI - Backend Integration & Telemetry Service
 * ========================================================
 * Connects the React frontend with the FastAPI orchestration server:
 * - Live WebSocket stream at ws://localhost:8000/ws/telemetry (2 Hz synchronized)
 * - REST API endpoints for optimization mode, workload/water spikes, and OpenCV vision
 * - High-fidelity client-side fallback simulation if backend is launching or offline
 */

export interface ThermalTelemetry {
  server_load_pct: number;
  target_server_load_pct: number;
  coolant_inlet_temp_c: number;
  coolant_outlet_temp_c: number;
  bioreactor_temp_c: number;
  valve_position_pct: number;
  emergency_dump_active: boolean;
  burst_active: boolean;
  burst_magnitude: number;
  total_heat_generated_kw: number;
  heat_absorbed_by_algae_kw: number;
  heat_rejected_to_tower_kw: number;
  bio_temp_status: 'OPTIMAL_GROWTH' | 'THERMAL_STRESS_HIGH' | 'LETHAL_OVERHEAT' | 'SUB_OPTIMAL_CHILL';
  biological_window: {
    min_c: number;
    max_c: number;
    target_c: number;
    lethal_threshold_c: number;
  };
}

export interface WaterTelemetry {
  classification: 'SAFE_REUSE' | 'PRE_TREAT_REQUIRED' | 'REJECT_TO_DRAIN';
  ph: number;
  tds_ppm: number;
  orp_mv: number;
  turbidity_ntu: number;
  biocide_ppm: number;
  reasons: string[];
  treatment_steps: string[];
  retention_time_minutes: number;
  safe_dilution_ratio: number;
  recovery_efficiency_pct: number;
  cumulative_freshwater_saved_liters: number;
  cumulative_blowdown_diverted_liters: number;
  projected_daily_freshwater_saved_liters: number;
}

export interface VisionDiagnostics {
  od680: number;
  biomass_g_L: number;
  health_status: 'OPTIMAL' | 'STRESSED' | 'CRITICAL';
  clumping_index: number;
  fouling_detected: boolean;
  action: string;
  mean_hue: number;
  green_pixel_ratio: number;
  hue_shift_detected: boolean;
  hue_diagnosis: string;
}

export interface ImpactMetrics {
  baseline_pue: number;
  current_optimized_pue: number;
  delta_pue_reduction: number;
  daily_cooling_water_saved_liters: number;
  daily_water_savings_usd: number;
  daily_biomass_produced_kg: number;
  daily_biomass_market_value_usd: number;
  daily_chiller_energy_avoided_kwh: number;
  daily_electricity_savings_usd: number;
  daily_co2_captured_kg: number;
  annual_co2_captured_metric_tons: number;
  net_daily_opex_savings_usd: number;
  annual_opex_savings_usd: number;
}

export interface OptimizerTelemetry {
  mode: 'MAX_COMPUTE_COOLING' | 'BIO_HARVEST_MAXIMIZER' | 'ECO_BALANCED';
  pareto_score: number;
  mode_rationale: string;
  control_setpoints: {
    target_pbr_temp_c: number;
    pbr_temp_min_c: number;
    pbr_temp_max_c: number;
    bypass_sensitivity: string;
    water_intake_mode: string;
  };
  auditable_impact_metrics: ImpactMetrics;
}

export interface UnifiedTelemetry {
  timestamp: number;
  thermal: ThermalTelemetry;
  water: WaterTelemetry;
  vision: VisionDiagnostics;
  optimizer: OptimizerTelemetry;
  orchestrator: {
    active_mode: string;
    manual_valve_override: boolean;
    vision_stress_mode: string;
  };
}

const BACKEND_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

class BackendApiService {
  private ws: WebSocket | null = null;
  private subscribers: ((data: UnifiedTelemetry, isLive: boolean) => void)[] = [];
  private isConnected = false;
  private reconnectInterval: any = null;
  public fallbackInterval: any = null;

  // Local state for seamless offline fallback
  private localState: UnifiedTelemetry = this.createDefaultTelemetry();

  constructor() {
    this.initWebSocket();
    this.startFallbackSimulation();
  }

  private createDefaultTelemetry(): UnifiedTelemetry {
    return {
      timestamp: Date.now() / 1000,
      thermal: {
        server_load_pct: 64.0,
        target_server_load_pct: 64.0,
        coolant_inlet_temp_c: 32.0,
        coolant_outlet_temp_c: 42.8,
        bioreactor_temp_c: 25.4,
        valve_position_pct: 62.0,
        emergency_dump_active: false,
        burst_active: false,
        burst_magnitude: 0,
        total_heat_generated_kw: 138.5,
        heat_absorbed_by_algae_kw: 72.8,
        heat_rejected_to_tower_kw: 65.7,
        bio_temp_status: 'OPTIMAL_GROWTH',
        biological_window: {
          min_c: 22.0,
          max_c: 28.0,
          target_c: 25.0,
          lethal_threshold_c: 34.0,
        },
      },
      water: {
        classification: 'SAFE_REUSE',
        ph: 7.4,
        tds_ppm: 680.0,
        orp_mv: 195.0,
        turbidity_ntu: 3.8,
        biocide_ppm: 0.03,
        reasons: ['All chemical parameters within optimal biological thresholds.'],
        treatment_steps: ['Direct injection into photobioreactor circulation & nutrient balance manifold.'],
        retention_time_minutes: 0,
        safe_dilution_ratio: 0,
        recovery_efficiency_pct: 98.0,
        cumulative_freshwater_saved_liters: 14850,
        cumulative_blowdown_diverted_liters: 15150,
        projected_daily_freshwater_saved_liters: 42336,
      },
      vision: {
        od680: 1.84,
        biomass_g_L: 1.67,
        health_status: 'OPTIMAL',
        clumping_index: 0.08,
        fouling_detected: false,
        action: 'Culture parameters within optimal photosynthetic productivity zone.',
        mean_hue: 56.5,
        green_pixel_ratio: 0.985,
        hue_shift_detected: false,
        hue_diagnosis: 'NORMAL_GREEN',
      },
      optimizer: {
        mode: 'ECO_BALANCED',
        pareto_score: 0.96,
        mode_rationale:
          'Operating along the Pareto frontier. Simultaneously trimming DC cooling OPEX, recycling >88% of cooling tower blowdown, and generating steady biomass yields.',
        control_setpoints: {
          target_pbr_temp_c: 24.8,
          pbr_temp_min_c: 23.0,
          pbr_temp_max_c: 27.0,
          bypass_sensitivity: 'BALANCED',
          water_intake_mode: 'OPTIMIZED_BLENDING',
        },
        auditable_impact_metrics: {
          baseline_pue: 1.35,
          current_optimized_pue: 1.18,
          delta_pue_reduction: 0.17,
          daily_cooling_water_saved_liters: 39500,
          daily_water_savings_usd: 138.25,
          daily_biomass_produced_kg: 11.7,
          daily_biomass_market_value_usd: 877.5,
          daily_chiller_energy_avoided_kwh: 460.8,
          daily_electricity_savings_usd: 55.3,
          daily_co2_captured_kg: 21.41,
          annual_co2_captured_metric_tons: 7.81,
          net_daily_opex_savings_usd: 1071.05,
          annual_opex_savings_usd: 390933,
        },
      },
      orchestrator: {
        active_mode: 'ECO_BALANCED',
        manual_valve_override: false,
        vision_stress_mode: 'OPTIMAL',
      },
    };
  }

  private initWebSocket() {
    try {
      this.ws = new WebSocket(`${WS_BASE}/ws/telemetry`);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[Thermo-Bloom] Connected to FastAPI Digital Twin WebSocket.');
      };

      this.ws.onmessage = (event) => {
        try {
          const data: UnifiedTelemetry = JSON.parse(event.data);
          this.localState = data;
          this.notifySubscribers(data, true);
        } catch (e) {
          console.error('[Thermo-Bloom] WS parse error:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch {
      this.isConnected = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        if (!this.isConnected) {
          this.initWebSocket();
        } else {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
      }, 3000);
    }
  }

  private startFallbackSimulation() {
    // If backend is not running, animate local state gracefully
    this.fallbackInterval = setInterval(() => {
      if (!this.isConnected) {
        // Minor realistic drift
        const noise = (Math.random() - 0.5) * 0.4;
        this.localState.thermal.server_load_pct = Math.max(
          20,
          Math.min(95, this.localState.thermal.server_load_pct + noise)
        );
        this.localState.thermal.coolant_outlet_temp_c = Number(
          (35.0 + 17.0 * (this.localState.thermal.server_load_pct / 100.0)).toFixed(1)
        );
        this.localState.water.cumulative_freshwater_saved_liters += 0.5;
        this.notifySubscribers(this.localState, false);
      }
    }, 1000);
  }

  private notifySubscribers(data: UnifiedTelemetry, isLive: boolean) {
    this.subscribers.forEach((cb) => cb(data, isLive));
  }

  public subscribe(callback: (data: UnifiedTelemetry, isLive: boolean) => void): () => void {
    this.subscribers.push(callback);
    // immediately emit current snapshot
    callback(this.localState, this.isConnected);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== callback);
    };
  }

  public async setMode(mode: 'MAX_COMPUTE_COOLING' | 'BIO_HARVEST_MAXIMIZER' | 'ECO_BALANCED') {
    this.localState.optimizer.mode = mode;
    this.localState.orchestrator.active_mode = mode;
    if (this.isConnected) {
      try {
        await fetch(`${BACKEND_BASE}/api/control/mode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode }),
        });
      } catch (e) {
        console.warn('[Thermo-Bloom] Mode API error, falling back locally', e);
      }
    }
  }

  public async injectGpuSurge(magnitude: number = 38.0, durationSeconds: number = 20.0) {
    this.localState.thermal.burst_active = true;
    this.localState.thermal.burst_magnitude = magnitude;
    this.localState.thermal.server_load_pct = Math.min(100, this.localState.thermal.server_load_pct + magnitude);
    if (this.isConnected) {
      try {
        await fetch(`${BACKEND_BASE}/api/control/inject-spike`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'gpu_surge',
            magnitude,
            duration_seconds: durationSeconds,
          }),
        });
      } catch (e) {
        console.warn('[Thermo-Bloom] GPU surge injection API failed', e);
      }
    }
  }

  public async injectWaterContamination(biocidePpm: number = 1.45, tdsPpm: number = 1450.0) {
    this.localState.water.biocide_ppm = biocidePpm;
    this.localState.water.tds_ppm = tdsPpm;
    this.localState.water.classification = biocidePpm > 2.0 ? 'REJECT_TO_DRAIN' : 'PRE_TREAT_REQUIRED';
    if (this.isConnected) {
      try {
        await fetch(`${BACKEND_BASE}/api/control/inject-spike`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'water_contamination',
            magnitude: biocidePpm,
          }),
        });
      } catch (e) {
        console.warn('[Thermo-Bloom] Water contamination API failed', e);
      }
    }
  }

  public async injectVisionStress(stressType: string) {
    this.localState.orchestrator.vision_stress_mode = stressType;
    if (this.isConnected) {
      try {
        await fetch(`${BACKEND_BASE}/api/control/inject-spike`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'vision_stress',
            stress_type: stressType,
          }),
        });
      } catch (e) {
        console.warn('[Thermo-Bloom] Vision stress API failed', e);
      }
    }
  }

  public async setValveOverride(valvePositionPct: number, manual: boolean) {
    this.localState.orchestrator.manual_valve_override = manual;
    this.localState.thermal.valve_position_pct = valvePositionPct;
    if (this.isConnected) {
      try {
        await fetch(`${BACKEND_BASE}/api/control/valve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            valve_position_pct: valvePositionPct,
            manual,
          }),
        });
      } catch (e) {
        console.warn('[Thermo-Bloom] Valve override API failed', e);
      }
    }
  }

  public async screenWaterSample(params: {
    ph?: number;
    tds_ppm?: number;
    orp_mv?: number;
    turbidity_ntu?: number;
    biocide_ppm?: number;
  }): Promise<WaterTelemetry> {
    if (this.isConnected) {
      try {
        const resp = await fetch(`${BACKEND_BASE}/api/water/screen`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        return await resp.json();
      } catch {
        // fallback
      }
    }
    return this.localState.water;
  }

  public getVisionStreamUrl(): string {
    return `${BACKEND_BASE}/api/vision/stream`;
  }

  public isBackendLive(): boolean {
    return this.isConnected;
  }
}

export const backendApi = new BackendApiService();
