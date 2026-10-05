'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Users, DollarSign, Megaphone, FileText, Trophy,
  CheckCircle2, RefreshCw, AlertTriangle, UserPlus, LogOut, Edit3, X, GraduationCap, Building2, Briefcase, Save, Wallet, Layers, ArrowRightUnchecked, RotateCcw
} from 'lucide-react';
import TestFeesControl from './components/TestFeesControl';

export default function SuperAdminCommandCenter() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Financial & Hierarchy States
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalAdmissions: 0, activePartnersCount: 0, pendingEnquiriesCount: 0, breakdown: { revenueByFranchise: {}, revenueByASM: {}, revenueByAgent: {} } });
  const [banners, setBanners] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [hierarchyTree, setHierarchyTree] = useState([]);
  const [walletsLedger, setWalletsLedger] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [commissionRules, setCommissionRules] = useState([
    { role: 'franchise', percentage: 15 },
    { role: 'asm', percentage: 5 },
    { role: 'coordinator', percentage: 20 },
    { role: 'company', percentage: 60 }
  ]);

  const [message, setMessage] = useState(null);

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || (role !== 'super_admin' && role !== 'admin')) {
      router.push('/login');
      return;
    }
    fetchAllDashboardData();
  }, [router]);

  const fetchAllDashboardData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [mRes, bRes, uRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/superadmin/metrics`, { headers }).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/banners`).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/users-directory`, { headers }).then(r => r.json())
      ]);

      if (mRes.success) setMetrics(mRes.metrics);
      if (bRes.success) setBanners(bRes.banners);
      if (uRes.success) setUsersList(uRes.users);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommissionRule = async (role, newPct) => {
    setMessage(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/commission-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role, percentage: Number(newPct) })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Updated ${role} commission share to ${newPct}% successfully!` });
        setCommissionRules(prev => prev.map(r => r.role === role ? { ...r, percentage: Number(newPct) } : r));
      } else {
        throw new Error(data.message || 'Failed to update rule');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-[#01295A] pb-12">
      <div className="bg-[#01295A] text-white px-6 py-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
            Superadmin Command Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">TOPIQ Hierarchical & Financial Ecosystem</h1>
          <p className="text-xs text-slate-300">Automatic Commission Engine, 10-Day Settlements, Wallets, and 60% Refund Controls.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAllDashboardData} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer" title="Refresh Data">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-xs px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl transition cursor-pointer shadow-md flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-md border border-slate-200">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: ShieldCheck },
            { id: 'hierarchy', label: 'Visual Hierarchy', icon: Layers },
            { id: 'commission', label: 'Commission Master', icon: DollarSign },
            { id: 'wallets', label: 'Wallet & Ledger', icon: Wallet },
            { id: 'settlements', label: '10-Day Settlements', icon: CheckCircle2 },
            { id: 'refunds', label: 'Refunds & Reversals', icon: RotateCcw },
            { id: 'fees', label: 'Test Fees Control', icon: DollarSign },
            { id: 'banners', label: 'Banners & Ads', icon: Megaphone },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeTab === tab.id ? 'bg-[#01295A] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {message && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Total Collection</div>
                <div className="text-3xl font-black text-emerald-600 font-mono">₹{metrics.totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-500 font-semibold">From {metrics.totalAdmissions} admissions</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Franchisee Share (15%)</div>
                <div className="text-3xl font-black text-[#FE7C02] font-mono">₹{(metrics.totalRevenue * 0.15).toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-500 font-semibold">Auto-credited to wallets</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">ASM Share (5%)</div>
                <div className="text-3xl font-black text-indigo-600 font-mono">₹{(metrics.totalRevenue * 0.05).toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-500 font-semibold">Auto-credited to wallets</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Coordinator Share (20%)</div>
                <div className="text-3xl font-black text-purple-600 font-mono">₹{(metrics.totalRevenue * 0.20).toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-500 font-semibold">Auto-credited to wallets</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">Visual Downstream Hierarchy (Franchisee → ASM → Coordinator)</h3>
            <p className="text-xs text-slate-500 font-medium">Click any franchise node to inspect downstream coordinators and earnings.</p>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="font-black text-sm text-[#01295A] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FE7C02]" /> Franchisee 001: Shreya Enterprises (15% Share)
                </div>
                <div className="pl-6 space-y-2 border-l-2 border-[#FE7C02]/40 ml-2">
                  <div className="font-bold text-slate-700">├── ASM 001: Sanjay Patil (5% Share)</div>
                  <div className="pl-6 space-y-1 border-l-2 border-indigo-300 ml-2">
                    <div>└── Coordinator 001: Rahul Sharma (20% Share)</div>
                    <div>└── Coordinator 002: Priya Deshmukh (20% Share)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'commission' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#01295A]">Configurable Commission Master</h3>
              <p className="text-xs text-slate-500 font-medium">Manage percentages dynamically without hardcoding values in the backend engine.</p>
            </div>

            <div className="space-y-4">
              {commissionRules.map((rule) => (
                <div key={rule.role} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-black uppercase text-xs text-[#01295A] block">{rule.role} Role Share</span>
                    <span className="text-[10px] text-slate-400">Current allocation percentage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={rule.percentage}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCommissionRules(prev => prev.map(r => r.role === rule.role ? { ...r, percentage: val } : r));
                      }}
                      className="w-20 px-3 py-2 rounded-xl border text-xs font-mono font-bold bg-white outline-none focus:ring-2 focus:ring-[#FE7C02]"
                    />
                    <button
                      onClick={() => handleUpdateCommissionRule(rule.role, rule.percentage)}
                      className="px-4 py-2 bg-[#FE7C02] text-white font-black rounded-xl text-xs cursor-pointer shadow hover:bg-orange-600 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">Immutable Financial Wallet Ledgers</h3>
            <p className="text-xs text-slate-500 font-medium">Every credit is backed by an admission ID and idempotency key to prevent duplicate credits.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Admission ID</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Base Amount</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Credit Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  <tr>
                    <td className="p-3 font-mono text-slate-500">WAL-000124</td>
                    <td className="p-3 font-black text-[#01295A]">TOPIQ-ADM-001</td>
                    <td className="p-3">Franchisee</td>
                    <td className="p-3">₹1,000</td>
                    <td className="p-3">15%</td>
                    <td className="p-3 text-emerald-600 font-black">+₹150</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Credited</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settlements' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">10-Day Automated Settlement Window</h3>
            <p className="text-xs text-slate-500 font-medium">Manage payout eligibility, processing status, and reference numbers for wallet settlements.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">User / Role</th>
                    <th className="p-3">Settlement Amount</th>
                    <th className="p-3">Eligible Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  <tr>
                    <td className="p-3 font-bold text-[#01295A]">Franchisee A (Shreya)</td>
                    <td className="p-3 font-mono font-bold">₹15,000</td>
                    <td className="p-3">15 Oct 2026</td>
                    <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Eligible</span></td>
                    <td className="p-3 text-right">
                      <button className="px-3 py-1 bg-[#01295A] text-white rounded-xl text-[10px] font-black cursor-pointer">Process Payout</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 max-w-2xl">
            <h3 className="text-lg font-black text-[#01295A]">60% Refund & Commission Reversal Engine</h3>
            <p className="text-xs text-slate-500 font-medium">When an admission is cancelled, the system automatically calculates the 60% refund and triggers traceable wallet adjustments.</p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Sample Admission Amount:</span>
                <span className="font-mono">₹1,000</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Configured Refund Rule:</span>
                <span className="font-mono text-rose-600">60%</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-t pt-2">
                <span className="text-[#01295A]">Calculated Refund Amount:</span>
                <span className="font-mono font-black text-emerald-600">₹600</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fees' && <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl"><TestFeesControl /></div>}
        {activeTab === 'banners' && <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl"><h3 className="text-base font-black text-[#01295A] mb-4">Banner & Advertisement Manager</h3></div>}

      </div>
    </div>
  );
}