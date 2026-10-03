import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, Check, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface AutoAlert {
  id: string;
  title: string;
  score: number;
  timeAgo: string;
  platform: string;
  rate: string;
}

const INITIAL_ALERTS: AutoAlert[] = [
  { id: '1', title: 'Frontend Developer', score: 96, timeAgo: '2m ago', platform: 'Upwork', rate: '$55/hr' },
  { id: '2', title: 'React Developer', score: 94, timeAgo: '8m ago', platform: 'Direct Inbound', rate: '$60/hr' },
  { id: '3', title: 'AI Web Developer', score: 91, timeAgo: '14m ago', platform: 'Freelancer', rate: '$50/hr' }
];

export const AutomationRadarDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<AutoAlert[]>(INITIAL_ALERTS);
  const [isScanning, setIsScanning] = useState(true);

  // Periodic pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 select-none">
      <div className="rounded-3xl bg-[#0D1322] border-2 border-[#1B253B] shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Radar Scanning Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1B253B]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-[#172238] border border-[#20D3C2]/40 flex items-center justify-center text-[#20D3C2]">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#20D3C2] animate-ping" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#20D3C2] uppercase font-bold tracking-wider block">
                BACKGROUND AUTONOMOUS RADAR
              </span>
              <h4 className="text-xl font-bold text-[#F4F7FB] font-display">
                Automated Opportunity Stream
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#111A2E] border border-[#20D3C2]/30 text-xs font-mono text-[#20D3C2] font-semibold flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Daemon Worker: ACTIVE</span>
            </span>
          </div>
        </div>

        {/* Live Discovered Alerts Feed (Section 08 Specification) */}
        <div className="py-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA8BC]">
            <span>Recent High-Fit Discoveries:</span>
            <span className="text-[#35D07F] font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>3 new opportunities found</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {alerts.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#111A2E] border border-[#1B253B] hover:border-[#20D3C2]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#070A12] border border-[#22324F] flex items-center justify-center text-[#20D3C2] text-xs font-mono font-bold flex-shrink-0">
                    <Zap className="w-4 h-4 text-[#20D3C2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#20D3C2] uppercase tracking-wider">
                        MATCH FOUND
                      </span>
                      <span className="text-[10px] text-[#9AA8BC] font-mono">• {item.timeAgo}</span>
                    </div>
                    <h5 className="text-sm font-bold text-[#F4F7FB] mt-0.5">{item.title}</h5>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-xs font-mono text-[#9AA8BC]">{item.platform} ({item.rate})</span>
                  <div className="px-3 py-1 rounded-xl bg-[#20D3C2]/15 border border-[#20D3C2]/30 text-xs font-mono font-extrabold text-[#20D3C2]">
                    {item.score}% FIT
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Footer */}
        <div className="pt-4 border-t border-[#1B253B] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#9AA8BC]">
          <span>Notifications trigger only when match score exceeds your calibrated 90% threshold.</span>
          <span className="text-[#F4F7FB] font-semibold">Zero Spam · Pure Signal</span>
        </div>
      </div>
    </div>
  );
};
