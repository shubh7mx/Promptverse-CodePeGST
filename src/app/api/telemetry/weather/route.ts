import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') || '21.0';
  const lng = searchParams.get('lng') || '80.0';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=precipitation,wind_speed_10m,relative_humidity_2m,soil_moisture_0_to_1cm&current=temperature_2m,precipitation,wind_speed_10m&forecast_days=3&timezone=Asia%2FKolkata`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.warn('Live weather fetch failed, returning fallback telemetry:', err);
  }

  // Resilient fallback payload
  return NextResponse.json({
    current: {
      temperature_2m: 29.4,
      precipitation: 14.2,
      wind_speed_10m: 38.5,
    },
    hourly: {
      precipitation: [12, 18, 25, 42, 65, 80, 72, 45],
      wind_speed_10m: [25, 30, 45, 65, 95, 120, 110, 85],
    },
    elevation: 48,
    timezone: 'Asia/Kolkata',
  });
}
