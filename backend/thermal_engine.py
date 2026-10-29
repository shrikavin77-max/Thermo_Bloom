"""
THERMO-BLOOM AI - Thermal & Workload Engine
===========================================
High-fidelity thermodynamics and predictive feed-forward control engine linking
data center GPU server heat rejection with microalgae photobioreactor culture.

Key Features:
- Dynamic GPU workload simulation with realistic stochastic LLM batch training bursts.
- First-order thermodynamic inertia model (30-60s physical delay via Q = m * Cp * dT).
- Feed-forward predictive 3-way proportional mixing valve controller (target: 22°C - 28°C).
- Automatic emergency dump/bypass state to prevent lethal algae heat shock (>34°C).
"""

import time
import math
import random
from typing import Dict, Any, Optional, Tuple


class ThermalEngine:
    """
    Thermodynamic and workload engine simulating server rack heat generation,
    fluid heat transfer with thermal inertia, and predictive mixing valve regulation.
    """

    def __init__(
        self,
        rack_design_power_kw: float = 250.0,
        coolant_mass_flow_kg_s: float = 1.8,  # ~108 L/min
        coolant_cp_kj_kg_k: float = 4.184,   # Specific heat of water-glycol
        thermal_lag_tau_s: float = 45.0,     # Physical inertia time constant (30-60s)
        bioreactor_volume_liters: float = 6000.0,
        ambient_temp_c: float = 24.0,
    ):
        self.rack_design_power_kw = rack_design_power_kw
        self.coolant_mass_flow = coolant_mass_flow_kg_s
        self.coolant_cp = coolant_cp_kj_kg_k
        self.tau = thermal_lag_tau_s
        self.bioreactor_volume = bioreactor_volume_liters
        self.ambient_temp = ambient_temp_c

        # State Variables
        self.server_load_pct = 45.0          # Current workload (0 - 100%)
        self.target_server_load_pct = 45.0
        self.coolant_inlet_temp_c = 32.0     # DC loop supply temp (°C)
        self.coolant_outlet_temp_c = 41.5    # DC loop return temp (°C)
        self.bioreactor_temp_c = 25.2        # Algae culture temp (°C)
        self.valve_position_pct = 58.0       # 3-way mixing valve (0% = full bypass, 100% = full algae)
        self.emergency_dump_active = False
        self.last_update_time = time.time()

        # LLM Training Burst Generator parameters
        self.burst_active = False
        self.burst_end_time = 0.0
        self.burst_magnitude = 0.0

        # Safety thresholds
        self.BIO_TEMP_MIN = 22.0
        self.BIO_TEMP_MAX = 28.0
        self.BIO_TEMP_TARGET = 25.0
        self.BIO_TEMP_LETHAL = 34.0
        self.MAX_SAFE_DISSIPATION_KW = 190.0

        # Telemetry history for derivative estimation
        self._prev_load = 45.0
        self._prev_coolant_temp = 41.5
        self._time_step_history = []

    def inject_workload_surge(self, magnitude_pct: float = 35.0, duration_seconds: float = 20.0):
        """
        Manually inject an intense computing workload surge (e.g. LLM fine-tuning burst).
        """
        self.burst_active = True
        self.burst_magnitude = magnitude_pct
        self.burst_end_time = time.time() + duration_seconds
        self.target_server_load_pct = min(100.0, self.server_load_pct + magnitude_pct)

    def _simulate_gpu_telemetry(self, dt: float) -> float:
        """
        Simulates dynamic GPU telemetry: base stochastic drift + intermittent LLM batch bursts.
        """
        current_now = time.time()

        # Check if active burst timed out
        if self.burst_active and current_now >= self.burst_end_time:
            self.burst_active = False
            self.target_server_load_pct = max(20.0, self.target_server_load_pct - self.burst_magnitude)

        # Autonomous stochastic bursts if idle
        if not self.burst_active and random.random() < 0.03:  # 3% chance per tick to spawn LLM training job
            burst_len = random.uniform(10.0, 30.0)
            burst_mag = random.uniform(25.0, 45.0)
            self.burst_active = True
            self.burst_magnitude = burst_mag
            self.burst_end_time = current_now + burst_len
            self.target_server_load_pct = min(100.0, self.target_server_load_pct + burst_mag)

        # Slight diurnal & stochastic noise
        noise = random.gauss(0, 0.6)
        # Slew rate limitation: servers can ramp up in 2-5 seconds
        load_diff = self.target_server_load_pct - self.server_load_pct
        slew_rate = 15.0 * dt  # % per second
        if abs(load_diff) > slew_rate:
            self.server_load_pct += math.copysign(slew_rate, load_diff)
        else:
            self.server_load_pct = self.target_server_load_pct

        self.server_load_pct = max(0.0, min(100.0, self.server_load_pct + noise))
        return self.server_load_pct

    def compute_steady_state_coolant_temp(self, load_pct: float) -> Tuple[float, float]:
        """
        Computes electrical power, thermal heat dissipation Q, and theoretical
        steady-state coolant outlet temperature based on Q = m * Cp * dT.
        Maps server coolant outlet temperatures strictly across 35°C (idle) to 52°C (full load).
        Returns: (heat_kw, steady_state_outlet_temp_c)
        """
        # Electrical compute power: baseline idle power (25 kW) up to 150 kW at full load
        compute_power_kw = self.rack_design_power_kw * (0.10 + 0.50 * (load_pct / 100.0))
        # 98% of electrical power dissipates as coolant heat
        q_thermal_kw = compute_power_kw * 0.98

        # Q = m_dot * Cp * delta_T => delta_T = Q / (m_dot * Cp)
        # Scaled so that at 0% load, delta_T = 3.0°C (35.0°C outlet with 32°C inlet)
        # and at 100% load, delta_T = 20.0°C (52.0°C outlet)
        delta_t = 3.0 + 17.0 * (load_pct / 100.0)
        steady_state_temp = self.coolant_inlet_temp_c + delta_t

        clamped_temp = max(35.0, min(54.0, steady_state_temp))
        return q_thermal_kw, clamped_temp

    def _predictive_feed_forward_valve_control(
        self,
        current_coolant_temp: float,
        predicted_coolant_temp: float,
        load_derivative: float,
        dt: float
    ) -> float:
        """
        Feed-Forward Predictive Control Algorithm:
        Anticipates thermal pulses 30-60s ahead based on GPU load derivative and
        predicted coolant outlet temperature before the wave reaches the photobioreactor.
        Dynamically adjusts 3-way mixing valve (0 - 100%).
        """
        # Desired heat into bioreactor to maintain target biological sweet spot (25.0°C)
        bio_error = self.BIO_TEMP_TARGET - self.bioreactor_temp_c
        
        # Bioreactor thermal capacity: mass ~ bioreactor_volume (kg), water Cp ~ 4.184 kJ/kg/K
        bio_heat_capacity_kj_k = self.bioreactor_volume * 4.184
        
        # Heat required to adjust or sustain bioreactor temperature
        q_target_bio_kw = 45.0 + (bio_error * 18.0)
        q_target_bio_kw = max(0.0, min(self.MAX_SAFE_DISSIPATION_KW, q_target_bio_kw))

        # Available heat in coolant loop relative to bioreactor temperature
        delta_t_available = max(0.5, predicted_coolant_temp - self.bioreactor_temp_c)
        q_available_kw = self.coolant_mass_flow * self.coolant_cp * delta_t_available

        # Feed-forward ratio
        ideal_valve_pct = (q_target_bio_kw / q_available_kw) * 100.0 if q_available_kw > 0 else 50.0

        # Feed-Forward surge anticipation term:
        # If load is surging rapidly (positive load_derivative), pre-buffer by backing off valve
        # before the hot wavefront floods the culture.
        if load_derivative > 1.5:  # Load surging >1.5% per sec
            anticipation_cut = load_derivative * 4.0
            ideal_valve_pct -= anticipation_cut
        elif load_derivative < -1.5:
            # Load falling rapidly; open valve slightly to prevent undercooling
            anticipation_boost = abs(load_derivative) * 2.5
            ideal_valve_pct += anticipation_boost

        # Feedback trimming (Proportional + Integral damping)
        if self.bioreactor_temp_c > 27.2:
            # Approaching high margin of safe window; clamp aggressively
            ideal_valve_pct *= 0.4
        elif self.bioreactor_temp_c < 23.0:
            # Getting chilled; open up to capture waste heat
            ideal_valve_pct = min(95.0, ideal_valve_pct * 1.35)

        return max(0.0, min(100.0, ideal_valve_pct))

    def step(self, dt: Optional[float] = None) -> Dict[str, Any]:
        """
        Advances the thermodynamic simulation by dt seconds (default computed from clock).
        """
        now = time.time()
        if dt is None:
            dt = max(0.1, min(2.0, now - self.last_update_time))
        self.last_update_time = now

        # 1. Update GPU telemetry
        prev_load = self.server_load_pct
        load = self._simulate_gpu_telemetry(dt)
        load_derivative = (load - prev_load) / dt

        # 2. Compute thermodynamics and apply physical delay (thermal inertia lag)
        q_thermal_kw, target_coolant_temp = self.compute_steady_state_coolant_temp(load)

        # First-order delay: dT_coolant/dt = (T_target - T_coolant) / tau
        coolant_temp_rate = (target_coolant_temp - self.coolant_outlet_temp_c) / self.tau
        self.coolant_outlet_temp_c += coolant_temp_rate * dt
        # Clamp to realistic range
        self.coolant_outlet_temp_c = max(35.0, min(56.0, self.coolant_outlet_temp_c))

        # Predicted coolant temp 30 seconds ahead for feed-forward anticipation
        predicted_coolant_temp = self.coolant_outlet_temp_c + (coolant_temp_rate * 30.0)

        # 3. Emergency Dump Check:
        # Microalgae biological window: strictly 22°C - 28°C; lethal threshold >34°C.
        # Trigger automatic bypass if incoming thermal load exceeds dissipation capacity or bio temp approaches danger.
        overheating_risk = (
            self.bioreactor_temp_c >= 28.5 or
            (self.bioreactor_temp_c >= 27.8 and coolant_temp_rate > 0.08) or
            (self.coolant_outlet_temp_c >= 52.0 and self.bioreactor_temp_c >= 27.5) or
            q_thermal_kw > self.MAX_SAFE_DISSIPATION_KW * 1.3
        )

        if overheating_risk:
            self.emergency_dump_active = True
            # Valve instantly dumps 100% of heat away from algae to cooling tower
            self.valve_position_pct = 0.0
        else:
            # Reset emergency state once safely normalized below 26.5°C
            if self.emergency_dump_active and self.bioreactor_temp_c < 26.5:
                self.emergency_dump_active = False

            if not self.emergency_dump_active:
                target_valve = self._predictive_feed_forward_valve_control(
                    self.coolant_outlet_temp_c,
                    predicted_coolant_temp,
                    load_derivative,
                    dt
                )
                # Actuator slew limit (3-way valve motor moves ~8% per second)
                max_valve_delta = 8.0 * dt
                valve_error = target_valve - self.valve_position_pct
                if abs(valve_error) > max_valve_delta:
                    self.valve_position_pct += math.copysign(max_valve_delta, valve_error)
                else:
                    self.valve_position_pct = target_valve

        # 4. Update Bioreactor Temperature based on valve split & ambient dissipation
        valve_fraction = self.valve_position_pct / 100.0
        heat_to_algae_kw = q_thermal_kw * valve_fraction * 0.85  # 85% HX effectiveness
        heat_dumped_tower_kw = q_thermal_kw - heat_to_algae_kw

        # Bioreactor thermal mass dynamics:
        # dT_bio/dt = (Q_in - Q_ambient_loss - Q_evap) / (M_bio * Cp)
        ambient_loss_kw = 0.85 * (self.bioreactor_temp_c - self.ambient_temp)
        evaporative_cooling_kw = 3.5  # Natural surface evaporation cooling
        net_heat_to_bio_kw = heat_to_algae_kw - ambient_loss_kw - evaporative_cooling_kw

        bio_thermal_mass = self.bioreactor_volume * 4.184  # kJ / °C
        # Rate of temperature change (°C / sec)
        d_temp_bio_dt = net_heat_to_bio_kw / bio_thermal_mass
        self.bioreactor_temp_c += d_temp_bio_dt * dt

        # Prevent runaway below ambient or above physics limit
        self.bioreactor_temp_c = max(18.0, min(36.0, self.bioreactor_temp_c))

        return self.get_telemetry()

    def get_telemetry(self) -> Dict[str, Any]:
        """
        Returns structured dictionary of instantaneous thermal states.
        """
        q_thermal_kw, _ = self.compute_steady_state_coolant_temp(self.server_load_pct)
        valve_fraction = self.valve_position_pct / 100.0
        heat_to_algae_kw = q_thermal_kw * valve_fraction * 0.85
        heat_to_dump_kw = q_thermal_kw - heat_to_algae_kw

        # Health status for algae temperature
        if self.bioreactor_temp_c > 32.0:
            bio_status = "LETHAL_OVERHEAT"
        elif self.bioreactor_temp_c > 28.0:
            bio_status = "THERMAL_STRESS_HIGH"
        elif self.bioreactor_temp_c < 22.0:
            bio_status = "SUB_OPTIMAL_CHILL"
        else:
            bio_status = "OPTIMAL_GROWTH"

        return {
            "server_load_pct": round(self.server_load_pct, 2),
            "target_server_load_pct": round(self.target_server_load_pct, 2),
            "coolant_inlet_temp_c": round(self.coolant_inlet_temp_c, 2),
            "coolant_outlet_temp_c": round(self.coolant_outlet_temp_c, 2),
            "bioreactor_temp_c": round(self.bioreactor_temp_c, 2),
            "valve_position_pct": round(self.valve_position_pct, 1),
            "emergency_dump_active": self.emergency_dump_active,
            "burst_active": self.burst_active,
            "burst_magnitude": round(self.burst_magnitude, 1),
            "total_heat_generated_kw": round(q_thermal_kw, 2),
            "heat_absorbed_by_algae_kw": round(heat_to_algae_kw, 2),
            "heat_rejected_to_tower_kw": round(heat_to_dump_kw, 2),
            "bio_temp_status": bio_status,
            "biological_window": {
                "min_c": self.BIO_TEMP_MIN,
                "max_c": self.BIO_TEMP_MAX,
                "target_c": self.BIO_TEMP_TARGET,
                "lethal_threshold_c": self.BIO_TEMP_LETHAL,
            }
        }
