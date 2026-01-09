
import React, { useEffect, useState } from 'react';
import { AppState, CreditStatus, SubmissionStatus, Submission } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Activity, LayoutGrid, Users, Map as MapIcon, ShieldCheck, CheckCircle2, ChevronRight, Gavel, Search, Globe, TrendingUp, Landmark } from 'lucide-react';
import { MapView } from '../components/MapView';

interface AdminDashboardProps {
  state: AppState;
  onIssue: (id: string, comments: string) => void;
  onReject: (id: string, comments: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ state, onIssue, onReject }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'issuance' | 'audit'>('overview');
  const [comments, setComments] = useState('');

  const issuanceQueue = state.submissions.filter(s => s.status === SubmissionStatus.NGO_APPROVED);
  const totalCarbon = state.credits.reduce((acc, c) => acc + c.tons, 0);

  return (
    <div className="space-y-12 animate-fade-in pb-32 pt-32 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 glass p-10 rounded-[3rem]">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <Landmark className="h-5 w-5 text-blue-500" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">National Blue Carbon Registry</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight italic">Regulator Command</h1>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900' : 'glass text-slate-400 hover:text-white'}`}>Overview</button>
           <button onClick={() => setActiveTab('issuance')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'issuance' ? 'bg-blue-600 text-white' : 'glass text-slate-400 hover:text-white'}`}>
             Issuance
             {issuanceQueue.length > 0 && <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />}
           </button>
           <button onClick={() => setActiveTab('audit')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'audit' ? 'bg-white text-slate-900' : 'glass text-slate-400 hover:text-white'}`}>Audit</button>
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><Globe className="h-16 w-16" /></div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Issuance Volume</p>
               <p className="text-4xl font-black text-white">{totalCarbon} <span className="text-sm font-medium text-slate-500">tCO2e</span></p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><Users className="h-16 w-16" /></div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Active Network</p>
               <p className="text-4xl font-black text-white">{state.userCount}</p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><Landmark className="h-16 w-16" /></div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Registry Value</p>
               <p className="text-4xl font-black text-emerald-400">${(totalCarbon * 15).toLocaleString()}</p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck className="h-16 w-16 text-blue-500" /></div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Node Security</p>
               <p className="text-4xl font-black text-blue-500 uppercase tracking-tighter">AA+</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 glass p-10 rounded-[4rem] border-white/5">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white flex items-center italic tracking-tight"><TrendingUp className="h-6 w-6 mr-3 text-blue-500" /> Growth Analytics</h3>
                <span className="text-[9px] font-black px-4 py-2 bg-white/5 rounded-full text-slate-400 uppercase tracking-widest">Last 30 Days</span>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{n:'Jan', v:100}, {n:'Feb', v:240}, {n:'Mar', v:420}, {n:'Apr', v:380}, {n:'May', v:510}, {n:'Jun', v:780}]}>
                    <defs>
                      <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="n" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontWeight="900" />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontWeight="900" />
                    <Tooltip contentStyle={{ backgroundColor: '#02151c', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" fillOpacity={1} fill="url(#colorV)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass p-10 rounded-[4rem] border-white/5">
              <h3 className="text-2xl font-black text-white mb-8 flex items-center italic tracking-tight"><MapIcon className="h-6 w-6 mr-3 text-blue-500" /> Density</h3>
              <div className="h-[400px] rounded-[2.5rem] overflow-hidden grayscale brightness-75 border border-white/5 shadow-2xl">
                <MapView submissions={state.submissions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issuance' && (
        <div className="max-w-5xl mx-auto space-y-10">
           <div className="bg-blue-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
               <h2 className="text-4xl font-black italic tracking-tighter">Issuance Queue</h2>
               <p className="text-blue-100 text-lg font-medium opacity-80 mt-2">Final government audit for carbon credit minting.</p>
             </div>
             <Gavel className="absolute -bottom-10 -right-10 h-64 w-64 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
           </div>

           <div className="space-y-6">
             {issuanceQueue.map(sub => (
               <div key={sub.id} className="glass-card p-10 rounded-[4rem] flex flex-col md:flex-row gap-10 hover:border-blue-500/50">
                  <div className="w-full md:w-48 h-48 rounded-[2.5rem] overflow-hidden shrink-0 shadow-2xl border border-white/5">
                    <img src={sub.imageUrl} className="w-full h-full object-cover" alt="S" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-2xl text-white italic">{sub.ecosystemType} - {sub.location.region}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">NGO Auditor: {sub.ngoName || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Minting Payload</p>
                        <p className="text-4xl font-black text-white">{sub.estimatedCarbon} <span className="text-base font-medium text-slate-500">tCO2</span></p>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-white/5 rounded-[2rem] text-sm text-slate-400 font-medium italic border border-white/5 leading-relaxed">
                       " {sub.verifierComments} "
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                       <input 
                         type="text" 
                         placeholder="Registry audit findings..." 
                         onChange={(e) => setComments(e.target.value)}
                         className="flex-1 glass border-white/5 rounded-2xl text-sm px-6 py-4 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-700" 
                       />
                       <button onClick={() => { onReject(sub.id, comments); setComments(''); }} className="px-8 py-4 glass text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-400/10">Deny</button>
                       <button onClick={() => { onIssue(sub.id, comments); setComments(''); }} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">Issue Credit</button>
                    </div>
                  </div>
               </div>
             ))}
             {issuanceQueue.length === 0 && (
               <div className="py-32 text-center glass border-dashed border-white/10 rounded-[4rem]">
                  <CheckCircle2 className="h-16 w-16 text-white/5 mx-auto mb-6" />
                  <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Queue Clear</p>
                  <p className="text-sm text-slate-600 font-medium mt-2">All field telemetry is synchronized.</p>
               </div>
             )}
           </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="glass rounded-[4rem] border-white/5 overflow-hidden">
           <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <h3 className="text-2xl font-black text-white flex items-center italic tracking-tight"><Activity className="h-6 w-6 mr-3 text-blue-500" /> Immutable Logs</h3>
             <div className="relative w-full md:w-96">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
               <input placeholder="Filter events..." className="w-full glass pl-14 pr-6 py-4 border-white/5 rounded-2xl text-xs text-white placeholder-slate-700 font-bold" />
             </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-white/5 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">
                 <tr>
                   <th className="px-10 py-6">Timestamp</th>
                   <th className="px-10 py-6">User</th>
                   <th className="px-10 py-6">Action</th>
                   <th className="px-10 py-6">ID</th>
                   <th className="px-10 py-6">Details</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {state.auditLogs.map(log => (
                   <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-10 py-6 text-slate-400 font-mono text-[10px] tracking-widest">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center text-[10px] font-black">{log.userName[0]}</span>
                          <span className="font-black text-white uppercase text-[11px] tracking-tight">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6"><span className="px-4 py-1.5 glass rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest border-blue-400/20">{log.action}</span></td>
                      <td className="px-10 py-6 text-slate-500 font-mono text-[10px]">{log.targetId?.slice(-8)}</td>
                      <td className="px-10 py-6 text-slate-300 font-medium truncate max-w-xs">{log.details}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};
