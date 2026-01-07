
import React, { useState } from 'react';
import { ShoppingCart, Leaf, Globe, TrendingUp, Users, Search, Filter, ShieldCheck, Heart, MapPin, Map as MapIcon } from 'lucide-react';
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
  const [regionFilter, setRegionFilter] = useState('ALL');
  
  const availableCredits = credits.filter(c => 
    c.status === CreditStatus.AVAILABLE && 
    (regionFilter === 'ALL' || c.region === regionFilter)
  );
  
  const myPurchases = credits.filter(c => c.ownerId === user.id);
  const totalOffset = myPurchases.reduce((acc, c) => acc + c.tons, 0);

  const regions = Array.from(new Set(credits.map(c => c.region || 'Global')));

  // Filter submissions for the map based on available credits and selected region
  const mapSubmissions = submissions.filter(s => 
    availableCredits.some(c => c.submissionId === s.id)
  );

  const data = [
    { name: 'Mangroves', value: 400 },
    { name: 'Seagrass', value: 300 },
    { name: 'Other', value: 100 },
  ];
  const COLORS = ['#059669', '#3b82f6', '#6366f1'];

  return (
    <div className="space-y-10 pb-20">
      {selectedCredit && (
        <PaymentModal 
          credit={selectedCredit} 
          onClose={() => setSelectedCredit(null)} 
          onConfirm={() => {
            onPurchase(selectedCredit.id);
          }}
        />
      )}

      <header className="bg-gradient-to-r from-slate-900 to-blue-900 -mx-4 sm:-mx-6 lg:-mx-8 px-8 py-12 text-white">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">ESG Impact Terminal</h1>
          <p className="text-blue-200 text-lg">Manage your blue carbon portfolio and offset targets.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <p className="text-blue-200 text-sm font-medium">Total CO₂ Offset</p>
              <p className="text-3xl font-bold">{totalOffset} Tons</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <p className="text-blue-200 text-sm font-medium">Projects Supported</p>
              <p className="text-3xl font-bold">{myPurchases.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <p className="text-blue-200 text-sm font-medium">Verified Status</p>
              <div className="flex items-center space-x-1 mt-1">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-emerald-400">AA+ Registry</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <p className="text-blue-200 text-sm font-medium">Portfolio Grade</p>
              <p className="text-3xl font-bold">Gold Standard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {/* Map Explorer */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <MapIcon className="h-6 w-6 mr-2 text-blue-600" /> Geographical Project Explorer
          </h2>
          <div className="h-[400px] w-full">
            <MapView submissions={mapSubmissions} />
          </div>
        </section>

        {/* Marketplace */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" /> Verified Market
            </h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select 
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white rounded-xl border-slate-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableCredits.map((credit) => (
              <div key={credit.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-48 relative overflow-hidden">
                  <img src={`https://picsum.photos/seed/${credit.id}/800/600`} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Proj" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                    Digital MRV Verified
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{credit.origin}</h3>
                    <div className="flex items-center text-slate-500 text-sm mt-1">
                      <MapPin className="h-3 w-3 mr-1" /> {credit.region}
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Volume</p>
                      <p className="text-2xl font-black text-slate-900">{credit.tons} <span className="text-sm font-normal text-slate-500">tCO₂e</span></p>
                    </div>
                    <button 
                      onClick={() => setSelectedCredit(credit)}
                      className="bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center"
                    >
                      Buy Credits
                    </button>
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400 font-mono">
                    <Globe className="h-3 w-3 mr-1" /> TX: {credit.transactionHash}
                  </div>
                </div>
              </div>
            ))}
            {availableCredits.length === 0 && (
              <div className="col-span-full py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400">
                No credits currently available for sale in this region.
              </div>
            )}
          </div>
        </section>

        {/* Impact Visuals */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Portfolio Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center space-y-8">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Climate Positive</h4>
                <p className="text-slate-500 text-sm">Your investments have sequestered carbon equivalent to planting thousands of terrestrial trees.</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Social Impact</h4>
                <p className="text-slate-500 text-sm">Providing direct livelihood support to coastal restoration families.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
