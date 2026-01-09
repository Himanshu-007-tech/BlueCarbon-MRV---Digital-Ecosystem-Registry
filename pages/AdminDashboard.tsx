
import React, { useEffect, useState } from 'react';
import { AppState, CreditStatus, SubmissionStatus, Submission } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Added Navigation to fix missing reference
import { Database, Activity, LayoutGrid, Users, Map as MapIcon, ShieldCheck, CheckCircle2, ChevronRight, Gavel, Search, Globe, TrendingUp, Landmark, Layers, Navigation } from 'lucide-react';
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
    <div className="space-y-12 animate-fade-in pb-32 pt-32 max-w-7xl mx-auto px-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 glass p-10 rounded-[3rem] border-cyan-400/10 shadow-[0_0_80px_rgba(0,180,216,0.1)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <Landmark className="h-5 w-5 text-cyan-400" />
             <span className="text-[10px] font-black text-cyan-800 uppercase tracking-[0.4em]">National Blue Carbon Registry</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight italic">Registry Controller</h1>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-cyan-600 text-white shadow-lg border border-cyan-400/30' : 'glass text-cyan-800 hover:text-white border-cyan-400/5'}`}>Dashboard</button>
           <button onClick={() => setActiveTab('issuance')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'issuance' ? 'bg-cyan-600 text-white shadow-lg border border-cyan-400/30' : 'glass text-cyan-800 hover:text-white border-cyan-400/5'}`}>
             Issuance
             {issuanceQueue.length > 0 && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full border-2 border-[#001219] animate-pulse" />}
           </button>
           <button onClick={() => setActiveTab('audit')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'audit' ? 'bg-cyan-600 text-white shadow-lg border border-cyan-400/30' : 'glass text-cyan-800 hover:text-white border-cyan-400/5'}`}>Ledger</button>
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-12">
          {/* Top Metric Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass p-8 rounded-[3rem] border-cyan-400/5 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Globe className="h-16 w-16 text-cyan-400" /></div>
               <p className="text-[10px] font-black text-cyan-900 uppercase tracking-widest mb-4">Issuance Volume</p>
               <p className="text-4xl font-black text-white italic">{totalCarbon} <span className="text-sm font-medium text-cyan-900 tracking-normal">tCO2e</span></p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-cyan-400/5 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Users className="h-16 w-16 text-cyan-400" /></div>
               <p className="text-[10px] font-black text-cyan-900 uppercase tracking-widest mb-4">Active Nodes</p>
               <p className="text-4xl font-black text-white italic">{state.userCount}</p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-cyan-400/5 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Landmark className="h-16 w-16 text-cyan-400" /></div>
               <p className="text-[10px] font-black text-cyan-900 uppercase tracking-widest mb-4">Registry Value</p>
               <p className="text-4xl font-black text-cyan-400 italic">${(totalCarbon * 15).toLocaleString()}</p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-cyan-400/5 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck className="h-16 w-16 text-cyan-400" /></div>
               <p className="text-[10px] font-black text-cyan-900 uppercase tracking-widest mb-4">Network Integrity</p>
               <p className="text-4xl font-black text-[#00b4d8] uppercase tracking-tighter italic">AA+</p>
            </div>
          </div>

          {/* MAIN DUAL COLUMN VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Column 1: Analytics & Growth */}
            <div className="glass p-12 rounded-[5rem] border-cyan-400/10 shadow-2xl space-y-12">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-white flex items-center italic tracking-tight"><TrendingUp className="h-8 w-8 mr-4 text-cyan-400" /> Sequestration Curve</h3>
                <span className="text-[10px] font-black px-5 py-2 glass rounded-full text-cyan-400 uppercase tracking-widest border-cyan-400/20">30D Telemetry</span>
              </div>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{n:'Jan', v:100}, {n:'Feb', v:240}, {n:'Mar', v:420}, {n:'Apr', v:380}, {n:'May', v:510}, {n:'Jun', v:780}]}>
                    <defs>
                      <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00b4d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(34,211,238,0.05)" />
                    <XAxis dataKey="n" stroke="#083344" fontSize={10} tickLine={false} axisLine={false} fontWeight="900" />
                    <YAxis stroke="#083344" fontSize={10} tickLine={false} axisLine={false} fontWeight="900" />
                    <Tooltip contentStyle={{ backgroundColor: '#001219', borderRadius: '2rem', border: '1px solid rgba(34,211,238,0.2)', color: '#fff' }} />
                    <Area type="monotone" dataKey="v" stroke="#00b4d8" fillOpacity={1} fill="url(#colorV)" strokeWidth={5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 bg-[#001219]/40 border border-cyan-400/5 rounded-[2.5rem] text-center">
                    <p className="text-[9px] font-black text-cyan-900 uppercase tracking-widest mb-2">Growth Velocity</p>
                    <p className="text-2xl font-black text-white italic">+14.2%</p>
                 </div>
                 <div className="p-6 bg-[#001219]/40 border border-cyan-400/5 rounded-[2.5rem] text-center">
                    <p className="text-[9px] font-black text-cyan-900 uppercase tracking-widest mb-2">Confidence Delta</p>
                    <p className="text-2xl font-black text-white italic">+0.8%</p>
                 </div>
              </div>
            </div>
            
            {/* Column 2: THE MAP COLUMN */}
            <div className="glass p-12 rounded-[5rem] border-cyan-400/10 shadow-2xl space-y-12">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-white flex items-center italic tracking-tight"><MapIcon className="h-8 w-8 mr-4 text-cyan-400" /> Registry Density Map</h3>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]"></div>
                   <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Active Layers: 4</span>
                </div>
              </div>
              <div className="h-[450px] rounded-[3.5rem] overflow-hidden border border-cyan-400/10 shadow-inner group relative">
                <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color pointer-events-none z-10"></div>
                <MapView submissions={state.submissions} />
                
                {/* Floating Map Controls Overlay */}
                <div className="absolute bottom-8 right-8 z-[20] flex flex-col gap-3">
                   <button className="p-4 glass rounded-2xl border-cyan-400/20 hover:bg-cyan-600 transition-all shadow-2xl">
                      <Layers className="h-5 w-5 text-white" />
                   </button>
                   <button className="p-4 glass rounded-2xl border-cyan-400/20 hover:bg-cyan-600 transition-all shadow-2xl">
                      <Navigation className="h-5 w-5 text-white" />
                   </button>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-4">
                   <p className="text-[11px] font-black text-cyan-900 uppercase tracking-widest">Global Node Sync Status</p>
                   <span className="text-[11px] font-black text-emerald-400 uppercase italic">All Regions Operational</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#001219] rounded-full overflow-hidden p-0.5 border border-cyan-400/5">
                   <div className="h-full bg-cyan-400 rounded-full w-[94%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issuance' && (
        <div className="max-w-5xl mx-auto space-y-12">
           <div className="bg-cyan-700 p-16 rounded-[5rem] text-white shadow-[0_40px_100px_rgba(0,180,216,0.3)] relative overflow-hidden group border border-cyan-400/30">
             <div className="relative z-10">
               <h2 className="text-5xl font-black italic tracking-tighter">Issuance Terminal</h2>
               <p className="text-cyan-100 text-xl font-medium opacity-80 mt-4 max-w-lg italic">Final validation node for carbon asset minting and public registry issuance.</p>
             </div>
             <Gavel className="absolute -bottom-16 -right-16 h-80 w-80 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
           </div>

           <div className="space-y-8">
             {issuanceQueue.map(sub => (
               <div key={sub.id} className="glass-card p-12 rounded-[4rem] flex flex-col lg:flex-row gap-12 hover:border-cyan-400/40 transition-all shadow-2xl bg-[#001219]/40 border-cyan-400/10">
                  <div className="w-full lg:w-64 h-64 rounded-[3.5rem] overflow-hidden shrink-0 shadow-2xl border border-cyan-400/10">
                    <img src={sub.imageUrl} className="w-full h-full object-cover grayscale-[0.2] saturate-150" alt="S" />
                  </div>
                  <div className="flex-1 space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-3xl text-white italic tracking-tight">{sub.ecosystemType} - {sub.location.region}</h4>
                        <p className="text-[10px] font-black text-cyan-800 uppercase tracking-widest mt-2 flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" /> Auditor: {sub.ngoName || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Minting Payload</p>
                        <p className="text-5xl font-black text-white italic tracking-tighter">{sub.estimatedCarbon} <span className="text-lg font-medium text-cyan-900 tracking-normal">tCO2</span></p>
                      </div>
                    </div>
                    
                    <div className="p-8 bg-[#001219] rounded-[2.5rem] text-base text-cyan-100/60 font-medium italic border border-cyan-400/5 leading-relaxed shadow-inner">
                       " {sub.verifierComments} "
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-4">
                       <input 
                         type="text" 
                         placeholder="Transmit audit findings to registry..." 
                         onChange={(e) => setComments(e.target.value)}
                         className="flex-1 glass border-cyan-400/10 rounded-3xl text-sm px-8 py-5 focus:ring-1 focus:ring-cyan-500 text-white placeholder-cyan-900/30 font-bold italic shadow-2xl" 
                       />
                       <button onClick={() => { onReject(sub.id, comments); setComments(''); }} className="px-10 py-5 glass text-red-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-red-400/10 border-red-400/20">Deny Asset</button>
                       <button onClick={() => { onIssue(sub.id, comments); setComments(''); }} className="px-12 py-5 bg-cyan-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-cyan-400/20 hover:scale-105 active:scale-95 transition-all border border-cyan-400/30">Issue Credit</button>
                    </div>
                  </div>
               </div>
             ))}
             {issuanceQueue.length === 0 && (
               <div className="py-48 text-center glass border-dashed border-cyan-400/10 rounded-[5rem] bg-cyan-900/5 opacity-40">
                  <CheckCircle2 className="h-24 w-24 text-cyan-400/10 mx-auto mb-8" />
                  <p className="text-3xl font-black text-cyan-400 uppercase tracking-[0.5em] italic">Queue Clear</p>
                  <p className="text-lg text-cyan-900 font-bold mt-4 italic">National Registry Telemetry Synchronized</p>
               </div>
             )}
           </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="glass rounded-[5rem] border-cyan-400/10 overflow-hidden shadow-2xl bg-[#001219]/20">
           <div className="p-12 border-b border-cyan-400/10 flex flex-col md:flex-row justify-between items-center gap-8 bg-cyan-950/20">
             <h3 className="text-3xl font-black text-white flex items-center italic tracking-tight"><Activity className="h-8 w-8 mr-4 text-cyan-400" /> Immutable Ledger</h3>
             <div className="relative w-full md:w-[450px]">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-800" />
               <input placeholder="Query registry event logs..." className="w-full glass pl-16 pr-8 py-5 border-cyan-400/10 rounded-[2rem] text-[10px] text-white placeholder-cyan-900/40 font-black uppercase tracking-widest" />
             </div>
           </div>
           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left text-sm border-collapse">
               <thead className="bg-[#001219] text-[10px] uppercase tracking-[0.5em] text-cyan-700 font-black border-b border-cyan-400/10">
                 <tr>
                   <th className="px-12 py-8">Block Timestamp</th>
                   <th className="px-12 py-8">Authorized Node</th>
                   <th className="px-12 py-8">Action Protocol</th>
                   <th className="px-12 py-8">Asset Hash</th>
                   <th className="px-12 py-8">Telemetry Payload</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-cyan-400/5">
                 {state.auditLogs.map(log => (
                   <tr key={log.id} className="hover:bg-cyan-400/5 transition-colors group">
                      <td className="px-12 py-8 text-cyan-900 font-mono text-[10px] tracking-widest italic">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-5">
                          <span className="w-10 h-10 bg-cyan-600/20 text-cyan-400 rounded-2xl flex items-center justify-center text-[11px] font-black border border-cyan-400/20">{log.userName[0]}</span>
                          <span className="font-black text-white uppercase text-[11px] tracking-tight group-hover:text-cyan-400 transition-colors">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-12 py-8"><span className="px-5 py-2 glass rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] border-cyan-400/20 bg-cyan-400/5">{log.action}</span></td>
                      <td className="px-12 py-8 text-cyan-900 font-mono text-[10px]">{log.targetId?.slice(-12).toUpperCase()}</td>
                      <td className="px-12 py-8 text-cyan-100/40 font-medium italic truncate max-w-xs">{log.details}</td>
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
