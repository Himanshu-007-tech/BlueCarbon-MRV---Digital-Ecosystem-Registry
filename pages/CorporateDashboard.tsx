
import React, { useState } from 'react';
import { ShoppingCart, Globe, ShieldCheck, MapPin, Map as MapIcon, TrendingUp, Users, Waves, Heart } from 'lucide-react';
import { CarbonCredit, CreditStatus, User, Submission } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PaymentModal } from '../components/PaymentModal';
import { MapView } from '../components/MapView';

interface CorporateDashboardProps {
  user: User;
  credits: CarbonCredit[];
  submissions: Submission[];
  onPurchase: (creditId: string) => void;
}

export const CorporateDashboard: React.FC<CorporateDashboardProps> = ({ user, credits, submissions, onPurchase }) => {
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null);
  
  const availableCredits = credits.filter(c => c.status === CreditStatus.AVAILABLE);
  const myPurchases = credits.filter(c => c.ownerId === user.id);
  const totalOffset = myPurchases.reduce((acc, c) => acc + c.tons, 0);

  const portfolioData = [
    { name: 'Mangroves', value: myPurchases.filter(c => c.origin.includes('MANGROVE')).reduce((a,c)=>a+c.tons,0) || 1 },
    { name: 'Seagrass', value: myPurchases.filter(c => c.origin.includes('SEAGRASS')).reduce((a,c)=>a+c.tons,0) || 0 },
  ];
  const COLORS = ['#2dd4bf', '#3b82f6'];

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      {selectedCredit && <PaymentModal credit={selectedCredit} onClose={() => setSelectedCredit(null)} onConfirm={() => onPurchase(selectedCredit.id)} />}

      <header className="relative py-24 px-10 glass rounded-b-[5rem] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none -z-10">
           <Waves className="w-full h-full scale-150 rotate-12 text-blue-500" />
        </div>
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-teal-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-teal-400">Government Verified ESG Hub</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white italic">Impact Portfolio</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-10">
            <div className="glass p-8 rounded-[3rem] border-white/10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Offset Volume</p>
              <p className="text-5xl font-black text-white italic">{totalOffset} <span className="text-base font-normal text-slate-600 tracking-normal">tCO2e</span></p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-white/10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Impact Radius</p>
              <p className="text-5xl font-black text-white italic">{new Set(myPurchases.map(c=>c.region)).size}</p>
              <p className="text-[10px] text-blue-400 mt-2 font-black uppercase tracking-widest">Global Nodes</p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-white/10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Livelihoods</p>
              <p className="text-4xl font-black text-white italic">Verified</p>
              <p className="text-[10px] text-teal-400 mt-2 font-black uppercase tracking-widest flex items-center"><ShieldCheck className="h-3 w-3 mr-1.5" /> Fair Trade Node</p>
            </div>
            <div className="glass p-8 rounded-[3rem] border-white/10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Asset Grade</p>
              <p className="text-5xl font-black text-white italic tracking-tighter">NCCR-A</p>
              <p className="text-[10px] text-blue-500 mt-2 font-black uppercase tracking-widest">National Registry</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Marketplace */}
        <section className="space-y-10">
          <div className="flex justify-between items-end border-b border-white/5 pb-8">
             <h2 className="text-4xl font-black text-white flex items-center italic tracking-tight">
                <ShoppingCart className="h-10 w-10 mr-4 text-blue-500" /> Active Registry
             </h2>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{availableCredits.length} Verified Projects Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {availableCredits.map((credit) => (
              <div key={credit.id} className="glass-card rounded-[4rem] overflow-hidden group flex flex-col border-white/5">
                <div className="h-64 relative overflow-hidden">
                  <img src={`https://picsum.photos/seed/${credit.id}/800/600`} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="P" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02151c] to-transparent" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Digital MRV</span>
                    <span className="bg-teal-500 text-slate-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20">Certified</span>
                  </div>
                  <div className="absolute bottom-6 left-8">
                    <p className="text-white font-black text-3xl italic tracking-tighter">{credit.origin}</p>
                    <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                      <MapPin className="h-3 w-3 mr-2 text-teal-400" /> {credit.region}
                    </div>
                  </div>
                </div>
                <div className="p-10 space-y-10 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Available Volume</p>
                      <p className="text-5xl font-black text-white italic">{credit.tons} <span className="text-sm font-medium text-slate-600">tCO2e</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Unit Value</p>
                       <p className="text-2xl font-black text-teal-400 italic">$15</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedCredit(credit)}
                    className="w-full py-6 bg-white hover:bg-teal-400 text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    Initiate Reserve
                  </button>
                </div>
              </div>
            ))}
            {availableCredits.length === 0 && (
              <div className="col-span-full py-48 glass rounded-[5rem] border-dashed border-white/10 text-center space-y-6">
                 <ShieldCheck className="h-20 w-20 text-white/5 mx-auto" />
                 <div>
                   <p className="text-white/40 font-black text-2xl uppercase tracking-[0.4em]">Registry Empty</p>
                   <p className="text-slate-600 text-sm max-w-sm mx-auto mt-4">Waiting for national registry synchronization from field nodes.</p>
                 </div>
              </div>
            )}
          </div>
        </section>

        {/* Global Impact Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
           <div className="lg:col-span-1 glass p-12 rounded-[4rem] border-white/5">
              <h3 className="text-2xl font-black text-white italic mb-12 tracking-tight">Diversification</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                      {portfolioData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#02151c', border: 'none', borderRadius: '1.5rem', color: '#fff'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-10 mt-8">
                 {portfolioData.map((e,i)=>(
                   <div key={e.name} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i]}} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{e.name}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-2 glass p-12 rounded-[4rem] text-white border-white/5 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><TrendingUp className="h-32 w-32" /></div>
              <h3 className="text-3xl font-black mb-12 flex items-center italic tracking-tight"><Heart className="h-8 w-8 mr-4 text-teal-400 fill-teal-400" /> Social Return</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                 <div className="p-10 glass-card rounded-[3rem] border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-teal-400 font-black text-4xl italic mb-3">DirectPay</p>
                    <p className="text-slate-400 text-base leading-relaxed font-medium">Funds routed directly to restoration families, eliminating high network leakage.</p>
                 </div>
                 <div className="p-10 glass-card rounded-[3rem] border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-blue-500 font-black text-4xl italic mb-3">Biodiversity</p>
                    <p className="text-slate-400 text-base leading-relaxed font-medium">Protecting critical coral shelf health through natural blue carbon buffers.</p>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};
