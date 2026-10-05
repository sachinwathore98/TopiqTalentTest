'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, Users, Wallet, FileText, CheckCircle2, RefreshCw, LogOut, ArrowUpRight, Filter, DollarSign 
} from 'lucide-react';

export default function FranchiseeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Franchisee Isolated State
  const [franchiseData, setFranchiseData] = useState({
    name: '',
    email: '',
    gstNumber: '',
    metrics: { admissionsCount: 0, todayAdmissions: 0, monthlyAdmissions: 0 },
    wallet: { availableBalance: 0, pendingSettlement: 0, settledAmount: 0 },
    asms: [],
    coordinators: [],
    admissions: [],
    commissions: []
  });

  const [filters, setFilters] = useState({ asm: '', coordinator: '', status: '', exam: '' });

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'franchise'].includes(role)) {
      router.push('/login');
      return;
    }
    fetchFranchiseeData();
  }, [router]);

  const fetchFranchiseeData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/franchise/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFranchiseData(data);
      }
    } catch (err) {
      console.error('Error fetching franchisee dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-[#01295A] pb-12">
      {/* Top Banner */}
      <div className="bg-[#01295A] text-white px-6 py-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
            Franchisee Portal (15% Commission Tier)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">{franchiseData.name || 'Shreya Enterprises — Franchise Dashboard'}</h1>
          <p className="text-xs text-slate-300">Manage downstream ASMs, Coordinators, automatic 15% wallet credits, and hierarchical admissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchFranchiseeData} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer" title="Refresh Data">
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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-md border border-slate-200">
          {[
            { id: 'overview', label: 'My Overview & Wallet', icon: Wallet },
            { id: 'admissions', label: 'Hierarchy Admissions', icon: FileText },
            { id: 'asms', label: 'My ASMs & Coordinators', icon: Users },
            { id: 'commissions', label: 'Commission History', icon: DollarSign },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Tab 1: Overview & Wallet */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Total Admissions (Hierarchy)</div>
                <div className="text-3xl font-black text-[#01295A]">{franchiseData.metrics.admissionsCount || 120}</div>
                <div className="text-xs text-emerald-600 font-semibold">+14 this month</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Available Wallet Balance</div>
                <div className="text-3xl font-black text-emerald-600 font-mono">₹{franchiseData.wallet.availableBalance.toLocaleString('en-IN') || '41,250'}</div>
                <div className="text-xs text-slate-500 font-semibold">15% automatic credit active</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Pending Settlement (10-Day Window)</div>
                <div className="text-3xl font-black text-[#FE7C02] font-mono">₹{franchiseData.wallet.pendingSettlement.toLocaleString('en-IN') || '15,000'}</div>
                <div className="text-xs text-slate-500 font-semibold">Ready for payout processing</div>
              </div>
            </div>

            {/* Quick Summary of Downstream Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-3">
                <h3 className="text-sm font-black text-[#01295A] uppercase border-b pb-2">Assigned ASMs</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl text-xs font-bold">
                    <span>Sanjay Patil (ASM 001)</span>
                    <span className="text-indigo-600">3 Coordinators</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-3">
                <h3 className="text-sm font-black text-[#01295A] uppercase border-b pb-2">Wallet Ledger Calculation Rule</h3>
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold space-y-1 text-slate-700">
                  <div className="flex justify-between"><span>Sample Admission:</span> <strong className="font-mono">₹1,000</strong></div>
                  <div className="flex justify-between"><span>Franchisee Share (15%):</span> <strong className="font-mono text-emerald-600">+₹150 Credit</strong></div>
                  <div className="text-[10px] text-slate-400 pt-1">Automatic credit applied upon verified admission payment.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hierarchy Admissions */}
        {activeTab === 'admissions' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">Hierarchy Admission Tracking</h3>
                <p className="text-xs text-slate-500 font-medium">Filter admissions generated downstream under your assigned ASMs and Coordinators.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
                <select 
                  value={filters.asm}
                  onChange={e => setFilters({ ...filters, asm: e.target.value })}
                  className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
                >
                  <option value="">All ASMs</option>
                  <option value="Sanjay">Sanjay Patil</option>
                </select>

                <select 
                  value={filters.coordinator}
                  onChange={e => setFilters({ ...filters, coordinator: e.target.value })}
                  className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
                >
                  <option value="">All Coordinators</option>
                  <option value="Rahul">Rahul Sharma</option>
                  <option value="Priya">Priya Deshmukh</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">Admission ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Exam Category</th>
                    <th className="p-3">ASM / Coordinator</th>
                    <th className="p-3">Commission (15%)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  <tr>
                    <td className="p-3 font-mono font-black text-[#01295A]">TOPIQ-ADM-0001</td>
                    <td className="p-3 font-bold">Atharva Deshmukh <br/><span className="text-[10px] text-slate-400 font-mono">9822012345</span></td>
                    <td className="p-3">Group C (Class 5-6)</td>
                    <td className="p-3 text-slate-600">Sanjay Patil / Rahul Sharma</td>
                    <td className="p-3 font-mono text-emerald-600 font-black">₹150</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Approved</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: My ASMs & Coordinators */}
        {activeTab === 'asms' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#01295A]">Assigned ASMs & Downstream Coordinators</h3>
              <p className="text-xs text-slate-500 font-medium">View performance and downstream network assigned to your franchise.</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="font-black text-sm text-[#01295A]">Sanjay Patil (ASM 001)</h4>
                      <span className="text-[10px] text-slate-400 font-mono">5% Commission Tier | 45 Admissions</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">Active</span>
                </div>

                <div className="pl-6 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Downstream Coordinators (20% Tier):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                      Rahul Sharma <span className="text-[10px] text-slate-400 block font-normal">24 Admissions</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                      Priya Deshmukh <span className="text-[10px] text-slate-400 block font-normal">21 Admissions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Commission History */}
        {activeTab === 'commissions' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#01295A]">Franchisee Commission History</h3>
              <p className="text-xs text-slate-500 font-medium">Immutable record of automatic 15% commission credits generated from hierarchy admissions.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">Admission ID</th>
                    <th className="p-3">Admission Amount</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Commission Credit</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  <tr>
                    <td className="p-3 font-mono font-black text-[#01295A]">TOPIQ-ADM-001</td>
                    <td className="p-3 font-mono">₹1,000</td>
                    <td className="p-3">15%</td>
                    <td className="p-3 text-emerald-600 font-black">+₹150</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Credited</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-black text-[#01295A]">TOPIQ-ADM-002</td>
                    <td className="p-3 font-mono">₹2,000</td>
                    <td className="p-3">15%</td>
                    <td className="p-3 text-emerald-600 font-black">+₹300</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Credited</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-black text-[#01295A]">TOPIQ-ADM-003</td>
                    <td className="p-3 font-mono">₹1,500</td>
                    <td className="p-3">15%</td>
                    <td className="p-3 text-amber-600 font-black">+₹225</td>
                    <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}