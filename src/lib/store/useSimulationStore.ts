/**
 * DRISHTI-SWARM: Global Simulation State Store
 */

import { create } from 'zustand';
import { PresetDisasterScenario, SimulationImpactResults, SimulationParameters } from '@/types/simulation';
import { computeFloodInundation, computeLandslideSaturationIndex, computeWildfirePropagation, computeCoastalStormSurge } from '../physics/hazardPhysics';

export const PRESET_SCENARIOS: PresetDisasterScenario[] = [
  {
    id: 'preset-cyclone-michaung',
    name: 'Super Cyclone Landfall & 4.2m Surge',
    category: 'CYCLONE',
    state: 'Odisha',
    district: 'Puri',
    description: 'Category 4 Super Cyclone with central pressure drop to 938 hPa, sustained winds of 195 km/h, and 4.2m coastal surge penetration.',
    historicalReferenceYear: 2024,
    defaultParams: {
      scenarioName: 'Super Cyclone Landfall Simulation',
      category: 'CYCLONE',
      state: 'Odisha',
      epicenter: { lat: 19.8135, lng: 85.8312 },
      rainfall24hMm: 280,
      damDischargeCusecs: 120000,
      riverStageDeltaM: 3.2,
      windSpeedKmh: 195,
      windDirectionDeg: 65,
      fuelDrynessIndex: 30,
      terrainSlopeDeg: 8,
      cycloneCategoryIndex: 4,
      centralPressureHpa: 938,
      maxWindSpeedKmh: 195,
      coastalSurgeEstimatedM: 4.2,
      antecedentRainfallMm: 160,
      soilMoistureSaturationPct: 88,
      slopeInstabilityFactor: 1.1,
    }
  },
  {
    id: 'preset-wayanad-landslide',
    name: 'Wayanad Monsoon Cloudburst & Debris Flow',
    category: 'LANDSLIDE',
    state: 'Kerala',
    district: 'Wayanad',
    description: 'Severe 48-hour torrential cloudburst of 380 mm triggering multi-slope saturation and major debris flow in Chooralmala-Meppadi ghat corridor.',
    historicalReferenceYear: 2024,
    defaultParams: {
      scenarioName: 'Wayanad Landslide Simulation',
      category: 'LANDSLIDE',
      state: 'Kerala',
      epicenter: { lat: 11.6854, lng: 76.1320 },
      rainfall24hMm: 380,
      damDischargeCusecs: 85000,
      riverStageDeltaM: 4.5,
      windSpeedKmh: 48,
      windDirectionDeg: 240,
      fuelDrynessIndex: 15,
      terrainSlopeDeg: 42,
      cycloneCategoryIndex: 1,
      centralPressureHpa: 996,
      maxWindSpeedKmh: 48,
      coastalSurgeEstimatedM: 0.5,
      antecedentRainfallMm: 340,
      soilMoistureSaturationPct: 96,
      slopeInstabilityFactor: 2.1,
    }
  },
  {
    id: 'preset-simlipal-fire',
    name: 'Simlipal Tiger Reserve Wildfire Propagation',
    category: 'WILDFIRE',
    state: 'Odisha',
    district: 'Mayurbhanj',
    description: 'Dry season high-temperature fire outbreak with 45 km/h gusting winds and low moisture causing rapid perimeter expansion.',
    historicalReferenceYear: 2023,
    defaultParams: {
      scenarioName: 'Simlipal Fire Spread Simulation',
      category: 'WILDFIRE',
      state: 'Odisha',
      epicenter: { lat: 21.7584, lng: 86.3421 },
      rainfall24hMm: 0,
      damDischargeCusecs: 0,
      riverStageDeltaM: -0.5,
      windSpeedKmh: 45,
      windDirectionDeg: 120,
      fuelDrynessIndex: 92,
      terrainSlopeDeg: 22,
      cycloneCategoryIndex: 0,
      centralPressureHpa: 1010,
      maxWindSpeedKmh: 45,
      coastalSurgeEstimatedM: 0.0,
      antecedentRainfallMm: 0,
      soilMoistureSaturationPct: 12,
      slopeInstabilityFactor: 0.4,
    }
  },
  {
    id: 'preset-brahmaputra-flood',
    name: 'Brahmaputra Basin Severe Embankment Flood',
    category: 'FLOOD',
    state: 'Assam',
    district: 'Dibrugarh',
    description: 'Upstream glacial and monsoon runoff raising Brahmaputra river stage 2.8m above danger mark with 260,000 cusecs discharge.',
    historicalReferenceYear: 2022,
    defaultParams: {
      scenarioName: 'Brahmaputra Flood Simulation',
      category: 'FLOOD',
      state: 'Assam',
      epicenter: { lat: 27.4728, lng: 94.9120 },
      rainfall24hMm: 290,
      damDischargeCusecs: 260000,
      riverStageDeltaM: 2.8,
      windSpeedKmh: 35,
      windDirectionDeg: 180,
      fuelDrynessIndex: 10,
      terrainSlopeDeg: 6,
      cycloneCategoryIndex: 1,
      centralPressureHpa: 998,
      maxWindSpeedKmh: 35,
      coastalSurgeEstimatedM: 0.0,
      antecedentRainfallMm: 210,
      soilMoistureSaturationPct: 92,
      slopeInstabilityFactor: 0.8,
    }
  }
];

function calculateImpactMetrics(params: SimulationParameters): SimulationImpactResults {
  const flood = computeFloodInundation({
    rainfall24hMm: params.rainfall24hMm,
    damDischargeCusecs: params.damDischargeCusecs,
    riverStageAboveDangerM: params.riverStageDeltaM,
  });

  const fire = computeWildfirePropagation({
    originLat: params.epicenter.lat,
    originLng: params.epicenter.lng,
    fireRadiativePowerMw: params.fuelDrynessIndex * 2.2,
    windSpeedKmh: params.windSpeedKmh,
    windDirectionDeg: params.windDirectionDeg,
    terrainSlopeDeg: params.terrainSlopeDeg,
    fuelDrynessPct: params.fuelDrynessIndex,
  });

  const surge = computeCoastalStormSurge({
    centralPressureHpa: params.centralPressureHpa,
    maxWindSpeedKmh: params.maxWindSpeedKmh,
    cycloneCategory: params.cycloneCategoryIndex,
  });

  const lsi = computeLandslideSaturationIndex({
    rainfall24hMm: params.rainfall24hMm,
    rainfall48hMm: params.antecedentRainfallMm,
    terrainSlopeDeg: params.terrainSlopeDeg,
    soilMoistureSaturationPct: params.soilMoistureSaturationPct,
  });

  // Synthesize impact scores
  let affectedPop = 0;
  let severedRoads = 0;
  let economicLossCrores = 0;
  let alertTier: SimulationImpactResults['generatedAlertTier'] = 'YELLOW';

  if (params.category === 'FLOOD') {
    affectedPop = Math.round(flood.inundatedAreaSqKm * 2800);
    severedRoads = flood.estimatedSeveredRoadsKm;
    economicLossCrores = Math.round(flood.inundatedAreaSqKm * 4.2);
    alertTier = flood.inundatedAreaSqKm > 100 ? 'RED' : 'ORANGE';
  } else if (params.category === 'CYCLONE') {
    affectedPop = Math.round(surge.inlandInundationDistanceKm * 45000);
    severedRoads = Math.round(surge.inlandInundationDistanceKm * 18);
    economicLossCrores = Math.round(surge.peakSurgeHeightMeters * 350);
    alertTier = surge.peakSurgeHeightMeters > 3.0 ? 'RED' : 'ORANGE';
  } else if (params.category === 'WILDFIRE') {
    affectedPop = Math.round(fire.projectedAreaSqKm * 120);
    severedRoads = Math.round(fire.perimeterKm * 0.8);
    economicLossCrores = Math.round(fire.projectedAreaSqKm * 1.8);
    alertTier = fire.projectedAreaSqKm > 50 ? 'ORANGE' : 'YELLOW';
  } else if (params.category === 'LANDSLIDE') {
    affectedPop = Math.round(lsi.estimatedFailureProbabilityPct * 850);
    severedRoads = Math.round(lsi.lsiScore * 24);
    economicLossCrores = Math.round(lsi.lsiScore * 85);
    alertTier = lsi.lsiScore > 1.4 ? 'RED' : 'ORANGE';
  }

  return {
    inundatedAreaSqKm: flood.inundatedAreaSqKm,
    fireSpreadPerimeterKm: fire.perimeterKm,
    highWindImpactZoneSqKm: Math.round(params.maxWindSpeedKmh * 8.5),
    landslideHighRiskZonesCount: Math.round(lsi.lsiScore * 8),
    estimatedAffectedPopulation: affectedPop,
    estimatedSeveredRoadsKm: severedRoads,
    submergedCriticalFacilitiesCount: Math.max(Math.round(affectedPop / 25000), 1),
    estimatedEconomicLossCroresINR: economicLossCrores,
    evacuationPriorityDistricts: [params.district || 'Target Region', 'Adjacent Coastal/River Blocks'],
    requiredRescueBoats: Math.max(Math.round(affectedPop / 15000), 4),
    requiredReliefCamps: Math.max(Math.round(affectedPop / 12000), 2),
    generatedAlertTier: alertTier,
  };
}

interface SimulationStoreState {
  activePreset: PresetDisasterScenario;
  currentParams: SimulationParameters;
  results: SimulationImpactResults;
  isSimulating: boolean;

  // Actions
  loadPreset: (presetId: string) => void;
  updateParam: <K extends keyof SimulationParameters>(key: K, value: SimulationParameters[K]) => void;
  runSimulation: () => void;
}

export const useSimulationStore = create<SimulationStoreState>((set, get) => {
  const defaultPreset = PRESET_SCENARIOS[0];
  const initialParams = { ...defaultPreset.defaultParams };
  const initialResults = calculateImpactMetrics(initialParams);

  return {
    activePreset: defaultPreset,
    currentParams: initialParams,
    results: initialResults,
    isSimulating: false,

    loadPreset: (presetId: string) => {
      const found = PRESET_SCENARIOS.find((p) => p.id === presetId) || PRESET_SCENARIOS[0];
      const newParams = { ...found.defaultParams };
      const newResults = calculateImpactMetrics(newParams);
      set({
        activePreset: found,
        currentParams: newParams,
        results: newResults,
      });
    },

    updateParam: (key, value) => {
      set((state) => {
        const updatedParams = { ...state.currentParams, [key]: value };
        const updatedResults = calculateImpactMetrics(updatedParams);
        return {
          currentParams: updatedParams,
          results: updatedResults,
        };
      });
    },

    runSimulation: () => {
      set({ isSimulating: true });
      setTimeout(() => {
        const updatedResults = calculateImpactMetrics(get().currentParams);
        set({ results: updatedResults, isSimulating: false });
      }, 500);
    },
  };
});
