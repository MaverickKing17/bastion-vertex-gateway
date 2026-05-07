/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Lock, 
  Users, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Zap, 
  Search, 
  Bell, 
  ChevronRight, 
  ExternalLink, 
  Power,
  BarChart3,
  Globe,
  Database,
  Cpu,
  Fingerprint,
  LayoutDashboard,
  ShieldAlert,
  Archive,
  Menu,
  Clock,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Share2,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Mock Data
const RISK_SCORE_DATA = [
  { time: 'May 12', score: 62 },
  { time: 'May 13', score: 68 },
  { time: 'May 14', score: 75 },
  { time: 'May 15', score: 71 },
  { time: 'May 16', score: 65 },
  { time: 'May 17', score: 69 },
  { time: 'May 18', score: 72 },
];

const DOMAIN_RISK_DATA = [
  { name: 'Identity', value: 72, color: '#2EC4B6' },
  { name: 'AI Security', value: 78, color: '#00F5D4' },
  { name: 'Cloud Security', value: 65, color: '#3A86FF' },
  { name: 'Threat Detection', value: 81, color: '#FF9F1C' },
  { name: 'Compliance', value: 60, color: '#FFBE0B' },
];

const RECENT_ALERTS = [
  { id: 1, title: 'Impossible Travel Detected', user: 'j.doe@acme.com', time: '2m ago', severity: 'Critical', icon: Globe },
  { id: 2, title: 'Malicious API Activity', user: 'AWS GuardDuty Finding', time: '7m ago', severity: 'Critical', icon: Zap },
  { id: 3, title: 'PII Detected in Prompt', user: 'Amazon Bedrock Guardrail', time: '15m ago', severity: 'High', icon: Fingerprint },
  { id: 4, title: 'Privilege Escalation Attempt', user: 'svc-payments@acme.com', time: '28m ago', severity: 'High', icon: ShieldAlert },
];

const RISKY_IDENTITIES = [
  { id: 1, name: 'j.doe@acme.com', score: 92, risk: 'High' },
  { id: 2, name: 'svc-payments@acme.com', score: 88, risk: 'High' },
  { id: 3, name: 'm.lee@acme.com', score: 67, risk: 'Medium' },
];

const STATS = [
  { title: 'Overall Risk Score', value: '72', sub: '/100', trend: 8, status: 'High Risk', icon: Shield, trendColor: 'text-red-400' },
  { title: 'Active Threats', value: '23', sub: '', trend: 5, status: 'Critical / High', icon: Zap, trendColor: 'text-red-400' },
  { title: 'AI Guardrail Blocks', value: '1,248', sub: '', trend: 18, status: 'Total', icon: Lock, trendColor: 'text-teal-400' },
  { title: 'Identities Monitored', value: '3,842', sub: '', trend: 6, status: 'Total', icon: Users, trendColor: 'text-teal-400' },
  { title: 'Incidents', value: '7', sub: '', trend: -2, status: 'Open', icon: FileText, trendColor: 'text-teal-400' },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true, id: 'overview' },
  { icon: Search, label: 'Investigations', id: 'investigation' },
  { icon: ShieldAlert, label: 'Risk Inventory', id: 'inventory' },
  { icon: Cpu, label: 'Model Guardrails' },
  { icon: FileText, label: 'Compliance' },
];

const DETAILED_ASSETS = [
  { id: 'AST-9901', name: 'LLM Gateway Node', type: 'System', score: 94, status: 'Critical', threats: 12, vulnerabilities: 8, owner: 'Auto-Infrastructure', icon: Cpu },
  { id: 'ID-0421', name: 'j.doe@acme.com', type: 'Identity', score: 92, status: 'Critical', threats: 3, vulnerabilities: 1, owner: 'Finance Dept', icon: Fingerprint },
  { id: 'AST-8822', name: 'Vector DB Cluster', type: 'Database', score: 81, status: 'High', threats: 5, vulnerabilities: 14, owner: 'Data Science', icon: Database },
  { id: 'ID-1102', name: 'svc-payments@acme.com', type: 'Identity', score: 88, status: 'High', threats: 4, vulnerabilities: 0, owner: 'Engineering', icon: Zap },
  { id: 'AST-5541', name: 'Enterprise Search IP', type: 'Endpoint', score: 32, status: 'Low', threats: 0, vulnerabilities: 3, owner: 'IT Ops', icon: Globe },
  { id: 'AST-1123', name: 'Bedrock API Key', type: 'Secret', score: 65, status: 'Medium', threats: 1, vulnerabilities: 1, owner: 'AI Platform', icon: Lock },
];

// Components
const RiskBadge = ({ score }: { score: number }) => {
  const getGradient = () => {
    if (score >= 90) return 'from-rose-500 to-pink-600 text-white';
    if (score >= 75) return 'from-amber-400 to-orange-500 text-slate-950';
    if (score >= 40) return 'from-cyan-400 to-teal-500 text-slate-950';
    return 'from-slate-700 to-slate-800 text-slate-400';
  };

  return (
    <div className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm bg-gradient-to-tr", getGradient())}>
      {score >= 90 ? 'Critical' : score >= 75 ? 'High' : score >= 40 ? 'Medium' : 'Low'}
    </div>
  );
};
const StatCard = ({ title, value, sub, trend, status, icon: Icon, trendColor }: any) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-3xl group-hover:bg-teal-500/10 transition-all"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="bg-slate-800 p-2.5 rounded-xl group-hover:bg-teal-400/10 transition-colors">
        <Icon className={cn("w-5 h-5 transition-colors", status.includes('High') || status.includes('Critical') ? 'text-rose-400' : 'text-teal-400')} />
      </div>
      <div className={cn("flex items-center text-[10px] font-black uppercase tracking-widest", trendColor)}>
        {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <div className="space-y-1 relative z-10">
      <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">{title}</h3>
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-light text-white tracking-tight leading-tight">{value}</span>
        {sub && <span className="text-slate-500 text-xs font-medium">{sub}</span>}
      </div>
      <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: trend > 0 ? '75%' : '45%' }}
          className={cn("h-full bg-gradient-to-r", trend > 0 ? "from-teal-500 to-cyan-400" : "from-rose-500 to-pink-500")} 
        />
      </div>
    </div>
  </div>
);

const Sidebar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) => (
  <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col h-screen sticky top-0 hidden lg:flex">
    <div className="p-6 flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
        <Shield className="w-5 h-5 text-slate-950" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white uppercase">BASTION<span className="text-teal-400 font-medium">AUDIT</span></span>
    </div>

    <nav className="flex-1 px-4 py-8 space-y-1">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          onClick={() => item.id && onTabChange(item.id as any)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
            (item.id === activeTab || (item.active && activeTab === 'overview')) 
              ? "text-teal-400 bg-teal-400/5" 
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          )}
        >
          <item.icon className={cn("w-4 h-4", (item.id === activeTab || (item.active && activeTab === 'overview')) ? "text-teal-400" : "text-slate-500")} />
          {item.label}
          {item.id === activeTab && <div className="ml-auto w-1 h-4 bg-teal-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.5)]" />}
        </button>
      ))}
    </nav>

    <div className="p-6 border-t border-slate-800">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
          <Users className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">Ops Center</span>
          <span className="text-[10px] text-teal-500 uppercase tracking-widest">Active</span>
        </div>
      </div>
    </div>
  </aside>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'investigation' | 'inventory'>('overview');
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const IncidentInvestigationView = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-8 max-w-[1400px] mx-auto w-full"
    >
      <div className="flex items-center gap-4 text-slate-500 mb-2">
        <button onClick={() => setActiveTab('overview')} className="flex items-center gap-2 hover:text-teal-400 transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
          <ChevronRight className="w-4 h-4 rotate-180" /> Forensic Overview
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-light text-white tracking-tight leading-none uppercase">Impossible Travel Detected</h2>
            <span className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">Critical Alert</span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <p>ID: <span className="text-slate-300 font-mono">INC-2025-0518-1023</span></p>
            <p>Detection: <span className="text-slate-300">May 18, 2025 10:23 AM</span></p>
            <p>Status: <span className="text-teal-400">Response Active</span></p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:border-slate-700 transition-all active:scale-95">
            Internal Notes
          </button>
          <button className="px-8 py-3 rounded-xl bg-teal-400 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-teal-400/10 active:scale-95">
            Resolve Incident
          </button>
        </div>
      </div>

      <div className="flex gap-8 border-b border-slate-800">
        {['Summary', 'Audit Trail', 'Connected Assets', 'Evidence Storage'].map((tab) => (
          <button 
            key={tab} 
            className={cn(
              "pb-6 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative",
              tab === 'Audit Trail' ? "text-teal-400" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {tab}
            {tab === 'Audit Trail' && <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.5)]" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Containment Timeline</h3>
              <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex text-[9px] font-black uppercase tracking-widest">
                <span className="px-3 py-1 text-teal-400 bg-slate-800 rounded-md">Real-Time</span>
                <span className="px-3 py-1 text-slate-500">History</span>
              </div>
            </div>
            <div className="space-y-12 relative">
              <div className="absolute left-[19px] top-6 bottom-6 w-px bg-slate-800" />
              {[
                { time: '10:23:15 AM', event: 'Identity Breach Identified', desc: 'Impossible travel detected for service account: j.doe@acme.com', source: 'Entra Guard', icon: ShieldAlert, color: 'text-rose-500' },
                { time: '10:23:18 AM', event: 'Log Ingestion Complete', desc: 'SaaS logs correlated across multi-region edge nodes', source: 'Kinesis Stream', icon: Archive, color: 'text-teal-400' },
                { time: '10:23:22 AM', event: 'Response Orchestration', desc: 'Lambda trigger: Initiating automated tenant lockdown', source: 'AWS EventBridge', icon: Zap, color: 'text-amber-500' },
                { time: '10:23:25 AM', event: 'Asset Isolation', desc: 'Ephemeral tokens revoked; IP address 203.0.113.45 blocked', source: 'WAF Policy', icon: Users, color: 'text-teal-400' },
                { time: '10:23:28 AM', event: 'Guardrail Enforcement', desc: 'Amazon Bedrock guardrail set to "BLOCK ALL" for targeted PID', source: 'Bedrock Security', icon: Lock, color: 'text-teal-400' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-8 relative group">
                  <div className={cn("w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 z-10 group-hover:border-teal-400/50 transition-all duration-300 shadow-xl", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.time}</p>
                      <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">{item.source}</span>
                    </div>
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/30 hover:border-slate-700 hover:bg-slate-950/80 transition-all duration-300">
                      <p className="text-sm font-bold text-slate-200 mb-1 tracking-tight">{item.event}</p>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-white mb-8 uppercase tracking-[0.2em]">Case Meta-Data</h3>
            <div className="space-y-1">
              {[
                { label: 'Target ID', value: 'j.doe@acme.com', isMono: true },
                { label: 'M_Score', value: '92.4', color: 'text-rose-500' },
                { label: 'Vector', value: 'Session Hijacking' },
                { label: 'Latency Burst', value: '840ms ↑' },
                { label: 'Geo-Origin', value: 'London, UK' },
                { label: 'Exit Node', value: 'Singapore, SG' },
                { label: 'System', value: 'Microsoft Entra ID' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-4 border-b border-slate-800/50 last:border-0 group">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-400 transition-colors">{row.label}</span>
                  <span className={cn("text-xs font-bold text-slate-300", row.color, row.isMono && "font-mono")}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 flex flex-col items-center">
            <h3 className="text-[11px] font-black text-white mb-10 self-start uppercase tracking-[0.2em]">Task Completion</h3>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                <motion.circle 
                  initial={{ strokeDashoffset: 452 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-teal-400" strokeDasharray="452" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-light text-white tracking-tighter">100</span>
                <span className="text-[10px] text-teal-400 font-black uppercase tracking-[0.2em] mt-2">Verified</span>
              </div>
            </div>
            <div className="mt-10 w-full text-center space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                Response playbook automated execution is complete. All systems are in containment mode.
              </p>
              <button className="w-full py-3 rounded-xl border border-teal-400/20 text-[10px] font-black text-teal-400 uppercase tracking-widest hover:bg-teal-400/10 transition-all">
                Export Audit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const RiskInventoryView = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-8 max-w-[1400px] mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-light text-white tracking-tight leading-none uppercase">Risk Inventory</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Full visibility into system vulnerabilities and exposures</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-6">
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Monitored Assets</p>
                <p className="text-lg font-light text-white">12,842</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Unmitigated Risks</p>
                <p className="text-lg font-light text-rose-500">234</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-12">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
             <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                      <input 
                        type="text" 
                        placeholder="SEARCH ASSETS..." 
                        className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-[10px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-teal-400/50 transition-all w-64 uppercase tracking-widest"
                      />
                   </div>
                   <div className="h-8 w-px bg-slate-800" />
                   <div className="flex gap-2">
                      {['All', 'Critical', 'Identity', 'System'].map((filter) => (
                        <button key={filter} className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", filter === 'All' ? 'bg-teal-400 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-300')}>
                          {filter}
                        </button>
                      ))}
                   </div>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-teal-400 uppercase tracking-widest hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" /> Export Inventory
                </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase font-black tracking-widest text-slate-500 bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-5">Asset Entity</th>
                      <th className="px-6 py-5">Type / Owner</th>
                      <th className="px-6 py-5">Risk Posture</th>
                      <th className="px-6 py-5">Vulnerabilities</th>
                      <th className="px-6 py-5 text-right">Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {DETAILED_ASSETS.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-800/30 transition-all cursor-default group">
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-teal-400/30 transition-all">
                                <asset.icon className="w-5 h-5 text-slate-600 group-hover:text-teal-400" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-200 tracking-tight">{asset.name}</p>
                                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter mt-1">{asset.id}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-6 font-medium">
                           <p className="text-[10px] text-slate-300 font-black uppercase tracking-wider">{asset.type}</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{asset.owner}</p>
                        </td>
                        <td className="px-6 py-6">
                           <div className="space-y-2">
                             <div className="flex items-center justify-between w-32">
                                <span className={cn("text-[10px] font-black uppercase tracking-[0.15em]", asset.score > 80 ? 'text-rose-500' : 'text-teal-400')}>{asset.score} Score</span>
                                <RiskBadge score={asset.score} />
                             </div>
                             <div className="h-1.5 w-32 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${asset.score}%` }}
                                  className={cn("h-full", asset.score > 80 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : asset.score > 60 ? 'bg-amber-400' : 'bg-teal-400')} 
                                />
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-4">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Violations</span>
                                <span className="text-sm font-bold text-slate-200 mt-1">{asset.threats}</span>
                              </div>
                              <div className="h-6 w-px bg-slate-800" />
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">CVE Fixes</span>
                                <span className="text-sm font-bold text-slate-200 mt-1">{asset.vulnerabilities}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                           <div className="h-8 w-24 ml-auto opacity-50 group-hover:opacity-100 transition-opacity">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[{v:10},{v:25},{v:15},{v:30},{v:20},{v:40}]}>
                                  <Line type="monotone" dataKey="v" stroke={asset.score > 80 ? '#f43f5e' : '#2dd4bf'} strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const DynamicView = () => {
    switch (activeTab) {
      case 'investigation': return <IncidentInvestigationView />;
      case 'inventory': return <RiskInventoryView />;
      default: return (
        <motion.div 
          key="overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-8 space-y-8 max-w-[1400px] mx-auto w-full"
        >
          {/* Global Stats Grid - Refined 5 Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div onClick={() => stat.title.includes('Risk') && setActiveTab('inventory')} className={stat.title.includes('Risk') ? 'cursor-pointer' : ''}>
                  <StatCard {...stat} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Layout Grid: 12 Columns Pattern */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left Area: 8 Columns for main charts/alerts */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Risk Trend Area */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-1">Threat Trajectory</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Aggregate risk score over 7 days</p>
                  </div>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-1 text-[9px] font-black uppercase">
                    <button className="px-3 py-1 bg-slate-800 text-teal-400 rounded-md">Live View</button>
                    <button className="px-3 py-1 text-slate-500 hover:text-slate-300 transition-colors">Historical</button>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={RISK_SCORE_DATA}>
                      <defs>
                        <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} dy={10}/>
                      <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]}/>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                        cursor={{ stroke: '#2dd4bf', strokeWidth: 1 }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Audit Feed Table Replace Alerts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider">Real-Time Security Audit</h3>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                     <span className="text-[10px] text-teal-500 font-black uppercase tracking-widest">Scanner Active</span>
                  </div>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left min-w-[700px] border-collapse">
                    <thead className="text-[10px] uppercase font-black tracking-widest text-slate-500 bg-slate-950/30 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-4 sticky left-0 z-30 bg-slate-950/30 backdrop-blur-md min-w-[200px]">Threat Event</th>
                        <th className="px-6 py-4">Entity</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">M_Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {RECENT_ALERTS.map((alert) => (
                        <tr 
                          key={alert.id}
                          onClick={() => setActiveTab('investigation')}
                          className="hover:bg-teal-400/[0.02] cursor-pointer transition-colors group"
                        >
                          <td className="px-6 py-5 sticky left-0 z-10 bg-slate-900/90 group-hover:bg-slate-800/90 backdrop-blur-sm transition-colors border-r border-slate-800/30">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-teal-400/20 transition-colors">
                                <alert.icon className="w-4 h-4 text-teal-400" />
                              </div>
                              <span className="text-xs font-bold text-slate-200 group-hover:text-teal-400 transition-colors">{alert.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300">{alert.user}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={cn(
                              "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                              alert.severity === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                            )}>
                              {alert.severity}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right font-mono text-xs text-white">
                            {alert.severity === 'Critical' ? '98.2' : '74.1'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Area: 4 Columns for secondary metrics */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Domain Exposure Pie */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl"></div>
                <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-8">Risk Distribution</h3>
                <div className="h-[220px] w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DOMAIN_RISK_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {DOMAIN_RISK_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-5xl font-light text-white leading-none tracking-tighter">72</span>
                    <span className="text-[10px] text-teal-400 font-black uppercase tracking-[0.2em] mt-2">Aggregate</span>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  {DOMAIN_RISK_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tight">{item.name}</span>
                      </div>
                      <span className="text-xs font-mono text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risky Assets */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-8">High Risk Entities</h3>
                <div className="space-y-8">
                  {RISKY_IDENTITIES.map((identity) => (
                    <div key={identity.id} className="flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-teal-400/50 transition-all overflow-hidden relative">
                          <Fingerprint className="w-5 h-5 text-slate-600 transition-colors group-hover:text-teal-400" />
                          <div className="absolute inset-0 bg-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors tracking-tight">{identity.name}</p>
                          <p className={cn("text-[9px] font-black uppercase tracking-[0.15em] mt-1.5", identity.risk === 'High' ? 'text-rose-500' : 'text-amber-500')}>{identity.risk} ALERT</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-light text-white tracking-tighter leading-none">{identity.score}</p>
                        <div className="h-0.5 w-full bg-slate-800 mt-2 overflow-hidden">
                          <div className="h-full bg-teal-400" style={{ width: `${identity.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className="w-full mt-10 py-3 rounded-xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-teal-400/30 hover:text-teal-400 transition-all"
                >
                  View All Identities
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Power Status */}
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="bg-slate-900 border border-rose-500/20 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.03] to-transparent pointer-events-none" />
            <div className="flex items-start gap-8 z-10">
              <div className="bg-slate-950 border border-rose-500/10 p-5 rounded-2xl shadow-inner group-hover:scale-110 transition-all duration-700">
                <Power className={cn("w-12 h-12 transition-all duration-700", killSwitchActive ? "text-white animate-pulse" : "text-rose-500/80")} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-light text-white uppercase tracking-tight leading-none">Enterprise Containment Protocol</h3>
                <p className="text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
                  Instantly sever LLM gateway tunnels, rotate orchestration keys, and enforce read-only state for all monitored agents. <span className="text-rose-500/60">Authorization Level: Tier-1 Security Admin.</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setKillSwitchActive(!killSwitchActive)}
              className={cn(
                "px-16 py-7 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all duration-700 shadow-2xl z-10 min-w-[320px]",
                killSwitchActive 
                  ? "bg-rose-500 text-white shadow-rose-500/30 ring-4 ring-rose-500/10 scale-105" 
                  : "bg-slate-950 border-2 border-rose-500/20 text-rose-500/80 hover:border-rose-500 hover:text-white"
              )}
            >
              {killSwitchActive ? 'CONTAINMENT ACTIVE' : 'ENGAGE KILL-SWITCH'}
            </button>
          </motion.div>
        </motion.div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-teal-400 selection:text-slate-950">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 flex-none border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider transition-all">
              {activeTab === 'overview' ? 'Operations Dashboard' : activeTab === 'inventory' ? 'Asset Inventory' : 'Incident Forensics'}
            </h2>
            <div className="h-4 w-px bg-slate-800 hidden md:block" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden md:block">
              {activeTab === 'overview' ? 'System Health: Optimal' : activeTab === 'inventory' ? 'Inventory Scan: 100%' : 'Containment Active'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <span onClick={() => setActiveTab('overview')} className={cn("cursor-pointer py-5 transition-all", activeTab === 'overview' ? "text-teal-400 border-b-2 border-teal-400" : "hover:text-slate-200")}>Overview</span>
              <span className="hover:text-slate-200 cursor-pointer py-5 transition-colors">Guardrails</span>
              <span onClick={() => setActiveTab('inventory')} className={cn("cursor-pointer py-5 transition-all", activeTab === 'inventory' ? "text-teal-400 border-b-2 border-teal-400" : "hover:text-slate-200")}>Risks</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab(activeTab === 'overview' ? 'investigation' : 'overview')}
                className="flex items-center gap-2 bg-teal-400/10 border border-teal-400/30 text-teal-400 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 hover:text-slate-950 transition-all active:scale-95"
              >
                {activeTab === 'overview' ? 'Live Audit' : 'Dashboard'}
              </button>
              <div className="w-px h-6 bg-slate-800 mx-1" />
              <div className="relative">
                <Bell className="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {DynamicView()}
        </AnimatePresence>

        {/* Status Bar Footer */}
        <footer className="h-10 mt-auto border-t border-slate-800 px-8 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-950">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
              <span>System Status: Healthy</span>
            </div>
            <span className="text-slate-800">|</span>
            <span>Latency: 38ms</span>
            <span className="text-slate-800">|</span>
            <span>Uptime: 99.99%</span>
          </div>
          <div className="flex gap-8">
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Audit Logs</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">API Docs</span>
            <span className="text-teal-400/80">Compliance: ISO-27001</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
