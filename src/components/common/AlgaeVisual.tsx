import React from 'react';
import { useSimulation } from '../../context/SimulationContext';

export const AlgaeVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { state, activeSite } = useSimulation();

  // Dynamic colors based on culture health and biomass density
  const getFluidColor = () => {
    if (state.cultureHealthScore < 45 || state.reactorWaterTemp > 35) {
      return {
        gradientStart: '#ca8a04', // stressed olive-amber
        gradientEnd: '#854d0e',
        glow: 'rgba(202, 138, 4, 0.4)',
        stateText: 'Thermal Stress / Deceleration',
        textColor: 'text-amber-400',
      };
    } else if (state.cultureHealthScore < 75) {
      return {
        gradientStart: '#65a30d', // moderate green
        gradientEnd: '#3f6212',
        glow: 'rgba(101, 163, 13, 0.4)',
        stateText: 'Sub-Optimal Acclimation',
        textColor: 'text-lime-400',
      };
    } else {
      return {
        gradientStart: '#10b981', // vibrant emerald / cyan
        gradientEnd: '#06b6d4',
        glow: 'rgba(16, 185, 129, 0.45)',
        stateText: 'Exponential Bloom Phase',
        textColor: 'text-emerald-400',
      };
    }
  };

  const fluid = getFluidColor();
  const lightGlowOpacity = Math.min(1, Math.max(0.15, state.lightIntensity / 800));
  const bubbleSpeed = Math.max(1.2, 4.5 - (state.co2Level / 1200) * 3); // faster if higher CO2

  return (
    <div className={`glass-panel-glow rounded-2xl p-5 relative overflow-hidden ${className}`}>
      {/* Background ambient glow matching reactor fluid */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
        style={{ background: fluid.glow, opacity: 0.25 }}
      />

      {/* Header telemetry info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 relative z-10 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-['Space_Grotesk']">
            Digital Twin Bioreactor Physics Module
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400">Culture:</span>
          <span className={`font-semibold ${fluid.textColor}`}>{fluid.stateText}</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">{state.reactorWaterTemp}°C</span>
        </div>
      </div>

      {/* SVG Interactive Architecture Diagram */}
      <div className="relative w-full aspect-[16/9] min-h-[220px] max-h-[340px] flex items-center justify-center">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="serverHeatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="algaeFluidGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={fluid.gradientEnd} stopOpacity="0.9" />
              <stop offset="100%" stopColor={fluid.gradientStart} stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="ledGlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity={lightGlowOpacity * 0.9} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="chilledWaterGradient" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid lines */}
          <g opacity="0.12" stroke="#38bdf8" strokeWidth="1">
            <line x1="50" y1="50" x2="750" y2="50" strokeDasharray="4 6" />
            <line x1="50" y1="150" x2="750" y2="150" strokeDasharray="4 6" />
            <line x1="50" y1="250" x2="750" y2="250" strokeDasharray="4 6" />
            <line x1="50" y1="350" x2="750" y2="350" strokeDasharray="4 6" />
          </g>

          {/* 1. DATA CENTER SERVER RACK (Left) */}
          <g transform="translate(60, 90)">
            {/* Server Rack Body */}
            <rect
              x="0"
              y="0"
              width="140"
              height="260"
              rx="12"
              fill="#090d1a"
              stroke="#1e293b"
              strokeWidth="2.5"
            />
            <rect
              x="8"
              y="10"
              width="124"
              height="240"
              rx="8"
              fill="#0d1527"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Server Blades with Blinking Activity LEDs */}
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <g key={idx} transform={`translate(16, ${22 + idx * 36})`}>
                <rect x="0" y="0" width="108" height="26" rx="4" fill="#131d33" stroke="#1e293b" />
                <circle cx="12" cy="13" r="3" fill="#22c55e">
                  <animate attributeName="opacity" values="1;0.3;1" dur={`${0.8 + idx * 0.3}s`} repeatCount="indefinite" />
                </circle>
                <circle cx="22" cy="13" r="3" fill="#06b6d4">
                  <animate attributeName="opacity" values="0.3;1;0.4" dur={`${1.2 + idx * 0.2}s`} repeatCount="indefinite" />
                </circle>
                <line x1="34" y1="13" x2="96" y2="13" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            ))}

            {/* Header label */}
            <text x="70" y="-12" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600" letterSpacing="1">
              AI SERVER CLUSTER
            </text>
            <text x="70" y="280" textAnchor="middle" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="bold">
              {state.serverLoad}% GPU Load
            </text>
          </g>

          {/* 2. HEAT TRANSFER PIPES (Warm Coolant -> Exchanger) */}
          <g>
            {/* Top Warm Coolant Pipe */}
            <path
              d="M 200 150 L 320 150 L 320 200"
              fill="none"
              stroke="url(#serverHeatGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glowFilter)"
            />
            {/* Animated heat pulses */}
            <circle r="4" fill="#fbbf24">
              <animateMotion
                path="M 200 150 L 320 150 L 320 200"
                dur={`${2.5 - (state.serverLoad / 100) * 1.5}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle r="4" fill="#ef4444">
              <animateMotion
                path="M 200 150 L 320 150 L 320 200"
                dur={`${2.5 - (state.serverLoad / 100) * 1.5}s`}
                begin="0.7s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Bottom Return Cooled Water Pipe */}
            <path
              d="M 320 280 L 320 310 L 200 310"
              fill="none"
              stroke="url(#chilledWaterGradient)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle r="3.5" fill="#38bdf8">
              <animateMotion
                path="M 320 280 L 320 310 L 200 310"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* 3. HEAT EXCHANGER INTERMEDIATE MODULE */}
          <g transform="translate(300, 190)">
            <rect
              x="-20"
              y="0"
              width="80"
              height="95"
              rx="8"
              fill="#0b1324"
              stroke="#0ea5e9"
              strokeWidth="2"
            />
            {/* Coil graphic */}
            <path
              d="M 0 15 C 25 15, 25 35, 0 35 C -20 35, -20 55, 0 55 C 25 55, 25 75, 0 75"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <text x="20" y="112" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600">
              HEAT EXCHANGER
            </text>
            <text x="20" y="126" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              {state.heatAbsorbedKW} kW Harvested
            </text>
          </g>

          {/* 4. TRANSFER CONDUIT (Exchanger to Bioreactor) */}
          <g>
            <path
              d="M 360 240 L 440 240"
              fill="none"
              stroke="#10b981"
              strokeWidth="5"
              strokeDasharray="6 4"
            >
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.2s" repeatCount="indefinite" />
            </path>
            <text x="400" y="230" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="600">
              +ΔT Warm
            </text>
          </g>

          {/* 5. PHOTOBIOREACTOR COLUMN SYSTEM (Right) */}
          <g transform="translate(450, 70)">
            {/* Top Overhead LED Spectrum Array */}
            <rect x="0" y="0" width="280" height="22" rx="5" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            <text x="140" y="-8" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="600" letterSpacing="1">
              LED PHOTOSYNTHESIS ILLUMINATION
            </text>
            {/* LED emitter dots */}
            {[20, 50, 80, 110, 140, 170, 200, 230, 260].map((xPos, idx) => (
              <circle key={idx} cx={xPos} cy="11" r="3.5" fill="#67e8f9">
                <animate
                  attributeName="opacity"
                  values={`${lightGlowOpacity * 0.7};${lightGlowOpacity};${lightGlowOpacity * 0.8}`}
                  dur={`${1 + idx * 0.15}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            {/* Downward light beams */}
            <polygon
              points="10,22 270,22 280,180 0,180"
              fill="url(#ledGlowGradient)"
              pointerEvents="none"
            />

            {/* Bioreactor Vertical Glass Tubes */}
            {[0, 1, 2, 3, 4].map((col) => {
              const tubeX = 18 + col * 52;
              return (
                <g key={col}>
                  {/* Outer Glass Tube */}
                  <rect
                    x={tubeX}
                    y="35"
                    width="40"
                    height="260"
                    rx="18"
                    fill="#051419"
                    stroke="#1e293b"
                    strokeWidth="2"
                  />

                  {/* Algae Fluid Volume */}
                  <rect
                    x={tubeX + 3}
                    y="55"
                    width="34"
                    height="235"
                    rx="14"
                    fill="url(#algaeFluidGradient)"
                    filter="url(#glowFilter)"
                    opacity="0.85"
                  />

                  {/* Surface meniscus wave animation */}
                  <path
                    d={`M ${tubeX + 3} 60 Q ${tubeX + 20} 55, ${tubeX + 37} 60 L ${tubeX + 37} 70 L ${tubeX + 3} 70 Z`}
                    fill="#34d399"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="d"
                      values={`M ${tubeX + 3} 60 Q ${tubeX + 20} 55, ${tubeX + 37} 60 L ${tubeX + 37} 70 L ${tubeX + 3} 70 Z;
                              M ${tubeX + 3} 57 Q ${tubeX + 20} 63, ${tubeX + 37} 57 L ${tubeX + 37} 70 L ${tubeX + 3} 70 Z;
                              M ${tubeX + 3} 60 Q ${tubeX + 20} 55, ${tubeX + 37} 60 L ${tubeX + 37} 70 L ${tubeX + 3} 70 Z`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Rising Bubbles (CO2 & Photosynthetic O2) */}
                  {[0, 1, 2].map((bIdx) => (
                    <circle
                      key={bIdx}
                      cx={tubeX + 12 + bIdx * 8}
                      cy="270"
                      r={2 + bIdx * 0.8}
                      fill="#ffffff"
                      opacity="0.75"
                    >
                      <animate
                        attributeName="cy"
                        from="275"
                        to="65"
                        dur={`${bubbleSpeed + bIdx * 0.4}s`}
                        begin={`${bIdx * 0.7 + col * 0.3}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="cx"
                        values={`${tubeX + 12 + bIdx * 8};${tubeX + 18 + bIdx * 4};${tubeX + 14 + bIdx * 6}`}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </g>
              );
            })}

            {/* Bottom manifold pipe interconnecting columns */}
            <rect x="10" y="295" width="260" height="16" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="140" y="330" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">
              CLOSED-LOOP PHOTOBIOREACTOR (PBR)
            </text>
            <text x="140" y="344" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace">
              {activeSite.algaeSpecies}
            </text>
          </g>

          {/* 6. CO2 & NUTRIENTS INJECTION PORTS */}
          <g transform="translate(620, 395)">
            <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">CO₂</text>
            <text x="24" y="4" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              {state.co2Level} ppm
            </text>
          </g>

          <g transform="translate(480, 395)">
            <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">N+P</text>
            <text x="24" y="4" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              {state.nutrientLevel}% Nutrient
            </text>
          </g>
        </svg>
      </div>

      {/* Real-time status ticker under visual */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-800/80 text-center">
        <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Growth Velocity</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {state.algaeGrowthRate} <span className="text-[10px] font-normal text-slate-400">g/L/day</span>
          </span>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Heat Absorbed</span>
          <span className="text-sm font-bold text-amber-400 font-mono">
            {state.heatAbsorbedKW} <span className="text-[10px] font-normal text-slate-400">kW</span>
          </span>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">CO₂ Uptake</span>
          <span className="text-sm font-bold text-cyan-400 font-mono">
            {state.co2UptakeRateKgDay} <span className="text-[10px] font-normal text-slate-400">kg/day</span>
          </span>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Readiness</span>
          <span className="text-sm font-bold text-teal-400 font-mono">
            {state.harvestReadinessPercent}% <span className="text-[10px] font-normal text-slate-400">Density</span>
          </span>
        </div>
      </div>
    </div>
  );
};
