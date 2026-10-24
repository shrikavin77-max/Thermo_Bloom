# THERMO-BLOOM 🌿⚡

> **Turning AI Data-Center Waste Heat into Urban Microalgae Super-Factories**
> An AI-controlled digital twin that transforms low-grade data-center heat, water, and CO₂ into measurable algae biomass.

---

## 🌍 Overview & Concept

Modern AI data centers consume vast amounts of electrical power, with over 90% degrading into low-grade thermal waste (30°C–45°C). Traditional cooling systems reject this heat via chillers and evaporative cooling towers, wasting energy and potable water.

**THERMO-BLOOM** provides an alternative: a modular closed-loop photobioreactor (PBR) system that captures this low-grade heat, pairing it with controlled CO₂ injection, multi-spectrum LED lighting, and nutrient dosing to cultivate microalgae (*Chlorella vulgaris*, *Spirulina platensis*).

> **Climate-Tech Disclaimer:** THERMO-BLOOM is presented as a thermal waste-heat recovery, chiller cooling offset, and biomass value-creation digital twin. It does not claim to eliminate all data-center carbon emissions. All calculations utilize modeled biological kinetics and thermodynamic heat-exchange equations.

---

## 🚀 Key Features

### 1. 🎛️ Digital Twin Control Room (`/dashboard`)
- **Interactive Control Sliders:**
  - Data-center server load (20% – 100%)
  - Coolant inlet temperature (25°C – 45°C)
  - Coolant flow rate (10 – 100 L/min)
  - Ambient outdoor temperature (18°C – 40°C)
  - Photon flux light intensity (0 – 800 µmol/m²/s)
  - CO₂ concentration (200 – 1200 ppm)
  - Nutrient dosing level (10% – 100%)
  - Water closed-loop recirculation rate (50% – 98%)
- **Live Simulated Telemetry (1-Second Reactive Loop):**
  - Algae Growth Velocity (g/L/day)
  - Biomass accumulated today (kg) & culture density (g/L)
  - Waste heat absorbed by bioreactor (kW) vs heat rejected
  - CO₂ uptake rate (kg/day & g/hr)
  - Culture health score (0 – 100%)
  - Dynamic pH calculation with carbonic buffer mechanics
  - Dissolved oxygen (mg/L)
  - Bioreactor water temperature (°C)
  - Harvest readiness percentage (0 – 100%)
- **Animated SVG Photobioreactor Visual:**
  - Real-time fluid color shifting (vibrant emerald for optimal health, lime/amber under thermal/pH stress)
  - Animated heat pulses traveling from GPU server racks through plate heat exchangers
  - Dynamic bubbling animation for CO₂ sparging
  - Multi-tube photobioreactor column rendering
- **AI Rule-Based Advisor:**
  - Generates real-time biological and thermal recommendations with one-click "Apply Optimization" actions
  - **Auto-Pilot Autonomous Mode**: continuously modulates coolant flow, light, and nutrients to remain in peak bloom
- **Safety Diagnostics & Alert Feed:**
  - Overheat warnings (>35°C critical threshold)
  - pH imbalance alerts (<7.0 or >8.6)
  - Low CO₂ & nutrient imbalance advisories
  - Heat exchanger saturation warnings
- **Simulated Harvest Cycle:**
  - "Trigger Harvest" button with batch certificate modal, quality grade rating (A+, A, B), and confetti celebration

### 2. 🇮🇳 6-Site Indian Pilot Fleet
Switch between 6 realistic Indian data center facilities, each with distinct capacity, rack counts, server loads, and strains:
1. **Coimbatore** — *Green Edge Hub* (2.4 MW, *Chlorella vulgaris*)
2. **Chennai** — *Siruseri Hyperscale Park* (8.5 MW, *Spirulina platensis*)
3. **Hyderabad** — *HITEC AI Innovation Pod* (12.0 MW, *Chlorella sorokiniana*)
4. **Bengaluru** — *Silicon Supercomputing Center* (5.2 MW, *Scenedesmus obliquus*)
5. **Mumbai** — *Coastal Hyperscale Hub* (15.0 MW, *Haematococcus pluvialis*)
6. **Noida** — *NCR Compute Campus* (6.8 MW, *Chlorella vulgaris*)

### 3. 📊 Analytical Charts (Recharts)
- **Line Chart**: 24-hour biomass accumulation curve & growth velocity
- **Area Chart**: Waste heat absorbed by algae (kW) vs rejected to chillers
- **Bar Chart**: 7-day historical biomass production and CO₂ sequestered
- **Radial Progress Gauges**: Real-time Culture Health Score & Harvest Readiness

### 4. 📈 Impact Model & Scaling Engine (`/impact`)
- Scalable capacity slider (1 MW to 50 MW)
- Annual heat recovered (MWh & GJ), CO₂ utilized (metric tons), and biomass potential
- Comprehensive comparison table: Conventional Chiller Cooling vs. THERMO-BLOOM
- Print-friendly / exportable impact report summary card

### 5. 💡 About & Pitch Deck (`/about`)
- Industry problem breakdown & biological solution
- Technical differentiation: Closed-loop digital twin vs. conventional algae farms
- Stakeholder value for operators, ESG teams, and urban developers
- 4-phase roadmap (IoT hardware mesh, flue gas direct capture, national fleet telemetry)

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom dark climate-tech glassmorphism
- **Charts**: [Recharts v3](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Interactive Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Routing**: [React Router v7](https://reactrouter.com/)

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js **v18+** or **v20+** (tested on Node v25)
- npm **v9+**

### Installation

1. Clone or open the project directory:
   ```bash
   cd Thermo_Bloom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Preview the production build:
   ```bash
   npm run preview
   ```

---

## 📐 Architecture & Mathematical Modeling

The simulation engine in `src/utils/simulation.ts` implements biophysical kinetics:

1. **Thermodynamics:**
   $$\text{Heat}_{\text{available}} = \text{Capacity}_{\text{kW}} \times \left(\frac{\text{Load}}{100}\right) \times 0.92$$
   $$\text{Heat}_{\text{absorbed}} = \min(\text{Capacity}_{\text{reactor}}, \text{Heat}_{\text{available}} \times \eta_{\text{flow}} \times \Delta T)$$

2. **Algae Kinetics (Monod & Arrhenius):**
   - Optimal temperature bell curve centered at **27°C** (safe range 22°C–32°C).
   - Thermal stress penalties above 35°C.
   - Light saturation model with photoinhibition threshold above 750 µmol/m²/s.
   - CO₂ uptake stoichiometric factor of **1.83 kg CO₂ per kg dry algae**.
   - Closed-loop pH buffering dynamic based on CO₂ solubility and photosynthetic alkalinity shift.

---

## 👥 Hackathon Presentation Highlights
- **No placeholder text**: 100% domain-specific copy, realistic units (µmol/m²/s, ppm, L/min, g/L/day, MWh).
- **Responsive**: Clean viewing across desktop monitors, laptops, and mobile screens.
- **Interactive Control Room**: Sliders, real-time feedback, presets, Auto-Pilot mode, and audible celebration on harvest.
