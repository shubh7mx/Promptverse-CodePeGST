'use client';

import React, { useState } from 'react';
import { ShieldCheck, MapPin, Phone, Users, Check, AlertCircle, Navigation, ExternalLink, Search } from 'lucide-react';
import { useDisasterStore } from '@/lib/store/useDisasterStore';
import { formatNumber } from '@/lib/utils/formatters';

export function ShelterFinder() {
  const { shelters } = useDisasterStore();
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredShelters = shelters.filter((s) => {
    const matchesState = filterState === 'ALL' || s.state.toLowerCase() === filterState.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.state.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacityMax, 0);
  const totalOccupancy = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Verified Open Relief Shelters Directory
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            OpenStreetMap certified cyclone refuges, stadium complexes, and disaster relief camps
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Network Occupancy:</span>
          <span className="font-bold text-emerald-300">
            {formatNumber(totalOccupancy)} / {formatNumber(totalCapacity)} (
            {Math.round((totalOccupancy / totalCapacity) * 100)}%)
          </span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search shelter name or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filter State Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {['ALL', 'Odisha', 'Kerala', 'Assam', 'Uttarakhand'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterState(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition whitespace-nowrap ${
                filterState === st
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
        {filteredShelters.map((shelter) => {
          const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacityMax) * 100);
          const statusBadge = {
            OPEN_AVAILABLE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
            NEAR_CAPACITY: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            FULL: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
            ISOLATED_INUNDATED: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          }[shelter.status] || 'bg-slate-800 text-slate-300';

          return (
            <div
              key={shelter.id}
              className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 space-y-3 transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{shelter.name}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                    <span>{shelter.district}, {shelter.state}</span>
                  </p>
                </div>
                <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${statusBadge}`}>
                  {shelter.status.replace('_', ' ')}
                </span>
              </div>

              {/* Occupancy Bar */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                  <span>Occupancy:</span>
                  <span className="font-bold text-slate-200">
                    {shelter.currentOccupancy} / {shelter.capacityMax} ({occupancyPct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
              </div>

              {/* Amenities & Contact */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-300 border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Check className="h-3 w-3" />
                    <span>Medical Trauma Post</span>
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400 font-medium">
                    <Check className="h-3 w-3" />
                    <span>Potable Water</span>
                  </span>
                </div>

                <a
                  href={`tel:${shelter.contactPhone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-1 text-cyan-300 font-mono hover:underline"
                >
                  <Phone className="h-3 w-3 text-cyan-400" />
                  <span>{shelter.contactPhone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
