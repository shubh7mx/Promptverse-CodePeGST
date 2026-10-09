import { NextResponse } from 'next/server';
import { SAMPLE_RIVER_TELEMETRY } from '@/lib/geo/indiaGeoData';

export async function GET() {
  return NextResponse.json(SAMPLE_RIVER_TELEMETRY);
}
