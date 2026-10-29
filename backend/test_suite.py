"""
THERMO-BLOOM AI - Comprehensive Automated Test Suite
===================================================
Tests all 4 core engines and orchestrator:
1. ThermalEngine (Inertia, delay, feed-forward valve, emergency dump)
2. AlgaeVisionDiagnostics (OpenCV OD680, hue shift, clumping, fouling, HUD overlay)
3. WaterScreener (Classification, decay kinetics, SDR, cumulative savings)
4. TriObjectiveOptimizer (Multi-objective modes, Pareto scoring, impact metrics)
"""

import unittest
import numpy as np
import time

from backend.thermal_engine import ThermalEngine
from backend.algae_vision import AlgaeVisionDiagnostics
from backend.water_screener import WaterScreener
from backend.optimizer import TriObjectiveOptimizer, OptimizationMode


class TestThermoBloomSystem(unittest.TestCase):

    def setUp(self):
        self.thermal = ThermalEngine(thermal_lag_tau_s=30.0)
        self.vision = AlgaeVisionDiagnostics()
        self.water = WaterScreener()
        self.optimizer = TriObjectiveOptimizer()

    # ---------------- 1. Thermal & Workload Engine Tests ----------------
    def test_thermal_steady_state_and_inertia(self):
        """Test thermodynamics Q = m*Cp*dT and thermal inertia delay."""
        # Idle load
        q_idle, t_out_idle = self.thermal.compute_steady_state_coolant_temp(20.0)
        self.assertGreater(t_out_idle, 35.0)
        self.assertLess(t_out_idle, 42.0)

        # High LLM load
        q_high, t_out_high = self.thermal.compute_steady_state_coolant_temp(95.0)
        self.assertGreater(t_out_high, 48.0)
        self.assertLessEqual(t_out_high, 58.0)
        self.assertGreater(q_high, q_idle)

        # Step forward with physical lag
        initial_temp = self.thermal.coolant_outlet_temp_c
        self.thermal.inject_workload_surge(magnitude_pct=40.0, duration_seconds=10.0)
        
        # Advance 2 seconds - temperature should change smoothly, not instantly jump to target
        self.thermal.step(dt=2.0)
        delayed_temp = self.thermal.coolant_outlet_temp_c
        self.assertGreater(delayed_temp, initial_temp - 0.5)
        # Should NOT reach full high steady state immediately due to tau=30s
        self.assertLess(delayed_temp, t_out_high)

    def test_thermal_predictive_valve_and_emergency_dump(self):
        """Test predictive feed-forward valve buffering and emergency dump trigger."""
        # Baseline step
        t1 = self.thermal.step(dt=1.0)
        self.assertIn("valve_position_pct", t1)
        self.assertFalse(t1["emergency_dump_active"])

        # Force emergency condition: set bio temperature dangerously high
        self.thermal.bioreactor_temp_c = 29.8
        t2 = self.thermal.step(dt=1.0)
        self.assertTrue(t2["emergency_dump_active"], "Emergency dump should engage when PBR temp exceeds safe margin.")
        self.assertEqual(t2["valve_position_pct"], 0.0, "Emergency dump must immediately slam valve to 0% bypass.")

    # ---------------- 2. Bio-Vision Diagnostics Tests ----------------
    def test_vision_biomass_and_od_extraction(self):
        """Test OpenCV processing for biomass and optical density calculation."""
        raw_frame = self.vision.generate_synthetic_culture_frame(stress_mode="OPTIMAL")
        self.assertEqual(raw_frame.shape, (480, 640, 3))

        annotated, payload = self.vision.process_frame(raw_frame)
        self.assertEqual(annotated.shape, (480, 640, 3))

        # Check strict JSON schema compliance
        self.assertIn("od680", payload)
        self.assertIn("biomass_g_L", payload)
        self.assertIn("health_status", payload)
        self.assertIn("clumping_index", payload)
        self.assertIn("fouling_detected", payload)
        self.assertIn("action", payload)

        self.assertGreaterEqual(payload["od680"], 0.1)
        self.assertLessEqual(payload["od680"], 3.0)
        self.assertEqual(payload["health_status"], "OPTIMAL")

    def test_vision_stress_diagnostics(self):
        """Test detection of hue shift (chlorosis), clumping, and wall biofouling."""
        # 1. Chlorosis Hue Shift
        frame_chloro = self.vision.generate_synthetic_culture_frame(stress_mode="CHLOROSIS")
        _, pay_chloro = self.vision.process_frame(frame_chloro)
        self.assertTrue(pay_chloro["hue_shift_detected"])

        # 2. Clumping / Flocculation
        frame_clump = self.vision.generate_synthetic_culture_frame(stress_mode="OPTIMAL", clumping_severity=0.85)
        _, pay_clump = self.vision.process_frame(frame_clump)
        self.assertGreater(pay_clump["clumping_index"], 0.25)

        # 3. Wall Biofouling
        frame_foul = self.vision.generate_synthetic_culture_frame(stress_mode="OPTIMAL", fouling_severity=0.75)
        _, pay_foul = self.vision.process_frame(frame_foul)
        self.assertTrue(pay_foul["fouling_detected"])

    # ---------------- 3. Water Screener Tests ----------------
    def test_water_screener_classification(self):
        """Test screening classification: SAFE_REUSE, PRE_TREAT_REQUIRED, REJECT_TO_DRAIN."""
        # Safe stream
        safe_res = self.water.screen_stream(ph=7.4, tds_ppm=550.0, orp_mv=180.0, biocide_ppm=0.03)
        self.assertEqual(safe_res["classification"], "SAFE_REUSE")
        self.assertEqual(safe_res["safe_dilution_ratio"], 0.0)

        # Pre-treat stream
        pretreat_res = self.water.screen_stream(ph=7.8, tds_ppm=1100.0, orp_mv=290.0, biocide_ppm=0.45)
        self.assertEqual(pretreat_res["classification"], "PRE_TREAT_REQUIRED")
        self.assertGreater(pretreat_res["retention_time_minutes"], 5.0)
        self.assertGreater(pretreat_res["safe_dilution_ratio"], 0.0)

        # Reject stream
        reject_res = self.water.screen_stream(ph=5.2, tds_ppm=2400.0, orp_mv=580.0, biocide_ppm=2.8)
        self.assertEqual(reject_res["classification"], "REJECT_TO_DRAIN")
        self.assertEqual(reject_res["recovery_efficiency_pct"], 0.0)

    # ---------------- 4. Tri-Objective Optimizer Tests ----------------
    def test_optimizer_modes_and_pareto(self):
        """Test mode switching and impact metric calculation."""
        thermal_state = {
            "server_load_pct": 72.0,
            "coolant_outlet_temp_c": 46.5,
            "total_heat_generated_kw": 180.0,
            "heat_absorbed_by_algae_kw": 75.0,
        }
        water_state = {
            "recovery_efficiency_pct": 88.0,
            "projected_daily_freshwater_saved_liters": 38000.0
        }
        vision_state = {"od680": 1.95}

        # Test Mode 1: MAX_COMPUTE_COOLING
        self.optimizer.set_mode(OptimizationMode.MAX_COMPUTE_COOLING)
        res_cooling = self.optimizer.optimize(thermal_state, water_state, vision_state)
        self.assertEqual(res_cooling["mode"], "MAX_COMPUTE_COOLING")
        self.assertGreater(res_cooling["auditable_impact_metrics"]["delta_pue_reduction"], 0.10)

        # Test Mode 2: BIO_HARVEST_MAXIMIZER
        self.optimizer.set_mode(OptimizationMode.BIO_HARVEST_MAXIMIZER)
        res_bio = self.optimizer.optimize(thermal_state, water_state, vision_state)
        self.assertEqual(res_bio["mode"], "BIO_HARVEST_MAXIMIZER")
        self.assertEqual(res_bio["control_setpoints"]["target_pbr_temp_c"], 25.0)

        # Test Mode 3: ECO_BALANCED
        self.optimizer.set_mode(OptimizationMode.ECO_BALANCED)
        res_eco = self.optimizer.optimize(thermal_state, water_state, vision_state)
        self.assertEqual(res_eco["mode"], "ECO_BALANCED")
        self.assertGreater(res_eco["pareto_score"], 0.90)
        self.assertGreater(res_eco["auditable_impact_metrics"]["annual_opex_savings_usd"], 50000.0)


if __name__ == "__main__":
    unittest.main(verbosity=2)

