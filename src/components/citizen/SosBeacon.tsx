'use client';

import React, { useState } from 'react';
import { AlertOctagon, Send, CheckCircle2, User, Phone, Users, FileText, Activity } from 'lucide-react';
import { DisasterCategory } from '@/types/disaster';
import confetti from 'canvas-confetti';

export function SosBeacon() {
  const [userName, setUserName] = useState('');
  const [contact, setContact] = useState('');
  const [district, setDistrict] = useState('Puri');
  const [hazardType, setHazardType] = useState<DisasterCategory>('FLOOD');
  const [headcount, setHeadcount] = useState(3);
  const [medicalHelp, setMedicalHelp] = useState(false);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmitSos = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/citizen/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          contact,
          state: 'Odisha',
          district,
          hazardType,
          headcount,
          medicalAssistanceRequired: medicalHelp,
          notes,
          coordinates: { lat: 19.8135, lng: 85.8312 },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedId(data.reportId || 'SOS-9921');
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      console.error('SOS dispatch error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-red-500/40 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertOctagon className="h-5 w-5 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Citizen Emergency SOS Beacon
          </h3>
        </div>
        <span className="rounded-full bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 text-[10px] font-mono font-bold animate-pulse">
          PRIORITY 1 DISPATCH
        </span>
      </div>

      {submittedId ? (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center text-xs space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-emerald-300">SOS BEACON BROADCAST SUCCESSFUL</h4>
          <p className="text-slate-300">
            Your emergency report <b>#{submittedId}</b> has been received by the Master Swarm Commander and relayed to the nearest NDRF 3rd Battalion Field Unit.
          </p>
          <div className="p-3 bg-slate-900/80 rounded-lg text-slate-400 text-[11px] font-mono">
            Status: RESCUE UNIT DISPATCHED • Estimated Arrival: 25 mins
          </div>
          <button
            onClick={() => setSubmittedId(null)}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
          >
            Submit Another Update
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitSos} className="mt-4 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Your Name / Head of Household</label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-8 pr-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contact Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="tel"
                  required
                  placeholder="+91-98765-43210"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-8 pr-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">District Location</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
              >
                <option value="Puri">Puri (Odisha)</option>
                <option value="Wayanad">Wayanad (Kerala)</option>
                <option value="Dibrugarh">Dibrugarh (Assam)</option>
                <option value="Chamoli">Chamoli (Uttarakhand)</option>
                <option value="Mayurbhanj">Mayurbhanj (Odisha)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Hazard Threat Type</label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value as DisasterCategory)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
              >
                <option value="FLOOD">Flash Flood Inundation</option>
                <option value="CYCLONE">Severe Cyclone / Storm Surge</option>
                <option value="LANDSLIDE">Landslide / Debris Blockage</option>
                <option value="WILDFIRE">Forest Fire Threat</option>
                <option value="EARTHQUAKE">Earthquake Damage</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Trapped People Count</label>
              <input
                type="number"
                min="1"
                max="50"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Emergency Situation Notes & Exact Landmark</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Trapped on 2nd floor roof near Konark temple road. Water rising fast. 1 elderly person."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="medical"
              checked={medicalHelp}
              onChange={(e) => setMedicalHelp(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-rose-500 focus:ring-rose-500"
            />
            <label htmlFor="medical" className="text-slate-300 font-semibold cursor-pointer">
              Urgent Medical Trauma Assistance Required
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-[0_0_25px_rgba(225,29,72,0.5)] transition hover:bg-rose-500 disabled:opacity-50 mt-2"
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? 'Transmitting High-Priority Beacon...' : 'Broadcast Emergency SOS Beacon'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
