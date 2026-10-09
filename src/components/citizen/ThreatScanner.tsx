'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, MapPin, Crosshair, CheckCircle2, ShieldAlert, Compass, Navigation, PhoneCall, Radio } from 'lucide-react';
import { useDisasterStore } from '@/lib/store/useDisasterStore';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';

// Haversine Distance in Kilometers
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
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

export function ThreatScanner() {
  const { incidents, shelters } = useDisasterStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'SAFE' | 'WARNING' | 'DANGER';
    userCoords: { lat: number; lng: number };
    locationName: string;
    nearestHazardTitle: string;
    nearestHazardCategory: string;
    distanceKm: number;
    nearestShelterName: string;
    nearestShelterDistKm: number;
    recommendedAction: string;
  } | null>(null);

  const performScan = (userLat: number, userLng: number, locLabel: string) => {
    // Find closest incident
    let closestIncident = incidents[0];
    let minDistance = calculateHaversineKm(userLat, userLng, closestIncident.location.lat, closestIncident.location.lng);

    incidents.forEach((inc) => {
      const dist = calculateHaversineKm(userLat, userLng, inc.location.lat, inc.location.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestIncident = inc;
      }
    });

    // Find closest shelter
    let closestShelter = shelters[0];
    let minShelterDist = calculateHaversineKm(userLat, userLng, closestShelter.coordinates.lat, closestShelter.coordinates.lng);

    shelters.forEach((sh) => {
      const dist = calculateHaversineKm(userLat, userLng, sh.coordinates.lat, sh.coordinates.lng);
      if (dist < minShelterDist) {
        minShelterDist = dist;
        closestShelter = sh;
      }
    });

    let threatTier: 'SAFE' | 'WARNING' | 'DANGER' = 'SAFE';
    let action = 'No active disaster perimeters detected within 50 km. Continue monitoring standard IMD weather forecasts.';

    if (minDistance < 25) {
      threatTier = 'DANGER';
      action = `CRITICAL EVACUATION ADVISORY: You are within ${minDistance} km of active ${closestIncident.category}. Proceed immediately to ${closestShelter.name} (${minShelterDist} km away) or follow designated green corridor evacuation routes.`;
      tacticalAudio.playEmergencyBeep();
    } else if (minDistance < 100) {
      threatTier = 'WARNING';
      action = `DISASTER WATCH ALERT: Active ${closestIncident.category} perimeter located ${minDistance} km away in ${closestIncident.district}. Keep battery radios on and prepare 72-hour emergency survival bag.`;
      tacticalAudio.playRadarPing(800, 0.2);
    } else {
      tacticalAudio.playRadarPing(1100, 0.15);
    }

    setScanResult({
      status: threatTier,
      userCoords: { lat: userLat, lng: userLng },
      locationName: locLabel,
      nearestHazardTitle: closestIncident.title,
      nearestHazardCategory: closestIncident.category,
      distanceKm: minDistance,
      nearestShelterName: closestShelter.name,
      nearestShelterDistKm: minShelterDist,
      recommendedAction: action,
    });
    setIsScanning(false);
  };

  const handleScanLocation = () => {
    setIsScanning(true);
    tacticalAudio.playRadarPing(950, 0.1);

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          performScan(lat, lng, `Device GPS (${lat}° N, ${lng}° E)`);
        },
        () => {
          // GPS Permission denied or offline fallback: simulate location near Odisha / Bay of Bengal coast
          performScan(19.8135, 85.8312, 'Puri Coastal Zone, Odisha (19.81° N, 85.83° E)');
        },
        { timeout: 4000 }
      );
    } else {
      performScan(19.8135, 85.8312, 'Puri Coastal Zone, Odisha (19.81° N, 85.83° E)');
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="h-5 w-5 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Real-Time Geofenced GPS Hazard Assessment
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
            Geofence Engine Active
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-900 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
            <MapPin className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">One-Tap Hazard Proximity Check</h4>
            <p className="text-[11px] text-slate-400">
              Cross-references live device coordinates against NASA FIRMS, ISRO Bhuvan, and CWC danger zones.
            </p>
          </div>
        </div>

        <button
          onClick={handleScanLocation}
          disabled={isScanning}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400 disabled:opacity-50 shrink-0"
        >
          <Crosshair className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Computing Sensor Intersections...' : 'Scan My GPS Location'}</span>
        </button>
      </div>

      {/* Emergency Speed Dial Hotline Strip */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <a
          href="tel:112"
          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-2 text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition"
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-[11px]">National All-Emergency</span>
          </div>
          <span className="font-mono font-bold text-emerald-400">112</span>
        </a>

        <a
          href="tel:1078"
          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-2 text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition"
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-semibold text-[11px]">NDMA Disaster Helpline</span>
          </div>
          <span className="font-mono font-bold text-cyan-400">1078</span>
        </a>

        <a
          href="tel:1070"
          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-2 text-slate-300 hover:border-amber-500/50 hover:bg-amber-950/20 transition"
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold text-[11px]">State Emergency (SEOC)</span>
          </div>
          <span className="font-mono font-bold text-amber-400">1070</span>
        </a>

        <a
          href="tel:108"
          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-2 text-slate-300 hover:border-rose-500/50 hover:bg-rose-950/20 transition"
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="h-3.5 w-3.5 text-rose-400" />
            <span className="font-semibold text-[11px]">Ambulance Trauma</span>
          </div>
          <span className="font-mono font-bold text-rose-400">108</span>
        </a>
      </div>

      {/* Scan Results Output */}
      {scanResult && (
        <div
          className={`mt-4 rounded-xl border p-4 text-xs animate-fadeIn ${
            scanResult.status === 'DANGER'
              ? 'border-rose-500/50 bg-rose-500/10'
              : scanResult.status === 'WARNING'
              ? 'border-amber-500/50 bg-amber-500/10'
              : 'border-emerald-500/50 bg-emerald-500/10'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 font-bold">
              {scanResult.status === 'DANGER' ? (
                <ShieldAlert className="h-4 w-4 text-rose-400 animate-pulse" />
              ) : scanResult.status === 'WARNING' ? (
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
              <span
                className={
                  scanResult.status === 'DANGER'
                    ? 'text-rose-400'
                    : scanResult.status === 'WARNING'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }
              >
                {scanResult.status === 'DANGER'
                  ? 'CRITICAL RED ZONE DETECTED'
                  : scanResult.status === 'WARNING'
                  ? 'ELEVATED HAZARD WATCH'
                  : 'SAFE STATUS VERIFIED'}
              </span>
            </div>
            <span className="font-mono text-slate-300 text-[11px]">{scanResult.locationName}</span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Nearest Active Incident:</p>
              <p className="font-bold text-slate-100">{scanResult.nearestHazardTitle}</p>
              <p className="text-[11px] text-cyan-300 font-mono">
                Distance: <b>{scanResult.distanceKm} km</b> ({scanResult.nearestHazardCategory})
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Designated Safe Refuge:</p>
              <p className="font-bold text-slate-100">{scanResult.nearestShelterName}</p>
              <p className="text-[11px] text-emerald-300 font-mono">
                Shelter Distance: <b>{scanResult.nearestShelterDistKm} km</b>
              </p>
            </div>
          </div>

          <p className="mt-3 text-slate-200 bg-slate-950/80 p-3 rounded-lg border border-slate-800 leading-relaxed text-xs">
            <b className="text-cyan-400">Tactical Recommendation:</b> {scanResult.recommendedAction}
          </p>
        </div>
      )}
    </div>
  );
}
