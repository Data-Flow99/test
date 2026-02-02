
import React, { useState } from 'react';
import { Search, Filter, BookOpen, AlertCircle, Play, Tag } from 'lucide-react';
import { translations } from '../i18n';

const CaseLibrary: React.FC<{ lang: string }> = ({ lang }) => {
  const [search, setSearch] = useState('');
  const t = translations[lang] || translations.en;

  const filtered = t.cases.filter((c: any) => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          <h2 className="text-3xl font-bold">{t.caseLibraryTitle.split(' ')[0]} <span className="text-emerald-400">{t.caseLibraryTitle.split(' ')[1] || ''}</span></h2>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <Filter className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c: any) => (
          <div key={c.id} className="glass p-6 rounded-2xl border-t-2 border-emerald-500/20 hover:border-emerald-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded tracking-wider">
                {c.category}
              </span>
              <AlertCircle className="w-5 h-5 text-slate-600 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-emerald-300 transition-colors">{c.title}</h3>
            <p className="text-sm text-slate-400 mb-6 line-clamp-2">{c.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['Strategic', 'Political'].map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  <Tag className="w-2.5 h-2.5" /> {tag}
                </span>
              ))}
            </div>

            <button className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-800 hover:bg-emerald-600 rounded-lg text-sm font-semibold transition-all group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Play className="w-4 h-4" />
              <span>{t.simulateCase}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseLibrary;
