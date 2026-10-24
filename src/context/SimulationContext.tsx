import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { SiteData, SimulationState, AIRecommendation, SystemAlert, HarvestRecord, HistoryPoint } from '../types';
import { MOCK_SITES } from '../data/mockSites';
import { calculateSimulationOutputs, generate24HourHistory } from '../utils/simulation';
import confetti from 'canvas-confetti';

interface SimulationContextType {
  sites: SiteData[];
  activeSite: SiteData;
  setActiveSiteById: (id: string) => void;
  state: SimulationState;
  updateControl: (key: keyof SimulationState, value: number) => void;
  applyRecommendation: (patch: Partial<SimulationState>) => void;
  recommendations: AIRecommendation[];
  alerts: SystemAlert[];
  dismissAlert: (id: string) => void;
  history24h: HistoryPoint[];
  harvestRecords: HarvestRecord[];
  triggerHarvest: () => HarvestRecord;
  toggleAutoPilot: () => void;
  resetToDefaults: () => void;
  lastHarvested: HarvestRecord | null;
  clearLastHarvestedModal: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

function createInitialStateForSite(site: SiteData): SimulationState {
  const baseBiomassGramsPerLiter = 1.95;
  const initialAccumulatedKg = Number((baseBiomassGramsPerLiter * (site.reactorVolumeLiters / 1000) * 0.65).toFixed(1));

  const draft: SimulationState = {
    serverLoad: site.currentServerLoad,
    coolantInletTemp: site.coolantInletTemp,
    coolantFlowRate: site.coolantFlowRate,
    ambientTemp: site.ambientTemp,
    lightIntensity: site.lightIntensity,
    co2Level: site.co2Level,
    nutrientLevel: site.nutrientLevel,
    waterRecirculationRate: site.waterRecirculationRate,
    wasteHeatAvailableKW: 0,
    heatAbsorbedKW: 0,
    heatRejectedKW: 0,
    coolingEnergyOffsetPercent: 14.2,
    reactorWaterTemp: 26.5,
    algaeGrowthRate: 1.45,
    currentBiomassGramsPerLiter: baseBiomassGramsPerLiter,
    biomassAccumulatedTodayKg: initialAccumulatedKg,
    co2UptakeRateKgDay: 480,
    co2UptakeGramsPerHour: 20000,
    dissolvedOxygenMgL: 8.6,
    phValue: 7.6,
    cultureHealthScore: 94,
    harvestReadinessPercent: 81,
    opticalDensityOD680: 1.8,
    isAutoPilot: true,
    statusMode: 'optimal',
  };

  const calculated = calculateSimulationOutputs(draft, site, baseBiomassGramsPerLiter, initialAccumulatedKg);
  return calculated.state;
}

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSite, setActiveSite] = useState<SiteData>(MOCK_SITES[0]); // Coimbatore default
  const [state, setState] = useState<SimulationState>(() => createInitialStateForSite(MOCK_SITES[0]));
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [history24h, setHistory24h] = useState<HistoryPoint[]>(() =>
    generate24HourHistory(state.biomassAccumulatedTodayKg, 1.45, 380)
  );
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([
    {
      id: 'harvest-init-1',
      timestamp: 'Yesterday 17:30',
      siteName: 'Coimbatore Green Edge Hub',
      biomassKg: 18.2,
      co2SequesteredKg: 33.3,
      heatRecoveredKWh: 1250,
      species: 'Chlorella vulgaris',
      qualityGrade: 'A+',
    },
    {
      id: 'harvest-init-2',
      timestamp: '2 days ago 16:45',
      siteName: 'Coimbatore Green Edge Hub',
      biomassKg: 17.6,
      co2SequesteredKg: 32.2,
      heatRecoveredKWh: 1190,
      species: 'Chlorella vulgaris',
      qualityGrade: 'A',
    },
  ]);
  const [lastHarvested, setLastHarvested] = useState<HarvestRecord | null>(null);

  // Reference to hold current state without triggering re-effects
  const stateRef = useRef(state);
  stateRef.current = state;
  const activeSiteRef = useRef(activeSite);
  activeSiteRef.current = activeSite;

  // Recalculate outputs whenever active sliders change
  const refreshOutputs = useCallback(
    (nextState: SimulationState) => {
      const { state: updatedState, recommendations: recs, alerts: systemAlerts } = calculateSimulationOutputs(
        nextState,
        activeSiteRef.current,
        nextState.currentBiomassGramsPerLiter,
        nextState.biomassAccumulatedTodayKg
      );
      setState(updatedState);
      setRecommendations(recs);
      setAlerts((prev) => {
        // preserve dismissed flags if same id
        const dismissedIds = new Set(prev.filter((a) => a.dismissed).map((a) => a.id));
        return systemAlerts.map((a) => ({ ...a, dismissed: dismissedIds.has(a.id) }));
      });
    },
    []
  );

  // Switch Site
  const setActiveSiteById = useCallback((id: string) => {
    const site = MOCK_SITES.find((s) => s.id === id);
    if (!site) return;
    setActiveSite(site);
    const newState = createInitialStateForSite(site);
    setState(newState);
    const { recommendations: recs, alerts: systemAlerts } = calculateSimulationOutputs(
      newState,
      site,
      newState.currentBiomassGramsPerLiter,
      newState.biomassAccumulatedTodayKg
    );
    setRecommendations(recs);
    setAlerts(systemAlerts);
    setHistory24h(generate24HourHistory(newState.biomassAccumulatedTodayKg, newState.algaeGrowthRate, newState.heatAbsorbedKW));
  }, []);

  // Update a single control slider
  const updateControl = useCallback((key: keyof SimulationState, value: number) => {
    setState((prev) => {
      const updated = { ...prev, [key]: value };
      const { state: nextState, recommendations: recs, alerts: alts } = calculateSimulationOutputs(
        updated,
        activeSiteRef.current,
        prev.currentBiomassGramsPerLiter,
        prev.biomassAccumulatedTodayKg
      );
      setRecommendations(recs);
      setAlerts(alts);
      return nextState;
    });
  }, []);

  // Apply AI Recommendation patch
  const applyRecommendation = useCallback((patch: Partial<SimulationState>) => {
    setState((prev) => {
      const updated = { ...prev, ...patch };
      const { state: nextState, recommendations: recs, alerts: alts } = calculateSimulationOutputs(
        updated,
        activeSiteRef.current,
        prev.currentBiomassGramsPerLiter,
        prev.biomassAccumulatedTodayKg
      );
      setRecommendations(recs);
      setAlerts(alts);
      return nextState;
    });
  }, []);

  // Dismiss an alert
  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a)));
  }, []);

  // Reset to active site's initial defaults
  const resetToDefaults = useCallback(() => {
    const site = activeSiteRef.current;
    const initial = createInitialStateForSite(site);
    setState(initial);
    refreshOutputs(initial);
  }, [refreshOutputs]);

  // Toggle AutoPilot
  const toggleAutoPilot = useCallback(() => {
    setState((prev) => ({ ...prev, isAutoPilot: !prev.isAutoPilot }));
  }, []);

  // Harvest Trigger
  const triggerHarvest = useCallback((): HarvestRecord => {
    const curState = stateRef.current;
    const site = activeSiteRef.current;
    
    // Calculate harvested amounts
    const harvestedKg = Number((curState.biomassAccumulatedTodayKg * 0.72).toFixed(1));
    const co2Seq = Number((harvestedKg * 1.83).toFixed(1));
    const heatRec = Math.round(curState.heatAbsorbedKW * 4.2);
    const grade: 'A+' | 'A' | 'B' = curState.cultureHealthScore > 85 ? 'A+' : curState.cultureHealthScore > 65 ? 'A' : 'B';

    const record: HarvestRecord = {
      id: `harvest-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      siteName: site.name,
      biomassKg: harvestedKg,
      co2SequesteredKg: co2Seq,
      heatRecoveredKWh: heatRec,
      species: site.algaeSpecies.split(' ')[0],
      qualityGrade: grade,
    };

    // Confetti effect
    try {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#10b981', '#06b6d4', '#84cc16', '#3b82f6'],
      });
    } catch {
      // fallback
    }

    setHarvestRecords((prev) => [record, ...prev]);
    setLastHarvested(record);

    // Reset biomass accumulation and concentration
    setState((prev) => {
      const resetBiomassDensity = 0.55; // inoculate residual
      const remainingTodayKg = Number((prev.biomassAccumulatedTodayKg * 0.28).toFixed(1));
      const next = {
        ...prev,
        currentBiomassGramsPerLiter: resetBiomassDensity,
        biomassAccumulatedTodayKg: remainingTodayKg,
      };
      const { state: updated, recommendations: recs, alerts: alts } = calculateSimulationOutputs(
        next,
        site,
        resetBiomassDensity,
        remainingTodayKg
      );
      setRecommendations(recs);
      setAlerts(alts);
      return updated;
    });

    return record;
  }, []);

  const clearLastHarvestedModal = useCallback(() => {
    setLastHarvested(null);
  }, []);

  // 1-second simulation timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const site = activeSiteRef.current;
        
        // AutoPilot self-tuning micro-adjustments
        let newCoolantFlow = prev.coolantFlowRate;
        let newLight = prev.lightIntensity;
        let newCo2 = prev.co2Level;
        let newNutrient = prev.nutrientLevel;

        if (prev.isAutoPilot) {
          // If water is too hot, ramp down coolant flow or increase water recirc
          if (prev.reactorWaterTemp > 31 && newCoolantFlow > 20) {
            newCoolantFlow = Math.max(15, newCoolantFlow - 1);
          } else if (prev.reactorWaterTemp < 24 && newCoolantFlow < 90) {
            newCoolantFlow = Math.min(95, newCoolantFlow + 1);
          }

          // If CO2 is low, auto-enrich
          if (newCo2 < 680) {
            newCo2 = Math.min(850, newCo2 + 10);
          }

          // Keep light in high-yield zone (500 - 620)
          if (newLight < 450) {
            newLight = Math.min(600, newLight + 5);
          }

          // Maintain nutrients near 72%
          if (newNutrient < 60) {
            newNutrient = Math.min(75, newNutrient + 1);
          } else if (newNutrient > 85) {
            newNutrient = Math.max(70, newNutrient - 1);
          }
        }

        // Biological biomass accumulation over 1 tick (representing scaled time)
        // Growth rate is g/L/day -> convert to kg growth in reactor
        const reactorVolM3 = site.reactorVolumeLiters / 1000;
        const dailyPotentialKg = prev.algaeGrowthRate * reactorVolM3;
        // 1 tick = 0.0003 of a day cycle in fast simulation
        const deltaKg = (dailyPotentialKg * 0.0004);
        const nextAccumulatedKg = Number((prev.biomassAccumulatedTodayKg + deltaKg).toFixed(3));
        const nextDensity = Number((prev.currentBiomassGramsPerLiter + deltaKg / reactorVolM3).toFixed(3));

        const baseForCalc: SimulationState = {
          ...prev,
          coolantFlowRate: newCoolantFlow,
          lightIntensity: newLight,
          co2Level: newCo2,
          nutrientLevel: newNutrient,
          currentBiomassGramsPerLiter: nextDensity,
          biomassAccumulatedTodayKg: nextAccumulatedKg,
        };

        const { state: updated, recommendations: recs, alerts: alts } = calculateSimulationOutputs(
          baseForCalc,
          site,
          nextDensity,
          nextAccumulatedKg
        );

        setRecommendations(recs);
        setAlerts((oldAlerts) => {
          const dismissedSet = new Set(oldAlerts.filter((a) => a.dismissed).map((a) => a.id));
          return alts.map((a) => ({ ...a, dismissed: dismissedSet.has(a.id) }));
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update historical trend line occasionally
  useEffect(() => {
    const historyInterval = setInterval(() => {
      setHistory24h((prev) => {
        const cur = stateRef.current;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newPoint: HistoryPoint = {
          time: now,
          biomass: Number(cur.biomassAccumulatedTodayKg.toFixed(1)),
          growthRate: cur.algaeGrowthRate,
          heatAbsorbed: cur.heatAbsorbedKW,
          heatRejected: cur.heatRejectedKW,
          temp: cur.reactorWaterTemp,
          co2Uptake: Number((cur.algaeGrowthRate * 16.2).toFixed(1)),
          health: cur.cultureHealthScore,
        };
        // Keep last 25 points
        return [...prev.slice(1), newPoint];
      });
    }, 6000);

    return () => clearInterval(historyInterval);
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        sites: MOCK_SITES,
        activeSite,
        setActiveSiteById,
        state,
        updateControl,
        applyRecommendation,
        recommendations,
        alerts,
        dismissAlert,
        history24h,
        harvestRecords,
        triggerHarvest,
        toggleAutoPilot,
        resetToDefaults,
        lastHarvested,
        clearLastHarvestedModal,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
