"""
THERMO-BLOOM AI - Bio-Vision & Stress Diagnostics Engine
=========================================================
Computer Vision pipeline leveraging OpenCV to analyze microalgae photobioreactor cultures:
- Biomass & Optical Density (OD680) estimation from HSV and CIE L*a*b* color spaces.
- Early warning stress diagnostics:
  * Color Hue Shift (detecting chlorosis, nitrogen depletion, thermal stress).
  * Cell Flocculation & Clumping (contour area variance & edge density from thermal/biocide shocks).
  * Wall Biofilm Buildup (gradient & contrast analysis along reactor perimeter).
- High-tech Cyberpunk HUD visual annotations with bounding boxes and JSON telemetry payload.
- Synthetic Culture Frame Generator for headless live simulation & testing.
"""

import cv2
import numpy as np
import base64
import time
from typing import Dict, Any, Tuple, Optional, List


class AlgaeVisionDiagnostics:
    """
    OpenCV-based diagnostics for microalgae culture health, optical density,
    flocculation/clumping detection, and wall biofouling inspection.
    """

    def __init__(
        self,
        od_min: float = 0.1,
        od_max: float = 3.0,
        biomass_slope: float = 0.88,  # g/L per OD680 unit
        biomass_intercept: float = 0.05
    ):
        self.od_min = od_min
        self.od_max = od_max
        self.biomass_slope = biomass_slope
        self.biomass_intercept = biomass_intercept

        # Simulation animation state
        self._frame_count = 0
        self._cell_particles = self._init_synthetic_particles(num_particles=65)

    def _init_synthetic_particles(self, num_particles: int) -> List[Dict[str, float]]:
        """Initializes random cell micro-particles for synthetic generator."""
        particles = []
        for _ in range(num_particles):
            particles.append({
                "x": np.random.uniform(50, 590),
                "y": np.random.uniform(50, 430),
                "vx": np.random.uniform(-0.8, 0.8),
                "vy": np.random.uniform(-0.5, 0.5),
                "radius": np.random.uniform(2.5, 6.0),
                "phase": np.random.uniform(0, 2 * np.pi)
            })
        return particles

    def generate_synthetic_culture_frame(
        self,
        stress_mode: str = "OPTIMAL",
        clumping_severity: float = 0.0,
        fouling_severity: float = 0.0,
        width: int = 640,
        height: int = 480
    ) -> np.ndarray:
        """
        Generates a photorealistic synthetic frame of a microalgae photobioreactor column
        with fluid texture, lighting gradients, dynamic micro-particles, and stress artifacts.
        
        stress_mode: "OPTIMAL" | "CHLOROSIS" | "THERMAL_SHOCK" | "BIOCIDE_TOXICITY"
        """
        self._frame_count += 1
        t = self._frame_count * 0.05

        # Base fluid color based on stress
        if stress_mode == "OPTIMAL":
            # Deep, rich chlorophyll green (BGR: Blue, Green, Red)
            base_bgr = np.array([28, 145, 42], dtype=np.float32)
        elif stress_mode == "CHLOROSIS":
            # Chlorosis / nitrogen starvation: yellow-olive shift
            base_bgr = np.array([35, 175, 185], dtype=np.float32)
        elif stress_mode == "THERMAL_SHOCK":
            # Thermal bleaching: washed out yellowish-brown
            base_bgr = np.array([45, 120, 160], dtype=np.float32)
        elif stress_mode == "BIOCIDE_TOXICITY":
            # Biocide shock: dull greyish-green with flocculation
            base_bgr = np.array([55, 110, 95], dtype=np.float32)
        else:
            base_bgr = np.array([28, 145, 42], dtype=np.float32)

        # Create base canvas with subtle radial light vignette from bioreactor LED backlighting
        y_coords, x_coords = np.ogrid[:height, :width]
        center_x, center_y = width / 2, height / 2
        dist_from_center = np.sqrt((x_coords - center_x) ** 2 + (y_coords - center_y) ** 2)
        max_dist = np.sqrt(center_x ** 2 + center_y ** 2)
        vignette = 1.15 - 0.35 * (dist_from_center / max_dist)

        # Micro-turbulence pattern using sine wave interference
        fluid_noise = 0.04 * np.sin(x_coords * 0.02 + t) + 0.03 * np.cos(y_coords * 0.025 - t * 0.8)
        shading = vignette + fluid_noise

        frame = np.zeros((height, width, 3), dtype=np.uint8)
        for c in range(3):
            channel = base_bgr[c] * shading
            frame[:, :, c] = np.clip(channel, 0, 255).astype(np.uint8)

        # Add circulating algae cell particles & micro-bubbles
        for p in self._cell_particles:
            # Update particle position
            p["x"] = (p["x"] + p["vx"] + 0.3 * np.sin(t + p["phase"])) % width
            p["y"] = (p["y"] + p["vy"] - 0.4) % height  # Slight upward buoyant convection

            px, py = int(p["x"]), int(p["y"])
            rad = int(p["radius"])

            # If clumping severity is high or biocide toxicity, aggregate nearby clusters
            if clumping_severity > 0.4 or stress_mode in ["BIOCIDE_TOXICITY", "THERMAL_SHOCK"]:
                cluster_rad = int(rad * (1.8 + clumping_severity * 2.2))
                cv2.circle(frame, (px, py), cluster_rad, (15, 80, 22), -1)
                # Outer irregular halo
                cv2.circle(frame, (px + 3, py - 2), cluster_rad // 2, (10, 60, 18), -1)
            else:
                # Dispersed healthy single cells and tiny clusters
                cv2.circle(frame, (px, py), rad, (18, 105, 30), -1)
                cv2.circle(frame, (px - 1, py - 1), max(1, rad // 2), (40, 190, 60), 1)

        # Add aeration micro-bubbles (oxygen / CO2 sparger)
        for i in range(12):
            bx = int((width * 0.15 + (i * 43) + np.sin(t + i) * 15) % (width * 0.85))
            by = int((height - ((t * 85 + i * 55) % height)))
            cv2.circle(frame, (bx, by), 3, (210, 240, 225), 1)
            cv2.circle(frame, (bx, by), 1, (255, 255, 255), -1)

        # Wall Biofilm Buildup simulation along perimeter if fouling_severity > 0
        if fouling_severity > 0.2:
            border_thick = int(24 * fouling_severity)
            # Left wall bio-crust
            cv2.rectangle(frame, (0, 0), (border_thick, height), (10, 55, 15), -1)
            # Right wall bio-crust
            cv2.rectangle(frame, (width - border_thick, 0), (width, height), (10, 55, 15), -1)
            # Add irregular textured jaggedness to biofilm edge
            for y_step in range(0, height, 12):
                jag_l = int(border_thick + 7 * np.sin(y_step * 0.1 + t))
                jag_r = int(width - (border_thick + 7 * np.cos(y_step * 0.12 + t)))
                cv2.circle(frame, (jag_l, y_step), 6, (8, 48, 12), -1)
                cv2.circle(frame, (jag_r, y_step), 6, (8, 48, 12), -1)

        # Bioreactor glass vessel glare reflection (to test OpenCV reflection rejection)
        cv2.line(frame, (80, 20), (120, height - 20), (200, 230, 210), 2)
        cv2.line(frame, (90, 40), (125, height - 40), (170, 210, 190), 1)

        return frame

    def process_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Main OpenCV diagnostics pipeline:
        1. Pre-filtering & background glare filtering.
        2. Color space transformation (HSV and CIE L*a*b*).
        3. Biomass & OD680 quantitative extraction.
        4. Color Hue Shift diagnostics (chlorosis/bleaching).
        5. Flocculation & Clumping analysis (contour area variance & edge density).
        6. Wall Biofilm Buildup inspection (perimeter vs core contrast).
        7. Cyberpunk HUD annotation overlay & JSON payload creation.
        """
        h, w = frame.shape[:2]
        annotated = frame.copy()

        # Step 1: Filter specular reflections & high-intensity glare
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        glare_mask = cv2.threshold(gray, 235, 255, cv2.THRESH_BINARY)[1]
        # Inpaint or mask glare
        clean_gray = gray.copy()
        clean_gray[glare_mask == 255] = int(np.mean(gray))

        # Step 2: Color Space Transformation
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)

        # Region of Interest (ROI) - Core bulk fluid (excluding glass walls)
        margin_x = int(w * 0.08)
        margin_y = int(h * 0.05)
        core_roi_hsv = hsv[margin_y:h - margin_y, margin_x:w - margin_x]
        core_roi_lab = lab[margin_y:h - margin_y, margin_x:w - margin_x]

        # Extract HSV Channels
        hue_channel = core_roi_hsv[:, :, 0]
        sat_channel = core_roi_hsv[:, :, 1]
        val_channel = core_roi_hsv[:, :, 2]

        # Extract LAB Channels (L: Lightness, A: Green-Red, B: Blue-Yellow)
        l_chan = core_roi_lab[:, :, 0]
        a_chan = core_roi_lab[:, :, 1]
        b_chan = core_roi_lab[:, :, 2]

        # Step 3: Green Pixel Ratio & Biomass / OD680 Calculation
        # Healthy Chlorella/Spirulina green spectrum: Hue ~ 35 to 85 (in OpenCV 0-180 scale)
        green_mask = cv2.inRange(core_roi_hsv, np.array([32, 35, 30]), np.array([88, 255, 255]))
        green_pixel_ratio = float(np.count_nonzero(green_mask) / (green_mask.size + 1e-6))

        # Optical density (OD680) inversely correlates with transmitted lightness L*
        # and directly with negative a* (chlorophyll intensity)
        mean_l = float(np.mean(l_chan))
        mean_a = float(np.mean(a_chan))  # lower/negative = greener
        mean_hue = float(np.mean(hue_channel))
        mean_b = float(np.mean(b_chan))   # higher = yellower

        # Physical calibration equation for OD680:
        # High absorption (dense culture) -> Low L*, high green ratio, deep negative a*
        greenness_factor = (128.0 - mean_a) / 60.0  # Normalized greenness
        density_factor = (255.0 - mean_l) / 180.0
        calculated_od680 = max(0.1, min(3.0, (greenness_factor * 0.9 + density_factor * 1.3) * green_pixel_ratio * 1.5))
        biomass_g_l = max(0.08, min(3.2, self.biomass_slope * calculated_od680 + self.biomass_intercept))

        # Step 4: Early Warning Health Diagnostic 1 - Color Hue Shift
        # Deep healthy algae: Mean Hue between 50 and 75
        # Chlorosis / Nitrogen Starvation / Thermal Bleaching: Mean Hue shifts below 44
        hue_shift_detected = False
        hue_diagnosis = "NORMAL_GREEN"
        if mean_hue < 32.0:
            hue_shift_detected = True
            hue_diagnosis = "CHLOROSIS_OR_NITROGEN_DEPLETION"
        elif mean_hue < 45.0:
            hue_shift_detected = True
            hue_diagnosis = "MILD_THERMAL_BLEACHING"

        # Step 5: Early Warning Health Diagnostic 2 - Cell Flocculation & Clumping
        # Canny edge detection & contour analysis on core fluid
        blurred_gray = cv2.GaussianBlur(clean_gray[margin_y:h - margin_y, margin_x:w - margin_x], (5, 5), 0)
        edges = cv2.Canny(blurred_gray, 40, 110)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        clump_areas = []
        clump_bounding_boxes = []
        for c in contours:
            area = cv2.contourArea(c)
            if area > 45.0:  # Significant cell aggregation
                x, y, cw, ch = cv2.boundingRect(c)
                aspect_ratio = max(cw / (ch + 1e-5), ch / (cw + 1e-5))
                # Reject linear glare / reflection artifacts (aspect ratio > 3.5)
                if aspect_ratio < 3.5:
                    clump_areas.append(area)
                    # Map back to global frame coordinates
                    clump_bounding_boxes.append((x + margin_x, y + margin_y, cw, ch, area))

        # Compute Clumping Index (normalized variance & count of large aggregate clusters)
        if len(clump_areas) > 2:
            area_variance = float(np.var(clump_areas))
            clump_density = len(clump_areas)
            clumping_index = float(min(1.0, (area_variance / 8000.0) * 0.4 + (clump_density / 30.0) * 0.6))
        else:
            clumping_index = 0.05

        # Step 6: Early Warning Health Diagnostic 3 - Wall Biofilm Buildup
        # Compare edge perimeter strips (left and right 6% of vessel) vs central core
        left_wall = gray[:, :margin_x]
        right_wall = gray[:, w - margin_x:]
        core_strip = gray[:, margin_x * 2:margin_x * 3]

        mean_wall_intensity = (float(np.mean(left_wall)) + float(np.mean(right_wall))) / 2.0
        mean_core_intensity = float(np.mean(core_strip))
        # Dense dark biofilm buildup on wall causes substantial opacity drop & edge contrast
        wall_opacity_contrast = (mean_core_intensity - mean_wall_intensity) / (mean_core_intensity + 1e-5)
        fouling_detected = bool(wall_opacity_contrast > 0.28)

        # Synthesize Overall Health Status
        if calculated_od680 < 0.35 or clumping_index > 0.65 or (hue_shift_detected and mean_hue < 36):
            health_status = "CRITICAL"
            action = "EMERGENCY: Immediate thermal bypass, biocide flush & nutrient shock therapy required."
        elif clumping_index > 0.35 or hue_shift_detected or fouling_detected:
            health_status = "STRESSED"
            if fouling_detected and clumping_index > 0.35:
                action = "Schedule ultrasonic transducer cleaning & reduce heat exchanger inlet temperature."
            elif fouling_detected:
                action = "Flag ultrasonic wall transducer cleaning cycle (biofilm fouling detected)."
            elif hue_shift_detected:
                action = "Inject nitrogen/micronutrient booster feed; verify heat exchanger return temperature."
            else:
                action = "Mild cell clumping detected: increase sparger aeration flow rate to break aggregates."
        else:
            health_status = "OPTIMAL"
            action = "Culture parameters within optimal photosynthetic productivity zone."

        # Step 7: Render Visual Cyberpunk HUD Overlays
        # Bounding boxes on cell clumps (top 8 largest)
        sorted_clumps = sorted(clump_bounding_boxes, key=lambda b: b[4], reverse=True)[:8]
        for bx, by, bw, bh, barea in sorted_clumps:
            color = (0, 0, 255) if clumping_index > 0.4 else (0, 215, 255)
            cv2.rectangle(annotated, (bx, by), (bx + bw, by + bh), color, 1)
            cv2.putText(
                annotated,
                f"CLUMP:{int(barea)}px",
                (bx, max(12, by - 4)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.35,
                color,
                1
            )

        # Wall fouling markers along edges
        if fouling_detected:
            cv2.rectangle(annotated, (0, 0), (margin_x, h), (0, 0, 220), 2)
            cv2.rectangle(annotated, (w - margin_x, 0), (w, h), (0, 0, 220), 2)
            cv2.putText(
                annotated,
                "! BIOFOULING DETECTED !",
                (12, h - 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.45,
                (0, 0, 255),
                2
            )

        # High-Tech Cyberpunk HUD Header Banner
        hud_bg = np.zeros((82, w, 3), dtype=np.uint8)
        # Gradient banner
        hud_bg[:] = (18, 22, 28)
        annotated[0:82, 0:w] = cv2.addWeighted(annotated[0:82, 0:w], 0.3, hud_bg, 0.7, 0)

        # Border separator
        status_color = (0, 235, 120) if health_status == "OPTIMAL" else ((0, 165, 255) if health_status == "STRESSED" else (0, 0, 255))
        cv2.line(annotated, (0, 82), (w, 82), status_color, 2)

        # Telemetry Text
        cv2.putText(annotated, "THERMO-BLOOM BIO-VISION // DIGITAL TWIN", (12, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)
        cv2.putText(annotated, f"OD680: {calculated_od680:.2f} Abs", (12, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 245, 155), 1)
        cv2.putText(annotated, f"Biomass: {biomass_g_l:.2f} g/L", (180, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 245, 155), 1)
        cv2.putText(annotated, f"Clumping: {clumping_index:.2f}", (340, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 215, 0), 1)
        cv2.putText(annotated, f"Fouling: {'YES' if fouling_detected else 'CLEAR'}", (490, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255) if fouling_detected else (0, 245, 155), 1)

        # Health badge
        cv2.putText(annotated, f"STATUS: {health_status}", (12, 72), cv2.FONT_HERSHEY_SIMPLEX, 0.48, status_color, 2)
        cv2.putText(annotated, f"Hue: {mean_hue:.1f}deg ({hue_diagnosis})", (220, 72), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (200, 200, 200), 1)

        # Reticle in center
        cx, cy = w // 2, h // 2
        cv2.drawMarker(annotated, (cx, cy), (0, 255, 200), cv2.MARKER_CROSS, 20, 1)

        payload = {
            "od680": round(calculated_od680, 2),
            "biomass_g_L": round(biomass_g_l, 2),
            "health_status": health_status,
            "clumping_index": round(clumping_index, 2),
            "fouling_detected": fouling_detected,
            "action": action,
            "mean_hue": round(mean_hue, 1),
            "green_pixel_ratio": round(green_pixel_ratio, 3),
            "hue_shift_detected": hue_shift_detected,
            "hue_diagnosis": hue_diagnosis
        }

        return annotated, payload

    def frame_to_base64_jpeg(self, frame: np.ndarray, quality: int = 80) -> str:
        """Encodes frame into base64 data URI string."""
        encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        success, buffer = cv2.imencode('.jpg', frame, encode_params)
        if not success:
            return ""
        encoded = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/jpeg;base64,{encoded}"

    def frame_to_mjpeg_bytes(self, frame: np.ndarray, quality: int = 75) -> bytes:
        """Encodes frame to JPEG byte buffer for MJPEG multipart streaming."""
        encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        success, buffer = cv2.imencode('.jpg', frame, encode_params)
        if not success:
            return b""
        return buffer.tobytes()
