'use client';

import React from 'react';
import { SimulationSliders } from '@/components/simulation/SimulationSliders';
import { ImpactKpiCard } from '@/components/simulation/ImpactKpiCard';
import { Sliders, Activity, AlertTriangle, Sparkles } from 'lucide-react';

export default function SimulationPage() {
  return (
    <div className="min-h-[calc(100vh-3.25rem)] w-full bg-slate-950 p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-6 w-6 text-cyan-400" />
            <h1 className="text-lg font-bold uppercase tracking-wider text-slate-100">
              Interactive Disaster Simulation Sandbox
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Execute what-if disaster scenarios, SLOSH coastal surge simulations, and Rothermel wildfire propagation vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>Physics Engine: ACTIVE (2D DEM / Rothermel / SLOSH)</span>
        </div>
      </div>

      {/* Physics Control Sliders & Sliders Deck */}
      <SimulationSliders />

      {/* Impact KPI Grid & Loss Estimator */}
      <ImpactKpiCard />
    </div>
  );
}
