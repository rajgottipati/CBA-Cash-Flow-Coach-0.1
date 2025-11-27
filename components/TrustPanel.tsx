import React, { useRef, useEffect } from 'react';
import { TrustStep } from '../types';
import { CheckCircle2, Circle, Loader2, XCircle, AlertTriangle, Code, ShieldAlert } from 'lucide-react';

interface TrustPanelProps {
  steps: TrustStep[];
}

export const TrustPanel: React.FC<TrustPanelProps> = ({ steps }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps]);

  return (
    <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col h-full hidden lg:flex">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h3 className="font-semibold text-sm text-slate-300 flex items-center gap-2">
          <ShieldAlert size={16} className="text-emerald-500" />
          Trust Layer & Governance
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {steps.length === 0 && (
          <div className="text-center mt-10 text-slate-600 text-sm">
            <p>Ready to inspect</p>
            <p className="text-xs mt-1">Awaiting interaction trace...</p>
          </div>
        )}

        {steps.map((step) => (
          <div key={step.id} className="relative pl-6 pb-2">
            {/* Connector Line */}
            <div className="absolute left-[9px] top-6 bottom-0 w-px bg-slate-800 last:hidden"></div>
            
            {/* Status Icon */}
            <div className="absolute left-0 top-0">
              {step.status === 'pending' && <Circle size={20} className="text-slate-600" />}
              {step.status === 'processing' && <Loader2 size={20} className="text-cba-yellow animate-spin" />}
              {step.status === 'success' && <CheckCircle2 size={20} className="text-emerald-500" />}
              {step.status === 'warning' && <AlertTriangle size={20} className="text-orange-500" />}
              {step.status === 'error' && <XCircle size={20} className="text-red-500" />}
            </div>

            {/* Content */}
            <div className="space-y-1">
              <div className={`text-sm font-medium ${step.status === 'processing' ? 'text-cba-yellow' : 'text-slate-200'}`}>
                {step.label}
              </div>
              
              {step.details && (
                <div className="text-xs text-slate-400">
                  {step.details}
                </div>
              )}

              {step.jsonPayload && (
                <div className="mt-2 bg-slate-900 rounded p-2 border border-slate-800 overflow-hidden">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1 border-b border-slate-800 pb-1">
                    <Code size={10} /> JSON TRACE
                  </div>
                  <pre className="text-[10px] font-mono text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(step.jsonPayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-900 text-[10px] text-slate-500 text-center font-mono">
        SYSTEM SECURE • ENCRYPTED • AUDIT LOG ON
      </div>
    </div>
  );
};