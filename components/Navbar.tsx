
import React from 'react';
import { User, Language } from '../types';
import { LogOut, Waves, Globe, ShieldCheck, Cpu } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, language, onLanguageChange, onLogout, onNavigate }) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
      <div className="glass px-8 h-20 rounded-3xl flex justify-between items-center border-white/5 shadow-2xl">
        <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('landing')}>
          <div className="p-2 bg-teal-500 rounded-xl mr-3 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <Waves className="h-6 w-6 text-slate-900" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            BlueCarbon <span className="text-teal-400">MRV</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* System Status (Flavor) */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
             <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">System Online</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-white/5 rounded-xl px-3 border border-white/10">
            <Globe className="h-4 w-4 text-teal-400 mr-2" />
            <select 
              value={language} 
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-[10px] font-black text-white border-none focus:ring-0 py-2 uppercase tracking-widest"
            >
              <option value="en" className="bg-slate-900">EN</option>
              <option value="es" className="bg-slate-900">ES</option>
              <option value="hi" className="bg-slate-900">HI</option>
              <option value="id" className="bg-slate-900">ID</option>
            </select>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 glass rounded-xl border-teal-500/20">
                <Cpu className="h-4 w-4 text-teal-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{user.role}: {user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="bg-white hover:bg-teal-400 text-slate-900 px-8 py-3 rounded-2xl font-black transition-all shadow-xl text-xs uppercase tracking-widest"
            >
              Initialize Node
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
