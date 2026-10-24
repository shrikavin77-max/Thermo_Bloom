import React from 'react';
import { Bot, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AIAdvisor: React.FC = () => {
  const { recommendations, applyRecommendation, state, toggleAutoPilot } = useSimulation();

  return (
    <div className="glass-panel-glow rounded-2xl p-5 border border-cyan-500/30">
      {/* Header with AutoPilot switch */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-['Space_Grotesk']">
                AI Bioreactor Advisor
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Rule Kinetic Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Continuous closed-loop biological & thermodynamic optimization</p>
          </div>
        </div>

        {/* AutoPilot toggle */}
        <button
          onClick={toggleAutoPilot}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            state.isAutoPilot
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="AutoPilot autonomously tweaks coolant flow, lights, and nutrients to remain in peak bloom"
        >
          {state.isAutoPilot ? (
            <>
              <ToggleRight className="w-5 h-5 text-emerald-400" />
              <span>Auto-Pilot: ON</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 text-slate-500" />
              <span>Auto-Pilot: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* AutoPilot explanation badge if enabled */}
      {state.isAutoPilot && (
        <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300/90 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
          <span>
            <strong>Autonomous Regulation Active:</strong> The digital twin continuously auto-modulates coolant loops, CO₂ dosing, and photon flux to prevent heat-shock and maximize biomass.
          </span>
        </div>
      )}

      {/* Recommendations Feed */}
      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-medium text-slate-300">All Parameters in Optimal Equilibrium</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Photobioreactor temperature, photon flux, and carbonic buffer are balanced for peak exponential yield.
            </p>
          </div>
        ) : (
          recommendations.map((rec) => {
            const isUrgent = rec.severity === 'urgent';
            const isWarn = rec.severity === 'warning';

            return (
              <div
                key={rec.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUrgent
                    ? 'bg-rose-950/30 border-rose-500/40 shadow-rose-950/20'
                    : isWarn
                    ? 'bg-amber-950/30 border-amber-500/40 shadow-amber-950/20'
                    : 'bg-slate-900/60 border-cyan-500/30 shadow-cyan-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    {isUrgent ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                    <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">{rec.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{rec.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{rec.description}</p>

                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 mb-2.5 font-mono">
                  <span className="text-cyan-400 font-semibold block mb-0.5">Biokinetics Rationale:</span>
                  {rec.reasoning}
                </div>

                {rec.actionText && rec.actionPatch && (
                  <button
                    onClick={() => applyRecommendation(rec.actionPatch!)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-opacity shadow-md shadow-cyan-500/20"
                  >
                    <span>{rec.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
