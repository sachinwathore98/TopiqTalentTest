'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Wallet, FileText, RefreshCw, LogOut, CheckCircle2, Search, Filter, Calendar } from 'lucide-react';

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
      totalCommission: 25000,
      availableWallet: 18500,
      pendingSettlement: 6500,
      settledAmount: 12000
    },
    coordinators: [],
    admissions: []
  });

  const [filterCoord, setFilterCoord] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterAdmStatus, setFilterAdmStatus] = useState('all');
  const [filterPayStatus, setFilterPayStatus] = useState('all');
  const [filterExam, setFilterExam] = useState('all');

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

  const filteredAdmissions = (asmData.admissions || []).filter(adm => {
    const matchesCoord = filterCoord === 'all' || adm.coordinatorId === filterCoord;
    const matchesDate = !filterDate || (adm.createdAt && adm.createdAt.startsWith(filterDate));
    const matchesAdmStatus = filterAdmStatus === 'all' || adm.admissionStatus === filterAdmStatus;
    const matchesPayStatus = filterPayStatus === 'all' || adm.paymentStatus === filterPayStatus;
    const matchesExam = filterExam === 'all' || adm.examName === filterExam;
    return matchesCoord && matchesDate && matchesAdmStatus && matchesPayStatus && matchesExam;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">ASM Panel (5% Commission Tier)</span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync Active
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{asmData.name} — ASM Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage assigned coordinators, track downstream admissions, and monitor 5% automated wallet earnings.</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Total Admissions</div>
            <div className="text-2xl font-black text-[#01295A]">{asmData.metrics.totalAdmissions}</div>
            <div className="text-[11px] text-slate-500 font-medium">Today: <strong className="text-emerald-600">+{asmData.metrics.todaysAdmissions}</strong> | Monthly: <strong className="text-[#01295A]">{asmData.metrics.monthlyAdmissions}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Coordinators Assigned</div>
            <div className="text-2xl font-black text-indigo-600">{asmData.metrics.coordinatorsCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Active downstream network</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Wallet Balance (5%)</div>
            <div className="text-2xl font-black text-emerald-600 font-mono">₹{asmData.metrics.availableWallet.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Earned: <strong className="text-[#01295A]">₹{asmData.metrics.totalCommission.toLocaleString('en-IN')}</strong></div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-400">Settlements</div>
            <div className="text-2xl font-black text-[#FE7C02] font-mono">₹{asmData.metrics.pendingSettlement.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-medium">Settled: <strong className="text-emerald-600">₹{asmData.metrics.settledAmount.toLocaleString('en-IN')}</strong></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setActiveTab('overview')} className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${activeTab === 'overview' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
            Coordinators Management
          </button>
          <button onClick={() => setActiveTab('admissions')} className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${activeTab === 'admissions' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
            Admission Management & Filters
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">ASM → Coordinators Hierarchy & Performance</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Review assigned coordinators, admission performance, and active status.</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase bg-indigo-200 text-indigo-900 px-2.5 py-0.5 rounded-full">ASM Root Node</span>
                  <h3 className="text-sm font-black text-[#01295A] mt-1">{asmData.name}</h3>
                </div>
                <span className="text-xs font-bold text-indigo-700 font-mono">{asmData.coordinators.length} Coordinators Reporting</span>
              </div>

              <div className="pl-0 sm:pl-6 space-y-3 border-l-2 border-indigo-200 ml-3">
                {asmData.coordinators.map((coord, idx) => (
                  <div key={coord._id || idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="bg-purple-100 text-purple-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Coordinator</span>
                        <h4 className="font-black text-xs text-[#01295A] mt-1">{coord.name} ({coord.email})</h4>
                        <p className="text-[10px] text-slate-400 font-mono">Phone: {coord.phone || 'N/A'} | Status: <strong className="text-emerald-600">{coord.status || 'Active'}</strong></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Admissions Done</span>
                        <span className="text-base font-black text-emerald-600 font-mono">{coord.admissionsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {asmData.coordinators.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-4">No coordinators assigned to this ASM yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">ASM → Coordinator → Admission Tracking</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Filter admissions dynamically by Coordinator, Date, Admission Status, Payment Status, and Exam.</p>
              </div>
              <span className="px-3 py-1.5 bg-slate-100 text-[#01295A] text-xs font-bold rounded-xl">Filtered Admissions: {filteredAdmissions.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Coordinator</label>
                <select value={filterCoord} onChange={e => setFilterCoord(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Coordinators</option>
                  {asmData.coordinators.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Date</label>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-white" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Admission Status</label>
                <select value={filterAdmStatus} onChange={e => setFilterAdmStatus(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Payment Status</label>
                <select value={filterPayStatus} onChange={e => setFilterPayStatus(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Exam</label>
                <select value={filterExam} onChange={e => setFilterExam(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white">
                  <option value="all">All Exams</option>
                  <option value="TOPIQ Talent Test">TOPIQ Talent Test</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Coordinator</th>
                    <th className="py-3 px-4">Exam</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">ASM 5% Commission</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAdmissions.map((adm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-black text-[#01295A]">{adm.admissionId || adm._id.slice(-6)}</td>
                      <td className="py-3.5 px-4 font-bold">{adm.studentName}</td>
                      <td className="py-3.5 px-4 font-semibold text-purple-600">{adm.coordinatorName}</td>
                      <td className="py-3.5 px-4">{adm.examName || 'TOPIQ Talent Test'}</td>
                      <td className="py-3.5 px-4 font-mono">₹{adm.admissionAmount || 1000}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">+₹{(adm.admissionAmount || 1000) * 0.05}</td>
                      <td className="py-3.5 px-4"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[10px] font-bold">{adm.admissionStatus || 'Confirmed'}</span></td>
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

      </div>
    </div>
  );
}