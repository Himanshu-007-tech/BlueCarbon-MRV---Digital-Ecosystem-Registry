
import React from 'react';
import { Upload, Cpu, Users, Landmark, Coins, FileSearch, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="h-8 w-8 text-cyan-400" />,
    title: "Field Deployment",
    desc: "Coastal nodes capture high-fidelity restoration evidence with GIS telemetry."
  },
  {
    icon: <Cpu className="h-8 w-8 text-[#00b4d8]" />,
    title: "AI Biomass Audit",
    desc: "Gemini 3 Flash analyzes vegetation density and multispectral site health."
  },
  {
    icon: <Users className="h-8 w-8 text-[#48cae4]" />,
    title: "Peer Validation",
    desc: "Decentralized NGO verifiers cross-verify field audits and satellite logs."
  },
  {
    icon: <Landmark className="h-8 w-8 text-[#0077b6]" />,
    title: "Registry Approval",
    desc: "National regulators finalize the asset for the institutional registry."
  },
  {
    icon: <Coins className="h-8 w-8 text-[#90e0ef]" />,
    title: "Asset Minting",
    desc: "Immutable tCO2e tokens issued directly to community-owned wallets."
  },
  {
    icon: <FileSearch className="h-8 w-8 text-cyan-100" />,
    title: "ESG Transparency",
    desc: "Complete provenance for institutional buyers with full audit history."
  }
];

export const ProcessPipeline: React.FC = () => {
  return (
    <section className="relative py-48 px-8 md:px-24 w-full overflow-hidden">
      {/* Immersive Deep Sea Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544551763-47a0159c9638?auto=format&fit=crop&q=80&w=1920" 
          className="w-full h-full object-cover opacity-30 brightness-50 grayscale saturate-200" 
          alt="Underwater workflow background" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001219] via-[#001219]/40 to-[#001219]"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-24">
        <div className="text-center space-y-8">
          <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter italic">
            Registry Pipeline
          </h2>
          <p className="text-cyan-100/50 max-w-2xl mx-auto text-2xl font-medium leading-relaxed">
            The friction-free protocol for the global ocean carbon economy.
          </p>
        </div>

        <div className="relative">
          {/* Immersive Connecting Wave Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 -translate-y-1/2 hidden xl:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="group relative">
                <div className="glass p-12 rounded-[4rem] border-cyan-400/10 hover:border-cyan-400/40 transition-all duration-700 h-full flex flex-col items-center text-center space-y-10 hover:-translate-y-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)] bg-cyan-400/5 backdrop-blur-3xl">
                  <div className="p-8 glass rounded-3xl group-hover:scale-125 transition-transform duration-700 border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_40px_rgba(0,180,216,0.3)] relative">
                    {step.icon}
                    <div className="absolute -inset-4 bg-cyan-400/5 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  <div className="space-y-5">
                    <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight italic">
                      {step.title}
                    </h3>
                    <p className="text-sm text-cyan-100/40 font-bold leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Step ID Badge */}
                  <div className="absolute -top-6 -right-6 w-14 h-14 glass rounded-[1.5rem] flex items-center justify-center border-cyan-400/30 text-[12px] font-black text-cyan-400 shadow-xl italic">
                    0{idx + 1}
                  </div>
                </div>

                {/* Arrow Connectors */}
                {idx < steps.length - 1 && (
                  <div className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 text-cyan-400/20">
                    <ArrowRight className="h-10 w-10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
