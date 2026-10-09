'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Languages, Radio, CheckSquare, PhoneCall } from 'lucide-react';
import { INDIAN_LANGUAGES } from '@/lib/i18n/indianLanguages';
import { getEmergencyAdvisory } from '@/lib/i18n/translations';
import { DisasterCategory } from '@/types/disaster';

export function MultilingualVoiceCard() {
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [selectedCategory, setSelectedCategory] = useState<DisasterCategory>('FLOOD');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const advisory = getEmergencyAdvisory(selectedLang, selectedCategory);
  const langConfig = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  const handlePlayVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${advisory.title}. ${advisory.advisoryText}`);
    utterance.lang = langConfig.voiceCode;
    utterance.rate = 0.92;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Multilingual Citizen Voice & Advisory Hub
            </h3>
          </div>
          <p className="text-xs text-slate-400">Instant regional translation & Web Speech audio synthesis</p>
        </div>

        {/* Hazard Category Switcher */}
        <div className="flex flex-wrap gap-1">
          {(['FLOOD', 'CYCLONE', 'WILDFIRE', 'LANDSLIDE', 'EARTHQUAKE'] as DisasterCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                selectedCategory === cat
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector Chips (10+ Indian Languages) */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-slate-900 pb-4">
        {INDIAN_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition ${
              selectedLang === lang.code
                ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span>{lang.name}</span>
            <span className="text-[10px] text-slate-500 font-normal">({lang.nativeName})</span>
          </button>
        ))}
      </div>

      {/* Advisory Content Card */}
      <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
          <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <Radio className="h-4 w-4 text-rose-400 animate-pulse shrink-0" />
            <span>{advisory.title}</span>
          </h4>

          <button
            onClick={handlePlayVoice}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-lg shrink-0 ${
              isPlaying
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
            }`}
          >
            {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{isPlaying ? 'Stop Audio Advisory' : `Listen in ${langConfig.name}`}</span>
          </button>
        </div>

        {/* Advisory Text */}
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
          {advisory.advisoryText}
        </p>

        {/* Action Checklist */}
        <div>
          <h5 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <CheckSquare className="h-4 w-4 text-cyan-400" />
            <span>Standard Public Safety Protocol:</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {advisory.actionChecklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Helpline */}
        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          <PhoneCall className="h-4 w-4 text-emerald-400" />
          <span>Emergency Helpline: <b className="text-emerald-300 font-mono">{advisory.helplinePhone}</b></span>
        </div>
      </div>
    </div>
  );
}
