
import React from 'react';
import { Waves, Shield, Users, Leaf, ArrowRight, CheckCircle2, Globe, TrendingUp, Zap, Anchor, FileText, ExternalLink, Coins, BarChart3, Fish } from 'lucide-react';
import { SatelliteMRV } from '../components/SatelliteMRV';
import { ProcessPipeline } from '../components/ProcessPipeline';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full bg-[#001219]">
      {/* 🌊 HERO SECTION: RESTORING OCEANS */}
      <section className="relative h-screen flex flex-col justify-center px-8 md:px-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1546500840-ae38253aba9b?auto=format&fit=crop&q=90&w=1920" 
            className="w-full h-full object-cover brightness-[0.4] scale-105 saturate-150"
            alt="Deep sea coral reef"
          />
          <div className="absolute inset-0 bg-[#001219]/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#001219] via-[#001219]/30 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl space-y-10 animate-fade-in">
          <h1 className="text-6xl md:text-9xl font-black leading-[0.85] tracking-tighter text-white">
            Restoring <span className="text-cyan-400 italic">Oceans</span>,<br />
            Rewriting <span className="text-[#00b4d8]">Finance</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-cyan-50/80 font-medium max-w-2xl leading-relaxed drop-shadow-2xl">
            AI-verified blue carbon registry connecting coastal restoration with 
            institutional liquidity markets.
          </p>
          
          <div className="flex flex-wrap items-center gap-5 pt-8">
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 bg-[#0077b6] hover:bg-[#0096c7] text-white rounded-2xl font-black text-lg flex items-center transition-all shadow-[0_20px_60px_rgba(0,119,182,0.4)] hover:scale-105 active:scale-95 uppercase tracking-widest"
            >
              Access Portal <ArrowRight className="ml-3 h-6 w-6" />
            </button>
            <button className="px-10 py-5 border-2 border-cyan-400/30 hover:border-cyan-400 text-cyan-200 rounded-2xl font-black text-lg transition-all hover:bg-cyan-400/10 flex items-center gap-3 uppercase tracking-widest">
              Tech Specs <FileText className="h-5 w-5 opacity-60" />
            </button>
          </div>
        </div>
      </section>

      {/* 💰 ECO-ECONOMICS: BLUE CARBON VALUE */}
      <section className="py-48 px-8 md:px-24 w-full bg-[#001824]">
        <div className="max-w-[1600px] mx-auto space-y-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-cyan-400/10 rounded-xl border border-cyan-400/20">
                    <Coins className="h-6 w-6 text-cyan-400" />
                 </div>
                 <span className="text-[12px] font-black text-cyan-400 uppercase tracking-[0.4em]">Blue Economy Engine</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter italic">
                Blue Asset<br/>Economics
              </h2>
              <p className="text-2xl md:text-3xl text-cyan-100/60 font-medium leading-relaxed max-w-xl">
                Blue carbon sinks capture <span className="text-white font-black italic">10x more CO2</span> than rainforests. We turn this biological advantage into verified financial assets.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8">
                 <div className="glass p-10 rounded-[3rem] border-cyan-400/10 group hover:border-cyan-400/40 transition-all bg-cyan-400/5">
                    <p className="text-5xl font-black text-cyan-400 italic mb-2">$15</p>
                    <p className="text-[10px] font-black text-cyan-900/60 uppercase tracking-widest bg-cyan-100 px-3 py-1 rounded-full w-fit">Registry Spot Price</p>
                 </div>
                 <div className="glass p-10 rounded-[3rem] border-blue-400/10 group hover:border-blue-400/40 transition-all bg-blue-400/5">
                    <p className="text-5xl font-black text-[#00b4d8] italic mb-2">90%</p>
                    <p className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full w-fit">Community Equity</p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {/* Mangrove Card */}
              <div className="glass p-12 rounded-[4rem] border-white/5 relative overflow-hidden group hover:bg-cyan-900/20 transition-all duration-700">
                <div className="absolute -top-10 -right-10 p-12 opacity-5 scale-150 rotate-12"><Leaf className="h-64 w-64 text-emerald-400" /></div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                   <div>
                     <h3 className="text-4xl font-black text-white italic">Mangroves</h3>
                     <p className="text-cyan-400 font-black text-[10px] uppercase tracking-widest mt-2">Peak Sequestration</p>
                   </div>
                   <div className="text-right">
                     <p className="text-4xl font-black text-white">1,000+</p>
                     <p className="text-[9px] font-black text-cyan-700 uppercase tracking-widest">tCO2e / Hectare</p>
                   </div>
                </div>
                <p className="text-cyan-100/60 text-lg font-medium leading-relaxed relative z-10">
                  Dense coastal forests that stabilize sediments and store carbon for millennia in oxygen-depleted marine soils.
                </p>
              </div>

              {/* Seagrass Card */}
              <div className="glass p-12 rounded-[4rem] border-white/5 relative overflow-hidden group hover:bg-blue-900/20 transition-all duration-700">
                <div className="absolute -top-10 -right-10 p-12 opacity-5 scale-150 rotate-45"><Waves className="h-64 w-64 text-blue-400" /></div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                   <div>
                     <h3 className="text-4xl font-black text-white italic">Seagrass</h3>
                     <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest mt-2">Oceanic Meadows</p>
                   </div>
                   <div className="text-right">
                     <p className="text-4xl font-black text-white">500+</p>
                     <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest">tCO2e / Hectare</p>
                   </div>
                </div>
                <p className="text-cyan-100/60 text-lg font-medium leading-relaxed relative z-10">
                  Vast underwater grasslands that act as carbon traps, responsible for significant vertical carbon burial.
                </p>
              </div>
            </div>
          </div>

          {/* Impact Distribution Bar */}
          <div className="glass p-16 rounded-[5rem] border-cyan-400/10 space-y-16 bg-[#001219]/40 shadow-[0_0_80px_rgba(0,180,216,0.1)]">
            <div className="text-center space-y-4">
               <h4 className="text-5xl font-black text-white italic tracking-tighter">On-Chain Value Distribution</h4>
               <p className="text-cyan-700 font-black uppercase text-[11px] tracking-[0.5em]">Real-Time Liquidity Auditing</p>
            </div>
            <div className="h-32 w-full bg-black/40 rounded-[3rem] overflow-hidden flex shadow-2xl border border-white/5 p-2">
               <div className="h-full bg-gradient-to-r from-[#0077b6] to-[#00b4d8] flex items-center justify-center group relative cursor-help rounded-2xl transition-all hover:brightness-110" style={{ width: '90%' }}>
                  <span className="text-white font-black text-2xl italic drop-shadow-lg">90% Payouts</span>
                  <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all glass px-6 py-3 rounded-2xl text-[10px] font-black text-cyan-200 border-cyan-400/30">Coastal Community Yield</div>
               </div>
               <div className="h-full bg-cyan-400/5 flex items-center justify-center group relative cursor-help rounded-2xl ml-2" style={{ width: '10%' }}>
                  <span className="text-cyan-400 font-black text-sm italic">10% Fee</span>
                  <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all glass px-6 py-3 rounded-2xl text-[10px] font-black text-white border-white/10">MRV Network Operations</div>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { icon: <Users className="text-cyan-400" />, val: "4,200+", lab: "Protected Families", color: "bg-cyan-400/10" },
                 { icon: <BarChart3 className="text-blue-400" />, val: "$2.4M", lab: "Capital Flow", color: "bg-blue-400/10" },
                 { icon: <Fish className="text-teal-400" />, val: "12k Ha", lab: "Biodiversity Nodes", color: "bg-teal-400/10" }
               ].map((stat, i) => (
                 <div key={i} className="flex items-center gap-6 p-10 glass-card rounded-[3rem] border-white/5">
                    <div className={`p-5 ${stat.color} rounded-2xl`}>{stat.icon}</div>
                    <div>
                      <p className="text-3xl font-black text-white tracking-tighter">{stat.val}</p>
                      <p className="text-[10px] font-black text-cyan-800 uppercase tracking-widest mt-1">{stat.lab}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📡 SATELLITE VISUALIZATION BLOCK */}
      <section className="py-48 px-8 md:px-24 w-full max-w-[1600px] mx-auto space-y-24">
        <div className="text-center space-y-8">
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic">
            Orbital Verification
          </h2>
          <p className="text-cyan-100/60 max-w-2xl mx-auto text-2xl font-medium leading-relaxed">
            Proprietary hyperspectral imaging models auditing carbon biomass across entire coastal shelves in 12-hour cycles.
          </p>
        </div>
        
        <SatelliteMRV />
      </section>

      {/* 🔄 THE PIPELINE: VISUAL WORKFLOW (BASED ON REFERENCE) */}
      <ProcessPipeline />

      {/* 🛠️ TECHNICAL INFRASTRUCTURE */}
      <section className="w-full max-w-[1600px] mx-auto px-8 py-48 space-y-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-16">
              <h3 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter italic">
                Resilience <br/>Infrastructure
              </h3>
              <div className="space-y-10">
                 {[
                   { title: "Direct Liquidity", desc: "Capital injection directly into community-led restoration nodes." },
                   { title: "Quantum-Proof MRV", desc: "Decentralized ledger ensuring zero-leakage and double-counting protection." },
                   { title: "Biomass Diagnostics", desc: "AI health checks monitoring vegetation stress and mortality rates." }
                 ].map((item, idx) => (
                   <div key={idx} className="flex gap-8 group">
                      <div className="w-16 h-16 shrink-0 glass rounded-3xl flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-400/10 transition-all border-cyan-400/20">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white mb-3 italic tracking-tight">{item.title}</h4>
                        <p className="text-cyan-100/50 text-lg leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="relative group">
              <div className="absolute -inset-10 bg-cyan-600/10 blur-[150px] rounded-full group-hover:bg-cyan-600/20 transition-all duration-1000"></div>
              <div className="relative glass p-3 rounded-[5rem] overflow-hidden border-cyan-400/10 shadow-[0_0_100px_rgba(0,180,216,0.3)]">
                <img 
                  src="https://images.unsplash.com/photo-1544551763-47a0159c9638?auto=format&fit=crop&q=80&w=1200" 
                  className="rounded-[4.8rem] w-full aspect-[4/5] object-cover mix-blend-screen brightness-125 saturate-150 transition-transform duration-1000 group-hover:scale-105"
                  alt="Marine technician"
                />
                <div className="absolute bottom-16 left-16 right-16 glass p-8 rounded-[3rem] border-cyan-400/20 flex items-center gap-5 shadow-2xl">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
                  <span className="text-xs font-black text-white uppercase tracking-[0.4em]">Node Live: Kerala Coastal shelf</span>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="glass py-48 px-8 border-t border-cyan-400/10 bg-[#001219]/60">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
          <div className="space-y-10">
             <div className="flex items-center gap-5">
                <div className="p-4 bg-cyan-600 rounded-2xl shadow-[0_0_40px_rgba(0,180,216,0.4)]">
                  <Waves className="h-10 w-10 text-white" />
                </div>
                <span className="text-4xl font-black text-white tracking-tighter italic">BlueCarbon <span className="text-cyan-400">MRV</span></span>
             </div>
             <p className="text-cyan-100/40 max-w-sm font-bold text-xl leading-relaxed italic">
               The digital standard for oceanic resilience. Built for the 1.5°C future.
             </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
             <div className="space-y-8">
                <h5 className="text-[12px] font-black uppercase tracking-[0.5em] text-cyan-400">Registry</h5>
                <ul className="space-y-5 text-sm font-black text-cyan-900/40">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">Global Map</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">Blue Protocol</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">Asset Logs</a></li>
                </ul>
             </div>
             <div className="space-y-8">
                <h5 className="text-[12px] font-black uppercase tracking-[0.5em] text-cyan-400">Network</h5>
                <ul className="space-y-5 text-sm font-black text-cyan-900/40">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">Observer Nodes</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">Auditor Hub</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">API Gateway</a></li>
                </ul>
             </div>
             <div className="space-y-8 col-span-2 md:col-span-1">
                <h5 className="text-[12px] font-black uppercase tracking-[0.5em] text-cyan-400">Network Status</h5>
                <div className="flex items-center gap-4 glass px-6 py-4 rounded-3xl border-cyan-400/20">
                   <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
                   <span className="text-[11px] font-black text-white uppercase tracking-widest">Global Ops Synchronized</span>
                </div>
             </div>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto mt-48 pt-16 border-t border-cyan-400/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black text-cyan-900 uppercase tracking-[0.5em]">
           <p>© 2025 Ocean Trust Network — Verified Protocol</p>
           <div className="flex gap-16">
              <Shield className="h-6 w-6 hover:text-cyan-400 transition-colors" />
              <Globe className="h-6 w-6 hover:text-cyan-400 transition-colors" />
              <Anchor className="h-6 w-6 hover:text-cyan-400 transition-colors" />
           </div>
        </div>
      </footer>
    </div>
  );
};
