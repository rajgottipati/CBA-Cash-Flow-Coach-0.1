
import React, { useState } from 'react';
import { AppConfig, DecisionStatus } from '../types';
import { generateMockApplication } from '../services/nexusMockData';
import { evaluateLoan } from '../services/nexusEngine';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PlayCircle, Loader2, Settings2 } from 'lucide-react';

export const NexusBatchSimulation: React.FC<{ config: AppConfig }> = ({ config }) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(100);
  const [stats, setStats] = useState<{ approved: number; declined: number; review: number } | null>(null);

  const run = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    let approved = 0, declined = 0, review = 0;
    for (let i = 0; i < count; i++) {
      const res = evaluateLoan(generateMockApplication(), config);
      if (res.finalStatus === DecisionStatus.AUTO_APPROVE) approved++;
      else if (res.finalStatus === DecisionStatus.AUTO_DECLINE) declined++;
      else review++;
    }
    setStats({ approved, declined, review });
    setLoading(false);
  };

  const data = stats ? [
    { name: 'Approved', value: stats.approved, color: '#22c55e' },
    { name: 'Declined', value: stats.declined, color: '#ef4444' },
    { name: 'Review', value: stats.review, color: '#f59e0b' },
  ] : [];

  return (
    <div className="space-y-8 p-8 flex flex-col items-center">
      <div className="text-center max-w-xl">
         <h2 className="text-2xl font-bold text-white mb-4">Governance Simulation</h2>
         <p className="text-slate-400 mb-8">Run synthetic applications against current policy settings to test impact.</p>
         <div className="flex items-center justify-center gap-4 mb-8">
            <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} className="w-24 bg-slate-800 border border-slate-600 rounded p-2 text-white text-center"/>
            <button onClick={run} disabled={loading} className="bg-amber-500 text-black font-bold py-2 px-6 rounded flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <PlayCircle/>} Run Batch
            </button>
         </div>
      </div>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
           <div className="h-64 bg-slate-900 rounded-xl p-4 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                    {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 uppercase">Approval Rate</div>
                  <div className="text-4xl font-bold text-white">{((stats.approved / count) * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 uppercase">Review Rate</div>
                  <div className="text-4xl font-bold text-amber-500">{((stats.review / count) * 100).toFixed(1)}%</div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
