'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, Wallet, ShieldCheck, ArrowUpRight, Layers, RefreshCw, LogOut, FileText, DollarSign } from 'lucide-react';

export default function FranchiseDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [leaderboard, setLeaderboard] = useState([]);
  const [agents, setAgents] = useState([]);
  const [scope, setScope] = useState('franchise');
  const [loading, setLoading] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Franchisee & Downstream Hierarchy State
  const [franchiseData, setFranchiseData] = useState({
    name: 'Shreya Enterprises',
    metrics: { admissionsCount: 248, availableBalance: 41250, pendingSettlement: 12400 },
    asms: [
      { name: 'Sanjay Patil', tier: '5%', coordinators: ['Rahul Sharma', 'Priya Deshmukh'] }
    ],
    commissions: [
      { admissionId: 'TOPIQ-ADM-001', amount: 1000, percentage: '15%', credit: 150, status: 'Credited' },
      { admissionId: 'TOPIQ-ADM-002', amount: 2000, percentage: '15%', credit: 300, status: 'Credited' },
      { admissionId: 'TOPIQ-ADM-003', amount: 1500, percentage: '15%', credit: 225, status: 'Pending' }
    ]
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'franchise', 'franchise_owner'].includes(role)) {
      router.push('/login');
      return;
    }
    fetchLeaderboard(scope);
    fetchAgents();
    fetchFranchiseMetrics();
  }, [scope, router]);

  const fetchFranchiseMetrics = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/franchise/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFranchiseData(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Error fetching franchise metrics:', err);
    }
  };

  const fetchLeaderboard = async (selectedScope) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiBaseUrl}/api/leaderboard?scope=${selectedScope}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiBaseUrl}/api/agents/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAgents(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    const token = localStorage.getItem('token');
    const franchiseId = localStorage.getItem('franchiseId');

    try {
      const response = await fetch(`${apiBaseUrl}/api/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...studentForm,
          targetRole: 'student',
          franchiseId: franchiseId || null
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to enroll student.');

      setSuccessMsg(`Student ${studentForm.name} enrolled successfully!`);
      setStudentForm({ name: '', email: '', password: '' });
      fetchFranchiseMetrics();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#FE7C02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Franchise & Commission Portal</span>
              <span className="text-xs text-slate-400 font-medium">15% Tier Active</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{franchiseData.name} — Operations Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage downstream ASMs, Coordinators, automatic 15% franchise commissions, and wallet settlements.</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-xs px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black uppercase tracking-wider">Downstream Admissions</span>
              <Users className="w-5 h-5 text-[#FE7C02]" />
            </div>
            <div className="text-3xl font-black">{franchiseData.metrics.admissionsCount}</div>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">+12% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black uppercase tracking-wider">Total 15% Franchise Earnings</span>
              <Wallet className="w-5 h-5 text-[#FE7C02]" />
            </div>
            <div className="text-3xl font-black font-mono">₹{franchiseData.metrics.availableBalance.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-400 font-medium">Auto-credited upon payment success</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black uppercase tracking-wider">10-Day Wallet Settlement</span>
              <Building2 className="w-5 h-5 text-[#FE7C02]" />
            </div>
            <div className="text-3xl font-black font-mono">₹{franchiseData.metrics.pendingSettlement.toLocaleString('en-IN')}</div>
            <p className="text-xs text-[#FE7C02] font-bold">Processing for next payout</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'leaderboard' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Rankings & Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'agents' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Downstream ASMs & Team
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'commissions' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Commission History
          </button>
          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'admissions' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Offline Student Admissions
          </button>
        </div>

        {/* Tab Content: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Performance Leaderboard</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Scope:</span>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:outline-none focus:border-[#FE7C02] cursor-pointer text-[#01295A]"
                >
                  <option value="franchise">Franchise-wise</option>
                  <option value="city">City-wise</option>
                  <option value="district">District-wise</option>
                  <option value="state">Maharashtra-wide</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-xs font-bold text-slate-500 text-center py-10">Loading leaderboard...</p>
            ) : leaderboard.length === 0 ? (
              <p className="text-xs font-bold text-slate-500 text-center py-10">No ranking records found for this scope yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-slate-500 font-black border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Correct / Wrong</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {leaderboard.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-black text-[#01295A]">#{item.rank || idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-[#01295A]">{item.student?.name || item.name}</td>
                        <td className="py-3.5 px-4 font-black text-emerald-600">{item.score} Marks</td>
                        <td className="py-3.5 px-4 font-bold">{item.accuracy ? `${item.accuracy}%` : 'N/A'}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-bold">{item.correctCount !== undefined ? `${item.correctCount} / ${item.wrongCount}` : 'Detailed view'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Downstream ASMs & Team */}
        {activeTab === 'agents' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">My Assigned ASMs & Downstream Coordinators</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Inspect performance and hierarchical network under your franchise.</p>
            </div>

            <div className="space-y-4">
              {franchiseData.asms.map((asm, idx) => (
                <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <div>
                        <h4 className="font-black text-sm text-[#01295A]">{asm.name} (ASM)</h4>
                        <span className="text-[10px] text-slate-400 font-mono">5% Commission Tier</span>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">Active</span>
                  </div>

                  <div className="pl-6 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Downstream Coordinators (20% Tier):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {asm.coordinators.map((coord, cIdx) => (
                        <div key={cIdx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                          {coord} <span className="text-[10px] text-slate-400 block font-normal">Active Coordinator Node</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Commission History */}
        {activeTab === 'commissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Franchisee Commission History</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Immutable record of automatic 15% commission credits generated from hierarchy admissions.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-500 font-black border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4">Admission Amount</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Commission Credit</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {franchiseData.commissions.map((comm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-black text-[#01295A]">{comm.admissionId}</td>
                      <td className="py-3.5 px-4 font-mono">₹{comm.amount}</td>
                      <td className="py-3.5 px-4">{comm.percentage}</td>
                      <td className={`py-3.5 px-4 font-mono font-black ${comm.status === 'Credited' ? 'text-emerald-600' : 'text-amber-600'}`}>+₹{comm.credit}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${comm.status === 'Credited' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {comm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Offline Admissions */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-xl">
            <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider mb-2">Enroll Local Student</h2>
            <p className="text-xs text-slate-500 font-medium mb-6">Create secure portal credentials for offline student enrollments under your franchise.</p>

            {successMsg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">{successMsg}</div>}
            {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200">{errorMsg}</div>}

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="Enter student name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="Enter student email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Temporary Password *</label>
                <input
                  type="password"
                  required
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  placeholder="Set initial password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] transition font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FE7C02] hover:bg-[#e06d02] text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg mt-2"
              >
                Enroll Student Account
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}