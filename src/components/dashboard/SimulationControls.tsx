import React, { useState } from 'react';
import { Server, Sun, Sliders, ChevronDown, ChevronUp, Droplets, Wind, Sprout, Flame } from 'lucide-react';
import { ControlSlider } from '../common/ControlSlider';
import { useSimulation } from '../../context/SimulationContext';

export const SimulationControls: React.FC = () => {
  const { state, updateControl } = useSimulation();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="crisp-panel rounded-2xl p-5 border border-[#1F242F] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1F242F] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#00F59B]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            Interactive Control Deck
          </h3>
        </div>
        <span className="text-[11px] font-mono-data text-slate-400">
          3 Essential + 4 Advanced Sliders
        </span>
      </div>

      {/* ESSENTIAL CONTROLS (Always Visible) */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono-data block">
          Primary Operational Controls
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. Server Compute Load */}
          <ControlSlider
            label="Server Compute Load"
            value={state.serverLoad}
            min={20}
            max={100}
            unit="%"
            icon={Server}
            accentColor="amber"
            optimalRange="50 - 85%"
            onChange={(val) => updateControl('serverLoad', val)}
            tooltip="GPU rack compute intensity dictating waste heat discharge"
          />

          {/* 2. Cooling Heat Transfer Rate */}
          <ControlSlider
            label="Cooling Heat Transfer"
            value={state.coolantFlowRate}
            min={10}
            max={100}
            unit="L/min"
            icon={Droplets}
            accentColor="cyan"
            optimalRange="45 - 75 L/min"
            onChange={(val) => updateControl('coolantFlowRate', val)}
            tooltip="Volume of liquid coolant channeled across the plate heat exchanger"
          />

          {/* 3. Light & Sunlight Level */}
          <ControlSlider
            label="Light & Sunlight Level"
            value={state.lightIntensity}
            min={0}
            max={800}
            step={10}
            unit="µmol/m²/s"
            icon={Sun}
            accentColor="emerald"
            optimalRange="450 - 650"
            onChange={(val) => updateControl('lightIntensity', val)}
            tooltip="Photon flux delivered to photobioreactor tubes for photosynthesis"
          />
        </div>
      </div>

      {/* EXPANDABLE ACCORDION: ADVANCED ENGINEERING */}
      <div className="pt-2 border-t border-[#1F242F]">
        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#151822] hover:bg-[#1C212E] border border-[#1F242F] text-xs font-semibold text-slate-300 hover:text-white transition-all"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
            <span>Advanced Engineering & Micro-Dosing (4 Parameters)</span>
          </span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] font-mono-data">{advancedOpen ? 'Collapse' : 'Expand'}</span>
            {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {advancedOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Advanced 1: Coolant Inlet Temp */}
            <ControlSlider
              label="Coolant Inlet Temp"
              value={state.coolantInletTemp}
              min={25}
              max={45}
              unit="°C"
              icon={Flame}
              accentColor="rose"
              optimalRange="30 - 38°C"
              onChange={(val) => updateControl('coolantInletTemp', val)}
              tooltip="Baseline temperature of hot coolant leaving server cold plates"
            />

            {/* Advanced 2: CO2 Enrichment */}
            <ControlSlider
              label="CO₂ Enrichment Level"
              value={state.co2Level}
              min={200}
              max={1200}
              step={20}
              unit="ppm"
              icon={Wind}
              accentColor="emerald"
              optimalRange="650 - 950 ppm"
              onChange={(val) => updateControl('co2Level', val)}
              tooltip="Sparging concentration of CO2 gas dissolved into algae culture"
            />

            {/* Advanced 3: Nutrient Dosing Level */}
            <ControlSlider
              label="Nutrient Dosing Rate"
              value={state.nutrientLevel}
              min={10}
              max={100}
              unit="%"
              icon={Sprout}
              accentColor="emerald"
              optimalRange="60 - 80%"
              onChange={(val) => updateControl('nutrientLevel', val)}
              tooltip="Precision nitrogen, phosphate, and mineral micronutrient replenishment"
            />

            {/* Advanced 4: Water Recirculation Rate */}
            <ControlSlider
              label="Closed-Loop Recirculation"
              value={state.waterRecirculationRate}
              min={50}
              max={98}
              unit="%"
              icon={Droplets}
              accentColor="cyan"
              optimalRange="88 - 96%"
              onChange={(val) => updateControl('waterRecirculationRate', val)}
              tooltip="Percentage of filtrate loop recycled without fresh water consumption"
            />
          </div>
        )}
      </div>
    </div>
  );
};
