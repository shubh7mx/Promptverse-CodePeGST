'use client';

import React, { useState } from 'react';
import { Package, Truck, Droplets, HeartPulse, Tent, Send, CheckCircle2, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';
import { formatNumber } from '@/lib/utils/formatters';

const DISTRICT_BATTALION_MAP: Record<string, { battalion: string; distance: string; transitHours: number }> = {
  Puri: {
    battalion: '3rd Battalion NDRF (Mundali, Cuttack - Odisha)',
    distance: '88 km via NH-16',
    transitHours: 2.0,
  },
  Wayanad: {
    battalion: '4th Battalion NDRF (Arakkonam) / Kerala Task Force Detachment',
    distance: '142 km via NH-766',
    transitHours: 3.5,
  },
  Dibrugarh: {
    battalion: '1st Battalion NDRF (Patgaon, Guwahati - Assam)',
    distance: '440 km via NH-715 (Pre-positioned Flight Staging)',
    transitHours: 4.0,
  },
  Chamoli: {
    battalion: '8th Battalion NDRF (Ghaziabad / Uttarakhand Sector)',
    distance: '290 km via NH-7 Mountain Corridor',
    transitHours: 6.5,
  },
};

export function SupplyDispatchCard() {
  const [targetDistrict, setTargetDistrict] = useState('Puri');
  const [population, setPopulation] = useState(120000);
  const [dispatched, setDispatched] = useState(false);

  const selectedDispatch = DISTRICT_BATTALION_MAP[targetDistrict] || DISTRICT_BATTALION_MAP.Puri;

  // Automated CVRP Quota Math
  const foodPackets = Math.round(population * 2.5);
  const waterLiters = Math.round(population * 4.0);
  const medicalKits = Math.max(Math.round(population / 1500), 20);
  const waterUnits = Math.max(Math.round(population / 10000), 4);
  const tents = Math.max(Math.round(population / 250), 100);

  const handleDispatch = () => {
    tacticalAudio.playEmergencyBeep();
    setDispatched(true);
    confetti({ particleCount: 40, spread: 60 });
    setTimeout(() => setDispatched(false), 4000);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Automated Supply Allocation & Vehicle Routing (CVRP Engine)
          </h3>
        </div>
        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
          LOGISTICS OPTIMIZER ACTIVE
        </span>
      </div>

      {/* Target Parameters */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-medium">Target Emergency District</label>
          <select
            value={targetDistrict}
            onChange={(e) => setTargetDistrict(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="Puri">Puri (Odisha - Cyclone Zone)</option>
            <option value="Wayanad">Wayanad (Kerala - Landslide Zone)</option>
            <option value="Dibrugarh">Dibrugarh (Assam - River Basin)</option>
            <option value="Chamoli">Chamoli (Uttarakhand - Seismic Belt)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">Displaced Population Quota</label>
          <input
            type="number"
            min="5000"
            max="1000000"
            step="5000"
            value={population}
            onChange={(e) => setPopulation(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">Assigned Nearest NDRF Base</label>
          <input
            type="text"
            readOnly
            value={selectedDispatch.battalion}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-cyan-300 cursor-not-allowed font-mono text-[11px]"
          />
        </div>
      </div>

      {/* Calculated Quota Matrix */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
        <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Package className="h-3.5 w-3.5 text-amber-400" />
            <span>Food Rations/Day</span>
          </div>
          <p className="font-mono text-base font-bold text-amber-300">
            {formatNumber(foodPackets)}
          </p>
          <p className="text-[10px] text-slate-500">packets (ready-to-eat)</p>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Droplets className="h-3.5 w-3.5 text-cyan-400" />
            <span>Drinking Water</span>
          </div>
          <p className="font-mono text-base font-bold text-cyan-300">
            {formatNumber(waterLiters)} L
          </p>
          <p className="text-[10px] text-slate-500">potable water/day</p>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
            <span>Medical Trauma Kits</span>
          </div>
          <p className="font-mono text-base font-bold text-rose-300">
            {formatNumber(medicalKits)}
          </p>
          <p className="text-[10px] text-slate-500">trauma packs</p>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Droplets className="h-3.5 w-3.5 text-purple-400" />
            <span>Purification Units</span>
          </div>
          <p className="font-mono text-base font-bold text-purple-300">
            {waterUnits} Units
          </p>
          <p className="text-[10px] text-slate-500">mobile RO filtration</p>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Tent className="h-3.5 w-3.5 text-emerald-400" />
            <span>Shelter Tents</span>
          </div>
          <p className="font-mono text-base font-bold text-emerald-300">
            {formatNumber(tents)}
          </p>
          <p className="text-[10px] text-slate-500">family tarpaulins</p>
        </div>
      </div>

      {/* Dispatch Action & Route Transit Info */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 text-[11px] font-mono">
          <Navigation className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>
            Mobilization Distance: <b>{selectedDispatch.distance}</b> • Est. Transit: <b>{selectedDispatch.transitHours}h</b>
          </span>
        </div>

        <button
          onClick={handleDispatch}
          disabled={dispatched}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400 disabled:opacity-50 shrink-0"
        >
          {dispatched ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          <span>{dispatched ? 'Supply Convoy Dispatched!' : 'Authorize & Dispatch Supply Convoy'}</span>
        </button>
      </div>
    </div>
  );
}
