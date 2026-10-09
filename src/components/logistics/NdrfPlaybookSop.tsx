'use client';

import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, Clock, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { NdmaSopItem } from '@/types/logistics';

export const NDMA_SOP_CHECKLIST: NdmaSopItem[] = [
  // PRE-DISASTER PHASE
  {
    id: 'sop-pre-1',
    phase: 'PRE_DISASTER',
    category: 'COMMAND',
    title: 'Activate State Emergency Operations Center (SEOC) to 24/7 Red Alert Mode',
    description: 'Ensure tri-service and civil administration liaison officers report to SEOC control desk.',
    responsibleAgency: 'SDMA',
    status: 'COMPLETED',
  },
  {
    id: 'sop-pre-2',
    phase: 'PRE_DISASTER',
    category: 'EVACUATION',
    title: 'Mandatory Evacuation of 5km Coastal & Low-Lying Riverine Buffer Zones',
    description: 'Deploy state transport buses and NDRF trucks to transfer high-vulnerability populations.',
    responsibleAgency: 'DISTRICT_COLLECTOR',
    status: 'IN_PROGRESS',
  },
  {
    id: 'sop-pre-3',
    phase: 'PRE_DISASTER',
    category: 'COMMUNICATION',
    title: 'Broadcast Multilingual CAP Alert Warnings over Cellular Broadcast & Radio',
    description: 'Push localized audio/text advisories across 10+ regional languages.',
    responsibleAgency: 'IMD',
    status: 'COMPLETED',
  },

  // DURING-DISASTER PHASE
  {
    id: 'sop-dur-1',
    phase: 'DURING_DISASTER',
    category: 'COMMAND',
    title: 'Pre-position NDRF Inflatable Rescue Boats (IRB) at Staging Depots',
    description: 'Ensure motorized boats and deep-diving rescue teams are stationed near water ingress points.',
    responsibleAgency: 'NDRF',
    status: 'IN_PROGRESS',
  },
  {
    id: 'sop-dur-2',
    phase: 'DURING_DISASTER',
    category: 'MEDICAL',
    title: 'Establish Mobile Medical First Responder Posts with Anti-Venom & Trauma Packs',
    description: 'Station paramedics and emergency drugs at all designated Class-A cyclone shelters.',
    responsibleAgency: 'SDMA',
    status: 'PENDING',
  },
  {
    id: 'sop-dur-3',
    phase: 'DURING_DISASTER',
    category: 'LOGISTICS',
    title: 'Air-drop Drinking Water & Ready-to-Eat Food Packets in Inundated Sectors',
    description: 'Coordinate with Indian Air Force (IAF) Mi-17 helicopters for airdrop supply corridors.',
    responsibleAgency: 'NDRF',
    status: 'PENDING',
  },

  // POST-DISASTER PHASE
  {
    id: 'sop-post-1',
    phase: 'POST_DISASTER',
    category: 'LOGISTICS',
    title: 'Clear Severed Highway Corridors Using Heavy Earth Movers & JCBs',
    description: 'Restore critical road connectivity to hospitals and relief distribution hubs.',
    responsibleAgency: 'POLICE',
    status: 'PENDING',
  },
  {
    id: 'sop-post-2',
    phase: 'POST_DISASTER',
    category: 'MEDICAL',
    title: 'Chlorinate Community Wells and Distribute Water Purification Halazone Tablets',
    description: 'Prevent outbreak of water-borne epidemics (cholera, leptospirosis) post-flooding.',
    responsibleAgency: 'SDMA',
    status: 'PENDING',
  },
];

export function NdrfPlaybookSop() {
  const [activePhase, setActivePhase] = useState<'PRE_DISASTER' | 'DURING_DISASTER' | 'POST_DISASTER'>('PRE_DISASTER');
  const [checklist, setChecklist] = useState<NdmaSopItem[]>(NDMA_SOP_CHECKLIST);

  const toggleStatus = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'COMPLETED' ? 'PENDING' : item.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const filteredItems = checklist.filter((item) => item.phase === activePhase);

  const handleExportBriefing = () => {
    const markdown = `# NDMA DISASTER ACTION PLAYBOOK & SOP BRIEFING
Date: ${new Date().toLocaleDateString('en-IN')}
Phase: ${activePhase}

${filteredItems
  .map(
    (item, idx) =>
      `### ${idx + 1}. ${item.title}
- Agency: ${item.responsibleAgency}
- Status: ${item.status}
- Description: ${item.description}
`
  )
  .join('\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NDMA_Action_Playbook_${activePhase}.md`;
    a.click();
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              NDMA Standard Operating Procedure (SOP) Action Playbooks
            </h3>
          </div>
          <p className="text-xs text-slate-400">Standardized checklists & digital incident command protocols</p>
        </div>

        <button
          onClick={handleExportBriefing}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
        >
          <Download className="h-3.5 w-3.5 text-cyan-400" />
          <span>Export Briefing (.md)</span>
        </button>
      </div>

      {/* Phase Switcher */}
      <div className="mt-4 flex gap-1.5 border-b border-slate-900 pb-3">
        {(['PRE_DISASTER', 'DURING_DISASTER', 'POST_DISASTER'] as const).map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
              activePhase === phase
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            {phase.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Checklist Items */}
      <div className="mt-4 space-y-2.5 text-xs">
        {filteredItems.map((item) => {
          const statusBadge = {
            COMPLETED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
            IN_PROGRESS: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse',
            PENDING: 'bg-slate-800 text-slate-400 border-slate-700',
          }[item.status];

          return (
            <div
              key={item.id}
              onClick={() => toggleStatus(item.id)}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5 cursor-pointer hover:border-slate-700 transition"
            >
              <div className="flex items-start gap-3">
                <button className="mt-0.5 shrink-0 text-cyan-400">
                  {item.status === 'COMPLETED' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : item.status === 'IN_PROGRESS' ? (
                    <Clock className="h-4 w-4 text-amber-400" />
                  ) : (
                    <div className="h-4 w-4 rounded border border-slate-700" />
                  )}
                </button>
                <div>
                  <h4 className={`font-semibold ${item.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-semibold ${statusBadge}`}>
                  {item.status}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{item.responsibleAgency}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
