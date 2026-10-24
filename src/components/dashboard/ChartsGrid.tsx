import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useSimulation } from '../../context/SimulationContext';
import { PAST_7_DAYS_DATA } from '../../utils/simulation';
import { TrendingUp, Flame, BarChart2, Activity } from 'lucide-react';

export const ChartsGrid: React.FC = () => {
  const { history24h, state } = useSimulation();

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#08090C] border border-[#1F242F] p-3 rounded-xl shadow-2xl text-xs font-mono-data">
          <p className="text-white font-bold mb-1.5 border-b border-[#1F242F] pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white">
                {entry.value} {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Thermal comparison data for the bar chart
  const thermalBalanceData = [
    {
      name: 'Current Thermal Load',
      heatAbsorbedKW: state.heatAbsorbedKW,
      heatDumpedKW: state.heatRejectedKW,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#1F242F] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00F59B]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            Live Kinetic Telemetry & Biological Yield Analytics
          </h3>
        </div>
        <span className="text-[11px] font-mono-data text-slate-400">
          3 Real-Time Visualizations
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: 24-Hour Biomass Growth Curve (Smooth Area Chart) */}
        <div className="crisp-panel rounded-2xl p-5 border border-[#1F242F] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#00F59B]" />
                24-Hour Biomass Growth Curve
              </h4>
              <p className="text-[11px] text-slate-400">Smooth kinetic mass accumulation over time</p>
            </div>
            <span className="text-[11px] font-mono-data text-[#00F59B] font-bold bg-[#00F59B]/10 px-2 py-0.5 rounded border border-[#00F59B]/20">
              {state.biomassAccumulatedTodayKg} kg Today
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history24h} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="biomassAreaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F59B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F59B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F242F" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="biomass"
                  name="Biomass (kg)"
                  stroke="#00F59B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#biomassAreaGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Thermal Balance (Heat Captured vs Dumped to Atmosphere) */}
        <div className="crisp-panel rounded-2xl p-5 border border-[#1F242F] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FF3B30]" />
                Thermal Balance (kW)
              </h4>
              <p className="text-[11px] text-slate-400">Heat captured by algae vs dumped to sky</p>
            </div>
            <span className="text-[11px] font-mono-data text-[#00D2FF] font-bold bg-[#00D2FF]/10 px-2 py-0.5 rounded border border-[#00D2FF]/20">
              {state.coolingEnergyOffsetPercent}% Saved
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={thermalBalanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F242F" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="heatAbsorbedKW" name="Captured by Algae (kW)" fill="#00F59B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="heatDumpedKW" name="Dumped to Sky (kW)" fill="#FF3B30" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: 7-Day Harvest History */}
        <div className="crisp-panel rounded-2xl p-5 border border-[#1F242F] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#00D2FF]" />
                7-Day Harvest History
              </h4>
              <p className="text-[11px] text-slate-400">Weekly harvested yield & CO₂ fixed</p>
            </div>
            <span className="text-[11px] font-mono-data text-white font-bold bg-[#151822] px-2 py-0.5 rounded border border-[#1F242F]">
              Avg: 18.6 kg/d
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PAST_7_DAYS_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F242F" />
                <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="biomassKg" name="Harvested Algae (kg)" fill="#00F59B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="co2Kg" name="CO₂ Trapped (kg)" fill="#00D2FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
