import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Droplets,
  Sprout,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import confetti from 'canvas-confetti';

type StakeholderLens = 'unified' | 'facility' | 'bio';

export const DigitalTwinPage: React.FC = () => {
  const { state, updateControl, resetToDefaults, activeSite, history24h, toggleAutoPilot } = useSimulation();

  // Stakeholder Lens: Unified Grid | Facility Engineer | Bio-Operator
  const [stakeholderLens, setStakeholderLens] = useState<StakeholderLens>('unified');

  // Local state for interactive 3-stage assembly
  const [tankHarvestLevel, setTankHarvestLevel] = useState<number>(76);
  const [harvestEarningsINR, setHarvestEarningsINR] = useState<number>(34500);
  const [showHarvestToast, setShowHarvestToast] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<'idle' | 'standard' | 'deep'>('standard');

  // Manual vs AI Autopilot state
  const isAutoPilot = state.isAutoPilot;

  // Temperature and Valve Calculations:
  // In AI Autopilot mode: Valve regulates perfectly, locking tank temp near 28.2°C
  // In Manual Override mode: High server load (>85%) pushes reactor water temp > 35°C
  let effectiveTankTemp = state.reactorWaterTemp;
  let valveAperturePercent = 64;

  if (isAutoPilot) {
    // Locked right around 28.2°C
    effectiveTankTemp = 28.2;
    valveAperturePercent = Math.min(88, Math.max(42, Math.round(35 + (state.serverLoad / 100) * 45)));
  } else {
    // Manual mode without auto-bypass
    if (state.serverLoad > 85) {
      effectiveTankTemp = Number((34.5 + ((state.serverLoad - 85) / 15) * 4.2).toFixed(1)); // 34.5 - 38.7°C
      valveAperturePercent = 42; // static restricted valve
    } else {
      effectiveTankTemp = Number((24.0 + (state.serverLoad / 85) * 7.5).toFixed(1)); // 24.0 - 31.5°C
      valveAperturePercent = 55;
    }
  }

  // Critical Overheat Alarm condition
  const isCriticalThermalShock = !isAutoPilot && state.serverLoad > 85;
  const isSafeGrowth = effectiveTankTemp >= 22 && effectiveTankTemp <= 32;

  // Stage 1: Server Heat calculations
  const serverThermalOutputKW = Math.round(state.serverLoad * 1.6);
  const serverExhaustTemp = Math.round(38 + (state.serverLoad / 100) * 16); // 38°C to 54°C

  // Dynamic particle speed in seconds (higher load = faster particle transit)
  const particleDurationSeconds = Math.max(0.6, 2.2 - (state.serverLoad / 100) * 1.4);

  // Growth Rate & Speedometer
  const photosyntheticMultiplier = isCriticalThermalShock
    ? '0.3x (Stressed)'
    : `${(1.2 + (state.serverLoad / 100) * 1.4).toFixed(1)}x baseline`;

  // Rotary Valve degree rotation (0° to 90°)
  const valveRotationDeg = Math.round((valveAperturePercent / 100) * 90);

  // Quick Scenarios
  const applyScenario = (scenario: 'idle' | 'standard' | 'deep') => {
    setActiveScenario(scenario);
    if (scenario === 'idle') {
      updateControl('serverLoad', 25);
      updateControl('coolantFlowRate', 30);
    } else if (scenario === 'standard') {
      updateControl('serverLoad', 60);
      updateControl('coolantFlowRate', 60);
    } else if (scenario === 'deep') {
      updateControl('serverLoad', 95);
      updateControl('coolantFlowRate', 90);
    }
  };

  // Execute Harvest Batch Action
  const handleHarvest = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#E4002B', '#FFFFFF', '#0A0A0A'],
      });
    } catch {
      // fallback
    }

    setHarvestEarningsINR((prev) => prev + 10250);
    setTankHarvestLevel(20); // resets to seed level (20%)
    setShowHarvestToast(true);
    setTimeout(() => setShowHarvestToast(false), 3500);
  };

  // Slowly increase harvest level over time
  useEffect(() => {
    const timer = setInterval(() => {
      setTankHarvestLevel((prev) => (prev < 98 ? Number((prev + 0.3).toFixed(1)) : 98));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recharts Energy Balance Data (Monochrome + Red)
  const energyBalanceData = [
    {
      name: 'Heat Recovery (kW)',
      heatCaptured: isCriticalThermalShock ? Math.round(serverThermalOutputKW * 0.35) : Math.round(serverThermalOutputKW * 0.82),
      chillerPowerSaved: isCriticalThermalShock ? 12 : Math.round(serverThermalOutputKW * 0.42),
    },
  ];

  // Recharts Custom Tooltip (Strict High-Contrast Black/White/Red)
  const CustomDarkTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0A0A] border-2 border-[#FFFFFF] p-2.5 rounded text-xs font-mono-code">
          <p className="text-white font-bold mb-1 border-b border-[#242424] pb-0.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-white">
              <span>{entry.name}:</span>
              <span className="font-bold text-[#E4002B]">
                {entry.value} {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER CONTROLS: AI AUTOPILOT & STAKEHOLDER LENS */}
      {/* ========================================================================= */}
      <div className="kfc-card rounded-xl p-4 sm:p-5 border-2 border-[#242424] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#242424] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#E4002B]">
                Industrial Schematic Control Deck
              </span>
              <span className="text-[10px] font-mono-code bg-[#1f1f1f] text-white px-2 py-0.5 rounded border border-[#333]">
                Site: {activeSite.city} ({activeSite.serverCapacityMW} MW)
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-display font-black text-white uppercase mt-0.5">
              AI Data-Center Thermal Twin Simulator
            </h1>
          </div>

          {/* AI Autopilot vs Manual Override Toggle & Link to Orchestrator */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/orchestrator"
              className="px-3.5 py-2.5 rounded-md text-xs font-display font-extrabold uppercase tracking-wider bg-[#10B981] hover:bg-[#059669] text-black flex items-center gap-1.5 transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch OpenCV Bio-Vision Cockpit</span>
            </Link>

            <button
              onClick={toggleAutoPilot}
              className={`px-4 py-2.5 rounded-md text-xs font-display font-black uppercase tracking-wider border-2 flex items-center gap-2 transition-all shadow-md ${
                isAutoPilot
                  ? 'bg-[#E4002B] text-white border-[#E4002B]'
                  : 'bg-[#121212] text-white border-white hover:border-[#E4002B]'
              }`}
            >
              {isAutoPilot ? (
                <>
                  <Zap className="w-4 h-4 text-white fill-white" />
                  <span>🤖 AI AUTONOMOUS OPTIMIZATION</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#E4002B]" />
                  <span>⚙️ MANUAL OVERRIDE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stakeholder Lens Switcher + Quick Scenarios */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          {/* Stakeholder Lens Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-display font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#E4002B]" />
              Stakeholder Lens:
            </span>
            <div className="flex rounded-md border-2 border-[#242424] bg-[#0A0A0A] p-0.5">
              <button
                onClick={() => setStakeholderLens('unified')}
                className={`px-3 py-1 rounded text-xs font-display font-extrabold uppercase transition-all ${
                  stakeholderLens === 'unified'
                    ? 'bg-white text-[#0A0A0A]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Unified Grid
              </button>
              <button
                onClick={() => setStakeholderLens('facility')}
                className={`px-3 py-1 rounded text-xs font-display font-extrabold uppercase transition-all ${
                  stakeholderLens === 'facility'
                    ? 'bg-[#E4002B] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Facility Engineer (DC)
              </button>
              <button
                onClick={() => setStakeholderLens('bio')}
                className={`px-3 py-1 rounded text-xs font-display font-extrabold uppercase transition-all ${
                  stakeholderLens === 'bio'
                    ? 'bg-[#E4002B] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bio-Operator (Algae)
              </button>
            </div>
          </div>

          {/* Quick Scenarios */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono-code text-slate-400 uppercase hidden xl:inline">
              Preset:
            </span>
            <button
              onClick={() => applyScenario('idle')}
              className={`px-3 py-1.5 rounded text-xs font-display font-extrabold uppercase tracking-wider border-2 transition-all ${
                activeScenario === 'idle'
                  ? 'bg-[#E4002B] text-white border-[#E4002B]'
                  : 'bg-[#121212] text-slate-300 border-[#242424] hover:border-white'
              }`}
            >
              ⚡ Idle: 25%
            </button>
            <button
              onClick={() => applyScenario('standard')}
              className={`px-3 py-1.5 rounded text-xs font-display font-extrabold uppercase tracking-wider border-2 transition-all ${
                activeScenario === 'standard'
                  ? 'bg-[#E4002B] text-white border-[#E4002B]'
                  : 'bg-[#121212] text-slate-300 border-[#242424] hover:border-white'
              }`}
            >
              🏢 Cloud: 60%
            </button>
            <button
              onClick={() => applyScenario('deep')}
              className={`px-3 py-1.5 rounded text-xs font-display font-extrabold uppercase tracking-wider border-2 transition-all ${
                activeScenario === 'deep'
                  ? 'bg-[#E4002B] text-white border-[#E4002B]'
                  : 'bg-[#121212] text-slate-300 border-[#242424] hover:border-white'
              }`}
            >
              🔥 Deep AI: 95%
            </button>
            <button
              onClick={resetToDefaults}
              className="p-1.5 rounded bg-[#121212] border-2 border-[#242424] text-slate-400 hover:text-white hover:border-white"
              title="Reset defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CRITICAL ALERT BANNER (Shown if Manual Mode + Overheat) */}
      {isCriticalThermalShock && (
        <div className="p-4 rounded-xl bg-[#1a0005] border-2 border-[#E4002B] anim-critical-alert flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-[#E4002B] shrink-0" />
            <div>
              <h4 className="text-sm font-display font-black text-white uppercase tracking-wider">
                CRITICAL: ALGAE THERMAL SHOCK RISK — Culture Mortality Threshold Exceeded (&gt;35°C)
              </h4>
              <p className="text-xs text-slate-300 font-mono-code">
                Manual override permitted excessive 54°C rack heat without proportional bypass diversion. Switch to AI Autopilot to stabilize at 28.2°C.
              </p>
            </div>
          </div>
          <button
            onClick={toggleAutoPilot}
            className="btn-red px-4 py-2 rounded text-xs font-display font-extrabold uppercase whitespace-nowrap shrink-0"
          >
            Engage AI Stabilization
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THE 3-STAGE INTERACTIVE MACHINE (Assembly Line Schematic) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#242424] pb-2">
          <h2 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>The 3-Stage Visual Assembly Line</span>
            {stakeholderLens === 'facility' && (
              <span className="text-[10px] font-mono-code bg-[#E4002B] text-white px-2 py-0.5 rounded">
                [Facility Engineer View Active: Highlighting Rack Exhaust & Chiller Offset]
              </span>
            )}
            {stakeholderLens === 'bio' && (
              <span className="text-[10px] font-mono-code bg-white text-[#0A0A0A] px-2 py-0.5 rounded">
                [Bio-Operator View Active: Highlighting Tank Temp & ₹ Harvest Readiness]
              </span>
            )}
          </h2>
          <span className="text-xs font-mono-code text-[#E4002B] font-bold">
            Left ➔ Right Continuous Conduit
          </span>
        </div>

        {/* 3 Horizontal Stages with Pipe Connectors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* ===================================================================== */}
          {/* STAGE 1: 1. AI RACKS RUN HOT (4 Columns) */}
          {/* ===================================================================== */}
          <div
            className={`lg:col-span-4 kfc-card rounded-xl p-5 border-2 flex flex-col justify-between space-y-4 transition-all ${
              stakeholderLens === 'facility'
                ? 'border-[#E4002B] shadow-[0_0_20px_rgba(228,0,43,0.3)]'
                : 'border-[#242424]'
            }`}
          >
            <div className="space-y-4">
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b-2 border-[#242424] pb-2">
                <span className="text-xs font-display font-extrabold text-[#E4002B] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#E4002B]" />
                  1. AI RACKS RUN HOT
                </span>
                <span className="text-[10px] font-mono-code bg-[#E4002B] text-white font-bold px-1.5 py-0.5 rounded">
                  Server Chassis
                </span>
              </div>

              {/* 3 Stacked 2U Server Rack Blades with Front Grilles & Shimmer */}
              <div className="relative p-3 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-2 overflow-hidden">
                {/* Heat Shimmer Waves */}
                <div className="absolute inset-x-0 top-0 h-6 pointer-events-none flex justify-around opacity-70">
                  <span className="w-12 h-2 bg-[#E4002B] blur-sm anim-heat-shimmer" />
                  <span className="w-12 h-2 bg-[#E4002B] blur-sm anim-heat-shimmer" style={{ animationDelay: '0.4s' }} />
                  <span className="w-12 h-2 bg-[#E4002B] blur-sm anim-heat-shimmer" style={{ animationDelay: '0.8s' }} />
                </div>

                {/* 3 Server Blades */}
                {[0, 1, 2].map((blade) => (
                  <div
                    key={blade}
                    className="p-2.5 rounded bg-[#141414] border border-[#2a2a2a] flex items-center justify-between gap-3 relative"
                  >
                    {/* Left: Blade Label & LEDs */}
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-mono-code text-slate-300 font-bold">
                        RACK-0{blade + 1} [2U]
                      </span>
                      {/* Blinking Status LEDs */}
                      <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
                      <span
                        className={`w-2 h-2 rounded-full ${
                          state.serverLoad > 80 ? 'bg-[#E4002B] animate-ping' : 'bg-[#444]'
                        }`}
                      />
                    </div>

                    {/* Center: Drive Bays / Ventilation Grilles */}
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3].map((b) => (
                        <span key={b} className="w-2 h-3.5 rounded-[1px] bg-[#222] border border-[#333]" />
                      ))}
                    </div>

                    {/* Right: Thermal read per blade */}
                    <span className="text-[10px] font-mono-code font-bold text-[#E4002B]">
                      {serverExhaustTemp - blade}°C
                    </span>
                  </div>
                ))}
              </div>

              {/* Dynamic Real-time Readouts */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono-code">
                <div className="p-2.5 rounded bg-[#0A0A0A] border-2 border-[#242424]">
                  <span className="text-[10px] text-slate-400 block font-display uppercase font-bold">
                    Exhaust Temp
                  </span>
                  <strong className="text-xl text-white font-black">{serverExhaustTemp}°C</strong>
                </div>

                <div className="p-2.5 rounded bg-[#0A0A0A] border-2 border-[#242424]">
                  <span className="text-[10px] text-slate-400 block font-display uppercase font-bold">
                    Thermal Output
                  </span>
                  <strong className="text-xl text-[#E4002B] font-black">{serverThermalOutputKW} kW</strong>
                </div>
              </div>

              {/* Compute Workload Slider: 20% to 100% */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs font-display font-bold">
                  <span className="text-white uppercase">Compute Workload:</span>
                  <span className="text-[#E4002B] font-mono-code font-bold">{state.serverLoad}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={1}
                  value={state.serverLoad}
                  onChange={(e) => updateControl('serverLoad', Number(e.target.value))}
                  className="w-full"
                  aria-label="Server Compute Workload Slider"
                />
                <div className="flex justify-between text-[10px] font-mono-code text-slate-400">
                  <span>20% (Idle Cloud)</span>
                  <span>100% (Dense LLM Cluster)</span>
                </div>
              </div>
            </div>

            {/* Connector 1: Primary Thermal Conduit (Server -> Smart Valve) */}
            <div className="p-2.5 rounded bg-[#0A0A0A] border-2 border-[#242424] space-y-1.5 font-mono-code text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Thermal Conduit 01:</span>
                <span className="text-[#E4002B] font-bold">{(state.serverLoad * 0.08).toFixed(1)} m/s (Flux)</span>
              </div>
              <div className="relative h-4 bg-[#141414] rounded-full overflow-hidden border border-[#333] flex items-center px-1">
                <svg className="w-full h-full" viewBox="0 0 200 16">
                  <path d="M 0 8 L 200 8" fill="none" stroke="#282828" strokeWidth="4" />
                  <circle r="3" fill="#E4002B">
                    <animateMotion path="M 0 8 L 200 8" dur={`${particleDurationSeconds}s`} repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion path="M 0 8 L 200 8" dur={`${particleDurationSeconds}s`} begin={`${particleDurationSeconds * 0.5}s`} repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* STAGE 2: 2. SMART AI VALVE (4 Columns) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-4 kfc-card rounded-xl p-5 border-2 border-[#FFFFFF] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b-2 border-[#242424] pb-2">
                <span className="text-xs font-display font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-white" />
                  2. SMART AI VALVE
                </span>
                <span className="text-[10px] font-mono-code bg-white text-[#0A0A0A] font-bold px-1.5 py-0.5 rounded">
                  Precision Diverter
                </span>
              </div>

              {/* Circular Rotary Actuator Valve Graphic */}
              <div className="p-3 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] flex flex-col items-center justify-center relative overflow-hidden py-4">
                {/* Radar Sensor Ring Pulse */}
                <div className="absolute w-28 h-28 rounded-full border border-[#E4002B] anim-radar-ring pointer-events-none" />

                {/* Rotary Valve Dial */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Outer Degree Scale: 0° to 90° */}
                  <svg className="w-full h-full transform -rotate-90 select-none" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#242424" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#E4002B"
                      strokeWidth="6"
                      strokeDasharray={`${(valveRotationDeg / 90) * 65} 200`}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Rotating Actuator Needle */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
                    style={{ transform: `rotate(${valveRotationDeg}deg)` }}
                  >
                    <div className="w-1.5 h-12 bg-white rounded-full -translate-y-3 shadow-md" />
                  </div>

                  {/* Center Valve Core */}
                  <div className="absolute w-9 h-9 rounded-full bg-[#121212] border-2 border-white flex items-center justify-center text-[10px] font-mono-code font-bold text-white">
                    {valveRotationDeg}°
                  </div>
                </div>

                <div className="text-[11px] font-mono-code font-bold text-slate-300 mt-2">
                  Rotary Actuator: {valveAperturePercent}% Open
                </div>
              </div>

              {/* Dynamic Readouts: Aperture, Sweet Spot, PID Latency */}
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono-code">
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#242424]">
                  <span className="text-[9px] text-slate-400 block font-display uppercase">Aperture</span>
                  <strong className="text-xs text-white font-bold">{valveAperturePercent}%</strong>
                </div>

                <div className="p-2 rounded bg-[#0A0A0A] border border-[#242424]">
                  <span className="text-[9px] text-slate-400 block font-display uppercase">Sweet Spot</span>
                  <strong className="text-xs text-[#E4002B] font-bold">28.0°C</strong>
                </div>

                <div className="p-2 rounded bg-[#0A0A0A] border border-[#242424]">
                  <span className="text-[9px] text-slate-400 block font-display uppercase">PID Latency</span>
                  <strong className="text-xs text-white font-bold">12ms</strong>
                </div>
              </div>

              {/* Real-time Decision Ticker */}
              <div className="p-3 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E4002B] animate-ping" />
                  <span className="text-[10px] font-mono-code font-bold text-[#E4002B] uppercase">
                    [AI AGENT T-0.2s]:
                  </span>
                </div>
                <p className="text-xs font-mono-code text-slate-300 leading-relaxed">
                  {isAutoPilot
                    ? `Predicted ${(state.serverLoad * 0.05).toFixed(1)}°C thermal surge from GPU Cluster. Adjusting valve actuator to ${valveAperturePercent}% flow. Tank stabilized at 28.2°C.`
                    : `Manual override active. Solenoid bypass locked at ${valveAperturePercent}%. AI safety interlocks disabled.`}
                </p>
              </div>
            </div>

            {/* Connector 2: Regulated Supply Conduit (Smart Valve -> Bio-Tanks) */}
            <div className="p-2.5 rounded bg-[#0A0A0A] border-2 border-[#242424] space-y-1.5 font-mono-code text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Regulated Conduit 02:</span>
                <span className="text-white font-bold">Calibrated 28.2°C Stream</span>
              </div>
              <div className="relative h-4 bg-[#141414] rounded-full overflow-hidden border border-[#333] flex items-center px-1">
                <svg className="w-full h-full" viewBox="0 0 200 16">
                  <path d="M 0 8 L 200 8" fill="none" stroke="#282828" strokeWidth="4" />
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion path="M 0 8 L 200 8" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill="#E4002B">
                    <animateMotion path="M 0 8 L 200 8" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* STAGE 3: 3. ALGAE BIO-TANKS (4 Columns) */}
          {/* ===================================================================== */}
          <div
            className={`lg:col-span-4 kfc-card rounded-xl p-5 border-2 flex flex-col justify-between space-y-4 transition-all ${
              isCriticalThermalShock
                ? 'border-[#E4002B] anim-critical-alert'
                : stakeholderLens === 'bio'
                ? 'border-[#E4002B] shadow-[0_0_20px_rgba(228,0,43,0.3)]'
                : 'border-[#242424]'
            }`}
          >
            <div className="space-y-4">
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b-2 border-[#242424] pb-2">
                <span className="text-xs font-display font-extrabold text-[#E4002B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-[#E4002B]" />
                  3. ALGAE BIO-TANKS
                </span>
                <span className="text-[10px] font-mono-code bg-[#E4002B] text-white font-bold px-1.5 py-0.5 rounded">
                  Microalgae Vessels
                </span>
              </div>

              {/* 3 Vertical Transparent Photobioreactor Tubes with Bubbles */}
              <div className="p-3 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] flex items-center justify-around relative overflow-hidden py-4">
                {[0, 1, 2].map((tube) => (
                  <div key={tube} className="flex flex-col items-center space-y-1">
                    {/* Glass Cylinder Column */}
                    <div className="w-12 h-28 rounded-full border-2 border-[#444] bg-[#101010] relative overflow-hidden flex items-end">
                      {/* Fluid Level Fill */}
                      <div
                        className={`w-full transition-all duration-500 relative ${
                          isCriticalThermalShock ? 'bg-[#990018]' : 'bg-[#E4002B]'
                        }`}
                        style={{ height: `${Math.min(95, tankHarvestLevel + tube * 2)}%` }}
                      >
                        {/* Glass Cylinder Reflection Highlight */}
                        <div className="absolute inset-y-0 left-1 w-1.5 bg-white opacity-25 rounded-full" />

                        {/* Rising Micro-Bubbles (Oxygenation & CO2 uptake) */}
                        <span
                          className="absolute w-2 h-2 rounded-full bg-white opacity-80 anim-bubble"
                          style={{ left: '30%', animationDelay: `${tube * 0.5}s` }}
                        />
                        <span
                          className="absolute w-1.5 h-1.5 rounded-full bg-pink-200 opacity-70 anim-bubble"
                          style={{ left: '60%', animationDelay: `${tube * 0.7 + 0.3}s` }}
                        />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono-code text-slate-400">PBR-0{tube + 1}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Readouts: Tank Temp, Photosynthetic Rate, Harvest Density */}
              <div className="p-3 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] text-center space-y-1">
                <span className="text-xs font-display font-bold text-slate-400 uppercase">
                  Tank Water Temp
                </span>
                <div className="text-3xl font-mono-code font-black text-white">
                  {effectiveTankTemp}°C
                </div>
                <div>
                  {isSafeGrowth ? (
                    <span className="px-2 py-0.5 rounded bg-white text-[#0A0A0A] font-display font-extrabold text-[10px] uppercase tracking-wider inline-block">
                      ✓ PERFECT GROWTH (24°C - 30°C)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#E4002B] text-white font-display font-extrabold text-[10px] uppercase tracking-wider inline-block animate-pulse">
                      THERMAL OVERHEAT - AI DIVERTING HEAT
                    </span>
                  )}
                </div>
              </div>

              {/* Speedometer & Harvest Density Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-display font-bold">
                  <span className="text-white uppercase">Photosynthetic Rate:</span>
                  <span className="text-[#E4002B] font-mono-code font-bold">{photosyntheticMultiplier}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono-code text-slate-400">
                    <span>Harvest Density:</span>
                    <span className="text-white font-bold">{Math.round(tankHarvestLevel)}%</span>
                  </div>
                  <div className="w-full bg-[#0A0A0A] h-3 rounded-full border-2 border-[#242424] overflow-hidden">
                    <div
                      className="h-full bg-[#E4002B] transition-all duration-300"
                      style={{ width: `${tankHarvestLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* One-Click Harvest Action Button */}
              <button
                onClick={handleHarvest}
                className="w-full btn-red py-3 rounded-md text-xs uppercase font-display font-black tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <span>🌾 Execute Harvest Batch (+₹10,250)</span>
              </button>
            </div>

            <div className="p-2.5 rounded bg-[#0A0A0A] border-2 border-[#242424] text-xs font-mono-code text-slate-400 flex justify-between">
              <span>Cumulative Batch Revenue:</span>
              <strong className="text-white">₹{harvestEarningsINR.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Harvest celebration toast */}
        {showHarvestToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#121212] border-2 border-[#E4002B] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-5 h-5 text-[#E4002B] shrink-0" />
            <div className="text-left font-display">
              <div className="text-xs font-bold text-white uppercase">
                Batch Harvested: +₹10,250 wholesale value generated
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Vessels re-inoculated with seed culture. Growth cycle renewed.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. SIMPLIFIED CHARTS SECTION (Recharts strictly monochrome + red) */}
      {/* ========================================================================= */}
      <div className="kfc-card rounded-xl p-6 border-2 border-[#242424] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#242424] pb-3">
          <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
            Verified Recharts Telemetry
          </h3>
          <span className="text-xs font-mono-code text-slate-400">Pure Monochrome & Red</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: 24-Hour Biomass Growth Curve (White Line with Red Dots) */}
          <div className="p-4 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-display font-bold text-white uppercase">
                Chart 1: 24-Hour Biomass Growth Curve
              </h4>
              <span className="text-xs font-mono-code text-[#E4002B] font-bold">
                {state.biomassAccumulatedTodayKg} kg Today
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history24h} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242424" />
                  <XAxis dataKey="time" stroke="#FFFFFF" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#FFFFFF" tick={{ fontSize: 9 }} />
                  <Tooltip content={<CustomDarkTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="biomass"
                    name="Biomass Mass (kg)"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    dot={{ fill: '#E4002B', r: 3 }}
                    activeDot={{ r: 5, fill: '#E4002B' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Energy Balance (Captured vs Chiller Power Saved) */}
          <div className="p-4 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-display font-bold text-white uppercase">
                Chart 2: Energy Balance (kW)
              </h4>
              <span className="text-xs font-mono-code text-white font-bold">
                {state.coolingEnergyOffsetPercent}% Chiller Power Cut
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyBalanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242424" />
                  <XAxis dataKey="name" stroke="#FFFFFF" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#FFFFFF" tick={{ fontSize: 9 }} />
                  <Tooltip content={<CustomDarkTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="heatCaptured" name="Captured by Algae (kW)" fill="#E4002B" />
                  <Bar dataKey="chillerPowerSaved" name="Chiller Electricity Saved (kW)" fill="#FFFFFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. AI ADVISOR LOG (Live Plain-English Feed) */}
      {/* ========================================================================= */}
      <div className="kfc-card rounded-xl p-6 border-2 border-[#242424] space-y-3">
        <div className="flex items-center justify-between border-b-2 border-[#242424] pb-2">
          <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E4002B]" />
            <span>AI Advisor Action Feed (Plain English)</span>
          </h3>
          <span className="text-[10px] font-mono-code text-slate-400">Live Timestamped</span>
        </div>

        <div className="space-y-2 font-mono-code text-xs">
          <div className="p-3 rounded bg-[#0A0A0A] border-2 border-[#242424] flex items-start gap-2">
            <span className="text-[#E4002B] font-bold">12:00:14</span>
            <span className="text-slate-300">
              Server compute load at <strong className="text-white">{state.serverLoad}%</strong>. AI valve actuator holding steady at {valveAperturePercent}%. Tank temperature pinned at {effectiveTankTemp}°C.
            </span>
          </div>

          <div className="p-3 rounded bg-[#0A0A0A] border-2 border-[#242424] flex items-start gap-2">
            <span className="text-white font-bold">11:58:32</span>
            <span className="text-slate-300">
              {isAutoPilot
                ? `AI Autopilot active: Continuous biological Monod kinetics optimizing cell division rate at ${photosyntheticMultiplier}.`
                : `Manual Override active: Operator responsible for thermal bypass management.`}
            </span>
          </div>

          <div className="p-3 rounded bg-[#0A0A0A] border-2 border-[#242424] flex items-start gap-2">
            <span className="text-[#E4002B] font-bold">11:55:08</span>
            <span className="text-slate-300">
              Closed-loop water recirculation running at <strong className="text-white">96%</strong>. Zero fresh municipal water consumed in cooling cycle.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
