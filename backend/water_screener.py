"""
THERMO-BLOOM AI - Cooling Tower Water Suitability & Toxicity Screener
=====================================================================
Multi-parameter chemical analysis and toxicity screening engine determining whether
data center cooling tower blowdown water can safely be recycled into microalgae photobioreactors.

Key Features:
- Multi-parameter screening: pH (6.0 - 9.5), TDS (ppm), ORP (mV), Turbidity (NTU), Biocide (ppm).
- Automated Classification: SAFE_REUSE | PRE_TREAT_REQUIRED | REJECT_TO_DRAIN.
- Chemical decay modeling: First-order UV photolysis & aeration kinetics to compute retention time.
- Safe Dilution Ratio (SDR) calculation with municipal / RO makeup water.
- Cumulative liters of freshwater and blowdown water saved per day.
"""

import math
import time
from typing import Dict, Any, List, Optional


class WaterScreener:
    """
    Screens incoming cooling tower blowdown water streams for chemical safety,
    toxicity to microalgae cultures, and computes pre-treatment schedules.
    """

    def __init__(
        self,
        base_blowdown_flow_l_per_hr: float = 1800.0,  # ~43,200 L/day for enterprise DC
        makeup_water_tds_ppm: float = 110.0,
        uv_decay_constant_k_per_min: float = 0.038    # First-order rate constant for biocide photolysis
    ):
        self.base_blowdown_flow = base_blowdown_flow_l_per_hr
        self.makeup_water_tds = makeup_water_tds_ppm
        self.k_decay = uv_decay_constant_k_per_min

        # Safe thresholds for microalgae
        self.SAFE_BIOCIDE_MAX = 0.10     # ppm (e.g. isothiazolinone / glutaraldehyde)
        self.DANGEROUS_BIOCIDE_MIN = 2.0 # ppm (lethal threshold)
        self.SAFE_TDS_MAX = 800.0        # ppm
        self.DANGEROUS_TDS_MIN = 2000.0  # ppm (osmotic shock)
        self.SAFE_ORP_MAX = 250.0        # mV
        self.DANGEROUS_ORP_MIN = 500.0   # mV (strong oxidizing agent)
        self.SAFE_PH_MIN = 6.6
        self.SAFE_PH_MAX = 8.4
        self.EXTREME_PH_MIN = 6.0
        self.EXTREME_PH_MAX = 9.5

        # Cumulative metrics tracker
        self.cumulative_freshwater_saved_liters = 14250.0
        self.cumulative_blowdown_diverted_liters = 16800.0
        self.last_update_time = time.time()

        # Current water chemistry state
        self.current_stream = {
            "ph": 7.4,
            "tds_ppm": 680.0,
            "orp_mv": 190.0,
            "turbidity_ntu": 4.2,
            "biocide_ppm": 0.04
        }

    def inject_contamination_surge(self, biocide_ppm: float = 1.45, tds_ppm: float = 1400.0):
        """
        Inject a chemical contamination spike (e.g. automated biocide dosing cycle
        or high-cycles-of-concentration blowdown spike from the cooling tower).
        """
        self.current_stream["biocide_ppm"] = biocide_ppm
        self.current_stream["tds_ppm"] = tds_ppm
        self.current_stream["orp_mv"] = min(580.0, 150.0 + biocide_ppm * 180.0)

    def screen_stream(
        self,
        ph: Optional[float] = None,
        tds_ppm: Optional[float] = None,
        orp_mv: Optional[float] = None,
        turbidity_ntu: Optional[float] = None,
        biocide_ppm: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Screens water sample and classifies stream:
        - SAFE_REUSE: Low TDS (<800 ppm), ORP < 250 mV, biocide < 0.1 ppm.
        - PRE_TREAT_REQUIRED: Biocide 0.1-2.0 ppm or TDS 800-1800 ppm.
        - REJECT_TO_DRAIN: Dangerous biocide (>2.0 ppm) or high TDS (>2000 ppm).
        """
        if ph is not None: self.current_stream["ph"] = ph
        if tds_ppm is not None: self.current_stream["tds_ppm"] = tds_ppm
        if orp_mv is not None: self.current_stream["orp_mv"] = orp_mv
        if turbidity_ntu is not None: self.current_stream["turbidity_ntu"] = turbidity_ntu
        if biocide_ppm is not None: self.current_stream["biocide_ppm"] = biocide_ppm

        c_ph = self.current_stream["ph"]
        c_tds = self.current_stream["tds_ppm"]
        c_orp = self.current_stream["orp_mv"]
        c_turb = self.current_stream["turbidity_ntu"]
        c_bio = self.current_stream["biocide_ppm"]

        reasons = []
        treatment_steps = []
        retention_time_mins = 0.0
        safe_dilution_ratio = 0.0
        classification = "SAFE_REUSE"

        # Check for REJECT_TO_DRAIN criteria
        is_reject = False
        if c_bio >= self.DANGEROUS_BIOCIDE_MIN:
            is_reject = True
            reasons.append(f"Lethal biocide concentration ({c_bio:.2f} ppm >= {self.DANGEROUS_BIOCIDE_MIN} ppm)")
        if c_tds >= self.DANGEROUS_TDS_MIN:
            is_reject = True
            reasons.append(f"Hyper-saline TDS ({c_tds:.0f} ppm >= {self.DANGEROUS_TDS_MIN} ppm) causes osmotic lysis")
        if c_orp >= self.DANGEROUS_ORP_MIN:
            is_reject = True
            reasons.append(f"Severe oxidizing ORP ({c_orp:.0f} mV >= {self.DANGEROUS_ORP_MIN} mV)")
        if c_ph <= self.EXTREME_PH_MIN or c_ph >= self.EXTREME_PH_MAX:
            is_reject = True
            reasons.append(f"Extreme pH ({c_ph:.1f} outside {self.EXTREME_PH_MIN}-{self.EXTREME_PH_MAX})")

        if is_reject:
            classification = "REJECT_TO_DRAIN"
            treatment_steps.append("Divert stream immediately via solenoid bypass to municipal industrial sewer.")
            treatment_steps.append("Log hazardous discharge event in DCIM telemetry log.")
            recovery_efficiency = 0.0
        else:
            # Check for PRE_TREAT_REQUIRED criteria
            needs_pretreat = False
            if c_bio >= self.SAFE_BIOCIDE_MAX:
                needs_pretreat = True
                reasons.append(f"Elevated biocide ({c_bio:.2f} ppm > {self.SAFE_BIOCIDE_MAX} ppm)")
                # Calculate UV photolysis & sparging aeration retention time
                # C(t) = C0 * exp(-k * t) => t = ln(C0 / C_target) / k
                target_safe_biocide = 0.07
                if c_bio > target_safe_biocide:
                    retention_time_mins = math.log(c_bio / target_safe_biocide) / self.k_decay
                    retention_time_mins = max(5.0, min(180.0, retention_time_mins))
                
                treatment_steps.append(
                    f"UV-C Photolysis (254 nm) & aeration degas retention: {retention_time_mins:.1f} minutes."
                )

            if c_tds > self.SAFE_TDS_MAX:
                needs_pretreat = True
                reasons.append(f"Moderate TDS ({c_tds:.0f} ppm > {self.SAFE_TDS_MAX} ppm)")
                # Calculate Safe Dilution Ratio (SDR) with clean makeup water
                # (TDS_blowdown + SDR * TDS_makeup) / (1 + SDR) <= 750 ppm
                target_tds = 750.0
                tds_sdr = max(0.0, (c_tds - target_tds) / (target_tds - self.makeup_water_tds))
                safe_dilution_ratio = max(safe_dilution_ratio, tds_sdr)

            if c_orp > self.SAFE_ORP_MAX:
                needs_pretreat = True
                reasons.append(f"Elevated ORP ({c_orp:.0f} mV > {self.SAFE_ORP_MAX} mV)")
                treatment_steps.append("Ascorbic acid / mild bisulfite reducing agent injection (2.5 mg/L).")

            if c_turb > 12.0:
                needs_pretreat = True
                reasons.append(f"High turbidity ({c_turb:.1f} NTU > 12.0 NTU)")
                treatment_steps.append("Backwash sand/disc filtration to clarify optical penetration.")

            if needs_pretreat:
                classification = "PRE_TREAT_REQUIRED"
                if safe_dilution_ratio > 0:
                    treatment_steps.append(
                        f"Blend with RO/rainwater makeup at Safe Dilution Ratio {safe_dilution_ratio:.2f}:1."
                    )
                recovery_efficiency = 0.85
            else:
                classification = "SAFE_REUSE"
                treatment_steps.append("Direct injection into photobioreactor circulation & nutrient balance manifold.")
                recovery_efficiency = 0.98

        return {
            "classification": classification,
            "ph": round(c_ph, 2),
            "tds_ppm": round(c_tds, 1),
            "orp_mv": round(c_orp, 1),
            "turbidity_ntu": round(c_turb, 2),
            "biocide_ppm": round(c_bio, 3),
            "reasons": reasons if reasons else ["All chemical parameters within optimal biological thresholds."],
            "treatment_steps": treatment_steps,
            "retention_time_minutes": round(retention_time_mins, 1),
            "safe_dilution_ratio": round(safe_dilution_ratio, 2),
            "recovery_efficiency_pct": round(recovery_efficiency * 100, 1)
        }

    def step(self, dt: float = 1.0) -> Dict[str, Any]:
        """
        Advances water screening step, updates cumulative liters saved,
        and provides continuous stream analytics.
        """
        # Gradual biocide natural decay or drift
        if self.current_stream["biocide_ppm"] > 0.05:
            # Slower natural decay in storage
            self.current_stream["biocide_ppm"] -= (0.008 * dt)
            self.current_stream["biocide_ppm"] = max(0.02, self.current_stream["biocide_ppm"])

        res = self.screen_stream()
        classification = res["classification"]

        # Calculate volume processed in dt
        volume_liters = (self.base_blowdown_flow / 3600.0) * dt
        if classification == "SAFE_REUSE":
            saved = volume_liters * 0.98
            self.cumulative_freshwater_saved_liters += saved
            self.cumulative_blowdown_diverted_liters += volume_liters
        elif classification == "PRE_TREAT_REQUIRED":
            saved = volume_liters * 0.82
            self.cumulative_freshwater_saved_liters += saved
            self.cumulative_blowdown_diverted_liters += volume_liters
        else:
            # REJECT_TO_DRAIN saves zero
            pass

        # Projected 24h daily savings based on current throughput
        daily_freshwater_saved_projection = (self.base_blowdown_flow * 24.0) * (res["recovery_efficiency_pct"] / 100.0)

        res["cumulative_freshwater_saved_liters"] = round(self.cumulative_freshwater_saved_liters, 1)
        res["cumulative_blowdown_diverted_liters"] = round(self.cumulative_blowdown_diverted_liters, 1)
        res["projected_daily_freshwater_saved_liters"] = round(daily_freshwater_saved_projection, 0)
        return res

