
import React from 'react';
import { Shield, Brain, Activity, Database, Lock } from 'lucide-react';

export const NexusArchitecture: React.FC = () => {
  return (
    <div className="p-8 space-y-8 flex flex-col items-center">
       <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-4xl w-full relative">
           <h2 className="text-white font-bold mb-8 text-center">Nexus Governance Engine Architecture</h2>
           
           <div className="flex justify-center gap-8 mb-12">
               <div className="p-4 bg-slate-800 rounded border border-slate-600 flex flex-col items-center">
                   <Shield className="text-amber-500 mb-2" />
                   <span className="text-xs font-bold text-slate-300">Policy Service</span>
                   <span className="text-[9px] text-slate-500">Deterministic Rules</span>
               </div>
               <div className="p-4 bg-slate-800 rounded border border-slate-600 flex flex-col items-center">
                   <Activity className="text-blue-500 mb-2" />
                   <span className="text-xs font-bold text-slate-300">Risk Model</span>
                   <span className="text-[9px] text-slate-500">AWS Sagemaker</span>
               </div>
               <div className="p-4 bg-slate-800 rounded border border-slate-600 flex flex-col items-center">
                   <Brain className="text-purple-500 mb-2" />
                   <span className="text-xs font-bold text-slate-300">GenAI Analyst</span>
                   <span className="text-[9px] text-slate-500">Bedrock Claude</span>
               </div>
           </div>

           <div className="flex justify-center mb-8">
               <div className="w-64 h-24 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center relative">
                   <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Orchestration Layer</span>
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-600"></div>
               </div>
           </div>

           <div className="flex justify-center">
               <div className="p-4 bg-slate-950 rounded border border-slate-800 flex items-center gap-4">
                   <Database className="text-slate-500" />
                   <div className="text-left">
                       <div className="text-xs font-bold text-slate-300">Immutable Audit Log</div>
                       <div className="text-[9px] text-slate-500">DynamoDB (WORM)</div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};
