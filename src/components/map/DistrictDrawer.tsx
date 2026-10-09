'use client';

import React from 'react';
import {
  X,
  ShieldAlert,
  Users,
  Building2,
  ShieldCheck,
  Truck,
  Flame,
  Waves,
  Wind,
  Mountain,
  Activity,
  Cpu,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useDisasterStore } from '@/lib/store/useDisasterStore';
import { useSwarmStore } from '@/lib/store/useSwarmStore';
import { DisasterIncident } from '@/types/disaster';
import { formatNumber } from '@/lib/utils/formatters';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';

export function DistrictDrawer() {
  const { selectedDistrict, setSelectedDistrict, incidents } = useDisasterStore();
  const { triggerSwarmForIncident, isDeliberating } = useSwarmStore();

  if (!selectedDistrict) return null;

  const relevantIncident =
    incidents.find(
      (i) => i.district.toLowerCase() === selectedDistrict.districtName.toLowerCase()
    ) || incidents[0];

  const threatIcons = {
    FLOOD: Waves,
    WILDFIRE: Flame,
    CYCLONE: Wind,
    LANDSLIDE: Mountain,
    EARTHQUAKE: Activity,
    DROUGHT: ShieldAlert,
    COMPOUND: ShieldAlert,
  };

  const ThreatIconComponent = threatIcons[selectedDistrict.dominantThreat] || ShieldAlert;

  const handleDispatchSwarm = () => {
    tacticalAudio.playEmergencyBeep();
    const syntheticIncident: DisasterIncident = relevantIncident || {
      id: `inc-district-${selectedDistrict.districtName}`,
      category: selectedDistrict.dominantThreat,
      title: `${selectedDistrict.dominantThreat} Crisis in ${selectedDistrict.districtName}`,
      state: selectedDistrict.state,
      district: selectedDistrict.districtName,
      location: selectedDistrict.center,
      severity: selectedDistrict.activeAlert,
      source: 'ISRO_BHUVAN',
      timestamp: 'Just now',
      metrics: {
        riskScore: selectedDistrict.overallVulnerabilityScore,
        confidence: 96,
        affectedPopulationEst: Math.round(selectedDistrict.population * 0.15),
      },
      details: `Critical multi-hazard vulnerability index (${selectedDistrict.overallVulnerabilityScore}/100) identified in ${selectedDistrict.districtName}, ${selectedDistrict.state}. Swarm mobilization launched.`,
    };

    triggerSwarmForIncident(syntheticIncident);
  };

  const alertBadgeColors = {
    RED: 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse',
    ORANGE: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    YELLOW: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    GREEN: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
  }[selectedDistrict.activeAlert] || 'bg-slate-800 text-slate-300';

  return (
    <aside className="absolute right-4 top-3.5 bottom-4 z-30 w-80 sm:w-96 rounded-2xl border border-white/10 bg-slate-950/95 p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-y-auto animate-fadeIn">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <ThreatIconComponent className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-100">{selectedDistrict.districtName}</h3>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${alertBadgeColors}`}>
                {selectedDistrict.activeAlert}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{selectedDistrict.state} · Risk Dossier</p>
          </div>
        </div>

        <button
          onClick={() => {
            tacticalAudio.playRadarPing(600, 0.08);
            setSelectedDistrict(null);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 transition"
          title="Close Dossier"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Vulnerability Score Card */}
      <div className="mt-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Vulnerability Index</span>
          <span className="font-mono text-base font-bold text-rose-400">
            {selectedDistrict.overallVulnerabilityScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-700"
            style={{ width: `${selectedDistrict.overallVulnerabilityScore}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Primary: <b className="text-slate-200">{selectedDistrict.dominantThreat}</b></span>
          <span className="text-cyan-400">ISRO Tier-1</span>
        </div>
      </div>

      {/* Key Demographics & Infrastructure Grid */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px]">Population</span>
          </div>
          <p className="font-mono text-sm font-bold text-slate-100">
            {formatNumber(selectedDistrict.population)}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Building2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px]">Hospitals</span>
          </div>
          <p className="font-mono text-sm font-bold text-emerald-300">
            {selectedDistrict.hospitalsCount} units
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px]">Shelters</span>
          </div>
          <p className="font-mono text-sm font-bold text-amber-300">
            {selectedDistrict.sheltersCount} centers
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Truck className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-[11px]">First Responders</span>
          </div>
          <p className="font-mono text-sm font-bold text-purple-300">
            {selectedDistrict.policeStationsCount + selectedDistrict.fireStationsCount} stations
          </p>
        </div>
      </div>

      {/* Assigned Emergency Task Force */}
      <div className="mt-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
          <Truck className="h-3.5 w-3.5 text-cyan-400" />
          <span>Assigned NDRF Battalion:</span>
        </div>
        <p className="font-mono text-cyan-300 font-bold mt-1 text-[11px] leading-snug">
          {selectedDistrict.ndrfBattalionAssigned}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Historical Incident Handled: {selectedDistrict.historicalEventsCount} disaster cycles
        </p>
      </div>

      {/* Swarm Dispatch Action Button */}
      <div className="mt-4 border-t border-white/[0.08] pt-3">
        <button
          onClick={handleDispatchSwarm}
          disabled={isDeliberating}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 px-4 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {isDeliberating ? <Cpu className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4 animate-pulse" />}
          <span>{isDeliberating ? 'Swarm Deliberating...' : `Mobilize AI Swarm to ${selectedDistrict.districtName}`}</span>
        </button>
      </div>
    </aside>
  );
}
