import React, { useState, useEffect } from 'react';
import { backendApi } from '../services/backendApi';
import type { UnifiedTelemetry } from '../services/backendApi';
import { LiveTelemetryStrip } from '../components/dashboard/LiveTelemetryStrip';
import { InteractiveControlsCard } from '../components/dashboard/InteractiveControlsCard';
import { VisionStreamCard } from '../components/dashboard/VisionStreamCard';
import { AuditableImpactMetrics } from '../components/dashboard/AuditableImpactMetrics';
import { WaterScreenerPanel } from '../components/dashboard/WaterScreenerPanel';
import { Terminal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrchestratorDashboardPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<UnifiedTelemetry | null>(null);
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = backendApi.subscribe((data, live) => {
      setTelemetry(data);
      setIsBackendLive(live);
    });
    return () => unsubscribe();
  }, []);

  if (!telemetry) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-white font-mono-code">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111827] border border-[#1F2937]">
          <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
          <span>Initializing THERMO-BLOOM AI Digital Twin Orchestrator...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white pb-24 pt-6 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto selection:bg-[#10B981] selection:text-black">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#0B0F17] to-[#0A101D] border-2 border-[#1E293B] shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Autonomous Digital Twin 2.0
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              Coimbatore Supercomputing Campus (15 MW)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
            <span>THERMO-BLOOM AI</span>
            <span className="text-[#10B981]">//</span>
            <span className="text-slate-300 text-xl sm:text-2xl font-light">Orchestration Cockpit</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
            Tri-objective digital twin coupling AI server cluster liquid heat rejection and cooling tower blowdown water with high-density microalgae cultivation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/digital-twin"
            className="px-4 py-2 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-white border border-[#374151] font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
          >
            <span>Schematic Twin View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-black font-display font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>FastAPI Docs (Swagger)</span>
          </a>
        </div>
      </div>

      {/* 1. Live Telemetry Strip */}
      <LiveTelemetryStrip
        thermal={telemetry.thermal}
        water={telemetry.water}
        isBackendLive={isBackendLive}
      />

      {/* 2. Interactive Controls & Optimization Mode Switch */}
      <InteractiveControlsCard
        optimizer={telemetry.optimizer}
        thermal={telemetry.thermal}
      />

      {/* 3. Bio-Vision & Stress Diagnostics OpenCV Stream */}
      <VisionStreamCard
        vision={telemetry.vision}
        isBackendLive={isBackendLive}
      />

      {/* 4. Cooling Tower Water Suitability & Toxicity Screener */}
      <WaterScreenerPanel
        water={telemetry.water}
      />

      {/* 5. Concrete Auditable Impact & ESG Metrics */}
      <AuditableImpactMetrics
        metrics={telemetry.optimizer.auditable_impact_metrics}
      />
    </div>
  );
};
