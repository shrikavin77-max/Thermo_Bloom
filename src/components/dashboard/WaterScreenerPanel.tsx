import React, { useState } from 'react';
import {
  Droplets,
  ShieldCheck,
  Clock,
  Beaker,
  RotateCcw,
} from 'lucide-react';
import type { WaterTelemetry } from '../../services/backendApi';
import { backendApi } from '../../services/backendApi';

interface WaterScreenerPanelProps {
  water: WaterTelemetry;
}

export const WaterScreenerPanel: React.FC<WaterScreenerPanelProps> = ({ water }) => {
  const [testPh, setTestPh] = useState<number>(water.ph);
  const [testTds, setTestTds] = useState<number>(water.tds_ppm);
  const [testOrp, setTestOrp] = useState<number>(water.orp_mv);
  const [testBiocide, setTestBiocide] = useState<number>(water.biocide_ppm);
  const [isScreening, setIsScreening] = useState<boolean>(false);
  const [customResult, setCustomResult] = useState<WaterTelemetry | null>(null);
  const [showTester, setShowTester] = useState<boolean>(false);

  const displayWater = customResult || water;

  const handleTestScreen = async () => {
    setIsScreening(true);
    const res = await backendApi.screenWaterSample({
      ph: testPh,
      tds_ppm: testTds,
      orp_mv: testOrp,
      biocide_ppm: testBiocide,
    });
    setCustomResult(res);
    setIsScreening(false);
  };

  const handleReset = () => {
    setCustomResult(null);
    setTestPh(7.4);
    setTestTds(680);
    setTestOrp(190);
    setTestBiocide(0.04);
  };

  const statusColor =
    displayWater.classification === 'SAFE_REUSE'
      ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]'
      : displayWater.classification === 'PRE_TREAT_REQUIRED'
      ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B]'
      : 'border-[#EF4444] bg-[#EF4444]/15 text-[#EF4444]';

  return (
    <div className="bg-[#0B0F17] border-2 border-[#1E293B] rounded-xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/20 border border-[#06B6D4] flex items-center justify-center text-[#06B6D4]">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-display font-black text-white uppercase tracking-wider">
                Cooling Tower Water Suitability & Toxicity Screener
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-black border uppercase tracking-wider ${statusColor}`}>
                {displayWater.classification.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Automated chemical decay kinetics, UV-C retention sizing, and Safe Dilution Ratio (SDR)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTester(!showTester)}
            className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-white border border-[#374151] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow"
          >
            <Beaker className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>{showTester ? 'Hide Chem Tester' : 'Custom Chem Screener'}</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-mono-code text-slate-400 uppercase">Freshwater Saved:</span>
            <div className="text-sm font-mono-code font-black text-[#06B6D4]">
              {displayWater.cumulative_freshwater_saved_liters.toLocaleString()} L
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Custom Chem Tester Collapsible */}
      {showTester && (
        <div className="p-4 rounded-xl bg-[#111827] border border-[#06B6D4]/40 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-display font-bold text-white uppercase">
            <span>Simulate Custom Chemical Water Inflow</span>
            <button
              onClick={handleReset}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono-code"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
            <div>
              <label className="text-slate-400 block mb-1">pH ({testPh.toFixed(1)})</label>
              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.1"
                value={testPh}
                onChange={(e) => setTestPh(Number(e.target.value))}
                className="w-full accent-[#06B6D4]"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">TDS ({testTds.toFixed(0)} ppm)</label>
              <input
                type="range"
                min="400"
                max="2600"
                step="50"
                value={testTds}
                onChange={(e) => setTestTds(Number(e.target.value))}
                className="w-full accent-[#06B6D4]"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">ORP ({testOrp.toFixed(0)} mV)</label>
              <input
                type="range"
                min="100"
                max="600"
                step="10"
                value={testOrp}
                onChange={(e) => setTestOrp(Number(e.target.value))}
                className="w-full accent-[#06B6D4]"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Biocide ({testBiocide.toFixed(2)} ppm)</label>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.05"
                value={testBiocide}
                onChange={(e) => setTestBiocide(Number(e.target.value))}
                className="w-full accent-[#06B6D4]"
              />
            </div>
          </div>

          <button
            onClick={handleTestScreen}
            disabled={isScreening}
            className="w-full py-2 rounded bg-[#06B6D4] hover:bg-[#0891B2] text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Beaker className="w-3.5 h-3.5" />
            <span>{isScreening ? 'Calculating Chemical Degradation Kinetics...' : 'Run Toxicity & Dilution Calculation'}</span>
          </button>
        </div>
      )}

      {/* Grid: 5 Chemical Parameters Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* pH */}
        <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">Acidity (pH)</span>
          <div className="text-xl font-mono-code font-extrabold text-white mt-0.5">
            {displayWater.ph.toFixed(2)}
          </div>
          <div className="text-[10px] font-mono-code text-[#10B981] mt-0.5">
            Safe: 6.6 - 8.4
          </div>
        </div>

        {/* TDS */}
        <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">Total Dissolved Solids</span>
          <div className="text-xl font-mono-code font-extrabold text-white mt-0.5">
            {displayWater.tds_ppm.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">ppm</span>
          </div>
          <div className="text-[10px] font-mono-code text-slate-400 mt-0.5">
            {displayWater.tds_ppm < 800 ? '✓ Low Salinity' : displayWater.tds_ppm > 2000 ? '☠ Hyper-Saline' : '⚠ Dilution Req.'}
          </div>
        </div>

        {/* ORP */}
        <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">Oxidation Potential (ORP)</span>
          <div className="text-xl font-mono-code font-extrabold text-white mt-0.5">
            {displayWater.orp_mv.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">mV</span>
          </div>
          <div className="text-[10px] font-mono-code text-slate-400 mt-0.5">
            {displayWater.orp_mv < 250 ? '✓ Low Oxidizers' : '⚠ Reducing Agent Req.'}
          </div>
        </div>

        {/* Turbidity */}
        <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">Turbidity</span>
          <div className="text-xl font-mono-code font-extrabold text-white mt-0.5">
            {displayWater.turbidity_ntu.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">NTU</span>
          </div>
          <div className="text-[10px] font-mono-code text-[#10B981] mt-0.5">
            &lt;12 NTU Optical Window
          </div>
        </div>

        {/* Biocide */}
        <div className={`p-3 rounded-lg border ${displayWater.biocide_ppm > 2.0 ? 'bg-[#EF4444]/15 border-[#EF4444]' : displayWater.biocide_ppm > 0.1 ? 'bg-[#F59E0B]/15 border-[#F59E0B]' : 'bg-[#111827] border-[#1F2937]'}`}>
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">Active Biocide</span>
          <div className="text-xl font-mono-code font-extrabold text-white mt-0.5">
            {displayWater.biocide_ppm.toFixed(3)}{' '}
            <span className="text-xs font-normal text-slate-400">ppm</span>
          </div>
          <div className="text-[10px] font-mono-code mt-0.5">
            {displayWater.biocide_ppm < 0.1 ? (
              <span className="text-[#10B981]">✓ Non-Toxic Safe</span>
            ) : displayWater.biocide_ppm > 2.0 ? (
              <span className="text-[#EF4444] font-bold">☠ Lethal Toxicity</span>
            ) : (
              <span className="text-[#F59E0B] font-bold">⚠ UV-C Decay Req.</span>
            )}
          </div>
        </div>
      </div>

      {/* Treatment Steps & Kinetic Modeling Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-display font-bold uppercase text-white">
            <ShieldCheck className="w-4 h-4 text-[#06B6D4]" />
            <span>Prescribed Chemical Pre-Treatment Protocol</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono-code">
            {displayWater.treatment_steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-[#06B6D4] font-bold">[{idx + 1}]</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1F2937] flex justify-between text-[11px] font-mono-code">
            <span className="text-slate-400">Water Recovery Efficiency:</span>
            <span className="text-[#10B981] font-bold">{displayWater.recovery_efficiency_pct}%</span>
          </div>
        </div>

        {/* UV Decay Kinetics & SDR Calculator */}
        <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-display font-bold uppercase text-white">
            <Clock className="w-4 h-4 text-[#A855F7]" />
            <span>Degradation Kinetics & Dilution Modeling</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
            <div className="p-2 rounded bg-[#0A0A0A] border border-[#242424]">
              <span className="text-[10px] text-slate-400 uppercase">UV-C Retention</span>
              <div className="text-base font-extrabold text-[#A855F7]">
                {displayWater.retention_time_minutes > 0
                  ? `${displayWater.retention_time_minutes.toFixed(1)} mins`
                  : '0 mins (Direct)'}
              </div>
              <span className="text-[9px] text-slate-500">First-order k=0.038 min⁻¹</span>
            </div>

            <div className="p-2 rounded bg-[#0A0A0A] border border-[#242424]">
              <span className="text-[10px] text-slate-400 uppercase">Safe Dilution Ratio</span>
              <div className="text-base font-extrabold text-[#38BDF8]">
                {displayWater.safe_dilution_ratio > 0
                  ? `${displayWater.safe_dilution_ratio.toFixed(2)} : 1`
                  : '0.00 : 1 (Pure)'}
              </div>
              <span className="text-[9px] text-slate-500">RO/rainwater makeup blend</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-mono-code">
            C(t) = C₀·e^(-kt) determines exact residence time in the photolysis tank before biological injection.
          </p>
        </div>
      </div>
    </div>
  );
};
