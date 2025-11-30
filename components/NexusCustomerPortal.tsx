
import React, { useState } from 'react';
import { AppConfig, Industry, LoanApplication, EngineResult, DecisionStatus, AuditRecord } from '../types';
import { evaluateLoan } from '../services/nexusEngine';
import { generateMockApplication } from '../services/nexusMockData';
import { CheckCircle, AlertTriangle, XCircle, Sparkles, Send, Building2, DollarSign, Bot } from 'lucide-react';

interface Props {
  config: AppConfig;
  onSubmit: (record: AuditRecord) => void;
}

export const NexusCustomerPortal: React.FC<Props> = ({ config, onSubmit }) => {
  const [formData, setFormData] = useState({
    businessName: '', revenue: 100000, amount: 50000, creditScore: 700, industry: Industry.RETAIL, description: ''
  });
  const [result, setResult] = useState<EngineResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulate = () => {
    const mock = generateMockApplication();
    setFormData({ businessName: mock.businessName, revenue: mock.revenue, amount: mock.requestedAmount, creditScore: mock.creditScore, industry: mock.industry, description: mock.description });
    setResult(null);
  };

  const check = () => {
    const app: LoanApplication = { id: 'TEMP', applicantName: 'User', applicationDate: new Date().toISOString(), ...formData, requestedAmount: formData.amount };
    setResult(evaluateLoan(app, config));
  };

  const submit = () => {
    if(result) {
        setIsSubmitting(true);
        // Simulate delay
        setTimeout(() => {
            const app: LoanApplication = { id: `APP-${Date.now()}`, applicantName: 'User', applicationDate: new Date().toISOString(), ...formData, requestedAmount: formData.amount };
            onSubmit({ ...result, applicationId: app.id, application: app });
        }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
       <div className="text-center">
           <h1 className="text-3xl font-bold text-white mb-2">Fast-Track Funding</h1>
           <p className="text-slate-400">AI-Powered Eligibility Check</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: FORM */}
          <div className="md:col-span-2 bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-white font-bold flex items-center gap-2"><Building2 className="text-indigo-500"/> Details</h3>
                  <button onClick={handleSimulate} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-white px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 transition-all"><Bot size={12}/> Simulate Data</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs text-slate-500 block mb-1">Business Name</label>
                      <input type="text" className="bg-slate-800 border-slate-700 rounded p-3 text-white text-sm w-full focus:border-indigo-500 outline-none" placeholder="Business Name" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
                  </div>
                  <div>
                      <label className="text-xs text-slate-500 block mb-1">Industry</label>
                      <select className="bg-slate-800 border-slate-700 rounded p-3 text-white text-sm w-full focus:border-indigo-500 outline-none" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value as Industry})}>{Object.values(Industry).map(i => <option key={i} value={i}>{i}</option>)}</select>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs text-slate-500 block mb-1">Revenue ($)</label>
                      <input type="number" className="bg-slate-800 border-slate-700 rounded p-3 text-white text-sm w-full focus:border-indigo-500 outline-none" placeholder="Revenue" value={formData.revenue} onChange={e => setFormData({...formData, revenue: Number(e.target.value)})} />
                  </div>
                  <div>
                      <label className="text-xs text-slate-500 block mb-1">Amount ($)</label>
                      <input type="number" className="bg-slate-800 border-slate-700 rounded p-3 text-white text-sm w-full focus:border-indigo-500 outline-none" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                  </div>
              </div>
              <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-slate-500">Est. Credit Score</label>
                    <span className="text-xs font-mono text-indigo-400 font-bold">{formData.creditScore}</span>
                  </div>
                  <input type="range" min="300" max="850" className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg appearance-none" value={formData.creditScore} onChange={e => setFormData({...formData, creditScore: Number(e.target.value)})} />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>300</span><span>850</span></div>
              </div>
              <div>
                  <label className="text-xs text-slate-500 block mb-1">Purpose</label>
                  <textarea className="bg-slate-800 border-slate-700 rounded p-3 text-white text-sm w-full h-24 focus:border-indigo-500 outline-none" placeholder="Description of funds usage..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <button onClick={check} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/20"><Sparkles size={16}/> Check Eligibility</button>
          </div>

          {/* RIGHT: NEXUS FEEDBACK - Restored per User Request */}
          <div className="space-y-6">
             {/* The "Assistant" Card */}
             <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Nexus AI Assistant</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        I am analyzing your inputs against our real-time lending policies.
                    </p>
                </div>
                {/* Decorative bg */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
             </div>

             {/* The Result Card */}
             {result ? (
                 <div className={`rounded-2xl shadow-lg border-2 p-6 animate-in zoom-in duration-300 ${
                     result.finalStatus === DecisionStatus.AUTO_APPROVE ? 'bg-green-900/20 border-green-500/30' :
                     result.finalStatus === DecisionStatus.AUTO_DECLINE ? 'bg-red-900/20 border-red-500/30' :
                     'bg-amber-900/20 border-amber-500/30'
                 }`}>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {result.finalStatus === DecisionStatus.AUTO_APPROVE && <CheckCircle className="w-8 h-8 text-green-500 shrink-0" />}
                            {result.finalStatus === DecisionStatus.AUTO_DECLINE && <XCircle className="w-8 h-8 text-red-500 shrink-0" />}
                            {result.finalStatus === DecisionStatus.HITL_REVIEW && <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />}
                            
                            <h4 className={`font-bold text-lg ${
                                result.finalStatus === DecisionStatus.AUTO_APPROVE ? 'text-green-400' :
                                result.finalStatus === DecisionStatus.AUTO_DECLINE ? 'text-red-400' :
                                'text-amber-400'
                            }`}>
                                {result.finalStatus === DecisionStatus.AUTO_APPROVE ? 'Pre-Approved!' :
                                 result.finalStatus === DecisionStatus.AUTO_DECLINE ? 'Unable to Proceed' :
                                 'Under Review'}
                            </h4>
                        </div>
                        
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {result.finalStatus === DecisionStatus.AUTO_APPROVE && "Great news! Based on preliminary checks, you are eligible for instant funding."}
                            {result.finalStatus === DecisionStatus.AUTO_DECLINE && "Based on current inputs, this application does not meet our automated criteria."}
                            {/* Improved Message for Review state */}
                            {result.finalStatus === DecisionStatus.HITL_REVIEW && "Your application looks solid, but requires a Relationship Manager to review specific details. We can process this manually."}
                        </p>
                        
                        {/* Allow Submit for Review as well */}
                        {result.finalStatus !== DecisionStatus.AUTO_DECLINE && (
                            <button 
                                onClick={submit}
                                disabled={isSubmitting}
                                className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'} <Send className="w-4 h-4" />
                            </button>
                        )}
                     </div>
                 </div>
             ) : (
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-48 opacity-50">
                     <Sparkles className="w-8 h-8 text-slate-500 mb-3" />
                     <p className="text-sm text-slate-500">Fill out the form to see your result instantly.</p>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};
