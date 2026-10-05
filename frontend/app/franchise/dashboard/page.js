'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, Wallet, ShieldCheck, ArrowUpRight, Layers } from 'lucide-react';

export default function FranchiseDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboard, setLeaderboard] = useState([]);
  const [agents, setAgents] = useState([]);
  const [scope, setScope] = useState('franchise');
  const [loading, setLoading] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'franchise_owner'].includes(role)) {
      router.push('/login');
      return;
    }
    fetchLeaderboard(scope);
    fetchAgents();
  }, [scope, router]);

  const fetchLeaderboard = async (selectedScope) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leaderboard?scope=${selectedScope}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/agents/list`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/create`, {
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
            <h1 className="text-xl md:text-2xl font-black tracking-tight">Franchise & Agent Operations Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage local student enrollments, 15% franchise commissions, downstream coordinator performance, and wallet settlements[cite: 9].</p>
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
            <div className="text-3xl font-black">248</div>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">+12% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black uppercase tracking-wider">Total 15% Franchise Earnings</span>
              <Wallet className="w-5 h-5 text-[#FE7C02]" />
            </div>
            <div className="text-3xl font-black">₹41,250</div>
            <p className="text-xs text-slate-400 font-medium">Auto-credited upon payment success</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black uppercase tracking-wider">10-Day Wallet Settlement</span>
              <Building2 className="w-5 h-5 text-[#FE7C02]" />
            </div>
            <div className="text-3xl font-black">₹12,400</div>
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
            Agent Partners (20% Incentive)
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

        {/* Tab Content: Agent Partners */}
        {activeTab === 'agents' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Enrolled Agent Partners & Employee Promoters</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Track agent performance and calculate commission payouts for successful regional registrations.</p>
            </div>

            {agents.length === 0 ? (
              <p className="text-xs font-bold text-slate-500 text-center py-10">No agents enrolled through the website yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-slate-500 font-black border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Agent Name</th>
                      <th className="py-3 px-4">Mobile / Email</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Role Type</th>
                      <th className="py-3 px-4">Incentive Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {agents.map((ag, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-black text-[#01295A]">{ag.owner_name}</td>
                        <td className="py-3.5 px-4 font-bold">{ag.phone} <br/><span className="text-[10px] text-slate-400 font-medium">{ag.email}</span></td>
                        <td className="py-3.5 px-4 font-bold">{ag.city}, {ag.district}</td>
                        <td className="py-3.5 px-4"><span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">{ag.agent_role_type || 'Agent'}</span></td>
                        <td className="py-3.5 px-4 font-black text-[#FE7C02]">Active Commission Tier</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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