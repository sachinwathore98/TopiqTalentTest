'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Wallet, FileText, RefreshCw, LogOut, CheckCircle2, Plus, X, ArrowDownRight, Search } from 'lucide-react';

export default function CoordinatorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [coordData, setCoordData] = useState({
    name: 'Coordinator Partner',
    metrics: {
      totalAdmissions: 0,
      todaysAdmissions: 0,
      monthlyAdmissions: 0,
      pendingAdmissions: 0,
      completedAdmissions: 0,
      cancelledAdmissions: 0,
      examWise: {},
      totalCommission: 0,
      availableWallet: 0,
      pendingSettlement: 0,
      settledAmount: 0
    },
    admissions: []
  });

  // Admission Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [admForm, setAdmForm] = useState({
    studentName: '', mobile: '', email: '', studentClass: '', school: '',
    parentDetails: '', address: '', examName: 'TOPIQ Talent Test', admissionAmount: 1000, paymentMethod: 'Online'
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'asm', 'coordinator'].includes(role)) {
      router.push('/login');
      return;
    }
    fetchCoordinatorDashboard();
    const interval = setInterval(() => fetchCoordinatorDashboard(true), 15000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchCoordinatorDashboard = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/coordinator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCoordData(data);
      }
    } catch (err) {
      console.error('Error fetching coordinator dashboard:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleCreateAdmission = async (e) => {
    e.preventDefault();
    setSuccessMsg(''); setErrorMsg('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/coordinator/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(admForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create admission.');
      
      setSuccessMsg(`Admission successfully created! ID: ${data.admission.admissionId}`);
      setShowCreateModal(false);
      setAdmForm({
        studentName: '', mobile: '', email: '', studentClass: '', school: '',
        parentDetails: '', address: '', examName: 'TOPIQ Talent Test', admissionAmount: 1000, paymentMethod: 'Online'
      });
      fetchCoordinatorDashboard();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const filteredAdmissions = (coordData.admissions || []).filter(adm => {
    const matchesSearch = !searchQuery || 
      (adm.studentName && adm.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (adm.admissionId && adm.admissionId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || adm.admissionStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Coordinator Panel (20% Commission Tier)</span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync Active
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{coordData.name} — Coordinator Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage exam admissions, automated 20% commission wallets, and live student tracking.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchCoordinatorDashboard()} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="text-xs px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer flex items-center gap-1.5">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {successMsg && <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>{successMsg}</div>}
        {errorMsg && <div className="p-4 bg-rose-50 text-rose-800 text-xs font-bold rounded-2xl border border-rose-200">{errorMsg}</div>}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Total Admissions</div>
            <div className="text-2xl font-black text-[#01295A]">{coordData.metrics.totalAdmissions}</div>
            <div className="text-[11px] text-slate-500 font-medium">Today: <strong className="text-emerald-600">+{coordData.metrics.todaysAdmissions}</strong> | Monthly: <strong className="text-[#01295A]">{coordData.metrics.monthlyAdmissions}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black uppercase text-slate-400">Wallet Balance (20%)</div>
              <button onClick={() => alert('Withdrawal request submitted successfully.')} className="px-2.5 py-1 bg-[#FE7C02] text-white text-[9px] font-black rounded-lg uppercase tracking-wider hover:bg-[#e06d02] cursor-pointer shadow-sm flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3" /> Withdraw
              </button>
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">₹{coordData.metrics.availableWallet.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Earned Commission: <strong className="text-[#01295A]">₹{coordData.metrics.totalCommission.toLocaleString('en-IN')}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Status Breakdown</div>
            <div className="text-xs font-bold text-slate-700 space-y-0.5 mt-1">
              <div>Completed: <strong className="text-emerald-600">{coordData.metrics.completedAdmissions}</strong></div>
              <div>Pending: <strong className="text-[#FE7C02]">{coordData.metrics.pendingAdmissions}</strong></div>
              <div>Cancelled: <strong className="text-rose-600">{coordData.metrics.cancelledAdmissions}</strong></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Settlements</div>
            <div className="text-2xl font-black text-[#FE7C02] font-mono">₹{coordData.metrics.pendingSettlement.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Settled: <strong className="text-emerald-600">₹{coordData.metrics.settledAmount.toLocaleString('en-IN')}</strong></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-3">
            <button onClick={() => setActiveTab('overview')} className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${activeTab === 'overview' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
              Exam & Admission Overview
            </button>
            <button onClick={() => setActiveTab('admissions')} className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${activeTab === 'admissions' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
              Admission History & Tracking
            </button>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 bg-[#FE7C02] hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Create New Admission
          </button>
        </div>

        {/* Tab 1: Overview & Exam-wise Admissions */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Exam-wise Admission Distribution</h2>
              <div className="space-y-3">
                {Object.entries(coordData.metrics.examWise || {}).map(([exam, count], idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">{exam}</span>
                    <span className="text-xs font-black text-indigo-600 font-mono">{count} Admissions</span>
                  </div>
                ))}
                {Object.keys(coordData.metrics.examWise || {}).length === 0 && (
                  <p className="text-xs text-slate-400 italic">No exam admission records yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Commission Engine Summary</h2>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Commission Rate</span>
                  <span className="text-xs font-black text-purple-600 font-mono">20% Automated Share</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Total Wallet Credits</span>
                  <span className="text-xs font-black text-emerald-600 font-mono">₹{coordData.metrics.totalCommission}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Hierarchy Scope</span>
                  <span className="text-xs font-black text-[#01295A] font-mono">Isolated to Coordinator Node</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Admission History & Tracking */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Admission Records & History</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Review student admissions, payment status, exam titles, and 20% commission ledger.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search student or ID..." className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs bg-white" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Exam</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Commission (20%)</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAdmissions.map((adm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-black text-[#01295A]">{adm.admissionId}</td>
                      <td className="py-3.5 px-4 font-bold">{adm.studentName}</td>
                      <td className="py-3.5 px-4">{adm.examName}</td>
                      <td className="py-3.5 px-4 font-mono">₹{adm.admissionAmount}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">+₹{adm.coordinatorCommission || adm.admissionAmount * 0.20}</td>
                      <td className="py-3.5 px-4"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">{adm.paymentStatus}</span></td>
                      <td className="py-3.5 px-4"><span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded text-[10px] font-bold">{adm.admissionStatus}</span></td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(adm.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAdmissions.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs">
                  No admission records found.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Create Admission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4 my-8">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-[#01295A]">Create Exam Admission</h3>
            <form onSubmit={handleCreateAdmission} className="space-y-3">
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Student Full Name *</label><input type="text" required value={admForm.studentName} onChange={e => setAdmForm({ ...admForm, studentName: e.target.value })} placeholder="Student name" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Mobile Number *</label><input type="text" required value={admForm.mobile} onChange={e => setAdmForm({ ...admForm, mobile: e.target.value })} placeholder="Mobile" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label><input type="email" required value={admForm.email} onChange={e => setAdmForm({ ...admForm, email: e.target.value })} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Class / Grade *</label><input type="text" required value={admForm.studentClass} onChange={e => setAdmForm({ ...admForm, studentClass: e.target.value })} placeholder="Class" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Exam / Test Name *</label><input type="text" required value={admForm.examName} onChange={e => setAdmForm({ ...admForm, examName: e.target.value })} placeholder="Exam Name" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              </div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">School Name</label><input type="text" value={admForm.school} onChange={e => setAdmForm({ ...admForm, school: e.target.value })} placeholder="School" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Parent / Guardian Details</label><input type="text" value={admForm.parentDetails} onChange={e => setAdmForm({ ...admForm, parentDetails: e.target.value })} placeholder="Parent name & phone" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Admission Amount (₹) *</label><input type="number" required value={admForm.admissionAmount} onChange={e => setAdmForm({ ...admForm, admissionAmount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Payment Method *</label><select value={admForm.paymentMethod} onChange={e => setAdmForm({ ...admForm, paymentMethod: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-bold"><option value="Online">Online / UPI</option><option value="Cash">Cash</option><option value="Bank Transfer">Bank Transfer</option></select></div>
              </div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2">Confirm & Generate Admission ID</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}