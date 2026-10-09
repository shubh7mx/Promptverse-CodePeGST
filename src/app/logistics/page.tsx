'use client';

import React from 'react';
import { BattalionMatrix } from '@/components/logistics/BattalionMatrix';
import { SupplyDispatchCard } from '@/components/logistics/SupplyDispatchCard';
import { NdrfPlaybookSop } from '@/components/logistics/NdrfPlaybookSop';
import { Truck, ShieldCheck, Download, ClipboardList } from 'lucide-react';

export default function LogisticsPage() {
  return (
    <div className="min-h-[calc(100vh-3.25rem)] w-full bg-slate-950 p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-cyan-400" />
            <h1 className="text-lg font-bold uppercase tracking-wider text-slate-100">
              NDRF Logistics, Asset Allocation & SOP Playbooks
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Capacitated Vehicle Routing (CVRP), battalion force readiness matrix, and NDMA digital incident action plans.
          </p>
        </div>

        <span className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-mono font-bold text-cyan-300">
          16 Battalions • 28 Task Forces Connected
        </span>
      </div>

      {/* 1. Supply Allocation & Vehicle Dispatch Calculator */}
      <SupplyDispatchCard />

      {/* 2. NDRF Battalion Deployment & Readiness Matrix */}
      <BattalionMatrix />

      {/* 3. NDMA Standard Operating Procedure (SOP) Checklists */}
      <NdrfPlaybookSop />
    </div>
  );
}
