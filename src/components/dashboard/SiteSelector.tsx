import React from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const SiteSelector: React.FC = () => {
  const { sites, activeSite, setActiveSiteById } = useSimulation();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative z-30">
      {/* Site Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 text-left transition-all shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                {activeSite.city}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                {activeSite.serverCapacityMW} MW
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-[260px]">
              {activeSite.name}
            </p>
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full sm:w-96 rounded-2xl bg-[#090d1a] border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between font-['Space_Grotesk']">
              <span>Select Indian Pilot Corridor</span>
              <span className="text-[10px] text-emerald-400 font-mono">6 Active Facilities</span>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1 py-1.5">
              {sites.map((site) => {
                const isSelected = site.id === activeSite.id;
                return (
                  <button
                    key={site.id}
                    onClick={() => {
                      setActiveSiteById(site.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                        : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{site.city}</span>
                        <span className="text-[10px] text-slate-400">({site.state})</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{site.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                        <span className="text-cyan-400">{site.facilityType}</span>
                        <span>•</span>
                        <span>{site.racksCount} Racks</span>
                        <span>•</span>
                        <span>{site.serverCapacityMW} MW</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {site.currentServerLoad}% Load
                      </span>
                      <span className="block text-[9px] text-emerald-400 font-mono mt-1">
                        ~{site.coolantInletTemp}°C Coolant
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
