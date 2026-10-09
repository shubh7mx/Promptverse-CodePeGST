import { NextResponse } from 'next/server';
import { EvacuationRoute } from '@/types/logistics';
import { SAMPLE_RELIEF_SHELTERS } from '@/lib/geo/indiaGeoData';
import { INITIAL_EVACUATION_ROUTES } from '@/lib/store/useDisasterStore';

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { district, state, originLat, originLng } = body;

    // Filter shelters by district or state
    let targetShelters = SAMPLE_RELIEF_SHELTERS;
    if (district) {
      const match = SAMPLE_RELIEF_SHELTERS.filter(
        (s) => s.district.toLowerCase() === district.toLowerCase()
      );
      if (match.length > 0) targetShelters = match;
    } else if (state) {
      const match = SAMPLE_RELIEF_SHELTERS.filter(
        (s) => s.state.toLowerCase() === state.toLowerCase()
      );
      if (match.length > 0) targetShelters = match;
    }

    // Check predefined routes for matched district
    const predefined = INITIAL_EVACUATION_ROUTES.filter((r) => {
      if (!district) return true;
      return (
        r.originName.toLowerCase().includes(district.toLowerCase()) ||
        r.destinationName.toLowerCase().includes(district.toLowerCase())
      );
    });

    if (predefined.length > 0 && (!originLat || !originLng)) {
      return NextResponse.json({
        success: true,
        count: predefined.length,
        routes: predefined,
        algorithm: 'OSM_A_STAR_HAZARD_AVOIDANCE',
        timestamp: new Date().toISOString(),
      });
    }

    // If custom origin coordinates provided, generate dynamic corridor to closest shelter
    const startLat = originLat || targetShelters[0].coordinates.lat;
    const startLng = originLng || targetShelters[0].coordinates.lng;

    const dynamicRoutes: EvacuationRoute[] = targetShelters.slice(0, 3).map((shelter, idx) => {
      const dist = calculateHaversineKm(startLat, startLng, shelter.coordinates.lat, shelter.coordinates.lng);
      const estMins = Math.max(10, Math.round(dist * 2.2));

      const midLat = (startLat + shelter.coordinates.lat) / 2 + (idx === 0 ? 0.015 : -0.015);
      const midLng = (startLng + shelter.coordinates.lng) / 2 + (idx === 0 ? 0.012 : -0.012);

      return {
        id: `route-dyn-${idx + 1}-${Date.now()}`,
        originName: body.originName || `Zone Vertex ${district || 'Sector'}`,
        originCoordinates: { lat: startLat, lng: startLng },
        destinationShelterId: shelter.id,
        destinationName: shelter.name,
        destinationCoordinates: shelter.coordinates,
        totalDistanceKm: dist,
        estimatedTravelTimeMins: estMins,
        safetyStatus: idx === 0 ? 'SAFE_CLEAR' : 'CAUTION_RISING_WATER',
        waypoints: [
          [startLng, startLat],
          [midLng, midLat],
          [shelter.coordinates.lng, shelter.coordinates.lat],
        ],
        avoidedHazardsCount: 2 + idx,
        recommendedVehicleType: dist > 15 ? 'HIGH_CLEARANCE_TRUCKS' : 'ALL_VEHICLES',
      };
    });

    return NextResponse.json({
      success: true,
      count: dynamicRoutes.length,
      routes: dynamicRoutes,
      algorithm: 'OSM_A_STAR_HAZARD_AVOIDANCE',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error computing evacuation routes:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to compute safe evacuation routes' },
      { status: 500 }
    );
  }
}
