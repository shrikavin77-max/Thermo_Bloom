import React from 'react';
import {
  Sprout,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Flame,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const hardwareRoadmap = [
    {
      phase: 'Phase 1: Validated Digital Twin',
      title: 'Mathematical Bio-Thermodynamic Model',
      description: 'Coupling server heat output (Q = Load × 1.8) with Monod photosynthetic kinetics, client-side simulation, and rule-based AI Copilot.',
      badge: 'Completed',
      statusColor: 'text-[#00F59B] border-[#00F59B]/30 bg-[#00F59B]/10',
    },
    {
      phase: 'Phase 2: Hardware Prototype',
      title: 'Microfluidic Tubular Photobioreactors',
      description: 'Borosilicate vertical glass column arrays, smart bypass valve microcontrollers, and precision liquid-liquid brazed plate heat exchangers.',
      badge: 'Bench Testing',
      statusColor: 'text-[#00D2FF] border-[#00D2FF]/30 bg-[#00D2FF]/10',
    },
    {
      phase: 'Phase 3: Edge IoT Sensor Mesh',
      title: 'Multi-Spectral & Dissolved Gas Telemetry',
      description: 'Industrial RS485 Modbus probes for dissolved O₂/CO₂, optical density (OD680) cell concentration meters, and peristaltic micro-dosing injectors.',
      badge: 'Hardware Build',
      statusColor: 'text-[#FF6B00] border-[#FF6B00]/30 bg-[#FF6B00]/10',
    },
    {
      phase: 'Phase 4: Hyperscale Integration',
      title: 'National Fleet DCIM Autonomous Control',
      description: 'Closed-loop telemetry directly linking data center BMS / DCIM protocols across 6 Indian hub corridors (Coimbatore, Chennai, Bengaluru, etc.).',
      badge: 'Upcoming',
      statusColor: 'text-slate-400 border-slate-700 bg-slate-800/40',
    },
  ];

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* 1. HERO PITCH HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/20 text-xs font-mono-data">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero-Carbon Bio-Cooling Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
          Pitch & Hardware Architecture
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          How THERMO-BLOOM turns 40% data-center cooling electricity waste into a high-margin microalgae bio-factory.
        </p>
      </div>

      {/* 2. THE PROBLEM VS THE SOLUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Problem */}
        <div className="crisp-panel rounded-3xl p-6 sm:p-8 border border-[#FF3B30]/40 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#FF3B30]/15 border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30]">
            <Flame className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF3B30] font-mono-data">
            The Industry Blindspot
          </span>
          <h2 className="text-2xl font-bold text-white font-display">
            40% of Data Center Power is Wasted Blowing Hot Air into the Sky
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            AI clusters consume hundreds of megawatts. Over 90% of this energy turns into low-grade heat (35°C–45°C). Today, cooling towers and electric chillers consume up to <strong>40% additional electricity</strong> purely to dump this heat into the atmosphere, evaporating billions of liters of clean water.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-[#1F242F]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
              <span>Low thermal grade (30-45°C) makes steam turbines or power generators impossible.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
              <span>Chiller compressors drive up PUE and carbon footprints significantly.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
              <span>Massive water evaporation in urban regions experiencing extreme water stress.</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="crisp-panel-emerald rounded-3xl p-6 sm:p-8 border border-[#00F59B]/40 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#00F59B]/15 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00F59B] font-mono-data">
            The THERMO-BLOOM Innovation
          </span>
          <h2 className="text-2xl font-bold text-white font-display">
            Zero-Carbon Bio-Cooling that Monetizes Waste Heat
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            THERMO-BLOOM feeds that 35°C–45°C warm liquid coolant directly into closed-loop microalgae photobioreactors. Microalgae (*Chlorella*, *Spirulina*) grows exponentially between <strong>25°C and 30°C</strong>. We maintain the sweet spot without electric heating, trapping CO₂ and producing valuable biomass.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-[#1F242F]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B]" />
              <span>Slashes AC chiller compressor power consumption by 14% to 22%.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B]" />
              <span>Produces high-value biomass ($45/kg wholesale for organic bio-fertilizer).</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B]" />
              <span>Zero potable water wasted with 92% closed-loop filtration recirculation.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. HARDWARE-READY ROADMAP */}
      <div className="crisp-panel rounded-3xl p-8 sm:p-10 border border-[#1F242F] space-y-8">
        <div className="flex items-center gap-3">
          <Wrench className="w-6 h-6 text-[#00D2FF]" />
          <div>
            <h2 className="text-2xl font-bold text-white font-display">
              Hardware-Ready Engineering Roadmap
            </h2>
            <p className="text-xs text-slate-400">
              From mathematical digital twin to physical rack-side deployment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hardwareRoadmap.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#08090C] border border-[#1F242F] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono-data font-bold px-2 py-0.5 rounded border ${item.statusColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono-data text-slate-500">0{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-display">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ETHICAL & SCIENTIFIC DISCLAIMER */}
      <div className="p-6 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/30 flex items-start gap-4 text-xs text-slate-300 leading-relaxed">
        <ShieldAlert className="w-6 h-6 text-[#FF3B30] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-[#FF3B30] font-display text-sm">
            Ethical Climate Positioning & Scope
          </h4>
          <p>
            THERMO-BLOOM does not claim to eliminate 100% of data-center carbon emissions. It is engineered specifically as a waste-heat recovery, chiller load displacement, and circular value creation system using validated biological kinetics and thermodynamic enthalpy equations.
          </p>
        </div>
      </div>

      {/* CTA TO DASHBOARD */}
      <div className="text-center pt-2">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#00D2FF] text-[#08090C] font-extrabold text-sm uppercase tracking-wider hover:opacity-95 shadow-xl shadow-[#00F59B]/25 transition-all"
        >
          <span>Test The Live Digital Twin Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
