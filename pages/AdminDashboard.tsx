
import React, { useEffect, useState } from 'react';
import { AppState, CreditStatus } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Activity, LayoutGrid, Users, Map as MapIcon, ShieldCheck, AlertCircle, CheckCircle2, ChevronRight, Copy } from 'lucide-react';
import { MapView } from '../components/MapView';
import { checkBucketExists } from '../services/supabase';

interface AdminDashboardProps {
  state: AppState;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ state }) => {
  const [bucketReady, setBucketReady] = useState<boolean | null>(null);

  useEffect(() => {
    checkBucketExists('restoration-images').then(setBucketReady);
  }, []);

  const stats = [
    { label: 'Total Uploads', value: state.submissions.length, icon: <Activity className="h-5 w-5" /> },
    { label: 'Verified Credits', value: state.credits.length, icon: <Database className="h-5 w-5" /> },
    { label: 'Total Sales', value: state.credits.filter(c => c.status === CreditStatus.SOLD).length, icon: <LayoutGrid className="h-5 w-5" /> },
    { label: 'Registered Users', value: state.userCount, icon: <Users className="h-5 w-5" /> },
  ];

  const chartData = [
    { name: 'Mon', val: 400 },
    { name: 'Tue', val: 300 },
    { name: 'Wed', val: 600 },
    { name: 'Thu', val: 800 },
    { name: 'Fri', val: 500 },
    { name: 'Sat', val: 900 },
    { name: 'Sun', val: 1100 },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Command Center</h1>
          <p className="text-slate-600">Administrative node monitoring global blue carbon activity.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Node Healthy</span>
        </div>
      </header>

      {/* Setup Guide / Health Monitor */}
      <div className={`p-6 rounded-2xl border ${bucketReady === false ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${bucketReady === false ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {bucketReady === false ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Storage Infrastructure: {bucketReady === false ? 'Awaiting Configuration' : 'Fully Operational'}
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                {bucketReady === false 
                  ? "The MRV storage bucket 'restoration-images' is missing. The system is currently using temporary local fallbacks. For persistence, please initialize the Supabase storage bucket."
                  : "The digital asset registry is correctly synced with Supabase Cloud Storage. All field images are being persisted securely."}
              </p>
              {bucketReady === false && (
                <div className="mt-4 flex space-x-3">
                  <button 
                    onClick={() => window.open('https://app.supabase.com', '_blank')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all"
                  >
                    Open Supabase Console <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all">
                    <Copy className="mr-2 h-4 w-4" /> Copy Setup SQL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 p-2 bg-slate-50 rounded-lg">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold flex items-center">
          <MapIcon className="h-5 w-5 mr-2 text-blue-600" /> Active Registry Map
        </h3>
        <div className="h-[400px]">
          <MapView submissions={state.submissions} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Network Growth Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6">Digital Ledger Audit</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[300px]">
            {state.credits.map((credit) => (
              <div key={credit.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl text-[10px] border border-slate-100">
                <div className="h-2 w-2 mt-1.5 rounded-full shrink-0 bg-emerald-500" />
                <div className="space-y-1 w-full">
                  <div className="flex justify-between font-bold text-slate-900 uppercase">
                    <span>MINT EVENT</span>
                    <span className="text-slate-400">{new Date(credit.mintedAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-700">Project: {credit.origin}</p>
                  <p className="text-slate-400 font-mono truncate bg-white p-1 rounded">TX: {credit.transactionHash}</p>
                </div>
              </div>
            ))}
            {state.credits.length === 0 && (
              <p className="text-center py-10 text-slate-400 italic">No ledger entries yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
