/**
 * DRISHTI-SWARM: Logistics, Shelter & NDRF Battalion Types
 */

import { GeoCoordinate } from './disaster';

export interface NdrfBattalion {
  id: string;
  name: string;
  battalionNumber: number;
  baseLocation: string;
  state: string;
  coordinates: GeoCoordinate;
  jurisdictionStates: string[];
  totalPersonnel: number;
  activeDeployed: number;
  inflatableRescueBoats: number;
  deepDivingSets: number;
  canineSearchTeams: number;
  medicalFirstResponders: number;
  heavyEarthMovers: number;
  readinessStatus: 'STANDBY' | 'MOBILIZING' | 'DEPLOYED' | 'OPERATING';
}

export interface ReliefShelter {
  id: string;
  name: string;
  type: 'CYCLONE_SHELTER' | 'COMMUNITY_HALL' | 'SCHOOL' | 'STADIUM' | 'RELIEF_CAMP';
  district: string;
  state: string;
  coordinates: GeoCoordinate;
  capacityMax: number;
  currentOccupancy: number;
  hasMedicalPost: boolean;
  hasCleanWaterSupply: boolean;
  hasBackupPower: boolean;
  status: 'OPEN_AVAILABLE' | 'NEAR_CAPACITY' | 'FULL' | 'ISOLATED_INUNDATED';
  contactPhone: string;
}

export interface EvacuationRoute {
  id: string;
  originName: string;
  originCoordinates: GeoCoordinate;
  destinationShelterId: string;
  destinationName: string;
  destinationCoordinates: GeoCoordinate;
  totalDistanceKm: number;
  estimatedTravelTimeMins: number;
  safetyStatus: 'SAFE_CLEAR' | 'CAUTION_RISING_WATER' | 'BLOCKED_HAZARD';
  waypoints: [number, number][]; // [lng, lat]
  avoidedHazardsCount: number;
  recommendedVehicleType: 'ALL_VEHICLES' | 'HIGH_CLEARANCE_TRUCKS' | 'BOAT_AMPHIBIOUS_ONLY';
}

export interface ResourceSupplyQuota {
  targetDistrict: string;
  state: string;
  targetPopulation: number;
  requiredFoodPacketsPerDay: number;
  drinkingWaterLitersPerDay: number;
  medicalTraumaKits: number;
  waterPurificationUnits: number;
  tarpaulinsAndTents: number;
  assignedNdrfBattalionId: string;
  dispatchRoutes: {
    fromBase: string;
    toDistrict: string;
    estimatedArrivalHours: number;
    assignedVehicles: string[];
  }[];
}

export interface NdmaSopItem {
  id: string;
  phase: 'PRE_DISASTER' | 'DURING_DISASTER' | 'POST_DISASTER';
  category: 'COMMAND' | 'EVACUATION' | 'MEDICAL' | 'LOGISTICS' | 'COMMUNICATION';
  title: string;
  description: string;
  responsibleAgency: 'NDMA' | 'SDMA' | 'NDRF' | 'DISTRICT_COLLECTOR' | 'IMD' | 'POLICE';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}
