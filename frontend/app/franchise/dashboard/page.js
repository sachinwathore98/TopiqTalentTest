'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, Wallet, RefreshCw, LogOut, FileText, Trash2, Edit3, X, CheckCircle2, ArrowDownRight, Search, Filter } from 'lucide-react';

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
    asmHierarchy: [],
    asms: [],
    coordinators: [],
    commissions: []
  });

  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', targetRole: 'asm', phone: '', asmId: '' });
  
  // Edit, Withdrawal & Admission Filter State
  const [editingUser, setEditingUser] = useState(null);
  const [userEditForm, setUserEditForm] = useState({ name: '', email: '', phone: '', status: 'active' });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', ifsc: '', accountHolder: '' });

  // Admission Filter States
  const [searchStudent, setSearchStudent] = useState('');
  const [filterASM, setFilterASM] = useState('all');
  const [filterCoordinator, setFilterCoordinator] = useState('all');

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

    const interval = setInterval(() => fetchFranchiseDashboardData(true), 15000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchFranchiseDashboardData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
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
      if (!isBackground) setLoading(false);
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

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/franchise/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount), bankDetails })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        fetchFranchiseDashboardData();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error processing withdrawal request.');
    }
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setUserEditForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', status: user.status || 'active' });
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(userEditForm)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Team member updated successfully!');
        setEditingUser(null);
        fetchFranchiseDashboardData();
      }
    } catch (err) {
      setErrorMsg('Error updating user.');
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

  // Flatten all admissions across the hierarchy for advanced tracking & filtering
  const allFlattenedAdmissions = (franchiseData.asmHierarchy || []).flatMap(asm => {
    const asmAdmissions = (asm.coordinators || []).flatMap(coord => 
      (coord.admissions || []).map(adm => ({ ...adm, asmName: asm.name, asmId: asm._id, coordinatorName: coord.name, coordinatorId: coord._id }))
    );
    const directAsmAdmissions = (asm.directAdmissions || []).map(adm => ({ ...adm, asmName: asm.name, asmId: asm._id, coordinatorName: 'Direct ASM', coordinatorId: 'none' }));
    return [...asmAdmissions, ...directAsmAdmissions];
  });

  const filteredAdmissions = allFlattenedAdmissions.filter(adm => {
    const matchesSearch = searchStudent === '' || 
      (adm.studentName && adm.studentName.toLowerCase().includes(searchStudent.toLowerCase())) ||
      (adm.admissionId && adm.admissionId.toLowerCase().includes(searchStudent.toLowerCase()));
    
    const matchesASM = filterASM === 'all' || adm.asmId === filterASM;
    const matchesCoord = filterCoordinator === 'all' || adm.coordinatorId === filterCoordinator;

    return matchesSearch && matchesASM && matchesCoord;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#FE7C02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Franchise & Commission Portal</span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync Active
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{franchiseData.name} — Franchise Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage downstream ASMs, Coordinators, live admission tracking, and wallet payouts.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchFranchiseDashboardData()} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold" title="Refresh Live Data">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={() => { localStorage.clear(); router.push('/login'); }}
              className="text-xs px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {successMsg && <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>{successMsg}</div>}
        {errorMsg && <div className="p-4 bg-red-50 text-red-800 text-xs font-bold rounded-2xl border border-red-200">{errorMsg}</div>}

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">My Admissions</div>
            <div className="text-2xl font-black text-[#01295A]">{franchiseData.metrics.myAdmissions}</div>
            <div className="text-[11px] text-slate-500 font-medium">Today: <strong className="text-emerald-600">+{franchiseData.metrics.todaysAdmissions}</strong> | Monthly: <strong className="text-[#01295A]">{franchiseData.metrics.monthlyAdmissions}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black uppercase text-slate-400">Wallet Balance (15%)</div>
              <button 
                onClick={() => setShowWithdrawModal(true)}
                className="px-2.5 py-1 bg-[#FE7C02] text-white text-[9px] font-black rounded-lg uppercase tracking-wider hover:bg-[#e06d02] cursor-pointer shadow-sm flex items-center gap-1"
              >
                <ArrowDownRight className="w-3 h-3" /> Withdraw
              </button>
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">₹{franchiseData.metrics.availableWallet.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Live automated share credited</div>
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
            My ASM & Coordinators Tree
          </button>
          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'admissions' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Admission Management & Tracking
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
            Hierarchical Commission History
          </button>
        </div>

        {/* Tab 1: ASM & Coordinators Tree View */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Downstream Hierarchy & Admissions Tree</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Regional ASM list with their respective admissions, coordinators, and coordinator admission totals.</p>
            </div>

            <div className="space-y-6">
              {(franchiseData.asmHierarchy || []).map((asm, idx) => (
                <div key={asm._id || idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
                    <div>
                      <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase px-2.5 py-1 rounded-full">ASM Tier (5% Share)</span>
                      <h3 className="text-base font-black text-[#01295A] mt-1">{asm.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">{asm.email} | Phone: {asm.phone || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Admissions</span>
                        <span className="text-lg font-black text-[#FE7C02] font-mono">{asm.totalAdmissions || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2">
                        <button onClick={() => handleOpenEditUser(asm)} className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer inline-flex items-center gap-1">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => handleDeleteUser(asm._id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Coordinators under ASM */}
                  <div className="pl-0 sm:pl-6 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Coordinators under {asm.name} ({asm.coordinators?.length || 0})</h4>
                    
                    {asm.coordinators?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">No coordinators registered under this ASM yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {asm.coordinators.map((coord) => (
                          <div key={coord._id} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
                            <div>
                              <span className="bg-purple-100 text-purple-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Coordinator (20% Share)</span>
                              <h5 className="font-black text-xs text-[#01295A] mt-1">{coord.name}</h5>
                              <p className="text-[10px] text-slate-400 font-mono">{coord.email} | Phone: {coord.phone || 'N/A'}</p>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="text-right">
                                <span className="text-[9px] font-bold uppercase text-slate-400 block">Admissions</span>
                                <span className="text-sm font-black text-emerald-600 font-mono">{coord.admissionsCount || 0}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => handleOpenEditUser(coord)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer">Edit</button>
                                <button onClick={() => handleDeleteUser(coord._id)} className="p-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(!franchiseData.asmHierarchy || franchiseData.asmHierarchy.length === 0) && (
                <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs">
                  No downstream hierarchy found. Create an ASM to start building your network tree.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Admission Management & Tracking with Filters */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Live Admission Management & Tracking</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Filter live admissions dynamically by ASM, Coordinator, and Student Name/ID.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-slate-100 text-[#01295A] text-xs font-bold rounded-xl">
                  Total Results: {filteredAdmissions.length}
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Search Student / Admission ID</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    value={searchStudent} 
                    onChange={e => setSearchStudent(e.target.value)} 
                    placeholder="Search by student name or ID..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-semibold bg-white focus:outline-none focus:border-[#FE7C02]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Filter by ASM</label>
                <select 
                  value={filterASM} 
                  onChange={e => { setFilterASM(e.target.value); setFilterCoordinator('all'); }} 
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold bg-white focus:outline-none focus:border-[#FE7C02]"
                >
                  <option value="all">All ASMs</option>
                  {(franchiseData.asmHierarchy || []).map(asm => (
                    <option key={asm._id} value={asm._id}>{asm.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Filter by Coordinator</label>
                <select 
                  value={filterCoordinator} 
                  onChange={e => setFilterCoordinator(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold bg-white focus:outline-none focus:border-[#FE7C02]"
                >
                  <option value="all">All Coordinators</option>
                  {(franchiseData.asmHierarchy || [])
                    .filter(asm => filterASM === 'all' || asm._id === filterASM)
                    .flatMap(asm => asm.coordinators || [])
                    .map(coord => (
                      <option key={coord._id} value={coord._id}>{coord.name}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* Admissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">ASM Node</th>
                    <th className="py-3 px-4">Coordinator Node</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">15% Commission</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAdmissions.map((adm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-black text-[#01295A]">{adm.admissionId || adm._id?.slice(-6)}</td>
                      <td className="py-3.5 px-4 font-bold">{adm.studentName || 'Student'}</td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-600">{adm.asmName}</td>
                      <td className="py-3.5 px-4 font-semibold text-purple-600">{adm.coordinatorName}</td>
                      <td className="py-3.5 px-4 font-mono">₹{adm.admissionAmount || 1000}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">+₹{(adm.admissionAmount || 1000) * 0.15}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[10px] font-bold">
                          {adm.admissionStatus || 'Credited'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAdmissions.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs">
                  No admissions found matching the selected filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Create / Manage Team */}
        {activeTab === 'team-management' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-xl">
            <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider mb-2">Provision Downstream User</h2>
            <p className="text-xs text-slate-500 font-medium mb-6">Create secure login credentials for an ASM or Coordinator under your franchise hierarchy.</p>

            <form onSubmit={handleCreateDownstreamUser} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Full Name *</label>
                <input type="text" required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Enter full name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A]" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Email Address *</label>
                <input type="email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="Enter email address" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A]" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Password *</label>
                <input type="password" required value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="Set password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A]" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Role Tier *</label>
                <select value={userForm.targetRole} onChange={(e) => setUserForm({ ...userForm, targetRole: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] font-bold">
                  <option value="asm">ASM (5% Split)</option>
                  <option value="coordinator">Coordinator (20% Split)</option>
                </select>
              </div>

              {userForm.targetRole === 'coordinator' && (
                <div>
                  <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Assign ASM *</label>
                  <select required value={userForm.asmId} onChange={(e) => setUserForm({ ...userForm, asmId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] font-bold">
                    <option value="">Select ASM</option>
                    {franchiseData.asms.map(a => (<option key={a._id} value={a._id}>{a.name}</option>))}
                  </select>
                </div>
              )}

              <button type="submit" className="w-full py-3.5 bg-[#FE7C02] hover:bg-[#e06d02] text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg mt-2">
                Create Team Member
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Hierarchical Commission History Tree */}
        {activeTab === 'commissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Hierarchical Commission History</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Detailed admission breakdown grouped by ASM and Coordinator with automatic 15% franchise commission credits.</p>
            </div>

            <div className="space-y-6">
              {(franchiseData.asmHierarchy || []).map((asm, idx) => (
                <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">ASM: {asm.name}</span>
                      <h4 className="font-black text-xs text-[#01295A] mt-1">Total ASM Admissions: {asm.totalAdmissions}</h4>
                    </div>
                    <span className="text-xs font-black text-emerald-600 font-mono">Commission Share: ₹{asm.totalCommission || 0}</span>
                  </div>

                  {/* Coordinator lists & their admissions */}
                  <div className="space-y-3 pl-0 sm:pl-4">
                    {asm.coordinators?.map((coord) => (
                      <div key={coord._id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="bg-purple-100 text-purple-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Coordinator: {coord.name}</span>
                            <h5 className="font-black text-xs text-[#01295A] mt-1">Total Admissions: {coord.admissionsCount || 0}</h5>
                          </div>
                          <span className="text-xs font-black text-emerald-600 font-mono">Total Commission: ₹{coord.totalCommission || 0}</span>
                        </div>

                        {coord.admissions?.length > 0 && (
                          <div className="overflow-x-auto pt-2">
                            <table className="w-full text-left text-xs text-slate-700">
                              <thead className="bg-slate-50 uppercase text-slate-400 font-black text-[10px]">
                                <tr>
                                  <th className="p-2">Admission ID</th>
                                  <th className="p-2">Student Name</th>
                                  <th className="p-2">Amount</th>
                                  <th className="p-2">Franchise %</th>
                                  <th className="p-2">Commission Credit</th>
                                  <th className="p-2">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y font-medium">
                                {coord.admissions.map((adm, i) => (
                                  <tr key={i}>
                                    <td className="p-2 font-mono font-black">{adm.admissionId || adm._id.slice(-6)}</td>
                                    <td className="p-2 font-bold">{adm.studentName}</td>
                                    <td className="p-2 font-mono">₹{adm.admissionAmount || 1000}</td>
                                    <td className="p-2 font-bold text-indigo-600">15%</td>
                                    <td className="p-2 font-mono font-black text-emerald-600">+₹{(adm.admissionAmount || 1000) * 0.15}</td>
                                    <td className="p-2"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold">Credited</span></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!asm.coordinators || asm.coordinators.length === 0) && (
                      <p className="text-xs text-slate-400 italic">No coordinators under this ASM.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bank Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-[#01295A]">Withdraw Wallet Funds</h3>
            <p className="text-xs text-slate-500">Available Wallet Balance: <strong className="text-emerald-600 font-mono text-sm">₹{franchiseData.metrics.availableWallet}</strong></p>

            <form onSubmit={handleWithdrawalRequest} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Withdrawal Amount (₹) *</label>
                <input type="number" required max={franchiseData.metrics.availableWallet} value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Enter amount" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Account Holder Name *</label>
                <input type="text" required value={bankDetails.accountHolder} onChange={e => setBankDetails({ ...bankDetails, accountHolder: e.target.value })} placeholder="Account holder name" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Bank Account Number *</label>
                <input type="text" required value={bankDetails.accountNumber} onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} placeholder="Account number" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">IFSC Code *</label>
                <input type="text" required value={bankDetails.ifsc} onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value.toUpperCase() })} placeholder="IFSC code" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 font-mono" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2">
                Submit Payout Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setEditingUser(null)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black">Edit Team Member</h3>
            <form onSubmit={handleSaveUserEdit} className="space-y-4">
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label><input type="text" required value={userEditForm.name} onChange={e => setUserEditForm({ ...userEditForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label><input type="email" required value={userEditForm.email} onChange={e => setUserEditForm({ ...userEditForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Phone Number</label><input type="text" value={userEditForm.phone} onChange={e => setUserEditForm({ ...userEditForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Status *</label><select value={userEditForm.status} onChange={e => setUserEditForm({ ...userEditForm, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-bold uppercase"><option value="active">Active</option><option value="deactivated">Deactivated</option></select></div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}