import React, { useState } from 'react';
import { Zap, Flame, Moon, Award, RotateCcw, Sprout, Check } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const JuryPresetBar: React.FC = () => {
  const { updateControl, resetToDefaults, triggerHarvest } = useSimulation();
  const [activePreset, setActivePreset] = useState<string>('baseline');

  const applyPreset = (preset: 'baseline' | 'training' | 'night') => {
    setActivePreset(preset);
    if (preset === 'baseline') {
      updateControl('serverLoad', 50);
      updateControl('coolantInletTemp', 32);
      updateControl('coolantFlowRate', 50);
      updateControl('lightIntensity', 520);
      updateControl('co2Level', 720);
      updateControl('nutrientLevel', 70);
      updateControl('waterRecirculationRate', 94);
    } else if (preset === 'training') {
      updateControl('serverLoad', 95);
      updateControl('coolantInletTemp', 43);
      updateControl('coolantFlowRate', 92);
      updateControl('lightIntensity', 650);
      updateControl('co2Level', 950);
      updateControl('nutrientLevel', 80);
      updateControl('waterRecirculationRate', 96);
    } else if (preset === 'night') {
      updateControl('serverLoad', 25);
      updateControl('coolantInletTemp', 26);
      updateControl('coolantFlowRate', 30);
      updateControl('lightIntensity', 80);
      updateControl('co2Level', 400);
      updateControl('nutrientLevel', 50);
      updateControl('waterRecirculationRate', 90);
    }
  };

  return (
    <div className="crisp-panel rounded-2xl p-4 border border-[#1F242F] bg-[#0F1117] relative overflow-hidden">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Jury Guidance Label */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00F59B]/15 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                Jury 1-Click Interactive Scenarios
              </span>
              <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-[#1F242F] text-slate-300">
                Live Dynamic Twins
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Test how the AI bioreactor responds to sudden data center computational fluctuations:
            </p>
          </div>
        </div>

        {/* Center: The 3 Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset 1 */}
          <button
            onClick={() => applyPreset('baseline')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePreset === 'baseline'
                ? 'bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/50 shadow-md shadow-[#00D2FF]/10'
                : 'bg-[#151822] text-slate-300 hover:text-white border border-[#1F242F] hover:border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>Preset 1: Normal LLM Inference (50% Load)</span>
            {activePreset === 'baseline' && <Check className="w-3.5 h-3.5 text-[#00D2FF]" />}
          </button>

          {/* Preset 2 */}
          <button
            onClick={() => applyPreset('training')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePreset === 'training'
                ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/50 shadow-md shadow-[#FF3B30]/10 animate-pulse'
                : 'bg-[#151822] text-slate-300 hover:text-white border border-[#1F242F] hover:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#FF3B30]" />
            <span>Preset 2: Massive Training Spike (95% Load)</span>
            {activePreset === 'training' && <Check className="w-3.5 h-3.5 text-[#FF3B30]" />}
          </button>

          {/* Preset 3 */}
          <button
            onClick={() => applyPreset('night')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePreset === 'night'
                ? 'bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/50 shadow-md shadow-[#00F59B]/10'
                : 'bg-[#151822] text-slate-300 hover:text-white border border-[#1F242F] hover:border-slate-700'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#00F59B]" />
            <span>Preset 3: Night Eco Mode (25% Load)</span>
            {activePreset === 'night' && <Check className="w-3.5 h-3.5 text-[#00F59B]" />}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setActivePreset('');
              resetToDefaults();
            }}
            className="p-2 rounded-xl bg-[#151822] border border-[#1F242F] hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
            title="Reset site to original baseline defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={triggerHarvest}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#00D2FF] text-[#08090C] font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#00F59B]/20 transition-all hover:scale-[1.02]"
          >
            <Sprout className="w-4 h-4" />
            <span>Harvest Biomass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
