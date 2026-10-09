/**
 * DRISHTI-SWARM: Global Disaster State Store
 * Manages live multi-source telemetry, persistent database synchronization,
 * and 24-hour / 7-day / 30-day dynamic timeline horizons.
 */

import { create } from 'zustand';
import {
  DisasterCategory,
  DisasterIncident,
  DistrictRiskProfile,
  EarthquakeEvent,
  FireHotspot,
  RiverBasinTelemetry,
} from '@/types/disaster';
import { EvacuationRoute, ReliefShelter } from '@/types/logistics';
import {
  KEY_DISTRICT_PROFILES,
  SAMPLE_EARTHQUAKES,
  SAMPLE_FIRE_HOTSPOTS,
  SAMPLE_RELIEF_SHELTERS,
  SAMPLE_RIVER_TELEMETRY,
} from '../geo/indiaGeoData';

export type TimeHorizon = '24h' | '7d' | '30d';

export interface MapLayerVisibility {
  nasaFirmsFires: boolean;
  bhuvanFloodZones: boolean;
  cycloneTracks: boolean;
  usgsEarthquakes: boolean;
  cwcRiverGauges: boolean;
  osmShelters: boolean;
  evacuationCorridors: boolean;
  heatmaps: boolean;
  terrain3D: boolean;
}

interface DisasterStoreState {
  incidents: DisasterIncident[];
  fireHotspots: FireHotspot[];
  riverTelemetry: RiverBasinTelemetry[];
  earthquakes: EarthquakeEvent[];
  shelters: ReliefShelter[];
  evacuationRoutes: EvacuationRoute[];
  districts: DistrictRiskProfile[];

  // Selected Entities
  selectedDistrict: DistrictRiskProfile | null;
  selectedIncident: DisasterIncident | null;
  activeFilterCategory: DisasterCategory | 'ALL';

  // Multi-Horizon Timeline State (24h, 7d, 30d)
  timeHorizon: TimeHorizon;
  timelineStep: number; // 0-23 for 24h, 1-7 for 7d, 1-30 for 30d
  isPlayingTimeline: boolean;

  // Live Sync Status
  isLoadingLive: boolean;
  lastLiveSync: string;
  totalSyncCount: number;
  activeSources: string[];

  // Map Controls
  layerVisibility: MapLayerVisibility;
  mapViewport: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };

  // Actions
  setSelectedDistrict: (district: DistrictRiskProfile | null) => void;
  setSelectedIncident: (incident: DisasterIncident | null) => void;
  setActiveFilterCategory: (category: DisasterCategory | 'ALL') => void;
  toggleLayer: (layerKey: keyof MapLayerVisibility) => void;
  setMapViewport: (viewport: Partial<DisasterStoreState['mapViewport']>) => void;
  addIncident: (incident: DisasterIncident) => void;

  // Timeline & Live Sync Actions
  setTimeHorizon: (horizon: TimeHorizon) => Promise<void>;
  setTimelineStep: (step: number) => void;
  setIsPlayingTimeline: (playing: boolean) => void;
  fetchLiveTelemetry: (horizon?: TimeHorizon, forceSync?: boolean) => Promise<void>;
}

export const INITIAL_INCIDENTS: DisasterIncident[] = [
  {
    id: 'inc-live-cyclone-puri',
    category: 'CYCLONE',
    title: 'Very Severe Cyclonic Storm Coastal Threat - Odisha Sector',
    state: 'Odisha',
    district: 'Puri',
    location: { lat: 19.8135, lng: 85.8312 },
    severity: 'RED',
    source: 'IMD_INCOIS_LIVE',
    timestamp: 'Live Ingestion',
    metrics: {
      riskScore: 94,
      confidence: 98,
      windSpeed_kmh: 155,
      pressure_hpa: 954,
      surgeHeight_m: 3.8,
      affectedPopulationEst: 840000,
    },
    details: 'Approaching Odisha/Andhra coast with sustained winds of 155 km/h and 3.8m surge threat across coastal taluks.',
  },
  {
    id: 'inc-live-wayanad-landslide',
    category: 'LANDSLIDE',
    title: 'Ghats Slope Saturation & Landslide Alert - Meppadi Sector',
    state: 'Kerala',
    district: 'Wayanad',
    location: { lat: 11.6854, lng: 76.132 },
    severity: 'RED',
    source: 'ISRO_BHUVAN_LIVE',
    timestamp: 'Live Ingestion',
    metrics: {
      riskScore: 92,
      confidence: 96,
      rainfall_mm_24h: 240,
      lsi_index: 1.92,
      affectedPopulationEst: 65000,
    },
    details: 'Heavy monsoon cloudburst saturated hill slope stability past 1.92 critical threshold. High risk of debris flow.',
  },
  {
    id: 'inc-live-brahmaputra-flood',
    category: 'FLOOD',
    title: 'Brahmaputra Basin Flood Stage Breach - Guwahati/Dibrugarh',
    state: 'Assam',
    district: 'Dibrugarh',
    location: { lat: 27.4728, lng: 94.912 },
    severity: 'ORANGE',
    source: 'CWC_HYDRO_LIVE',
    timestamp: 'Live Ingestion',
    metrics: {
      riskScore: 84,
      confidence: 95,
      waterDischarge_cusecs: 920000,
      inundatedArea_sqkm: 680,
      affectedPopulationEst: 510000,
    },
    details: 'Brahmaputra river level crossed danger mark by 1.82m at Pandu and Dibrugarh stations with severe embankment erosion.',
  },
];

export const INITIAL_EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: 'evac-puri-1',
    originName: 'Puri Coastal Lowlands',
    originCoordinates: { lat: 19.8135, lng: 85.8312 },
    destinationShelterId: 'shelter-puri-1',
    destinationName: 'Puri Multipurpose Cyclone Shelter',
    destinationCoordinates: { lat: 19.835, lng: 85.849 },
    totalDistanceKm: 4.2,
    estimatedTravelTimeMins: 14,
    safetyStatus: 'SAFE_CLEAR',
    waypoints: [
      [85.8312, 19.8135],
      [85.8395, 19.825],
      [85.845, 19.831],
      [85.849, 19.835],
    ],
    avoidedHazardsCount: 3,
    recommendedVehicleType: 'ALL_VEHICLES',
  },
  {
    id: 'evac-wayanad-1',
    originName: 'Chooralmala Debris Zone',
    originCoordinates: { lat: 11.6854, lng: 76.132 },
    destinationShelterId: 'shelter-wayanad-1',
    destinationName: 'Meppadi Higher Secondary School Relief Camp',
    destinationCoordinates: { lat: 11.668, lng: 76.118 },
    totalDistanceKm: 6.8,
    estimatedTravelTimeMins: 22,
    safetyStatus: 'CAUTION_RISING_WATER',
    waypoints: [
      [76.132, 11.6854],
      [76.128, 11.679],
      [76.122, 11.672],
      [76.118, 11.668],
    ],
    avoidedHazardsCount: 5,
    recommendedVehicleType: 'HIGH_CLEARANCE_TRUCKS',
  },
];

export const useDisasterStore = create<DisasterStoreState>((set, get) => ({
  incidents: INITIAL_INCIDENTS,
  fireHotspots: SAMPLE_FIRE_HOTSPOTS,
  riverTelemetry: SAMPLE_RIVER_TELEMETRY,
  earthquakes: SAMPLE_EARTHQUAKES,
  shelters: SAMPLE_RELIEF_SHELTERS,
  evacuationRoutes: INITIAL_EVACUATION_ROUTES,
  districts: KEY_DISTRICT_PROFILES,

  selectedDistrict: null,
  selectedIncident: null,
  activeFilterCategory: 'ALL',

  // Default Timeline: 24h, 14:00 IST
  timeHorizon: '24h',
  timelineStep: 14,
  isPlayingTimeline: false,

  isLoadingLive: false,
  lastLiveSync: new Date().toISOString(),
  totalSyncCount: 1,
  activeSources: ['USGS_SEISMIC_REALTIME', 'NASA_FIRMS_VIIRS_LIVE', 'OPEN_METEO_FLOOD_DISCHARGE'],

  layerVisibility: {
    nasaFirmsFires: true,
    bhuvanFloodZones: true,
    cycloneTracks: true,
    usgsEarthquakes: true,
    cwcRiverGauges: true,
    osmShelters: true,
    evacuationCorridors: true,
    heatmaps: true,
    terrain3D: false,
  },

  mapViewport: {
    longitude: 82.0,
    latitude: 22.0,
    zoom: 4.6,
    pitch: 20,
    bearing: 0,
  },

  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
  setActiveFilterCategory: (category) => set({ activeFilterCategory: category }),

  toggleLayer: (layerKey) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layerKey]: !state.layerVisibility[layerKey],
      },
    })),

  setMapViewport: (viewport) =>
    set((state) => ({
      mapViewport: { ...state.mapViewport, ...viewport },
    })),

  addIncident: (incident) =>
    set((state) => ({
      incidents: [incident, ...state.incidents],
    })),

  setTimelineStep: (step) => set({ timelineStep: step }),
  setIsPlayingTimeline: (playing) => set({ isPlayingTimeline: playing }),

  setTimeHorizon: async (horizon) => {
    const defaultSteps = { '24h': 14, '7d': 7, '30d': 30 };
    set({ timeHorizon: horizon, timelineStep: defaultSteps[horizon] });
    await get().fetchLiveTelemetry(horizon, false);
  },

  fetchLiveTelemetry: async (horizonOverride, forceSync = false) => {
    const horizon = horizonOverride || get().timeHorizon;
    set({ isLoadingLive: true });

    try {
      const res = await fetch(`/api/telemetry/live?horizon=${horizon}&sync=${forceSync}`);
      if (!res.ok) throw new Error('Live telemetry sync failed');
      const json = await res.json();

      if (json.success && json.data) {
        set({
          earthquakes: json.data.earthquakes.length > 0 ? json.data.earthquakes : get().earthquakes,
          fireHotspots: json.data.wildfires.length > 0 ? json.data.wildfires : get().fireHotspots,
          riverTelemetry: json.data.hydrology.length > 0 ? json.data.hydrology : get().riverTelemetry,
          incidents: json.data.incidents.length > 0 ? json.data.incidents : get().incidents,
          lastLiveSync: json.meta?.lastSyncedAt || new Date().toISOString(),
          totalSyncCount: json.meta?.totalSyncCount || get().totalSyncCount + 1,
          activeSources: json.meta?.activeSources || get().activeSources,
          isLoadingLive: false,
        });
      } else {
        set({ isLoadingLive: false });
      }
    } catch (err) {
      console.warn('Could not complete live fetch, keeping existing telemetry:', err);
      set({ isLoadingLive: false });
    }
  },
}));
