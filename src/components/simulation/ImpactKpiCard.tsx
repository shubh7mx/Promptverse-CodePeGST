'use client';

import React from 'react';
import {
  Users,
  ShieldAlert,
  DollarSign,
  Navigation,
  Activity,
  Truck,
  AlertTriangle,
  Waves,
  Flame,
  Wind,
  Mountain,
  Calculator
} from 'lucide-react';
import { useSimulationStore } from '@/lib/store/useSimulationStore';
import { formatNumber } from '@/lib/utils/formatters';

export function ImpactKpiCard() {
  const { results, activePreset } = useSimulationStore();

  const tierColors = {
    RED: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
    ORANGE: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    YELLOW: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  }[results.generatedAlertTier];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Real-Time Impact & Loss Telemetry (Physics Engine Output)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Geospatial Target: <b>{activePreset.district}, {activePreset.state}</b> • {activePreset.description}
          </p>
        </div>

        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-bold ${tierColors}`}>
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{results.generatedAlertTier} ALERT LEVEL</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Population at Risk */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3.5 transition hover:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Users className="h-4 w-4 text-cyan-400" />
            <span className="font-medium">Population at Risk</span>
          </div>
          <p className="font-mono text-xl font-bold text-slate-100">
            {formatNumber(results.estimatedAffectedPopulation)}
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">within hazard buffer</p>
        </div>

        {/* Severed Transport Corridors */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3.5 transition hover:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Navigation className="h-4 w-4 text-rose-400" />
            <span className="font-medium">Severed Highways / Roads</span>
          </div>
          <p className="font-mono text-xl font-bold text-rose-400">
            {results.estimatedSeveredRoadsKm} km
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">blocked by flood/debris</p>
        </div>

        {/* Estimated Economic Damage */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3.5 transition hover:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <DollarSign className="h-4 w-4 text-amber-400" />
            <span className="font-medium">Estimated Loss (INR)</span>
          </div>
          <p className="font-mono text-xl font-bold text-amber-300">
            ₹{formatNumber(results.estimatedEconomicLossCroresINR)} Cr
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">infrastructure + agriculture</p>
        </div>

        {/* Required Rescue Assets */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3.5 transition hover:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Truck className="h-4 w-4 text-emerald-400" />
            <span className="font-medium">Required Rescue Boats</span>
          </div>
          <p className="font-mono text-xl font-bold text-emerald-300">
            {results.requiredRescueBoats} IRBs
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">NDRF deployment requirement</p>
        </div>
      </div>

      {/* Physics Model Breakdown Footprint */}
      <div className="mt-4 rounded-xl border border-slate-900 bg-slate-900/40 p-4 text-xs">
        <h4 className="font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span>Simulated Multi-Hazard Physical Footprint & Model Equations:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-300">
          {/* Flood Inundation */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1 text-cyan-400 font-semibold text-[11px]">
              <Waves className="h-3.5 w-3.5" />
              <span>2D DEM Inundation</span>
            </div>
            <p className="text-sm font-mono font-bold text-slate-100">{results.inundatedAreaSqKm} sq km</p>
            <p className="text-[10px] text-slate-400 font-mono">Discharge Volume Balance</p>
          </div>

          {/* Wildfire Perimeter */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1 text-orange-400 font-semibold text-[11px]">
              <Flame className="h-3.5 w-3.5" />
              <span>Rothermel Fire Spread</span>
            </div>
            <p className="text-sm font-mono font-bold text-slate-100">{results.fireSpreadPerimeterKm} km perimeter</p>
            <p className="text-[10px] text-slate-400 font-mono">V_spread = R0(1 + Φ_W + Φ_S)</p>
          </div>

          {/* Wind Surge Zone */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1 text-purple-400 font-semibold text-[11px]">
              <Wind className="h-3.5 w-3.5" />
              <span>SLOSH Coastal Surge</span>
            </div>
            <p className="text-sm font-mono font-bold text-slate-100">{results.highWindImpactZoneSqKm} sq km</p>
            <p className="text-[10px] text-slate-400 font-mono">h_surge = ΔP·0.01 + 0.0035·U^1.6</p>
          </div>

          {/* Landslide Slopes */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
              <Mountain className="h-3.5 w-3.5" />
              <span>LSI Saturation Index</span>
            </div>
            <p className="text-sm font-mono font-bold text-slate-100">{results.landslideHighRiskZonesCount} Critical Zones</p>
            <p className="text-[10px] text-slate-400 font-mono">LSI = [0.5(R/Rcrit) + 0.3(θ/θcrit)]·M</p>
          </div>
        </div>
      </div>
    </div>
  );
}
