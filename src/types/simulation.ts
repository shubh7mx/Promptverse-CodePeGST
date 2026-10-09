/**
 * DRISHTI-SWARM: Simulation Sandbox Types
 */

import { DisasterCategory, GeoCoordinate } from './disaster';

export interface SimulationParameters {
  scenarioName: string;
  category: DisasterCategory;
  state: string;
  district?: string;
  epicenter: GeoCoordinate;

  // Flood Parameters
  rainfall24hMm: number; // 0 - 600 mm
  damDischargeCusecs: number; // 0 - 300,000 cusecs
  riverStageDeltaM: number; // -2m to +8m

  // Wildfire Parameters
  windSpeedKmh: number; // 0 - 120 km/h
  windDirectionDeg: number; // 0 - 360 deg
  fuelDrynessIndex: number; // 0 - 100%
  terrainSlopeDeg: number; // 0 - 45 deg

  // Cyclone Parameters
  cycloneCategoryIndex: number; // 1 to 5
  centralPressureHpa: number; // 900 - 1010 hPa
  maxWindSpeedKmh: number; // 50 - 280 km/h
  coastalSurgeEstimatedM: number; // 0 - 8m

  // Landslide Parameters
  antecedentRainfallMm: number; // 0 - 400 mm
  soilMoistureSaturationPct: number; // 0 - 100%
  slopeInstabilityFactor: number; // 0.0 - 2.5
}

export interface SimulationImpactResults {
  inundatedAreaSqKm: number;
  fireSpreadPerimeterKm: number;
  highWindImpactZoneSqKm: number;
  landslideHighRiskZonesCount: number;

  estimatedAffectedPopulation: number;
  estimatedSeveredRoadsKm: number;
  submergedCriticalFacilitiesCount: number;
  estimatedEconomicLossCroresINR: number;

  evacuationPriorityDistricts: string[];
  requiredRescueBoats: number;
  requiredReliefCamps: number;
  generatedAlertTier: 'YELLOW' | 'ORANGE' | 'RED';
}

export interface PresetDisasterScenario {
  id: string;
  name: string;
  category: DisasterCategory;
  state: string;
  district: string;
  description: string;
  historicalReferenceYear: number;
  defaultParams: SimulationParameters;
}
