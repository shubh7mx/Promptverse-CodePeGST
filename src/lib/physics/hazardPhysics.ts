/**
 * DRISHTI-SWARM: Physics & Geospatial Hazard Simulation Engines
 */

// 1. Landslide Saturation Index (LSI) Model
export interface LsiInput {
  rainfall24hMm: number;
  rainfall48hMm: number;
  criticalRainfallThresholdMm?: number; // Default 150mm
  terrainSlopeDeg: number; // 0 - 60 deg
  criticalSlopeDeg?: number; // Default 35 deg
  soilMoistureSaturationPct: number; // 0 - 100%
  seismicIntensityFactor?: number; // 1.0 default, up to 2.5 if recent M4.5+ quake
}

export interface LsiOutput {
  lsiScore: number; // 0.0 to 3.0+
  hazardTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  estimatedFailureProbabilityPct: number;
  primaryTrigger: 'RAINFALL_SATURATION' | 'STEEP_SLOPE' | 'SEISMIC_SHAKING' | 'COMPOUND';
}

export function computeLandslideSaturationIndex(input: LsiInput): LsiOutput {
  const rCrit = input.criticalRainfallThresholdMm || 150;
  const sCrit = input.criticalSlopeDeg || 35;
  const seismicMultiplier = input.seismicIntensityFactor || 1.0;

  // Antecedent precipitation index
  const rainFactor = (input.rainfall24hMm + 0.5 * input.rainfall48hMm) / rCrit;

  // Topographic slope factor
  const slopeFactor = Math.min(input.terrainSlopeDeg / sCrit, 2.0);

  // Soil pore-water pressure factor
  const moistureFactor = input.soilMoistureSaturationPct / 100;

  // Multi-variable weighted index
  const rawLsi = (0.50 * rainFactor + 0.30 * slopeFactor + 0.20 * moistureFactor) * seismicMultiplier;
  const lsiScore = Number(rawLsi.toFixed(2));

  let hazardTier: LsiOutput['hazardTier'] = 'LOW';
  let failureProb = Math.min(Math.round(lsiScore * 28), 98);

  if (lsiScore >= 1.6) {
    hazardTier = 'CRITICAL';
    failureProb = Math.min(Math.round(75 + (lsiScore - 1.6) * 15), 99);
  } else if (lsiScore >= 1.1) {
    hazardTier = 'HIGH';
    failureProb = 50 + Math.round((lsiScore - 1.1) * 45);
  } else if (lsiScore >= 0.7) {
    hazardTier = 'MODERATE';
    failureProb = 20 + Math.round((lsiScore - 0.7) * 40);
  }

  let primaryTrigger: LsiOutput['primaryTrigger'] = 'RAINFALL_SATURATION';
  if (seismicMultiplier > 1.3) {
    primaryTrigger = 'COMPOUND';
  } else if (slopeFactor > rainFactor && slopeFactor > moistureFactor) {
    primaryTrigger = 'STEEP_SLOPE';
  }

  return {
    lsiScore,
    hazardTier,
    estimatedFailureProbabilityPct: Math.min(failureProb, 100),
    primaryTrigger,
  };
}

// 2. Rothermel Wildfire Spread Vector Simulation
export interface FireSpreadInput {
  originLat: number;
  originLng: number;
  fireRadiativePowerMw: number;
  windSpeedKmh: number;
  windDirectionDeg: number; // 0 = North, 90 = East, etc.
  terrainSlopeDeg: number;
  fuelDrynessPct: number;
  simulationHours?: number; // default 12 hours
}

export interface FireSpreadOutput {
  rateOfSpreadMPerHr: number;
  projectedAreaSqKm: number;
  perimeterKm: number;
  propagationEllipsePoints: [number, number][]; // [lng, lat]
  dangerDistanceKm: number;
}

export function computeWildfirePropagation(input: FireSpreadInput): FireSpreadOutput {
  const hours = input.simulationHours || 12;
  const baseRate = 80 + (input.fireRadiativePowerMw * 1.5) * (input.fuelDrynessPct / 100); // meters/hour

  // Wind multiplier Phi_W
  const windFactor = 1 + 0.045 * Math.pow(input.windSpeedKmh, 1.25);

  // Slope multiplier Phi_S
  const slopeFactor = 1 + 5.275 * Math.pow(Math.tan((input.terrainSlopeDeg * Math.PI) / 180), 2);

  const forwardRateMPerHr = baseRate * windFactor * slopeFactor;
  const forwardDistanceKm = (forwardRateMPerHr * hours) / 1000;
  const lateralDistanceKm = forwardDistanceKm * 0.45; // ellipse aspect ratio

  // Ellipse generation oriented along wind direction
  const pointsCount = 24;
  const windRad = (input.windDirectionDeg * Math.PI) / 180;
  const ellipsePoints: [number, number][] = [];

  // Conversion: ~111 km per degree latitude, ~100 km per degree longitude in India
  const kmToLat = 1 / 111.0;
  const kmToLng = 1 / (111.0 * Math.cos((input.originLat * Math.PI) / 180));

  for (let i = 0; i < pointsCount; i++) {
    const theta = (i / pointsCount) * 2 * Math.PI;
    const x = forwardDistanceKm * (0.6 + 0.4 * Math.cos(theta));
    const y = lateralDistanceKm * Math.sin(theta);

    // Rotate by wind direction
    const rotX = x * Math.sin(windRad) + y * Math.cos(windRad);
    const rotY = x * Math.cos(windRad) - y * Math.sin(windRad);

    ellipsePoints.push([
      Number((input.originLng + rotX * kmToLng).toFixed(5)),
      Number((input.originLat + rotY * kmToLat).toFixed(5)),
    ]);
  }
  // Close polygon
  if (ellipsePoints.length > 0) {
    ellipsePoints.push(ellipsePoints[0]);
  }

  const projectedAreaSqKm = Number((Math.PI * forwardDistanceKm * lateralDistanceKm).toFixed(2));
  const perimeterKm = Number((Math.PI * (3 * (forwardDistanceKm + lateralDistanceKm) - Math.sqrt((3 * forwardDistanceKm + lateralDistanceKm) * (forwardDistanceKm + 3 * lateralDistanceKm)))).toFixed(2));

  return {
    rateOfSpreadMPerHr: Math.round(forwardRateMPerHr),
    projectedAreaSqKm,
    perimeterKm,
    propagationEllipsePoints: ellipsePoints,
    dangerDistanceKm: Number(forwardDistanceKm.toFixed(2)),
  };
}

// 3. Coastal Storm Surge (SLOSH Parametric Model)
export interface StormSurgeInput {
  centralPressureHpa: number; // e.g. 940 hPa
  maxWindSpeedKmh: number; // e.g. 180 km/h
  coastalBathymetrySlope?: number; // Default 0.0015 for shallow Bay of Bengal
  cycloneCategory: number; // 1 to 5
}

export interface StormSurgeOutput {
  peakSurgeHeightMeters: number;
  inlandInundationDistanceKm: number;
  criticalCoastalDistrictsTier: 'MODERATE_SURGE' | 'DANGEROUS_SURGE' | 'CATASTROPHIC_SURGE';
}

export function computeCoastalStormSurge(input: StormSurgeInput): StormSurgeOutput {
  const deltaP = Math.max(1013.25 - input.centralPressureHpa, 0); // Pressure deficit
  const windMps = input.maxWindSpeedKmh / 3.6;

  // Pressure surge: ~1 cm per 1 hPa deficit
  const staticPressureSurgeM = (deltaP * 0.01);

  // Dynamic wind stress surge
  const dynamicWindSurgeM = 0.0035 * Math.pow(windMps, 1.6);

  // Total peak surge with shallow shelf amplification
  const peakSurgeHeightMeters = Number((staticPressureSurgeM + dynamicWindSurgeM).toFixed(2));

  // Penetration inland based on elevation gradient
  const inlandInundationDistanceKm = Number((peakSurgeHeightMeters * 1.85).toFixed(2));

  let criticalCoastalDistrictsTier: StormSurgeOutput['criticalCoastalDistrictsTier'] = 'MODERATE_SURGE';
  if (peakSurgeHeightMeters >= 4.0) {
    criticalCoastalDistrictsTier = 'CATASTROPHIC_SURGE';
  } else if (peakSurgeHeightMeters >= 2.2) {
    criticalCoastalDistrictsTier = 'DANGEROUS_SURGE';
  }

  return {
    peakSurgeHeightMeters,
    inlandInundationDistanceKm,
    criticalCoastalDistrictsTier,
  };
}

// 4. Flood Inundation & Dam Discharge Model
export interface FloodPhysicsInput {
  rainfall24hMm: number;
  damDischargeCusecs: number;
  riverStageAboveDangerM: number;
  baseBasinAreaSqKm?: number;
}

export interface FloodPhysicsOutput {
  inundatedAreaSqKm: number;
  floodWaterVolumeMillionCubicM: number;
  estimatedSeveredRoadsKm: number;
  submergedVillagesCount: number;
}

export function computeFloodInundation(input: FloodPhysicsInput): FloodPhysicsOutput {
  const rainContribution = Math.max(input.rainfall24hMm - 65, 0) * 1.4;
  const dischargeContribution = (input.damDischargeCusecs / 25000) * 8.5;
  const stageContribution = Math.max(input.riverStageAboveDangerM, 0) * 18.0;

  const rawArea = Math.max(rainContribution + dischargeContribution + stageContribution, 0);
  const inundatedAreaSqKm = Number(rawArea.toFixed(1));

  const floodWaterVolumeMillionCubicM = Number((inundatedAreaSqKm * 1.25 * 0.65).toFixed(1));
  const estimatedSeveredRoadsKm = Math.round(inundatedAreaSqKm * 0.42);
  const submergedVillagesCount = Math.round(inundatedAreaSqKm * 0.85);

  return {
    inundatedAreaSqKm,
    floodWaterVolumeMillionCubicM,
    estimatedSeveredRoadsKm,
    submergedVillagesCount,
  };
}
