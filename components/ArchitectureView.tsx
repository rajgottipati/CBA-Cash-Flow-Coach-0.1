import React from 'react';
import { Database, Shield, Brain, Layers, Server, Globe, Lock } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-900 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">System Architecture</h2>
          <p className="text-slate-400">High-level view of the Multi-Agent Orchestra with Trust Layer integration.</p>
        </div>

        {/* Diagram Container */}
        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 relative overflow-hidden">
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

          <div className="relative z-10 flex flex-col gap-12 items-center">
            
            {/* User Layer */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
                <Globe size={18} /> React Frontend
              </div>
              <div className="h-8 w-px bg-slate-600"></div>
            </div>

            {/* Supervisor Layer */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Trust Layer (Left) */}
              <div className="bg-slate-900/80 p-6 rounded-lg border border-emerald-500/30 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-emerald-500/20 pb-2">
                  <Shield size={20} /> Trust Layer
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-800 p-3 rounded text-sm text-slate-300 flex items-center gap-2 border border-slate-700">
                    <Lock size={14} /> PII Redaction
                  </div>
                  <div className="bg-slate-800 p-3 rounded text-sm text-slate-300 flex items-center gap-2 border border-slate-700">
                    <Layers size={14} /> Nexus Policy Gate
                  </div>
                  <div className="bg-slate-800 p-3 rounded text-sm text-slate-300 flex items-center gap-2 border border-slate-700">
                    <Shield size={14} /> Regulatory Check
                  </div>
                </div>
              </div>

              {/* Agents (Center) */}
              <div className="bg-slate-900/80 p-6 rounded-lg border border-cba-yellow/30 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-cba-yellow font-bold border-b border-cba-yellow/20 pb-2">
                  <Brain size={20} /> Agent Swarm
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 p-2 rounded text-xs text-center border border-slate-700">Analyst<br/>(Python)</div>
                  <div className="bg-slate-800 p-2 rounded text-xs text-center border border-slate-700">Strategist<br/>(RAG)</div>
                  <div className="bg-slate-800 p-2 rounded text-xs text-center border border-slate-700">Banker<br/>(Policy)</div>
                  <div className="bg-slate-800 p-2 rounded text-xs text-center border border-slate-700">Sentinel<br/>(Guard)</div>
                </div>
              </div>

              {/* Integration (Right) */}
              <div className="bg-slate-900/80 p-6 rounded-lg border border-blue-500/30 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold border-b border-blue-500/20 pb-2">
                  <Server size={20} /> Core Systems
                </div>
                 <div className="space-y-3">
                  <div className="bg-slate-800 p-3 rounded text-sm text-slate-300 flex items-center gap-2 border border-slate-700">
                    <Database size={14} /> SAP / Oracle
                  </div>
                  <div className="bg-slate-800 p-3 rounded text-sm text-slate-300 flex items-center gap-2 border border-slate-700">
                    <Database size={14} /> Model Gateway
                  </div>
                </div>
              </div>

            </div>

             {/* Arrows/Flow */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                <path d="M400 50 L400 120" stroke="white" strokeWidth="2" />
                <path d="M200 200 L600 200" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
             </svg>

          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-800 rounded border border-slate-700">
             <h3 className="text-white font-bold mb-2">Key Design Principles</h3>
             <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
               <li>Deterministic Supervision (XState) to prevent infinite agent loops.</li>
               <li>"Trust Layer" intercepts prompt before it hits the LLM (PII sanitization).</li>
               <li>Nexus Policy Gate ensures no product offers bypass credit checks.</li>
             </ul>
          </div>
          <div className="p-4 bg-slate-800 rounded border border-slate-700">
             <h3 className="text-white font-bold mb-2">Tech Stack</h3>
             <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
               <li><strong>Frontend:</strong> React + Tailwind + Recharts</li>
               <li><strong>Orchestrator:</strong> Python/LangGraph (Mocked here)</li>
               <li><strong>LLM Gateway:</strong> LiteLLM (Bedrock/OpenAI)</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};