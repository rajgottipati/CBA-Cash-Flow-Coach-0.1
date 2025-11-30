
import React from 'react';
import { AuditRecord, DecisionStatus } from '../types';
import { Check, X, Search, RefreshCw, Brain } from 'lucide-react';

export const NexusAuditLog: React.FC<{ history: AuditRecord[] }> = ({ history }) => {
  if (history.length === 0) return <div className="text-center py-20 text-slate-500">No records yet.</div>;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <table className="w-full text-sm text-left text-slate-400">
        <thead className="text-xs uppercase bg-slate-950 text-slate-500">
          <tr><th className="px-6 py-3">Timestamp</th><th className="px-6 py-3">Business</th><th className="px-6 py-3">Policy</th><th className="px-6 py-3">Risk</th><th className="px-6 py-3">GenAI</th><th className="px-6 py-3">Decision</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {history.slice().reverse().map((rec, i) => (
            <tr key={i} className="hover:bg-slate-800/50">
               <td className="px-6 py-4 font-mono text-xs">{new Date(rec.timestamp).toLocaleTimeString()}</td>
               <td className="px-6 py-4"><div className="text-white font-bold">{rec.application.businessName}</div><div className="text-xs">{rec.application.industry}</div></td>
               <td className="px-6 py-4">{rec.policy.passed ? <span className="text-green-500">PASS</span> : <span className="text-red-500">FAIL</span>}</td>
               <td className="px-6 py-4"><div className={rec.risk.level === 'Low' ? 'text-green-500' : 'text-amber-500'}>{rec.risk.level}</div><div className="text-xs">PD: {rec.risk.probabilityOfDefault}</div></td>
               <td className="px-6 py-4"><Brain size={14} className={rec.genAi.sentiment === 'Negative' ? 'text-red-500' : 'text-slate-500'}/></td>
               <td className="px-6 py-4">
                   {rec.finalStatus === DecisionStatus.AUTO_APPROVE && <span className="text-green-500 font-bold">Approved</span>}
                   {rec.finalStatus === DecisionStatus.AUTO_DECLINE && <span className="text-red-500 font-bold">Declined</span>}
                   {rec.finalStatus === DecisionStatus.HITL_REVIEW && <span className="text-amber-500 font-bold">Review</span>}
                   {rec.humanOverride && <div className="text-[10px] text-amber-300 mt-1">Override: {rec.humanOverride.finalDecision}</div>}
               </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
