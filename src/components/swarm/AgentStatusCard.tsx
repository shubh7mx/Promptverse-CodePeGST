'use client';

import React from 'react';
import {
  ShieldAlert,
  Waves,
  Flame,
  Wind,
  Mountain,
  MapPin,
  Truck,
  Radio,
  Activity,
  CheckCircle2,
  Cpu,
  Clock,
  Zap,
  Layers,
  Terminal,
  BarChart3
} from 'lucide-react';
import { useSwarmStore } from '@/lib/store/useSwarmStore';
import { AgentRole } from '@/types/swarm';

export function AgentStatusCard() {
  const { agents, selectedAgentId, setSelectedAgentId, isDeliberating } = useSwarmStore();

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const getAgentIcon = (id: AgentRole) => {
    switch (id) {
      case 'master_commander': return ShieldAlert;
      case 'flood_sentinel': return Waves;
      case 'wildfire_sentinel': return Flame;
      case 'cyclone_sentinel': return Wind;
      case 'geohazard_sentinel': return Mountain;
      case 'evacuation_router': return MapPin;
      case 'logistics_optimizer': return Truck;
      case 'multilingual_broadcast': return Radio;
      default: return Activity;
    }
  };

  const IconComponent = getAgentIcon(selectedAgent.id);

  // Agent Domain Capabilities & Physics Models
  const domainCapabilities: Record<AgentRole, { models: string[]; inputs: string[]; outputFormat: string; updateFreq: string }> = {
    master_commander: {
      models: ['Blackboard Consensus Bus', 'NDMA Tri-Service Orchestrator', 'Heuristic Threat Fusion'],
      inputs: ['Multi-Sentinel Telemetry', 'Satellite Feeds', 'SDMA Direct Alerts'],
      outputFormat: 'Composite Threat Level & NDMA Action Playbook',
      updateFreq: 'Continuous (100ms)',
    },
    flood_sentinel: {
      models: ['2D DEM Bathtub Inundation', 'CWC Hydrograph Stage Curve', 'Open-Meteo Rain Radar'],
      inputs: ['11 CWC River Gauges', 'IMD 24h Precipitation Grid'],
      outputFormat: 'Submerged Area (sq km) & Embankment Breach Vectors',
      updateFreq: 'Every 5 mins',
    },
    wildfire_sentinel: {
      models: ['Rothermel Fire Spread Vector', 'Fire Radiative Power (FRP) Clustering', 'Slope-Wind Acceleration'],
      inputs: ['NASA FIRMS MODIS/VIIRS Hotspots', 'Surface Wind Vectors'],
      outputFormat: '6h/12h/24h Fire Propagation Ellipse & Buffer Zones',
      updateFreq: 'Every 15 mins (Satellite Pass)',
    },
    cyclone_sentinel: {
      models: ['SLOSH Coastal Storm Surge Model', 'JTWC & IMD Track Prediction', 'Barometric Pressure Drop Index'],
      inputs: ['INCOIS Marine Buoys', 'IMD Radar Coastal Doppler'],
      outputFormat: 'Landfall Trajectory & Coastal Penetration Depth (m)',
      updateFreq: 'Every 10 mins',
    },
    geohazard_sentinel: {
      models: ['Landslide Saturation Index (LSI)', 'USGS Fault Line Proximity', 'Antecedent Soil Moisture Saturation'],
      inputs: ['USGS Seismology Feed', 'ISRO Landslide Hazard Zonation'],
      outputFormat: 'Debris Flow Risk Index & Critical Slope Warning',
      updateFreq: 'Continuous / Rain-Triggered',
    },
    evacuation_router: {
      models: ['OSM A* Hazard Avoidance Pathfinder', 'Voronoi Shelter Partitioning', 'Infrastructure Capacity Graph'],
      inputs: ['OpenStreetMap Road Grid', 'Hazard Perimeters', 'Relief Shelter Matrix'],
      outputFormat: 'Obstacle-Free Green Corridors & Waypoint GeoJSON',
      updateFreq: 'Dynamic on Threat Change',
    },
    logistics_optimizer: {
      models: ['Capacitated Vehicle Routing (CVRP)', '16 NDRF Battalion Readiness Matrix', 'NDMA Quota Math'],
      inputs: ['Target Population Demographics', 'Road Distance Matrix'],
      outputFormat: 'Battalion Dispatch Quotas, Boats & Rations Breakdown',
      updateFreq: 'On Deliberation Dispatch',
    },
    multilingual_broadcast: {
      models: ['CAP-CP Emergency Protocol Engine', '10+ Indian Regional Translators', 'Web Speech TTS Synthesizer'],
      inputs: ['Deliberation Output Consensus', 'District Vulnerability Dossier'],
      outputFormat: 'Localized Text Bulletins & Audio Voice Streams',
      updateFreq: 'Real-Time Dispatch',
    },
  };

  const capabilities = domainCapabilities[selectedAgent.id] || domainCapabilities.master_commander;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">{selectedAgent.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                selectedAgent.status === 'REASONING' || selectedAgent.status === 'ANALYZING'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                  : selectedAgent.status === 'CONSENSUS_REACHED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {selectedAgent.status}
              </span>
            </div>
            <p className="text-xs text-cyan-400 font-mono mt-0.5">{selectedAgent.roleTitle}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-mono">Agent ID:</span>
          <span className="font-mono text-xs font-bold text-slate-300">@{selectedAgent.id}</span>
        </div>
      </div>

      {/* Health & Confidence KPIs */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Health</span>
          </div>
          <p className="font-mono text-base font-bold text-cyan-300">
            {selectedAgent.healthPercent}%
          </p>
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${selectedAgent.healthPercent}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Confidence</span>
          </div>
          <p className="font-mono text-base font-bold text-emerald-300">
            {selectedAgent.confidenceScore}%
          </p>
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedAgent.confidenceScore}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Clock className="h-3.5 w-3.5 text-purple-400" />
            <span>Telemetry Events</span>
          </div>
          <p className="font-mono text-base font-bold text-purple-300">
            {selectedAgent.processedEventsCount}
          </p>
          <p className="text-[9px] text-slate-500 font-mono mt-1">processed total</p>
        </div>
      </div>

      {/* Current Task Status */}
      <div className="mt-4 rounded-xl border border-slate-900 bg-slate-900/40 p-3 text-xs">
        <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Active Mission:</span>
        <p className="font-semibold text-slate-200 mt-1 flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-cyan-400 shrink-0 animate-pulse" />
          <span>{selectedAgent.currentTask}</span>
        </p>
      </div>

      {/* Domain Models & Ingestion Pipeline */}
      <div className="mt-4 space-y-2 text-xs">
        <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>Active Physics & Heuristic Models:</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {capabilities.models.map((model, idx) => (
            <span
              key={idx}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-mono text-slate-300"
            >
              {model}
            </span>
          ))}
        </div>
      </div>

      {/* Inputs & Outputs Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-500 block">Ingested Telemetry Feeds:</span>
          <ul className="mt-1 space-y-0.5 text-[11px] text-slate-300 list-disc list-inside">
            {capabilities.inputs.map((inp, idx) => (
              <li key={idx}>{inp}</li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono text-slate-500 block">Output Signal Schema:</span>
          <p className="mt-1 text-[11px] text-slate-200 font-medium">
            {capabilities.outputFormat}
          </p>
          <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
            Sampling Cadence: {capabilities.updateFreq}
          </span>
        </div>
      </div>
    </div>
  );
}
