
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, CheckCircle, Zap, Activity } from 'lucide-react';

export const SatelliteMRV: React.FC = () => {
  const [scanPos, setScanPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group p-1 animate-fade-in">
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-2xl opacity-50"></div>
      
      <div className="relative glass border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-10 py-8 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            Satellite MRV Visualization
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</span>
            <div className="glass px-4 py-2 rounded-xl border-white/10 text-[10px] font-bold text-white flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-all">
              2023-10-26 <ChevronDown className="h-3 w-3 text-teal-400" />
            </div>
          </div>
        </div>

        {/* Satellite Feed Container */}
        <div className="p-10 relative">
          <div className="relative rounded-3xl overflow-hidden aspect-video border border-white/5 shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover grayscale-[0.2] brightness-75 scale-110"
              alt="Satellite Terrain"
            />
            
            {/* AI Bounding Boxes (Simulated) */}
            <div className="absolute top-1/4 left-1/3 w-12 h-12 border-2 border-emerald-400/60 bg-emerald-400/10 rounded-sm animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-emerald-400/60 bg-emerald-400/10 rounded-sm"></div>
            <div className="absolute top-1/3 right-1/4 w-10 h-10 border-2 border-emerald-400/40 bg-emerald-400/5 rounded-sm"></div>
            <div className="absolute bottom-1/4 left-1/4 w-14 h-14 border-2 border-emerald-400/60 bg-emerald-400/10 rounded-sm"></div>
            
            {/* Scanning Line */}
            <div 
              className="absolute left-0 right-0 h-1 bg-teal-400/40 shadow-[0_0_20px_rgba(45,212,191,0.6)] z-10"
              style={{ top: `${scanPos}%` }}
            >
              <div className="absolute -top-4 left-0 right-0 h-8 bg-gradient-to-b from-teal-400/0 via-teal-400/20 to-teal-400/0"></div>
            </div>

            {/* Overlays */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg border-teal-500/30">
              <Zap className="h-3 w-3 text-teal-400 fill-teal-400" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">AI-Verified Biomass</span>
            </div>
            
            <div className="absolute top-6 right-6">
               <span className="text-[9px] font-mono text-white/60 bg-black/40 px-2 py-1 rounded">Date: 2023-10-26</span>
            </div>

            {/* Random Data Points */}
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-teal-400 rounded-full animate-ping opacity-60"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}
              ></div>
            ))}
          </div>

          {/* Telemetry Stats Area */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-10 px-4">
             <div className="space-y-6">
                <div className="flex justify-between items-center group/item">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Area Verified:</span>
                   <span className="text-xl font-black text-white italic">4.2 sq km</span>
                </div>
                <div className="flex justify-between items-center group/item">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Carbon Sequestration Potential:</span>
                   <span className="text-xl font-black text-teal-400 italic">1,284 tons CO2/year</span>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Confidence Score:</span>
                   <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                         {[...Array(5)].map((_, i) => (
                           <div key={i} className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]' : 'bg-slate-700'}`}></div>
                         ))}
                      </div>
                      <span className="text-xl font-black text-white italic">98%</span>
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ecosystem Integrity:</span>
                   <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                         {[...Array(5)].map((_, i) => (
                           <div key={i} className={`w-2 h-2 rounded-full ${i < 5 ? 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]' : 'bg-slate-700'}`}></div>
                         ))}
                      </div>
                      <span className="text-xl font-black text-white italic">98%</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bubbles Label from Reference */}
      <div className="mt-12 text-center">
        <p className="text-lg font-bold text-white/30 uppercase tracking-[1em] select-none">Bubbles</p>
      </div>
    </div>
  );
};
