'use client';

import React from 'react';
import { ThreatScanner } from '@/components/citizen/ThreatScanner';
import { MultilingualVoiceCard } from '@/components/citizen/MultilingualVoiceCard';
import { SosBeacon } from '@/components/citizen/SosBeacon';
import { ShelterFinder } from '@/components/citizen/ShelterFinder';
import { HeartHandshake, ShieldCheck, Radio, PhoneCall } from 'lucide-react';

export default function CitizenHubPage() {
  return (
    <div className="min-h-[calc(100vh-3.25rem)] w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-cyan-400" />
            <h1 className="text-lg font-bold uppercase tracking-wider text-slate-100">
              Citizen Emergency SOS & Multilingual Safety Portal
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            One-tap GPS risk assessment, priority emergency beacons, verified shelters, and 10+ regional language audio advisories.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-mono font-bold text-emerald-300">
          <PhoneCall className="h-4 w-4" />
          <span>National Emergency: 112 / 1078</span>
        </div>
      </div>

      {/* 1. Geofenced Threat Scanner */}
      <ThreatScanner />

      {/* 2. Split Row: Multilingual Voice Hub & Emergency SOS Beacon */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MultilingualVoiceCard />
        </div>
        <div className="lg:col-span-5">
          <SosBeacon />
        </div>
      </div>

      {/* 3. Verified Open Shelters Directory */}
      <ShelterFinder />
    </div>
  );
}
