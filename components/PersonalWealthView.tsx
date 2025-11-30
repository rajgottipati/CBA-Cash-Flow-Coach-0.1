
import React from 'react';
import { SimulationState } from '../types';
import { TrendingUp, Wallet, ArrowRight, PieChart, Check, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  state: SimulationState;
  onAction: () => void;
  onExecute: () => void;
}

export const PersonalWealthView: React.FC<Props> = ({ state, onAction, onExecute }) => {
  const chartData = [
    { name: 'Year 1', savings: 5020, invest: 5300 },
    { name: 'Year 3', savings: 5060, invest: 6100 },
    { name: 'Year 5', savings: 5100, invest: 7200 },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Personal Wealth</h1>
          <p className="text-slate-500">Welcome back, Sarah. Your Net Worth is up 2.4% this month.</p>
        </div>

        {/* Insight Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900">Liquidity Analysis</h3>
                {state.conversation.length > 0 ? (
                  <div className="mt-2 space-y-3">
                    {state.conversation.map((msg, idx) => (
                      <div key={idx} className={`text-sm leading-relaxed p-3 rounded-lg ${msg.role === 'assistant' ? 'bg-emerald-50 text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
                        {msg.content}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mt-1">
                    You have <span className="font-semibold text-slate-900">$5,000</span> in your Everyday account earning <span className="text-red-500">0.10% p.a.</span>
                  </p>
                )}
              </div>

              {state.uiState.showProposal && state.uiState.proposalType === 'ETF_MOVE' && (
                <div className="bg-slate-900 text-white p-5 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <PieChart className="text-emerald-400" size={18} />
                      <span className="font-semibold">Investment Proposal</span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">NEXUS APPROVED</span>
                  </div>
                  
                  {state.uiState.executionStatus === 'SUCCESS' ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-3">
                              <Check size={24} strokeWidth={3} />
                          </div>
                          <h3 className="text-lg font-bold text-white">Transfer Complete</h3>
                          <p className="text-slate-400 text-sm">Ref: #88392-ETF</p>
                          <p className="text-slate-400 text-sm mt-2">$4,000 moved to CommSec Core ETF</p>
                      </div>
                  ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                            <div className="text-sm text-slate-400 mb-1">Proposed Action</div>
                            <div className="text-lg font-medium">Move $4,000 to CommSec Core ETF</div>
                            <div className="text-xs text-slate-500 mt-1">Retain $1,000 buffer</div>
                            </div>
                            <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{background: '#1e293b', border: 'none', color: 'white', fontSize: '12px'}} />
                                    <Bar dataKey="savings" fill="#475569" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="invest" fill="#10b981" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            </div>
                        </div>

                        <button 
                            onClick={onExecute}
                            disabled={state.uiState.executionStatus === 'PROCESSING'}
                            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {state.uiState.executionStatus === 'PROCESSING' ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} /> Processing...
                                </>
                            ) : (
                                <>
                                    Review PDS & Execute <ArrowRight size={16} />
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
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <TrendingUp size={16} />
                  Run Optimization
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
