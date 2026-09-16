import React, { useState } from 'react';
import {
  Network,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Key,
  RefreshCw,
  ExternalLink,
  ShieldCheck
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Connected Work Platforms
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          WorkMatch AI operates through modular connectors. Capabilities adapt dynamically to each platform's API permissions.
        </p>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map(p => {
          const isConnected = p.status === 'CONNECTED';
          return (
            <div
              key={p.platformId}
              className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Platform Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{p.name}</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                        p.mode === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : p.mode === 'MOCK'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {p.mode} MODE
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {p.lastSync ? `Synced ${new Date(p.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not synced'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                    <span className={isConnected ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Capability Matrix */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">Declared Connector Capabilities:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      {p.capabilities.job_search ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Job Opportunity Search</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      {p.capabilities.job_details ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Deep Requirement Parsing</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      {p.capabilities.client_details ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Client Reputation Data</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      {p.capabilities.applications ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Proposal Submission</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {p.platformId === 'fiverr'
                    ? 'Proposals require manual copy to Fiverr'
                    : 'Full API & simulation supported'}
                </span>

                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <button
                      onClick={() => onDisconnect(p.platformId)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 text-xs font-medium transition"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedPlatform(p)}
                      className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition"
                    >
                      Connect Platform
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Connect to {selectedPlatform.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter official OAuth API credentials or leave blank to run in high-fidelity mock simulation mode.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Client ID / Key:</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  placeholder="Optional (defaults to Mock Simulation)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Client Secret / Token:</label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={e => setClientSecret(e.target.value)}
                  placeholder="Optional encrypted secret"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPlatform(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectSubmit}
                className="px-4 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
