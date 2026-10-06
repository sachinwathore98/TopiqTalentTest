'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Wallet, RefreshCw, LogOut, CheckCircle2, Search, Plus, Edit3, Trash2, X, ArrowDownRight, Calendar } from 'lucide-react';

export default function ASMDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [asmData, setAsmData] = useState({
    name: 'ASM Partner',
    metrics: {
      totalAdmissions: 0,
      todaysAdmissions: 0,
      monthlyAdmissions: 0,
      coordinatorsCount: 0,
      totalRevenue: 0,
      totalCommission: 0,
      availableWallet: 0,
      pendingSettlement: 0,
      settledAmount: 0
    },
    coordinators: [],
    admissions: []
  });

  // Coordinator Modal & Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCoord, setNewCoord] = useState({ name: '', email: '', password: '', phone: '' });
  const [editingCoord, setEditingCoord] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', status: 'active' });

  // Withdrawal Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', ifsc: '', accountHolder: '' });

  // Filters & Date Range
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCoord, setFilterCoord] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // all, today, month, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filterAdmStatus, setFilterAdmStatus] = useState('all');

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'asm'].includes(role)) {
      router.push('/login');
      return;
    }
    fetchASMDashboard();
    const interval = setInterval(() => fetchASMDashboard(true), 15000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchASMDashboard = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/asm/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAsmData(data);
      }
    } catch (err) {
      console.error('Error fetching ASM dashboard:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleCreateCoordinator = async (e) => {
    e.preventDefault();
    setSuccessMsg(''); setErrorMsg('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/asm/coordinators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCoord)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create coordinator.');
      setSuccessMsg('Coordinator created successfully!');
      setShowCreateModal(false);
      setNewCoord({ name: '', email: '', password: '', phone: '' });
      fetchASMDashboard();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleUpdateCoordinator = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/asm/coordinators/${editingCoord._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Coordinator updated successfully!');
        setEditingCoord(null);
        fetchASMDashboard();
      }
    } catch (err) {
      setErrorMsg('Error updating coordinator.');
    }
  };

  const handleDeleteCoordinator = async (coordId) => {
    if (!confirm('Are you sure you want to delete this coordinator?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/asm/coordinators/${coordId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Coordinator deleted successfully.');
        fetchASMDashboard();
      }
    } catch (err) {
      setErrorMsg('Error deleting coordinator.');
    }
  };

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/asm/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount), bankDetails })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        fetchASMDashboard();
      }
    } catch (err) {
      setErrorMsg('Error processing withdrawal.');
    }
  };

  // Filter admissions by search, coordinator, and date range (Day, Month, Year, Custom)
  const filteredAdmissions = (asmData.admissions || []).filter(adm => {
    const matchesSearch = !searchQuery || 
      (adm.studentName && adm.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (adm.admissionId && adm.admissionId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCoord = filterCoord === 'all' || adm.coordinatorId === filterCoord;
    const matchesAdmStatus = filterAdmStatus === 'all' || adm.admissionStatus === filterAdmStatus;

    let matchesDate = true;
    const admDate = adm.createdAt ? new Date(adm.createdAt) : new Date();
    const today = new Date();

    if (dateRangeFilter === 'today') {
      matchesDate = admDate.toDateString() === today.toDateString();
    } else if (dateRangeFilter === 'month') {
      matchesDate = admDate.getMonth() === today.getMonth() && admDate.getFullYear() === today.getFullYear();
    } else if (dateRangeFilter === 'custom' && customStartDate && customEndDate) {
      matchesDate = admDate >= new Date(customStartDate) && admDate <= new Date(customEndDate);
    }

    return matchesSearch && matchesCoord && matchesAdmStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">ASM Panel (5% Commission Tier)</span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync Active
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{asmData.name} — ASM Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage downstream coordinators, track revenue generation, and monitor 5% automated wallet earnings.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchASMDashboard()} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="text-xs px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer flex items-center gap-1.5">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {successMsg && <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>{successMsg}</div>}
        {errorMsg && <div className="p-4 bg-rose-50 text-rose-800 text-xs font-bold rounded-2xl border border-rose-200">{errorMsg}</div>}

        {/* Metrics Grid including Total Revenue & Wallet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Total Revenue Generated</div>
            <div className="text-2xl font-black text-[#01295A] font-mono">₹{asmData.metrics.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Admissions: <strong className="text-emerald-600">{asmData.metrics.totalAdmissions}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black uppercase text-slate-400">Wallet Balance (5%)</div>
              <button onClick={() => setShowWithdrawModal(true)} className="px-2.5 py-1 bg-[#FE7C02] text-white text-[9px] font-black rounded-lg uppercase tracking-wider hover:bg-[#e06d02] cursor-pointer shadow-sm flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3" /> Withdraw
              </button>
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">₹{asmData.metrics.availableWallet.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Earned Commission: <strong className="text-[#01295A]">₹{asmData.metrics.totalCommission.toLocaleString('en-IN')}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Coordinators Assigned</div>
            <div className="text-2xl font-black text-indigo-600">{asmData.metrics.coordinatorsCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Active downstream network</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Settlements</div>
            <div className="text-2xl font-black text-[#FE7C02] font-mono">₹{asmData.metrics.pendingSettlement.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Settled: <strong className="text-emerald-600">₹{asmData.metrics.settledAmount.toLocaleString('en-IN')}</strong></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setActiveTab('overview')} className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${activeTab === 'overview' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
            Coordinators Management & Creation
          </button>
          <button onClick={() => setActiveTab('admissions')} className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${activeTab === 'admissions' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
            Admission Revenue & Filters
          </button>
        </div>

        {/* Tab 1: Coordinators Management & Provisioning */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Coordinators Management & Performance</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Create, edit, activate/deactivate coordinators and track individual earnings (20% share).</p>
              </div>
              <button onClick={() => setShowCreateModal(true)} className="px-4 py-2.5 bg-[#FE7C02] hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Create Coordinator
              </button>
            </div>

            <div className="space-y-4">
              {asmData.coordinators.map((coord) => (
                <div key={coord._id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Coordinator (20% Share)</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${coord.status === 'deactivated' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {coord.status || 'Active'}
                      </span>
                    </div>
                    <h4 className="font-black text-xs text-[#01295A] mt-1">{coord.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{coord.email} | Phone: {coord.phone || 'N/A'}</p>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Admissions / Earnings</span>
                      <span className="text-sm font-black text-emerald-600 font-mono">{coord.admissionsCount || 0} Adm | ₹{coord.coordinatorCommission || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setEditingCoord(coord); setEditForm({ name: coord.name, email: coord.email, phone: coord.phone || '', status: coord.status || 'active' }); }} className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteCoordinator(coord._id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {asmData.coordinators.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs">
                  No coordinators assigned. Click 'Create Coordinator' to add team members.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Admission Revenue & Period Filters */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Admission Revenue Tracking & Custom Filtering</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Filter by Day, Month, Year, Custom Date range, Coordinator, and Student search.</p>
              </div>
              <span className="px-3 py-1.5 bg-slate-100 text-[#01295A] text-xs font-bold rounded-xl">Filtered Admissions: {filteredAdmissions.length}</span>
            </div>

            {/* Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Search Student / ID</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search student..." className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Coordinator Filter</label>
                <select value={filterCoord} onChange={e => setFilterCoord(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Coordinators</option>
                  {asmData.coordinators.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Date Period</label>
                <select value={dateRangeFilter} onChange={e => setDateRangeFilter(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              {dateRangeFilter === 'custom' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Start Date</label>
                    <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">End Date</label>
                    <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs bg-white" />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Status</label>
                  <select value={filterAdmStatus} onChange={e => setFilterAdmStatus(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white">
                    <option value="all">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              )}
            </div>

            {/* Admissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Coordinator</th>
                    <th className="py-3 px-4">Revenue Amount</th>
                    <th className="py-3 px-4">ASM 5% Commission</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAdmissions.map((adm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-black text-[#01295A]">{adm.admissionId || adm._id.slice(-6)}</td>
                      <td className="py-3.5 px-4 font-bold">{adm.studentName}</td>
                      <td className="py-3.5 px-4 font-semibold text-purple-600">{adm.coordinatorName}</td>
                      <td className="py-3.5 px-4 font-mono font-bold">₹{adm.admissionAmount || 1000}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">+₹{(adm.admissionAmount || 1000) * 0.05}</td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(adm.createdAt || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAdmissions.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs">
                  No admission records found matching filters.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Create Coordinator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-[#01295A]">Create Coordinator</h3>
            <form onSubmit={handleCreateCoordinator} className="space-y-3">
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label><input type="text" required value={newCoord.name} onChange={e => setNewCoord({ ...newCoord, name: e.target.value })} placeholder="Coordinator name" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label><input type="email" required value={newCoord.email} onChange={e => setNewCoord({ ...newCoord, email: e.target.value })} placeholder="Email address" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Password *</label><input type="password" required value={newCoord.password} onChange={e => setNewCoord({ ...newCoord, password: e.target.value })} placeholder="Password" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Phone Number</label><input type="text" value={newCoord.phone} onChange={e => setNewCoord({ ...newCoord, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2">Provision Coordinator</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coordinator Modal */}
      {editingCoord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setEditingCoord(null)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-[#01295A]">Edit Coordinator</h3>
            <form onSubmit={handleUpdateCoordinator} className="space-y-3">
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label><input type="text" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email *</label><input type="email" required value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Phone</label><input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Status *</label><select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-bold uppercase"><option value="active">Active</option><option value="deactivated">Deactivated</option></select></div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Bank Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-[#01295A]">Withdraw Wallet Funds (5%)</h3>
            <p className="text-xs text-slate-500">Available Wallet Balance: <strong className="text-emerald-600 font-mono text-sm">₹{asmData.metrics.availableWallet}</strong></p>

            <form onSubmit={handleWithdrawalRequest} className="space-y-3">
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Withdrawal Amount (₹) *</label><input type="number" required max={asmData.metrics.availableWallet} value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Amount" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Account Holder Name *</label><input type="text" required value={bankDetails.accountHolder} onChange={e => setBankDetails({ ...bankDetails, accountHolder: e.target.value })} placeholder="Holder name" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Bank Account Number *</label><input type="text" required value={bankDetails.accountNumber} onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} placeholder="Account number" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">IFSC Code *</label><input type="text" required value={bankDetails.ifsc} onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value.toUpperCase() })} placeholder="IFSC" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2">Submit Payout Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}