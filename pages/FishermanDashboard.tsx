
import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Plus, Image as ImageIcon, Map, Loader2, CheckCircle, Info, AlertCircle, Navigation, ShieldCheck, Leaf, Globe, Zap } from 'lucide-react';
import { Submission, SubmissionStatus, User } from '../types';
import { analyzeBlueCarbonImage } from '../services/geminiService';
import { uploadRestorationImage } from '../services/supabase';

interface FishermanDashboardProps {
  user: User;
  submissions: Submission[];
  onNewSubmission: (sub: Partial<Submission>) => void;
}

export const FishermanDashboard: React.FC<FishermanDashboardProps> = ({ user, submissions, onNewSubmission }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ecosystem, setEcosystem] = useState<'MANGROVE' | 'SEAGRASS'>('MANGROVE');
  const [region, setRegion] = useState('Kerala Coastal');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 10.8505, lng: 76.2711 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Auto-location failed", err)
      );
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl || !selectedFile) return;
    setIsUploading(true);
    
    try {
      const finalImageUrl = await uploadRestorationImage(selectedFile, user.id);
      const analysis = await analyzeBlueCarbonImage(previewUrl, ecosystem);

      const newSub: Partial<Submission> = {
        id: 'sub-' + Math.random().toString(36).substring(2, 11),
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        imageUrl: finalImageUrl,
        location: { 
          lat: coords.lat, 
          lng: coords.lng,
          region: region
        },
        ecosystemType: ecosystem,
        status: analysis.isVerified ? SubmissionStatus.AI_VERIFIED : SubmissionStatus.PENDING,
        aiScore: analysis.confidenceScore,
        aiAnalysis: analysis.healthAssessment,
        estimatedArea: 0.5,
        estimatedCarbon: Math.round(analysis.estimatedCarbonPotential * 0.5),
      };

      onNewSubmission(newSub);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      alert("Submission error: " + (err.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  const userSubmissions = submissions.filter(s => s.userId === user.id);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-32 px-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 glass p-12 rounded-[4rem] border-cyan-400/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.5em]">Field Telemetry Hub</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter italic leading-none">Restoration Site</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-cyan-900/20 border border-cyan-400/20 px-8 py-4 rounded-[2rem] text-center backdrop-blur-md">
             <p className="text-[10px] font-black text-cyan-700 uppercase tracking-widest mb-1">Status</p>
             <p className="text-xs font-black text-cyan-400 uppercase">Synced</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-400/20 px-8 py-4 rounded-[2rem] text-center backdrop-blur-md">
             <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Ping</p>
             <p className="text-xs font-black text-blue-300">28ms</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: "Active Nodes", value: userSubmissions.length, color: "text-white" },
          { label: "Carbon Yield", value: `${userSubmissions.filter(s => s.status === SubmissionStatus.APPROVED).reduce((acc, s) => acc + s.estimatedCarbon, 0)} t`, color: "text-cyan-400" },
          { label: "Credit Value", value: `$${userSubmissions.filter(s => s.status === SubmissionStatus.APPROVED).reduce((acc, s) => acc + s.estimatedCarbon, 0) * 15}`, color: "text-blue-400" }
        ].map((stat, i) => (
          <div key={i} className="glass p-12 rounded-[4rem] border-cyan-400/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform">
               <Zap className="h-32 w-32 text-cyan-400" />
            </div>
            <p className="text-[11px] font-black text-cyan-900 uppercase tracking-[0.4em] mb-4 relative z-10">{stat.label}</p>
            <p className={`text-6xl font-black italic tracking-tighter ${stat.color} relative z-10`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <div className="glass p-14 rounded-[5rem] border-cyan-400/10 space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-white flex items-center italic tracking-tight">
                  <Plus className="h-10 w-10 mr-4 text-cyan-400" /> Register Deployment
                </h2>
                <div className="px-6 py-3 glass rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest border-cyan-400/20">
                  <Globe className="inline h-4 w-4 mr-2 text-cyan-500 animate-spin-slow" /> Orbital Sync Active
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                <div className="space-y-8">
                   <div 
                    className={`relative aspect-square glass rounded-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group shadow-inner ${previewUrl ? 'border-cyan-400/50' : 'border-dashed border-cyan-400/20 hover:border-cyan-400/40'}`}
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} className="w-full h-full object-cover grayscale-[0.2] saturate-150" alt="Preview" />
                        <div className="absolute inset-0 bg-cyan-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                           <Camera className="h-14 w-14 text-white mb-6" />
                           <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Rescan Area</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-10 bg-cyan-400/5 rounded-[3.5rem] mb-8 border border-cyan-400/10">
                           <ImageIcon className="h-16 w-16 text-cyan-400" />
                        </div>
                        <p className="text-white text-xl font-black italic tracking-[0.1em]">Visual Evidence</p>
                        <p className="text-cyan-800 text-[10px] font-black mt-4 uppercase tracking-[0.4em]">GPS & Time Encoded</p>
                      </>
                    )}
                    <input id="fileInput" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="space-y-12 flex flex-col justify-between">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                       <div className="space-y-4">
                         <label className="text-[11px] font-black text-cyan-800 uppercase tracking-[0.5em] px-6">Species Array</label>
                         <select value={ecosystem} onChange={(e) => setEcosystem(e.target.value as any)} className="w-full glass border-cyan-400/10 rounded-3xl text-white text-sm p-6 focus:ring-1 focus:ring-cyan-500 uppercase font-black italic shadow-2xl">
                            <option value="MANGROVE" className="bg-[#001219]">Mangrove Forest</option>
                            <option value="SEAGRASS" className="bg-[#001219]">Seagrass Meadow</option>
                         </select>
                       </div>
                    </div>
                    
                    <div className="glass p-10 rounded-[3.5rem] border-cyan-400/10 space-y-8 bg-[#001219]/40">
                      <div className="flex justify-between items-center text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">
                        <span>Spatial Coordinate Lock</span>
                        <Navigation className="h-5 w-5 animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="bg-black/60 p-6 rounded-[2rem] border border-cyan-400/5">
                            <p className="text-[9px] font-black text-cyan-900 mb-2 uppercase tracking-widest">Lat</p>
                            <p className="text-base font-mono text-cyan-100 tracking-tighter font-black">{coords.lat.toFixed(6)}</p>
                         </div>
                         <div className="bg-black/60 p-6 rounded-[2rem] border border-cyan-400/5">
                            <p className="text-[9px] font-black text-cyan-900 mb-2 uppercase tracking-widest">Lng</p>
                            <p className="text-base font-mono text-cyan-100 tracking-tighter font-black">{coords.lng.toFixed(6)}</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={!previewUrl || isUploading}
                    onClick={handleUpload}
                    className={`w-full py-8 rounded-[3rem] font-black text-sm uppercase tracking-[0.5em] transition-all flex items-center justify-center italic ${(!previewUrl || isUploading) ? 'bg-cyan-900/10 text-cyan-900 border border-cyan-400/10' : 'bg-cyan-600 text-white shadow-[0_20px_60px_rgba(0,180,216,0.4)] hover:scale-[1.03] active:scale-95 border border-cyan-400/30'}`}
                  >
                    {isUploading ? <><Loader2 className="h-6 w-6 mr-5 animate-spin" /> Auditing Biomass...</> : 'Transmit Node Data'}
                  </button>
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-12">
           <h3 className="text-3xl font-black text-white flex items-center italic tracking-tight">
             <ShieldCheck className="h-8 w-8 mr-4 text-cyan-400" /> Deployment Log
           </h3>
           <div className="space-y-6 max-h-[100vh] overflow-y-auto pr-4 custom-scrollbar">
              {userSubmissions.map(sub => (
                <div key={sub.id} className="glass-card p-8 rounded-[4rem] flex gap-6 items-center border-cyan-400/10 group hover:bg-cyan-900/10">
                   <div className="w-24 h-24 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl border border-cyan-400/10">
                      <img src={sub.imageUrl} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="S" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-lg font-black text-white truncate uppercase tracking-tighter italic">{sub.ecosystemType}</p>
                        <span className={`text-[8px] px-3 py-1.5 rounded-full font-black uppercase tracking-[0.2em] shadow-lg ${
                          sub.status === SubmissionStatus.APPROVED ? 'bg-emerald-500/80 text-white' :
                          sub.status === SubmissionStatus.AI_VERIFIED ? 'bg-cyan-600 text-white' : 'bg-cyan-900/40 text-cyan-700'
                        }`}>{sub.status}</span>
                      </div>
                      <p className="text-[10px] font-black text-cyan-800 uppercase tracking-widest">{sub.location.region}</p>
                      <div className="mt-4 flex items-center gap-6">
                         <span className="flex items-center text-xs font-black text-cyan-400 italic">
                           <Leaf className="h-4 w-4 mr-2" /> {sub.estimatedCarbon}t
                         </span>
                         <span className="text-[10px] font-mono text-cyan-900 font-bold">
                           NODE: {sub.id?.slice(-6).toUpperCase()}
                         </span>
                      </div>
                   </div>
                </div>
              ))}
              {userSubmissions.length === 0 && (
                <div className="p-32 text-center glass border-dashed border-cyan-400/10 rounded-[5rem] opacity-20">
                   <p className="text-sm font-black uppercase tracking-[0.6em] text-cyan-400">Registry Empty</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
