import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Sprout,
  Wind,
  ArrowRight,
  Sparkles,
  Zap,
  Droplets,
  ChevronRight,
} from 'lucide-react';
import { PipelineVisual } from '../components/common/PipelineVisual';
import { useSimulation } from '../context/SimulationContext';

export const LandingPage: React.FC = () => {
  const { activeSite } = useSimulation();

  const scrollToWalkthrough = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 lg:pt-16 overflow-hidden">
        {/* Subtle Ambient Depth Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF3B30]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-[#00F59B]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0F1117] border border-[#1F242F] text-xs text-[#00F59B] shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-ping" />
              <span className="font-bold tracking-wider uppercase font-display">
                Climate-Tech Deep Innovation
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">5-Second Zero-Complexity Twin</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.08] text-white">
              Turn AI Server Heat into{' '}
              <span className="bg-gradient-to-r from-[#00F59B] via-[#00D2FF] to-[#00F59B] bg-clip-text text-transparent">
                Green Gold.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-snug font-medium">
              An AI digital twin that channels hot exhaust from AI data centers into urban microalgae farms—slashing cooling costs and harvesting biomass.
            </p>

            {/* One-Click CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#00D2FF] text-[#08090C] font-extrabold text-sm uppercase tracking-wider hover:opacity-95 shadow-xl shadow-[#00F59B]/25 transition-all group hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Launch Live Digital Twin</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={scrollToWalkthrough}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#0F1117] text-white border border-[#1F242F] hover:border-slate-600 font-bold text-sm transition-all shadow-md"
              >
                <span>Jury 60-Second Walkthrough</span>
                <ChevronRight className="w-4 h-4 text-[#00D2FF]" />
              </button>
            </div>
          </div>

          {/* Centerpiece: The Animated Heat-to-Algae Pipeline Visual */}
          <div className="mt-12 max-w-5xl mx-auto">
            <PipelineVisual />
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME IMPACT TICKER (Big Numbers + Plain English Metaphors) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="crisp-panel rounded-3xl p-6 sm:p-8 border border-[#1F242F]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#1F242F]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00F59B] font-mono-data">
                Measured Real-Time Performance
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Real-Time Circular Impact Ticker
              </h3>
            </div>
            <span className="text-xs font-mono-data text-slate-400">
              Live Facility: <strong className="text-white">{activeSite.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {/* Ticker 1: Heat Diverted */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#08090C] border border-[#1F242F]">
              <div className="flex items-center justify-center gap-1.5 text-[#FF3B30] text-xs font-bold font-display uppercase tracking-wide">
                <Flame className="w-4 h-4" />
                <span>Heat Diverted</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-data text-white">
                1.2 <span className="text-base font-normal text-slate-400">MWh/day</span>
              </div>
              <span className="text-xs font-semibold text-[#FF6B00] block">
                Powers ~40 homes equivalent
              </span>
            </div>

            {/* Ticker 2: CO2 Trapped */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#08090C] border border-[#1F242F]">
              <div className="flex items-center justify-center gap-1.5 text-[#00D2FF] text-xs font-bold font-display uppercase tracking-wide">
                <Wind className="w-4 h-4" />
                <span>CO₂ Trapped</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-data text-white">
                480 <span className="text-base font-normal text-slate-400">kg/day</span>
              </div>
              <span className="text-xs font-semibold text-[#00D2FF] block">
                Equivalent to 24 mature trees
              </span>
            </div>

            {/* Ticker 3: Algae Biomass */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#08090C] border border-[#1F242F]">
              <div className="flex items-center justify-center gap-1.5 text-[#00F59B] text-xs font-bold font-display uppercase tracking-wide">
                <Sprout className="w-4 h-4" />
                <span>Algae Biomass</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-data text-white">
                18.6 <span className="text-base font-normal text-slate-400">kg/day</span>
              </div>
              <span className="text-xs font-semibold text-[#00F59B] block">
                Market value: $94/day cash yield
              </span>
            </div>

            {/* Ticker 4: Cooling Energy Saved */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#08090C] border border-[#1F242F]">
              <div className="flex items-center justify-center gap-1.5 text-[#00F59B] text-xs font-bold font-display uppercase tracking-wide">
                <Zap className="w-4 h-4" />
                <span>Cooling Energy Saved</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-data text-white">
                14% <span className="text-base font-normal text-slate-400">Offset</span>
              </div>
              <span className="text-xs font-semibold text-[#00D2FF] block">
                14% lower data-center AC bills
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS IN 3 SIMPLE STEPS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="crisp-panel rounded-3xl p-8 sm:p-12 border border-[#1F242F]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00F59B] font-mono-data">
              Jury 60-Second Walkthrough
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              How It Works in 3 Simple Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Zero jargon. Here is how chips crunching AI code turn into high-value urban bio-fertilizer:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#08090C] border border-[#1F242F] space-y-4 relative group hover:border-[#FF3B30]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#FF3B30]/15 border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30]">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black font-mono-data text-slate-700 group-hover:text-[#FF3B30] transition-colors">
                  01
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                AI Servers Get Hot
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                NVIDIA & AMD chips crunch LLM training prompts and blow out hot 40°C–45°C liquid coolant instead of usable energy.
              </p>
              <div className="pt-2 text-xs font-mono-data text-[#FF3B30] font-semibold">
                🔥 92% of electrical power becomes heat
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#08090C] border border-[#1F242F] space-y-4 relative group hover:border-[#00D2FF]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#00D2FF]/15 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF]">
                  <Droplets className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black font-mono-data text-slate-700 group-hover:text-[#00D2FF] transition-colors">
                  02
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                We Capture The Warmth
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Closed-loop heat exchanger tubes siphon the hot water before chillers waste expensive electricity running cooling tower fans.
              </p>
              <div className="pt-2 text-xs font-mono-data text-[#00D2FF] font-semibold">
                💧 92% closed-loop zero water evaporation
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#08090C] border border-[#1F242F] space-y-4 relative group hover:border-[#00F59B]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#00F59B]/15 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
                  <Sprout className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black font-mono-data text-slate-700 group-hover:text-[#00F59B] transition-colors">
                  03
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Algae Feasts & Grows
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                The captured heat keeps microalgae tanks at the perfect 28°C sweet spot, sucking in CO₂ and doubling cellular mass every 24 hours.
              </p>
              <div className="pt-2 text-xs font-mono-data text-[#00F59B] font-semibold">
                🌿 Traps 1.83 kg CO₂ per kg dry algae
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#0F1117] via-[#151822] to-[#0F1117] border border-[#1F242F] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Ready to see the live digital twin in action?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Switch server workloads, watch heat flows adjust instantly, and simulate automatic harvesting cycles.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#00D2FF] text-[#08090C] font-extrabold text-sm uppercase tracking-wider hover:opacity-95 shadow-xl shadow-[#00F59B]/20 flex items-center gap-2 shrink-0"
          >
            <span>Enter Twin Control Room</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
