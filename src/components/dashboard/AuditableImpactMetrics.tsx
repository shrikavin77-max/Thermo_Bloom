import React from 'react';
import {
  TrendingDown,
  Droplets,
  Sprout,
  Zap,
  Award,
} from 'lucide-react';
import type { ImpactMetrics } from '../../services/backendApi';

interface AuditableImpactMetricsProps {
  metrics: ImpactMetrics;
}

export const AuditableImpactMetrics: React.FC<AuditableImpactMetricsProps> = ({ metrics }) => {
  return (
    <div className="bg-[#0B0F17] border-2 border-[#1E293B] rounded-xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8] flex items-center justify-center text-[#38BDF8]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>Auditable ESG, Carbon & ROI Impact Metrics</span>
              <span className="text-[10px] font-mono-code bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded font-bold border border-[#10B981]/40">
                Verified Formulae
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Rigorous thermodynamic accounting of energy avoided, water recycled, and biological co-products
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">Projected Net OPEX Saved:</span>
          <div className="text-base font-mono-code font-black text-[#10B981]">
            +${metrics.annual_opex_savings_usd.toLocaleString()} / year
          </div>
        </div>
      </div>

      {/* 4 Primary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Delta PUE Reduction */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#38BDF8] transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">PUE Efficiency</span>
            <TrendingDown className="w-4 h-4 text-[#38BDF8]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono-code font-extrabold text-[#38BDF8]">
              {metrics.current_optimized_pue.toFixed(3)}
            </span>
            <span className="text-xs font-mono-code font-bold text-[#10B981]">
              (-{metrics.delta_pue_reduction.toFixed(3)} ΔPUE)
            </span>
          </div>

          <div className="text-[11px] font-mono-code text-slate-400 border-t border-[#1F2937] pt-2 flex justify-between">
            <span>Baseline DC: 1.350</span>
            <span className="text-white font-bold">-{(metrics.delta_pue_reduction / 1.35 * 100).toFixed(1)}%</span>
          </div>
          <div className="text-[10px] text-slate-500">Direct server liquid waste heat offloading</div>
        </div>

        {/* Metric 2: Daily Cooling Water Saved */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#06B6D4] transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">Freshwater Recycled</span>
            <Droplets className="w-4 h-4 text-[#06B6D4]" />
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono-code font-extrabold text-[#06B6D4]">
              {metrics.daily_cooling_water_saved_liters.toLocaleString()}
            </span>
            <span className="text-xs font-mono-code text-slate-400">L / day</span>
          </div>

          <div className="text-[11px] font-mono-code text-slate-400 border-t border-[#1F2937] pt-2 flex justify-between">
            <span>Volume: {(metrics.daily_cooling_water_saved_liters / 1000).toFixed(1)} m³/day</span>
            <span className="text-[#10B981] font-bold">+${metrics.daily_water_savings_usd.toFixed(0)}/day</span>
          </div>
          <div className="text-[10px] text-slate-500">Cooling tower blowdown reuse via water screener</div>
        </div>

        {/* Metric 3: Biomass Produced & Bio-Product Revenue */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#10B981] transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">Bio-Product Value</span>
            <Sprout className="w-4 h-4 text-[#10B981]" />
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono-code font-extrabold text-[#10B981]">
              ${metrics.daily_biomass_market_value_usd.toFixed(0)}
            </span>
            <span className="text-xs font-mono-code text-slate-400">/ day</span>
          </div>

          <div className="text-[11px] font-mono-code text-slate-400 border-t border-[#1F2937] pt-2 flex justify-between">
            <span>Biomass: {metrics.daily_biomass_produced_kg.toFixed(1)} kg/day</span>
            <span className="text-white font-bold">@ $75/kg dry</span>
          </div>
          <div className="text-[10px] text-slate-500">Nutraceutical Astaxanthin & high-protein yield</div>
        </div>

        {/* Metric 4: Chiller Energy Avoided & CO2 Captured */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#A855F7] transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-display font-bold uppercase tracking-wider">Chiller Energy Cut</span>
            <Zap className="w-4 h-4 text-[#A855F7]" />
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono-code font-extrabold text-[#A855F7]">
              {metrics.daily_chiller_energy_avoided_kwh.toFixed(0)}
            </span>
            <span className="text-xs font-mono-code text-slate-400">kWh / day</span>
          </div>

          <div className="text-[11px] font-mono-code text-slate-400 border-t border-[#1F2937] pt-2 flex justify-between">
            <span>Power Cut: ${metrics.daily_electricity_savings_usd.toFixed(0)}/day</span>
            <span className="text-[#10B981] font-bold">{metrics.annual_co2_captured_metric_tons.toFixed(1)} t CO₂/yr</span>
          </div>
          <div className="text-[10px] text-slate-500">1.83 kg CO₂ sequestered per 1 kg microalgae</div>
        </div>
      </div>
    </div>
  );
};
