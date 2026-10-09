import { NextResponse } from 'next/server';
import { SAMPLE_RELIEF_SHELTERS } from '@/lib/geo/indiaGeoData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');

  let shelters = SAMPLE_RELIEF_SHELTERS;
  if (district) {
    shelters = shelters.filter(
      (s) => s.district.toLowerCase() === district.toLowerCase()
    );
    if (shelters.length === 0) {
      shelters = SAMPLE_RELIEF_SHELTERS;
    }
  }

  return NextResponse.json(shelters);
}
