
import React, { useState } from 'react';
import { AppConfig, AuditRecord, DecisionStatus } from '../types';
import { NexusSidebar } from './NexusSidebar';
import { NexusLoanConsole } from './NexusLoanConsole';
import { NexusBatchSimulation } from './NexusBatchSimulation';
import { NexusAuditLog } from './NexusAuditLog';
import { NexusArchitecture } from './NexusArchitecture';
import { NexusCustomerPortal } from './NexusCustomerPortal';
import { LayoutDashboard, Database, FileText, Network } from 'lucide-react';

const DEFAULT_CONFIG: AppConfig = {
  minCreditScore: 600,
  maxLoanAmount: 50000,
  aiConfidenceThreshold: 80,
  strictIndustryChecking: true,
};

export const NexusGovernanceView: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [reviewQueue, setReviewQueue] = useState<AuditRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'console' | 'batch' | 'audit' | 'arch'>('console');
  // CHANGE: Default to CUSTOMER (Applicant)
  const [viewMode, setViewMode] = useState<'BANKER' | 'CUSTOMER'>('CUSTOMER');

  const handleReset = () => setConfig(DEFAULT_CONFIG);

  const handleNewDecision = (record: AuditRecord) => {
    if (record.finalStatus === DecisionStatus.HITL_REVIEW) {
        setReviewQueue(prev => [...prev, record]);
        if (viewMode === 'CUSTOMER') {
            setViewMode('BANKER');
            setActiveTab('console');
        }
    } else {
        setHistory((prev) => [...prev, record]);
         if (viewMode === 'CUSTOMER') {
            setViewMode('BANKER');
            setActiveTab('audit');
        }
    }
  };

  const handleQueueResolution = (record: AuditRecord) => {
      setReviewQueue(prev => prev.filter(item => item.applicationId !== record.applicationId));
      setHistory(prev => [...prev, record]);
  };

  const isBanker = viewMode === 'BANKER';

  return (
    <div className="flex flex-1 h-full bg-slate-950 overflow-hidden">
      <NexusSidebar 
        config={config} 
        setConfig={setConfig} 
        onReset={handleReset} 
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
         {/* Internal Header (Banker Mode) */}
         {isBanker && (
             <div className="flex justify-between items-end mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div>
                     <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Governance Dashboard</h1>
                     <p className="text-slate-500 mt-1">Nexus: Intelligent Lending Governance Engine</p>
                  </div>
                  
                  <div className="flex bg-slate-900 rounded-lg p-1 shadow-lg border border-slate-800">
                     <button onClick={() => setActiveTab('console')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'console' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <LayoutDashboard className="w-3 h-3" /> Console
                        {reviewQueue.length > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">{reviewQueue.length}</span>}
                     </button>
                     <button onClick={() => setActiveTab('batch')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'batch' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <Database className="w-3 h-3" /> Simulation
                     </button>
                     <button onClick={() => setActiveTab('audit')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'audit' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <FileText className="w-3 h-3" /> Audit Log
                        <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'audit' ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300'}`}>{history.length}</span>
                     </button>
                     <button onClick={() => setActiveTab('arch')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'arch' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <Network className="w-3 h-3" /> Architecture
                     </button>
                  </div>
             </div>
         )}

         <div className="min-h-[600px]">
            {isBanker ? (
                <>
                    {activeTab === 'console' && <NexusLoanConsole config={config} onDecision={handleNewDecision} reviewQueue={reviewQueue} onResolveQueue={handleQueueResolution} />}
                    {activeTab === 'batch' && <NexusBatchSimulation config={config} />}
                    {activeTab === 'audit' && <NexusAuditLog history={history} />}
                    {activeTab === 'arch' && <NexusArchitecture />}
                </>
            ) : (
                <NexusCustomerPortal config={config} onSubmit={handleNewDecision} />
            )}
         </div>
      </main>
    </div>
  );
};
