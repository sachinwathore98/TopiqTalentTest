'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ShieldCheck, UserPlus, FileText, CheckCircle2, AlertCircle, Lock, Trash2, Power, RefreshCw } from 'lucide-react';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Data states
  const [usersList, setUsersList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  
  // New User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'franchise',
    phone: ''
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || (role !== 'super_admin' && role !== 'admin')) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/users/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users || []);
        setEnquiriesList(data.enquiries || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleUserCreation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${apiBaseUrl}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create user account.');

      setSuccessMsg(`Successfully created ${formData.targetRole} account for ${formData.name}! Credentials active.`);
      setFormData({ name: '', email: '', password: '', targetRole: 'franchise', phone: '' });
      fetchDashboardData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const token = localStorage.getItem('token');
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    try {
      const res = await fetch(`${apiBaseUrl}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to update user status.');
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-[#01295A] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Super Admin Central Command
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">TOPIQ Executive Control</h1>
            <p className="text-xs sm:text-sm text-slate-300">Manage hierarchical roles, commission wallets, enquiries, and user access status.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboardData}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { localStorage.clear(); router.push('/login'); }}
              className="text-xs px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl transition cursor-pointer shadow-md"
            >
              Logout Session
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: ShieldCheck },
            { id: 'users', label: 'Hierarchy & Users', icon: Users },
            { id: 'enquiries', label: 'Website Enquiries', icon: FileText },
            { id: 'create', label: 'Provision Account', icon: UserPlus },
          ].map((tab) => {
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400">Total System Users</div>
              <div className="text-3xl font-black text-[#01295A]">{usersList.length}</div>
              <div className="text-xs text-emerald-600 font-bold">Active ecosystem accounts</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400">Paid Students</div>
              <div className="text-3xl font-black text-emerald-600">{usersList.filter(u => u.role === 'student' && u.is_paid).length}</div>
              <div className="text-xs text-slate-500 font-bold">₹1,100 Test Fee Verified</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400">Franchises & Agents</div>
              <div className="text-3xl font-black text-[#FE7C02]">{usersList.filter(u => u.role === 'franchise' || u.role === 'agent' || u.role === 'asm').length}</div>
              <div className="text-xs text-slate-500 font-bold">Commission partners active</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400">Pending Enquiries</div>
              <div className="text-3xl font-black text-indigo-600">{enquiriesList.length}</div>
              <div className="text-xs text-slate-500 font-bold">Requires follow-up</div>
            </div>
          </div>
        )}

        {/* TAB 2: HIERARCHY & USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-black text-[#01295A]">Ecosystem User Directory & Deactivation Controls</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email / Login ID</th>
                    <th className="py-3 px-4">Role / Hierarchy</th>
                    <th className="py-3 px-4">Wallet Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-black text-[#01295A]">{u.name}</td>
                      <td className="py-3.5 px-4 font-mono">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-[#01295A] px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">₹{u.walletBalance || 0}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          u.status === 'deactivated' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status || 'active')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition cursor-pointer ${
                            u.status === 'deactivated' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-rose-500 text-white hover:bg-rose-600'
                          }`}
                        >
                          {u.status === 'deactivated' ? 'Activate' : 'Deactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">No users found in database. Provision accounts using the tab above.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: WEBSITE ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-black text-[#01295A]">Website Leads & Franchise/Agent Enquiries</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                    <th className="py-3 px-4">Applicant Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {enquiriesList.map((enq, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-black text-[#01295A]">{enq.name}</td>
                      <td className="py-3.5 px-4 font-mono">{enq.phone || enq.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                          {enq.type || 'Franchise/Agent'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{enq.city || enq.location || 'Maharashtra'}</td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(enq.createdAt || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {enquiriesList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">No pending website enquiries recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PROVISION ACCOUNT */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 max-w-2xl mx-auto space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-[#01295A]">Provision Hierarchical Account</h3>
              <p className="text-xs text-slate-500 font-semibold">Create secure login credentials for ASM, Franchise, Admin, or Agents.</p>
            </div>

            {successMsg && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">{successMsg}</div>}
            {errorMsg && <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">{errorMsg}</div>}

            <form onSubmit={handleUserCreation} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter partner name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">Email ID (Login Username) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@topiqtalent.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">Temporary Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Secure password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">Assign Hierarchy Role *</label>
                <select
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-[#FE7C02] outline-none cursor-pointer"
                >
                  <option value="admin">Operations Admin</option>
                  <option value="asm">ASM (Area Sales Manager - 5% Commission)</option>
                  <option value="franchise">Franchise Partner (15% Commission)</option>
                  <option value="agent">Agent / Promoted Channel (20% Commission)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs transition shadow-md cursor-pointer mt-2"
              >
                {loading ? 'Creating Credentials...' : 'Provision User Account'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}