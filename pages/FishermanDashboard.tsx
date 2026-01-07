
import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Plus, Image as ImageIcon, Map, Loader2, CheckCircle, Info, AlertCircle, Navigation, ShieldCheck } from 'lucide-react';
import { Submission, SubmissionStatus, User } from '../types';
import { analyzeBlueCarbonImage } from '../services/geminiService';
import { uploadRestorationImage } from '../services/supabase';

interface FishermanDashboardProps {
  user: User;
  submissions: Submission[];
  onNewSubmission: (sub: Partial<Submission>) => void;
}

export const FishermanDashboard: React.FC<FishermanDashboardProps> = ({ user, submissions, onNewSubmission }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ecosystem, setEcosystem] = useState<'MANGROVE' | 'SEAGRASS'>('MANGROVE');
  const [region, setRegion] = useState('Kerala Coastal');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 10.8505, lng: 76.2711 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Auto-location failed", err)
      );
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl || !selectedFile) return;
    setIsUploading(true);
    
    try {
      const finalImageUrl = await uploadRestorationImage(selectedFile, user.id);
      const analysis = await analyzeBlueCarbonImage(previewUrl, ecosystem);

      const newSub: Partial<Submission> = {
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        imageUrl: finalImageUrl,
        location: { 
          lat: coords.lat, 
          lng: coords.lng,
          region: region
        },
        ecosystemType: ecosystem,
        status: analysis.isVerified ? SubmissionStatus.AI_VERIFIED : SubmissionStatus.PENDING,
        aiScore: analysis.confidenceScore,
        aiAnalysis: analysis.healthAssessment,
        estimatedArea: 0.5,
        estimatedCarbon: Math.round(analysis.estimatedCarbonPotential * 0.5),
      };

      onNewSubmission(newSub);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      alert("Submission error: " + (err.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  const userSubmissions = submissions.filter(s => s.userId === user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Field Station</h1>
          <p className="text-slate-600">Restoration monitoring for {user.name}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Sites</p>
          <p className="text-3xl font-bold text-slate-900">{userSubmissions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact Volume</p>
          <p className="text-3xl font-bold text-emerald-600">
            {userSubmissions.filter(s => s.status === SubmissionStatus.APPROVED).reduce((acc, s) => acc + s.estimatedCarbon, 0)} tCO2
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incentives</p>
          <p className="text-3xl font-bold text-blue-600">
            ${userSubmissions.filter(s => s.status === SubmissionStatus.APPROVED).reduce((acc, s) => acc + s.estimatedCarbon, 0) * 15}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <Plus className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold">New Field Report</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Type</span>
                <select 
                  value={ecosystem}
                  onChange={(e) => setEcosystem(e.target.value as any)}
                  className="mt-1 block w-full rounded-xl border-slate-200 text-sm focus:ring-blue-500"
                >
                  <option value="MANGROVE">Mangrove</option>
                  <option value="SEAGRASS">Seagrass</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Region</span>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="mt-1 block w-full rounded-xl border-slate-200 text-sm focus:ring-blue-500"
                >
                  <option value="Kerala Coastal">Kerala</option>
                  <option value="Quintana Roo">Quintana Roo</option>
                  <option value="West Papua">West Papua</option>
                  <option value="Sundarbans">Sundarbans</option>
                </select>
              </label>
            </div>

            <div 
              className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all h-56 cursor-pointer ${previewUrl ? 'border-blue-500 bg-slate-900' : 'border-slate-300 hover:border-blue-400'}`}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img src={previewUrl} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[8px] font-mono text-white flex items-center">
                    <Navigation className="h-2 w-2 mr-1 text-blue-400" /> 
                    {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-blue-600/80 px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-widest">
                    Digital Geotag
                  </div>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-slate-400 mb-2" />
                  <p className="text-slate-600 text-sm font-medium">Upload Field Image</p>
                  <p className="text-slate-400 text-xs">Geo-coordinates will be attached</p>
                </>
              )}
              <input id="fileInput" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="p-5 bg-slate-50 rounded-xl space-y-4 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center tracking-widest">
                <Navigation className="h-3 w-3 mr-1 text-blue-500" /> GIS Metadata
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">LATITUDE</label>
                  <input type="number" step="0.000001" value={coords.lat} onChange={(e) => setCoords(prev => ({ ...prev, lat: parseFloat(e.target.value) }))} className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">LONGITUDE</label>
                  <input type="number" step="0.000001" value={coords.lng} onChange={(e) => setCoords(prev => ({ ...prev, lng: parseFloat(e.target.value) }))} className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex items-start space-x-2 text-[10px] text-slate-400 italic">
                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                <p>Coordinates are cryptographically hashed upon submission for immutability.</p>
              </div>
            </div>
            
            <button 
              disabled={!previewUrl || isUploading}
              onClick={handleUpload}
              className={`w-full py-4 mt-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center ${(!previewUrl || isUploading) ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
            >
              {isUploading ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Verifying with Gemini...</>
              ) : (
                'Start AI Verification'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Verified History</h2>
        <div className="grid grid-cols-1 gap-4">
          {userSubmissions.map((sub) => (
            <div key={sub.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 group">
                <img src={sub.imageUrl} className="w-full h-full object-cover transition-opacity group-hover:opacity-60" alt="Sub" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="text-[6px] text-white font-mono text-center leading-tight">
                     GIS DATA<br/>
                     {sub.location.lat.toFixed(4)}<br/>
                     {sub.location.lng.toFixed(4)}
                   </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{sub.ecosystemType} • {sub.location.region}</h4>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    sub.status === SubmissionStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                    sub.status === SubmissionStatus.AI_VERIFIED ? 'bg-blue-100 text-blue-700' :
                    sub.status === SubmissionStatus.REJECTED ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {sub.status}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                   <p className="text-[10px] text-slate-400">{new Date(sub.timestamp).toLocaleDateString()}</p>
                   <span className="text-[10px] bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                     LOC: {sub.location.lat.toFixed(3)}, {sub.location.lng.toFixed(3)}
                   </span>
                </div>
                <div className="mt-3 flex space-x-4 text-[10px] font-bold text-slate-600">
                  <span className="flex items-center"><ShieldCheck className="h-3 w-3 mr-1 text-blue-500" /> AI Confidence: {(sub.aiScore * 100).toFixed(0)}%</span>
                  <span className="flex items-center"><Navigation className="h-3 w-3 mr-1 text-emerald-500" /> Carbon: {sub.estimatedCarbon} tCO2</span>
                </div>
              </div>
            </div>
          ))}
          {userSubmissions.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
              No field reports detected in this sector.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
