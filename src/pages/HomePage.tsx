import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, Droplets, Sprout } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const HomePage: React.FC = () => {
  const { state } = useSimulation();

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Category Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#121212] border-2 border-[#242424] text-xs font-display font-bold uppercase tracking-wider text-white">
            <span className="w-2 h-2 rounded-full bg-[#E4002B] animate-pulse" />
            <span>Industrial Climate-Tech Digital Twin</span>
            <span className="text-[#242424]">|</span>
            <span className="text-[#E4002B]">Zero-Loss Thermal Assembly</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight uppercase leading-[1.05]">
            COOLING AI SERVERS.{' '}
            <span className="text-[#E4002B]">GROWING BIO-SUPERPLANTS.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A digital twin platform that captures 40°C data-center waste heat and channels it to accelerate urban microalgae production.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/digital-twin"
              className="w-full sm:w-auto btn-red px-8 py-4 rounded-md text-sm uppercase tracking-wider font-display font-extrabold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02]"
            >
              <span>Enter Live Digital Twin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/impact"
              className="w-full sm:w-auto btn-outline-white px-8 py-4 rounded-md text-sm uppercase tracking-wider font-display font-extrabold flex items-center justify-center gap-2 shadow-md"
            >
              <span>View Impact Metrics</span>
            </Link>
          </div>
        </div>

        {/* 2. THE 3-STEP VISUAL MACHINE (Interactive Assembly Line Diagram) */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="kfc-card rounded-xl p-5 sm:p-7 border-2 border-[#242424] bg-[#0A0A0A]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#242424] text-xs font-mono-code">
              <span className="text-white font-bold uppercase">Thermal Assembly Line Schematic</span>
              <span className="text-[#E4002B] font-bold">100% Closed-Loop Thermal Bridge</span>
            </div>

            {/* SVG Visual Assembly Line */}
            <div className="relative w-full aspect-[21/9] min-h-[200px] max-h-[300px] flex items-center justify-center">
              <svg viewBox="0 0 900 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                {/* 1. Box 1 (Left - Red Accent): AI Racks Run Hot */}
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="220" height="200" rx="10" fill="#121212" stroke="#E4002B" strokeWidth="2.5" />
                  <rect x="0" y="0" width="220" height="34" rx="10" fill="#E4002B" />
                  <text x="110" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="Space Grotesk" letterSpacing="0.5">
                    1. AI RACKS RUN HOT
                  </text>

                  {/* Server blades with blinking LEDs */}
                  {[0, 1, 2].map((i) => (
                    <g key={i} transform={`translate(20, ${50 + i * 36})`}>
                      <rect x="0" y="0" width="180" height="26" rx="4" fill="#0A0A0A" stroke="#242424" strokeWidth="1.5" />
                      <circle cx="14" cy="13" r="4" fill="#E4002B">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur={`${0.8 + i * 0.3}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx="28" cy="13" r="4" fill="#FFFFFF" />
                      <line x1="42" y1="13" x2="165" y2="13" stroke="#242424" strokeWidth="2" strokeDasharray="4 4" />
                    </g>
                  ))}

                  <text x="110" y="185" textAnchor="middle" fill="#E4002B" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">
                    🔥 Server Exhaust: 42°C
                  </text>
                </g>

                {/* Connecting Pipe 1 (Server to Smart Valve) */}
                <path d="M 250 130 L 370 130" fill="none" stroke="#E4002B" strokeWidth="6" strokeLinecap="round" />
                <circle r="4.5" fill="#FFFFFF">
                  <animateMotion path="M 250 130 L 370 130" dur="1s" repeatCount="indefinite" />
                </circle>

                {/* 2. Box 2 (Center - White Accent): Smart AI Valve */}
                <g transform="translate(370, 30)">
                  <rect x="0" y="0" width="200" height="200" rx="10" fill="#121212" stroke="#FFFFFF" strokeWidth="2.5" />
                  <rect x="0" y="0" width="200" height="34" rx="10" fill="#FFFFFF" />
                  <text x="100" y="22" textAnchor="middle" fill="#0A0A0A" fontSize="12" fontWeight="900" fontFamily="Space Grotesk" letterSpacing="0.5">
                    2. SMART AI VALVE
                  </text>

                  {/* Flow control valve graphic */}
                  <circle cx="100" cy="95" r="36" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth="2" />
                  <path d="M 75 95 L 125 95 M 100 70 L 100 120" stroke="#E4002B" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="100" cy="95" r="8" fill="#E4002B" />

                  <text x="100" y="155" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="Space Grotesk">
                    Active Flow Balancing
                  </text>
                  <text x="100" y="172" textAnchor="middle" fill="#E4002B" fontSize="10.5" fontFamily="JetBrains Mono" fontWeight="bold">
                    Regulates 28°C Safe Zone
                  </text>
                </g>

                {/* Connecting Pipe 2 (Valve to Algae Tanks) */}
                <path d="M 570 130 L 690 130" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                <circle r="4.5" fill="#E4002B">
                  <animateMotion path="M 570 130 L 690 130" dur="1s" repeatCount="indefinite" />
                </circle>

                {/* 3. Box 3 (Right - Red/White Accent): Algae Bio-Tanks */}
                <g transform="translate(690, 30)">
                  <rect x="0" y="0" width="200" height="200" rx="10" fill="#121212" stroke="#E4002B" strokeWidth="2.5" />
                  <rect x="0" y="0" width="200" height="34" rx="10" fill="#E4002B" />
                  <text x="100" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="Space Grotesk" letterSpacing="0.5">
                    3. ALGAE BIO-TANKS
                  </text>

                  {/* Vertical Photobioreactor Columns */}
                  {[0, 1, 2].map((col) => (
                    <g key={col} transform={`translate(${30 + col * 50}, 50)`}>
                      <rect x="0" y="0" width="36" height="100" rx="18" fill="#0A0A0A" stroke="#242424" strokeWidth="2" />
                      <rect x="4" y="20" width="28" height="76" rx="14" fill="#E4002B" opacity="0.8" />
                      {/* Rising gas bubbles */}
                      <circle cx="18" cy="80" r="2.5" fill="#FFFFFF">
                        <animate attributeName="cy" from="85" to="25" dur="1.8s" begin={`${col * 0.4}s`} repeatCount="indefinite" />
                      </circle>
                    </g>
                  ))}

                  <text x="100" y="185" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                    🌿 Rapid Biomass Harvest
                  </text>
                </g>
              </svg>
            </div>

            <div className="mt-3 pt-3 border-t-2 border-[#242424] flex flex-col sm:flex-row items-center justify-between text-xs font-mono-code text-slate-400 text-center sm:text-left gap-2">
              <div>
                🔥 <strong className="text-white">{state.heatAbsorbedKW} kW</strong> Server Heat Captured ➔ 🌿 <strong className="text-[#E4002B]">{state.biomassAccumulatedTodayKg} kg</strong> Biomass Formed
              </div>
              <div className="text-white">
                Zero Electric Chiller Waste
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 3 BIG METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metric 1 */}
          <div className="kfc-card rounded-xl p-6 border-2 border-[#242424] space-y-2 text-center md:text-left">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">
              Waste Heat Redirected
            </span>
            <div className="text-4xl sm:text-5xl font-mono-code font-black text-white">
              1.2 <span className="text-xl font-bold text-[#E4002B]">MWh/day</span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Low-grade server thermal exhaust repurposed for biological kinetic growth.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="kfc-card rounded-xl p-6 border-2 border-[#E4002B] space-y-2 text-center md:text-left">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E4002B]">
              CO₂ Permanently Fixed
            </span>
            <div className="text-4xl sm:text-5xl font-mono-code font-black text-white">
              480 <span className="text-xl font-bold text-[#E4002B]">kg/day</span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Biological sequestration locked into microalgae cells (1.83 kg CO₂/kg biomass).
            </p>
          </div>

          {/* Metric 3 */}
          <div className="kfc-card rounded-xl p-6 border-2 border-[#242424] space-y-2 text-center md:text-left">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">
              AC Electricity Cut
            </span>
            <div className="text-4xl sm:text-5xl font-mono-code font-black text-white">
              14% <span className="text-xl font-bold text-[#E4002B]">Lower</span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Direct reduction to data-center chiller compressor and cooling tower electricity.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS IN EVERYDAY LANGUAGE (3 High-Contrast Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="kfc-card rounded-xl p-6 sm:p-10 border-2 border-[#242424]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-[#E4002B]">
              Zero Jargon
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase">
              How The Recovery Cycle Works
            </h2>
            <p className="text-sm text-slate-300">
              Here is how GPU processors crunching AI code turn directly into commercial fertilizer:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-[#E4002B] text-white flex items-center justify-center font-display font-extrabold text-base">
                  01
                </div>
                <Flame className="w-5 h-5 text-[#E4002B]" />
              </div>
              <h3 className="text-lg font-display font-bold text-white uppercase">
                Chips Run Hot (40°C+)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                NVIDIA and AMD accelerators crunch prompts and blow out hot liquid coolant instead of usable energy.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-lg bg-[#0A0A0A] border-2 border-[#FFFFFF] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-[#FFFFFF] text-[#0A0A0A] flex items-center justify-center font-display font-extrabold text-base">
                  02
                </div>
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-display font-bold text-white uppercase">
                AI Valve Regulates Heat
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Closed-loop pipes siphon the warmth through a smart thermal bridge, bypassing power-hungry AC chillers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-lg bg-[#0A0A0A] border-2 border-[#E4002B] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-[#E4002B] text-white flex items-center justify-center font-display font-extrabold text-base">
                  03
                </div>
                <Sprout className="w-5 h-5 text-[#E4002B]" />
              </div>
              <h3 className="text-lg font-display font-bold text-white uppercase">
                Algae Multiplies Rapidly
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The warm fluid keeps algae tanks in the 28°C sweet spot, doubling cellular density and yielding saleable biomass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. JURY CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-xl bg-[#121212] border-2 border-[#E4002B] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase">
              Ready to test the 3-Stage Simulator?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Switch workload scenarios, view the real-time AI valve balancing in action, and trigger automated harvests.
            </p>
          </div>

          <Link
            to="/digital-twin"
            className="btn-red px-8 py-4 rounded-md text-sm uppercase tracking-wider font-display font-extrabold flex items-center gap-2 shrink-0 shadow-lg"
          >
            <span>Launch Digital Twin</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
