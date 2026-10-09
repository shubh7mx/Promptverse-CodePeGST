'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Activity,
  Cpu,
  Sliders,
  HeartHandshake,
  Truck,
  Volume2,
  VolumeX,
  Menu,
  X,
  Radio
} from 'lucide-react';
import { useSwarmStore } from '@/lib/store/useSwarmStore';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';

export function Navbar() {
  const pathname = usePathname();
  const { blackboard, isDeliberating } = useSwarmStore();

  const [istTime, setIstTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: 'Live Map', icon: Activity },
    { href: '/war-room', label: 'Swarm War Room', icon: Cpu },
    { href: '/simulation', label: 'Disaster Sandbox', icon: Sliders },
    { href: '/citizen-hub', label: 'Citizen SOS', icon: HeartHandshake },
    { href: '/logistics', label: 'NDRF Logistics', icon: Truck },
  ];

  const highestSeverity = blackboard.compositeThreatLevel || 'ORANGE';
  const alertDotColor = {
    RED: 'bg-rose-500 animate-ping',
    ORANGE: 'bg-orange-500',
    YELLOW: 'bg-amber-400',
    GREEN: 'bg-emerald-400',
  }[highestSeverity] || 'bg-slate-400';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Mark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition group-hover:border-cyan-500/40">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-sm">
            <span className="text-slate-100">DRISHTI</span>
            <span className="text-cyan-400">SWARM</span>
            <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-cyan-400 ml-0.5" />
            <span className="hidden sm:inline-block text-[10px] font-mono font-medium text-slate-500">IND-DISASTER-AI</span>
          </div>
        </Link>

        {/* Center Minimalist Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.06] bg-slate-900/60 p-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Status & Quick Controls */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Deliberating Status */}
          {isDeliberating && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-[11px] font-mono text-purple-300 animate-pulse">
              <Radio className="h-3 w-3" />
              <span>Deliberating</span>
            </div>
          )}

          {/* Minimal Threat Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-900/80 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${alertDotColor}`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${alertDotColor}`} />
            </span>
            <span className="text-slate-400">ALERT:</span>
            <span className="font-bold text-slate-200">{highestSeverity}</span>
          </div>

          {/* Minimal IST Time */}
          <div className="hidden sm:block font-mono text-[11px] text-slate-400 px-1">
            {istTime || '14:30:00'} <span className="text-slate-600 text-[10px]">IST</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              tacticalAudio.setMuted(!next);
              if (next) tacticalAudio.playRadarPing(880, 0.1);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-slate-900 text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950/95 p-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
