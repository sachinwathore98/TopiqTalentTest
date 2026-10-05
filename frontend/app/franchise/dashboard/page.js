'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, Wallet, RefreshCw, LogOut, FileText, Trash2 } from 'lucide-react';

export default function FranchiseDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [franchiseData, setFranchiseData] = useState({
    name: 'Shreya Enterprises',
    metrics: {
      myAdmissions: 0,
      todaysAdmissions: 0,
      monthlyAdmissions: 0,
      myCommission: 0,
      availableWallet: 0,
      pendingSettlement: 0,
      settledAmount: 0
    },
    asms: [],
    coordinators: [],
    commissions: []
  });

  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', targetRole: 'asm', phone: '', asmId: '' });

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'franchise', 'franchise_owner'].includes(role)) {
      router.push('/login');
      return;
    }
    fetchFranchiseDashboardData();
  }, [router]);

  const fetchFranchiseDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiBaseUrl}/api/franchise/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFranchiseData(data);
      }
    } catch (err) {
      console.error('Error fetching franchise dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDownstreamUser = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/franchise/provision-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(userForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create user.');

      setSuccessMsg(`Successfully created ${userForm.targetRole.toUpperCase()}: ${userForm.name}`);
      setUserForm({ name: '', email: '', password: '', targetRole: 'asm', phone: '', asmId: '' });
      fetchFranchiseDashboardData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/franchise/members/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Team member removed successfully.');
        fetchFranchiseDashboardData();
      }
    } catch (err) {
      setErrorMsg('Error removing user.');
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
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{franchiseData.name} — Franchise Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage downstream ASMs, Coordinators, automatic 15% franchise commissions, and wallet settlements.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchFranchiseDashboardData} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer" title="Refresh Live Data">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { localStorage.clear(); router.push('/login'); }}
              className="text-xs px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">My Admissions</div>
            <div className="text-2xl font-black text-[#01295A]">{franchiseData.metrics.myAdmissions}</div>
            <div className="text-[11px] text-slate-500 font-medium">Today: <strong className="text-emerald-600">+{franchiseData.metrics.todaysAdmissions}</strong> | Monthly: <strong className="text-[#01295A]">{franchiseData.metrics.monthlyAdmissions}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">My Commission & Wallet</div>
            <div className="text-2xl font-black text-emerald-600 font-mono">₹{franchiseData.metrics.availableWallet.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">15% automated share credited</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Settlements</div>
            <div className="text-2xl font-black text-[#FE7C02] font-mono">₹{franchiseData.metrics.pendingSettlement.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Settled: <strong className="text-emerald-600">₹{franchiseData.metrics.settledAmount.toLocaleString('en-IN')}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Hierarchy Team</div>
            <div className="text-xl font-black text-[#01295A]">{franchiseData.asms.length} ASMs | {franchiseData.coordinators.length} Coordinators</div>
            <div className="text-[11px] text-slate-500 font-medium">Active downstream network</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'overview' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            My ASM & Coordinators
          </button>
          <button
            onClick={() => setActiveTab('team-management')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'team-management' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Create / Manage Team
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'commissions' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Commission History
          </button>
        </div>

        {/* Tab Content: My ASM & Coordinators */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">My Assigned ASMs</h2>
              {franchiseData.asms.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium">No ASMs assigned to this franchise yet.</p>
              ) : (
                <div className="space-y-3">
                  {franchiseData.asms.map((asm, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-[#01295A]">{asm.name} ({asm.email})</h4>
                        <span className="text-[10px] text-slate-400 font-mono">5% Commission Tier</span>
                      </div>
                      <button onClick={() => handleDeleteUser(asm._id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">My Coordinators</h2>
              {franchiseData.coordinators.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium">No coordinators registered under your hierarchy yet.</p>
              ) : (
                <div className="space-y-3">
                  {franchiseData.coordinators.map((coord, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-[#01295A]">{coord.name} ({coord.email})</h4>
                        <span className="text-[10px] text-slate-400 font-mono">20% Commission Tier</span>
                      </div>
                      <button onClick={() => handleDeleteUser(coord._id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Create / Manage Team */}
        {activeTab === 'team-management' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-xl">
            <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider mb-2">Provision Downstream User</h2>
            <p className="text-xs text-slate-500 font-medium mb-6">Create secure login credentials for an ASM or Coordinator under your franchise hierarchy.</p>

            {successMsg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">{successMsg}</div>}
            {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200">{errorMsg}</div>}

            <form onSubmit={handleCreateDownstreamUser} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Password *</label>
                <input
                  type="password"
                  required
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="Set password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Role Tier *</label>
                <select
                  value={userForm.targetRole}
                  onChange={(e) => setUserForm({ ...userForm, targetRole: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] font-bold"
                >
                  <option value="asm">ASM (5% Split)</option>
                  <option value="coordinator">Coordinator (20% Split)</option>
                </select>
              </div>

              {userForm.targetRole === 'coordinator' && (
                <div>
                  <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Assign ASM *</label>
                  <select
                    required
                    value={userForm.asmId}
                    onChange={(e) => setUserForm({ ...userForm, asmId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] font-bold"
                  >
                    <option value="">Select ASM</option>
                    {franchiseData.asms.map(a => (
                      <option key={a._id} value={a._id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FE7C02] hover:bg-[#e06d02] text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg mt-2"
              >
                Create Team Member
              </button>
            </form>
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
                    <th className="py-3 px-4">Admission</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">%</th>
                    <th className="py-3 px-4">Commission</th>
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

      </div>
    </div>
  );
}