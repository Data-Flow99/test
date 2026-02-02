
import React, { useState } from 'react';
import { Globe, Zap, ArrowRight, Activity, ShieldAlert, Cpu, Layers, Anchor, Binary } from 'lucide-react';
import { analyzeGlobalResonance } from '../geminiService';
import { translations } from '../i18n';

const GlobalResonance: React.FC<{ lang: string }> = ({ lang }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resonance, setResonance] = useState<any>(null);
  const [anchored, setAnchored] = useState(false);
  const t = translations[lang] || translations.en;

  const handleResonate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const data = await analyzeGlobalResonance(input);
      setResonance(data);
      setAnchored(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnchor = () => {
    setAnchored(true);
    console.log("Prediction anchored for reflexive calibration");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <Globe className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Global <span className="text-indigo-400">Ripple Engine</span></h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cognitive Synchronization v1.0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] bg-slate-900/40 border-slate-800">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Global Event Input
            </h3>
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Trump 60% tariff policy implementation..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 outline-none focus:border-indigo-500/50 text-slate-200 transition-all"
              />
              <button 
                onClick={handleResonate}
                disabled={loading}
                className="absolute right-2 top-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {loading ? 'Processing logic...' : 'Analyze Ripples'}
              </button>
            </div>
          </div>

          {resonance && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
               <div className="glass p-8 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5 relative group">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Multi-Order Ripple Deduction
                    </h3>
                    {!anchored ? (
                      <button onClick={handleAnchor} className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-slate-800 group-hover:border-indigo-500/50">
                        <Anchor className="w-3 h-3" /> Anchor Prediction
                      </button>
                    ) : (
                      <span className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                        <Activity className="w-3 h-3 animate-pulse" /> Prediction Locked
                      </span>
                    )}
                 </div>
                 <div className="space-y-6">
                    {resonance.ripples.map((ripple: any, i: number) => (
                      <div key={i} className="flex gap-6 items-start group">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                            ripple.order === 1 ? 'border-indigo-500 text-indigo-400' : 
                            ripple.order === 2 ? 'border-purple-500 text-purple-400' : 'border-emerald-500 text-emerald-400'
                          }`}>
                            {ripple.order}
                          </div>
                          {i < resonance.ripples.length - 1 && <div className="w-px h-12 bg-slate-800 my-2" />}
                        </div>
                        <div className="flex-1 pb-4">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {ripple.order === 1 ? 'Direct Impact' : ripple.order === 2 ? 'Structural Shift' : 'Individual Resonance'}
                              </span>
                              <span className="text-[10px] font-bold text-slate-600">Prob: {Math.floor(ripple.probability * 100)}%</span>
                           </div>
                           <p className="text-slate-200 text-sm leading-relaxed">{ripple.impact}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="glass p-8 rounded-[2.5rem] border-slate-800 bg-slate-900/40">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Binary className="w-4 h-4" /> System Reasoning Path
                  </h3>
                  <div className="space-y-3">
                    {resonance.reasoningPath.map((node: string, i: number) => (
                      <div key={i} className="flex gap-4 items-start p-3 bg-slate-950/60 rounded-xl border border-slate-800/50 font-mono text-[10px]">
                         <span className="text-indigo-500 font-black">LOG_{i+1}:</span>
                         <span className="text-slate-400 italic">{node}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-[2.5rem] border-slate-800 bg-slate-900/20 flex flex-col items-center text-center">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">System Entropy Surge</h3>
              <div className="relative w-40 h-40 flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                 <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin duration-[3s]" style={{ opacity: resonance ? resonance.entropyScore / 100 : 0.1 }} />
                 <span className="text-4xl font-black text-white">{resonance ? resonance.entropyScore : '0'}%</span>
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] bg-indigo-950/20 border border-indigo-500/10">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Processing Transparency</h3>
              <p className="text-[9px] text-slate-500 leading-relaxed mb-6">
                "The 推演 logic is executed via Gemini 3 Pro (External), while the Sovereign Thresholds are enforced by your local Protocol Anchor."
              </p>
              <div className="space-y-2">
                 <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[70%]" />
                 </div>
                 <p className="text-[8px] font-black text-slate-600 text-right uppercase tracking-widest">Logic Decoupling: Active</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalResonance;
