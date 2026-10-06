'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Wallet, FileText, RefreshCw, LogOut, CheckCircle2, Plus, X, ArrowDownRight, Search, Edit3 } from 'lucide-react';

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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [editForm, setEditForm] = useState({ studentName: '', mobile: '', email: '', studentClass: '', admissionStatus: 'Confirmed', paymentStatus: 'Paid' });

  const [liveClassRates, setLiveClassRates] = useState([
    { class: 'Class 3', fee: 1799 },
    { class: 'Class 4', fee: 1799 },
    { class: 'Class 5', fee: 1799 },
    { class: 'Class 6', fee: 1999 },
    { class: 'Class 7', fee: 1999 },
    { class: 'Class 8', fee: 1999 },
    { class: 'Class 9', fee: 2499 },
    { class: 'Class 10', fee: 2499 },
    { class: 'Class 11', fee: 2999 },
    { class: 'Class 12', fee: 2999 },
    { class: 'Competitive / Above 12', fee: 3499 }
  ]);

  const [upstreamList, setUpstreamList] = useState({ franchises: [], asms: [] });

  const [admForm, setAdmForm] = useState({
    studentName: '', mobile: '', email: '', studentClass: 'Class 8', school: '',
    parentDetails: '', address: '', examName: 'TOPIQ Talent Test', admissionAmount: 1999, paymentMethod: 'Online',
    franchiseId: '', asmId: ''
  });

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
    fetchLiveFeeMatrix();
    fetchUpstreamHierarchy();

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

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

  const fetchLiveFeeMatrix = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/fee-matrix`);
      const data = await res.json();
      if (data.success && data.matrix) {
        setLiveClassRates(data.matrix);
      }
    } catch (err) {
      console.error('Error fetching live fee matrix:', err);
    }
  };

  const fetchUpstreamHierarchy = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/coordinator/hierarchy`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUpstreamList({ franchises: data.franchises || [], asms: data.asms || [] });
      }
    } catch (err) {
      console.error('Error fetching upstream hierarchy:', err);
    }
  };

  const handleClassChange = (selectedClass) => {
    const found = liveClassRates.find(r => r.class === selectedClass);
    const fee = found ? found.fee : 1999;
    setAdmForm({
      ...admForm,
      studentClass: selectedClass,
      admissionAmount: fee
    });
  };

  const handleSaveEditAdmission = async (e) => {
    e.preventDefault();
    setSuccessMsg(''); setErrorMsg('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/coordinator/admissions/${editingAdmission._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update admission.');

      setSuccessMsg('Admission record updated successfully!');
      setEditingAdmission(null);
      fetchCoordinatorDashboard();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setSuccessMsg(''); setErrorMsg('');
    const token = localStorage.getItem('token');

    try {
      const orderRes = await fetch(`${apiBaseUrl}/api/coordinator/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ admissionAmount: admForm.admissionAmount })
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error('Failed to initiate payment gateway order.');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkeyid',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'TOPIQ Talent Test (TTT)',
        description: `Exam Registration for ${admForm.studentClass} (${admForm.examName})`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${apiBaseUrl}/api/coordinator/verify-admission`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                ...admForm,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.message || 'Payment verified but admission creation failed.');

            setSuccessMsg(`Payment Confirmed! Admission ID: ${verifyData.admission.admissionId} created & upstream wallets credited.`);
            setShowCreateModal(false);
            setAdmForm({
              studentName: '', mobile: '', email: '', studentClass: 'Class 8', school: '',
              parentDetails: '', address: '', examName: 'TOPIQ Talent Test', admissionAmount: 1999, paymentMethod: 'Online',
              franchiseId: '', asmId: ''
            });
            fetchCoordinatorDashboard();
          } catch (verifyErr) {
            setErrorMsg(verifyErr.message);
          }
        },
        prefill: {
          name: admForm.studentName,
          email: admForm.email,
          contact: admForm.mobile
        },
        theme: {
          color: '#FE7C02'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrorMsg(err.message || 'Error processing payment checkout.');
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
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Razorpay Live Payment Gateway Active
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{coordData.name} — Coordinator Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Razorpay checkout integration with automatic upstream commission distribution upon payment confirmation.</p>
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
              CRM Admission History & Tracking
            </button>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 bg-[#FE7C02] hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Register Student & Pay via Razorpay
          </button>
        </div>

        {/* Tab 1: Exam & Admission Overview */}
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
                  <p className="text-xs text-slate-400 italic">No exam admission records registered yet.</p>
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

        {/* Tab 2: Admission History & Tracking with Edit Option */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">CRM Admission Records & Ledger</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Review student admissions, class levels, payment statuses, and edit records if necessary.</p>
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
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Exam</th>
                    <th className="py-3 px-4">Fee Amount</th>
                    <th className="py-3 px-4">Commission (20%)</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAdmissions.map((adm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-black text-[#01295A]">{adm.admissionId}</td>
                      <td className="py-3.5 px-4 font-bold">{adm.studentName}</td>
                      <td className="py-3.5 px-4">{adm.studentClass}</td>
                      <td className="py-3.5 px-4">{adm.examName}</td>
                      <td className="py-3.5 px-4 font-mono">₹{adm.admissionAmount}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">+₹{adm.coordinatorCommission || adm.admissionAmount * 0.20}</td>
                      <td className="py-3.5 px-4"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">{adm.paymentStatus}</span></td>
                      <td className="py-3.5 px-4"><span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded text-[10px] font-bold">{adm.admissionStatus}</span></td>
                      <td className="py-3.5 px-4 text-right">
                        <button onClick={() => { setEditingAdmission(adm); setEditForm({ studentName: adm.studentName, mobile: adm.mobile, email: adm.email, studentClass: adm.studentClass, admissionStatus: adm.admissionStatus || 'Confirmed', paymentStatus: adm.paymentStatus || 'Paid' }); }} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer inline-flex items-center gap-1">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </td>
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

      {/* Edit Admission Modal */}
      {editingAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setEditingAdmission(null)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-[#01295A]">Edit Admission Record</h3>
            <form onSubmit={handleSaveEditAdmission} className="space-y-3">
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Student Name *</label><input type="text" required value={editForm.studentName} onChange={e => setEditForm({ ...editForm, studentName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Mobile *</label><input type="text" required value={editForm.mobile} onChange={e => setEditForm({ ...editForm, mobile: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Class *</label><input type="text" required value={editForm.studentClass} onChange={e => setEditForm({ ...editForm, studentClass: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Admission Status *</label><select value={editForm.admissionStatus} onChange={e => setEditForm({ ...editForm, admissionStatus: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold bg-slate-50"><option value="Confirmed">Confirmed</option><option value="Pending">Pending</option><option value="Cancelled">Cancelled</option></select></div>
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Payment Status *</label><select value={editForm.paymentStatus} onChange={e => setEditForm({ ...editForm, paymentStatus: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold bg-slate-50"><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option><option value="Refunded">Refunded</option></select></div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Razorpay Checkout Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative shadow-2xl space-y-4 my-8">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <div className="flex justify-between items-center bg-orange-50 px-4 py-2.5 rounded-2xl border border-orange-200">
              <span className="text-[10px] font-black text-[#FE7C02] uppercase tracking-wider">Razorpay Live Gateway & Upstream Sync</span>
              <span className="text-xs font-black text-emerald-600 font-mono">Fee: ₹{admForm.admissionAmount}</span>
            </div>
            
            <form onSubmit={handleRazorpayPayment} className="space-y-3">
              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Student Full Name *</label><input type="text" required value={admForm.studentName} onChange={e => setAdmForm({ ...admForm, studentName: e.target.value })} placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Mobile Number *</label><input type="text" required value={admForm.mobile} onChange={e => setAdmForm({ ...admForm, mobile: e.target.value })} placeholder="Mobile Number" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label><input type="email" required value={admForm.email} onChange={e => setAdmForm({ ...admForm, email: e.target.value })} placeholder="Email Address" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Class / Grade (Live Rates) *</label>
                  <select value={admForm.studentClass} onChange={e => handleClassChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold bg-slate-50">
                    {liveClassRates.map((r, i) => (
                      <option key={i} value={r.class}>{r.class} (₹{r.fee})</option>
                    ))}
                  </select>
                </div>
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Exam / Test Name *</label><input type="text" required value={admForm.examName} onChange={e => setAdmForm({ ...admForm, examName: e.target.value })} placeholder="TOPIQ Talent Test" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Attach Upstream Franchisee</label>
                  <select value={admForm.franchiseId} onChange={e => setAdmForm({ ...admForm, franchiseId: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50">
                    <option value="">Auto-resolve from hierarchy</option>
                    {upstreamList.franchises.map(f => (<option key={f._id} value={f._id}>{f.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Attach Upstream ASM</label>
                  <select value={admForm.asmId} onChange={e => setAdmForm({ ...admForm, asmId: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50">
                    <option value="">Auto-resolve from hierarchy</option>
                    {upstreamList.asms.map(a => (<option key={a._id} value={a._id}>{a.name}</option>))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">School Name</label><input type="text" value={admForm.school} onChange={e => setAdmForm({ ...admForm, school: e.target.value })} placeholder="School Name" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
                <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Parent / Guardian Details</label><input type="text" value={admForm.parentDetails} onChange={e => setAdmForm({ ...admForm, parentDetails: e.target.value })} placeholder="Parent Name & Phone" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
              </div>

              <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Student Address</label><input type="text" value={admForm.address} onChange={e => setAdmForm({ ...admForm, address: e.target.value })} placeholder="Complete Address" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-0.5">Synced Admission Fee</label>
                  <span className="text-base font-black text-emerald-600 font-mono">₹{admForm.admissionAmount}</span>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Payment Method *</label>
                  <select value={admForm.paymentMethod} onChange={e => setAdmForm({ ...admForm, paymentMethod: e.target.value })} className="w-full px-3 py-1.5 rounded-xl border text-xs font-bold bg-white">
                    <option value="Online">Razorpay Online Gateway</option>
                    <option value="Cash">Cash (Offline Entry)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2 hover:bg-orange-600 transition flex items-center justify-center gap-2">
                Proceed to Razorpay Payment & Upstream Commission Sync
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}