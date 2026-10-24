import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Activity, Thermometer, ShieldCheck, IndianRupee } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { MOCK_SITES } from '../data/mockSites';

export const FleetPage: React.FC = () => {
  const { activeSite, setActiveSiteById } = useSimulation();
  const navigate = useNavigate();

  const handleInspectSite = (siteId: string) => {
    setActiveSiteById(siteId);
    navigate('/digital-twin');
  };

  // Indian Rupee daily value estimate based on MW capacity:
  // e.g., 1.2 MW = ₹18,400/day; 10 MW = ~₹1,40,000/day
  const calculateDailyValueINR = (mw: number): string => {
    const dailyTotal = Math.round(mw * 14000);
    return `+₹${dailyTotal.toLocaleString('en-IN')}/day`;
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* HEADER */}
      <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#242424] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E4002B] text-white text-xs font-display font-bold uppercase tracking-wider mb-2">
            Multi-Site Indian Data Centers
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            National Fleet Telemetry
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Live telemetry from 6 Tier-III/IV AI clusters connected to urban photobioreactor arrays across India.
          </p>
        </div>

        <div className="text-right font-mono-code text-xs text-slate-400">
          <div>Total Fleet Capacity: <strong className="text-white">35.4 MW</strong></div>
          <div className="text-[#E4002B] font-bold">Status: All 6 Hubs Operational</div>
        </div>
      </div>

      {/* 6 HIGH-CONTRAST DATACENTER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SITES.map((site) => {
          const isSelected = site.id === activeSite.id;
          const dailyINRValue = calculateDailyValueINR(site.serverCapacityMW);

          return (
            <div
              key={site.id}
              className={`kfc-card rounded-xl p-6 border-2 flex flex-col justify-between space-y-5 transition-all ${
                isSelected ? 'border-[#E4002B] bg-[#161616]' : 'border-[#242424] hover:border-white'
              }`}
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 border-b border-[#242424] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center font-bold ${
                      isSelected ? 'bg-[#E4002B] text-white' : 'bg-[#242424] text-white'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-white uppercase leading-tight">
                        {site.city}
                      </h3>
                      <span className="text-[11px] font-mono-code text-slate-400">
                        {site.name}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-[#242424] text-white border border-[#333333]">
                    {site.serverCapacityMW} MW
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#0A0A0A] border-2 border-[#242424] text-xs font-mono-code text-slate-400 flex justify-between">
                  <span>{site.facilityType}</span>
                  <span className="text-white font-bold">{site.racksCount} Racks</span>
                </div>

                {/* 4 Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono-code pt-1">
                  <div className="p-2.5 rounded bg-[#0A0A0A] border border-[#242424] space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1 font-display">
                      <Activity className="w-3 h-3 text-[#E4002B]" />
                      Server Load
                    </span>
                    <strong className="text-white text-base block">{site.currentServerLoad}%</strong>
                  </div>

                  <div className="p-2.5 rounded bg-[#0A0A0A] border border-[#242424] space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1 font-display">
                      <Thermometer className="w-3 h-3 text-[#E4002B]" />
                      Coolant Temp
                    </span>
                    <strong className="text-[#E4002B] text-base block">{site.coolantInletTemp}°C</strong>
                  </div>

                  <div className="p-2.5 rounded bg-[#0A0A0A] border border-[#242424] space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1 font-display">
                      <ShieldCheck className="w-3 h-3 text-white" />
                      Algae Health
                    </span>
                    <strong className="text-white text-base block">94%</strong>
                  </div>

                  <div className="p-2.5 rounded bg-[#0A0A0A] border border-[#242424] space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1 font-display">
                      <IndianRupee className="w-3 h-3 text-[#E4002B]" />
                      Daily ₹ Value
                    </span>
                    <strong className="text-white text-xs block font-bold text-[#E4002B]">{dailyINRValue}</strong>
                  </div>
                </div>
              </div>

              {/* Action Button: Inspect Telemetry */}
              <button
                onClick={() => handleInspectSite(site.id)}
                className={`w-full py-3 rounded-md text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all ${
                  isSelected
                    ? 'btn-red shadow-md'
                    : 'bg-[#121212] text-white border-[#242424] hover:border-white hover:bg-[#1f1f1f]'
                }`}
              >
                <span>{isSelected ? '✓ Loaded in Simulator' : 'Inspect Telemetry'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
