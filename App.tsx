
import React, { useState, useEffect } from 'react';
import { User, UserRole, AppState, Submission, SubmissionStatus, CarbonCredit, CreditStatus, Language } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { FishermanDashboard } from './pages/FishermanDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CorporateDashboard } from './pages/CorporateDashboard';
import { Mail, Lock, Loader2, Waves } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'bluecarbon_mrv_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    submissions: [],
    credits: [],
    language: 'en',
    userCount: 12
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
      } catch (e) {
        console.error("Failed to load state", e);
      }
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput?.value || 'user@example.com';
    
    setTimeout(() => {
      const user: User = { id: 'u-' + Date.now(), email, name: email.split('@')[0], role: authRole };
      saveState({ currentUser: user });
      setView('dashboard');
      setAuthLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    saveState({ currentUser: null });
    setView('landing');
  };

  const handleNewSubmission = (sub: Partial<Submission>) => {
    const newSubmission: Submission = {
      ...sub,
      id: 's-' + Date.now(),
    } as Submission;
    saveState({ submissions: [newSubmission, ...state.submissions] });
  };

  const handleApprove = (id: string, comments: string) => {
    const targetSub = state.submissions.find(s => s.id === id);
    if (!targetSub) return;

    const creditId = 'c-' + Math.random().toString(36).substr(2, 9);
    const newCredit: CarbonCredit = {
      id: creditId,
      submissionId: targetSub.id,
      origin: `${targetSub.ecosystemType} Restoration`,
      region: targetSub.location.region,
      ownerId: '',
      ownerName: '',
      tons: targetSub.estimatedCarbon,
      status: CreditStatus.AVAILABLE,
      mintedAt: new Date().toISOString(),
      transactionHash: '0x' + Math.random().toString(16).substr(2, 40)
    };

    const updatedSubmissions = state.submissions.map(s => 
      s.id === id ? { ...s, status: SubmissionStatus.APPROVED, verifierComments: comments, creditId } : s
    );

    saveState({ 
      submissions: updatedSubmissions,
      credits: [newCredit, ...state.credits]
    });
  };

  const handleReject = (id: string, comments: string) => {
    const updatedSubmissions = state.submissions.map(s => 
      s.id === id ? { ...s, status: SubmissionStatus.REJECTED, verifierComments: comments } : s
    );
    saveState({ submissions: updatedSubmissions });
  };

  const handlePurchase = (creditId: string) => {
    if (!state.currentUser) return;
    const updatedCredits = state.credits.map(c => 
      c.id === creditId ? { 
        ...c, 
        status: CreditStatus.SOLD, 
        ownerId: state.currentUser!.id, 
        ownerName: state.currentUser!.name 
      } : c
    );
    saveState({ credits: updatedCredits });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const renderDashboard = () => {
    if (!state.currentUser) return null;
    switch (state.currentUser.role) {
      case UserRole.FISHERMAN:
        return <FishermanDashboard user={state.currentUser} submissions={state.submissions} onNewSubmission={handleNewSubmission} />;
      case UserRole.NGO:
        return <NGODashboard user={state.currentUser} submissions={state.submissions} onApprove={handleApprove} onReject={handleReject} />;
      case UserRole.ADMIN:
        return <AdminDashboard state={state} />;
      case UserRole.CORPORATE:
        return <CorporateDashboard user={state.currentUser} credits={state.credits} submissions={state.submissions} onPurchase={handlePurchase} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        user={state.currentUser} 
        language={state.language} 
        onLanguageChange={(lang) => saveState({ language: lang })} 
        onLogout={handleLogout}
        onNavigate={(v: any) => setView(v)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'landing' && <LandingPage onGetStarted={() => setView('login')} />}
        
        {view === 'login' && (
          <div className="max-w-md mx-auto mt-12">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 space-y-8">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
                  <Waves className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold">Welcome Back</h2>
                <p className="text-slate-500">Select your role to access the MRV network.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(UserRole).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setAuthRole(role)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${authRole === role ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input name="email" type="email" required placeholder="name@organization.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input type="password" required placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-slate-200"
                >
                  {authLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enter Network'}
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'dashboard' && renderDashboard()}
      </div>
    </div>
  );
};

export default App;
