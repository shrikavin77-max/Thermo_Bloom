import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldAlert, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-[#242424] bg-[#0A0A0A] text-slate-400 text-xs">
      {/* Top Disclaimer Strip */}
      <div className="bg-[#121212] border-b-2 border-[#242424] py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-slate-300 text-xs leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-[#E4002B] shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="text-white font-bold">Climate-Tech Scope Disclosure:</strong> THERMO-BLOOM is engineered as an industrial waste-heat capture and microalgae photobioreactor digital twin. It does not claim 100% emission elimination; it transforms rejected 35°C–45°C thermal exhaust into verified biomass revenue and chiller power reductions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#E4002B] flex items-center justify-center text-white">
                <Flame className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-white font-display tracking-tight">
                THERMO-BLOOM
              </span>
              <span className="w-2 h-2 rounded-full bg-[#E4002B]" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Industrial Digital Twin channeling AI data center waste heat to accelerate urban microalgae super-crops.
            </p>
            <div className="font-mono-code text-[11px] text-[#E4002B] font-bold">
              KFC 3-Color High-Contrast Architecture
            </div>
          </div>

          {/* Col 2: Routes */}
          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider mb-3">
              Assembly Line Routes
            </h4>
            <ul className="space-y-2 font-display text-xs font-bold uppercase">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">Overview</Link>
              </li>
              <li>
                <Link to="/digital-twin" className="text-[#E4002B] hover:underline flex items-center gap-1">
                  <span>Digital Twin Simulator</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-slate-300 hover:text-white transition-colors">Financial & Climate Scorecard</Link>
              </li>
              <li>
                <Link to="/fleet" className="text-slate-300 hover:text-white transition-colors">Multi-Site Indian Fleet (6 Hubs)</Link>
              </li>
              <li>
                <Link to="/pitch" className="text-slate-300 hover:text-white transition-colors">60-Second Jury Briefing</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Indian Telemetry Corridors */}
          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider mb-3">
              Active Indian Hubs
            </h4>
            <ul className="space-y-1.5 font-mono-code text-xs text-slate-400">
              <li className="flex justify-between"><span>Coimbatore (Edge)</span> <span className="text-white font-bold">1.2 MW</span></li>
              <li className="flex justify-between"><span>Chennai (Coastal Hub)</span> <span className="text-white font-bold">8.5 MW</span></li>
              <li className="flex justify-between"><span>Bengaluru (AI Cluster)</span> <span className="text-white font-bold">5.0 MW</span></li>
              <li className="flex justify-between"><span>Hyderabad (Enterprise)</span> <span className="text-white font-bold">6.2 MW</span></li>
              <li className="flex justify-between"><span>Mumbai (Financial)</span> <span className="text-white font-bold">10.0 MW</span></li>
              <li className="flex justify-between"><span>Noida (Tech Campus)</span> <span className="text-white font-bold">4.5 MW</span></li>
            </ul>
          </div>

          {/* Col 4: Formula & KPIs */}
          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider mb-3">
              Core Principles
            </h4>
            <div className="space-y-2 font-mono-code text-[11px] text-slate-300">
              <div className="p-2 bg-[#121212] border-2 border-[#242424] rounded-md">
                Q = Load × 1.6 kW sensible heat
              </div>
              <div className="p-2 bg-[#121212] border-2 border-[#242424] rounded-md">
                Optimum biology: 24°C - 30°C sweet spot
              </div>
              <div className="p-2 bg-[#121212] border-2 border-[#E4002B] text-white font-bold rounded-md">
                14% - 18% AC electricity saved
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-[#242424] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 font-mono-code text-[11px]">
          <div>© {new Date().getFullYear()} THERMO-BLOOM. Deep-Tech Waste Heat to Biomass Digital Twin.</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E4002B]" />
            <span className="text-slate-400">KFC 3-Color Visual Hierarchy Enforced</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
