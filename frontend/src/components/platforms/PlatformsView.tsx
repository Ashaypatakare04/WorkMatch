import React, { useState } from 'react';
import {
  Network,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Key,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  ArrowRight,
  Radio
} from 'lucide-react';
import { PlatformConnectionState } from '../../types/index.js';

interface PlatformsViewProps {
  platforms: PlatformConnectionState[];
  onConnect: (platformId: string, creds?: any) => void;
  onDisconnect: (platformId: string) => void;
}

export const PlatformsView: React.FC<PlatformsViewProps> = ({
  platforms,
  onConnect,
  onDisconnect
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConnectionState | null>(null);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleConnectSubmit = () => {
    if (selectedPlatform) {
      onConnect(selectedPlatform.platformId, {
        client_id: clientId,
        client_secret: clientSecret
      });
      setSelectedPlatform(null);
      setClientId('');
      setClientSecret('');
    }
  };

  const getPlatformBrand = (id: string) => {
    switch (id) {
      case 'upwork':
        return {
          badgeClass: 'badge-upwork',
          dotColor: 'bg-emerald-400 shadow-glow-emerald',
          accentBorder: 'hover:border-emerald-500/40',
          accentText: 'text-emerald-400',
          bgGlow: 'from-emerald-500/10 via-transparent to-transparent',
          tag: 'Official Partner API'
        };
      case 'fiverr':
        return {
          badgeClass: 'badge-fiverr',
          dotColor: 'bg-cyan-400 shadow-glow-cyan',
          accentBorder: 'hover:border-cyan-500/40',
          accentText: 'text-cyan-400',
          bgGlow: 'from-cyan-500/10 via-transparent to-transparent',
          tag: 'Direct Gig & Buyer Match'
        };
      default:
        return {
          badgeClass: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
          dotColor: 'bg-indigo-400',
          accentBorder: 'hover:border-indigo-500/40',
          accentText: 'text-indigo-400',
          bgGlow: 'from-indigo-500/10 via-transparent to-transparent',
          tag: 'Direct Connector'
        };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Bi-Directional Adapters
            </span>
            <span className="text-xs text-slate-500 font-mono">Zero Silent Overrides</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            Connected Work Platforms
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            WorkMatch AI interfaces with leading freelance marketplaces via secure OAuth and headless sync adapters. Capabilities adapt dynamically to each platform&apos;s declared permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-surface-900/80 border border-white/[0.08] flex items-center gap-2.5 shadow-sm">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-medium">Gateway Protocol</span>
              <span className="text-xs font-mono font-semibold text-white">OAuth 2.0 & Simulation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map(p => {
          const isConnected = p.status === 'CONNECTED';
          const brand = getPlatformBrand(p.platformId);

          return (
            <div
              key={p.platformId}
              className={`glass-card glass-card-hover relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${brand.accentBorder}`}
            >
              {/* Subtle top brand glow */}
              <div className={`absolute top-0 left-0 right-0 h-28 bg-gradient-to-b ${brand.bgGlow} pointer-events-none`} />

              <div className="relative space-y-5">
                {/* Platform Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${brand.badgeClass}`}>
                        {p.name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase ${
                        p.mode === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : p.mode === 'MOCK'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-surface-800 text-slate-400 border border-white/10'
                      }`}>
                        {p.mode}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {brand.tag}
                    </span>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    isConnected
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-surface-900 border-white/10 text-slate-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isConnected ? brand.dotColor : 'bg-slate-600'}`} />
                    <span className="font-mono text-[11px] uppercase tracking-wider">{p.status}</span>
                  </div>
                </div>

                {/* Sync Status Banner */}
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface-950/60 border border-white/[0.05] text-xs">
                  <span className="text-slate-400 font-medium">Last Sync:</span>
                  <span className="font-mono text-slate-200">
                    {p.lastSync
                      ? `${new Date(p.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Live`
                      : 'Awaiting sync'}
                  </span>
                </div>

                {/* Capability Matrix */}
                <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Declared Capabilities
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">REST v2</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-900/40 border border-white/[0.04]">
                      <span className="text-slate-300">Opportunity Search</span>
                      {p.capabilities.job_search ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <XCircle className="w-3.5 h-3.5" /> Restricted
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-900/40 border border-white/[0.04]">
                      <span className="text-slate-300">Deep Parsing & Skills</span>
                      {p.capabilities.job_details ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <XCircle className="w-3.5 h-3.5" /> Restricted
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-900/40 border border-white/[0.04]">
                      <span className="text-slate-300">Client Reputation Data</span>
                      {p.capabilities.client_details ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <XCircle className="w-3.5 h-3.5" /> Restricted
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-900/40 border border-white/[0.04]">
                      <span className="text-slate-300">Proposal Submission</span>
                      {p.capabilities.applications ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Auto/Assisted
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-amber-400">
                          <AlertCircle className="w-3.5 h-3.5" /> 1-Click Copy
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 leading-tight">
                  {p.platformId === 'fiverr'
                    ? 'Proposals require 1-click clipboard transfer'
                    : 'Native submission & simulation supported'}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
                  {isConnected ? (
                    <button
                      onClick={() => onDisconnect(p.platformId)}
                      className="w-full sm:w-auto text-center px-3.5 py-1.5 rounded-xl bg-surface-900 hover:bg-red-500/15 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-semibold transition shadow-sm"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedPlatform(p)}
                      className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center gap-1.5"
                    >
                      <span>Connect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Modal */}
      {selectedPlatform && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="glass-card bg-surface-900/95 border border-white/15 rounded-3xl max-w-md w-full p-7 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    Connect {selectedPlatform.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Secure Token Dispatch</span>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-surface-800 text-slate-300 border border-white/10">
                AES-256
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter official OAuth API credentials to enable live synchronization. Leave fields blank to connect in <span className="text-cyan-400 font-semibold">Mock Simulation Mode</span> with full realistic marketplace data.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">
                  Client ID / Public API Key:
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  placeholder="Optional (blank defaults to Simulation Mode)"
                  className="w-full bg-surface-950 border border-white/10 rounded-xl p-3 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">
                  Client Secret / Access Token:
                </label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={e => setClientSecret(e.target.value)}
                  placeholder="Optional encrypted secret"
                  className="w-full bg-surface-950 border border-white/10 rounded-xl p-3 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedPlatform(null)}
                className="px-4 py-2 rounded-xl bg-surface-800 text-slate-300 text-xs font-semibold hover:bg-surface-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectSubmit}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
              >
                Save &amp; Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
