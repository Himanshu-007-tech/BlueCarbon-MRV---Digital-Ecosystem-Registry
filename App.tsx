
import React, { useState, useEffect } from 'react';
import { User, UserRole, AppState, Submission, SubmissionStatus, CarbonCredit, CreditStatus, Language } from './types';
import { supabase } from './services/supabase';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { FishermanDashboard } from './pages/FishermanDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CorporateDashboard } from './pages/CorporateDashboard';
import { Mail, Lock, Loader2, Waves, Database, CloudOff } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'bluecarbon_mrv_local_data';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    submissions: [],
    credits: [],
    language: 'en',
    userCount: 0
  });
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.FISHERMAN);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);

  // Initialize and check connectivity
  useEffect(() => {
    const initApp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchUserData(session.user.id);
          setView('dashboard');
        } else {
          loadLocalData();
        }
      } catch (e) {
        console.warn("Supabase unreachable, enabling local mode.");
        setIsLocalMode(true);
        loadLocalData();
      }
      setLoading(false);
    };

    initApp();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserData(session.user.id);
        setView('dashboard');
      } else {
        setState(prev => ({ ...prev, currentUser: null }));
        if (!isLocalMode) setView('landing');
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [isLocalMode]);

  const loadLocalData = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setState(prev => ({
        ...prev,
        submissions: parsed.submissions || [],
        credits: parsed.credits || [],
        userCount: parsed.userCount || 1,
        currentUser: parsed.currentUser || prev.currentUser
      }));
      if (parsed.currentUser) setView('dashboard');
    }
  };

  const saveLocalData = (newState: Partial<AppState>) => {
    const currentLocal = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    const updated = { ...currentLocal, ...newState };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile && !error) {
        setState(prev => ({
          ...prev,
          currentUser: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole
          }
        }));
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setState(prev => ({
            ...prev,
            currentUser: {
              id: user.id,
              name: user.email?.split('@')[0] || 'User',
              email: user.email || '',
              role: (user.user_metadata?.role as UserRole) || UserRole.FISHERMAN
            }
          }));
        }
      }
    } catch (e) {
      setIsLocalMode(true);
    }
  };

  const fetchData = async () => {
    if (isLocalMode) return;

    try {
      const [subsRes, creditsRes, profilesRes] = await Promise.all([
        supabase.from('submissions').select('*').order('timestamp', { ascending: false }),
        supabase.from('carbon_credits').select('*').order('minted_at', { ascending: false }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
      ]);

      if (subsRes.error || creditsRes.error) {
        throw new Error("Database tables missing");
      }

      const submissions = (subsRes.data || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        userName: s.user_name,
        timestamp: s.timestamp,
        imageUrl: s.image_url,
        location: s.location,
        ecosystemType: s.ecosystem_type,
        status: s.status,
        aiScore: s.ai_score,
        aiAnalysis: s.ai_analysis,
        estimatedArea: s.estimated_area,
        estimatedCarbon: s.estimated_carbon,
        verifierComments: s.verifier_comments,
        creditId: s.credit_id
      }));

      const credits = (creditsRes.data || []).map(c => ({
        id: c.id,
        submissionId: c.submission_id,
        origin: c.origin,
        region: c.region,
        ownerId: c.owner_id,
        ownerName: c.owner_name,
        tons: c.tons,
        status: c.status,
        mintedAt: c.minted_at,
        transaction_hash: c.transaction_hash
      }));

      setState(prev => ({ 
        ...prev, 
        submissions, 
        credits, 
        userCount: profilesRes.count || 0 
      }));
    } catch (err) {
      console.warn("DB Fetch failed, falling back to local state.", err);
      setIsLocalMode(true);
      loadLocalData();
    }
  };

  useEffect(() => {
    if (state.currentUser) fetchData();
  }, [state.currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Fallback demo login
        if (error.message.includes("fetch") || isLocalMode) {
          const localUser: User = {
            id: 'local-' + Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email: email,
            role: authRole
          };
          setState(prev => ({ ...prev, currentUser: localUser }));
          saveLocalData({ currentUser: localUser });
          setView('dashboard');
          return;
        }

        if (error.message.includes("Invalid login credentials") || error.message.includes("Email not confirmed")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
            email, 
            password,
            options: { data: { name: email.split('@')[0], role: authRole } }
          });

          if (signUpError) throw signUpError;
          
          if (signUpData.user) {
            await supabase.from('profiles').upsert({
              id: signUpData.user.id,
              name: email.split('@')[0],
              email: email,
              role: authRole
            });
            alert("Account created. Welcome!");
          }
        } else {
          throw error;
        }
      }
    } catch (err: any) {
      // Last resort: Local demo bypass
      const localUser: User = {
        id: 'demo-' + Date.now(),
        name: email.split('@')[0] || 'Demo User',
        email: email,
        role: authRole
      };
      setState(prev => ({ ...prev, currentUser: localUser }));
      saveLocalMode(localUser);
    } finally {
      setAuthLoading(false);
    }
  };

  const saveLocalMode = (user: User) => {
    setIsLocalMode(true);
    setState(prev => ({ ...prev, currentUser: user }));
    saveLocalData({ currentUser: user });
    setView('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setState(prev => ({ ...prev, currentUser: null }));
    setView('landing');
    setIsLocalMode(false);
  };

  const handleNewSubmission = async (sub: Partial<Submission>) => {
    const subWithId = { ...sub, id: crypto.randomUUID() } as Submission;
    
    if (isLocalMode) {
      const newSubs = [subWithId, ...state.submissions];
      setState(prev => ({ ...prev, submissions: newSubs }));
      saveLocalData({ submissions: newSubs });
      return;
    }

    const dbSub = {
      user_id: sub.userId,
      user_name: sub.userName,
      image_url: sub.imageUrl,
      location: sub.location,
      ecosystem_type: sub.ecosystemType,
      status: sub.status,
      ai_score: sub.aiScore,
      ai_analysis: sub.aiAnalysis,
      estimated_area: sub.estimatedArea,
      estimated_carbon: sub.estimatedCarbon
    };
    
    const { error } = await supabase.from('submissions').insert(dbSub);
    if (error) {
      const newSubs = [subWithId, ...state.submissions];
      setState(prev => ({ ...prev, submissions: newSubs }));
      saveLocalData({ submissions: newSubs });
    } else {
      fetchData();
    }
  };

  const handleApprove = async (id: string, comments: string) => {
    const sub = state.submissions.find(s => s.id === id);
    if (!sub) return;
    const creditId = `CR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const transHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
    
    const newCredit: CarbonCredit = {
      id: creditId,
      submissionId: id,
      origin: `${sub.ecosystemType} Restoration - ${sub.userName}`,
      region: sub.location.region || 'Regional',
      ownerId: 'SYSTEM',
      ownerName: 'Registry Pool',
      tons: sub.estimatedCarbon,
      status: CreditStatus.AVAILABLE,
      mintedAt: new Date().toISOString(),
      transactionHash: transHash
    };

    if (isLocalMode) {
      const updatedSubs = state.submissions.map(s => s.id === id ? { ...s, status: SubmissionStatus.APPROVED, verifierComments: comments, creditId } : s);
      const updatedCredits = [newCredit, ...state.credits];
      setState(prev => ({ ...prev, submissions: updatedSubs, credits: updatedCredits }));
      saveLocalData({ submissions: updatedSubs, credits: updatedCredits });
      return;
    }

    const { error: subErr } = await supabase.from('submissions').update({ status: SubmissionStatus.APPROVED, verifier_comments: comments, credit_id: creditId }).eq('id', id);
    const { error: creditErr } = await supabase.from('carbon_credits').insert({
      id: creditId,
      submission_id: id,
      origin: newCredit.origin,
      region: newCredit.region,
      owner_id: 'SYSTEM',
      owner_name: 'Registry Pool',
      tons: sub.estimatedCarbon,
      status: CreditStatus.AVAILABLE,
      transaction_hash: transHash
    });
    
    if (subErr || creditErr) {
      const updatedSubs = state.submissions.map(s => s.id === id ? { ...s, status: SubmissionStatus.APPROVED, verifierComments: comments, creditId } : s);
      const updatedCredits = [newCredit, ...state.credits];
      setState(prev => ({ ...prev, submissions: updatedSubs, credits: updatedCredits }));
    } else {
      fetchData();
    }
  };

  const handleReject = async (id: string, comments: string) => {
    if (isLocalMode) {
      const updatedSubs = state.submissions.map(s => s.id === id ? { ...s, status: SubmissionStatus.REJECTED, verifierComments: comments } : s);
      setState(prev => ({ ...prev, submissions: updatedSubs }));
      saveLocalData({ submissions: updatedSubs });
      return;
    }
    await supabase.from('submissions').update({ status: SubmissionStatus.REJECTED, verifier_comments: comments }).eq('id', id);
    fetchData();
  };

  const handlePurchase = async (creditId: string) => {
    if (!state.currentUser) return;

    if (isLocalMode) {
      const updatedCredits = state.credits.map(c => c.id === creditId ? { ...c, status: CreditStatus.SOLD, ownerId: state.currentUser!.id, ownerName: state.currentUser!.name } : c);
      setState(prev => ({ ...prev, credits: updatedCredits }));
      saveLocalData({ credits: updatedCredits });
      return;
    }

    await supabase.from('carbon_credits').update({ status: CreditStatus.SOLD, owner_id: state.currentUser.id, owner_name: state.currentUser.name }).eq('id', creditId);
    fetchData();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const renderView = () => {
    if (view === 'landing') return <LandingPage onGetStarted={() => setView('login')} />;
    
    if (view === 'login') {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 bg-blue-50 rounded-2xl"><Waves className="h-10 w-10 text-blue-600" /></div>
              <h2 className="text-3xl font-bold text-slate-900">Welcome to MRV</h2>
              <p className="text-slate-500">Sign in to the restoration network</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input name="email" type="email" placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:ring-blue-500" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input name="password" type="password" placeholder="Password" required className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Role Selection</label>
                  <select value={authRole} onChange={(e) => setAuthRole(e.target.value as UserRole)} className="w-full py-3 rounded-xl border-slate-200">
                    <option value={UserRole.FISHERMAN}>Fisherman / Community Member</option>
                    <option value={UserRole.NGO}>NGO / Verifier</option>
                    <option value={UserRole.ADMIN}>Admin / Authority</option>
                    <option value={UserRole.CORPORATE}>Corporate Buyer</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={authLoading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg disabled:bg-slate-300">
                {authLoading ? 'Authenticating...' : 'Sign In / Demo Access'}
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (view === 'dashboard' && state.currentUser) {
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
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={state.currentUser} 
        language={state.language} 
        onLanguageChange={(lang) => setState(prev => ({ ...prev, language: lang }))} 
        onLogout={handleLogout}
        onNavigate={setView as any} 
      />
      <div className={view === 'landing' ? 'flex-1' : 'flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full'}>
        {renderView()}
      </div>
      
      <footer className="bg-white border-t border-slate-200 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          <div className="flex items-center space-x-2">
            <Waves className="h-3 w-3" />
            <span>BlueCarbon Digital MRV System</span>
          </div>
          <div className="flex items-center space-x-3">
            {isLocalMode ? (
              <span className="flex items-center text-amber-500"><CloudOff className="h-3 w-3 mr-1" /> Local Demo Mode</span>
            ) : (
              <span className="flex items-center text-emerald-500"><Database className="h-3 w-3 mr-1" /> Cloud Synchronized</span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
