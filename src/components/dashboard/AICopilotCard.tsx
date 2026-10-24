import React from 'react';
import { Sparkles, ArrowRight, ToggleLeft, ToggleRight, AlertTriangle, Lightbulb } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AICopilotCard: React.FC = () => {
  const { recommendations, applyRecommendation, state, toggleAutoPilot } = useSimulation();

  return (
    <div className="crisp-panel-emerald rounded-2xl p-5 border border-[#00F59B]/40 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#1F242F] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F59B] inline-block animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F59B] absolute inset-0" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
                AI Bioreactor Copilot
              </h3>
              <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30 font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous thermal balancing & growth optimization</p>
          </div>
        </div>

        {/* AutoPilot toggle */}
        <button
          onClick={toggleAutoPilot}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            state.isAutoPilot
              ? 'bg-[#00F59B]/20 text-[#00F59B] border-[#00F59B]/40 shadow-sm shadow-[#00F59B]/20'
              : 'bg-[#151822] text-slate-400 border-[#1F242F] hover:text-white'
          }`}
          title="AutoPilot automatically adjusts coolant valves and light intensity to keep the culture healthy"
        >
          {state.isAutoPilot ? (
            <>
              <ToggleRight className="w-5 h-5 text-[#00F59B]" />
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

      {/* Copilot Dynamic Live Insights */}
      <div className="space-y-2.5">
        {/* Dynamic status pill */}
        <div className="p-3 rounded-xl bg-[#151822] border border-[#1F242F] text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-bold font-display">
            <span className="flex items-center gap-1.5 text-[#00F59B]">
              <Sparkles className="w-3.5 h-3.5" />
              Copilot Live Insight:
            </span>
            <span className="text-[10px] font-mono-data text-slate-500">Real-time</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            {state.reactorWaterTemp > 35
              ? '⚠️ Thermal Surge Alert: Server load spiked temperatures to ' + state.reactorWaterTemp + '°C. Redirecting secondary coolant loop to prevent microalgae mortality.'
              : state.reactorWaterTemp >= 22 && state.reactorWaterTemp <= 32
              ? '✅ Optimal Balance: Current ' + state.reactorWaterTemp + '°C water temperature boosted photosynthetic kinetic efficiency by 18.4%.'
              : '💡 Sub-Optimal Warmth: Water temperature at ' + state.reactorWaterTemp + '°C. Increasing warm server exhaust flow will accelerate algal division.'}
          </p>
        </div>

        {/* AI Recommendations */}
        {recommendations.slice(0, 2).map((rec) => (
          <div
            key={rec.id}
            className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
              rec.severity === 'urgent'
                ? 'bg-[#FF3B30]/10 border-[#FF3B30]/40'
                : 'bg-[#08090C] border-[#1F242F]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold font-display text-white">
                {rec.severity === 'urgent' ? (
                  <AlertTriangle className="w-4 h-4 text-[#FF3B30] shrink-0" />
                ) : (
                  <Lightbulb className="w-4 h-4 text-[#00F59B] shrink-0" />
                )}
                <span>{rec.title}</span>
              </div>
              <span className="text-[10px] font-mono-data text-slate-500">{rec.timestamp}</span>
            </div>

            <p className="text-slate-300 leading-snug">{rec.description}</p>

            {rec.actionText && rec.actionPatch && (
              <button
                onClick={() => applyRecommendation(rec.actionPatch!)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#00F59B] text-[#08090C] font-bold text-xs hover:opacity-90 transition-opacity"
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
