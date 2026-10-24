import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeVariant?: 'ember' | 'emerald' | 'cyan' | 'slate';
  subtext?: string;
  progressPercent?: number;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  badgeText,
  badgeVariant = 'emerald',
  subtext,
  progressPercent,
  className = '',
}) => {
  const badgeStyles = {
    ember: 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/40',
    emerald: 'bg-[#00F59B]/15 text-[#00F59B] border-[#00F59B]/40',
    cyan: 'bg-[#00D2FF]/15 text-[#00D2FF] border-[#00D2FF]/40',
    slate: 'bg-[#151822] text-slate-300 border-[#1F242F]',
  };

  const iconStyles = {
    ember: 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20',
    emerald: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/20',
    cyan: 'text-[#00D2FF] bg-[#00D2FF]/10 border-[#00D2FF]/20',
    slate: 'text-slate-300 bg-[#151822] border-[#1F242F]',
  };

  return (
    <div
      className={`crisp-panel rounded-2xl p-4 sm:p-5 border border-[#1F242F] hover:border-slate-700 transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 font-display">
            {label}
          </span>
          <div className={`p-2 rounded-xl border ${iconStyles[badgeVariant]}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono-data tracking-tight text-white">
            {value}
          </span>
          {unit && <span className="text-xs font-bold text-slate-400">{unit}</span>}
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-[#1F242F]/60">
        {badgeText && (
          <span
            className={`inline-block text-[10px] font-mono-data font-bold px-2 py-0.5 rounded-full border ${badgeStyles[badgeVariant]}`}
          >
            {badgeText}
          </span>
        )}

        {typeof progressPercent === 'number' && (
          <div className="w-full bg-[#151822] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                badgeVariant === 'ember'
                  ? 'bg-[#FF3B30]'
                  : badgeVariant === 'cyan'
                  ? 'bg-[#00D2FF]'
                  : 'bg-[#00F59B]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        )}

        {subtext && <p className="text-[10.5px] text-slate-400 leading-tight">{subtext}</p>}
      </div>
    </div>
  );
};
