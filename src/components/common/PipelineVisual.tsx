import React from 'react';
import { useSimulation } from '../../context/SimulationContext';

interface PipelineVisualProps {
  className?: string;
}

export const PipelineVisual: React.FC<PipelineVisualProps> = ({ className = '' }) => {
  const { state } = useSimulation();

  // Dynamic values driven by simulation state
  const isOverheating = state.reactorWaterTemp > 35;
  const isOptimal = state.reactorWaterTemp >= 22 && state.reactorWaterTemp <= 32;

  // Exhaust temperature calculation from server load
  const serverExhaustTemp = Math.round(36 + (state.serverLoad / 100) * 16); // 38°C to 52°C
  const heatSpeed = Math.max(0.6, 2.4 - (state.serverLoad / 100) * 1.6); // faster pulse when higher load
  const bubbleSpeed = Math.max(1.0, 3.5 - (state.co2Level / 1200) * 2.2);

  // Algae fluid state
  const fluidColor = isOverheating
    ? { top: '#FF3B30', bottom: '#991B1B', glow: 'rgba(255, 59, 48, 0.4)', text: 'TOO HOT (37°C) - Diverting Heat' }
    : isOptimal
    ? { top: '#00F59B', bottom: '#059669', glow: 'rgba(0, 245, 155, 0.4)', text: 'PERFECT (28°C) - Algae Doubling' }
    : { top: '#84CC16', bottom: '#4D7C0F', glow: 'rgba(132, 204, 22, 0.3)', text: 'SUB-OPTIMAL TEMPERATURE' };

  return (
    <div className={`crisp-panel rounded-2xl p-4 sm:p-6 relative overflow-hidden ${className}`}>
      {/* Background Subtle Thermal / Bio Ambient Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF3B30]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F59B]/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

      {/* Top Banner: ELI5 Purpose */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#1F242F] pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F59B] animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            The 5-Second Pipeline: How Waste Heat Becomes Green Gold
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-data">
          <span className="text-slate-400">System Mode:</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
              isOverheating
                ? 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/40 animate-pulse'
                : 'bg-[#00F59B]/20 text-[#00F59B] border-[#00F59B]/40'
            }`}
          >
            {isOverheating ? 'Thermal Bypass Active' : 'Optimal Closed-Loop Sync'}
          </span>
        </div>
      </div>

      {/* Interactive SVG Diagram */}
      <div className="relative w-full aspect-[21/9] min-h-[220px] max-h-[380px] flex items-center justify-center">
        <svg
          viewBox="0 0 920 340"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="hotFluidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#FF6B00" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="coolLoopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00F59B" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="algaeVesselGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={fluidColor.bottom} stopOpacity="0.9" />
              <stop offset="100%" stopColor={fluidColor.top} stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="ledDownwardGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F59B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00F59B" stopOpacity="0.0" />
            </linearGradient>

            <filter id="crispGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid background lines */}
          <g stroke="#1F242F" strokeWidth="1" strokeDasharray="4 6" opacity="0.4">
            <line x1="40" y1="60" x2="880" y2="60" />
            <line x1="40" y1="170" x2="880" y2="170" />
            <line x1="40" y1="280" x2="880" y2="280" />
          </g>

          {/* ============================================================== */}
          {/* STEP 1: LEFT BOX - AI DATA CENTER */}
          {/* ============================================================== */}
          <g transform="translate(40, 50)">
            {/* Outer Box */}
            <rect
              x="0"
              y="0"
              width="210"
              height="210"
              rx="12"
              fill="#0F1117"
              stroke="#1F242F"
              strokeWidth="2"
            />
            {/* Header pill */}
            <rect x="0" y="0" width="210" height="34" rx="12" fill="#151822" />
            <text x="105" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="Space Grotesk" letterSpacing="0.5">
              STEP 1: AI DATA CENTER
            </text>

            {/* Server Rack Body */}
            <rect x="25" y="46" width="160" height="110" rx="8" fill="#08090C" stroke="#2E3648" strokeWidth="1.5" />

            {/* Server Blades with pulsing LEDs */}
            {[0, 1, 2].map((idx) => (
              <g key={idx} transform={`translate(35, ${56 + idx * 32})`}>
                <rect x="0" y="0" width="140" height="24" rx="4" fill="#121620" stroke="#1F242F" />
                <circle cx="12" cy="12" r="3" fill="#00F59B" />
                <circle cx="22" cy="12" r="3" fill="#FF3B30">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur={`${0.8 + idx * 0.2}s`} repeatCount="indefinite" />
                </circle>
                <line x1="34" y1="12" x2="128" y2="12" stroke="#2E3648" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>
            ))}

            {/* Radiating Heat Wave Rings from servers */}
            <g transform="translate(190, 100)">
              <path d="M 5 -30 C 18 -15, 18 15, 5 30" fill="none" stroke="#FF3B30" strokeWidth="3" opacity="0.9">
                <animate attributeName="transform" type="translate" values="0,0; 8,0; 0,0" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
              </path>
              <path d="M 16 -24 C 28 -12, 28 12, 16 24" fill="none" stroke="#FF6B00" strokeWidth="2.5" opacity="0.7">
                <animate attributeName="transform" type="translate" values="0,0; 10,0; 0,0" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
              </path>
            </g>

            {/* Live Exhaust Temperature Tag */}
            <rect x="25" y="168" width="160" height="28" rx="6" fill="rgba(255, 59, 48, 0.12)" stroke="rgba(255, 59, 48, 0.4)" strokeWidth="1" />
            <text x="105" y="186" textAnchor="middle" fill="#FF3B30" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
              🔥 Exhaust: {serverExhaustTemp}°C ({state.serverLoad}% Load)
            </text>
          </g>

          {/* ============================================================== */}
          {/* STEP 2: MIDDLE LOOP - HEAT EXCHANGER */}
          {/* ============================================================== */}
          {/* Upper Pipe: Hot Fluid Flow (Server -> Exchanger) */}
          <path
            d="M 250 110 L 375 110"
            fill="none"
            stroke="url(#hotFluidGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#crispGlow)"
          />
          {/* Hot Fluid Arrow Particle */}
          <circle r="4.5" fill="#FFFFFF">
            <animateMotion path="M 250 110 L 375 110" dur={`${heatSpeed}s`} repeatCount="indefinite" />
          </circle>

          {/* Middle Exchanger Unit */}
          <g transform="translate(375, 45)">
            <rect
              x="0"
              y="0"
              width="170"
              height="220"
              rx="12"
              fill="#0F1117"
              stroke="#1F242F"
              strokeWidth="2"
            />
            <rect x="0" y="0" width="170" height="34" rx="12" fill="#151822" />
            <text x="85" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="Space Grotesk" letterSpacing="0.5">
              STEP 2: HEAT EXCHANGER
            </text>

            {/* Coil Graphic */}
            <rect x="20" y="48" width="130" height="110" rx="8" fill="#08090C" stroke="#2E3648" strokeWidth="1.5" />
            {/* Heat conversion coil */}
            <path
              d="M 40 70 C 65 70, 65 90, 40 90 C 15 90, 15 110, 40 110 C 65 110, 65 130, 40 130 C 15 130, 15 150, 40 150"
              fill="none"
              stroke="#FF6B00"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <animate attributeName="stroke" values="#FF3B30;#FF6B00;#00F59B;#FF6B00" dur="3s" repeatCount="indefinite" />
            </path>
            <path
              d="M 130 70 C 105 70, 105 90, 130 90 C 155 90, 155 110, 130 110 C 105 110, 105 130, 130 130 C 155 130, 155 150, 130 150"
              fill="none"
              stroke="#00D2FF"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Center Converter Icon Badge */}
            <circle cx="85" cy="108" r="16" fill="#151822" stroke="#00F59B" strokeWidth="2" />
            <text x="85" y="112" textAnchor="middle" fill="#00F59B" fontSize="11" fontWeight="bold">ΔT</text>

            {/* Live Absorbed Heat Tag */}
            <rect x="15" y="172" width="140" height="28" rx="6" fill="rgba(0, 210, 255, 0.1)" stroke="rgba(0, 210, 255, 0.3)" strokeWidth="1" />
            <text x="85" y="190" textAnchor="middle" fill="#00D2FF" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
              ⚡ Absorbs {state.heatAbsorbedKW} kW
            </text>
          </g>

          {/* Forward Warm Fluid Pipe (Exchanger -> Algae) */}
          <path
            d="M 545 110 L 670 110"
            fill="none"
            stroke="url(#coolLoopGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#crispGlow)"
          />
          <circle r="4.5" fill="#FFFFFF">
            <animateMotion path="M 545 110 L 670 110" dur="1.2s" repeatCount="indefinite" />
          </circle>

          {/* Bottom Cooled Water Return Pipe (Algae/Exchanger -> Server) */}
          <path
            d="M 670 200 L 250 200"
            fill="none"
            stroke="#00D2FF"
            strokeWidth="4"
            strokeDasharray="6 6"
            opacity="0.8"
          >
            <animate attributeName="stroke-dashoffset" values="24;0" dur="1s" repeatCount="indefinite" />
          </path>
          <text x="460" y="222" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">
            ◄ Clean Cooled Water Return (Saves AC Chiller Power)
          </text>

          {/* ============================================================== */}
          {/* STEP 3: RIGHT BOX - ALGAE BIO-VESSEL */}
          {/* ============================================================== */}
          <g transform="translate(670, 45)">
            <rect
              x="0"
              y="0"
              width="210"
              height="220"
              rx="12"
              fill="#0F1117"
              stroke="#1F242F"
              strokeWidth="2"
            />
            <rect x="0" y="0" width="210" height="34" rx="12" fill="#151822" />
            <text x="105" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="Space Grotesk" letterSpacing="0.5">
              STEP 3: ALGAE BIO-VESSEL
            </text>

            {/* Photobioreactor Glass Columns Array */}
            {[0, 1, 2, 3].map((col) => {
              const xPos = 20 + col * 44;
              return (
                <g key={col}>
                  {/* Glass Tube Outer */}
                  <rect x={xPos} y="44" width="36" height="114" rx="18" fill="#08090C" stroke="#2E3648" strokeWidth="1.5" />
                  
                  {/* Living Algae Liquid Core */}
                  <rect
                    x={xPos + 3}
                    y="54"
                    width="30"
                    height="100"
                    rx="14"
                    fill="url(#algaeVesselGradient)"
                    filter="url(#crispGlow)"
                    opacity="0.9"
                  />

                  {/* Rising Oxygen / CO2 Bubbles */}
                  {[0, 1].map((b) => (
                    <circle key={b} cx={xPos + 12 + b * 10} cy="140" r="2.5" fill="#FFFFFF" opacity="0.8">
                      <animate
                        attributeName="cy"
                        from="145"
                        to="60"
                        dur={`${bubbleSpeed + b * 0.4}s`}
                        begin={`${col * 0.3 + b * 0.5}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </g>
              );
            })}

            {/* Live Algae Health Tag */}
            <rect
              x="15"
              y="172"
              width="180"
              height="28"
              rx="6"
              fill={isOverheating ? 'rgba(255, 59, 48, 0.15)' : 'rgba(0, 245, 155, 0.15)'}
              stroke={isOverheating ? 'rgba(255, 59, 48, 0.4)' : 'rgba(0, 245, 155, 0.4)'}
              strokeWidth="1"
            />
            <text
              x="105"
              y="190"
              textAnchor="middle"
              fill={isOverheating ? '#FF3B30' : '#00F59B'}
              fontSize="10.5"
              fontFamily="JetBrains Mono"
              fontWeight="bold"
            >
              🌿 Tank: {state.reactorWaterTemp}°C ({isOverheating ? 'Stress' : 'Doubling'})
            </text>
          </g>
        </svg>
      </div>

      {/* Dynamic Conversion Strip Underneath */}
      <div className="mt-3 pt-3 border-t border-[#1F242F] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs font-mono-data">
          <span className="text-slate-400">Live Equation:</span>
          <span className="px-2.5 py-1 rounded bg-[#08090C] border border-[#1F242F] font-bold text-white">
            🔥 <span className="text-[#FF3B30]">{state.heatAbsorbedKW} kW</span> AI Heat In
            <span className="text-slate-500 mx-2">➔</span>
            🌿 <span className="text-[#00F59B]">{state.biomassAccumulatedTodayKg} kg</span> Biomass Today
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            CO₂ Absorbed: <strong className="text-[#00F59B] font-mono-data">{state.co2UptakeRateKgDay} kg/day</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            Cooling AC Bill Saved: <strong className="text-[#00D2FF] font-mono-data">{state.coolingEnergyOffsetPercent}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
