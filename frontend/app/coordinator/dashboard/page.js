'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Wallet, FileText, RefreshCw, LogOut, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';

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
      totalCommission: 0,
      availableWallet: 0,
      pendingSettlement: 0,
      settledAmount: 0
    },
    admissions: []
  });

  // Filters for Coordinator Admissions
  const [filterDate, setFilterDate] = useState('');
  const [filterAdmStatus, setFilterAdmStatus] = useState('all');
  const [filterPayStatus, setFilterPayStatus] = useState('all');

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

  const filteredAdmissions = (coordData.admissions || []).filter(adm => {
    const matchesDate = !filterDate || (adm.createdAt && adm.createdAt.startsWith(filterDate));
    const matchesAdmStatus = filterAdmStatus === 'all' || adm.admissionStatus === filterAdmStatus;
    const matchesPayStatus = filterPayStatus === 'all' || adm.paymentStatus === filterPayStatus;
    return matchesDate && matchesAdmStatus && matchesPayStatus;
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
            <p className="text-xs text-slate-500 font-medium mt-0.5">Track daily admissions, performance analytics, and automated 20% commission earnings.</p>
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

        {/* Coordinator Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Total Admissions</div>
            <div className="text-2xl font-black text-[#01295A]">{coordData.metrics.totalAdmissions}</div>
            <div className="text-[11px] text-slate-500 font-medium">Today: <strong className="text-emerald-600">+{coordData.metrics.todaysAdmissions}</strong> | Monthly: <strong className="text-[#01295A]">{coordData.metrics.monthlyAdmissions}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Commission Earned (20%)</div>
            <div className="text-2xl font-black text-emerald-600 font-mono">₹{coordData.metrics.totalCommission.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Automated 20% share credited</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Wallet Balance</div>
            <div className="text-2xl font-black text-[#FE7C02] font-mono">₹{coordData.metrics.availableWallet.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Ready for payout withdrawal</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Settlements</div>
            <div className="text-xl font-black text-[#01295A] font-mono">₹{coordData.metrics.pendingSettlement.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Settled: <strong className="text-emerald-600">₹{coordData.metrics.settledAmount.toLocaleString('en-IN')}</strong></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setActiveTab('overview')} className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${activeTab === 'overview' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
            Performance Overview
          </button>
          <button onClick={() => setActiveTab('admissions')} className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${activeTab === 'admissions' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
            My Admissions & Tracking
          </button>
        </div>

        {/* Tab 1: Performance Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Performance Analytics</h2>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Daily Conversion Rate</span>
                  <span className="text-xs font-black text-emerald-600 font-mono">92.4%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Total Revenue Generated</span>
                  <span className="text-xs font-black text-[#01295A] font-mono">₹{(coordData.metrics.totalAdmissions * 1000).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Commission Tier</span>
                  <span className="text-xs font-black text-purple-600 font-mono">20% Share</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Recent Daily Activity</h2>
              <div className="space-y-2">
                {coordData.admissions.slice(0, 5).map((adm, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-[#01295A]">{adm.studentName}</strong>
                      <span className="text-slate-400 block text-[10px]">{new Date(adm.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">+₹{(adm.admissionAmount || 1000) * 0.20}</span>
                  </div>
                ))}
                {coordData.admissions.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No admission activity recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Admission Management & Tracking */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">My Admissions Tracking</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Filter your daily admissions by Date, Admission Status, and Payment Status.</p>
              </div>
              <span className="px-3 py-1.5 bg-slate-100 text-[#01295A] text-xs font-bold rounded-xl">Filtered Admissions: {filteredAdmissions.length}</span>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Date</label>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-xs font-semibold bg-white" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Admission Status</label>
                <select value={filterAdmStatus} onChange={e => setFilterAdmStatus(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Payment Status</label>
                <select value={filterPayStatus} onChange={e => setFilterPayStatus(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Exam</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">20% Commission</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAdmissions.map((adm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-black text-[#01295A]">{adm.admissionId || adm._id.slice(-6)}</td>
                      <td className="py-3.5 px-4 font-bold">{adm.studentName}</td>
                      <td className="py-3.5 px-4">{adm.examName || 'TOPIQ Talent Test'}</td>
                      <td className="py-3.5 px-4 font-mono">₹{adm.admissionAmount || 1000}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">+₹{(adm.admissionAmount || 1000) * 0.20}</td>
                      <td className="py-3.5 px-4"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[10px] font-bold">{adm.admissionStatus || 'Confirmed'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAdmissions.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs">
                  No admissions found matching your criteria.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}