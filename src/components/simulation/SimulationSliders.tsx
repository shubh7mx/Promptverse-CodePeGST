'use client';

import React from 'react';
import { Sliders, Play, RotateCcw, CloudRain, Flame, Wind, Mountain, ShieldAlert, Zap, Activity } from 'lucide-react';
import { PRESET_SCENARIOS, useSimulationStore } from '@/lib/store/useSimulationStore';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';
import { formatNumber } from '@/lib/utils/formatters';

export function SimulationSliders() {
  const { activePreset, currentParams, updateParam, loadPreset, runSimulation, isSimulating } = useSimulationStore();

  const handleRun = () => {
    tacticalAudio.playEmergencyBeep();
    runSimulation();
  };

  const handlePresetSelect = (id: string) => {
    tacticalAudio.playRadarPing(880, 0.15);
    loadPreset(id);
  };

  // Helper IMD Cyclone Category Label
  const getCycloneCategoryLabel = (speed: number) => {
    if (speed < 62) return { label: 'Depression / Deep Depression', color: 'text-blue-400' };
    if (speed < 88) return { label: 'Cyclonic Storm', color: 'text-yellow-400' };
    if (speed < 118) return { label: 'Severe Cyclonic Storm', color: 'text-orange-400' };
    if (speed < 221) return { label: 'Very Severe Cyclonic Storm', color: 'text-rose-400' };
    return { label: 'Super Cyclonic Storm (Cat 5)', color: 'text-purple-400 font-bold animate-pulse' };
  };

  const cycloneTier = getCycloneCategoryLabel(currentParams.maxWindSpeedKmh);

  // Helper LSI Slope Risk Label
  const getLsiRiskLabel = (rain: number, soilMoist: number) => {
    const rawLsi = (0.5 * (rain / 200) + 0.3 * (soilMoist / 70) + 0.2 * 0.8) * 1.1;
    if (rawLsi < 0.9) return { label: 'LOW SLOPE STRESS (LSI < 1.0)', color: 'text-emerald-400' };
    if (rawLsi < 1.5) return { label: 'ELEVATED SATURATION WATCH', color: 'text-amber-400' };
    return { label: 'CRITICAL DEBRIS FLOW ZONE (LSI > 1.6)', color: 'text-rose-400 font-bold animate-pulse' };
  };

  const lsiTier = getLsiRiskLabel(currentParams.antecedentRainfallMm, currentParams.soilMoistureSaturationPct);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header & Scenario Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Disaster Physics Control Deck
            </h2>
          </div>
          <p className="text-xs text-slate-400">Tweak physical parameters & observe live mathematical recalculations</p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition ${
                activePreset.id === preset.id
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {preset.district} ({preset.category})
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Flood / Hydrology Parameters */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <CloudRain className="h-4 w-4" />
              <span>Hydrology & Inundation (2D DEM)</span>
            </div>
            <span className="font-mono text-[10px] text-cyan-500">CWC Stage Math</span>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>24h Precipitation Accumulation:</span>
              <span className="font-mono font-bold text-cyan-300">{currentParams.rainfall24hMm} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={currentParams.rainfall24hMm}
              onChange={(e) => updateParam('rainfall24hMm', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0 mm (Normal)</span>
              <span>200 mm (Warning)</span>
              <span>500 mm (Cloudburst)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Upstream Dam Gate Discharge:</span>
              <span className="font-mono font-bold text-cyan-300">{formatNumber(currentParams.damDischargeCusecs)} cusecs</span>
            </div>
            <input
              type="range"
              min="0"
              max="300000"
              step="5000"
              value={currentParams.damDischargeCusecs}
              onChange={(e) => updateParam('damDischargeCusecs', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Cyclone & Wind Parameters */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-purple-400">
              <Wind className="h-4 w-4" />
              <span>Atmospheric & Surge (SLOSH Model)</span>
            </div>
            <span className={`font-mono text-[10px] ${cycloneTier.color}`}>{cycloneTier.label}</span>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Maximum Sustained Wind Velocity:</span>
              <span className="font-mono font-bold text-purple-300">{currentParams.maxWindSpeedKmh} km/h</span>
            </div>
            <input
              type="range"
              min="30"
              max="260"
              step="5"
              value={currentParams.maxWindSpeedKmh}
              onChange={(e) => updateParam('maxWindSpeedKmh', Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>30 km/h (Breeze)</span>
              <span>150 km/h (Severe)</span>
              <span>260 km/h (Super Cyclone)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Central Eye Pressure (hPa):</span>
              <span className="font-mono font-bold text-purple-300">{currentParams.centralPressureHpa} hPa</span>
            </div>
            <input
              type="range"
              min="900"
              max="1015"
              step="2"
              value={currentParams.centralPressureHpa}
              onChange={(e) => updateParam('centralPressureHpa', Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Wildfire Spread Parameters */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-orange-400">
              <Flame className="h-4 w-4" />
              <span>Wildfire Vector (Rothermel Model)</span>
            </div>
            <span className="font-mono text-[10px] text-orange-500">Thermal Anomaly Math</span>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Forest Canopy Dryness Index:</span>
              <span className="font-mono font-bold text-orange-300">{currentParams.fuelDrynessIndex}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={currentParams.fuelDrynessIndex}
              onChange={(e) => updateParam('fuelDrynessIndex', Number(e.target.value))}
              className="w-full accent-orange-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Terrain Slope Inclination Angle:</span>
              <span className="font-mono font-bold text-orange-300">{currentParams.terrainSlopeDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="2"
              value={currentParams.terrainSlopeDeg}
              onChange={(e) => updateParam('terrainSlopeDeg', Number(e.target.value))}
              className="w-full accent-orange-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Landslide & Soil Saturation */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Mountain className="h-4 w-4" />
              <span>Slope Stability ($LSI$ Saturation)</span>
            </div>
            <span className={`font-mono text-[10px] ${lsiTier.color}`}>{lsiTier.label}</span>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Antecedent 48h Rain Infiltration:</span>
              <span className="font-mono font-bold text-emerald-300">{currentParams.antecedentRainfallMm} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              step="10"
              value={currentParams.antecedentRainfallMm}
              onChange={(e) => updateParam('antecedentRainfallMm', Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Subsurface Volumetric Soil Moisture:</span>
              <span className="font-mono font-bold text-emerald-300">{currentParams.soilMoistureSaturationPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="2"
              value={currentParams.soilMoistureSaturationPct}
              onChange={(e) => updateParam('soilMoistureSaturationPct', Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Action Trigger Button */}
      <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-800/80 pt-4">
        <button
          onClick={handleRun}
          disabled={isSimulating}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400 disabled:opacity-50"
        >
          <Play className={`h-4 w-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Executing Physics Engine Calculation...' : 'Run Physics Recalculation'}</span>
        </button>
      </div>
    </div>
  );
}
