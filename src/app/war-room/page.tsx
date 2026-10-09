'use client';

import React from 'react';
import { SwarmVisualizer } from '@/components/swarm/SwarmVisualizer';
import { AgentTerminal } from '@/components/swarm/AgentTerminal';
import { AgentStatusCard } from '@/components/swarm/AgentStatusCard';
import { useSwarmStore } from '@/lib/store/useSwarmStore';
import { useDisasterStore } from '@/lib/store/useDisasterStore';
import { ShieldAlert, Cpu, Activity, Play, CheckCircle2, AlertTriangle, MessageSquareCode } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';

export default function SwarmWarRoomPage() {
  const { agents, blackboard, messages, triggerSwarmForIncident, isDeliberating } = useSwarmStore();
  const { incidents } = useDisasterStore();

  const handleTriggerPreset = (index: number) => {
    if (incidents[index]) {
      tacticalAudio.playRadarPing(880, 0.2);
      triggerSwarmForIncident(incidents[index]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.25rem)] w-full bg-slate-950 p-4 md:p-6 space-y-6">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            <h1 className="text-lg font-bold uppercase tracking-wider text-slate-100">
              AI Swarm Command War Room
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-agent autonomous consensus, cross-domain debate, and actionable hazard dispatching.
          </p>
        </div>

        {/* Trigger Deliberation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTriggerPreset(0)}
            disabled={isDeliberating}
            className="flex items-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-500/15 px-3.5 py-2 text-xs font-bold text-orange-300 hover:bg-orange-500/25 transition disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Simulate Cyclone Michaung (Puri)</span>
          </button>

          <button
            onClick={() => handleTriggerPreset(1)}
            disabled={isDeliberating}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/25 transition disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Simulate Wayanad Landslide</span>
          </button>

          <button
            onClick={() => handleTriggerPreset(2)}
            disabled={isDeliberating}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 transition disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Simulate Brahmaputra Flood</span>
          </button>
        </div>
      </div>

      {/* 1. Swarm Neural Bus Topology Visualizer */}
      <SwarmVisualizer />

      {/* 2. Split Screen: Selected Agent Telemetry Dossier & Shared Blackboard State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selected Agent Detailed Dossier (6 Cols) */}
        <div className="lg:col-span-6">
          <AgentStatusCard />
        </div>

        {/* Shared Blackboard & Action Consensus (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl border border-slate-800 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Swarm Blackboard Consensus State
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Updated: Live Telemetry
            </span>
          </div>

          {/* Consensus Summary Banner */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-200 space-y-1">
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] block">
              Consensus Synthesis:
            </span>
            <p className="leading-relaxed text-slate-300">{blackboard.consensusSummary}</p>
          </div>

          {/* Recommended Emergency Actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Verified Mitigation Action Playbook:</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              {blackboard.recommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-slate-900 bg-slate-900/40 p-2.5 text-slate-300"
                >
                  <span className="font-mono text-cyan-400 font-bold mt-0.5">{idx + 1}.</span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3 text-center text-xs">
            <div className="rounded-lg bg-slate-900/40 p-2 border border-slate-900">
              <span className="text-[10px] text-slate-400 block">Active Corridors</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {blackboard.evacuationRoutesActive}
              </span>
            </div>
            <div className="rounded-lg bg-slate-900/40 p-2 border border-slate-900">
              <span className="text-[10px] text-slate-400 block">NDRF Battalions</span>
              <span className="font-mono text-sm font-bold text-cyan-400">
                {blackboard.ndrfBattalionsMobilized}
              </span>
            </div>
            <div className="rounded-lg bg-slate-900/40 p-2 border border-slate-900">
              <span className="text-[10px] text-slate-400 block">Broadcasts</span>
              <span className="font-mono text-sm font-bold text-purple-400">
                {blackboard.broadcastsIssuedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Reasoning Terminal Stream (Full Width) */}
      <AgentTerminal />
    </div>
  );
}
