'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Trash2,
  Compass,
  ArrowRight,
  Flame,
  Waves,
  Zap,
  Shield,
  Activity,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';
import { ChatAction, ChatDataWidget } from '@/lib/ai/drishtiChatEngine';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
  dataWidget?: ChatDataWidget;
}

const QUICK_PROMPTS = [
  { label: '🇮🇳 National Situation', prompt: 'What is the current national disaster situation in India?' },
  { label: '🌊 Brahmaputra Flood', prompt: 'What is the flood status of Brahmaputra and Assam?' },
  { label: '🔥 NASA Fire Hotspots', prompt: 'Show active NASA FIRMS wildfire hotspots in India.' },
  { label: '⚡ Seismic Hazards', prompt: 'Are there any recent earthquakes or active seismic fault zones?' },
  { label: '🗺️ Odisha Cyclone Risk', prompt: 'What is the disaster threat status in Odisha?' },
  { label: '🗺️ Kerala Landslide Risk', prompt: 'Disaster report for Kerala and Wayanad' },
  { label: '🛡️ NDRF Force Matrix', prompt: 'What is the readiness of the 16 NDRF battalions and boats?' },
  { label: '🤖 Swarm Agent Architecture', prompt: 'Explain the 8 AI Swarm agents and how they work.' },
  { label: '🧪 Physics Models', prompt: 'What physics formulas are used for Rothermel and Bathtub inundation?' },
];

export function DrishtiChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `### 🤖 Welcome to DRISHTI Tactical AI Assistant\n\nI am your live intelligence companion for **India's Natural Disaster Management**. You can ask me anything about:\n- 🇮🇳 **Live State Risk & Telemetry** (Assam, Odisha, Kerala, Delhi, Uttarakhand, etc.)\n- 🌊 **River Basins & Inundation** (Brahmaputra, Ganga, Mahanadi, Yamuna)\n- 🔥 **NASA FIRMS Satellite Wildfires** & Thermal Radiative Power\n- ⚡ **USGS Seismological Hypocenters** & Tectonic Faults\n- 🛡️ **NDRF Battalion Deployments** & Digital SOP Checklists\n- 🤖 **8-Agent Autonomous Swarm Architecture** & Physics Formulas\n\nSelect a quick briefing topic below or type your query!`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Speech Recognition Setup (STT)
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        tacticalAudio.playRadarPing(600, 0.08);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Strip markdown syntax for natural voice synthesis
      const cleanText = text
        .replace(/###|##|#|\*\*|\*|`|\$|_|\|/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .slice(0, 300);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle message sending
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    tacticalAudio.playRadarPing(750, 0.06);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.success && data.content) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          actions: data.actions,
          dataWidget: data.dataWidget,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        tacticalAudio.playRadarPing(880, 0.08);

        if (ttsEnabled) {
          speakText(data.content);
        }
      } else {
        throw new Error(data.error || 'Failed to get intelligence response.');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Connection Error**: Unable to reach DRISHTI neural service (${err.message || 'Network Timeout'}). Please verify connection and try again.`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    tacticalAudio.playRadarPing(900, 0.08);
    if (action.type === 'NAVIGATE' && typeof action.payload === 'string') {
      router.push(action.payload);
    } else if (action.type === 'FLY_MAP') {
      router.push(`/?lat=${action.payload.center[1]}&lng=${action.payload.center[0]}&zoom=${action.payload.zoom}`);
    }
  };

  // Render markdown text formatted cleanly
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm font-bold text-cyan-300 mt-2.5 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Heading 4
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-xs font-semibold text-slate-200 mt-2 mb-1 flex items-center gap-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      // Bullet point
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-*]\s+/, '');
        return (
          <div key={idx} className="text-xs text-slate-300 ml-2.5 my-0.5 flex items-start gap-1.5 leading-relaxed">
            <span className="text-cyan-400 mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(bulletText) }} />
          </div>
        );
      }
      // Numbered list
      if (/^\d+\.\s+/.test(line.trim())) {
        return (
          <div key={idx} className="text-xs text-slate-300 ml-2 my-1 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </div>
        );
      }
      // Table Row
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (line.includes('---')) return null; // table separator
        const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
        const isHeader = idx > 0 && lines[idx - 1]?.startsWith('|') === false;
        return (
          <div key={idx} className={`grid grid-cols-${cols.length} gap-1 my-0.5 py-1 px-1.5 rounded text-[11px] font-mono ${isHeader ? 'bg-slate-900 font-bold text-cyan-400' : 'bg-slate-950/40 text-slate-300 border-b border-white/[0.04]'}`}>
            {cols.map((c, i) => (
              <span key={i} dangerouslySetInnerHTML={{ __html: formatInline(c) }} />
            ))}
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    });
  };

  // Inline formatting helper
  const formatInline = (text: string) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-cyan-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-cyan-950/50 text-cyan-300 border border-cyan-800/40 px-1 py-0.5 rounded text-[10px] font-mono">$1</code>');
  };

  return (
    <>
      {/* Floating Tactical Launcher Pill */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            tacticalAudio.playRadarPing(880, 0.1);
          }}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 rounded-full bg-slate-950/90 border border-cyan-500/40 px-4 py-2.5 shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] backdrop-blur-xl transition-all duration-300"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 group-hover:scale-105 transition-transform">
            <span className="absolute -inset-0.5 rounded-full bg-cyan-400 opacity-30 blur-sm group-hover:opacity-60 transition" />
            <Bot className="relative h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100 font-mono tracking-tight">
              <span>DRISHTI AI</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-cyan-400/80 font-medium">Disaster Intelligence & Query</div>
          </div>
        </button>
      )}

      {/* Main Interactive Tactical Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-[0_10px_50px_rgba(0,0,0,0.8)] border border-cyan-500/30 bg-slate-950/95 backdrop-blur-2xl flex flex-col ${
            isExpanded
              ? 'inset-4 md:inset-10 rounded-2xl'
              : 'bottom-6 right-4 md:right-6 w-[94vw] md:w-[460px] h-[640px] max-h-[88vh] rounded-2xl'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-slate-900/60 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100 font-mono tracking-wider">
                  <span>DRISHTI TACTICAL AI</span>
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] text-emerald-300 font-sans">
                    LIVE
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  Real-Time Disaster RAG • NASA • CWC • USGS
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1.5 text-slate-400">
              {/* TTS Voice Toggle */}
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-1.5 rounded-lg border transition ${
                  ttsEnabled
                    ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                    : 'border-white/[0.06] hover:bg-slate-800 text-slate-400'
                }`}
                title={ttsEnabled ? 'Voice Output ON' : 'Enable Voice Output'}
              >
                {ttsEnabled ? <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>

              {/* Clear History */}
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      role: 'assistant',
                      content: `Conversation reset. Ready for next query regarding India's multi-hazard telemetry or swarm agents.`,
                      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                }}
                className="p-1.5 rounded-lg border border-white/[0.06] hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Clear Conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              {/* Expand / Shrink */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg border border-white/[0.06] hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title={isExpanded ? 'Restore Size' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="p-1.5 rounded-lg border border-white/[0.06] hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 transition"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Category Chips Bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.04] bg-slate-900/30 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap rounded-full border border-white/[0.08] bg-slate-900/70 hover:bg-cyan-950/40 hover:border-cyan-500/40 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-cyan-200 transition disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 mt-1">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-xl p-3.5 transition-all ${
                    msg.role === 'user'
                      ? 'bg-cyan-600/20 border border-cyan-500/40 text-slate-100 shadow-md ml-8'
                      : 'bg-slate-900/80 border border-white/[0.08] text-slate-200 shadow-lg'
                  }`}
                >
                  {/* Content */}
                  <div className="space-y-1">{renderMarkdown(msg.content)}</div>

                  {/* Rich Data Widget Card */}
                  {msg.dataWidget && (
                    <div className="mt-3 p-2.5 rounded-lg border border-cyan-500/30 bg-slate-950/70">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                          {msg.dataWidget.title}
                        </span>
                        {msg.dataWidget.severity && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                              msg.dataWidget.severity === 'RED'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : msg.dataWidget.severity === 'ORANGE'
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {msg.dataWidget.severity}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {msg.dataWidget.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="bg-slate-900/60 p-1.5 rounded border border-white/[0.04]">
                            <div className="text-[10px] text-slate-400">{m.label}</div>
                            <div className={`text-xs font-bold font-mono ${m.color || 'text-slate-100'}`}>
                              {m.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {msg.dataWidget.tags && (
                        <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-white/[0.04]">
                          {msg.dataWidget.tags.map((t, tIdx) => (
                            <span key={tIdx} className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-white/[0.04]">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/[0.06]">
                      {msg.actions.map((act) => (
                        <button
                          key={act.id}
                          onClick={() => handleActionClick(act)}
                          className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 hover:border-cyan-400 px-2.5 py-1 text-[11px] font-medium text-cyan-200 transition"
                        >
                          {act.type === 'FLY_MAP' && <Compass className="h-3 w-3 text-cyan-400" />}
                          {act.type === 'NAVIGATE' && <ArrowRight className="h-3 w-3 text-cyan-400" />}
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="mt-1 text-right text-[9px] font-mono text-slate-500">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs font-mono">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  <Bot className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/60 border border-white/[0.06] px-3 py-2 rounded-xl">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Synthesizing live sensor telemetry & state models...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 border-t border-white/[0.08] bg-slate-900/70 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask anything about Assam floods, active fires, earthquakes, NDRF..."
                  className="w-full rounded-xl border border-white/[0.08] bg-slate-950/80 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 font-sans"
                />
              </div>

              {/* Voice Speech Recognition Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-xl border transition ${
                  isListening
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300 animate-pulse'
                    : 'border-white/[0.08] bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={isListening ? 'Listening...' : 'Voice Input'}
              >
                {isListening ? <Mic className="h-4 w-4 text-rose-400" /> : <Mic className="h-4 w-4" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="flex items-center justify-center p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
