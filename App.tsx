
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  Map, 
  Library, 
  BookOpen, 
  LayoutDashboard,
  Menu,
  X,
  User as UserIcon,
  Settings,
  Bell,
  LogOut,
  Globe,
  Share2,
  Activity,
  RefreshCw,
  Waves,
  RefreshCcw,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Link,
  Key
} from 'lucide-react';
import WindowGuard from './components/WindowGuard';
import GameLab from './components/GameLab';
import Roadmap from './components/Roadmap';
import CaseLibrary from './components/CaseLibrary';
import Playbook from './components/Playbook';
import ProtocolSync from './components/ProtocolSync';
import GlobalResonance from './components/GlobalResonance';
import ReflexiveEngine from './components/ReflexiveEngine';
import GoogleAuth from './components/GoogleAuth';
import { testApiKeyConnectivity } from './geminiService';
import { User } from './types';
import { translations } from './i18n';

type Tab = 'dashboard' | 'scanner' | 'gamelab' | 'roadmap' | 'library' | 'playbook' | 'sync' | 'resonance' | 'reflexive';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState('cn');
  const [diagStatus, setDiagStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [diagMsg, setDiagMsg] = useState('');
  const [hasKey, setHasKey] = useState<boolean>(true);

  const t = translations[lang] || translations.en;

  const isPlaceholderKey = (key?: string) => {
    return !key || key === 'undefined' || key === 'PLACEHOLDER_API_KEY' || key.includes("YOUR_API_KEY") || key.length < 10;
  };

  useEffect(() => {
    const checkKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const selected = await aistudio.hasSelectedApiKey();
        const envKey = process.env.API_KEY || (process.env as any).GEMINI_API_KEY;
        setHasKey(selected || !isPlaceholderKey(envKey));
      } else {
        const envKey = process.env.API_KEY || (process.env as any).GEMINI_API_KEY;
        setHasKey(!isPlaceholderKey(envKey));
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      // 指南要求：假设选择成功并继续
      setHasKey(true);
      setDiagStatus('IDLE');
      setDiagMsg('密钥配置重置。请重新运行诊断。');
    } else {
      alert("当前环境不支持自动 Key 选择器。请在托管平台（如 Netlify）手动配置 API_KEY 环境变量。");
    }
  };

  const runDiagnostic = async () => {
    setDiagStatus('LOADING');
    const result = await testApiKeyConnectivity();
    if (result.success) {
      setDiagStatus('SUCCESS');
      setDiagMsg(result.message);
      setHasKey(true);
    } else {
      setDiagStatus('ERROR');
      setDiagMsg(result.message);
      
      // 如果触发了重置标志（404 或无效 KEY），自动弹出选择框
      if ((result as any).shouldResetKey) {
        setHasKey(false);
        // 延迟一秒方便用户看清错误信息
        setTimeout(handleConnectKey, 1000);
      }
    }
  };

  const navItems = [
    { id: 'dashboard' as Tab, label: t.dashboard, icon: LayoutDashboard },
    { id: 'scanner' as Tab, label: t.scanner, icon: Shield },
    { id: 'resonance' as Tab, label: t.resonance || "Ripple Engine", icon: Waves },
    { id: 'reflexive' as Tab, label: t.reflexive || "Reflexive Hub", icon: RefreshCcw },
    { id: 'gamelab' as Tab, label: t.gamelab, icon: Zap },
    { id: 'roadmap' as Tab, label: t.roadmap, icon: Map },
    { id: 'library' as Tab, label: t.library, icon: Library },
    { id: 'playbook' as Tab, label: t.playbook, icon: BookOpen },
    { id: 'sync' as Tab, label: t.sync, icon: RefreshCw },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
        </div>
        <GoogleAuth onLogin={setUser} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-100 selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass border-r border-slate-800/60 transition-transform duration-500 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#2563eb] to-[#4f46e5] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-400/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">Polaris <span className="text-blue-500">OS</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Cognitive OS</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    activeTab === item.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]' 
                    : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-blue-400' : 'text-slate-600'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-32 left-8 right-8 cursor-pointer group" onClick={() => setActiveTab('sync')}>
           <div className="p-4 glass rounded-2xl border-slate-800/60 bg-slate-900/30 group-hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">网络状态</span>
                <span className={`flex h-1.5 w-1.5 rounded-full ${hasKey ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{hasKey ? 'Cognitive Engine Connected' : 'Engine Offline: Key Required'}</p>
           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="p-4 glass rounded-[1.5rem] border-slate-800/60 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full border border-slate-700 overflow-hidden shrink-0">
               {user.picture ? <img src={user.picture} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-2 text-slate-500" />}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.role}</p>
             </div>
             <LogOut className="w-4 h-4 text-slate-600 hover:text-red-400 cursor-pointer transition-colors" onClick={() => setUser(null)} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 glass border-b border-slate-800/60 flex items-center justify-between px-10 shrink-0 relative z-20">
          <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          
          <div className="flex items-center space-x-6">
             <div className={`flex items-center px-4 py-1.5 ${hasKey ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-red-500/5 text-red-500 border-red-500/10'} border rounded-full text-[10px] font-black uppercase tracking-widest`}>
               <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-500' : 'bg-red-500'} mr-2 animate-pulse`} />
               {hasKey ? t.status : "引擎配置异常"}
             </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border-slate-700/50">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-[10px] font-black text-slate-400 uppercase outline-none cursor-pointer"
              >
                <option value="cn">中文</option>
                <option value="en">English</option>
                <option value="jp">日本語</option>
              </select>
            </div>
            
            {!hasKey && (
              <button 
                onClick={handleConnectKey}
                className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 animate-pulse"
              >
                <Key className="w-4 h-4" />
                <span>连接有效 API Key</span>
              </button>
            )}

            <button onClick={() => setActiveTab('resonance')} className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 active:scale-95">
              <Waves className="w-4 h-4" />
              <span>{t.resonance || "Ripple Engine"}</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-10 animate-in fade-in duration-700">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: t.riskIndices, value: '14', change: 'Live', icon: Shield, color: 'text-blue-400' },
                    { label: t.powerNodes, value: '42', change: 'Active', icon: Zap, color: 'text-[#d4af37]' },
                    { label: t.protocolIntegrity, value: hasKey ? '98%' : '0%', change: hasKey ? 'Nominal' : 'Config Error', icon: RefreshCw, color: hasKey ? 'text-emerald-400' : 'text-red-400' },
                    { label: t.evolutionProgress, value: '35%', change: '+1.2%', icon: Map, color: 'text-purple-400' },
                  ].map((stat, i) => (
                    <div key={i} className="glass p-8 rounded-[2rem] border-slate-800/60 hover:border-slate-700 transition-all group hover:bg-slate-800/30">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl bg-slate-900 group-hover:bg-slate-800 transition-all ${stat.color} border border-slate-800`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black tracking-widest px-3 py-1 bg-slate-950/80 rounded-full text-slate-500 border border-slate-800">{stat.change}</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                      <p className="text-4xl font-black mt-2 tracking-tighter text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {!hasKey && (
                  <div className="glass p-10 rounded-[2.5rem] border-red-500/20 bg-red-500/5 flex flex-col md:flex-row items-center justify-between gap-8 border-2 animate-in slide-in-from-top-4">
                    <div className="space-y-4 text-center md:text-left">
                       <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                         <AlertTriangle className="text-red-500 w-8 h-8" />
                         认知引擎 <span className="text-red-500">协议受阻</span>
                       </h2>
                       <p className="text-slate-400 max-w-lg font-medium">
                         当前项目未获得模型访问授权（错误 404）。请使用下方按钮通过 AI Studio 连接一个开启了计费（Billing Enabled）的 Google Cloud 项目。
                       </p>
                    </div>
                    <button 
                      onClick={handleConnectKey}
                      className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 flex items-center gap-3 active:scale-95"
                    >
                      <Key className="w-5 h-5" />
                      重新关联付费项目
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-10">
                     {/* System Diagnostic Widget */}
                     <div className={`glass p-10 rounded-[2.5rem] border-2 transition-all ${diagStatus === 'ERROR' ? 'border-red-500/30' : 'border-slate-800'} bg-slate-950/40 relative overflow-hidden group`}>
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-blue-400" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">系统诊断中心</h3>
                          </div>
                          {diagStatus === 'SUCCESS' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          {diagStatus === 'ERROR' && <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />}
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                           <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                             404 错误通常意味着模型对当前 API Key 不可用。Polaris 将尝试重新对齐协议。
                           </p>
                           
                           {diagStatus !== 'IDLE' && (
                             <div className={`p-4 rounded-xl border font-mono text-[10px] ${
                               diagStatus === 'SUCCESS' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 
                               diagStatus === 'ERROR' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-blue-500/5 border-blue-500/20 text-blue-400'
                             }`}>
                               <p className="font-black mb-1 uppercase tracking-widest">诊断报告:</p>
                               {diagMsg || "探测信号中..."}
                             </div>
                           )}

                           <div className="flex gap-4">
                             <button 
                               onClick={runDiagnostic}
                               disabled={diagStatus === 'LOADING'}
                               className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30 flex items-center gap-2"
                             >
                               {diagStatus === 'LOADING' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                               {diagStatus === 'LOADING' ? '分析中...' : '开始全局诊断'}
                             </button>
                             
                             <button 
                               onClick={handleConnectKey}
                               className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                             >
                               <Key className="w-4 h-4" />
                               强制重置 Key 缓存
                             </button>
                           </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                          <Terminal className="w-40 h-40" />
                        </div>
                     </div>

                     <div className="glass p-10 rounded-[2.5rem] relative overflow-hidden bg-gradient-to-br from-emerald-600/10 via-slate-900/40 to-transparent border-slate-800/60">
                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center gap-3">
                            <RefreshCcw className="w-5 h-5 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Reflexive Engine: Standing By</span>
                          </div>
                          <h2 className="text-4xl font-black tracking-tighter text-white">Self-Correcting Sovereignty</h2>
                          <p className="text-slate-400 max-w-lg text-lg leading-relaxed">你的操作系统会随着每次“现实核查”而进化。校准预测以优化战略协议。</p>
                          <div className="flex gap-4">
                            <button onClick={() => setActiveTab('reflexive')} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/30">进入校准中心</button>
                            <button onClick={() => setActiveTab('resonance')} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-sm font-black uppercase tracking-widest transition-all">执行涟漪扫描</button>
                          </div>
                        </div>
                        <RefreshCcw className="absolute -right-20 -bottom-20 w-80 h-80 text-emerald-500/5 rotate-12" />
                     </div>
                  </div>

                  <div className="space-y-10">
                    <div className="glass p-10 rounded-[2.5rem] border-slate-800 bg-slate-900/20">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">{t.hazardsTitle}</h3>
                      <div className="space-y-6">
                        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex items-start gap-4 hover:bg-red-500/10 transition-colors">
                          <Shield className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-black text-red-400 uppercase tracking-tight">{t.sovereigntyWarning}</p>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.hazardDesc1}</p>
                          </div>
                        </div>
                        <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4 hover:bg-amber-500/10 transition-colors">
                          <Zap className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-black text-amber-400 uppercase tracking-tight">{t.chronicWarning}</p>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.hazardDesc2}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass p-10 rounded-[2.5rem] bg-emerald-950/20 border border-emerald-500/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <RefreshCcw className="w-20 h-20 text-emerald-400" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6">认知自动校准</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-emerald-500/10 pb-2">
                           <span className="text-[10px] text-slate-500 font-bold uppercase">系统误差率</span>
                           <span className="text-xs font-black text-emerald-300">12.4% (-2%)</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-emerald-500/10 pb-2">
                           <span className="text-[10px] text-slate-500 font-bold uppercase">偏差修正</span>
                           <span className="text-xs font-black text-emerald-300">活跃 (Active)</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-600 mt-6 leading-relaxed italic">
                        每次现实核查都会提高 OS 权重。检测到高速学习速率。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scanner' && <WindowGuard lang={lang} />}
            {activeTab === 'resonance' && <GlobalResonance lang={lang} />}
            {activeTab === 'reflexive' && <ReflexiveEngine lang={lang} />}
            {activeTab === 'gamelab' && <GameLab lang={lang} />}
            {activeTab === 'roadmap' && <Roadmap lang={lang} />}
            {activeTab === 'library' && <CaseLibrary lang={lang} />}
            {activeTab === 'playbook' && <Playbook lang={lang} />}
            {activeTab === 'sync' && <ProtocolSync lang={lang} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
