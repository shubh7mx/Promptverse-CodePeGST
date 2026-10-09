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
  CheckCircle2,
  Activity,
  Clock
} from 'lucide-react';
import { useSwarmStore } from '@/lib/store/useSwarmStore';
import { AgentRole } from '@/types/swarm';

export function SwarmVisualizer() {
  const { agents, selectedAgentId, setSelectedAgentId, isDeliberating } = useSwarmStore();

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

  const commander = agents.find((a) => a.id === 'master_commander');
  const workerAgents = agents.filter((a) => a.id !== 'master_commander');

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Background Radar Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 flex w-full items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-cyan-400 ${isDeliberating ? 'animate-ping' : ''}`} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Swarm Agent Topology & Neural Bus
            </h2>
          </div>
          <p className="text-xs text-slate-400">8 Autonomous Domain Specialists with Blackboard Protocol</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
          <Activity className="h-4 w-4 animate-pulse" />
          <span>Status: {isDeliberating ? 'PARALLEL REASONING' : 'READY / LISTENING'}</span>
        </div>
      </div>

      {/* Central Node: Master Commander Agent */}
      {commander && (
        <div className="relative z-10 flex flex-col items-center mb-10">
          <button
            onClick={() => setSelectedAgentId(commander.id)}
            className={`group relative flex flex-col items-center rounded-2xl border-2 p-4 transition-all duration-300 ${
              selectedAgentId === commander.id
                ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner">
              <ShieldAlert className="h-8 w-8 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-center">
              <h3 className="text-xs font-bold text-slate-100">{commander.name}</h3>
              <p className="text-[10px] text-cyan-400 font-mono font-medium">{commander.roleTitle}</p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300">
              <CheckCircle2 className="h-3 w-3" />
              <span>Confidence: {commander.confidenceScore}%</span>
            </div>
          </button>

          {/* Central Bus Connecting Lines */}
          <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-500 to-slate-700 mt-1" />
        </div>
      )}

      {/* Domain Worker Agents (Horizontal Ring) */}
      <div className="relative z-10 grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {workerAgents.map((agent) => {
          const Icon = getAgentIcon(agent.id);
          const isSelected = selectedAgentId === agent.id;

          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`flex flex-col items-center rounded-xl border p-3 text-center transition-all duration-200 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xs ${
                isSelected ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-slate-700 bg-slate-800/60 text-slate-300'
              }`}>
                <Icon className="h-5 w-5" />
              </div>

              <h4 className="mt-2 text-[11px] font-bold text-slate-200 truncate w-full">
                {agent.name.replace(' Agent', '')}
              </h4>
              <p className="text-[9px] text-slate-400 truncate w-full">{agent.domain}</p>

              <div className="mt-2 flex items-center gap-1 text-[9px] font-mono text-slate-500">
                <Clock className="h-2.5 w-2.5" />
                <span>{agent.processedEventsCount} events</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
