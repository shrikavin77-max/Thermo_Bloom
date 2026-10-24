import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  icon: LucideIcon;
  onChange: (value: number) => void;
  optimalRange?: string;
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'teal';
  tooltip?: string;
}

export const ControlSlider: React.FC<ControlSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  icon: Icon,
  onChange,
  optimalRange,
  accentColor = 'cyan',
  tooltip,
}) => {

  const colorStyles = {
    cyan: {
      accent: 'accent-cyan-400',
      track: 'bg-cyan-500',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
      badge: 'text-cyan-300 bg-cyan-950/60 border-cyan-800/40',
    },
    emerald: {
      accent: 'accent-emerald-400',
      track: 'bg-emerald-500',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      badge: 'text-emerald-300 bg-emerald-950/60 border-emerald-800/40',
    },
    amber: {
      accent: 'accent-amber-400',
      track: 'bg-amber-500',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      badge: 'text-amber-300 bg-amber-950/60 border-amber-800/40',
    },
    rose: {
      accent: 'accent-rose-400',
      track: 'bg-rose-500',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/20',
      badge: 'text-rose-300 bg-rose-950/60 border-rose-800/40',
    },
    teal: {
      accent: 'accent-teal-400',
      track: 'bg-teal-500',
      text: 'text-teal-400',
      glow: 'shadow-teal-500/20',
      badge: 'text-teal-300 bg-teal-950/60 border-teal-800/40',
    },
  };

  const style = colorStyles[accentColor];

  return (
    <div className="glass-panel rounded-xl p-3.5 border border-slate-800/80 hover:border-slate-700/80 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-slate-900/80 ${style.text} border border-slate-800`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">
              {label}
            </span>
            {optimalRange && (
              <span className="block text-[10px] text-slate-500">
                Optimum: <span className="text-slate-400 font-mono">{optimalRange}</span>
              </span>
            )}
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs ${style.badge}`}>
          <span>{value}</span>
          <span className="text-[10px] text-slate-400 ml-1 font-normal">{unit}</span>
        </div>
      </div>

      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full h-1.5 bg-slate-800/90 rounded-lg appearance-none cursor-pointer ${style.accent}`}
          title={tooltip || label}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
