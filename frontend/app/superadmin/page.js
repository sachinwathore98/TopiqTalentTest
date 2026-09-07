'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Users, DollarSign, Award, Layers, Megaphone, FileText, 
  CheckCircle2, XCircle, Edit3, PlusCircle, RefreshCw, AlertTriangle, Building, Phone, UserPlus, LogOut, Save 
} from 'lucide-react';

export default function SuperAdminCommandCenter() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('fees');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalAdmissions: 0,
    activePartnersCount: 0,
    pendingEnquiriesCount: 0,
    breakdown: { revenueByFranchise: {}, revenueByASM: {}, revenueByAgent: {} }
  });

  const [feesMap, setFeesMap] = useState({});
  const [banners, setBanners] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  const classesList = [
    'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 
    'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 
    '12th & Above (Competitive)', 'Govt & Professional Exams'
  ];

  // Form states for individual class editing
  const [editableFees, setEditableFees] = useState({});
  const [bannerForm, setBannerForm] = useState({ title: '', imageUrl: '', targetLink: '', position: 'hero' });
  const [provisionForm, setProvisionForm] = useState({ name: '', email: '', password: '', targetRole: 'franchise', gstNumber: '' });
  const [message, setMessage] = useState(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || (role !== 'super_admin' && role !== 'admin')) {
      router.push('/login');
      return;
    }
    fetchAllDashboardData();
  }, [router]);

  const fetchAllDashboardData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [mRes, fRes, bRes, uRes, eRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/superadmin/metrics`, { headers }).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/fees`).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/banners`).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/users-directory`, { headers }).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/enquiries`, { headers }).then(r => r.json())
      ]);

      if (mRes.success) setMetrics(mRes.metrics);
      
      if (fRes.success) {
        const map = {};
        const editMap = {};
        fRes.fees.forEach(f => {
          map[f.className] = f.testFee;
          editMap[f.className] = f.testFee;
        });
        setFeesMap(map);
        // Default unconfigured classes to 1100
        classesList.forEach(c => {
          if (!editMap[c]) editMap[c] = 1100;
        });
        setEditableFees(editMap);
      } else {
        const defaultMap = {};
        classesList.forEach(c => defaultMap[c] = 1100);
        setEditableFees(defaultMap);
      }

      if (bRes.success) setBanners(bRes.banners);
      if (uRes.success) setUsersList(uRes.users);
      if (eRes.success) setEnquiries(eRes.enquiries);

    } catch (err) {
      console.error('Error loading superadmin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeeChange = (className, value) => {
    setEditableFees({ ...editableFees, [className]: Number(value) });
  };

  const handleSaveSingleFee = async (className) => {
    const token = localStorage.getItem('token');
    const testFee = editableFees[className];
    const res = await fetch(`${apiBaseUrl}/api/superadmin/fees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ className, testFee, passingMarks: 40, totalMarks: 100 })
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: 'success', text: `Fee for ${className} successfully updated to ₹${testFee}!` });
      fetchAllDashboardData();
    } else {
      setMessage({ type: 'error', text: data.message });
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiBaseUrl}/api/superadmin/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(bannerForm)
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: 'success', text: data.message });
      setBannerForm({ title: '', imageUrl: '', targetLink: '', position: 'hero' });
      fetchAllDashboardData();
    }
  };

  const handleProvisionUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiBaseUrl}/api/superadmin/provision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(provisionForm)
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: 'success', text: data.message });
      setProvisionForm({ name: '', email: '', password: '', targetRole: 'franchise', gstNumber: '' });
      fetchAllDashboardData();
    } else {
      setMessage({ type: 'error', text: data.message });
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const token = localStorage.getItem('token');
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    await fetch(`${apiBaseUrl}/api/superadmin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    fetchAllDashboardData();
  };

  const handleUpdateEnquiryStatus = async (enquiryId, status) => {
    const token = localStorage.getItem('token');
    await fetch(`${apiBaseUrl}/api/superadmin/enquiries/${enquiryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchAllDashboardData();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-[#01295A] pb-12">
      {/* HEADER BAR */}
      <div className="bg-[#01295A] text-white px-6 py-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
            Superadmin Command Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">TOPIQ Talent Ecosystem</h1>
          <p className="text-xs text-slate-300">Dream11-grade revenue distribution, dynamic live pricing, and partner management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAllDashboardData} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer" title="Refresh Data">
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

      {/* NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-md border border-slate-200">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: ShieldCheck },
            { id: 'fees', label: 'Test Fees Control', icon: DollarSign },
            { id: 'banners', label: 'Banners & Offers', icon: Megaphone },
            { id: 'hierarchy', label: 'Hierarchy & Users', icon: Users },
            { id: 'enquiries', label: 'Website Leads & Enquiries', icon: FileText },
            { id: 'provision', label: 'Provision Account', icon: UserPlus },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
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

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {message && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. OVERVIEW & METRICS TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Total Ecosystem Revenue</div>
                <div className="text-3xl font-black text-emerald-600 font-mono">₹{metrics.totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-500 font-semibold">From {metrics.totalAdmissions} student registrations</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Active Commission Partners</div>
                <div className="text-3xl font-black text-[#FE7C02]">{metrics.activePartnersCount}</div>
                <div className="text-xs text-slate-500 font-semibold">ASM, Franchise & Agents active</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Pending Enquiries</div>
                <div className="text-3xl font-black text-rose-600">{metrics.pendingEnquiriesCount}</div>
                <div className="text-xs text-slate-500 font-semibold">Requires immediate follow-up</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-slate-400">Total Students Enrolled</div>
                <div className="text-3xl font-black text-[#01295A]">{metrics.totalAdmissions}</div>
                <div className="text-xs text-emerald-600 font-semibold">Live verified database</div>
              </div>
            </div>

            {/* GRANULAR REVENUE SPLIT BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-3">
                <h3 className="text-sm font-black text-[#01295A] uppercase border-b pb-2">Revenue by Franchise</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {Object.entries(metrics.breakdown.revenueByFranchise).map(([id, amt], idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-600 font-mono">ID: {id.slice(-6)}</span>
                      <span className="text-emerald-600 font-mono">₹{amt}</span>
                    </div>
                  ))}
                  {Object.keys(metrics.breakdown.revenueByFranchise).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No franchise admissions logged yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-3">
                <h3 className="text-sm font-black text-[#01295A] uppercase border-b pb-2">Revenue by ASM</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {Object.entries(metrics.breakdown.revenueByASM).map(([id, amt], idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-600 font-mono">ID: {id.slice(-6)}</span>
                      <span className="text-emerald-600 font-mono">₹{amt}</span>
                    </div>
                  ))}
                  {Object.keys(metrics.breakdown.revenueByASM).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No ASM admissions logged yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-3">
                <h3 className="text-sm font-black text-[#01295A] uppercase border-b pb-2">Revenue by Agent</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {Object.entries(metrics.breakdown.revenueByAgent).map(([id, amt], idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-600 font-mono">ID: {id.slice(-6)}</span>
                      <span className="text-emerald-600 font-mono">₹{amt}</span>
                    </div>
                  ))}
                  {Object.keys(metrics.breakdown.revenueByAgent).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No Agent admissions logged yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TEST FEES CONTROL TAB (INDIVIDUAL CLASS PRICING MATRIX) */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">Independent Test Fee Matrix Per Class & Category</h3>
                <p className="text-xs text-slate-500 font-semibold">Configure separate pricing for each class/category. Changes sync live instantly with the public registration portal.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classesList.map((className) => (
                <div key={className} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xs text-[#01295A] bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                      {className}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      Current: ₹{feesMap[className] || 1100}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-500">Edit Price (₹)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={editableFees[className] ?? 1100} 
                        onChange={(e) => handleFeeChange(className, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-[#FE7C02] outline-none"
                      />
                      <button 
                        onClick={() => handleSaveSingleFee(className)}
                        className="bg-[#FE7C02] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-sm flex items-center gap-1 shrink-0"
                        title="Save & Sync Price Live"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. BANNERS & OFFERS TAB */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-xl">
              <h3 className="text-base font-black text-[#01295A] mb-4">Add Promotional Banner / Festive Offer</h3>
              <form onSubmit={handleAddBanner} className="space-y-3">
                <input 
                  type="text" placeholder="Banner Title / Offer Name" required 
                  value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50"
                />
                <input 
                  type="url" placeholder="Image URL (Cloudinary / Direct Link)" required 
                  value={bannerForm.imageUrl} onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50"
                />
                <select 
                  value={bannerForm.position} onChange={e => setBannerForm({ ...bannerForm, position: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 cursor-pointer"
                >
                  <option value="hero">Hero Slider</option>
                  <option value="festive_offer">Festive Offer Banner</option>
                  <option value="popup">Pop-up Announcement</option>
                </select>
                <button type="submit" className="w-full py-3 bg-[#01295A] text-white font-black rounded-xl text-xs cursor-pointer">Publish Banner Live</button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {banners.map(b => (
                <div key={b._id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-2">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-32 object-cover rounded-xl" />
                  <div className="font-black text-xs text-[#01295A]">{b.title}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Position: {b.position}</div>
                  <button onClick={() => fetch(`${apiBaseUrl}/api/superadmin/banners/${b._id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(fetchAllDashboardData)} className="w-full py-1.5 bg-rose-50 text-rose-700 font-bold rounded-xl text-[10px] cursor-pointer">Delete Banner</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. HIERARCHY & USERS TAB */}
        {activeTab === 'hierarchy' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-black text-[#01295A]">Ecosystem Users & Hierarchy Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-[10px] font-black uppercase text-slate-400">
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">GST Number</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs font-semibold text-slate-700">
                  {usersList.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-black text-[#01295A]">{u.name}</td>
                      <td className="py-3 px-3 font-mono">{u.email}</td>
                      <td className="py-3 px-3 uppercase text-[10px] font-black bg-slate-100 rounded px-2">{u.role}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{u.gstNumber || 'N/A'}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${u.status === 'deactivated' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button 
                          onClick={() => handleToggleUserStatus(u._id, u.status || 'active')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer ${u.status === 'deactivated' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
                        >
                          {u.status === 'deactivated' ? 'Activate' : 'Deactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. WEBSITE LEADS & ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-black text-[#01295A]">Live Website & Partnership Enquiries</h3>
            <div className="space-y-3">
              {enquiries.map(enq => (
                <div key={enq._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#01295A]">{enq.fullName || enq.name}</span>
                      <span className="text-[10px] font-black bg-orange-100 text-[#FE7C02] px-2 py-0.5 rounded uppercase">{enq.enquiryType || enq.type || 'General'}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">Phone: {enq.phone} | Email: {enq.email} | City: {enq.city || 'N/A'}</div>
                    <div className="text-xs text-slate-700">{enq.message}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={enq.status || 'Pending'} 
                      onChange={e => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border text-xs font-bold bg-white cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Follow-up Required">Follow-up Required</option>
                      <option value="Approved">Approved</option>
                      <option value="Denied">Denied</option>
                    </select>
                  </div>
                </div>
              ))}
              {enquiries.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No enquiries registered.</p>}
            </div>
          </div>
        )}

        {/* 6. PROVISION HIERARCHICAL ACCOUNT TAB */}
        {activeTab === 'provision' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-xl">
            <h3 className="text-base font-black text-[#01295A] mb-1">Provision Hierarchical Account</h3>
            <p className="text-xs text-slate-500 font-semibold mb-4">Create secure login credentials for ASM, Franchise, Admin, or Agents with optional GST.</p>
            <form onSubmit={handleProvisionUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label>
                <input 
                  type="text" required value={provisionForm.name} 
                  onChange={e => setProvisionForm({ ...provisionForm, name: e.target.value })}
                  placeholder="Partner or Admin Name"
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label>
                <input 
                  type="email" required value={provisionForm.email} 
                  onChange={e => setProvisionForm({ ...provisionForm, email: e.target.value })}
                  placeholder="partner@topiq.com"
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Password *</label>
                <input 
                  type="password" required value={provisionForm.password} 
                  onChange={e => setProvisionForm({ ...provisionForm, password: e.target.value })}
                  placeholder="Secure password"
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Role *</label>
                  <select 
                    value={provisionForm.targetRole} 
                    onChange={e => setProvisionForm({ ...provisionForm, targetRole: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 cursor-pointer"
                  >
                    <option value="asm">ASM (5% Split)</option>
                    <option value="franchise">Franchise (15% Split)</option>
                    <option value="agent">Agent (20% Split)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">GST Number (Optional)</label>
                  <input 
                    type="text" value={provisionForm.gstNumber} 
                    onChange={e => setProvisionForm({ ...provisionForm, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="27AAAAA0000A1Z5"
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 font-mono uppercase"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer">
                Create Secure Account
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}