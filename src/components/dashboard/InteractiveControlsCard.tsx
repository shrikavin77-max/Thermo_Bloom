import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  Sprout,
  Scale,
  Flame,
  Droplets,
  AlertOctagon,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { backendApi } from '../../services/backendApi';
import type { OptimizerTelemetry, ThermalTelemetry } from '../../services/backendApi';

interface InteractiveControlsCardProps {
  optimizer: OptimizerTelemetry;
  thermal: ThermalTelemetry;
}

export const InteractiveControlsCard: React.FC<InteractiveControlsCardProps> = ({
  optimizer,
  thermal,
}) => {
  const [activeMode, setActiveMode] = useState<
    'MAX_COMPUTE_COOLING' | 'BIO_HARVEST_MAXIMIZER' | 'ECO_BALANCED'
  >(optimizer.mode);

  // Sliders for injection
  const [gpuSurgeMagnitude, setGpuSurgeMagnitude] = useState<number>(35);
  const [biocideSpikePpm, setBiocideSpikePpm] = useState<number>(1.45);
  const [manualValve, setManualValve] = useState<number>(thermal.valve_position_pct);
  const [isManualValve, setIsManualValve] = useState<boolean>(false);
  const [injectionToast, setInjectionToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setInjectionToast(msg);
    setTimeout(() => setInjectionToast(null), 3000);
  };

  const handleModeSwitch = async (
    mode: 'MAX_COMPUTE_COOLING' | 'BIO_HARVEST_MAXIMIZER' | 'ECO_BALANCED'
  ) => {
    setActiveMode(mode);
    await backendApi.setMode(mode);
    showToast(`Optimization Policy switched to ${mode.replace(/_/g, ' ')}`);
  };

  const handleInjectGpuSurge = async () => {
    await backendApi.injectGpuSurge(gpuSurgeMagnitude, 20.0);
    showToast(`⚡ Injected +${gpuSurgeMagnitude}% LLM Batch Training Burst`);
  };

  const handleInjectWaterSpike = async () => {
    await backendApi.injectWaterContamination(biocideSpikePpm, 1420.0);
    showToast(`💧 Injected Biocide Spike: ${biocideSpikePpm.toFixed(2)} ppm`);
  };

  const handleVisionStress = async (stressType: string) => {
    await backendApi.injectVisionStress(stressType);
    showToast(`🔬 Injected Vision Culture State: ${stressType}`);
  };

  const handleValveToggle = async (manual: boolean) => {
    setIsManualValve(manual);
    await backendApi.setValveOverride(manualValve, manual);
    showToast(manual ? 'Manual Valve Override Engaged' : 'Predictive Feed-Forward AI Engaged');
  };

  const handleValveSliderChange = async (val: number) => {
    setManualValve(val);
    if (isManualValve) {
      await backendApi.setValveOverride(val, true);
    }
  };

  return (
    <div className="bg-[#0B0F17] border-2 border-[#1E293B] rounded-xl p-5 shadow-2xl space-y-5">
      {/* Toast Notification */}
      {injectionToast && (
        <div className="p-2.5 rounded-lg bg-[#10B981]/20 border border-[#10B981] text-[#10B981] text-xs font-mono-code flex items-center justify-between animate-fade-in">
          <span>{injectionToast}</span>
          <span className="text-[10px] uppercase font-bold text-slate-300">Active</span>
        </div>
      )}

      {/* ---------------- 1. Tri-Objective Mode Switcher ---------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#10B981]" />
            Tri-Objective Optimization Mode Switch
          </label>
          <span className="text-[10px] font-mono-code text-slate-400">
            Pareto Efficiency: <strong className="text-[#10B981]">{(optimizer.pareto_score * 100).toFixed(0)}%</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Mode 1: Max Compute Cooling */}
          <button
            onClick={() => handleModeSwitch('MAX_COMPUTE_COOLING')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              activeMode === 'MAX_COMPUTE_COOLING'
                ? 'bg-[#1E293B] border-[#F97316] text-white shadow-lg ring-1 ring-[#F97316]'
                : 'bg-[#111827] border-[#1F2937] text-slate-400 hover:text-white hover:border-[#374151]'
            }`}
          >
            <div className="flex items-center gap-2 font-display font-extrabold text-xs uppercase text-[#F97316]">
              <Zap className="w-3.5 h-3.5" />
              <span>Max Compute Cooling</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
              Prioritize zero GPU rack throttling. Aggressively rejects heat to cooling tower if needed.
            </p>
            <div className="text-[10px] font-mono-code text-[#F97316] mt-2 font-bold">
              Target PUE: ~1.15 | Zero Throttling
            </div>
          </button>

          {/* Mode 2: Bio-Harvest Maximizer */}
          <button
            onClick={() => handleModeSwitch('BIO_HARVEST_MAXIMIZER')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              activeMode === 'BIO_HARVEST_MAXIMIZER'
                ? 'bg-[#1E293B] border-[#10B981] text-white shadow-lg ring-1 ring-[#10B981]'
                : 'bg-[#111827] border-[#1F2937] text-slate-400 hover:text-white hover:border-[#374151]'
            }`}
          >
            <div className="flex items-center gap-2 font-display font-extrabold text-xs uppercase text-[#10B981]">
              <Sprout className="w-3.5 h-3.5" />
              <span>Bio-Harvest Maximizer</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
              Lock photobioreactor strictly to 24°C–26°C. Rejects borderline water to protect algae purity.
            </p>
            <div className="text-[10px] font-mono-code text-[#10B981] mt-2 font-bold">
              Yield: ~2.45 g/L/day | Pure Harvest
            </div>
          </button>

          {/* Mode 3: Eco-Balanced (Pareto Mode) */}
          <button
            onClick={() => handleModeSwitch('ECO_BALANCED')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              activeMode === 'ECO_BALANCED'
                ? 'bg-[#1E293B] border-[#38BDF8] text-white shadow-lg ring-1 ring-[#38BDF8]'
                : 'bg-[#111827] border-[#1F2937] text-slate-400 hover:text-white hover:border-[#374151]'
            }`}
          >
            <div className="flex items-center gap-2 font-display font-extrabold text-xs uppercase text-[#38BDF8]">
              <Scale className="w-3.5 h-3.5" />
              <span>Eco-Balanced (Pareto)</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
              Co-optimizes PUE reduction, &gt;88% blowdown recovery, and maximal net OPEX savings.
            </p>
            <div className="text-[10px] font-mono-code text-[#38BDF8] mt-2 font-bold">
              Net OPEX: +$1,071/day | Balanced
            </div>
          </button>
        </div>

        <div className="p-2.5 rounded bg-[#111827] border border-[#1F2937] text-[11px] font-mono-code text-slate-300 flex items-start gap-2">
          <span className="text-[#38BDF8] font-bold">Policy:</span>
          <span>{optimizer.mode_rationale}</span>
        </div>
      </div>

      {/* ---------------- 2. Interactive Injections & Telemetry Sliders ---------------- */}
      <div className="border-t border-[#1E293B] pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Box: GPU Telemetry Spike Injection */}
        <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F97316]" />
              Inject GPU Workload Surge
            </span>
            <span className="text-xs font-mono-code text-[#F97316] font-bold">
              +{gpuSurgeMagnitude}% Spike
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono-code text-slate-400">
              <span>Mild (+15%)</span>
              <span>Intense LLM Training (+50%)</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              step="5"
              value={gpuSurgeMagnitude}
              onChange={(e) => setGpuSurgeMagnitude(Number(e.target.value))}
              className="w-full accent-[#F97316]"
            />
          </div>

          <button
            onClick={handleInjectGpuSurge}
            className="w-full py-2 rounded font-display font-bold text-xs uppercase tracking-wider bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>Simulate LLM Batch Surge (20s)</span>
          </button>
          <p className="text-[10px] text-slate-400 font-mono-code">
            Watch the 45s thermal lag delay and feed-forward mixing valve pre-buffering response!
          </p>
        </div>

        {/* Right Box: Cooling Tower Water Contamination Injection */}
        <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase text-white flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#06B6D4]" />
              Inject Water Contamination Spike
            </span>
            <span className="text-xs font-mono-code text-[#06B6D4] font-bold">
              {biocideSpikePpm.toFixed(2)} ppm Biocide
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono-code text-slate-400">
              <span>Safe (&lt;0.10 ppm)</span>
              <span>Pre-Treat (0.1-2.0)</span>
              <span>Lethal (&gt;2.0)</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.5"
              step="0.05"
              value={biocideSpikePpm}
              onChange={(e) => setBiocideSpikePpm(Number(e.target.value))}
              className="w-full accent-[#06B6D4]"
            />
          </div>

          <button
            onClick={handleInjectWaterSpike}
            className="w-full py-2 rounded font-display font-bold text-xs uppercase tracking-wider bg-[#06B6D4] hover:bg-[#0891B2] text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Inject Tower Biocide Spike</span>
          </button>
          <p className="text-[10px] text-slate-400 font-mono-code">
            Triggers Water Screener decay retention timer (UV-C) & Safe Dilution Ratio (SDR)!
          </p>
        </div>
      </div>

      {/* ---------------- 3. Culture Stress Presets & Mixing Valve Authority ---------------- */}
      <div className="border-t border-[#1E293B] pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Culture Vision Diagnostic Presets */}
        <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937] space-y-2.5">
          <span className="text-xs font-display font-bold uppercase text-white flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#10B981]" />
            Bio-Vision Culture Stress Diagnostics
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-mono-code">
            <button
              onClick={() => handleVisionStress('OPTIMAL')}
              className="px-2 py-1.5 rounded bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 font-bold"
            >
              ✓ Optimal
            </button>
            <button
              onClick={() => handleVisionStress('CHLOROSIS')}
              className="px-2 py-1.5 rounded bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#F59E0B] border border-[#F59E0B]/40 font-bold"
            >
              ⚠ Chlorosis
            </button>
            <button
              onClick={() => handleVisionStress('BIOCIDE_TOXICITY')}
              className="px-2 py-1.5 rounded bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 font-bold"
            >
              ☠ Clumping
            </button>
            <button
              onClick={() => handleVisionStress('THERMAL_SHOCK')}
              className="px-2 py-1.5 rounded bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 font-bold"
            >
              🔥 Bleaching
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-mono-code">
            Injects real OpenCV color hue shifts, cell flocculation, and wall biofouling.
          </div>
        </div>

        {/* 3-Way Valve Control & Manual Override */}
        <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#A855F7]" />
              Proportional Valve Authority
            </span>
            <button
              onClick={() => handleValveToggle(!isManualValve)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono-code font-bold uppercase border transition-all ${
                isManualValve
                  ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]'
                  : 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]'
              }`}
            >
              {isManualValve ? '⚙ MANUAL OVERRIDE' : '🤖 PREDICTIVE AI FEED-FORWARD'}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono-code text-slate-400">
              <span>0% Full Bypass (Cooling Tower)</span>
              <span className="text-white font-bold">{manualValve.toFixed(0)}%</span>
              <span>100% Full Algae</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={manualValve}
              disabled={!isManualValve}
              onChange={(e) => handleValveSliderChange(Number(e.target.value))}
              className={`w-full ${isManualValve ? 'accent-[#A855F7]' : 'opacity-40 cursor-not-allowed'}`}
            />
          </div>

          <div className="text-[10px] text-slate-400 font-mono-code flex justify-between">
            <span>Biological safe target: 25.0°C</span>
            <span>Emergency cut-off: 28.5°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
