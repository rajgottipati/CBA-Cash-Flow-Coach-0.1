
import React from 'react';
import { SimulationState } from '../types';
import { AlertTriangle, TrendingDown, ArrowRight, Zap, Check, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  state: SimulationState;
  onAction: () => void;
  onExecute: () => void;
}

export const BusinessCashflowView: React.FC<Props> = ({ state, onAction, onExecute }) => {
  const data = [
    { day: 'Today', balance: 14000 },
    { day: 'Day 5', balance: 12500 },
    { day: 'Day 10', balance: 11000 },
    { day: 'Day 15', balance: -2000 },
    { day: 'Day 20', balance: 5000 },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-cba-yellow text-black px-2 rounded text-lg">Biz</span>
            Cash Flow Forecast
          </h1>
          <p className="text-slate-400">ABN 88 102 993 112 • Café Delta</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
              <TrendingDown size={24} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-white">Shortfall Alert</h3>
                
                {state.conversation.length > 0 ? (
                  <div className="mt-2 space-y-3">
                    {state.conversation.map((msg, idx) => (
                      <div key={idx} className={`text-sm leading-relaxed p-3 rounded-lg ${msg.role === 'assistant' ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-800 text-slate-500'}`}>
                        {msg.content}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mt-1">
                    Projected balance on <span className="text-white">15 Nov</span> is <span className="text-red-400">-$2,000</span> due to upcoming tax liability.
                  </p>
                )}
              </div>

              {state.uiState.showProposal && state.uiState.proposalType === 'OVERDRAFT' && (
                <div className="bg-cba-yellow text-black p-5 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="text-black" size={18} />
                      <span className="font-bold">Solution Found</span>
                    </div>
                    <span className="text-xs bg-black/10 text-black px-2 py-0.5 rounded border border-black/20 font-mono">CREDIT_CHECK_PASS</span>
                  </div>
                  
                  {state.uiState.executionStatus === 'SUCCESS' ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-cba-yellow mb-3">
                              <Check size={24} strokeWidth={3} />
                          </div>
                          <h3 className="text-lg font-bold text-black">Overdraft Activated</h3>
                          <p className="text-slate-800 text-sm">Ref: #OD-9921</p>
                          <p className="text-slate-800 text-sm mt-2">Funds available immediately</p>
                      </div>
                  ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                            <div className="text-sm opacity-70 mb-1">Pre-Approved Offer</div>
                            <div className="text-lg font-bold">BizOverdraft ($10k)</div>
                            <div className="text-xs opacity-70 mt-1">Rate: 8.5% p.a. • No establishment fee</div>
                            </div>
                            <div className="h-24 w-full bg-white/20 rounded p-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
                                    <Area type="monotone" dataKey="balance" stroke="#000" fill="rgba(0,0,0,0.1)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                            </div>
                        </div>

                        <button 
                            onClick={onExecute}
                            disabled={state.uiState.executionStatus === 'PROCESSING'}
                            className="mt-4 w-full bg-black text-cba-yellow hover:bg-slate-900 disabled:bg-black/50 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            {state.uiState.executionStatus === 'PROCESSING' ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} /> Processing...
                                </>
                            ) : (
                                <>
                                    Activate Now <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </>
                  )}
                </div>
              )}

              {!state.isRunning && state.conversation.length === 0 && (
                <button 
                  onClick={onAction}
                  className="px-4 py-2 bg-cba-yellow text-black text-sm font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                >
                  <AlertTriangle size={16} />
                  Find Solution
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
