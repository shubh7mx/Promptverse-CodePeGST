import { NextResponse } from 'next/server';
import { SAMPLE_EARTHQUAKES } from '@/lib/geo/indiaGeoData';

export async function GET() {
  try {
    // Live USGS 2.5+ earthquake feed
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.features && Array.isArray(data.features)) {
        // Filter for South Asia bounding box: [68.0, 6.0, 97.5, 37.5]
        const regionalEvents = data.features
          .filter((f: any) => {
            const [lon, lat] = f.geometry.coordinates;
            return lon >= 68.0 && lon <= 97.5 && lat >= 6.0 && lat <= 37.5;
          })
          .map((f: any) => ({
            id: f.id,
            place: f.properties.place,
            magnitude: f.properties.mag,
            depthKm: f.geometry.coordinates[2],
            coordinates: {
              lat: f.geometry.coordinates[1],
              lng: f.geometry.coordinates[0],
            },
            time: f.properties.time,
            alert: f.properties.alert,
            tsunami: f.properties.tsunami,
            feltReports: f.properties.felt,
            faultZone: 'Regional Seismotectonic Belt',
          }));

        if (regionalEvents.length > 0) {
          return NextResponse.json(regionalEvents);
        }
      }
    }
  } catch (err) {
    console.warn('USGS live fetch failed, returning fallback seismic records:', err);
  }

  // Fail-safe baseline earthquakes
  return NextResponse.json(SAMPLE_EARTHQUAKES);
}
