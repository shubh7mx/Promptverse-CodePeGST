import { NextResponse } from 'next/server';
import { getPersistentDb, syncLiveTelemetry } from '@/lib/db/liveDataStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const horizon = (searchParams.get('horizon') as '24h' | '7d' | '30d') || '24h';
  const forceSync = searchParams.get('sync') === 'true';

  try {
    let db;
    if (forceSync) {
      db = await syncLiveTelemetry(true);
    } else {
      db = getPersistentDb();
      // Trigger background sync if last sync was > 2 minutes ago
      const lastSyncTime = new Date(db.meta.lastSyncedAt).getTime();
      if (Date.now() - lastSyncTime > 120_000) {
        syncLiveTelemetry(false).catch(console.error);
      }
    }

    const horizonData =
      horizon === '30d'
        ? db.horizon30d
        : horizon === '7d'
        ? db.horizon7d
        : db.horizon24h;

    return NextResponse.json({
      success: true,
      meta: db.meta,
      horizon,
      data: {
        earthquakes: horizonData.earthquakes,
        wildfires: horizonData.wildfires,
        hydrology: horizonData.hydrology,
        incidents: horizonData.incidents,
        citizenSos: db.citizenSosReports,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/telemetry/live:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch live telemetry',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const updatedDb = await syncLiveTelemetry(true);
    return NextResponse.json({
      success: true,
      message: 'Live telemetry synchronized successfully from official NASA, USGS, and Open-Meteo feeds',
      meta: updatedDb.meta,
      stats: {
        earthquakesCount24h: updatedDb.horizon24h.earthquakes.length,
        wildfiresCount24h: updatedDb.horizon24h.wildfires.length,
        hydrologyCount24h: updatedDb.horizon24h.hydrology.length,
        incidentsCount24h: updatedDb.horizon24h.incidents.length,
        earthquakesCount7d: updatedDb.horizon7d.earthquakes.length,
        wildfiresCount7d: updatedDb.horizon7d.wildfires.length,
      },
    });
  } catch (err: any) {
    console.error('Error syncing live telemetry:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to sync live telemetry' },
      { status: 500 }
    );
  }
}
