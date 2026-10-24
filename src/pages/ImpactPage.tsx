import React, { useState } from 'react';
import { Server, Printer, ArrowRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { Link } from 'react-router-dom';

export const ImpactPage: React.FC = () => {
  const { activeSite } = useSimulation();

  // Interactive Calculator: MW capacity (1 to 50 MW)
  const [capacityMW, setCapacityMW] = useState<number>(activeSite.serverCapacityMW);

  // Financial ROI calculations in Indian Rupees (₹)
  // Baseline: 10 MW produces ~₹2.78 Crore cooling savings & ~₹2.34 Crore biomass sales
  // Scaling linearly with capacityMW:
  const annualCoolingSavingsINR = Math.round((capacityMW / 10) * 27816000);
  const annualBiomassTons = Number(((capacityMW / 10) * 52.0).toFixed(1));
  const annualBiomassRevenueINR = Math.round(annualBiomassTons * 1000 * 450); // ₹450/kg
  const totalAnnualValueINR = annualCoolingSavingsINR + annualBiomassRevenueINR;

  // Format INR to Indian Currency notation (Lakhs / Crores)
  const formatIndianCurrency = (val: number): string => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crore`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const comparisonRows = [
    {
      metric: 'Heat Exhaust',
      traditional: '100% dumped into urban air via cooling towers & dry chillers',
      thermobloom: '100% captured for algae cultivation and biological kinetics',
    },
    {
      metric: 'Cooling Power Tariff',
      traditional: 'Full chiller power penalty (COP 3.8 at ₹8.50/kWh industrial tariff)',
      thermobloom: '₹2.78 Crore annual electricity savings (14% - 18% net cut)',
    },
    {
      metric: 'CO2 Mitigation',
      traditional: 'Pure atmospheric venting with zero circular capture',
      thermobloom: '480 kg/day absorbed by photosynthesis (~1.83 kg CO₂/kg biomass)',
    },
    {
      metric: 'Economic Output',
      traditional: 'Pure operational cost center (zero revenue produced)',
      thermobloom: '₹2.34 Crore annual commercial biomass (₹450/kg domestic wholesale)',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* HEADER */}
      <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#242424] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E4002B] text-white text-xs font-display font-bold uppercase tracking-wider mb-2">
            Techno-Economic Scorecard (Indian Rupee Model)
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            Financial & Climate ROI Model
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Side-by-side verification: How recovered data-center heat slashes Indian industrial power tariffs and yields high-value spirulina base.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn-outline-white px-5 py-3 rounded-md text-xs font-display font-extrabold uppercase tracking-wider flex items-center gap-2 self-start md:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Export Scorecard (PDF)</span>
        </button>
      </div>

      {/* 1. 3 HIGH-IMPACT CARDS (INR MODEL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Annual Cooling Power Saved */}
        <div className="kfc-card rounded-xl p-6 sm:p-7 border-2 border-[#242424] space-y-3">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">
            1. Annual Cooling Power Saved
          </span>
          <div className="text-3xl sm:text-4xl font-mono-code font-black text-white">
            ₹2,78,16,000
          </div>
          <div className="text-xs font-mono-code text-[#E4002B] font-bold">
            (₹2.78 Crore / yr)
          </div>
          <p className="text-xs text-slate-400 font-mono-code leading-relaxed pt-1 border-t border-[#242424]">
            Based on 14% chiller electricity reduction (COP 3.8 at ₹8.50/kWh industrial grid tariff across Indian DC hubs).
          </p>
        </div>

        {/* Card 2: Annual Biomass Sales Value (Red Accent Card) */}
        <div className="kfc-card rounded-xl p-6 sm:p-7 border-2 border-[#E4002B] space-y-3">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E4002B]">
            2. Annual Biomass Sales Value
          </span>
          <div className="text-3xl sm:text-4xl font-mono-code font-black text-[#E4002B]">
            ₹2,34,00,000
          </div>
          <div className="text-xs font-mono-code text-white font-bold">
            (₹2.34 Crore / yr)
          </div>
          <p className="text-xs text-slate-400 font-mono-code leading-relaxed pt-1 border-t border-[#242424]">
            Yields 52.0 dry tons/yr high-nitrogen bio-fertilizer & spirulina base sold at ₹450/kg domestic wholesale.
          </p>
        </div>

        {/* Card 3: Combined Annual Value Created */}
        <div className="kfc-card rounded-xl p-6 sm:p-7 border-2 border-[#FFFFFF] space-y-3">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-white">
            3. Combined Annual Value Created
          </span>
          <div className="text-3xl sm:text-4xl font-mono-code font-black text-white">
            ₹5,12,16,000
          </div>
          <div className="text-xs font-mono-code text-[#E4002B] font-bold">
            (₹5.12 Crore / yr)
          </div>
          <p className="text-xs text-slate-400 font-mono-code leading-relaxed pt-1 border-t border-[#242424]">
            Hardware CAPEX payback achieved in ~13.4 months with continuous data-center operation.
          </p>
        </div>
      </div>

      {/* 2. DIRECT HIGH-CONTRAST COMPARISON TABLE */}
      <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#242424] space-y-4">
        <div>
          <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E4002B]">
            Direct Benchmark Matrix
          </span>
          <h2 className="text-2xl font-display font-black text-white uppercase mt-0.5">
            Traditional Data Center vs. THERMO-BLOOM Integrated
          </h2>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs sm:text-sm font-sans">
            <thead>
              <tr className="border-b-2 border-[#242424] text-white uppercase font-display font-extrabold text-xs tracking-wider">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4 text-slate-400">Traditional Data Center</th>
                <th className="py-3 px-4 text-[#E4002B] bg-[#1a0005]">THERMO-BLOOM Integrated</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#242424]">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#161616] transition-colors">
                  <td className="py-4 px-4 font-display font-bold text-white uppercase text-xs sm:text-sm">
                    {row.metric}
                  </td>
                  <td className="py-4 px-4 text-slate-400 leading-relaxed font-mono-code text-xs">
                    {row.traditional}
                  </td>
                  <td className="py-4 px-4 text-white font-bold leading-relaxed bg-[#1a0005] font-mono-code text-xs">
                    {row.thermobloom}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. INTERACTIVE FINANCIAL ROI CALCULATOR (INR) */}
      <div className="kfc-card rounded-xl p-6 sm:p-8 border-2 border-[#E4002B] space-y-6">
        <div>
          <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E4002B]">
            Interactive Scenario Sizing (1 - 50 MW)
          </span>
          <h2 className="text-2xl font-display font-black text-white uppercase mt-0.5">
            Indian Data-Center Capacity Scaler
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Slide facility IT capacity to calculate estimated annual cooling electricity savings and dry spirulina harvest value in Indian Rupees (₹).
          </p>
        </div>

        {/* Input Capacity Slider */}
        <div className="p-5 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm font-display font-bold text-white uppercase flex items-center gap-2">
              <Server className="w-4 h-4 text-[#E4002B]" />
              Data Center Facility IT Scale:
            </span>
            <span className="text-lg font-mono-code font-bold text-white bg-[#161616] px-3 py-1 rounded border-2 border-[#242424]">
              {capacityMW} MW IT Load (~{Math.round(capacityMW * 40)} Racks)
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={50}
            step={0.5}
            value={capacityMW}
            onChange={(e) => setCapacityMW(Number(e.target.value))}
            className="w-full"
            aria-label="Data Center Capacity Scale Slider"
          />

          <div className="flex justify-between text-[10px] font-mono-code text-slate-400">
            <span>1 MW (Coimbatore Edge)</span>
            <span>10 MW (Mumbai Financial Core)</span>
            <span>50 MW (Hyperscale Mega-Campus)</span>
          </div>
        </div>

        {/* Financial Outputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Output 1: Annual Cooling Savings */}
          <div className="p-5 rounded-lg bg-[#0A0A0A] border-2 border-[#242424] space-y-2">
            <span className="text-xs font-display font-bold text-slate-400 uppercase">
              1. Estimated Cooling Power Cut
            </span>
            <div className="text-2xl sm:text-3xl font-mono-code font-black text-white">
              {formatIndianCurrency(annualCoolingSavingsINR)}
            </div>
            <p className="text-xs text-slate-400 font-mono-code leading-relaxed">
              Displaces ~{Math.round((capacityMW * 3270000))} kWh of chiller draw @ ₹8.50/kWh.
            </p>
          </div>

          {/* Output 2: Annual Biomass Sales */}
          <div className="p-5 rounded-lg bg-[#0A0A0A] border-2 border-[#E4002B] space-y-2">
            <span className="text-xs font-display font-bold text-[#E4002B] uppercase">
              2. Annual Biomass Sales Value
            </span>
            <div className="text-2xl sm:text-3xl font-mono-code font-black text-[#E4002B]">
              {formatIndianCurrency(annualBiomassRevenueINR)}
            </div>
            <p className="text-xs text-slate-400 font-mono-code leading-relaxed">
              Yields {annualBiomassTons} dry tons sold at ₹450/kg for bio-fertilizer and spirulina.
            </p>
          </div>

          {/* Output 3: Combined Economic Gain */}
          <div className="p-5 rounded-lg bg-[#0A0A0A] border-2 border-[#FFFFFF] space-y-2">
            <span className="text-xs font-display font-bold text-white uppercase">
              3. Combined Annual Value Created
            </span>
            <div className="text-2xl sm:text-3xl font-mono-code font-black text-white">
              {formatIndianCurrency(totalAnnualValueINR)}
            </div>
            <p className="text-xs text-slate-400 font-mono-code leading-relaxed">
              Capex payback achieved in ~13.4 months with continuous data-center operation.
            </p>
          </div>
        </div>
      </div>

      {/* CTA to Simulator */}
      <div className="text-center pt-2">
        <Link
          to="/digital-twin"
          className="btn-red px-8 py-4 rounded-md text-sm uppercase tracking-wider font-display font-extrabold inline-flex items-center gap-2"
        >
          <span>Test In Digital Twin Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
