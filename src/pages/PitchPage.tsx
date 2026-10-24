import React from 'react';
import { ArrowRight, ShieldAlert, Cpu, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PitchPage: React.FC = () => {
  return (
    <div className="space-y-14 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* 1. HEADER */}
      <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#242424] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E4002B] text-white text-xs font-display font-bold uppercase tracking-wider mb-2">
            60-Second Jury Briefing
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            Pitch Deck & Executive Brief
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Everything hackathon judges need to evaluate the technical, biological, and economic feasibility of THERMO-BLOOM.
          </p>
        </div>

        <Link
          to="/digital-twin"
          className="btn-red px-6 py-3 rounded-md text-xs font-display font-extrabold uppercase tracking-wider flex items-center gap-2 self-start md:self-auto"
        >
          <span>Launch Digital Twin</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 2. EXECUTIVE SUMMARY: THE 30-SECOND ELEVATOR PITCH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The 30-Second Summary Card */}
        <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#E4002B] space-y-4">
          <span className="text-xs font-display font-extrabold text-[#E4002B] uppercase tracking-wider">
            Executive Summary
          </span>
          <h2 className="text-2xl font-display font-black text-white uppercase leading-snug">
            The 30-Second Elevator Pitch
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            <p>
              <strong className="text-white">1. The Problem:</strong> AI data centers consume vast electrical energy, and up to <strong>40% of their power</strong> goes directly into cooling towers and fans that reject 35°C–45°C boiling water into the atmosphere.
            </p>
            <p>
              <strong className="text-white">2. The Tech Bridge:</strong> Microalgae grows twice as fast at 25°C–30°C. THERMO-BLOOM uses automated smart solenoid valves to divert this rejected server warmth directly into closed-loop photobioreactors without letting the culture overheat.
            </p>
            <p>
              <strong className="text-[#E4002B]">3. The Commercial Upside:</strong> Data centers cut <strong>14% to 18%</strong> off their chiller power bills, while harvesting thousands of kilograms of commercial bio-fertilizer and spirulina wholesale (₹450/kg).
            </p>
          </div>
        </div>

        {/* Why Microalgae? Card */}
        <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#FFFFFF] space-y-4">
          <span className="text-xs font-display font-extrabold text-white uppercase tracking-wider">
            Biological Super-Crop
          </span>
          <h2 className="text-2xl font-display font-black text-white uppercase leading-snug">
            Why Microalgae?
          </h2>
          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
            <div className="p-3 rounded bg-[#0A0A0A] border-2 border-[#242424] flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E4002B] shrink-0 mt-1.5" />
              <div>
                <strong className="text-white block font-display">Fastest Photosynthetic Multiplying Rate:</strong>
                Cells double in mass every 24 hours under steady 28°C warmth.
              </div>
            </div>

            <div className="p-3 rounded bg-[#0A0A0A] border-2 border-[#242424] flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-white shrink-0 mt-1.5" />
              <div>
                <strong className="text-white block font-display">Absorbs 2x More CO₂ Than Terrestrial Trees:</strong>
                1 kg of dry algae permanently fixes ~1.83 kg of gaseous carbon dioxide.
              </div>
            </div>

            <div className="p-3 rounded bg-[#0A0A0A] border-2 border-[#E4002B] flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E4002B] shrink-0 mt-1.5" />
              <div>
                <strong className="text-[#E4002B] block font-display">High Commercial Commodity Value:</strong>
                Commands ₹450/kg wholesale for organic agricultural bio-fertilizer, spirulina protein, and petro-chemical bioplastic replacement.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE DUAL-STAKEHOLDER MODEL (SOLVING "WHO USES THIS?") */}
      <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#242424] space-y-6">
        <div>
          <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E4002B]">
            User Persona & Commercial Fit
          </span>
          <h2 className="text-2xl font-display font-black text-white uppercase mt-0.5">
            The Dual-Stakeholder Model
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Built for seamless cross-disciplinary operations between enterprise IT and agricultural bio-refineries:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Persona 1: Data Center Facilities Team */}
          <div className="p-6 rounded-xl bg-[#0A0A0A] border-2 border-[#E4002B] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E4002B] flex items-center justify-center text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white uppercase text-base">
                  Data Center Facilities Team
                </h3>
                <span className="text-[11px] font-mono-code text-slate-400">IT Infrastructure & Cooling Operations</span>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-[#242424] font-mono-code leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#E4002B] font-bold">✓</span>
                <span><strong>Chiller Power Draw:</strong> Directly reduces mechanical compressor load by 14%–18%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E4002B] font-bold">✓</span>
                <span><strong>PUE Compression:</strong> Lowers facility Power Usage Effectiveness towards 1.15.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E4002B] font-bold">✓</span>
                <span><strong>Zero Water Waste:</strong> Eliminates millions of liters of evaporative cooling tower loss.</span>
              </li>
            </ul>
          </div>

          {/* Persona 2: Agritech / Bio-Grower */}
          <div className="p-6 rounded-xl bg-[#0A0A0A] border-2 border-[#FFFFFF] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0A0A0A]">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white uppercase text-base">
                  Agritech / Bio-Grower
                </h3>
                <span className="text-[11px] font-mono-code text-slate-400">Biomass Yield & Refinery Operators</span>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-[#242424] font-mono-code leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">✓</span>
                <span><strong>Zero-Cost Warmth:</strong> Receives free, steady 28°C biological heat without burning boilers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">✓</span>
                <span><strong>Turnkey Monitoring:</strong> Monitors optical density, pH, and harvest readiness with zero code.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">✓</span>
                <span><strong>Wholesale Revenue:</strong> Generates predictable domestic bio-fertilizer sales at ₹450/kg.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. SYSTEM ARCHITECTURE BLOCK DIAGRAM */}
      <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#242424] space-y-6">
        <div>
          <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E4002B]">
            System Architecture
          </span>
          <h2 className="text-2xl font-display font-black text-white uppercase mt-0.5">
            End-to-End Physical & Digital Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Server Exhaust ➔ Thermocouple Array ➔ AI Optimization Agent ➔ Solenoid Actuator ➔ Photobioreactor Tubes ➔ Filtered Harvest
          </p>
        </div>

        {/* 6-Step Block Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {/* Step 1 */}
          <div className="p-4 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-1.5 text-center">
            <span className="text-[10px] font-mono-code font-bold text-slate-400 uppercase block">Step 01</span>
            <h4 className="font-display font-bold text-white uppercase text-xs">Server Exhaust</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">
              Liquid manifolds capture 42°C sensible heat from GPU server blades.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-1.5 text-center">
            <span className="text-[10px] font-mono-code font-bold text-slate-400 uppercase block">Step 02</span>
            <h4 className="font-display font-bold text-white uppercase text-xs">Thermocouple Array</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">
              Calibrated PT100 sensors stream 12ms fluid temperature telemetry.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-lg bg-[#0A0A0A] border-2 border-[#E4002B] space-y-1.5 text-center">
            <span className="text-[10px] font-mono-code font-bold text-[#E4002B] uppercase block">Step 03</span>
            <h4 className="font-display font-bold text-white uppercase text-xs">AI Optimization</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">
              Monod kinetics compute required bypass fraction to prevent shock.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-lg bg-[#0A0A0A] border-2 border-white space-y-1.5 text-center">
            <span className="text-[10px] font-mono-code font-bold text-white uppercase block">Step 04</span>
            <h4 className="font-display font-bold text-white uppercase text-xs">Solenoid Actuator</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">
              Rotary proportional valve modulates 0°–90° flow to heat exchangers.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-1.5 text-center">
            <span className="text-[10px] font-mono-code font-bold text-slate-400 uppercase block">Step 05</span>
            <h4 className="font-display font-bold text-white uppercase text-xs">Photobioreactor Tubes</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">
              Closed vertical glass columns maintain optimal 28.2°C algae growth.
            </p>
          </div>

          {/* Step 6 */}
          <div className="p-4 rounded-lg bg-[#0A0A0A] border-2 border-[#E4002B] space-y-1.5 text-center">
            <span className="text-[10px] font-mono-code font-bold text-[#E4002B] uppercase block">Step 06</span>
            <h4 className="font-display font-bold text-white uppercase text-xs">Filtered Harvest</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">
              Centrifugal dewatering yields concentrated dry biomass for wholesale.
            </p>
          </div>
        </div>
      </div>

      {/* 5. HACKATHON SCOPE & DISCLAIMER */}
      <div className="p-6 rounded-xl bg-[#121212] border-2 border-[#E4002B] flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-[#E4002B] shrink-0 mt-0.5" />
        <div className="space-y-1 font-sans">
          <h4 className="font-display font-bold text-white uppercase text-sm">
            Hackathon Scope & Scientific Validation Disclaimer
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            THERMO-BLOOM is built as a functional digital twin prototype with validated thermodynamic enthalpy formulas and empirical Monod photosynthetic kinetics. It does not claim 100% data-center emissions elimination; it establishes a verified waste-heat recovery, chiller load displacement, and circular bio-product value creation system.
          </p>
        </div>
      </div>
    </div>
  );
};
