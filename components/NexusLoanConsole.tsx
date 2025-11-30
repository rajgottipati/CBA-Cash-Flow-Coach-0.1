
import React, { useState, useEffect } from 'react';
import { LoanApplication, AppConfig, EngineResult, DecisionStatus, AuditRecord, Industry } from '../types';
import { generateMockApplication } from '../services/nexusMockData';
import { evaluateLoan } from '../services/nexusEngine';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { AlertTriangle, CheckCircle, XCircle, Bot, FileText, Activity, ArrowRight, UserCheck, UserX, Cpu, CloudLightning, Settings2, ArrowLeft, Save, Inbox } from 'lucide-react';

interface LoanConsoleProps {
  config: AppConfig;
  onDecision: (record: AuditRecord) => void;
  reviewQueue: AuditRecord[]; // Injected Queue
  onResolveQueue: (record: AuditRecord) => void;
}

export const NexusLoanConsole: React.FC<LoanConsoleProps> = ({ config, onDecision, reviewQueue, onResolveQueue }) => {
  const [app, setApp] = useState<LoanApplication | null>(null);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [justification, setJustification] = useState('');
  const [activeQueueId, setActiveQueueId] = useState<string | null>(null);
  
  // Custom Scenario State
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customForm, setCustomForm] = useState({
    businessName: "Apex Innovations",
    revenue: 55000,
    creditScore: 650,
    requestedAmount: 45000,
    industry: Industry.TECH,
    description: "Requesting funds to upgrade server infrastructure for new AI project."
  });

  const generateNew = () => {
    setApp(generateMockApplication());
    setResult(null);
    setJustification('');
    setActiveQueueId(null);
  };

  const loadFromQueue = (record: AuditRecord) => {
      setApp(record.application);
      setResult(record); // We already have the engine result from when the customer submitted it
      setActiveQueueId(record.applicationId);
      setJustification('');
      setIsCustomMode(false);
  };

  const assess = async () => {
    if (!app) return;
    const res = await evaluateLoan(app, config);
    setResult(res);
  };

  const handleOverride = (decision: 'APPROVED' | 'DECLINED') => {
    if (!app || !result) return;
    
    const isOverride = (decision === 'APPROVED' && result.finalStatus !== DecisionStatus.AUTO_APPROVE) ||
                       (decision === 'DECLINED' && result.finalStatus !== DecisionStatus.AUTO_DECLINE);

    const record: AuditRecord = {
      ...result,
      application: app,
      finalStatus: decision === 'APPROVED' ? DecisionStatus.AUTO_APPROVE : DecisionStatus.AUTO_DECLINE,
      humanOverride: {
        originalStatus: result.finalStatus,
        finalDecision: decision,
        justification: justification || "No justification provided.",
        timestamp: new Date().toISOString()
      },
      // Feedback Loop Logic
      feedbackLoop: {
          triggered: isOverride,
          type: 'MODEL_RETRAINING'
      }
    };

    if (activeQueueId) {
        onResolveQueue(record);
    } else {
        onDecision(record);
    }
    
    generateNew();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApp({
      id: `LN-MAN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      applicantName: "Manual Tester",
      applicationDate: new Date().toISOString(),
      ...customForm
    });
    setIsCustomMode(false);
    setResult(null);
    setJustification('');
    setActiveQueueId(null);
  };

  if (!app) {
    if (isCustomMode) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300">
           {/* ... existing custom form code ... */}
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 shadow-2xl w-full max-w-2xl relative overflow-hidden">
                {/* ... (Keeping same form UI for brevity, assume content matches previous response) ... */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Settings2 className="w-32 h-32 text-amber-500" />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                   <button onClick={() => setIsCustomMode(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                     <ArrowLeft className="w-5 h-5" />
                   </button>
                   <div>
                     <h3 className="text-xl font-bold text-white">Simulate Specific Scenario</h3>
                     <p className="text-slate-400 text-sm">Manually define application parameters.</p>
                   </div>
                </div>
                <form onSubmit={handleCustomSubmit} className="space-y-5 relative z-10">
                    {/* ... Inputs ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Business Name</label>
                        <input type="text" value={customForm.businessName} onChange={e => setCustomForm({...customForm, businessName: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none text-sm"/>
                        </div>
                        <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Industry</label>
                        <select value={customForm.industry} onChange={e => setCustomForm({...customForm, industry: e.target.value as Industry})} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none text-sm">
                            {Object.values(Industry).map(ind => <option key={ind} value={ind}>{ind}</option>)}
                        </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                         <input type="number" placeholder="Revenue" value={customForm.revenue} onChange={e => setCustomForm({...customForm, revenue: Number(e.target.value)})} className="bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none text-sm"/>
                         <input type="number" placeholder="Score" value={customForm.creditScore} onChange={e => setCustomForm({...customForm, creditScore: Number(e.target.value)})} className="bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none text-sm"/>
                         <input type="number" placeholder="Amount" value={customForm.requestedAmount} onChange={e => setCustomForm({...customForm, requestedAmount: Number(e.target.value)})} className="bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none text-sm"/>
                    </div>
                    <textarea value={customForm.description} onChange={e => setCustomForm({...customForm, description: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none text-sm h-24" />
                    <button type="submit" className="bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded w-full">Create Test Case</button>
                </form>
            </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[60vh]">
         {/* LEFT: INBOX QUEUE */}
         <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Inbox className="w-4 h-4" /> Pending Reviews ({reviewQueue.length})
            </h3>
            
            {reviewQueue.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                    <CheckCircle className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-xs">No pending applications.</p>
                </div>
            ) : (
                <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {reviewQueue.map(item => (
                        <div 
                           key={item.applicationId}
                           onClick={() => loadFromQueue(item)}
                           className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-amber-500 cursor-pointer transition-all hover:bg-slate-800"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-white">{item.application.businessName}</span>
                                <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                                <span>{item.application.industry}</span>
                                <span className="text-amber-500 font-bold">Needs Review</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
         </div>

         {/* RIGHT: ACTION CENTER */}
         <div className="lg:col-span-2 flex flex-col items-center justify-center text-center space-y-8 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 mx-auto border border-slate-700">
                    <Bot className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-200">Governance Console Ready</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                    Select a pending application from the inbox on the left, or simulate a new incoming request.
                </p>
                
                <div className="flex gap-4 justify-center mt-8">
                    <button
                        onClick={generateNew}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Bot className="w-5 h-5" /> Simulate New
                    </button>
                    <button
                        onClick={() => setIsCustomMode(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-lg border border-slate-600 transition-all flex items-center justify-center gap-2"
                    >
                        <Settings2 className="w-5 h-5" /> Custom
                    </button>
                </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         </div>
      </div>
    );
  }

  // --- EXISTING RENDER LOGIC FOR ACTIVE APPLICATION ---
  return (
    <div className="space-y-6">
      {/* Application Header Card */}
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 overflow-hidden relative">
         {activeQueueId && (
             <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 z-20"></div>
         )}
         {/* ... Existing Header UI ... */}
         <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <Bot className="w-5 h-5 text-amber-400" />
             </div>
             <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">Source: {activeQueueId ? 'Customer Portal (Inbox)' : 'BizBot Agent'}</span>
                <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">{app.id}</span>
             </div>
          </div>
          <div className="text-right">
             <span className="inline-flex items-center rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-sm font-medium text-slate-300">
                {app.industry}
             </span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
           <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Business Name</p>
              <p className="font-semibold text-slate-200 truncate">{app.businessName}</p>
           </div>
           <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Annual Revenue</p>
              <p className="font-semibold text-slate-200">${app.revenue.toLocaleString()}</p>
           </div>
           <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Requested Amount</p>
              <p className="font-semibold text-slate-200">${app.requestedAmount.toLocaleString()}</p>
           </div>
           <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Credit Score</p>
              <p className={`font-mono font-bold text-lg ${
                  app.creditScore >= 700 ? 'text-green-400' : app.creditScore >= 600 ? 'text-amber-400' : 'text-red-400'
              }`}>
                  {app.creditScore}
              </p>
           </div>
        </div>
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800">
           <p className="text-sm text-slate-400 italic">"{app.description}"</p>
        </div>
      </div>

      {!result && (
        <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={assess}
            className="bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center gap-2"
          >
            <Cpu className="w-5 h-5" />
            Run Assessment Engines
          </button>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Column 1: Engine Outputs */}
          <div className="lg:col-span-2 space-y-6">
             {/* Engine Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Engine 1: Policy */}
                <div className={`p-4 rounded-lg border-l-4 shadow-md ${
                    result.policy.passed ? 'bg-slate-900 border-green-500' : 'bg-slate-900 border-red-500'
                }`}>
                   <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-slate-400" /> Policy Engine
                   </h4>
                   <p className={`text-lg font-bold ${result.policy.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {result.policy.passed ? 'PASSED' : 'FAILED'}
                   </p>
                   {/* Explainability for Policy */}
                   <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                      {result.policy.checklist.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[10px]">
                              <span className="text-slate-400">{item.rule}</span>
                              <span className={item.passed ? "text-green-500" : "text-red-500"}>
                                  {item.passed ? "✓" : "✗"}
                              </span>
                          </div>
                      ))}
                   </div>
                </div>

                {/* Engine 2: Risk */}
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 shadow-md border-l-4 border-l-blue-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1">
                        <span className="text-[9px] font-bold text-blue-200 bg-blue-900/50 px-1 rounded border border-blue-800">AWS SAGEMAKER</span>
                    </div>
                    <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-slate-400" /> Predictive Risk
                   </h4>
                   <div className="flex justify-between items-end mb-2">
                      <div>
                          <p className="text-xs text-slate-500 uppercase font-bold">Level</p>
                          <p className={`font-bold ${
                              result.risk.level === 'Low' ? 'text-green-400' : result.risk.level === 'High' ? 'text-red-400' : 'text-amber-400'
                          }`}>{result.risk.level}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase font-bold">PD</p>
                          <p className="font-mono font-bold text-slate-200">{(result.risk.probabilityOfDefault * 100).toFixed(1)}%</p>
                      </div>
                   </div>
                   {/* Explainability Mini Chart */}
                   <div className="text-[9px] text-slate-500 mt-2 border-t border-slate-800 pt-1">
                       <span className="font-bold">Top Factor:</span> {result.risk.shapValues[0].feature}
                   </div>
                </div>

                {/* Engine 3: GenAI */}
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 shadow-md border-l-4 border-l-purple-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1">
                        <span className="text-[9px] font-bold text-purple-200 bg-purple-900/50 px-1 rounded border border-purple-800">BEDROCK CLAUDE</span>
                    </div>
                    <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2 text-sm">
                      <CloudLightning className="w-4 h-4 text-slate-400" /> Semantic Analysis
                   </h4>
                   <div className="space-y-2">
                       {result.genAi.flags.length > 0 ? (
                           <div className="flex gap-2 items-start">
                               <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                               <span className="text-xs text-slate-300 font-medium">{result.genAi.flags.length} Risk Flags</span>
                           </div>
                       ) : (
                           <div className="flex gap-2 items-start">
                               <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                               <span className="text-xs text-slate-300">Clean Analysis</span>
                           </div>
                       )}
                   </div>
                   <div className="mt-2 text-[9px] text-slate-500 leading-tight border-t border-slate-800 pt-1 line-clamp-2" title={result.genAi.reasoning}>
                       {result.genAi.reasoning}
                   </div>
                </div>
             </div>

             {/* Governance Status */}
             <div className="bg-slate-950 text-white rounded-xl p-6 flex justify-between items-center shadow-lg border border-slate-800">
                <div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Orchestrator Decision</h3>
                   <div className="flex items-center gap-3 mt-1">
                      {result.finalStatus === DecisionStatus.AUTO_APPROVE && <CheckCircle className="w-8 h-8 text-green-400" />}
                      {result.finalStatus === DecisionStatus.AUTO_DECLINE && <XCircle className="w-8 h-8 text-red-400" />}
                      {result.finalStatus === DecisionStatus.HITL_REVIEW && <AlertTriangle className="w-8 h-8 text-amber-400" />}
                      <span className="text-2xl font-bold tracking-tight">
                          {result.finalStatus.replace('_', ' ')}
                      </span>
                   </div>
                </div>
                {result.finalStatus === DecisionStatus.HITL_REVIEW && (
                    <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-lg text-right">
                        <p className="text-[10px] text-amber-500 font-bold uppercase">Reason</p>
                        <p className="text-xs text-amber-200">Conflict Detected: Policy/Risk/GenAI Mismatch</p>
                    </div>
                )}
             </div>

             {/* XAI Panel */}
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                 <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-blue-500" /> Explainability (Sagemaker SHAP)
                 </h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.risk.shapValues} layout="vertical" margin={{ left: 40 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="feature" type="category" width={100} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <Tooltip 
                                cursor={{fill: '#334155'}}
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    const val = Number(payload[0].value);
                                    return (
                                      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl z-50">
                                        <p className="text-slate-200 font-bold mb-1 text-xs">{label}</p>
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-slate-400">Impact:</span>
                                          <span className={`font-mono font-bold ${val > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {val > 0 ? '+' : ''}{val.toFixed(3)}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                            />
                            <ReferenceLine x={0} stroke="#475569" />
                            <Bar dataKey="impact" name="Impact" radius={[0, 4, 4, 0]} barSize={20}>
                                {result.risk.shapValues.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#ef4444' : '#22c55e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
             </div>
          </div>

          {/* Column 2: Action Panel */}
          <div className="space-y-6">
             {/* GenAI Summary Card */}
             <div className="bg-slate-900 p-6 rounded-xl border border-purple-900/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                {/* ... Header ... */}
                <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm mb-3">
                    <Bot className="w-4 h-4" /> Claude 3.5 Analysis
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-slate-700 pl-3 mb-4">
                    "{result.genAi.summary}"
                </p>
                <div className="bg-purple-900/20 p-3 rounded border border-purple-800/30 mb-4">
                    <p className="text-[10px] text-purple-300 uppercase font-bold mb-1">Reasoning Trace</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{result.genAi.reasoning}</p>
                </div>
                {/* ... Flags ... */}
                {result.genAi.flags.length > 0 && (
                    <div className="bg-red-950/30 p-3 rounded border border-red-900/50">
                        <ul className="space-y-1">
                            {result.genAi.flags.map((flag, i) => <li key={i} className="text-xs text-red-300 flex items-start gap-2"><AlertTriangle className="w-3 h-3 text-red-500 shrink-0"/>{flag}</li>)}
                        </ul>
                    </div>
                )}
             </div>

             {/* Human Decision Controls */}
             {result.finalStatus === DecisionStatus.HITL_REVIEW && (
                 <div className="bg-slate-900 p-6 rounded-xl border border-amber-500/30 shadow-lg ring-1 ring-amber-500/20 animate-pulse-border">
                     <h3 className="font-bold text-amber-500 mb-1 flex items-center gap-2 text-sm">
                         <UserCheck className="w-4 h-4" /> Human Review Required
                     </h3>
                     <p className="text-xs text-amber-200/70 mb-4">
                         Agent detected regulatory/risk drift.
                     </p>
                     <div className="space-y-4">
                         <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase">Override Justification</label>
                             <textarea 
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                                className="w-full mt-1 p-3 text-sm bg-slate-950 border border-slate-700 rounded-md focus:ring-1 focus:ring-amber-500 outline-none text-slate-200"
                                rows={3}
                                placeholder="Enter justification for audit log..."
                             />
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                             <button onClick={() => handleOverride('DECLINED')} className="flex items-center justify-center gap-2 py-2 px-4 bg-transparent border border-red-900/50 text-red-400 rounded-lg hover:bg-red-950/30 text-sm font-bold"><UserX className="w-4 h-4" /> Decline</button>
                             <button onClick={() => handleOverride('APPROVED')} className="flex items-center justify-center gap-2 py-2 px-4 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 text-sm font-bold shadow-lg"><CheckCircle className="w-4 h-4" /> Approve</button>
                         </div>
                     </div>
                 </div>
             )}
             
             {/* Read-Only State for Processed Items */}
             {result.finalStatus !== DecisionStatus.HITL_REVIEW && (
                 <div className="text-center p-6 bg-slate-900 rounded-xl border border-slate-800">
                     <p className="text-slate-500 text-sm">Decision Finalized</p>
                     <button onClick={() => { setActiveQueueId(null); generateNew(); }} className="mt-2 text-amber-500 text-sm font-bold hover:underline">Process Next</button>
                 </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
