
import React, { useState } from 'react';
import { analyzeRisk } from '../geminiService';
import { Shield, AlertTriangle, CheckCircle, Loader2, ArrowRight, Zap } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { translations } from '../i18n';

const WindowGuard: React.FC<{ lang: string }> = ({ lang }) => {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const t = translations[lang] || translations.en;

  const handleScan = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeRisk(scenario);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const radarData = result ? [
    { subject: t.chronicDegradation.split(' ')[0], A: result.axes.chronicDegradation, full: 100 },
    { subject: t.irreversibleInflection.split(' ')[0], A: result.axes.irreversibleInflection, full: 100 },
    { subject: t.judgmentSovereignty.split(' ')[0], A: result.axes.judgmentSovereignty, full: 100 },
  ] : [];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'LOW': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 glass rounded-2xl bg-blue-600/10">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{t.scanner}</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">WindowGuard v2.0 • {t.status}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl border-slate-800 bg-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-focus-within:opacity-10 transition-opacity">
              <Zap className="w-24 h-24" />
            </div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.inputLabel}</label>
            <textarea
              className="w-full h-48 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700 text-lg leading-relaxed"
              placeholder={t.inputPlaceholder}
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            />
            <button
              onClick={handleScan}
              disabled={loading || !scenario}
              className="mt-6 flex items-center justify-center space-x-3 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Shield className="w-5 h-5" /> <span>{t.executeScan}</span></>}
            </button>
          </div>

          {result && (
            <div className="glass p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-emerald-400" /> {t.cognitiveVerdict}
                  </h3>
                  <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel} {t.riskLevel}
                  </div>
               </div>
               
               <p className="text-slate-300 text-lg leading-relaxed mb-10 bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50">{result.summary}</p>
               
               <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 text-amber-500" /> {t.operationalProtocol}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex gap-4 items-start group hover:border-blue-500/30 transition-colors">
                        <ArrowRight className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                        <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{rec}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl flex flex-col items-center bg-slate-900/40 min-h-[400px] justify-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8">{t.entropyChart}</h3>
            {result ? (
              <div className="w-full h-64 scale-110">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                    <Radar
                      name="Scan"
                      dataKey="A"
                      stroke="#d4af37"
                      fill="#d4af37"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center space-y-4 py-20 opacity-20">
                <Shield className="w-16 h-16 mx-auto" />
                <p className="text-xs font-bold uppercase tracking-widest">Awaiting Pulse</p>
              </div>
            )}
            {result && (
              <div className="mt-8 grid grid-cols-3 w-full gap-2">
                {radarData.map(d => (
                  <div key={d.subject} className="text-center p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-bold">{d.subject}</p>
                    <p className="text-sm font-bold text-slate-200">{d.A}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-3xl bg-red-500/5 border-red-500/10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-400">{t.exitTriggers}</h4>
            </div>
            <p className="text-xs text-slate-500 italic leading-relaxed">
              {t.exitTriggerDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowGuard;
