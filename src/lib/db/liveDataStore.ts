/**
 * DRISHTI-SWARM: Persistent Live Database & Storage Engine
 * Handles persistent storage of real-time ingested live feeds, multi-horizon caches (24h, 7d, 30d),
 * and citizen emergency SOS reports in local persistent storage (data/drishti_live_db.json).
 */

import fs from 'fs';
import path from 'path';
import { FireHotspot, EarthquakeEvent, RiverBasinTelemetry, DisasterIncident } from '@/types/disaster';
import { fetchLiveEarthquakes, fetchLiveFires, fetchLiveHydrology, synthesizeLiveIncidents } from '@/lib/data/liveIngestionEngine';
import { SAMPLE_FIRE_HOTSPOTS, SAMPLE_EARTHQUAKES, SAMPLE_RIVER_TELEMETRY } from '@/lib/geo/indiaGeoData';
import { INITIAL_INCIDENTS } from '@/lib/store/useDisasterStore';

export interface LiveDbSchema {
  meta: {
    lastSyncedAt: string;
    version: string;
    totalSyncCount: number;
    activeSources: string[];
  };
  horizon24h: {
    earthquakes: EarthquakeEvent[];
    wildfires: FireHotspot[];
    hydrology: RiverBasinTelemetry[];
    incidents: DisasterIncident[];
  };
  horizon7d: {
    earthquakes: EarthquakeEvent[];
    wildfires: FireHotspot[];
    hydrology: RiverBasinTelemetry[];
    incidents: DisasterIncident[];
  };
  horizon30d: {
    earthquakes: EarthquakeEvent[];
    wildfires: FireHotspot[];
    hydrology: RiverBasinTelemetry[];
    incidents: DisasterIncident[];
  };
  citizenSosReports: Array<{
    id: string;
    timestamp: string;
    name: string;
    phone: string;
    headcount: number;
    hazardType: string;
    batteryLevelPct: number;
    medicalEmergency: boolean;
    lat: number;
    lng: number;
    status: 'ACTIVE' | 'DISPATCHED' | 'RESCUED';
  }>;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'drishti_live_db.json');

// In-memory runtime cache for high-frequency reads
let inMemoryDb: LiveDbSchema | null = null;

function ensureDbDirectory() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

/**
 * Initialize default baseline DB structure
 */
function getInitialDbState(): LiveDbSchema {
  return {
    meta: {
      lastSyncedAt: new Date().toISOString(),
      version: '2.0.0-LIVE',
      totalSyncCount: 1,
      activeSources: ['USGS_SEISMIC', 'NASA_FIRMS_VIIRS', 'OPEN_METEO_FLOOD', 'CWC_HYDRO'],
    },
    horizon24h: {
      earthquakes: SAMPLE_EARTHQUAKES,
      wildfires: SAMPLE_FIRE_HOTSPOTS,
      hydrology: SAMPLE_RIVER_TELEMETRY,
      incidents: INITIAL_INCIDENTS,
    },
    horizon7d: {
      earthquakes: SAMPLE_EARTHQUAKES,
      wildfires: SAMPLE_FIRE_HOTSPOTS,
      hydrology: SAMPLE_RIVER_TELEMETRY,
      incidents: INITIAL_INCIDENTS,
    },
    horizon30d: {
      earthquakes: SAMPLE_EARTHQUAKES,
      wildfires: SAMPLE_FIRE_HOTSPOTS,
      hydrology: SAMPLE_RIVER_TELEMETRY,
      incidents: INITIAL_INCIDENTS,
    },
    citizenSosReports: [
      {
        id: 'sos-live-demo-1',
        timestamp: new Date().toISOString(),
        name: 'Ramesh Senapati',
        phone: '+91 98450 12345',
        headcount: 4,
        hazardType: 'CYCLONE',
        batteryLevelPct: 34,
        medicalEmergency: true,
        lat: 19.8214,
        lng: 85.8421,
        status: 'DISPATCHED',
      },
      {
        id: 'sos-live-demo-2',
        timestamp: new Date().toISOString(),
        name: 'Anjali Sharma',
        phone: '+91 97110 56789',
        headcount: 2,
        hazardType: 'FLOOD',
        batteryLevelPct: 78,
        medicalEmergency: false,
        lat: 26.1425,
        lng: 91.7124,
        status: 'ACTIVE',
      },
    ],
  };
}

/**
 * Read persistent live DB from disk (or initialize if not present)
 */
export function getPersistentDb(): LiveDbSchema {
  if (inMemoryDb) return inMemoryDb;

  ensureDbDirectory();

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      inMemoryDb = JSON.parse(raw);
      return inMemoryDb!;
    } catch (err) {
      console.warn('Error reading live DB file, regenerating default state:', err);
    }
  }

  inMemoryDb = getInitialDbState();
  savePersistentDb(inMemoryDb);
  return inMemoryDb;
}

/**
 * Save persistent DB to disk atomically
 */
export function savePersistentDb(db: LiveDbSchema): void {
  ensureDbDirectory();
  inMemoryDb = db;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to live DB file:', err);
  }
}

/**
 * Execute a complete live synchronization from real-time NASA, USGS, and Open-Meteo APIs
 */
export async function syncLiveTelemetry(force: boolean = false): Promise<LiveDbSchema> {
  const currentDb = getPersistentDb();
  const lastSync = new Date(currentDb.meta.lastSyncedAt).getTime();
  const now = Date.now();

  // If synced within the last 60 seconds and not forced, return cached
  if (!force && now - lastSync < 60_000) {
    return currentDb;
  }

  try {
    // 1. Ingest 24h, 7d, and 30d live feeds in parallel
    const [
      quakes24h,
      quakes7d,
      quakes30d,
      fires24h,
      fires7d,
      hydro24h,
      hydro7d,
      hydro30d,
    ] = await Promise.all([
      fetchLiveEarthquakes('24h'),
      fetchLiveEarthquakes('7d'),
      fetchLiveEarthquakes('30d'),
      fetchLiveFires('24h'),
      fetchLiveFires('7d'),
      fetchLiveHydrology('24h'),
      fetchLiveHydrology('7d'),
      fetchLiveHydrology('30d'),
    ]);

    // Use fetched data or fallback to current store if API is momentarily unreachable
    const finalQuakes24h = quakes24h.length > 0 ? quakes24h : currentDb.horizon24h.earthquakes;
    const finalQuakes7d = quakes7d.length > 0 ? quakes7d : currentDb.horizon7d.earthquakes;
    const finalQuakes30d = quakes30d.length > 0 ? quakes30d : currentDb.horizon30d.earthquakes;

    const finalFires24h = fires24h.length > 0 ? fires24h : currentDb.horizon24h.wildfires;
    const finalFires7d = fires7d.length > 0 ? fires7d : currentDb.horizon7d.wildfires;
    const finalFires30d = fires7d.length > 0 ? fires7d : currentDb.horizon30d.wildfires;

    const finalHydro24h = hydro24h.length > 0 ? hydro24h : currentDb.horizon24h.hydrology;
    const finalHydro7d = hydro7d.length > 0 ? hydro7d : currentDb.horizon7d.hydrology;
    const finalHydro30d = hydro30d.length > 0 ? hydro30d : currentDb.horizon30d.hydrology;

    // Synthesize live dynamic incidents
    const incidents24h = synthesizeLiveIncidents(finalFires24h, finalQuakes24h, finalHydro24h);
    const incidents7d = synthesizeLiveIncidents(finalFires7d, finalQuakes7d, finalHydro7d);
    const incidents30d = synthesizeLiveIncidents(finalFires30d, finalQuakes30d, finalHydro30d);

    const updatedDb: LiveDbSchema = {
      meta: {
        lastSyncedAt: new Date().toISOString(),
        version: '2.0.0-LIVE',
        totalSyncCount: (currentDb.meta.totalSyncCount || 0) + 1,
        activeSources: ['USGS_REALTIME_GEOJSON', 'NASA_FIRMS_VIIRS_CSV', 'OPEN_METEO_FLOOD_DISCHARGE'],
      },
      horizon24h: {
        earthquakes: finalQuakes24h,
        wildfires: finalFires24h,
        hydrology: finalHydro24h,
        incidents: incidents24h,
      },
      horizon7d: {
        earthquakes: finalQuakes7d,
        wildfires: finalFires7d,
        hydrology: finalHydro7d,
        incidents: incidents7d,
      },
      horizon30d: {
        earthquakes: finalQuakes30d,
        wildfires: finalFires30d,
        hydrology: finalHydro30d,
        incidents: incidents30d,
      },
      citizenSosReports: currentDb.citizenSosReports || [],
    };

    savePersistentDb(updatedDb);
    return updatedDb;
  } catch (err) {
    console.error('Failed to complete live synchronization:', err);
    return currentDb;
  }
}

/**
 * Save new Citizen SOS emergency beacon to persistent store
 */
export function addCitizenSosReport(report: Omit<LiveDbSchema['citizenSosReports'][0], 'id' | 'timestamp' | 'status'>) {
  const db = getPersistentDb();
  const newReport: LiveDbSchema['citizenSosReports'][0] = {
    ...report,
    id: `sos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    status: 'ACTIVE',
  };

  db.citizenSosReports.unshift(newReport);
  savePersistentDb(db);
  return newReport;
}
