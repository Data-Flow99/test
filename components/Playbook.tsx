
import React from 'react';
import { Shield, Ban, ArrowRight, Target } from 'lucide-react';
import { translations } from '../i18n';

const Playbook: React.FC<{ lang: string }> = ({ lang }) => {
  const t = translations[lang] || translations.en;

  return (
    <div className="max-w-4xl mx-auto py-12 px-8 glass rounded-[2rem] border-slate-700/50 shadow-2xl relative overflow-hidden bg-slate-900/40">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Shield className="w-64 h-64 text-gold-500" />
      </div>
      
      <div className="text-center mb-16 space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-4">
          Cognitive Anchor • Final Version
        </div>
        <h1 className="text-4xl font-extrabold text-white">{t.playbookTitle} <span className="text-[#d4af37]">{t.playbook}</span></h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto italic">"{t.playbookSub}"</p>
      </div>

      <div className="space-y-12">
        {/* Core Axes */}
        <section className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Target className="w-4 h-4" /> {t.coreAxes}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
              <h3 className="text-emerald-400 font-bold mb-2 text-sm">{t.chronicDegradation}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.chronicDesc}</p>
            </div>
            <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
              <h3 className="text-blue-400 font-bold mb-2 text-sm">{t.irreversibleInflection}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.inflectionDesc}</p>
            </div>
            <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
              <h3 className="text-purple-400 font-bold mb-2 text-sm">{t.judgmentSovereignty}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.sovereigntyDesc}</p>
            </div>
          </div>
        </section>

        {/* Hard Signals */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Ban className="w-4 h-4" /> {t.hardSignals}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.signals.map((sig: string, i: number) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-xs text-slate-400">
                <span className="text-red-500 font-bold">×</span> {sig}
              </div>
            ))}
          </div>
        </section>

        {/* Action Tiers */}
        <section className="p-8 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-center text-sm font-bold uppercase text-slate-400 mb-8">{t.actionClass}</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase">{t.observe}</p>
            </div>
            <ArrowRight className="hidden md:block w-4 h-4 text-slate-700" />
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              </div>
              <p className="text-[10px] font-bold text-yellow-500 uppercase">{t.reduce}</p>
            </div>
            <ArrowRight className="hidden md:block w-4 h-4 text-slate-700" />
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              </div>
              <p className="text-[10px] font-bold text-red-500 uppercase">{t.stop}</p>
            </div>
          </div>
        </section>

        {/* Self-Check */}
        <section className="text-center p-8 glass rounded-3xl border-slate-800 bg-blue-600/5">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">{t.selfCheckTitle}</p>
          <p className="text-lg text-slate-200 font-medium italic">
            "{t.selfCheckQuery}"
          </p>
          <div className="mt-6 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            {t.selfCheckFootnote}
          </div>
        </section>
      </div>
      
      <div className="mt-12 pt-8 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
        <span>Polaris OS Identity Verified</span>
        <span>Unchangeable Anchor</span>
      </div>
    </div>
  );
};

export default Playbook;
