import React from 'react';
import { Cpu, Thermometer, Droplets, Gauge, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import type { ThermalTelemetry, WaterTelemetry } from '../../services/backendApi';

interface LiveTelemetryStripProps {
  thermal: ThermalTelemetry;
  water: WaterTelemetry;
  isBackendLive: boolean;
}

export const LiveTelemetryStrip: React.FC<LiveTelemetryStripProps> = ({
  thermal,
  water,
  isBackendLive,
}) => {
  // Bioreactor status styling
  const isBioOverheating = thermal.bioreactor_temp_c > 28.0;
  const isBioCritical = thermal.bioreactor_temp_c > 32.0 || thermal.emergency_dump_active;
  const isBioOptimal = thermal.bioreactor_temp_c >= 22.0 && thermal.bioreactor_temp_c <= 28.0;

  // Water classification styling
  const waterBadgeColor =
    water.classification === 'SAFE_REUSE'
      ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40'
      : water.classification === 'PRE_TREAT_REQUIRED'
      ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40'
      : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40';

  return (
    <div className="bg-[#0B0F17] border-2 border-[#1E293B] rounded-xl p-3.5 shadow-2xl space-y-3">
      {/* Top micro-bar: Sync status & Site telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2 text-[11px] font-mono-code">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase tracking-wider font-bold">Data Center Digital Twin:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              isBackendLive
                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40'
                : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isBackendLive ? 'bg-[#10B981] animate-ping' : 'bg-[#F59E0B]'
              }`}
            />
            {isBackendLive ? 'FastAPI Telemetry (2 Hz Synchronized)' : 'Client Digital Twin Emulation'}
          </span>
          {thermal.burst_active && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F97316]/20 text-[#F97316] font-bold border border-[#F97316]/40 animate-pulse text-[10px]">
              <Sparkles className="w-3 h-3" />
              LLM BATCH SURGE (+{thermal.burst_magnitude}%)
            </span>
          )}
          {thermal.emergency_dump_active && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EF4444]/25 text-[#EF4444] font-black border border-[#EF4444] animate-bounce text-[10px]">
              <ShieldAlert className="w-3 h-3" />
              EMERGENCY BYPASS ACTIVE (0% VALVE)
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div>
            Heat Gen: <span className="text-white font-bold">{thermal.total_heat_generated_kw} kW</span>
          </div>
          <div>
            To Algae: <span className="text-[#10B981] font-bold">{thermal.heat_absorbed_by_algae_kw} kW</span>
          </div>
          <div>
            To Tower: <span className="text-[#F97316] font-bold">{thermal.heat_rejected_to_tower_kw} kW</span>
          </div>
        </div>
      </div>

      {/* 5 High-Impact Live Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: GPU Server Load */}
        <div className="bg-[#111827] border border-[#1F2937] hover:border-[#374151] rounded-lg p-3 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">GPU Rack Load</span>
            <Cpu className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono-code font-extrabold text-white">
              {thermal.server_load_pct.toFixed(1)}
            </span>
            <span className="text-xs font-mono-code text-slate-400">%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#1F2937] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                thermal.server_load_pct > 80
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EF4444]'
                  : 'bg-gradient-to-r from-[#38BDF8] to-[#10B981]'
              }`}
              style={{ width: `${Math.min(100, thermal.server_load_pct)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono-code">
            <span>Idle 20%</span>
            <span>Target {thermal.target_server_load_pct.toFixed(0)}%</span>
          </div>
        </div>

        {/* Metric 2: Server Coolant Outlet Temp */}
        <div className="bg-[#111827] border border-[#1F2937] hover:border-[#374151] rounded-lg p-3 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">Coolant Return</span>
            <Thermometer className="w-4 h-4 text-[#F97316]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-mono-code font-extrabold ${
                thermal.coolant_outlet_temp_c > 48 ? 'text-[#EF4444]' : 'text-[#F97316]'
              }`}
            >
              {thermal.coolant_outlet_temp_c.toFixed(1)}
            </span>
            <span className="text-xs font-mono-code text-slate-400">°C</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono-code flex items-center justify-between">
            <span>Inlet: {thermal.coolant_inlet_temp_c}°C</span>
            <span className="text-[#F97316] font-bold">Lag: ~45s</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 truncate">
            Physical inertia: Q = ṁ·Cp·ΔT
          </div>
        </div>

        {/* Metric 3: Photobioreactor Culture Temp */}
        <div
          className={`border rounded-lg p-3 transition-all ${
            isBioCritical
              ? 'bg-[#EF4444]/10 border-[#EF4444]'
              : isBioOverheating
              ? 'bg-[#F59E0B]/10 border-[#F59E0B]'
              : 'bg-[#111827] border-[#1F2937]'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">Bioreactor Temp</span>
            <Activity className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-mono-code font-extrabold ${
                isBioCritical
                  ? 'text-[#EF4444] animate-pulse'
                  : isBioOverheating
                  ? 'text-[#F59E0B]'
                  : 'text-[#10B981]'
              }`}
            >
              {thermal.bioreactor_temp_c.toFixed(1)}
            </span>
            <span className="text-xs font-mono-code text-slate-400">°C</span>
          </div>
          <div className="text-[10px] mt-1 font-mono-code flex items-center justify-between">
            <span
              className={
                isBioOptimal
                  ? 'text-[#10B981] font-bold'
                  : isBioCritical
                  ? 'text-[#EF4444] font-black'
                  : 'text-[#F59E0B]'
              }
            >
              {isBioCritical
                ? 'OVERHEAT DANGER'
                : isBioOptimal
                ? 'OPTIMAL WINDOW'
                : 'THERMAL STRESS'}
            </span>
            <span className="text-slate-500">22-28°C</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Lethal ceiling: &gt;34.0°C</div>
        </div>

        {/* Metric 4: 3-Way Mixing Valve Position */}
        <div className="bg-[#111827] border border-[#1F2937] hover:border-[#374151] rounded-lg p-3 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">3-Way Valve</span>
            <Gauge className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono-code font-extrabold text-white">
              {thermal.valve_position_pct.toFixed(0)}
            </span>
            <span className="text-xs font-mono-code text-slate-400">%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#1F2937] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] via-[#A855F7] to-[#F97316] rounded-full transition-all duration-300"
              style={{ width: `${thermal.valve_position_pct}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono-code flex justify-between">
            <span>0% Bypass</span>
            <span className="text-[#10B981] font-bold">100% Algae</span>
          </div>
        </div>

        {/* Metric 5: Cooling Tower Water Suitability */}
        <div className="bg-[#111827] border border-[#1F2937] hover:border-[#374151] rounded-lg p-3 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">Water Suitability</span>
            <Droplets className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="mt-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-mono-code font-extrabold border uppercase tracking-wider ${waterBadgeColor}`}
            >
              {water.classification.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono-code flex justify-between">
            <span>Biocide: {water.biocide_ppm.toFixed(2)} ppm</span>
            <span>TDS: {water.tds_ppm.toFixed(0)}</span>
          </div>
          <div className="text-[10px] text-[#06B6D4] mt-0.5 font-mono-code">
            Recovery: {water.recovery_efficiency_pct}%
          </div>
        </div>
      </div>
    </div>
  );
};

