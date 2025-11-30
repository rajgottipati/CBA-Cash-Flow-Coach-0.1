
import React from 'react';
import { AgentNode, AppContext } from '../types';
import { ShieldCheck, BrainCircuit, Landmark, Scale, FileText, ArrowRight } from 'lucide-react';

interface Props {
  activeNode: AgentNode;
  context: AppContext;
}

export const AgentOrchestrator: React.FC<Props> = ({ activeNode, context }) => {
  const isBiz = context === 'BUSINESS' || context === 'COACH';
  const isArch = context === 'ARCHITECTURE';

  // If in Architecture view, we might hide this mini-view or keep it static
  if (isArch) return null;
  
  const Node = ({ id, label, icon: Icon }: { id: AgentNode, label: string, icon: any }) => {
    const isActive = activeNode === id;
    
    // Dynamic styles based on state
    let bgClass = 'bg-slate-100 border-slate-200 text-slate-400'; // Default inactive
    let activeClass = '';

    if (isBiz) {
        bgClass = 'bg-slate-800 border-slate-700 text-slate-500'; // Dark mode inactive
        if (isActive) {
            // Coach/Biz highlight
            activeClass = context === 'BUSINESS' 
                ? 'bg-cba-yellow border-white text-black shadow-[0_0_15px_rgba(255,204,0,0.5)] scale-110 z-10'
                : 'bg-indigo-500 border-white text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110 z-10';
        }
    } else {
        // Personal mode (Light)
        if (isActive) {
            activeClass = 'bg-emerald-500 border-white text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110 z-10';
        }
    }

    return (
      <div className="flex flex-col items-center gap-1 relative group">
        <div className={`
          w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border transition-all duration-300
          ${isActive ? activeClass : bgClass}
        `}>
          <Icon size={16} className="md:w-5 md:h-5" />
        </div>
        <span className={`text-[8px] font-bold tracking-wider uppercase transition-colors duration-300 absolute -bottom-4 whitespace-nowrap ${isActive ? (isBiz ? (context === 'BUSINESS' ? 'text-cba-yellow' : 'text-indigo-400') : 'text-emerald-600') : 'text-transparent group-hover:text-slate-500'}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between w-full max-w-lg px-4 relative">
      {/* Connecting Line */}
      <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-0"></div>
      
      {/* Nodes - Flexbox Distribution */}
      <div className="relative z-10 bg-inherit"><Node id="SENTINEL" label="Sentinel" icon={ShieldCheck} /></div>
      <div className="relative z-10 bg-inherit"><Node id="ANALYST" label="Analyst" icon={BrainCircuit} /></div>
      
      {/* Branching based on Context */}
      <div className="relative z-10 bg-inherit">
        {isBiz ? (
          <Node id="BANKER" label="Banker" icon={Landmark} />
        ) : (
          <Node id="STRATEGIST" label="Strategist" icon={FileText} />
        )}
      </div>
      
      <div className="relative z-10 bg-inherit"><Node id="NEXUS" label="Nexus" icon={Scale} /></div>
      <div className="relative z-10 bg-inherit"><Node id="OUTPUT" label="Output" icon={ArrowRight} /></div>
    </div>
  );
};
