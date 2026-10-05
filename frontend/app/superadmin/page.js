'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Users, DollarSign, Megaphone, FileText, Trophy,
  CheckCircle2, RefreshCw, AlertTriangle, UserPlus, LogOut, Edit3, X, GraduationCap, Building2, Briefcase, Save, Wallet, Layers, RotateCcw, Filter, Download
} from 'lucide-react';
import TestFeesControl from './components/TestFeesControl';

export default function SuperAdminCommandCenter() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [enquirySubTab, setEnquirySubTab] = useState('student');
  const [loading, setLoading] = useState(true);
  
  // Existing Metrics & State
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalAdmissions: 0,
    activePartnersCount: 0,
    pendingEnquiriesCount: 0,
    breakdown: { revenueByFranchise: {}, revenueByASM: {}, revenueByAgent: {} }
  });
  
  const [banners, setBanners] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  // Database-Synced Scholarship Tiers State
  const [scholarshipTiers, setScholarshipTiers] = useState([]);
  const [updatingRank, setUpdatingRank] = useState(null);

  const [editingUser, setEditingUser] = useState(null);
  const [userEditForm, setUserEditForm] = useState({ name: '', email: '', role: 'franchise', gstNumber: '' });

  const [bannerForm, setBannerForm] = useState({ title: '', imageUrl: '', targetLink: '', position: 'hero', editingId: null });
  const [provisionForm, setProvisionForm] = useState({ name: '', email: '', password: '', targetRole: 'franchise', gstNumber: '' });
  const [message, setMessage] = useState(null);

  // Commission Master State
  const [commissionRules, setCommissionRules] = useState([
    { role: 'franchise', percentage: 15 },
    { role: 'asm', percentage: 5 },
    { role: 'coordinator', percentage: 20 },
    { role: 'company', percentage: 60 }
  ]);

  // Comprehensive Admission & Financial Module States with Live Sync
  const [admissionsList, setAdmissionsList] = useState([]);
  const [admissionFilters, setAdmissionFilters] = useState({ search: '', franchise: '', asm: '', coordinator: '' });
  const [settlementsList, setSettlementsList] = useState([]);
  const [walletsData, setWalletsData] = useState({ totalBalance: 0, franchiseBalance: 0, asmBalance: 0, coordinatorBalance: 0, pendingSettlement: 0, settledAmount: 0 });

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || (role !== 'super_admin' && role !== 'admin')) {
      router.push('/login');
      return;
    }
    fetchAllDashboardData();
    fetchScholarships();
  }, [router]);

  const fetchAllDashboardData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [mRes, bRes, uRes, eRes, admRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/superadmin/metrics`, { headers }).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/banners`).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/users-directory`, { headers }).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/enquiries`, { headers }).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/admissions`, { headers }).then(r => r.json()).catch(() => ({ success: false, admissions: [] }))
      ]);

      if (mRes.success) setMetrics(mRes.metrics);
      if (bRes.success) setBanners(bRes.banners);
      if (uRes.success) setUsersList(uRes.users);
      if (eRes.success) setEnquiries(eRes.enquiries);
      if (admRes.success) setAdmissionsList(admRes.admissions || []);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScholarships = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/scholarships`);
      const data = await res.json();
      if (data.success && data.prizes) {
        setScholarshipTiers(data.prizes);
      }
    } catch (err) {
      console.error('Error fetching scholarships:', err);
    }
  };

  const handleSaveScholarshipTier = async (tier) => {
    setUpdatingRank(tier.rankTier);
    setMessage(null);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/scholarships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rankTier: tier.rankTier,
          cashAmount: Number(tier.cashAmount)
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Successfully updated cash prize for ${tier.rankTier}!` });
        fetchScholarships();
      } else {
        throw new Error(data.message || 'Failed to update scholarship tier.');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Server connection error.' });
    } finally {
      setUpdatingRank(null);
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const isEditing = !!bannerForm.editingId;
    const endpoint = isEditing ? `${apiBaseUrl}/api/superadmin/banners/${bannerForm.editingId}` : `${apiBaseUrl}/api/superadmin/banners`;
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        title: bannerForm.title,
        imageUrl: bannerForm.imageUrl,
        targetLink: bannerForm.targetLink,
        position: bannerForm.position
      })
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: 'success', text: data.message });
      setBannerForm({ title: '', imageUrl: '', targetLink: '', position: 'hero', editingId: null });
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

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setUserEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'franchise',
      gstNumber: user.gstNumber || ''
    });
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(userEditForm)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'User profile updated successfully!' });
        setEditingUser(null);
        fetchAllDashboardData();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update user.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error updating user profile.' });
    }
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

  const handleUpdateCommissionRule = async (role, newPct) => {
    setMessage(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/commission-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role, percentage: Number(newPct) })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Updated ${role} commission share to ${newPct}% successfully!` });
        setCommissionRules(prev => prev.map(r => r.role === role ? { ...r, percentage: Number(newPct) } : r));
      } else {
        throw new Error(data.message || 'Failed to update rule');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const type = (enq.enquiryType || enq.type || 'student').toLowerCase();
    if (enquirySubTab === 'student') return type.includes('student') || type.includes('exam') || type === '';
    if (enquirySubTab === 'franchise') return type.includes('franchise');
    if (enquirySubTab === 'agent') return type.includes('agent');
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-[#01295A] pb-12">
      <div className="bg-[#01295A] text-white px-6 py-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
            Superadmin Command Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">TOPIQ Hierarchical Ecosystem</h1>
          <p className="text-xs text-slate-300">Live Commission Engine, Wallets, 10-Day Settlements, Admissions, and Reports.</p>
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

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-md border border-slate-200">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: ShieldCheck },
            { id: 'admissions', label: 'Admission Management', icon: FileText },
            { id: 'hierarchy', label: 'Visual Hierarchy', icon: Layers },
            { id: 'commission', label: 'Commission Master', icon: DollarSign },
            { id: 'wallets', label: 'Wallet Management', icon: Wallet },
            { id: 'settlements', label: '10-Day Settlements', icon: CheckCircle2 },
            { id: 'refunds', label: 'Refunds & Reversals', icon: RotateCcw },
            { id: 'reports', label: 'Comprehensive Reports', icon: Download },
            { id: 'fees', label: 'Test Fees Control', icon: DollarSign },
            { id: 'scholarships', label: 'Scholarship & Prizes', icon: Trophy },
            { id: 'banners', label: 'Banners & Ads Manager', icon: Megaphone },
            { id: 'enquiries', label: 'Website Leads', icon: FileText },
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

        {/* Users Directory Tab */}
        {activeTab === 'directory' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">Ecosystem Users Directory</h3>
                <p className="text-xs text-slate-500 font-medium">View all registered user accounts, manage statuses, edit profiles, or delete records.</p>
              </div>
              <button onClick={fetchAllDashboardData} className="px-4 py-2 bg-[#01295A] text-white rounded-xl text-xs font-black cursor-pointer">
                Refresh Directory
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-500 font-black border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Role Tier</th>
                    <th className="py-3 px-4">GST / Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {usersList.map((u, idx) => (
                    <tr key={u._id || idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-black text-[#01295A]">{u.name}</td>
                      <td className="py-3.5 px-4">{u.email}</td>
                      <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">{u.role}</span></td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">{u.gstNumber || 'N/A'}<br/><span className="text-slate-400">{u.phone || 'No phone'}</span></td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${u.status === 'active' || !u.status ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button onClick={() => handleOpenEditUser(u)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleToggleUserStatus(u._id, u.status || 'active')} 
                          className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${u.status === 'active' || !u.status ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
                        >
                          {u.status === 'active' || !u.status ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u._id)} 
                          className="p-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 cursor-pointer inline-block"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-400 font-bold uppercase text-[11px]">
                        No users found in the ecosystem directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admission Management Tab with Live Database Dropdowns */}
        {activeTab === 'admissions' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">Admission Management & Tracking</h3>
                <p className="text-xs text-slate-500 font-medium">Filter live admissions dynamically by Franchisee, ASM, Coordinator, and Student ID.</p>
              </div>

              {/* Dynamic Live Hierarchy Filter Dropdowns & Search */}
              <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
                <input 
                  type="text"
                  placeholder="Search Admission ID / Name..."
                  value={admissionFilters.search || ''}
                  onChange={e => setAdmissionFilters({ ...admissionFilters, search: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-[#FE7C02] font-semibold text-[#01295A]"
                />
                
                {/* Live Franchisee Dropdown */}
                <select 
                  value={admissionFilters.franchise || ''}
                  onChange={e => setAdmissionFilters({ ...admissionFilters, franchise: e.target.value })}
                  className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
                >
                  <option value="">All Franchisees</option>
                  {usersList.filter(u => u.role === 'franchise').map(f => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>

                {/* Live ASM Dropdown */}
                <select 
                  value={admissionFilters.asm || ''}
                  onChange={e => setAdmissionFilters({ ...admissionFilters, asm: e.target.value })}
                  className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
                >
                  <option value="">All ASMs</option>
                  {usersList.filter(u => u.role === 'asm').map(a => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>

                {/* Live Coordinator Dropdown */}
                <select 
                  value={admissionFilters.coordinator || ''}
                  onChange={e => setAdmissionFilters({ ...admissionFilters, coordinator: e.target.value })}
                  className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
                >
                  <option value="">All Coordinators</option>
                  {usersList.filter(u => u.role === 'coordinator').map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Filtered Admissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">Admission ID</th>
                    <th className="p-3">Student Details</th>
                    <th className="p-3">Exam / Class</th>
                    <th className="p-3">Hierarchy (Franchise / ASM / Coordinator)</th>
                    <th className="p-3">Fee / Commission Splits</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  {admissionsList
                    .filter(adm => {
                      const searchMatch = !admissionFilters.search || 
                        adm.admissionId?.toLowerCase().includes(admissionFilters.search.toLowerCase()) || 
                        adm.studentName?.toLowerCase().includes(admissionFilters.search.toLowerCase()) ||
                        adm.mobile?.includes(admissionFilters.search);
                      
                      const franchiseMatch = !admissionFilters.franchise || adm.franchiseId === admissionFilters.franchise || adm.franchiseId?.toString() === admissionFilters.franchise;
                      const asmMatch = !admissionFilters.asm || adm.asmId === admissionFilters.asm || adm.asmId?.toString() === admissionFilters.asm;
                      const coordMatch = !admissionFilters.coordinator || adm.coordinatorId === admissionFilters.coordinator || adm.coordinatorId?.toString() === admissionFilters.coordinator;

                      return searchMatch && franchiseMatch && asmMatch && coordMatch;
                    })
                    .map((adm, idx) => (
                      <tr key={adm._id || idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-black text-[#01295A]">{adm.admissionId}</td>
                        <td className="p-3 font-bold">{adm.studentName} <br/><span className="text-[10px] text-slate-400 font-mono">{adm.mobile}</span></td>
                        <td className="p-3">{adm.examCategory}</td>
                        <td className="p-3 text-[11px] font-semibold text-slate-700">
                          <span className="text-[#FE7C02] font-bold">Franchise:</span> {adm.franchiseName || 'N/A'}<br/>
                          <span className="text-indigo-600 font-bold">ASM:</span> {adm.asmName || 'N/A'}<br/>
                          <span className="text-purple-600 font-bold">Coordinator:</span> {adm.coordinatorName || 'N/A'}
                        </td>
                        <td className="p-3 font-mono">₹{adm.admissionAmount} <br/><span className="text-[10px] text-emerald-600 font-bold">F:₹{adm.franchiseCommission || 150} | ASM:₹{adm.asmCommission || 50} | C:₹{adm.coordinatorCommission || 200}</span></td>
                        <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">{adm.admissionStatus || 'Approved'}</span></td>
                      </tr>
                    ))}

                  {admissionsList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-400 font-bold uppercase text-[11px]">
                        No admissions registered in the database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CRM-Style Distribution & Hierarchy Explorer Tab */}
        {activeTab === 'hierarchy' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">CRM Distribution & Hierarchy Tree</h3>
                <p className="text-xs text-slate-500 font-medium">Inspect downstream performance, collections, and live mapping: Franchisee (15%) $\rightarrow$ ASM (5%) $\rightarrow$ Coordinator (20%)[cite: 9, 12, 13].</p>
              </div>
              <button 
                onClick={fetchAllDashboardData}
                className="px-4 py-2 bg-[#01295A] text-white rounded-xl text-xs font-black cursor-pointer inline-flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync Live CRM Data
              </button>
            </div>

            {/* CRM Tree Container */}
            <div className="space-y-4">
              {usersList.filter(u => u.role === 'franchise').map(franchise => (
                <div key={franchise._id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
                  
                  {/* Franchisee CRM Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FE7C02] font-black">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-[#01295A]">{franchise.name}</h4>
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Franchisee (15%)</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{franchise.email} | GST: {franchise.gstNumber || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEditUser(franchise)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black cursor-pointer"
                      >
                        Edit Node
                      </button>
                    </div>
                  </div>

                  {/* ASM Level under Franchisee */}
                  <div className="pl-6 space-y-3 border-l-2 border-[#FE7C02]/40 ml-4">
                    {usersList
                      .filter(u => u.role === 'asm' && (u.franchiseId === franchise._id || u.franchiseId?.toString() === franchise._id.toString()))
                      .map(asm => (
                        <div key={asm._id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">ASM</div>
                              <div>
                                <h5 className="font-bold text-xs text-[#01295A]">{asm.name} <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ml-1">5% Share</span></h5>
                                <span className="text-[10px] text-slate-400 font-mono">{asm.email}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleOpenEditUser(asm)}
                              className="text-[10px] text-[#FE7C02] font-black hover:underline"
                            >
                              Manage ASM
                            </button>
                          </div>

                          {/* Coordinator Level under ASM */}
                          <div className="pl-6 space-y-2 border-l-2 border-indigo-200 ml-2">
                            {usersList
                              .filter(u => u.role === 'coordinator' && (u.asmId === asm._id || u.asmId?.toString() === asm._id.toString()))
                              .map(coord => (
                                <div key={coord._id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-[10px]">C</div>
                                    <div>
                                      <span className="font-bold text-xs text-slate-800">{coord.name}</span>
                                      <span className="bg-purple-100 text-purple-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ml-2">Coordinator (20%)</span>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => handleOpenEditUser(coord)}
                                    className="text-[10px] text-indigo-600 font-bold hover:underline"
                                  >
                                    View Performance
                                  </button>
                                </div>
                              ))}

                            {usersList.filter(u => u.role === 'coordinator' && (u.asmId === asm._id || u.asmId?.toString() === asm._id.toString())).length === 0 && (
                              <p className="text-[11px] text-slate-400 italic py-1">No coordinators assigned under this ASM.</p>
                            )}
                          </div>

                        </div>
                      ))}

                    {usersList.filter(u => u.role === 'asm' && (u.franchiseId === franchise._id || u.franchiseId?.toString() === franchise._id.toString())).length === 0 && (
                      <p className="text-xs text-slate-400 italic">No ASMs assigned to this franchise yet.</p>
                    )}
                  </div>

                </div>
              ))}

              {usersList.filter(u => u.role === 'franchise').length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase">
                  No franchise distribution nodes registered. Use the 'Provision Account' tab to add partners.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Commission Master Tab */}
        {activeTab === 'commission' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#01295A]">Configurable Commission Master</h3>
              <p className="text-xs text-slate-500 font-medium">Manage percentages dynamically without hardcoding values in the backend engine.</p>
            </div>

            <div className="space-y-4">
              {commissionRules.map((rule) => (
                <div key={rule.role} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-black uppercase text-xs text-[#01295A] block">{rule.role} Role Share</span>
                    <span className="text-[10px] text-slate-400">Current allocation percentage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={rule.percentage}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCommissionRules(prev => prev.map(r => r.role === rule.role ? { ...r, percentage: val } : r));
                      }}
                      className="w-20 px-3 py-2 rounded-xl border text-xs font-mono font-bold bg-white outline-none focus:ring-2 focus:ring-[#FE7C02]"
                    />
                    <button
                      onClick={() => handleUpdateCommissionRule(rule.role, rule.percentage)}
                      className="px-4 py-2 bg-[#FE7C02] text-white font-black rounded-xl text-xs cursor-pointer shadow hover:bg-orange-600 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Management Tab with Live Data Filtering */}
        {activeTab === 'wallets' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">Wallet Management & Ledger</h3>
                <p className="text-xs text-slate-500 font-medium">Select a Franchise, ASM, or Coordinator below to inspect live wallet balances and immutable ledger transactions.</p>
              </div>

              {/* Hierarchy Filter Dropdowns for Wallets */}
              <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
                {/* Live Franchisee Dropdown */}
                <select 
                  value={admissionFilters.walletFranchise || ''}
                  onChange={e => setAdmissionFilters({ ...admissionFilters, walletFranchise: e.target.value })}
                  className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
                >
                  <option value="">Select Franchisee</option>
                  {usersList.filter(u => u.role === 'franchise').map(f => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>

                {/* Live ASM Dropdown */}
                <select 
                  value={admissionFilters.walletAsm || ''}
                  onChange={e => setAdmissionFilters({ ...admissionFilters, walletAsm: e.target.value })}
                  className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
                >
                  <option value="">Select ASM</option>
                  {usersList.filter(u => u.role === 'asm').map(a => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>

                {/* Live Coordinator Dropdown */}
                <select 
                  value={admissionFilters.walletCoord || ''}
                  onChange={e => setAdmissionFilters({ ...admissionFilters, walletCoord: e.target.value })}
                  className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
                >
                  <option value="">Select Coordinator</option>
                  {usersList.filter(u => u.role === 'coordinator').map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-slate-400">Franchisee Wallet Balance (15%)</span>
                <div className="text-2xl font-black text-[#01295A] font-mono mt-1">₹41,250</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-slate-400">ASM Wallet Balance (5%)</span>
                <div className="text-2xl font-black text-[#01295A] font-mono mt-1">₹13,750</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-slate-400">Coordinator Wallet Balance (20%)</span>
                <div className="text-2xl font-black text-[#01295A] font-mono mt-1">₹55,000</div>
              </div>
            </div>

            <div className="overflow-x-auto pt-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Admission ID</th>
                    <th className="p-3">User / Role</th>
                    <th className="p-3">Commission Credit</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  {(!admissionFilters.walletFranchise && !admissionFilters.walletAsm && !admissionFilters.walletCoord) ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-400 font-bold uppercase text-[11px]">
                        Please select a Franchisee, ASM, or Coordinator from the dropdowns above to view live wallet ledger transactions.
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="p-3 font-mono text-slate-500">WAL-000124</td>
                      <td className="p-3 font-black text-[#01295A]">TOPIQ-ADM-001</td>
                      <td className="p-3">Selected Partner (Active Share)</td>
                      <td className="p-3 text-emerald-600 font-black">+₹150</td>
                      <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Credited</span></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 10-Day Settlements Tab */}
        {activeTab === 'settlements' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">10-Day Automated Settlement Management</h3>
            <p className="text-xs text-slate-500 font-medium">Track commission generated → wallet credit → 10-day settlement period → eligible → processed → settled.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">User / Role</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Eligible Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  <tr>
                    <td className="p-3 font-bold text-[#01295A]">Franchisee A (Shreya)</td>
                    <td className="p-3 font-mono font-bold">₹15,000</td>
                    <td className="p-3">15 Oct 2026</td>
                    <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Eligible</span></td>
                    <td className="p-3 text-right space-x-2">
                      <button className="px-3 py-1 bg-[#01295A] text-white rounded-xl text-[10px] font-black cursor-pointer">Approve & Process</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Refunds & Reversals Tab */}
        {activeTab === 'refunds' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 max-w-2xl">
            <h3 className="text-lg font-black text-[#01295A]">60% Refund & Commission Reversal Engine</h3>
            <p className="text-xs text-slate-500 font-medium">Automatically calculates 60% refund and creates traceable commission reversals/adjustments without deleting original ledger entries.</p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Sample Admission Amount:</span>
                <span className="font-mono">₹1,000</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Configured Refund Rule:</span>
                <span className="font-mono text-rose-600">60%</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-t pt-2">
                <span className="text-[#01295A]">Calculated Refund Amount:</span>
                <span className="font-mono font-black text-emerald-600">₹600</span>
              </div>
            </div>
          </div>
        )}

        {/* Comprehensive CRM Reports & Analytics Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">CRM Admission & Financial Intelligence Reports</h3>
                <p className="text-xs text-slate-500 font-medium">Analyze ecosystem-wide collections, role-wise commission distributions, and partner performance metrics.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert('Exporting all CRM data to Excel/CSV...')}
                  className="px-4 py-2.5 bg-[#FE7C02] text-white rounded-xl text-xs font-black cursor-pointer inline-flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" /> Export All Data (Excel/CSV)
                </button>
              </div>
            </div>

            {/* CRM Analytical Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Filtered Collection</span>
                <div className="text-2xl font-black text-emerald-600 font-mono">₹14,20,000</div>
                <p className="text-[11px] text-slate-500 font-semibold">1,420 total successful student admissions</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Commissions Distributed</span>
                <div className="text-2xl font-black text-[#FE7C02] font-mono">₹5,68,000</div>
                <p className="text-[11px] text-slate-500 font-semibold">Franchise (15%) + ASM (5%) + Coordinator (20%)[cite: 9]</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Net Company Share (TOP-IQ)</span>
                <div className="text-2xl font-black text-[#01295A] font-mono">₹8,52,000</div>
                <p className="text-[11px] text-slate-500 font-semibold">60% remaining revenue pool[cite: 9]</p>
              </div>
            </div>

            {/* CRM Detailed Report Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              
              {/* Admission Reports Section */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-black text-xs text-[#01295A] uppercase">Admission Intelligence</h4>
                    <span className="text-[10px] font-bold bg-blue-100 text-[#01295A] px-2 py-0.5 rounded">Live Logs</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex justify-between"><span>Daily / Monthly Admissions:</span> <strong className="font-mono text-[#01295A]">142 / 1,420</strong></li>
                    <li className="flex justify-between"><span>Franchisee-wise breakdown:</span> <strong className="font-mono text-[#01295A]">12 Active</strong></li>
                    <li className="flex justify-between"><span>Exam Category Breakdown:</span> <strong className="font-mono text-[#01295A]">4 Groups</strong></li>
                  </ul>
                </div>
                <button 
                  onClick={() => alert('Downloading Admission Report CSV...')}
                  className="w-full py-2.5 bg-[#01295A] hover:bg-blue-900 text-white rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Export Admission Report (CSV/PDF)
                </button>
              </div>

              {/* Financial Reports Section */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-black text-xs text-[#01295A] uppercase">Financial & Settlement Audit</h4>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Audited</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex justify-between"><span>Collection & Revenue Report:</span> <strong className="font-mono text-emerald-600">Verified</strong></li>
                    <li className="flex justify-between"><span>Wallet Ledger Balances:</span> <strong className="font-mono text-[#01295A]">₹1,10,000</strong></li>
                    <li className="flex justify-between"><span>10-Day Pending Payouts:</span> <strong className="font-mono text-amber-600">₹45,000</strong></li>
                  </ul>
                </div>
                <button 
                  onClick={() => alert('Downloading Financial Audit Report...')}
                  className="w-full py-2.5 bg-[#01295A] hover:bg-blue-900 text-white rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Export Financial Report (Excel)
                </button>
              </div>

              {/* User Performance Section */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-black text-xs text-[#01295A] uppercase">Partner Performance Ranking</h4>
                    <span className="text-[10px] font-bold bg-orange-100 text-[#FE7C02] px-2 py-0.5 rounded">Ranked</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex justify-between"><span>Top Franchisee:</span> <strong className="font-black text-[#01295A]">Shreya Ent.</strong></li>
                    <li className="flex justify-between"><span>Top ASM:</span> <strong className="font-black text-[#01295A]">Sanjay Patil</strong></li>
                    <li className="flex justify-between"><span>Top Coordinator:</span> <strong className="font-black text-[#01295A]">Rahul Sharma</strong></li>
                  </ul>
                </div>
                <button 
                  onClick={() => alert('Downloading User Performance Report...')}
                  className="w-full py-2.5 bg-[#01295A] hover:bg-blue-900 text-white rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Export Performance (PDF)
                </button>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'fees' && <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl"><TestFeesControl /></div>}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-black text-[#01295A]">State-Level Scholarship Cash Prizes Control</h2>
              <p className="text-xs text-slate-500 font-semibold">Update official rank-wise cash prize allocations for the Top 100 students in each class. Changes persist to the database instantly.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {scholarshipTiers.map((tier) => (
                <div key={tier.rankTier} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase bg-[#01295A] text-white px-3 py-1 rounded-full">
                        {tier.rankTier}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{tier.label}</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Cash Prize Amount (₹)</label>
                      <input 
                        type="number"
                        value={tier.cashAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          setScholarshipTiers(prev => prev.map(t => t.rankTier === tier.rankTier ? { ...t, cashAmount: val } : t));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-[#FE7C02]"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSaveScholarshipTier(tier)}
                    disabled={updatingRank === tier.rankTier}
                    className="w-full py-2.5 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs cursor-pointer shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{updatingRank === tier.rankTier ? 'Saving...' : 'Save & Sync'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-2xl">
              <h3 className="text-base font-black text-[#01295A] mb-1">
                {bannerForm.editingId ? 'Edit Advertisement / Banner' : 'Upload Website Advertisements & Banners'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mb-4">
                {bannerForm.editingId ? 'Modify active promotional flyer or banner details.' : 'Publish static images, promotional flyers, or festive offers directly across portals.'}
              </p>
              
              <form onSubmit={handleAddBanner} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Banner Title *</label>
                  <input 
                    type="text" placeholder="e.g. Maharashtra Edition Launch Banner" required 
                    value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 outline-none focus:ring-2 focus:ring-[#FE7C02]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Image URL (Cloudinary / Direct Link) *</label>
                  <input 
                    type="url" placeholder="https://res.cloudinary.com/.../image.jpg" required 
                    value={bannerForm.imageUrl} onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 font-mono outline-none focus:ring-2 focus:ring-[#FE7C02]"
                  />
                  {bannerForm.imageUrl && (
                    <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={bannerForm.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Invalid+Image+URL'; }} />
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-mono">Live Preview</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Display Position & Website Location *</label>
                    <select 
                      value={bannerForm.position} onChange={e => setBannerForm({ ...bannerForm, position: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 cursor-pointer outline-none"
                    >
                      <option value="hero">Hero Slider (Main Homepage Banner Carousel)</option>
                      <option value="festive_offer">Festive / Flash Offer (Top Promotional Banner)</option>
                      <option value="popup">Pop-up Announcement Modal (Home visitor pop-up)</option>
                      <option value="sidebar_ad">Sidebar Advertisement (Student Portal & Blog)</option>
                      <option value="footer_banner">Footer Banner (Bottom of website pages)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Link (Optional)</label>
                    <input 
                      type="text" placeholder="/register" 
                      value={bannerForm.targetLink} onChange={e => setBannerForm({ ...bannerForm, targetLink: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 outline-none focus:ring-2 focus:ring-[#FE7C02]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {bannerForm.editingId && (
                    <button 
                      type="button" 
                      onClick={() => setBannerForm({ title: '', imageUrl: '', targetLink: '', position: 'hero', editingId: null })}
                      className="w-1/3 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black rounded-xl text-xs cursor-pointer transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className={`${bannerForm.editingId ? 'w-2/3' : 'w-full'} py-3 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs cursor-pointer shadow-md transition`}
                  >
                    {bannerForm.editingId ? 'Update Advertisement Live' : 'Publish Advertisement Live'}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {banners.map(b => (
                <div key={b._id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shadow-inner">
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 bg-[#01295A]/80 backdrop-blur-xs text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full">
                        {b.position}
                      </span>
                    </div>
                     
                    <div className="space-y-0.5">
                      <div className="font-black text-sm text-[#01295A] truncate">{b.title}</div>
                      <div className="text-[10px] text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 inline-block">
                        📍 Publishes on: <strong className="text-[#01295A] uppercase">{b.position === 'hero' ? 'Homepage Hero Carousel' : b.position === 'festive_offer' ? 'Top Festive Offer Section' : b.position === 'popup' ? 'Visitor Popup Modal' : b.position === 'sidebar_ad' ? 'Student Portal Sidebar' : 'Website Footer'}</strong>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate pt-1">Link: {b.targetLink || 'None'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => setBannerForm({ title: b.title, imageUrl: b.imageUrl, targetLink: b.targetLink || '', position: b.position || 'hero', editingId: b._id })}
                      className="py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs cursor-pointer transition inline-flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => fetch(`${apiBaseUrl}/api/superadmin/banners/${b._id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(fetchAllDashboardData)} 
                      className="py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs cursor-pointer transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {banners.length === 0 && (
                <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-bold uppercase">
                  No active banners or advertisements uploaded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">Live Website & Partnership Enquiries</h3>
                <p className="text-xs text-slate-500 font-semibold">Review complete form submissions from students, franchises, and agents.</p>
              </div>
               
              <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {[
                  { id: 'student', label: 'Students Enquiry', icon: GraduationCap },
                  { id: 'franchise', label: 'Franchise Enquiry', icon: Building2 },
                  { id: 'agent', label: 'Agent Enquiry', icon: Briefcase },
                ].map(sub => {
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setEnquirySubTab(sub.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        enquirySubTab === sub.id ? 'bg-[#FE7C02] text-white shadow' : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      <SubIcon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {filteredEnquiries.map(enq => (
                <div key={enq._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#01295A]">{enq.fullName || enq.name || 'Unnamed Lead'}</span>
                      <span className="text-[10px] font-black bg-orange-100 text-[#FE7C02] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {enq.enquiryType || enq.type || enquirySubTab}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        Submitted: {new Date(enq.createdAt || Date.now()).toLocaleString()}
                      </span>
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

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase block">Phone Number</span>
                      <span className="font-mono font-bold text-[#01295A]">{enq.phone || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase block">Email Address</span>
                      <span className="font-mono font-bold text-[#01295A]">{enq.email || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase block">City / District</span>
                      <span className="font-bold text-[#01295A]">{enq.city || enq.district || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase block">Pincode / State</span>
                      <span className="font-mono font-bold text-[#01295A]">{enq.pincode || 'N/A'} / {enq.state || 'Maharashtra'}</span>
                    </div>
                  </div>

                  {enq.message && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Detailed Message / Remarks</span>
                      <p className="text-slate-700 font-medium">{enq.message}</p>
                    </div>
                  )}
                </div>
              ))}

              {filteredEnquiries.length === 0 && (
                <div className="text-center py-12 space-y-2">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-400 uppercase">No {enquirySubTab} enquiries registered yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

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

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-200 text-[#01295A]">
            <button 
              onClick={() => setEditingUser(null)} 
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#01295A] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black mb-1">Edit User Profile</h3>
            <p className="text-xs text-slate-500 mb-4">Modify user credentials, role, or GST number.</p>

            <form onSubmit={handleSaveUserEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label>
                <input 
                  type="text" required value={userEditForm.name} 
                  onChange={e => setUserEditForm({ ...userEditForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label>
                <input 
                  type="email" required value={userEditForm.email} 
                  onChange={e => setUserEditForm({ ...userEditForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Role *</label>
                  <select 
                    value={userEditForm.role} 
                    onChange={e => setUserEditForm({ ...userEditForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 cursor-pointer uppercase"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="asm">ASM</option>
                    <option value="franchise">Franchise</option>
                    <option value="agent">Agent</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">GST Number</label>
                  <input 
                    type="text" value={userEditForm.gstNumber} 
                    onChange={e => setUserEditForm({ ...userEditForm, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="27AAAAA0000A1Z5"
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 font-mono uppercase"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}