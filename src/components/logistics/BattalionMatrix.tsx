'use client';

import React, { useState } from 'react';
import { Truck, ShieldCheck, Activity, Users, Anchor, HeartPulse, HardHat, Search, Filter, Compass } from 'lucide-react';
import { MAJOR_NDRF_BATTALIONS } from '@/lib/geo/indiaGeoData';
import { formatNumber } from '@/lib/utils/formatters';

export function BattalionMatrix() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredBattalions = MAJOR_NDRF_BATTALIONS.filter((bn) => {
    const matchesSearch =
      bn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bn.baseLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bn.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bn.jurisdictionStates.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || bn.readinessStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPersonnel = MAJOR_NDRF_BATTALIONS.reduce((acc, b) => acc + b.totalPersonnel, 0);
  const totalDeployed = MAJOR_NDRF_BATTALIONS.reduce((acc, b) => acc + b.activeDeployed, 0);
  const totalBoats = MAJOR_NDRF_BATTALIONS.reduce((acc, b) => acc + b.inflatableRescueBoats, 0);
  const totalMedics = MAJOR_NDRF_BATTALIONS.reduce((acc, b) => acc + b.medicalFirstResponders, 0);
  const totalCanines = MAJOR_NDRF_BATTALIONS.reduce((acc, b) => acc + b.canineSearchTeams, 0);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              NDRF 16-Battalion Force Readiness & Strategic Asset Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time tracking of 18,384 personnel, rescue boats, deep-diving teams, and canine search squads across India
          </p>
        </div>
        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-[10px] font-mono font-bold text-cyan-300">
          HQ NEW DELHI COMMAND • 16 / 16 BNS
        </span>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-sans mb-1">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            <span>Active Deployed</span>
          </div>
          <div className="text-lg font-bold text-cyan-300">
            {formatNumber(totalDeployed)} <span className="text-xs text-slate-500 font-normal">/ {formatNumber(totalPersonnel)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-sans mb-1">
            <Anchor className="h-3.5 w-3.5 text-emerald-400" />
            <span>Inflatable Boats (IRB)</span>
          </div>
          <div className="text-lg font-bold text-emerald-300">
            {totalBoats} <span className="text-xs text-slate-500 font-normal">Boats</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-sans mb-1">
            <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
            <span>Medical Responders</span>
          </div>
          <div className="text-lg font-bold text-rose-300">
            {totalMedics} <span className="text-xs text-slate-500 font-normal">Staff</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-sans mb-1">
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            <span>Canine Teams</span>
          </div>
          <div className="text-lg font-bold text-amber-300">
            {totalCanines} <span className="text-xs text-slate-500 font-normal">K-9 Units</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-sans mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            <span>Battalions Active</span>
          </div>
          <div className="text-lg font-bold text-purple-300">
            16 / 16 <span className="text-xs text-slate-500 font-normal">Ready</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter by Battalion, Base, or State..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['ALL', 'DEPLOYED', 'OPERATING', 'STANDBY'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold transition whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {status} {status === 'ALL' ? `(${MAJOR_NDRF_BATTALIONS.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-x-auto text-xs rounded-xl border border-slate-800/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-mono uppercase bg-slate-900/90">
              <th className="p-3">Battalion & Headquarters</th>
              <th className="p-3">Jurisdiction Area</th>
              <th className="p-3">Personnel</th>
              <th className="p-3">Rescue Boats (IRB)</th>
              <th className="p-3">Medical First Responders</th>
              <th className="p-3">Canine Teams</th>
              <th className="p-3">Earth Movers</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredBattalions.map((bn) => {
              const statusBadge = {
                OPERATING: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse',
                DEPLOYED: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
                MOBILIZING: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                STANDBY: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
              }[bn.readinessStatus];

              return (
                <tr key={bn.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3 font-bold text-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-cyan-400 border border-slate-700">
                        {bn.battalionNumber} Bn
                      </span>
                      <span>{bn.name}</span>
                    </div>
                    <div className="text-[10px] font-normal text-slate-400 mt-0.5">{bn.baseLocation} • {bn.state}</div>
                  </td>
                  <td className="p-3 text-slate-300 text-[11px] max-w-xs">
                    {bn.jurisdictionStates.join(', ')}
                  </td>
                  <td className="p-3 font-mono">
                    <span className="font-bold text-slate-100">{bn.activeDeployed}</span>
                    <span className="text-slate-500 text-[10px]"> / {bn.totalPersonnel}</span>
                  </td>
                  <td className="p-3 font-mono text-cyan-300 font-bold">
                    {bn.inflatableRescueBoats} IRBs
                  </td>
                  <td className="p-3 font-mono text-emerald-300 font-bold">
                    {bn.medicalFirstResponders} Medics
                  </td>
                  <td className="p-3 font-mono text-amber-300 font-bold">
                    {bn.canineSearchTeams} K-9s
                  </td>
                  <td className="p-3 font-mono text-purple-300 font-bold">
                    {bn.heavyEarthMovers}
                  </td>
                  <td className="p-3">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${statusBadge}`}>
                      {bn.readinessStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
