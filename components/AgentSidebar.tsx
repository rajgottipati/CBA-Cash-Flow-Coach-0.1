import React from 'react';
import { AgentType, AgentStatus } from '../types';
import { Activity, ShieldAlert, BookOpen, Calculator, Landmark } from 'lucide-react';

interface AgentSidebarProps {
  agentStates: Record<AgentType, AgentStatus>;
}

const AgentCard = ({ type, status, icon: Icon, label, desc }: { type: AgentType, status: AgentStatus, icon: any, label: string, desc: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'thinking': return 'border-cba-yellow bg-yellow-900/20 text-cba-yellow animate-pulse';
      case 'active': return 'border-green-500 bg-green-900/20 text-green-400';
      case 'error': return 'border-red-500 bg-red-900/20 text-red-400';
      case 'blocked': return 'border-red-500 bg-red-900/20 text-red-400';
      default: return 'border-slate-700 text-slate-500';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor()} transition-all duration-300`}>
      <div className={`p-2 rounded-full ${status === 'idle' ? 'bg-slate-800' : 'bg-slate-900'}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs opacity-70">{status === 'idle' ? desc : status.toUpperCase()}</div>
      </div>
      {status === 'thinking' && (
        <Activity size={16} className="ml-auto animate-spin" />
      )}
    </div>
  );
};

export const AgentSidebar: React.FC<AgentSidebarProps> = ({ agentStates }) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col p-4 gap-4 h-full hidden md:flex">
      <div className="mb-4">
        <h2 className="text-cba-yellow font-bold text-lg tracking-wider">ORCHESTRA</h2>
        <p className="text-slate-400 text-xs">CBA Virtual Relationship Manager</p>
      </div>

      <div className="space-y-3 flex-1">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Active Agents</div>
        
        <AgentCard 
          type="analyst" 
          status={agentStates.analyst} 
          icon={Calculator} 
          label="Analyst" 
          desc="Forecasting & Data" 
        />
        <AgentCard 
          type="strategist" 
          status={agentStates.strategist} 
          icon={BookOpen} 
          label="Strategist" 
          desc="RAG & Benchmarks" 
        />
        <AgentCard 
          type="banker" 
          status={agentStates.banker} 
          icon={Landmark} 
          label="Banker" 
          desc="Nexus Policy Engine" 
        />
      </div>

      <div className="pt-4 border-t border-slate-700">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Security Layer</div>
        <AgentCard 
          type="sentinel" 
          status={agentStates.sentinel} 
          icon={ShieldAlert} 
          label="Sentinel" 
          desc="Guardrails & Compliance" 
        />
      </div>
    </div>
  );
};