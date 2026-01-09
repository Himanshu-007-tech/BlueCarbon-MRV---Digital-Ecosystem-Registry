
import React, { useState } from 'react';
import { Check, X, Shield, Navigation, Info, AlertTriangle, Eye, FileText, ClipboardCheck, History, Search, Activity, Cpu } from 'lucide-react';
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
    <div className="space-y-12 pt-32 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 glass p-12 rounded-[4rem] border-cyan-400/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-all duration-1000">
          <Activity className="h-48 w-48 text-cyan-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <Cpu className="h-5 w-5 text-cyan-400" />
            <span className="text-[11px] font-black text-cyan-800 uppercase tracking-[0.5em]">Verifier Hub: {user.organization}</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter italic leading-none">Node Audit</h1>
        </div>
        <div className="flex gap-6 relative z-10">
          <div className="bg-cyan-900/30 px-10 py-5 rounded-[2.5rem] border border-cyan-400/20 text-center backdrop-blur-xl">
            <p className="text-[10px] font-black text-cyan-700 uppercase tracking-widest mb-1">Queue</p>
            <p className="text-4xl font-black text-white italic">{pendingSubmissions.length}</p>
          </div>
          <div className="bg-blue-900/20 px-10 py-5 rounded-[2.5rem] border border-blue-400/10 text-center backdrop-blur-xl">
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Load</p>
            <p className="text-4xl font-black text-blue-300 italic">LOW</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-8">
           <div className="glass p-10 rounded-[4rem] border-cyan-400/10 space-y-8 shadow-2xl">
              <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.4em] flex items-center italic">
                <ClipboardCheck className="h-5 w-5 mr-3" /> Field Queue
              </h3>
              <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar">
                 {pendingSubmissions.map(sub => (
                   <div 
                    key={sub.id} 
                    onClick={() => setSelectedSub(sub)}
                    className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all duration-500 ${selectedSub?.id === sub.id ? 'bg-cyan-600/20 border-cyan-400/50 shadow-[0_20px_40px_rgba(0,180,216,0.2)]' : 'bg-[#001219]/40 border-cyan-400/5 hover:border-cyan-400/20 hover:bg-cyan-900/10'}`}
                   >
                     <div className="flex items-center gap-5">
                        <img src={sub.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-2xl grayscale-[0.3]" alt="E" />
                        <div className="min-w-0">
                           <p className="text-sm font-black text-white truncate uppercase italic tracking-tighter">{sub.ecosystemType}</p>
                           <p className="text-[9px] text-cyan-800 font-black truncate mt-1 uppercase tracking-widest">{sub.location.region}</p>
                           <div className="mt-3 flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${sub.aiScore > 0.8 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                              <span className="text-[8px] font-black text-cyan-900 uppercase tracking-widest">Confidence: {(sub.aiScore * 100).toFixed(0)}%</span>
                           </div>
                        </div>
                     </div>
                   </div>
                 ))}
                 {pendingSubmissions.length === 0 && <div className="py-32 text-center opacity-20 text-[11px] font-black uppercase tracking-[0.5em] text-cyan-400">Queue Synchronized</div>}
              </div>
           </div>
        </div>

        <div className="lg:col-span-3">
          {selectedSub ? (
            <div className="glass rounded-[5rem] border-cyan-400/10 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 shadow-[0_50px_100px_rgba(0,0,0,0.7)]">
               <div className="p-12 border-b border-cyan-400/10 flex flex-col md:flex-row justify-between items-center bg-cyan-950/20 backdrop-blur-2xl gap-8">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-cyan-600 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-[0_0_40px_rgba(0,180,216,0.4)] italic border border-cyan-400/30">
                      {selectedSub.ecosystemType[0]}
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tighter italic">Audit Node: {selectedSub.id?.slice(-8).toUpperCase()}</h2>
                      <p className="text-[11px] text-cyan-400 font-black uppercase tracking-[0.5em] flex items-center mt-2 italic">
                        <Navigation className="h-4 w-4 mr-3" /> GIS Geofence Validated
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => { onReject(selectedSub.id, comments); setSelectedSub(null); setComments(''); }} className="px-8 py-5 glass text-red-400 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-400/10 transition-all border-red-400/20">Deny Asset</button>
                     <button onClick={() => { onApprove(selectedSub.id, comments); setSelectedSub(null); setComments(''); }} className="px-12 py-5 bg-cyan-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(0,180,216,0.4)] hover:scale-[1.03] active:scale-95 transition-all border border-cyan-400/30">Verify Site</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-16 p-16">
                  <div className="space-y-12">
                     <div className="relative rounded-[4rem] overflow-hidden border border-cyan-400/10 group shadow-2xl aspect-video">
                        <img src={selectedSub.imageUrl} className="w-full h-full object-cover saturate-150" alt="Field Evidence" />
                        <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay"></div>
                        <div className="absolute top-8 right-8 px-5 py-2.5 glass rounded-full text-[10px] font-black text-white flex items-center gap-3 border-cyan-400/30 shadow-2xl backdrop-blur-3xl">
                           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                           GEOFENCE ACTIVE
                        </div>
                     </div>

                     <div className="p-10 glass-card rounded-[4rem] space-y-8 border-cyan-400/10 bg-[#001219]/40">
                        <div className="flex justify-between items-center">
                           <h4 className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.4em] italic">AI Diagnostic Verdict</h4>
                           <span className="text-4xl font-black text-white italic tracking-tighter">{(selectedSub.aiScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-3 bg-[#001219] rounded-full overflow-hidden p-0.5 border border-cyan-400/5">
                           <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full transition-all duration-1500 shadow-[0_0_20px_rgba(0,180,216,0.6)]" style={{ width: `${selectedSub.aiScore * 100}%` }}></div>
                        </div>
                        <p className="text-lg text-cyan-100/60 font-medium italic leading-relaxed text-center px-4">"{selectedSub.aiAnalysis}"</p>
                     </div>
                  </div>

                  <div className="space-y-12">
                     <div className="h-72 rounded-[4rem] overflow-hidden border border-cyan-400/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-[#001219]">
                        <MapView submissions={[selectedSub]} />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-8">
                        <div className="p-8 glass-card rounded-[3rem] border-cyan-400/10 bg-cyan-900/10">
                           <p className="text-[10px] font-black text-cyan-800 uppercase tracking-widest mb-2">Biomass Yield</p>
                           <p className="text-4xl font-black text-white italic tracking-tighter">{selectedSub.estimatedCarbon} <span className="text-sm font-bold text-cyan-900">tCO2e</span></p>
                        </div>
                        <div className="p-8 glass-card rounded-[3rem] border-cyan-400/10 bg-blue-900/10">
                           <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2">Recorded At</p>
                           <p className="text-3xl font-black text-white italic tracking-tighter">{new Date(selectedSub.timestamp).toLocaleDateString()}</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <label className="text-[11px] font-black text-cyan-800 uppercase tracking-[0.5em] px-6 flex items-center gap-3 italic">
                           <FileText className="h-4 w-4" /> Audit Observations
                        </label>
                        <textarea 
                           placeholder="Transmit verification notes to the registry controller..."
                           value={comments}
                           onChange={(e) => setComments(e.target.value)}
                           className="w-full glass rounded-[3.5rem] border-cyan-400/10 text-base p-10 focus:ring-1 focus:ring-cyan-500 h-52 text-white placeholder-cyan-900/30 font-medium shadow-2xl bg-black/20"
                        />
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-[75vh] flex flex-col items-center justify-center glass border-dashed border-cyan-400/10 rounded-[5rem] text-center p-24 space-y-10 group bg-cyan-900/5">
               <div className="p-14 glass rounded-full group-hover:marine-glow transition-all duration-1000 border-cyan-400/10 bg-[#001219]/40">
                  <Search className="h-32 w-32 text-cyan-400/10 group-hover:text-cyan-400 transition-colors duration-700" />
               </div>
               <div className="space-y-4">
                  <p className="text-5xl font-black text-white italic tracking-tighter">Terminal Synced</p>
                  <p className="text-cyan-100/40 max-w-sm mx-auto text-xl font-medium italic">Select a field deployment to initialize the multi-stage verification node.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
