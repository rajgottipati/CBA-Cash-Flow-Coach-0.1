
import React, { useRef, useEffect } from 'react';
import { TrustEvent } from '../types';
import { ShieldCheck, Lock, Activity, Terminal } from 'lucide-react';

interface Props {
  logs: TrustEvent[];
}

export const TrustPanel: React.FC<Props> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getIcon = (cat: string) => {
    switch(cat) {
      case 'PII': return Lock;
      case 'NEXUS': return ShieldCheck;
      default: return Activity;
    }
  };

  const getColor = (status: string) => {
    switch(status) {
      case 'PASS': return 'text-emerald-400';
      case 'FAIL': return 'text-red-400';
      case 'WARN': return 'text-amber-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0f1e] text-slate-300 font-mono text-xs border-l border-slate-800 w-80 shadow-2xl z-20">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-[#0f1629]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-slate-400" />
          <span className="font-bold tracking-wider text-slate-200">TRUST_LAYER_V2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] text-emerald-500">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
        {logs.length === 0 && (
          <div className="opacity-30 text-center mt-10">
            AWAITING_SEQUENCE_INIT...
          </div>
        )}
        {logs.map((log) => {
          const Icon = getIcon(log.category);
          return (
            <div key={log.id} className="animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px]">
                <span>{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}</span>
                <span>::</span>
                <span>{log.category}</span>
              </div>
              <div className="bg-[#131b2e] p-2 rounded border-l-2 border-slate-700 hover:border-slate-500 transition-colors">
                <div className="flex items-start gap-2">
                  <Icon size={14} className={`mt-0.5 shrink-0 ${getColor(log.status)}`} />
                  <div>
                    <div className="leading-tight">{log.message}</div>
                    {log.metadata && (
                      <pre className="mt-1.5 text-[9px] text-slate-500 bg-[#0a0f1e] p-1 rounded overflow-x-hidden">
                        {JSON.stringify(log.metadata, null, 1).replace(/"|{|}/g, '')}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      
      <div className="p-2 border-t border-slate-800 bg-[#0f1629] text-[9px] text-center text-slate-600">
        AUDIT_ID: 8829-XJ-291 • ENCRYPTION: AES-256
      </div>
    </div>
  );
};
