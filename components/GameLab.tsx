
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Users, Zap, TrendingUp, ShieldAlert, Loader2 } from 'lucide-react';
import { analyzePowerDynamics } from '../geminiService';
import { translations } from '../i18n';

const GameLab: React.FC<{ lang: string }> = ({ lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  
  const t = translations[lang] || translations.en;

  const [nodes] = useState([
    { id: 'User', role: 'Strategic Node', group: 1 },
    { id: 'Team Leader', role: 'Gatekeeper', group: 2 },
    { id: 'Opponent A', role: 'Aggressor', group: 3 },
    { id: 'Executive', role: 'Arbiter', group: 4 },
  ]);

  const [links] = useState([
    { source: 'User', target: 'Team Leader', type: 'SUPPORT', value: 2 },
    { source: 'Team Leader', target: 'Opponent A', type: 'CONFLICT', value: 5 },
    { source: 'Opponent A', target: 'User', type: 'CONFLICT', value: 8 },
    { source: 'Executive', target: 'Team Leader', type: 'CONSTRAIN', value: 4 },
    { source: 'Executive', target: 'User', type: 'SUPPORT', value: 1 },
  ]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 400;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.type === 'CONFLICT' ? '#ef4444' : '#3b82f6')
      .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("circle")
      .attr("r", 12)
      .attr("fill", (d: any) => d.id === 'User' ? '#3b82f6' : '#1e293b')
      .attr("stroke", "#475569")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d: any) => d.id)
      .attr("x", 16)
      .attr("y", 4)
      .attr("fill", "#f8fafc")
      .style("font-size", "12px")
      .style("font-weight", "500");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [nodes, links]);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await analyzePowerDynamics(nodes, links);
      setAnalysis(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="w-8 h-8 text-amber-400" />
          <h2 className="text-3xl font-bold">{t.gamelab.split(' ')[0]} <span className="text-amber-400">{t.gamelab.split(' ')[1] || 'Lab'}</span></h2>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><TrendingUp className="w-4 h-4" /> <span>{t.analyzeDynamics}</span></>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 h-[500px] relative">
          <h3 className="text-lg font-semibold text-slate-300 mb-4">{t.forceField}</h3>
          <svg ref={svgRef} className="w-full h-full cursor-move" />
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-blue-500"></div> {t.supportive}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-red-500"></div> {t.conflict}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-400" /> {t.keyPlayers}
            </h3>
            <div className="space-y-3">
              {nodes.map(node => (
                <div key={node.id} className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                  <span className="font-medium text-slate-200">{node.id}</span>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{node.role}</span>
                </div>
              ))}
            </div>
          </div>

          {analysis && (
            <div className="glass p-6 rounded-2xl border-amber-500/20 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5" /> {t.strategicInsight}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.instabilityPoints}</p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {analysis.instabilityPoints.map((p: string, i: number) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.leveragePoints}</p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {analysis.leveragePoints.map((p: string, i: number) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg text-sm italic text-slate-300 border-l-2 border-amber-500">
                  {analysis.strategicAdvice}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLab;
