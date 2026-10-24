import React from 'react';
import {
  Thermometer,
  TrendingUp,
  Activity,
  Gauge,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { MetricCard } from '../components/common/MetricCard';
import { PipelineVisual } from '../components/common/PipelineVisual';
import { JuryPresetBar } from '../components/dashboard/JuryPresetBar';
import { SimulationControls } from '../components/dashboard/SimulationControls';
import { ChartsGrid } from '../components/dashboard/ChartsGrid';
import { AICopilotCard } from '../components/dashboard/AICopilotCard';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { SiteSelector } from '../components/dashboard/SiteSelector';
import { HarvestModal } from '../components/dashboard/HarvestModal';

export const DashboardPage: React.FC = () => {
  const { state, activeSite } = useSimulation();

  // Status computation for plain English badges
  const isOverheating = state.reactorWaterTemp > 35;
  const isOptimal = state.reactorWaterTemp >= 22 && state.reactorWaterTemp <= 32;

  const tempBadgeText = isOverheating
    ? `TOO HOT (${state.reactorWaterTemp}°C) - Algae Stress! Heat Diverted`
    : isOptimal
    ? `PERFECT (${state.reactorWaterTemp}°C) - Algae Doubling`
    : `MILD (${state.reactorWaterTemp}°C) - Sub-Optimal Warmth`;

  const tempBadgeVariant: 'ember' | 'emerald' | 'cyan' = isOverheating
    ? 'ember'
    : isOptimal
    ? 'emerald'
    : 'cyan';

  // Hours left to harvest estimate
  const hoursLeft = Math.max(1, Math.round(((100 - state.harvestReadinessPercent) / 100) * 16));

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <HarvestModal />

      {/* TOP HEADER BAR: Site Fleet Selector & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl crisp-panel border border-[#1F242F]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <SiteSelector />
          <div className="hidden sm:block h-8 w-[1px] bg-[#1F242F]" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-data text-slate-400 uppercase">DCIM Telemetry:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F59B]/15 text-[#00F59B] font-mono-data text-xs border border-[#00F59B]/30 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-ping" />
              1 Hz Synchronized
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-data">
          <span className="text-slate-400">PUE Offset:</span>
          <span className="text-[#00D2FF] font-bold">-{ (state.coolingEnergyOffsetPercent * 0.005).toFixed(3) } PUE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Total Loop Volume:</span>
          <span className="text-white font-bold">{ (activeSite.reactorVolumeLiters / 1000).toFixed(0) } m³</span>
        </div>
      </div>

      {/* 1. JURY DEMO BAR (Top of Dashboard - 3 Instant Scenarios) */}
      <JuryPresetBar />

      {/* 2. THE 5-SECOND PIPELINE VISUAL */}
      <PipelineVisual />

      {/* 3. LIVE SYSTEM VITALS (Plain English Badges & Big Numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vital 1: Algae Tank Temperature */}
        <MetricCard
          label="Algae Tank Temperature"
          value={state.reactorWaterTemp}
          unit="°C"
          icon={Thermometer}
          badgeText={tempBadgeText}
          badgeVariant={tempBadgeVariant}
          subtext="Target biological window: 22°C - 32°C"
        />

        {/* Vital 2: Culture Health Score */}
        <MetricCard
          label="Culture Health Score"
          value={state.cultureHealthScore}
          unit="%"
          icon={Activity}
          badgeText={state.cultureHealthScore > 85 ? 'EXCELLENT / OPTIMAL' : state.cultureHealthScore > 65 ? 'GOOD / STABLE' : 'STRESSED / MITIGATING'}
          badgeVariant={state.cultureHealthScore > 75 ? 'emerald' : 'ember'}
          progressPercent={state.cultureHealthScore}
          subtext="Photosynthetic enzyme & pH vitality index"
        />

        {/* Vital 3: Growth Velocity */}
        <MetricCard
          label="Growth Velocity"
          value={state.algaeGrowthRate}
          unit="g/L/day"
          icon={TrendingUp}
          badgeText={`+${Math.round(state.algaeGrowthRate * 12)} g/hr current yield`}
          badgeVariant="emerald"
          subtext="Speed at which microalgae multiplies mass"
        />

        {/* Vital 4: Harvest Readiness */}
        <MetricCard
          label="Harvest Readiness"
          value={state.harvestReadinessPercent}
          unit="%"
          icon={Gauge}
          badgeText={`${state.harvestReadinessPercent}% Ready — Harvest in ~${hoursLeft} hours`}
          badgeVariant="cyan"
          progressPercent={state.harvestReadinessPercent}
          subtext={`Density: ${state.currentBiomassGramsPerLiter} g/L (Target: 2.4 g/L)`}
        />
      </div>

      {/* 4. MAIN WORKSPACE: Simplified Controls + AI Copilot + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Controls) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <SimulationControls />
        </div>

        {/* Right Column (AI Copilot & Alerts) - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <AICopilotCard />
          <AlertPanel />
        </div>
      </div>

      {/* 5. LIVE DATA VISUALIZATIONS (Recharts 3-Chart Grid) */}
      <div className="pt-2">
        <ChartsGrid />
      </div>
    </div>
  );
};
