'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Users, Wallet, Building2, Layers, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ admissionsCount: 0, totalCollection: 0, walletsTotal: 0 });
  const [usersList, setUsersList] = useState([]);
  const [walletsLedger, setWalletsLedger] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin'].includes(role)) {
      router.push('/login');
      return;
    }
    fetchAdminData();
  }, [router]);

  const fetchAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Fetch admin stats, users, and financial ledgers from backend API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/superadmin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats || {});
        setUsersList(data.users || []);
        setWalletsLedger(data.wallets || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#FE7C02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Super Admin Master Control</span>
              <span className="text-xs text-slate-400 font-medium">Full System Oversight</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">TOP-IQ Administrative Command Center</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage user hierarchies, automated commission splits, wallet settlements, and financial audit trails[cite: 5, 12].</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-xs px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'overview' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            System Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'users' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            User Hierarchy (Franchise/ASM/Coord)
          </button>
          <button
            onClick={() => setActiveTab('wallets')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm ${
              activeTab === 'wallets' ? 'bg-[#01295A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Financial & Wallet Ledger
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Total Admissions</span>
                <div className="text-3xl font-black">1,420</div>
                <p className="text-xs text-emerald-600 font-bold">+18% this month</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Total Collection</span>
                <div className="text-3xl font-black">₹14,20,000</div>
                <p className="text-xs text-slate-400 font-medium">Automatic splits active</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Wallet Balances</span>
                <div className="text-3xl font-black">₹3,55,000</div>
                <p className="text-xs text-[#FE7C02] font-bold">10-day settlement window</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">TOP-IQ Revenue (60%)</span>
                <div className="text-3xl font-black">₹8,52,000</div>
                <p className="text-xs text-emerald-600 font-bold">Net company share</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Hierarchy & User Management</h2>
              <button className="px-4 py-2 bg-[#FE7C02] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow cursor-pointer">
                + Add New User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-500 font-black border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3.5 px-4 font-black text-[#01295A]">Shreya Enterprises (Franchisee)</td>
                    <td className="py-3.5 px-4"><span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">Franchisee (15%)</span></td>
                    <td className="py-3.5 px-4">9822012345</td>
                    <td className="py-3.5 px-4"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">Active</span></td>
                    <td className="py-3.5 px-4"><button className="text-[#FE7C02] font-bold hover:underline">View Downline</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Wallets */}
        {activeTab === 'wallets' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider">Immutable Financial Wallet Ledger</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-slate-500 font-black border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4">Role / Share</th>
                    <th className="py-3 px-4">Commission Credit</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-500">WAL-99821</td>
                    <td className="py-3.5 px-4 font-black text-[#01295A]">TOPIQ-ADM-0001</td>
                    <td className="py-3.5 px-4">Franchisee (15%)</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">+₹150</td>
                    <td className="py-3.5 px-4"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">Credited</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}