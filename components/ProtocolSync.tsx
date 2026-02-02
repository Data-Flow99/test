
import React, { useState, useEffect } from 'react';
import { Activity, Globe, Shield, Zap, CheckCircle2, Loader2, Cpu, Database } from 'lucide-react';
import { translations } from '../i18n';

const ProtocolSync: React.FC<{ lang: string }> = ({ lang }) => {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const t = translations[lang] || translations.en;

  const handleSync = () => {
    setSyncing(true);
    setComplete(false);
    setProgress(0);
  };

  useEffect(() => {
    if (syncing && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 100));
      }, 300);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setTimeout(() => {
        setSyncing(false);
        setComplete(true);
      }, 800);
    }
  }, [syncing, progress]);

  const patches = [
    { id: '7.4.1', title: 'Shadow Equity Detection', desc: 'Enhanced patterns for vesting cliff traps' },
    { id: '7.4.2', title: 'Power Node Mapping', desc: 'Optimized arbitrator loyalty calculation' },
    { id: '7.4.3', title: 'Exit Window Prediction', desc: 'New chronic degradation entropy models' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">
          <Globe className="w-3 h-3" /> Lattice Protocol v7.4.82
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter mb-4">{t.sync}</h2>
        <p className="text-slate-500 max-w-lg mx-auto italic">Align your cognitive OS with the global sovereign network best practices.</p>
      </div>

      {!syncing && !complete ? (
        <div className="glass p-12 rounded-[3rem] border-slate-800 bg-slate-900/40 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent group-hover:from-blue-600/10 transition-all duration-700" />
          <div className="relative z-10 space-y-8">
            <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.1)] group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-10 h-10 text-blue-400" />
            </div>
            <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your system currently has <span className="text-blue-400 font-bold">12 unverified decision paths</span>. 
              Initiate sync to download the latest strategic patches.
            </p>
            <button 
              onClick={handleSync}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30 active:scale-95"
            >
              {t.initiateSync}
            </button>
          </div>
        </div>
      ) : syncing ? (
        <div className="glass p-12 rounded-[3rem] border-slate-800 bg-slate-900/80 text-center relative overflow-hidden h-[400px] flex flex-col justify-center items-center">
          <div className="space-y-8 w-full max-w-md">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-800 rounded-full mx-auto" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-400" />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">{t.syncing}</p>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-tighter">
                DOWNLOAD_FRAGMENT_ID_{Math.floor(progress * 1421)}... OK
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in zoom-in duration-500 space-y-10">
          <div className="glass p-10 rounded-[3rem] border-emerald-500/20 bg-emerald-500/5 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white mb-2">{t.syncSuccess}</h3>
            <p className="text-slate-400 text-sm">Protocol Integrity restored to <span className="text-emerald-400 font-black">98.2%</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[2.5rem] border-slate-800">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> {t.patchNotes}
              </h4>
              <div className="space-y-4">
                {patches.map(patch => (
                  <div key={patch.id} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-blue-400">v{patch.id}</span>
                      <span className="text-[10px] text-slate-600 font-black uppercase">Active</span>
                    </div>
                    <p className="text-xs font-bold text-slate-200">{patch.title}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{patch.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border-slate-800 flex flex-col justify-center">
               <div className="text-center space-y-6">
                 <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.alignmentScore}</p>
                   <p className="text-6xl font-black text-white tracking-tighter">98<span className="text-emerald-500 text-3xl">/100</span></p>
                 </div>
                 <div className="pt-6 border-t border-slate-800/60">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{t.connectedNodes}</p>
                    <div className="flex justify-center -space-x-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=PolarisNode${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-[#020617] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                        +1K
                      </div>
                    </div>
                 </div>
                 <button onClick={() => setComplete(false)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
                   Re-validate System Cache
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolSync;
