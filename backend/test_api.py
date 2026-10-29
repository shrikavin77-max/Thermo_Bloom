"""
THERMO-BLOOM AI - FastAPI Endpoints Integration Test
====================================================
Tests the REST API routes and payloads using FastAPI TestClient.
"""

import unittest
from fastapi.testclient import TestClient
from backend.main import app


class TestFastAPIEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_and_status(self):
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["system"], "THERMO-BLOOM AI Digital Twin")

        resp_status = self.client.get("/api/status")
        self.assertEqual(resp_status.status_code, 200)
        st = resp_status.json()
        self.assertEqual(st["status"], "ONLINE")
        self.assertIn("water_suitability", st)

    def test_telemetry(self):
        resp = self.client.get("/api/telemetry")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("thermal", data)
        self.assertIn("water", data)
        self.assertIn("vision", data)
        self.assertIn("optimizer", data)

    def test_mode_change(self):
        resp = self.client.post("/api/control/mode", json={"mode": "BIO_HARVEST_MAXIMIZER"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["new_mode"], "BIO_HARVEST_MAXIMIZER")

        resp_reset = self.client.post("/api/control/mode", json={"mode": "ECO_BALANCED"})
        self.assertEqual(resp_reset.status_code, 200)

    def test_spike_injection(self):
        # Workload spike
        resp_gpu = self.client.post("/api/control/inject-spike", json={
            "type": "gpu_surge",
            "magnitude": 40.0,
            "duration_seconds": 15.0
        })
        self.assertEqual(resp_gpu.status_code, 200)

        # Water spike
        resp_water = self.client.post("/api/control/inject-spike", json={
            "type": "water_contamination",
            "magnitude": 1.25
        })
        self.assertEqual(resp_water.status_code, 200)

        # Vision stress
        resp_vis = self.client.post("/api/control/inject-spike", json={
            "type": "vision_stress",
            "stress_type": "CHLOROSIS"
        })
        self.assertEqual(resp_vis.status_code, 200)

    def test_water_screening_endpoint(self):
        resp = self.client.post("/api/water/screen", json={
            "ph": 7.3,
            "tds_ppm": 620.0,
            "orp_mv": 195.0,
            "turbidity_ntu": 3.8,
            "biocide_ppm": 0.04
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["classification"], "SAFE_REUSE")

    def test_vision_frame_endpoint(self):
        resp = self.client.get("/api/vision/frame")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["frame_base64"].startswith("data:image/jpeg;base64,"))
        self.assertIn("od680", data["diagnostics"])

    def test_impact_metrics_endpoint(self):
        resp = self.client.get("/api/impact/metrics")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("delta_pue_reduction", data)
        self.assertIn("daily_cooling_water_saved_liters", data)
        self.assertIn("daily_biomass_produced_kg", data)


if __name__ == "__main__":
    unittest.main(verbosity=2)

