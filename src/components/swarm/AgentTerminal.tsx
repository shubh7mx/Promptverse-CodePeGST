'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Terminal,
  Trash2,
  Cpu,
  Radio,
  CornerDownRight,
  Search,
  Copy,
  Check,
  Filter
} from 'lucide-react';
import { useSwarmStore } from '@/lib/store/useSwarmStore';
import { StepType } from '@/types/swarm';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';
import { copyToClipboard } from '@/lib/utils/clipboard';

export function AgentTerminal() {
  const { thoughtLogs, clearLogs, isDeliberating } = useSwarmStore();
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const [activeStepFilter, setActiveStepFilter] = useState<StepType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  useEffect(() => {
    if (autoScroll) {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thoughtLogs, autoScroll]);

  const filteredLogs = thoughtLogs.filter((log) => {
    const matchesStep = activeStepFilter === 'ALL' || log.stepType === activeStepFilter;
    const matchesSearch =
      searchTerm === '' ||
      log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStep && matchesSearch;
  });

  const handleCopyLogs = async () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.agentName}] [${l.stepType}]: ${l.content}`)
      .join('\n');
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      tacticalAudio.playRadarPing(1050, 0.1);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-[520px] flex-col rounded-2xl border border-slate-800 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-md">
      {/* Terminal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Swarm Live Reasoning & Consensus Stream
          </h3>
          {isDeliberating && (
            <span className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 animate-pulse">
              <Cpu className="h-3 w-3" />
              STREAMING
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 rounded border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            title="Copy Logs"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={clearLogs}
            className="flex items-center gap-1 rounded border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            title="Clear Stream"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
        {/* Step Type Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1">
          {(['ALL', 'PERCEPTION', 'TOOL_CALL', 'REASONING', 'DECISION', 'ACTION'] as const).map((step) => (
            <button
              key={step}
              onClick={() => setActiveStepFilter(step)}
              className={`rounded-md px-2 py-0.5 font-mono text-[10px] border transition whitespace-nowrap ${
                activeStepFilter === step
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {step}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-48">
          <Search className="absolute left-2.5 top-2 h-3 w-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search reasoning traces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-7 pr-2 py-1 text-[11px] font-mono text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Terminal Log Output */}
      <div className="mt-3 flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-slate-500 space-y-2 text-center p-4">
            <Radio className="h-8 w-8 text-slate-700 animate-pulse" />
            <p className="text-xs">
              {thoughtLogs.length === 0
                ? 'Swarm communication bus idle. Trigger an incident simulation to observe agent deliberation.'
                : 'No logs match current filter criteria.'}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const stepBadgeColors = {
              PERCEPTION: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
              REASONING: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
              TOOL_CALL: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
              CROSS_AGENT_COMM: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
              DECISION: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
              ACTION: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            }[log.stepType] || 'bg-slate-800 text-slate-300';

            return (
              <div
                key={log.id}
                className="rounded-lg border border-slate-900 bg-slate-900/50 p-2.5 transition hover:border-slate-800"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="font-bold text-cyan-400">{log.agentName}</span>
                  </div>
                  <span className={`rounded border px-1.5 py-0.5 uppercase font-semibold ${stepBadgeColors}`}>
                    {log.stepType.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-1.5 flex items-start gap-2 text-slate-200 text-xs">
                  <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-slate-500 mt-0.5" />
                  <p className="leading-relaxed">{log.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={terminalBottomRef} />
      </div>

      {/* Terminal Footer with Count */}
      <div className="mt-2 flex items-center justify-between border-t border-slate-900 pt-2 text-[10px] font-mono text-slate-500">
        <span>Showing {filteredLogs.length} of {thoughtLogs.length} events</span>
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`px-1.5 py-0.5 rounded border transition ${
            autoScroll ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40' : 'border-slate-800 text-slate-500'
          }`}
        >
          Auto-Scroll: {autoScroll ? 'ON' : 'PAUSED'}
        </button>
      </div>
    </div>
  );
}
