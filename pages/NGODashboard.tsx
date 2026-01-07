
import React, { useState } from 'react';
import { Check, X, Shield, MapPin, ExternalLink, Info, Navigation } from 'lucide-react';
import { Submission, SubmissionStatus, User } from '../types';
import { MapView } from '../components/MapView';

interface NGODashboardProps {
  user: User;
  submissions: Submission[];
  onApprove: (id: string, comments: string) => void;
  onReject: (id: string, comments: string) => void;
}

export const NGODashboard: React.FC<NGODashboardProps> = ({ user, submissions, onApprove, onReject }) => {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [comments, setComments] = useState('');

  const pendingSubmissions = submissions.filter(s => s.status === SubmissionStatus.AI_VERIFIED);

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Verification Console</h1>
        <p className="text-slate-600">Review AI-verified restoration reports from the field.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submissions List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold flex items-center">
            Pending Review <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-sm">{pendingSubmissions.length}</span>
          </h2>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {pendingSubmissions.map((sub) => (
              <div 
                key={sub.id} 
                onClick={() => setSelectedSub(sub)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedSub?.id === sub.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
              >
                <div className="flex space-x-3">
                  <img src={sub.imageUrl} className="w-16 h-16 rounded-lg object-cover" alt="Sub" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{sub.ecosystemType}</h4>
                    <p className="text-xs text-slate-500">By {sub.userName}</p>
                    <div className="mt-1 flex items-center text-[9px] text-slate-400 font-mono">
                      <Navigation className="h-2 w-2 mr-1" /> {sub.location.lat.toFixed(3)}, {sub.location.lng.toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {pendingSubmissions.length === 0 && (
              <div className="text-center py-10 bg-slate-100 rounded-xl text-slate-500 text-sm">
                No pending verifications
              </div>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSub ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedSub.ecosystemType} Restoration</h2>
                  <p className="text-slate-500 text-sm">Submitted on {new Date(selectedSub.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => { onReject(selectedSub.id, comments); setSelectedSub(null); setComments(''); }}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={() => { onApprove(selectedSub.id, comments); setSelectedSub(null); setComments(''); }}
                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
                  >
                    <Check className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img src={selectedSub.imageUrl} className="w-full rounded-xl shadow-sm" alt="Focus" />
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h4 className="text-sm font-bold text-emerald-800 flex items-center">
                      <Shield className="h-4 w-4 mr-1" /> Gemini AI Analysis
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">{selectedSub.aiAnalysis}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Geospatial Tagging</h4>
                    <p className="text-xs font-mono font-bold text-slate-700">LAT: {selectedSub.location.lat}</p>
                    <p className="text-xs font-mono font-bold text-slate-700">LNG: {selectedSub.location.lng}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="h-48">
                    <MapView submissions={[selectedSub]} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-500 uppercase">Est. Carbon</p>
                      <p className="font-bold text-slate-800">{selectedSub.estimatedCarbon} Tons</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-500 uppercase">AI Confidence</p>
                      <p className="font-bold text-slate-800">{(selectedSub.aiScore * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <textarea 
                    placeholder="Add verification comments..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-500 focus:border-blue-500 h-24"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-slate-400">
              <Info className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a submission to review details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
