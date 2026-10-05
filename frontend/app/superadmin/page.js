'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Users, DollarSign, Megaphone, FileText, Trophy,
  CheckCircle2, RefreshCw, AlertTriangle, UserPlus, LogOut, Edit3, X, GraduationCap, Building2, Briefcase, Save, Wallet, Layers, RotateCcw, Filter, Download, Trash2
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
  const [userEditForm, setUserEditForm] = useState({ name: '', email: '', role: 'franchise', gstNumber: '', status: 'active' });

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
        fetch(`${apiBaseUrl}/api/superadmin/users-directory`, { headers }).then(r => r.json()).catch(() => fetch(`${apiBaseUrl}/api/superadmin/hierarchy-users`, { headers }).then(r => r.json())),
        fetch(`${apiBaseUrl}/api/superadmin/enquiries`, { headers }).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/superadmin/admissions`, { headers }).then(r => r.json()).catch(() => ({ success: false, admissions: [] }))
      ]);

      if (mRes.success) setMetrics(mRes.metrics);
      if (bRes.success) setBanners(bRes.banners);
      if (uRes.success) setUsersList(uRes.users || []);
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
    await fetch(`${apiBaseUrl}/api/superadmin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    fetchAllDashboardData();
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiBaseUrl}/api/superadmin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: 'success', text: 'User deleted successfully.' });
      fetchAllDashboardData();
    }
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setUserEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'franchise',
      gstNumber: user.gstNumber || '',
      status: user.status || 'active'
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
            { id: 'directory', label: 'Users Directory', icon: Users },
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

        {/* Admission Management Tab */}
        {activeTab === 'admissions' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#01295A]">Admission Management & Tracking</h3>
                <p className="text-xs text-slate-500 font-medium">Filter live admissions dynamically by Franchisee, ASM, Coordinator, and Student ID.</p>
              </div>

              <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
                <input 
                  type="text"
                  placeholder="Search Admission ID / Name..."
                  value={admissionFilters.search || ''}
                  onChange={e => setAdmissionFilters({ ...admissionFilters, search: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-[#FE7C02] font-semibold text-[#01295A]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">Admission ID</th>
                    <th className="p-3">Student Details</th>
                    <th className="p-3">Exam / Class</th>
                    <th className="p-3">Hierarchy</th>
                    <th className="p-3">Fee / Commission Splits</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  {admissionsList.map((adm, idx) => (
                    <tr key={adm._id || idx} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-black text-[#01295A]">{adm.admissionId}</td>
                      <td className="p-3 font-bold">{adm.studentName} <br/><span className="text-[10px] text-slate-400 font-mono">{adm.mobile}</span></td>
                      <td className="p-3">{adm.examCategory}</td>
                      <td className="p-3 text-[11px] font-semibold text-slate-700">
                        <span className="text-[#FE7C02] font-bold">Franchise:</span> {adm.franchiseName || 'N/A'}<br/>
                        <span className="text-indigo-600 font-bold">ASM:</span> {adm.asmName || 'N/A'}<br/>
                        <span className="text-purple-600 font-bold">Coordinator:</span> {adm.coordinatorName || 'N/A'}
                      </td>
                      <td className="p-3 font-mono">₹{adm.admissionAmount} <br/><span className="text-[10px] text-emerald-600 font-bold">F:₹150 | ASM:₹50 | C:₹200</span></td>
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

        {/* Visual Hierarchy Tab */}
        {activeTab === 'hierarchy' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">CRM Distribution & Hierarchy Tree</h3>
            <p className="text-xs text-slate-500 font-medium">Inspect downstream performance and live mapping.</p>
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

        {/* Wallet Management Tab */}
        {activeTab === 'wallets' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">Wallet Management & Ledger</h3>
            <p className="text-xs text-slate-500 font-medium">Inspect ecosystem wallet balances and immutable ledger transactions.</p>
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
          </div>
        )}

        {/* 10-Day Settlements Tab */}
        {activeTab === 'settlements' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">10-Day Automated Settlement Management</h3>
            <p className="text-xs text-slate-500 font-medium">Track commission generated and process wallet payout settlements.</p>
          </div>
        )}

        {/* Refunds & Reversals Tab */}
        {activeTab === 'refunds' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 max-w-2xl">
            <h3 className="text-lg font-black text-[#01295A]">60% Refund & Commission Reversal Engine</h3>
            <p className="text-xs text-slate-500 font-medium">Automatically calculates 60% refund and creates traceable commission reversals.</p>
          </div>
        )}

        {/* Comprehensive Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">CRM Admission & Financial Intelligence Reports</h3>
            <p className="text-xs text-slate-500 font-medium">Analyze ecosystem-wide collections and role-wise commission distributions.</p>
          </div>
        )}

        {activeTab === 'fees' && <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl"><TestFeesControl /></div>}
        
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-black text-[#01295A]">State-Level Scholarship Cash Prizes Control</h2>
              <p className="text-xs text-slate-500 font-semibold">Update official rank-wise cash prize allocations for students.</p>
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
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Image URL *</label>
                  <input 
                    type="url" placeholder="https://res.cloudinary.com/.../image.jpg" required 
                    value={bannerForm.imageUrl} onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 font-mono outline-none focus:ring-2 focus:ring-[#FE7C02]"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs cursor-pointer shadow-md">
                  Publish Advertisement Live
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-6">
            <h3 className="text-lg font-black text-[#01295A]">Live Website & Partnership Enquiries</h3>
          </div>
        )}

        {activeTab === 'provision' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-xl">
            <h3 className="text-base font-black text-[#01295A] mb-1">Provision Hierarchical Account</h3>
            <form onSubmit={handleProvisionUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label>
                <input type="text" required value={provisionForm.name} onChange={e => setProvisionForm({ ...provisionForm, name: e.target.value })} placeholder="Partner Name" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label>
                <input type="email" required value={provisionForm.email} onChange={e => setProvisionForm({ ...provisionForm, email: e.target.value })} placeholder="partner@topiq.com" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Password *</label>
                <input type="password" required value={provisionForm.password} onChange={e => setProvisionForm({ ...provisionForm, password: e.target.value })} placeholder="Secure password" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Role *</label>
                  <select value={provisionForm.targetRole} onChange={e => setProvisionForm({ ...provisionForm, targetRole: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 cursor-pointer">
                    <option value="asm">ASM (5% Split)</option>
                    <option value="franchise">Franchise (15% Split)</option>
                    <option value="agent">Agent (20% Split)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">GST Number</label>
                  <input type="text" value={provisionForm.gstNumber} onChange={e => setProvisionForm({ ...provisionForm, gstNumber: e.target.value.toUpperCase() })} placeholder="27AAAAA0000A1Z5" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 font-mono uppercase" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-200 text-[#01295A]">
            <button onClick={() => setEditingUser(null)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black mb-1">Edit User Profile</h3>
            <p className="text-xs text-slate-500 mb-4">Modify user credentials, role, or status.</p>

            <form onSubmit={handleSaveUserEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label>
                <input type="text" required value={userEditForm.name} onChange={e => setUserEditForm({ ...userEditForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label>
                <input type="email" required value={userEditForm.email} onChange={e => setUserEditForm({ ...userEditForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Role *</label>
                  <select value={userEditForm.role} onChange={e => setUserEditForm({ ...userEditForm, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 cursor-pointer uppercase">
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="franchise">Franchise</option>
                    <option value="asm">ASM</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="agent">Agent</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Status</label>
                  <select value={userEditForm.status} onChange={e => setUserEditForm({ ...userEditForm, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold bg-slate-50 cursor-pointer uppercase">
                    <option value="active">Active</option>
                    <option value="deactivated">Deactivated</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md cursor-pointer mt-2">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}