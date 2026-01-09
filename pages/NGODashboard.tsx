
import React, { useState } from 'react';
// Added Map as MapIcon to fix missing reference
import { Check, X, Shield, Navigation, Info, AlertTriangle, Eye, FileText, ClipboardCheck, History, Search, Activity, Cpu, Layers, Map as MapIcon } from 'lucide-react';
import { Submission, SubmissionStatus, User } from '../types';
import { MapView } from '../components/MapView';

interface NGODashboardProps {
  user: User;
  submissions: Submission[];
  onApprove: (id: string, comments: string) => void;
  onReject: (id: string, comments: string) => void;
  onFlag: (id: string, comments: string) => void;
}

export const NGODashboard: React.FC<NGODashboardProps> = ({ user, submissions, onApprove, onReject, onFlag }) => {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [comments, setComments] = useState('');

  const pendingSubmissions = submissions.filter(s => 
    s.status === SubmissionStatus.AI_VERIFIED || s.status === SubmissionStatus.PENDING
  );

  return (
    <div className="space-y-12 pt-32 pb-32 max-w-[1600px] mx-auto px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 glass p-12 rounded-[4rem] border-cyan-400/10 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-all duration-1000">
          <Activity className="h-48 w-48 text-cyan-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Cpu className="h-6 w-6 text-cyan-400" />
            <span className="text-[11px] font-black text-cyan-800 uppercase tracking-[0.5em] italic">Authorized Verifier Node: {user.organization}</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter italic leading-none">Field Auditing</h1>
        </div>
        <div className="flex gap-8 relative z-10">
          <div className="bg-cyan-900/30 px-12 py-6 rounded-[3rem] border border-cyan-400/20 text-center backdrop-blur-3xl shadow-2xl">
            <p className="text-[10px] font-black text-cyan-700 uppercase tracking-widest mb-2">Queue Depth</p>
            <p className="text-5xl font-black text-white italic tracking-tighter">{pendingSubmissions.length}</p>
          </div>
          <div className="bg-blue-900/20 px-12 py-6 rounded-[3rem] border border-blue-400/10 text-center backdrop-blur-3xl shadow-2xl">
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">Registry Load</p>
            <p className="text-5xl font-black text-[#00b4d8] italic tracking-tighter">LOW</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* SIDEBAR: QUEUE COLUMN */}
        <div className="lg:col-span-1 space-y-8 h-full">
           <div className="glass p-12 rounded-[5rem] border-cyan-400/10 space-y-10 shadow-2xl sticky top-32 bg-[#001219]/20">
              <div className="flex items-center justify-between border-b border-cyan-400/10 pb-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em] flex items-center italic">
                  <ClipboardCheck className="h-5 w-5 mr-3 text-cyan-400" /> Feed
                </h3>
                <span className="text-[10px] font-black text-cyan-800">SYNCED</span>
              </div>
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                 {pendingSubmissions.map(sub => (
                   <div 
                    key={sub.id} 
                    onClick={() => setSelectedSub(sub)}
                    className={`p-6 rounded-[3rem] border cursor-pointer transition-all duration-700 group ${selectedSub?.id === sub.id ? 'bg-cyan-600/30 border-cyan-400/50 shadow-[0_30px_60px_rgba(0,180,216,0.3)]' : 'bg-[#001219]/60 border-cyan-400/5 hover:border-cyan-400/30 hover:bg-cyan-900/10'}`}
                   >
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0 shadow-2xl border border-cyan-400/10 group-hover:scale-105 transition-transform">
                          <img src={sub.imageUrl} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="E" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-base font-black text-white truncate uppercase italic tracking-tighter">{sub.ecosystemType}</p>
                           <p className="text-[10px] text-cyan-800 font-black truncate mt-1 uppercase tracking-widest">{sub.location.region}</p>
                           <div className="mt-4 flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${sub.aiScore > 0.8 ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-amber-400'}`} />
                              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest italic">Conf: {(sub.aiScore * 100).toFixed(0)}%</span>
                           </div>
                        </div>
                     </div>
                   </div>
                 ))}
                 {pendingSubmissions.length === 0 && <div className="py-48 text-center opacity-20 text-[11px] font-black uppercase tracking-[0.6em] text-cyan-400 italic">No Pending Audits</div>}
              </div>
           </div>
        </div>

        {/* MAIN: ANALYSIS & MAP COLUMN VIEW */}
        <div className="lg:col-span-3">
          {selectedSub ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
               {/* Analysis Column */}
               <div className="glass rounded-[5rem] border-cyan-400/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.7)] h-full flex flex-col">
                  <div className="p-12 border-b border-cyan-400/10 bg-cyan-950/20 backdrop-blur-3xl flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-cyan-600/20 text-cyan-400 rounded-[2.5rem] flex items-center justify-center font-black text-3xl shadow-2xl italic border border-cyan-400/20">
                        {selectedSub.ecosystemType[0]}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter italic leading-none">Node: {selectedSub.id?.slice(-8).toUpperCase()}</h2>
                        <p className="text-[10px] text-cyan-800 font-black uppercase tracking-[0.5em] flex items-center mt-3 italic">
                          <Navigation className="h-4 w-4 mr-3 text-cyan-400" /> GIS Coordinates Locked
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-12 space-y-12 flex-1">
                     <div className="relative rounded-[4rem] overflow-hidden border border-cyan-400/10 group shadow-2xl aspect-square">
                        <img src={selectedSub.imageUrl} className="w-full h-full object-cover saturate-150 grayscale-[0.1] group-hover:scale-105 transition-all duration-1000" alt="Field Evidence" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001219] via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                           <div className="glass px-6 py-3 rounded-2xl border-cyan-400/30 backdrop-blur-2xl">
                              <p className="text-[9px] font-black text-cyan-900 uppercase tracking-widest mb-1">Ecosystem Grade</p>
                              <p className="text-xl font-black text-white italic">PRIME-A</p>
                           </div>
                           <div className="p-4 glass rounded-full border-cyan-400/30">
                              <Eye className="h-6 w-6 text-white" />
                           </div>
                        </div>
                     </div>

                     <div className="p-12 glass-card rounded-[4rem] space-y-10 border-cyan-400/10 bg-[#001219]/60 shadow-inner">
                        <div className="flex justify-between items-center px-4">
                           <h4 className="text-[11px] font-black text-cyan-800 uppercase tracking-[0.5em] italic">AI Health Analysis</h4>
                           <span className="text-5xl font-black text-white italic tracking-tighter">{(selectedSub.aiScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-3.5 bg-black/60 rounded-full overflow-hidden p-1 border border-cyan-400/5">
                           <div className="h-full bg-gradient-to-r from-cyan-600 to-[#00b4d8] rounded-full transition-all duration-1500 shadow-[0_0_20px_rgba(34,211,238,0.5)]" style={{ width: `${selectedSub.aiScore * 100}%` }}></div>
                        </div>
                        <p className="text-2xl text-cyan-100/60 font-medium italic leading-relaxed text-center px-8 border-t border-cyan-400/5 pt-10">"{selectedSub.aiAnalysis}"</p>
                     </div>

                     <div className="space-y-6">
                        <label className="text-[11px] font-black text-cyan-800 uppercase tracking-[0.5em] px-8 flex items-center gap-4 italic">
                           <FileText className="h-4.5 w-4.5 text-cyan-400" /> Verifier Annotations
                        </label>
                        <textarea 
                           placeholder="Enter technical audit findings for the registry controller..."
                           value={comments}
                           onChange={(e) => setComments(e.target.value)}
                           className="w-full glass rounded-[4rem] border-cyan-400/10 text-lg p-12 focus:ring-1 focus:ring-cyan-500 h-64 text-white placeholder-cyan-900/30 font-bold italic shadow-2xl bg-[#001219]/40"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-8 pt-8">
                        <button onClick={() => { onReject(selectedSub.id, comments); setSelectedSub(null); setComments(''); }} className="w-full py-6 glass text-red-400 rounded-[3rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-400/10 transition-all border-red-400/20">Deny Asset</button>
                        <button onClick={() => { onApprove(selectedSub.id, comments); setSelectedSub(null); setComments(''); }} className="w-full py-6 bg-cyan-600 text-white rounded-[3rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_30px_60px_rgba(0,180,216,0.3)] hover:scale-[1.03] active:scale-95 transition-all border border-cyan-400/30">Verify Deployment</button>
                     </div>
                  </div>
               </div>

               {/* MAP COLUMN */}
               <div className="space-y-12 h-full flex flex-col">
                  <div className="glass p-12 rounded-[5rem] border-cyan-400/10 shadow-2xl flex-1 flex flex-col space-y-12">
                     <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-black text-white italic tracking-tight flex items-center gap-4">
                           <MapIcon className="h-8 w-8 text-cyan-400" /> Spatial Context
                        </h3>
                        <div className="flex gap-3">
                           <div className="p-3 glass rounded-2xl border-cyan-400/20"><Layers className="h-5 w-5 text-cyan-900" /></div>
                        </div>
                     </div>

                     <div className="flex-1 min-h-[500px] rounded-[4rem] overflow-hidden border border-cyan-400/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative group">
                        <div className="absolute inset-0 bg-cyan-900/20 mix-blend-color z-10 pointer-events-none"></div>
                        <MapView submissions={[selectedSub]} />
                        <div className="absolute top-10 right-10 z-[20] glass p-4 rounded-3xl border-cyan-400/30 backdrop-blur-3xl shadow-2xl">
                           <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div> TELEMETRY SYNCED
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-8">
                        <div className="p-10 glass-card rounded-[3.5rem] border-cyan-400/10 bg-cyan-900/10 group hover:bg-cyan-900/20 transition-all">
                           <p className="text-[10px] font-black text-cyan-800 uppercase tracking-widest mb-3">Est. Biomass Yield</p>
                           <p className="text-5xl font-black text-white italic tracking-tighter">{selectedSub.estimatedCarbon} <span className="text-base font-bold text-cyan-900">tCO2e</span></p>
                        </div>
                        <div className="p-10 glass-card rounded-[3.5rem] border-cyan-400/10 bg-blue-900/10 group hover:bg-blue-900/20 transition-all">
                           <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-3">Field Transmission</p>
                           <p className="text-3xl font-black text-white italic tracking-tighter">{new Date(selectedSub.timestamp).toLocaleDateString()}</p>
                           <p className="text-[9px] font-black text-blue-900 uppercase mt-2 tracking-widest">12:04:22 UTC</p>
                        </div>
                     </div>

                     <div className="p-10 glass rounded-[3.5rem] border-cyan-400/10 bg-[#001219]/40 space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-black text-cyan-700 uppercase tracking-widest italic">
                           <span>Geofence Validation Status</span>
                           <Check className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="bg-black/40 p-5 rounded-[1.5rem] border border-cyan-400/5">
                              <p className="text-[9px] font-black text-cyan-900 mb-2 uppercase tracking-widest">Latitude</p>
                              <p className="text-xl font-mono text-cyan-100 font-black tracking-tighter italic">{selectedSub.location.lat.toFixed(6)}</p>
                           </div>
                           <div className="bg-black/40 p-5 rounded-[1.5rem] border border-cyan-400/5">
                              <p className="text-[9px] font-black text-cyan-900 mb-2 uppercase tracking-widest">Longitude</p>
                              <p className="text-xl font-mono text-cyan-100 font-black tracking-tighter italic">{selectedSub.location.lng.toFixed(6)}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-[80vh] flex flex-col items-center justify-center glass border-dashed border-cyan-400/10 rounded-[6rem] text-center p-32 space-y-12 group bg-cyan-900/5 shadow-[0_100px_150px_rgba(0,0,0,0.4)]">
               <div className="p-20 glass rounded-full group-hover:marine-glow transition-all duration-1000 border-cyan-400/10 bg-[#001219]/40 relative overflow-hidden">
                  <Search className="h-48 w-48 text-cyan-400/5 group-hover:text-cyan-400/20 transition-colors duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapIcon className="h-24 w-24 text-cyan-400 animate-pulse" />
                  </div>
               </div>
               <div className="space-y-6">
                  <p className="text-6xl font-black text-white italic tracking-tighter">Terminal Awaiting Sync</p>
                  <p className="text-cyan-100/30 max-w-xl mx-auto text-2xl font-medium italic leading-relaxed">Select a registry entry from the field queue to initialize the dual-column analysis node.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
