
import React from 'react';
import { Waves, Shield, Users, Leaf, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/mangroves/1920/1080" 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Mangroves"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Unlock the Power of <span className="text-emerald-400">Blue Carbon</span>
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Empowering coastal communities to restore mangroves and seagrass through AI-verified, 
              transparent, and community-driven carbon credits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-lg shadow-blue-900/40"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">10x</h3>
            <p className="text-slate-600 font-medium">Better carbon sequestration than tropical forests</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h3 className="text-4xl font-bold text-emerald-600 mb-2">1,500+</h3>
            <p className="text-slate-600 font-medium">Local fishermen empowered globally</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h3 className="text-4xl font-bold text-indigo-600 mb-2">$24B</h3>
            <p className="text-slate-600 font-medium">Potential global blue carbon market size</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Transparent MRV Lifecycle</h2>
            <p className="text-slate-600 text-lg">From restoration in the field to verified ESG impact in corporate boards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="text-blue-500" />, title: "Community Upload", desc: "Fishermen capture geo-tagged images of restoration sites." },
              { icon: <Shield className="text-emerald-500" />, title: "AI Verification", desc: "Gemini AI analyzes biomass and verifies ecosystem health." },
              { icon: <CheckCircle2 className="text-indigo-500" />, title: "NGO Approval", desc: "Trusted entities provide final human-in-the-loop validation." },
              { icon: <Waves className="text-teal-500" />, title: "Credit Minting", desc: "Carbon credits are minted on a transparent, immutable ledger." }
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
                {idx < 3 && <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-slate-300 z-10" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
