import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AlertPanel: React.FC = () => {
  const { alerts, dismissAlert } = useSimulation();
  const activeAlerts = alerts.filter((a) => !a.dismissed);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-['Space_Grotesk']">
            Safety Telemetry & Diagnostics
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              activeAlerts.some((a) => a.severity === 'critical')
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                : activeAlerts.length > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {activeAlerts.length} Active {activeAlerts.length === 1 ? 'Notice' : 'Notices'}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {activeAlerts.length === 0 ? (
          <div className="py-6 text-center text-slate-500">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 opacity-60" />
            <p className="text-xs text-slate-400">All Bioreactor Loop Parameters Nominal</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Zero Critical Faults Reported</p>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isCritical
                    ? 'bg-rose-950/25 border-rose-500/40 text-rose-200'
                    : isWarning
                    ? 'bg-amber-950/25 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {isCritical ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-['Space_Grotesk'] text-white">
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-400 border border-white/5">
                        {alert.metric}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{alert.message}</p>
                    <span className="text-[9px] font-mono text-slate-500 block pt-0.5">{alert.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
                  title="Acknowledge alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
