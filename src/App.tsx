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
  Calendar,
  Loader2
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
  { title: 'AI Risk Index', value: '72', sub: '/100', trend: 8, status: 'High Risk', icon: Shield, trendColor: 'text-red-400' },
  { title: 'Identity Score', value: '88', sub: '%', trend: 5, status: 'Governed', icon: Fingerprint, trendColor: 'text-teal-400' },
  { title: 'AI Posture Drifts', value: '14', sub: '', trend: 18, status: 'Anomaly', icon: Activity, trendColor: 'text-rose-400' },
  { title: 'Agent Identities', value: '3,842', sub: '', trend: 6, status: 'Monitored', icon: Users, trendColor: 'text-teal-400' },
  { title: 'Open Incidents', value: '07', sub: '', trend: -2, status: 'In Triage', icon: FileText, trendColor: 'text-teal-400' },
];

// Role-Based Access Control Definitions
type ViewId = 'overview' | 'investigation' | 'inventory' | 'guardrails' | 'compliance' | 'reporting' | 'threats' | 'drift';
type UserRole = 'Administrator' | 'Analyst' | 'Executive';

const ROLE_PERMISSIONS: Record<UserRole, (ViewId | 'kill-switch')[]> = {
  Administrator: ['overview', 'investigation', 'inventory', 'guardrails', 'compliance', 'reporting', 'threats', 'drift', 'kill-switch'],
  Analyst: ['overview', 'investigation', 'inventory', 'reporting', 'threats', 'drift'],
  Executive: ['overview', 'inventory', 'compliance', 'reporting', 'threats', 'drift'],
};

const NAV_ITEMS: { icon: any, label: string, id: ViewId }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'overview' },
  { icon: ShieldAlert, label: 'Threat Hub', id: 'threats' },
  { icon: Activity, label: 'Behavioral Drift', id: 'drift' },
  { icon: Search, label: 'Investigations', id: 'investigation' },
  { icon: Database, label: 'Risk Inventory', id: 'inventory' },
  { icon: Cpu, label: 'Model Guardrails', id: 'guardrails' },
  { icon: BarChart3, label: 'Reports', id: 'reporting' },
  { icon: FileText, label: 'Compliance', id: 'compliance' },
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

const Sidebar = ({ activeTab, onTabChange, userRole }: { activeTab: string, onTabChange: (id: string) => void, userRole: UserRole }) => (
  <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col h-screen sticky top-0 hidden lg:flex">
    <div className="p-6 flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
        <Shield className="w-5 h-5 text-slate-950" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white uppercase">BASTION<span className="text-teal-400 font-medium">AUDIT</span></span>
    </div>

    <nav className="flex-1 px-4 py-8 space-y-1">
      {NAV_ITEMS.map((item) => {
        const hasPermission = ROLE_PERMISSIONS[userRole].includes(item.id);
        if (!hasPermission) return null;
        
        return (
          <button
            key={item.label}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
              item.id === activeTab
                ? "text-teal-400 bg-teal-400/5" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-4 h-4", item.id === activeTab ? "text-teal-400" : "text-slate-500")} />
            {item.label}
            {item.id === activeTab && <div className="ml-auto w-1 h-4 bg-teal-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.5)]" />}
          </button>
        );
      })}
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
  const [activeTab, setActiveTab] = useState<ViewId>('overview');
  const [userRole, setUserRole] = useState<UserRole>('Administrator');
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // If role switches and current tab is no longer allowed, redirect to overview
    if (!ROLE_PERMISSIONS[userRole].includes(activeTab)) {
      setActiveTab('overview');
    }
  }, [userRole]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const IncidentInvestigationView = () => {
    const [subTab, setSubTab] = useState('Audit Trail');

    return (
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
              onClick={() => setSubTab(tab)}
              className={cn(
                "pb-6 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative",
                tab === subTab ? "text-teal-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {tab}
              {tab === subTab && <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.5)]" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {subTab === 'Audit Trail' ? (
            <>
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
            </>
          ) : (
             <div className="col-span-12 h-64 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl flex items-center justify-center text-slate-500 uppercase tracking-widest font-black text-[10px]">
                Detailed {subTab} View Under Development
             </div>
          )}
        </div>
      </motion.div>
    );
  };

  const RiskInventoryView = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAssets = DETAILED_ASSETS.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           asset.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || asset.type.includes(activeFilter) || (activeFilter === 'Critical' && asset.score > 80);
      return matchesSearch && matchesFilter;
    });

    return (
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
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-[10px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-teal-400/50 transition-all w-64 uppercase tracking-widest"
                        />
                     </div>
                     <div className="h-8 w-px bg-slate-800" />
                     <div className="flex gap-2">
                        {['All', 'Critical', 'Identity', 'System'].map((filter) => (
                          <button 
                            key={filter} 
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", 
                              activeFilter === filter ? 'bg-teal-400 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-300'
                            )}
                          >
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
                      {filteredAssets.map((asset) => (
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
  };

  const GuardrailsView = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-8 max-w-[1400px] mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-light text-white tracking-tight leading-none uppercase">Model Guardrails</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Real-time policy enforcement for generative AI workloads</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-6">
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Policies</p>
                <p className="text-lg font-light text-white">42</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Blocks (24h)</p>
                <p className="text-lg font-light text-teal-400">1,248</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-8">System Instruction Integrity</h3>
            <div className="space-y-6">
              {[
                { name: 'Prompt Injection Filter', status: 'Active', latency: '12ms', efficacy: '99.9%' },
                { name: 'PII Scrubbing', status: 'Active', latency: '45ms', efficacy: '100%' },
                { name: 'Toxicity Detection', status: 'Warning', latency: '18ms', efficacy: '94.2%' },
                { name: 'Jailbreak Prevention', status: 'Active', latency: '22ms', efficacy: '99.7%' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", item.status === 'Active' ? 'bg-teal-400 shadow-teal-400/50' : 'bg-amber-400 shadow-amber-400/50')} />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-8 text-right">
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Latency</p>
                      <p className="text-xs font-mono text-slate-300">{item.latency}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Efficacy</p>
                      <p className="text-xs font-mono text-teal-400">{item.efficacy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-8">Model Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RISK_SCORE_DATA}>
                  <Area type="monotone" dataKey="score" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

const THREAT_ALERTS = [
  { id: 'T-992', severity: 'Critical', type: 'Prompt Injection', target: 'Llama-3-70b-Gateway', timestamp: '2m ago', desc: 'Direct prompt injection attempt targeting internal API keys via recursive token expansion.', status: 'Active', insights: ['Rotate API Gateway Keys', 'Enable strict token filtering', 'Quarantine session ID: 882-X'] },
  { id: 'T-985', severity: 'High', type: 'DDoS Pattern', target: 'CDN Edge Node (US-West)', timestamp: '14m ago', desc: 'Anomalous request volume detected from unverified botnet signatures reaching 45k req/s.', status: 'Mitigated', insights: ['Update WAF Rate Limits', 'Scrub ingress traffic at edge', 'Notify ISP of subnet origin'] },
  { id: 'T-981', severity: 'Medium', type: 'Unauthorized Access', target: 'Azure AD (OIDC)', timestamp: '1h ago', desc: 'Successive login failures followed by successful entry from a blacklisted VPN subnet.', status: 'Investigating', insights: ['Force MFA reset for user', 'Validate session IP logs', 'Check for horizontal movement'] },
  { id: 'T-977', severity: 'Low', type: 'Insecure Model Output', target: 'Internal Customer Support Chat', timestamp: '3h ago', desc: 'PII found in model response during routine batch auditing of support conversations.', status: 'Archived', insights: ['Update output guardrail regex', 'Redact history in database', 'Fine-tune PII filter threshold'] },
];

const ThreatDetectionView = () => {
  const [selectedAlert, setSelectedAlert] = useState(THREAT_ALERTS[0]);
  const [triageStage, setTriageStage] = useState<'Detection' | 'Analysis' | 'Response'>('Detection');
  const [isAutomating, setIsAutomating] = useState(false);

  const handleAutomate = () => {
    setIsAutomating(true);
    setTimeout(() => {
      setIsAutomating(false);
      setTriageStage('Response');
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-8 max-w-[1400px] mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-light text-white tracking-tight leading-none uppercase">Threat Detection Center</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">SOC-Aligned autonomous monitoring and incident triage</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-2.5 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Alerts</span>
              </div>
              <p className="text-xl font-light text-white">04</p>
           </div>
           <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-2.5 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Auto-Triage</span>
              </div>
              <p className="text-xl font-light text-teal-400">ON</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Alert Feed */}
        <div className="col-span-12 lg:col-span-12 xl:col-span-7 space-y-4 h-[700px] overflow-y-auto scrollbar-hide pr-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Live Threat Stream</h3>
            <div className="flex gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <span>Sort: Priority</span>
              <span>Filter: All</span>
            </div>
          </div>

          {THREAT_ALERTS.map((alert) => (
            <motion.div 
              key={alert.id}
              onClick={() => {
                setSelectedAlert(alert);
                setTriageStage('Detection');
              }}
              whileHover={{ x: 4 }}
              className={cn(
                "p-6 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                selectedAlert.id === alert.id 
                  ? "bg-slate-900 border-teal-400/50 shadow-2xl shadow-teal-400/5" 
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110",
                    alert.severity === 'Critical' ? "bg-rose-500/10 border-rose-500/30 text-rose-500" :
                    alert.severity === 'High' ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                    "bg-teal-400/10 border-teal-400/30 text-teal-400"
                  )}>
                    {alert.severity === 'Critical' ? <ShieldAlert className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-bold text-slate-100 tracking-tight leading-none">{alert.type}</h4>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                        alert.severity === 'Critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                        alert.severity === 'High' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-teal-400/10 text-teal-400 border-teal-400/20"
                      )}>{alert.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-md line-clamp-1">{alert.desc}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-[9px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{alert.id}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 line-clamp-1">
                        <Globe className="w-3 h-3" /> {alert.target}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{alert.timestamp}</p>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest mt-1",
                    alert.status === 'Active' ? 'text-rose-500' : 
                    alert.status === 'Mitigated' ? 'text-teal-400' : 'text-amber-500'
                  )}>{alert.status}</p>
                </div>
              </div>
              {selectedAlert.id === alert.id && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-gradient-to-r from-teal-400/[0.03] to-transparent pointer-events-none" 
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Structured Triage Panel */}
        <div className="col-span-12 xl:col-span-5 h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedAlert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl h-full flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-teal-400/[0.02] to-transparent pointer-events-none" />
              
              <div className="p-8 border-b border-slate-800/50 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.25em]">SOC Triage Workflow</p>
                    <h3 className="text-2xl font-light text-white tracking-tight leading-tight uppercase">Incident {selectedAlert.id}</h3>
                  </div>
                  <div className="flex gap-2">
                    {['Detection', 'Analysis', 'Response'].map((stage) => (
                      <div 
                        key={stage}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-500",
                          triageStage === stage ? "bg-teal-400 scale-125 shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "bg-slate-800"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/50">
                  {['Detection', 'Analysis', 'Response'].map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setTriageStage(stage as any)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                        triageStage === stage ? "bg-slate-800 text-teal-400 shadow-inner" : "text-slate-600 hover:text-slate-400"
                      )}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-hide relative z-10">
                {triageStage === 'Detection' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identification Metadata</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950/40 border border-slate-800/50 rounded-xl">
                          <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Source Node</p>
                          <p className="text-xs font-mono text-slate-300">{selectedAlert.target}</p>
                        </div>
                        <div className="p-4 bg-slate-950/40 border border-slate-800/50 rounded-xl">
                          <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Signature ID</p>
                          <p className="text-xs font-mono text-slate-300">SIG-AI-{selectedAlert.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                      <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mb-2">Automated Risk Verdict</p>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">System identifies high correlation between incoming prompt pattern and known recursive injection vectors. Behavioral drift confirmed at +14% deviation.</p>
                    </div>
                  </motion.div>
                )}

                {triageStage === 'Analysis' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrichment & Correlation</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Identity Authenticity', score: 'Verified (mTLS)', color: 'text-teal-400' },
                        { label: 'Asset Criticality', score: 'P1 - Revenue Path', color: 'text-rose-500' },
                        { label: 'Data Sensitivity', score: 'Tier 3 (Regulated)', color: 'text-amber-500' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-slate-950/40 border border-slate-800/50 rounded-xl hover:border-slate-700 transition-all">
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.label}</span>
                          <span className={cn("text-xs font-bold", item.color)}>{item.score}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 border-dashed">
                      <div className="flex items-center gap-3 mb-3">
                        <Activity className="w-4 h-4 text-teal-400" />
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">Forensic Hook Output</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 space-y-1">
                        <p>&gt; Fetching LLM execution trace...</p>
                        <p>&gt; Correlating session {selectedAlert.id} with gateway-02...</p>
                        <p>&gt; No horizontal PII movement detected.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {triageStage === 'Response' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Automated Playbook Execution</h4>
                    <div className="space-y-3">
                      {selectedAlert.insights.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-950/40 border border-teal-400/20 rounded-xl group">
                          <div className="w-6 h-6 rounded-lg bg-teal-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                            {idx + 1}
                          </div>
                          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">{step}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 ml-auto" />
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-teal-400/5 border border-teal-400/10 rounded-xl">
                      <p className="text-[9px] text-teal-400 font-black uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Containment Status: ACTIVE
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-8 bg-slate-950/80 border-t border-slate-800/50 flex gap-4">
                {triageStage !== 'Response' ? (
                  <button 
                    onClick={handleAutomate}
                    disabled={isAutomating}
                    className="flex-1 py-4 bg-teal-400 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-teal-400/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAutomating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    {isAutomating ? 'Orchestrating Response...' : 'Automate SOC Playbook'}
                  </button>
                ) : (
                  <button className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-teal-400 uppercase tracking-widest hover:border-teal-400/30 transition-all">
                    Resolve Case & Archive
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const DRIFT_DATA = [
  { time: '00:00', drift: 12, baseline: 15, alerts: 0 },
  { time: '04:00', drift: 18, baseline: 15, alerts: 0 },
  { time: '08:00', drift: 25, baseline: 18, alerts: 1 },
  { time: '12:00', drift: 45, baseline: 20, alerts: 3 },
  { time: '16:00', drift: 35, baseline: 22, alerts: 1 },
  { time: '20:00', drift: 28, baseline: 20, alerts: 0 },
  { time: '23:59', drift: 22, baseline: 18, alerts: 0 },
];

const BehavioralDriftView = () => {
  const [sensitivity, setSensitivity] = useState(65);
  const [viewHistorical, setViewHistorical] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-8 max-w-[1400px] mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-light text-white tracking-tight leading-none uppercase">Behavioral Drift Analysis</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Monitoring systemic deviations from validated behavioral norms</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-2.5 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Drift</span>
                <span className="text-xl font-light text-teal-400">Low (12.4%)</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Anomalies Detected</span>
                <span className="text-xl font-light text-rose-500">03</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Drift Over Time</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Real-time telemetry vs. moving average baseline</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewHistorical(false)}
                  className={cn("px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", !viewHistorical ? "bg-teal-400 text-slate-950" : "bg-slate-950 text-slate-500 border border-slate-800")}
                >
                  24h Live
                </button>
                <button 
                  onClick={() => setViewHistorical(true)}
                  className={cn("px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", viewHistorical ? "bg-teal-400 text-slate-950" : "bg-slate-950 text-slate-500 border border-slate-800")}
                >
                  7d History
                </button>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DRIFT_DATA}>
                  <defs>
                    <linearGradient id="driftGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#475569" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#475569', fontWeight: 800 }}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#475569', fontWeight: 800 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                    labelStyle={{ fontSize: '10px', fontWeight: 900, marginBottom: '4px', color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="drift" stroke="#2dd4bf" fillOpacity={1} fill="url(#driftGradient)" strokeWidth={3} />
                  <Area type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="5 5" fill="transparent" strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 flex items-center gap-12 border-t border-slate-800 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Drift Telemetry</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full border border-slate-600 border-dashed" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Historical Baseline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration & Anomalies */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-[11px] font-black text-white mb-8 uppercase tracking-[0.2em]">Detection Sensitivity</h3>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Threshold Level</span>
                  <span className="text-teal-400">{sensitivity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400 border border-slate-800"
                />
                <div className="flex justify-between text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                  <span>Permissive</span>
                  <span>Strict (Restricted)</span>
                </div>
              </div>
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                  Higher sensitivity reduces <span className="text-teal-400">False Negatives</span> but may trigger more frequent container isolation.
                </p>
                <div className="flex items-center gap-2 text-[9px] text-teal-400 font-black uppercase tracking-widest">
                  <Settings className="w-3 h-3" /> Auto-Tune Enabled
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-[11px] font-black text-white mb-8 uppercase tracking-[0.2em]">Recent Deviations</h3>
            <div className="space-y-4">
              {[
                { time: '14:22', type: 'Latency Spike', drift: '+12%', status: 'Investigating' },
                { time: '10:05', type: 'Token Density', drift: '+45%', status: 'Alerted' },
                { time: '08:42', type: 'Prompt Length', drift: '+22%', status: 'Ignored' },
              ].map((dev, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-950/30 border border-slate-800 rounded-xl group hover:border-slate-700 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] text-slate-600 font-mono">{dev.time}</span>
                       <span className="text-[10px] font-bold text-slate-300 uppercase">{dev.type}</span>
                    </div>
                    <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{dev.drift} Deviation</div>
                  </div>
                  <div className={cn("text-[9px] font-black uppercase px-2 py-1 rounded", dev.status === 'Alerted' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-900 text-slate-500')}>
                    {dev.status}
                  </div>
                </div>
              ))}
              <button className="w-full py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
                View Full Audit Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

  const ReportingView = () => {
    const [dateRange, setDateRange] = useState('Last 7 Days');
    const [eventTypes, setEventTypes] = useState<string[]>(['Malware', 'Prompt Injection']);
    const [targetAssets, setTargetAssets] = useState('All Infrastructure');

    const toggleEventType = (type: string) => {
      setEventTypes(prev => 
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="p-8 space-y-8 max-w-[1400px] mx-auto w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-light text-white tracking-tight leading-none uppercase">Security Reporting</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Generate verifiable forensic exports and audit trail summaries</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-teal-400 hover:text-white transition-all group">
              <FileText className="w-3.5 h-3.5" /> Export as PDF
            </button>
            <button className="flex items-center gap-2 bg-teal-400 text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-teal-400/10 active:scale-95">
              <Archive className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Report Filters */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-teal-400" /> Date Range
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {['24h', 'Last 7 Days', '30 Days', 'Custom'].map((range) => (
                    <button 
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={cn(
                        "py-2.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all",
                        dateRange === range 
                          ? "bg-teal-400 border-teal-400 text-slate-950" 
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-800/50" />

              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 text-teal-400" /> Event Classifications
                </h3>
                <div className="space-y-2">
                  {['Malware', 'Phishing', 'Unauthorized Access', 'Prompt Injection', 'PII Leak', 'Privilege Escalation'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => toggleEventType(type)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                        eventTypes.includes(type)
                          ? "bg-teal-400/5 border-teal-400/30 text-teal-400"
                          : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700"
                      )}
                    >
                      {type}
                      <div className={cn("w-3 h-3 rounded border flex items-center justify-center", eventTypes.includes(type) ? "border-teal-400 bg-teal-400" : "border-slate-700")}>
                        {eventTypes.includes(type) && <div className="w-1.5 h-1.5 bg-slate-950 rounded-sm" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-800/50" />

              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <Globe className="w-3 h-3 text-teal-400" /> Target Assets
                </h3>
                <select 
                  value={targetAssets}
                  onChange={(e) => setTargetAssets(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest focus:outline-none focus:border-teal-400 transition-all appearance-none cursor-pointer"
                >
                  <option value="All Infrastructure">All Infrastructure</option>
                  <option value="LLM Gateway Nodes">LLM Gateway Nodes</option>
                  <option value="Production Databases">Production Databases</option>
                  <option value="Endpoint Fleet">Endpoint Fleet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Report Preview */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col">
              <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-teal-400/[0.03] to-transparent pointer-events-none" />
              
              <div className="p-10 border-b border-slate-800/50 flex justify-between items-start relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center">
                      <Archive className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-light text-white uppercase tracking-tight">Security Incident Summary</h4>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Generated: May 18, 2025 at 14:30 EST</p>
                    </div>
                  </div>
                  <div className="flex gap-6 mt-6">
                    <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">D_Range</p>
                      <p className="text-[10px] text-teal-400 font-black uppercase tracking-wider">{dateRange}</p>
                    </div>
                    <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Classes</p>
                      <p className="text-[10px] text-slate-300 font-black uppercase tracking-wider">{eventTypes.length} Selected</p>
                    </div>
                    <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Verdicts</p>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-wider">High Sensitivity</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col items-center">
                   <div className="w-12 h-12 rounded-full border-2 border-teal-400/20 flex items-center justify-center mb-2">
                      <span className="text-xs font-mono text-teal-400">99.9</span>
                   </div>
                   <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Confidence</p>
                </div>
              </div>

              <div className="flex-1 p-10 space-y-10 relative z-10 overflow-y-auto max-h-[500px] scrollbar-hide">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Threat Magnitude (24h)</h5>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart3 className="w-full h-full text-slate-800 opacity-20" />
                        {/* Static Visual Representation */}
                        <div className="flex items-end justify-between h-full px-4">
                          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <motion.div 
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              className="w-4 bg-teal-400/80 rounded-t-sm"
                            />
                          ))}
                        </div>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Geographical Distribution</h5>
                    <div className="space-y-3">
                      {[
                        { country: 'North America', pct: 45, color: 'bg-teal-400' },
                        { country: 'Europe (EU-West)', pct: 30, color: 'bg-cyan-400' },
                        { country: 'Asia Pacific', pct: 15, color: 'bg-amber-400' },
                        { country: 'Other', pct: 10, color: 'bg-slate-700' },
                      ].map((item) => (
                        <div key={item.country} className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                            <span>{item.country}</span>
                            <span>{item.pct}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                            <div className={cn("h-full", item.color)} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h5 className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Significant Event Log Preview</h5>
                  <div className="bg-slate-950/50 rounded-xl border border-slate-800/80 overflow-hidden">
                    {[
                      { ts: '12:44:02', event: 'Malicious API Signature Match', src: 'Gateway-02', score: '99.4' },
                      { ts: '12:51:15', event: 'Prompt Injection Pattern Observed', src: 'Bedrock-01', score: '82.7' },
                      { ts: '13:05:55', event: 'Identity Session Token Rotated', src: 'Auth-Node', score: 'N/A' },
                      { ts: '14:22:10', event: 'Credential Spraying Attack Blocked', src: 'WAF-Alpha', score: '95.1' },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between px-6 py-4 border-b border-slate-800/30 last:border-0 hover:bg-slate-950 transition-colors">
                        <div className="flex gap-6 items-center">
                          <span className="text-[9px] font-mono text-slate-600">{row.ts}</span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{row.event}</span>
                        </div>
                        <div className="flex gap-6 items-center">
                          <span className="text-[9px] text-slate-500 font-mono italic">{row.src}</span>
                          <span className={cn("text-[10px] font-black", row.score === 'N/A' ? 'text-slate-700' : 'text-teal-400')}>{row.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-950/80 border-t border-slate-800/50 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                <span>BASTION_SECURE_ENCLAVE_OUTPUT</span>
                <span>VERIFY_KEY: ABX-992-K01</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ComplianceView = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-8 max-w-[1400px] mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-light text-white tracking-tight leading-none uppercase">Compliance Oversight</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Monitoring OSFI, SOC2, and PIPEDA regulatory alignment</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-4">
             <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Market Alignment:</span>
             <span className="text-[10px] text-teal-400 font-black uppercase tracking-widest">Toronto / Canada Financial</span>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-teal-400/30 transition-all">
            <Archive className="w-3.5 h-3.5" /> Regulatory Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'OSFI E-21', score: 94, status: 'Compliant', date: 'Exp: Dec 2025', desc: 'Operational Risk Management for AI' },
          { name: 'SOC2 Type II', score: 98, status: 'Compliant', date: 'Review: 12d', desc: 'Trust Services Criteria: AI Workloads' },
          { name: 'PIPEDA / Bill C-27', score: 82, status: 'Warning', date: 'Audit Pending', desc: 'AI PII Protection & Data Sovereignty' },
        ].map((framework) => (
          <div key={framework.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h3 className="text-xl font-light text-white uppercase tracking-tight">{framework.name}</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wide">{framework.desc}</p>
              </div>
              <CheckCircle2 className={cn("w-6 h-6", framework.status === 'Compliant' ? 'text-teal-400' : 'text-amber-400')} />
            </div>
            <div className="space-y-4 relative z-10 pt-4">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-light text-white">{framework.score}%</span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{framework.date}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${framework.score}%` }}
                  className={cn("h-full", framework.score >= 90 ? 'bg-teal-400' : 'bg-amber-400')}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const DynamicView = () => {
    switch (activeTab) {
      case 'threats': return <ThreatDetectionView />;
      case 'drift': return <BehavioralDriftView />;
      case 'investigation': return <IncidentInvestigationView />;
      case 'inventory': return <RiskInventoryView />;
      case 'guardrails': return <GuardrailsView />;
      case 'compliance': return <ComplianceView />;
      case 'reporting': return <ReportingView />;
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

          {/* Bottom Power Status - Restricted to Administrator */}
          {ROLE_PERMISSIONS[userRole].includes('kill-switch') ? (
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
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Lock className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Administrative Containment Utilities - Access Denied</p>
              </div>
            </div>
          )}
        </motion.div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-teal-400 selection:text-slate-950">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab as any} userRole={userRole} />

      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 flex-none border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider transition-all">
              {activeTab === 'overview' ? 'Operations Dashboard' : 
               activeTab === 'inventory' ? 'Asset Inventory' : 
               activeTab === 'guardrails' ? 'Policy Guardrails' :
               activeTab === 'compliance' ? 'Compliance Oversight' :
               activeTab === 'reporting' ? 'Security Reporting' :
               activeTab === 'threats' ? 'Threat Detection Hub' :
               activeTab === 'drift' ? 'Behavioral Drift Analysis' :
               'Incident Forensics'}
            </h2>
            <div className="h-4 w-px bg-slate-800 hidden md:block" />
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700">
               <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Role:</span>
               <select 
                 value={userRole} 
                 onChange={(e) => setUserRole(e.target.value as UserRole)}
                 className="bg-transparent text-[9px] font-black text-teal-400 uppercase tracking-widest focus:outline-none cursor-pointer"
               >
                 <option value="Administrator" className="bg-slate-900">Administrator</option>
                 <option value="Analyst" className="bg-slate-900">Analyst</option>
                 <option value="Executive" className="bg-slate-900">Executive</option>
               </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <span onClick={() => setActiveTab('overview')} className={cn("cursor-pointer py-5 transition-all", activeTab === 'overview' ? "text-teal-400 border-b-2 border-teal-400" : "hover:text-slate-200")}>Overview</span>
              {ROLE_PERMISSIONS[userRole].includes('threats') && (
                <span onClick={() => setActiveTab('threats')} className={cn("cursor-pointer py-5 transition-all", activeTab === 'threats' ? "text-teal-400 border-b-2 border-teal-400" : "hover:text-slate-200")}>Threats</span>
              )}
              {ROLE_PERMISSIONS[userRole].includes('drift') && (
                <span onClick={() => setActiveTab('drift')} className={cn("cursor-pointer py-5 transition-all", activeTab === 'drift' ? "text-teal-400 border-b-2 border-teal-400" : "hover:text-slate-200")}>Drift</span>
              )}
              {ROLE_PERMISSIONS[userRole].includes('guardrails') && (
                <span onClick={() => setActiveTab('guardrails')} className={cn("cursor-pointer py-5 transition-all", activeTab === 'guardrails' ? "text-teal-400 border-b-2 border-teal-400" : "hover:text-slate-200")}>Guardrails</span>
              )}
              {ROLE_PERMISSIONS[userRole].includes('inventory') && (
                <span onClick={() => setActiveTab('inventory')} className={cn("cursor-pointer py-5 transition-all", activeTab === 'inventory' ? "text-teal-400 border-b-2 border-teal-400" : "hover:text-slate-200")}>Risks</span>
              )}
              {ROLE_PERMISSIONS[userRole].includes('reporting') && (
                <span onClick={() => setActiveTab('reporting')} className={cn("cursor-pointer py-5 transition-all", activeTab === 'reporting' ? "text-teal-400 border-b-2 border-teal-400" : "hover:text-slate-200")}>Reports</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {ROLE_PERMISSIONS[userRole].includes('investigation') && (
                <button 
                  onClick={() => setActiveTab(activeTab === 'overview' ? 'investigation' : 'overview')}
                  className="flex items-center gap-2 bg-teal-400/10 border border-teal-400/30 text-teal-400 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 hover:text-slate-950 transition-all active:scale-95"
                >
                  {activeTab === 'overview' ? 'Live Audit' : 'Dashboard'}
                </button>
              )}
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
              <span>System Status: Optimal</span>
            </div>
            <span className="text-slate-800">|</span>
            <span>Region: Canada Central (Toronto)</span>
            <span className="text-slate-800">|</span>
            <span>Latency: 32ms</span>
          </div>
          <div className="flex gap-8">
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Forensic Vault</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Strategic Hooks</span>
            <span className="text-teal-400/80">Compliance: OSFI E-21</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
