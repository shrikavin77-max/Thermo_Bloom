import React from 'react';
import { X, Sprout, Wind, Flame } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const HarvestModal: React.FC = () => {
  const { lastHarvested, clearLastHarvestedModal } = useSimulation();

  if (!lastHarvested) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel-emerald rounded-3xl max-w-md w-full p-6 border border-emerald-500/50 shadow-2xl relative overflow-hidden">
        {/* Glow behind modal */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={clearLastHarvestedModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 animate-bounce">
            <Sprout className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
            Biomass Harvest Batch Certified
          </span>
          <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mt-0.5">
            Microalgae Extraction Complete!
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Automated centrifuging & dewatering cycle successfully executed at {lastHarvested.siteName}.
          </p>
        </div>

        {/* Certificate Card */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-emerald-500/30 space-y-3 mb-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-400 font-mono">Batch ID: {lastHarvested.id}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
              Grade {lastHarvested.qualityGrade}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <Sprout className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold font-mono text-emerald-400">{lastHarvested.biomassKg}</div>
              <span className="text-[10px] text-slate-400">kg Biomass</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <Wind className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-lg font-bold font-mono text-cyan-400">{lastHarvested.co2SequesteredKg}</div>
              <span className="text-[10px] text-slate-400">kg CO₂ Fixed</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-lg font-bold font-mono text-amber-400">{lastHarvested.heatRecoveredKWh}</div>
              <span className="text-[10px] text-slate-400">kWh Heat</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800/80">
            <span>Species Strain:</span>
            <span className="text-slate-200 font-mono font-medium">{lastHarvested.species}</span>
          </div>
        </div>

        <button
          onClick={clearLastHarvestedModal}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all"
        >
          Confirm & Return to Digital Twin
        </button>
      </div>
    </div>
  );
};
