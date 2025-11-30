
import React from 'react';
import { AppConfig } from '../types';
import { Settings, RefreshCw, ShieldAlert, Activity, Bot, Users, Briefcase } from 'lucide-react';

interface SidebarProps {
  config: AppConfig;
  setConfig: (c: AppConfig) => void;
  onReset: () => void;
  viewMode: 'BANKER' | 'CUSTOMER';
  setViewMode: (mode: 'BANKER' | 'CUSTOMER') => void;
}

export const NexusSidebar: React.FC<SidebarProps> = ({ config, setConfig, onReset, viewMode, setViewMode }) => {
  const isBanker = viewMode === 'BANKER';

  return (
    <aside className={`w-80 flex flex-col h-full border-r shadow-2xl z-20 transition-colors duration-500 ${
        isBanker ? 'bg-black text-slate-100 border-slate-800' : 'bg-white text-slate-800 border-slate-200'
    }`}>
      <div className={`p-6 border-b sticky top-0 z-10 backdrop-blur-sm ${
          isBanker ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/50'
      }`}>
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <ShieldAlert className={`w-6 h-6 ${isBanker ? 'text-amber-500' : 'text-indigo-600'}`} />
          <span className={isBanker ? 'text-white' : 'text-slate-900'}>NEXUS ENGINE</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] pl-8">
            {isBanker ? 'Governance & Risk' : 'Self-Service Portal'}
        </p>
      </div>

      {/* Persona Switcher - SWAPPED: Applicant Left, Banker Right */}
      <div className={`p-4 border-b ${isBanker ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
         <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50 relative">
             {/* Slider Logic Swapped: Left = Applicant, Right = Banker */}
             <div className={`absolute top-1 bottom-1 w-1/2 rounded-md transition-all duration-300 ${
                 isBanker ? 'left-[49%] bg-amber-500' : 'left-1 bg-indigo-500'
             }`}></div>
             
             <button 
                onClick={() => setViewMode('CUSTOMER')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md relative z-10 transition-colors ${
                    !isBanker ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
             >
                 <Users className="w-3 h-3" /> APPLICANT
             </button>

             <button 
                onClick={() => setViewMode('BANKER')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md relative z-10 transition-colors ${
                    isBanker ? 'text-slate-900' : 'text-slate-500 hover:text-slate-300'
                }`}
             >
                 <Briefcase className="w-3 h-3" /> BANKER
             </button>
         </div>
         <p className="text-[10px] text-center mt-2 text-slate-500">
             {isBanker ? 'Viewing as Risk Officer' : 'Viewing as Small Business Customer'}
         </p>
      </div>

      <div className="p-6 flex-1 space-y-10 overflow-y-auto">
        
        {isBanker ? (
            <>
                {/* Section 1 */}
                <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Settings className="w-3 h-3" /> Risk Appetite
                </h2>
                
                <div className="space-y-8">
                    {/* Control 1 */}
                    <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-semibold text-slate-300">Min Credit Score</label>
                        <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{config.minCreditScore}</span>
                    </div>
                    <input
                        type="range"
                        min="300"
                        max="850"
                        value={config.minCreditScore}
                        onChange={(e) => setConfig({ ...config, minCreditScore: Number(e.target.value) })}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                        <span>300</span>
                        <span>850</span>
                    </div>
                    </div>

                    {/* Control 2 */}
                    <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-semibold text-slate-300">Max Auto-Approval</label>
                        <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">${config.maxLoanAmount / 1000}k</span>
                    </div>
                    <input
                        type="range"
                        min="10000"
                        max="200000"
                        step="5000"
                        value={config.maxLoanAmount}
                        onChange={(e) => setConfig({ ...config, maxLoanAmount: Number(e.target.value) })}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                        <span>$10k</span>
                        <span>$200k</span>
                    </div>
                    </div>

                    {/* Control 3 */}
                    <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-semibold text-slate-300">AI Confidence</label>
                        <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{config.aiConfidenceThreshold}%</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="99"
                        value={config.aiConfidenceThreshold}
                        onChange={(e) => setConfig({ ...config, aiConfidenceThreshold: Number(e.target.value) })}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                    />
                    </div>
                </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-500 delay-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Activity className="w-3 h-3" /> Policy Controls
                </h2>
                
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                    <span className="text-xs font-medium text-slate-300">Strict Industry Check</span>
                    <button
                    onClick={() => setConfig({ ...config, strictIndustryChecking: !config.strictIndustryChecking })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                        config.strictIndustryChecking ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                    >
                    <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.strictIndustryChecking ? 'translate-x-5' : 'translate-x-1'
                        }`}
                    />
                    </button>
                </div>
                <p className="text-[10px] text-slate-500 px-1 leading-tight">
                    Automatically declines restricted sectors (e.g., Gambling) regardless of risk score.
                </p>
                </div>
            </>
        ) : (
            /* Customer View Sidebar Content */
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <h3 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" /> Virtual Assistant
                    </h3>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                        I am configured to guide you through the application process. I will check your eligibility in real-time.
                    </p>
                </div>
                <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Steps</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm font-medium text-indigo-600">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">1</span>
                            Enter Details
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium text-slate-400">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
                            AI Verification
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium text-slate-400">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">3</span>
                            Funding Decision
                        </li>
                    </ul>
                </div>
            </div>
        )}

      </div>

      {isBanker && (
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 mt-auto sticky bottom-0 z-10">
            <button
            onClick={onReset}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-500/50 hover:text-white"
            >
            <RefreshCw className="w-3 h-3" />
            Reset Defaults
            </button>
        </div>
      )}
    </aside>
  );
};
