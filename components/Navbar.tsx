
import React from 'react';
import { User, Language } from '../types';
import { LogOut, Waves, Globe, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, language, onLanguageChange, onLogout, onNavigate }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
            <Waves className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              BlueCarbon MRV
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-50 rounded-lg px-2 border border-slate-100">
              <Globe className="h-4 w-4 text-slate-400 mr-2" />
              <select 
                value={language} 
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-sm font-medium text-slate-600 border-none focus:ring-0 py-1"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="hi">HI</option>
                <option value="id">ID</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700 uppercase tracking-tighter">
                  <ShieldCheck className="h-3 w-3 text-emerald-500 mr-1" />
                  <span>{user.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
