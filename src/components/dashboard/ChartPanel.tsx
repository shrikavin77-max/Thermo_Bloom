import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { useSimulation } from '../../context/SimulationContext';
import { PAST_7_DAYS_DATA } from '../../utils/simulation';
import { LineChart as LineChartIcon, AreaChart as AreaChartIcon, BarChart2, Activity, Gauge, TrendingUp } from 'lucide-react';

export const ChartPanel: React.FC = () => {
  const { history24h, state } = useSimulation();
  const [activeTab, setActiveTab] = useState<'all' | 'biomass' | 'thermal' | 'weekly'>('all');

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#090d1a] border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-mono">
          <p className="text-slate-300 font-bold mb-1.5 border-b border-slate-800 pb-1">{label}</p>
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

  // Radial chart data for culture health
  const healthRadialData = [
    {
      name: 'Health',
      value: state.cultureHealthScore,
      fill: state.cultureHealthScore > 80 ? '#10b981' : state.cultureHealthScore > 50 ? '#f59e0b' : '#f43f5e',
    },
  ];

  // Radial chart data for harvest readiness
  const harvestRadialData = [
    {
      name: 'Readiness',
      value: state.harvestReadinessPercent,
      fill: '#06b6d4',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Chart Navigation Tabs & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-['Space_Grotesk']">
            Telemetry & Telemetric Analytics
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Charts
          </button>
          <button
            onClick={() => setActiveTab('biomass')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
              activeTab === 'biomass'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>24h Biomass</span>
          </button>
          <button
            onClick={() => setActiveTab('thermal')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
              activeTab === 'thermal'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AreaChartIcon className="w-3.5 h-3.5" />
            <span>Thermal Flux</span>
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
              activeTab === 'weekly'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>7-Day Yield</span>
          </button>
        </div>
      </div>

      {/* Radial Health & Harvest Ring Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Culture Health Radial Gauge */}
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-slate-800">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Culture Health Score
            </span>
            <div className="text-3xl font-mono font-bold text-white">
              {state.cultureHealthScore}%
            </div>
            <p className="text-[11px] text-slate-400">
              {state.cultureHealthScore > 85
                ? 'Optimal photosynthetic kinetic velocity'
                : state.cultureHealthScore > 65
                ? 'Moderate metabolic stress detected'
                : 'Thermal/pH inhibition active'}
            </p>
          </div>
          <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={8}
                data={healthRadialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: '#1e293b' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <span className="absolute font-mono text-xs font-bold text-emerald-400">
              {state.cultureHealthScore}%
            </span>
          </div>
        </div>

        {/* Harvest Readiness Radial Gauge */}
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-slate-800">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Harvest Readiness
            </span>
            <div className="text-3xl font-mono font-bold text-white">
              {state.harvestReadinessPercent}%
            </div>
            <p className="text-[11px] text-slate-400">
              Density: <span className="text-cyan-400 font-mono">{state.currentBiomassGramsPerLiter} g/L</span> (Target: 2.4 g/L)
            </p>
          </div>
          <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={8}
                data={harvestRadialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: '#1e293b' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <span className="absolute font-mono text-xs font-bold text-cyan-400">
              {state.harvestReadinessPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Main Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: 24h Biomass Growth Curve (Line Chart) */}
        {(activeTab === 'all' || activeTab === 'biomass') && (
          <div className={`glass-panel rounded-2xl p-5 border border-slate-800 ${activeTab === 'biomass' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-['Space_Grotesk'] flex items-center gap-2">
                  <LineChartIcon className="w-4 h-4 text-emerald-400" />
                  Algae Biomass Growth (24 Hours)
                </h4>
                <p className="text-[11px] text-slate-400">Accumulated biomass (kg) & specific growth velocity</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {state.biomassAccumulatedTodayKg} kg today
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history24h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="biomass"
                    name="Biomass (kg)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#10b981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growthRate"
                    name="Growth Rate (g/L/d)"
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 2: Waste Heat Absorbed vs Rejected (Area Chart) */}
        {(activeTab === 'all' || activeTab === 'thermal') && (
          <div className={`glass-panel rounded-2xl p-5 border border-slate-800 ${activeTab === 'thermal' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-['Space_Grotesk'] flex items-center gap-2">
                  <AreaChartIcon className="w-4 h-4 text-amber-400" />
                  Heat Absorbed vs Heat Rejected (kW)
                </h4>
                <p className="text-[11px] text-slate-400">Bioreactor thermal capture vs cooling tower load</p>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {state.coolingEnergyOffsetPercent}% Offset
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history24h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAbsorbed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="heatAbsorbed"
                    name="Absorbed by Algae (kW)"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAbsorbed)"
                  />
                  <Area
                    type="monotone"
                    dataKey="heatRejected"
                    name="Rejected to Chiller (kW)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRejected)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 3: Daily Biomass Production (7 Days) (Bar Chart) */}
        {(activeTab === 'all' || activeTab === 'weekly') && (
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-['Space_Grotesk'] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  Daily Biomass Production (Last 7 Days)
                </h4>
                <p className="text-[11px] text-slate-400">Weekly yield trend & associated CO₂ sequestration (kg)</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-emerald-400">Avg: 18.6 kg/d</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400">Total: 129.8 kg</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PAST_7_DAYS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="biomassKg" name="Biomass Yield (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="co2Kg" name="CO₂ Sequestered (kg)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
