
import React from 'react';
import { Milestone } from '../types';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';
import { translations } from '../i18n';

const Roadmap: React.FC<{ lang: string }> = ({ lang }) => {
  const t = translations[lang] || translations.en;

  const dynamicMilestones: Milestone[] = [
    { id: '1', title: t.milestone1, date: '2024-12', status: 'COMPLETED', category: 'STRATEGY' },
    { id: '2', title: t.milestone2, date: '2025-03', status: 'IN_PROGRESS', category: 'AI' },
    { id: '3', title: t.milestone3, date: '2025-08', status: 'PLANNED', category: 'STRATEGY' },
    { id: '4', title: t.milestone4, date: '2025-12', status: 'PLANNED', category: 'EXECUTION' },
    { id: '5', title: t.milestone5, date: '2026-06', status: 'PLANNED', category: 'AI' },
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return t.completed;
      case 'IN_PROGRESS': return t.inProgress;
      default: return t.planned;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800" />

        <div className="space-y-8">
          {dynamicMilestones.map((m) => (
            <div key={m.id} className="relative flex items-start group">
              {/* Dot */}
              <div className={`absolute left-8 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-slate-950 z-10 transition-transform group-hover:scale-125 ${
                m.status === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                m.status === 'IN_PROGRESS' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-700'
              }`} />

              <div className="ml-16 w-full">
                <div className="glass p-4 rounded-xl border-l-2 transition-all hover:bg-slate-800/40 group-hover:-translate-x-1 cursor-default" 
                     style={{ borderLeftColor: m.status === 'COMPLETED' ? '#10b981' : m.status === 'IN_PROGRESS' ? '#3b82f6' : '#334155' }}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" /> {m.date}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      m.category === 'AI' ? 'bg-purple-500/10 text-purple-400' :
                      m.category === 'STRATEGY' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {m.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mb-1">{m.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      {m.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> :
                       m.status === 'IN_PROGRESS' ? <Clock className="w-3 h-3 text-blue-500 animate-pulse" /> :
                       <Circle className="w-3 h-3 text-slate-600" />}
                      {getStatusLabel(m.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-12 glass p-6 rounded-2xl bg-gradient-to-br from-slate-800/30 to-indigo-900/10 border-indigo-500/10">
        <h3 className="text-lg font-bold mb-3 text-indigo-300">{t.targetAutonomy}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {t.targetDesc}
        </p>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-[35%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        </div>
        <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
          <span>{t.foundation} (35%)</span>
          <span>{t.sovereigntyAttained}</span>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
