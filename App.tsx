
import React, { useState, useEffect } from 'react';
import { User, UserRole, AppState, Submission, SubmissionStatus, CarbonCredit, CreditStatus, AuditLog } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { FishermanDashboard } from './pages/FishermanDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CorporateDashboard } from './pages/CorporateDashboard';
import { ChatBot } from './components/ChatBot';
import { Mail, Lock, Loader2, Waves, Globe, Shield, Zap, Sparkles, Navigation, Anchor, Users } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'bluecarbon_mrv_v2';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    submissions: [],
    credits: [],
    auditLogs: [],
    language: 'en',
    userCount: 42
  });
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.FISHERMAN);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
        if (parsed.currentUser) setView('dashboard');
      } catch (e) { console.error(e); }
    }
    setLoading(false);
  }, []);

  const saveState = (updates: Partial<AppState>) => {
    setState(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addAuditLog = (action: string, targetId: string, details: string) => {
    if (!state.currentUser) return;
    const log: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      role: state.currentUser.role,
      action,
      targetId,
      details
    };
    saveState({ auditLogs: [log, ...state.auditLogs] });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    setTimeout(() => {
      const user: User = { 
        id: 'u-' + Date.now(), 
        email, 
        name: email.split('@')[0], 
        role: authRole,
        organization: authRole === UserRole.NGO ? 'Blue Marine NGO' : authRole === UserRole.ADMIN ? 'NCCR Government' : 'Private Sector'
      };
      saveState({ currentUser: user });
      setView('dashboard');
      setAuthLoading(false);
    }, 1200);
  };

  // Logic Handlers
  const handleNGOApprove = (id: string, comments: string) => {
    const updated = state.submissions.map(s => s.id === id ? { ...s, status: SubmissionStatus.NGO_APPROVED, verifierComments: comments, ngoId: state.currentUser?.id, ngoName: state.currentUser?.name } : s);
    saveState({ submissions: updated });
    addAuditLog('NGO_APPROVE', id, `NGO verified site: ${comments}`);
  };

  const handleNGOReject = (id: string, comments: string) => {
    const updated = state.submissions.map(s => s.id === id ? { ...s, status: SubmissionStatus.REJECTED, verifierComments: comments } : s);
    saveState({ submissions: updated });
    addAuditLog('NGO_REJECT', id, `NGO rejected site: ${comments}`);
  };

  const handleNGOFlagField = (id: string, comments: string) => {
    const updated = state.submissions.map(s => s.id === id ? { ...s, status: SubmissionStatus.FIELD_CHECK_REQUIRED, verifierComments: comments } : s);
    saveState({ submissions: updated });
    addAuditLog('NGO_FLAG', id, `NGO flagged for field visit: ${comments}`);
  };

  const handleAdminIssue = (id: string, comments: string) => {
    const targetSub = state.submissions.find(s => s.id === id);
    if (!targetSub) return;
    const creditId = 'c-' + Math.random().toString(36).substr(2, 9);
    const newCredit: CarbonCredit = { id: creditId, submissionId: targetSub.id, origin: `${targetSub.ecosystemType} Restoration`, region: targetSub.location.region, ownerId: '', ownerName: '', tons: targetSub.estimatedCarbon, status: CreditStatus.AVAILABLE, mintedAt: new Date().toISOString(), transactionHash: '0x' + Math.random().toString(16).substr(2, 40), issuedBy: state.currentUser?.name };
    const updatedSubmissions = state.submissions.map(s => s.id === id ? { ...s, status: SubmissionStatus.APPROVED, adminComments: comments, creditId } : s);
    saveState({ submissions: updatedSubmissions, credits: [newCredit, ...state.credits] });
    addAuditLog('ADMIN_ISSUE_CREDIT', creditId, `Government issued ${targetSub.estimatedCarbon} tons for sub ${id}`);
  };

  const handleAdminReject = (id: string, comments: string) => {
    const updated = state.submissions.map(s => s.id === id ? { ...s, status: SubmissionStatus.REJECTED, adminComments: comments } : s);
    saveState({ submissions: updated });
    addAuditLog('ADMIN_REJECT', id, `Admin rejected issuance: ${comments}`);
  };

  const handlePurchase = (creditId: string) => {
    if (!state.currentUser) return;
    const updatedCredits = state.credits.map(c => c.id === creditId ? { ...c, status: CreditStatus.SOLD, ownerId: state.currentUser!.id, ownerName: state.currentUser!.name } : c);
    saveState({ credits: updatedCredits });
    addAuditLog('CORPORATE_PURCHASE', creditId, `Bought by ${state.currentUser.name}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#001219]"><Loader2 className="h-10 w-10 text-cyan-400 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-transparent font-sans text-white relative">
      <Navbar user={state.currentUser} language={state.language} onLanguageChange={(l) => saveState({ language: l })} onLogout={() => { saveState({ currentUser: null }); setView('landing'); }} onNavigate={(v: any) => setView(v)} />
      
      <main className="w-full">
        {view === 'landing' && <LandingPage onGetStarted={() => setView('login')} />}
        
        {view === 'login' && (
          <div className="relative min-h-screen w-full flex items-center justify-center p-8 overflow-hidden">
            {/* Immersive Water Overlay Background */}
            <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1544551763-47a0159c9638?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover brightness-[0.3] contrast-125 saturate-150" alt="Marine ecosystem" />
               <div className="absolute inset-0 bg-gradient-to-br from-[#003049]/60 via-[#001219]/90 to-[#005f73]/60" />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Left Content */}
              <div className="space-y-12 animate-fade-in text-left">
                <div className="space-y-6">
                  <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-white">
                    Registry for the <br />
                    <span className="text-cyan-400">Blue Economy</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-cyan-100 font-medium max-w-xl leading-relaxed opacity-70">
                    Transparent, AI-verified monitoring of coastal carbon sinks using orbital telemetry and decentralized verification nodes.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  {[
                    { icon: <Globe className="h-5 w-5" />, label: "Orbital Monitoring" },
                    { icon: <Users className="h-5 w-5" />, label: "Community Equity" },
                    { icon: <Shield className="h-5 w-5" />, label: "Institutional Grade" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-6 py-3 border border-cyan-400/20 bg-cyan-400/5 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-200/70 hover:bg-cyan-400/10 transition-all cursor-default">
                      {item.icon} {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Login Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  {/* Oceanic Glow Effect */}
                  <div className="absolute -inset-2 bg-cyan-400/20 rounded-[4rem] blur-3xl group-hover:bg-cyan-400/40 transition-all opacity-40"></div>
                  
                  <div className="relative glass p-12 md:p-16 rounded-[4rem] border-white/10 shadow-[0_0_100px_rgba(0,180,216,0.3)] w-full max-w-[550px] space-y-10">
                    <div className="flex justify-between items-start">
                       <div className="p-4 glass rounded-2xl border-cyan-400/20 bg-cyan-400/5">
                          <Zap className="h-8 w-8 text-cyan-400 fill-cyan-400/20" />
                       </div>
                       <div className="flex gap-2">
                          <div className="w-12 h-1 bg-cyan-500/40 rounded-full rotate-45 transform translate-y-4"></div>
                          <div className="w-12 h-1 bg-cyan-500/40 rounded-full rotate-45 transform"></div>
                       </div>
                    </div>

                    <div className="text-center space-y-2">
                      <h2 className="text-4xl font-black text-white italic tracking-tighter">Initialize Link</h2>
                      <p className="text-cyan-200 text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Authorized Personnel Only</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {Object.values(UserRole).map(role => (
                        <button 
                          key={role} 
                          onClick={() => setAuthRole(role)} 
                          className={`px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
                            authRole === role 
                            ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_30px_rgba(0,180,216,0.5)]' 
                            : 'bg-white/5 text-cyan-100 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {role.charAt(0) + role.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <input 
                          type="email" 
                          name="email" 
                          required 
                          placeholder="ACCESS_TOKEN@REGISTRY.GOV" 
                          className="w-full px-8 py-5 bg-[#001219] border border-cyan-400/20 text-cyan-100 rounded-full text-sm font-bold placeholder-cyan-900/60 focus:ring-2 focus:ring-cyan-500 transition-all outline-none" 
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={authLoading} 
                        className="w-full py-5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-full font-black transition-all flex items-center justify-center uppercase tracking-[0.5em] shadow-xl hover:scale-[1.02] active:scale-95 text-xs border border-cyan-400/30"
                      >
                        {authLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Synchronize Node'}
                      </button>
                    </form>

                    <div className="flex justify-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                       <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse delay-75"></span>
                       <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse delay-150"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right Atmosphere Sparkle */}
            <div className="absolute bottom-12 right-12 z-20">
              <Sparkles className="h-24 w-24 text-cyan-300/20 animate-pulse" />
            </div>
          </div>
        )}

        {view === 'dashboard' && state.currentUser && (
          <div className="w-full">
            {state.currentUser.role === UserRole.FISHERMAN && <FishermanDashboard user={state.currentUser} submissions={state.submissions} onNewSubmission={(s) => saveState({ submissions: [s as Submission, ...state.submissions] })} />}
            {state.currentUser.role === UserRole.NGO && <NGODashboard user={state.currentUser} submissions={state.submissions} onApprove={handleNGOApprove} onReject={handleNGOReject} onFlag={handleNGOFlagField} />}
            {state.currentUser.role === UserRole.ADMIN && <AdminDashboard state={state} onIssue={handleAdminIssue} onReject={handleAdminReject} />}
            {state.currentUser.role === UserRole.CORPORATE && <CorporateDashboard user={state.currentUser} credits={state.credits} submissions={state.submissions} onPurchase={handlePurchase} />}
          </div>
        )}
      </main>

      <ChatBot />
    </div>
  );
};

export default App;
