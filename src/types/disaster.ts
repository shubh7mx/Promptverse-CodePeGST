/**
 * DRISHTI-SWARM: Disaster Telemetry & Geospatial Types
 */

export type DisasterCategory =
  | 'FLOOD'
  | 'WILDFIRE'
  | 'CYCLONE'
  | 'LANDSLIDE'
  | 'EARTHQUAKE'
  | 'DROUGHT'
  | 'COMPOUND';

export type AlertSeverity = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface GeoCoordinate {
  lat: number;
  lng: number;
  depth?: number;
}

export interface DisasterIncident {
  id: string;
  category: DisasterCategory;
  title: string;
  state: string;
  district: string;
  location: GeoCoordinate;
  severity: AlertSeverity;
  source: 'NASA_FIRMS' | 'ISRO_BHUVAN' | 'IMD' | 'CWC' | 'USGS' | 'INCOIS' | 'CITIZEN_SOS' | string;
  timestamp: string;
  metrics: {
    affectedPopulationEst?: number;
    riskScore: number; // 0 - 100
    confidence: number; // 0 - 100%
    frp_mw?: number; // For Wildfire (Fire Radiative Power)
    brightness_k?: number; // Fire brightness
    rainfall_mm_24h?: number; // For Flood
    riverStage_m?: number; // For Flood
    dangerLevel_m?: number;
    windSpeed_kmh?: number; // For Cyclone
    pressure_hpa?: number;
    surgeHeight_m?: number;
    magnitude?: number; // For Earthquake
    lsi_index?: number; // Landslide Saturation Index
    [key: string]: any;
  };
  details: string;
  geometryPolygon?: [number, number][]; // Polygon coordinates
}

export interface RiverBasinTelemetry {
  id: string;
  stationName: string;
  riverName: string;
  basin: string;
  state: string;
  district: string;
  coordinates: GeoCoordinate;
  currentLevelM: number;
  warningLevelM: number;
  dangerLevelM: number;
  highestFloodLevelM: number;
  trend: 'RISING' | 'FALLING' | 'STEADY';
  status: 'NORMAL' | 'WARNING' | 'DANGER' | 'SEVERE';
  dischargeCusecs: number;
}

export interface FireHotspot {
  id: string;
  latitude: number;
  longitude: number;
  frp: number; // Fire Radiative Power (MW)
  confidence: 'low' | 'nominal' | 'high' | number;
  acqDate: string;
  acqTime: string;
  satellite: string;
  daynight: 'D' | 'N';
  state: string;
  forestReserve?: string;
}

export interface EarthquakeEvent {
  id: string;
  place: string;
  magnitude: number;
  depthKm: number;
  coordinates: GeoCoordinate;
  time: number;
  alert: 'green' | 'yellow' | 'orange' | 'red' | null;
  tsunami: number;
  feltReports: number | null;
  faultZone: string;
}

export interface CycloneTrack {
  id: string;
  name: string;
  basin: 'Bay of Bengal' | 'Arabian Sea';
  currentCategory: 'Depression' | 'Deep Depression' | 'Cyclonic Storm' | 'Severe Cyclonic Storm' | 'Very Severe Cyclonic Storm' | 'Super Cyclone';
  coordinates: GeoCoordinate;
  centralPressureHpa: number;
  maxWindSpeedKts: number;
  maxWindSpeedKmh: number;
  predictedLandfallTime: string;
  landfallDistrict: string;
  projectedSurgeM: number;
  trackHistory: {
    lat: number;
    lng: number;
    timestamp: string;
    intensityKts: number;
  }[];
}

export interface DistrictRiskProfile {
  districtName: string;
  state: string;
  center: GeoCoordinate;
  overallVulnerabilityScore: number; // 0 - 100
  dominantThreat: DisasterCategory;
  activeAlert: AlertSeverity;
  population: number;
  hospitalsCount: number;
  sheltersCount: number;
  policeStationsCount: number;
  fireStationsCount: number;
  historicalEventsCount: number;
  ndrfBattalionAssigned: string;
}

export interface CitizenSosReport {
  id: string;
  timestamp: string;
  userName?: string;
  contact?: string;
  coordinates: GeoCoordinate;
  state: string;
  district: string;
  hazardType: DisasterCategory;
  headcount: number;
  medicalAssistanceRequired: boolean;
  notes: string;
  status: 'REPORTED' | 'DISPATCHED' | 'RESCUED';
}
