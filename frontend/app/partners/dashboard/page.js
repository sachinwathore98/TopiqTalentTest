'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ShieldCheck, Wallet, ArrowUpRight, CheckCircle2, Building, RefreshCw, Layers } from 'lucide-react';

export default function PartnerRoleDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    roleName: '',
    commissionRate: '0%',
    walletBalance: 0,
    referredStudents: []
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set commission title based on role
    let rate = '0%';
    if (role === 'agent') rate = '20%';
    else if (role === 'franchise') rate = '15%';
    else if (role === 'asm') rate = '5%';

    setDashboardData(prev => ({ ...prev, roleName: role?.toUpperCase() || 'PARTNER', commissionRate: rate }));
    fetchPartnerMetrics();
  }, [router]);

  const fetchPartnerMetrics = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDashboardData(prev => ({
          ...prev,
          walletBalance: data.walletBalance || 0,
          referredStudents: data.referredStudents || []
        }));
      }
    } catch (err) {
      console.error('Error fetching partner data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-[#01295A] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              {dashboardData.roleName} Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">Ecosystem Partner Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-300">Track student admissions and automated commission earnings ({dashboardData.commissionRate} split).</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchPartnerMetrics}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/wallet')}
              className="px-4 py-3 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Withdraw Funds</span>
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-[10px] font-black uppercase text-slate-400">Commission Share Tier</div>
            <div className="text-3xl font-black text-[#FE7C02]">{dashboardData.commissionRate}</div>
            <div className="text-xs text-slate-500 font-bold">Applied on ₹1,100 test fee</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-[10px] font-black uppercase text-slate-400">Available Wallet Balance</div>
            <div className="text-3xl font-black text-emerald-600 font-mono">
              {loading ? '...' : `₹${dashboardData.walletBalance.toLocaleString('en-IN')}`}
            </div>
            <div className="text-xs text-slate-500 font-bold">Ready for bank transfer</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-[10px] font-black uppercase text-slate-400">Referred Admissions</div>
            <div className="text-3xl font-black text-[#01295A]">{dashboardData.referredStudents.length} Students</div>
            <div className="text-xs text-emerald-600 font-bold">Verified registrations</div>
          </div>
        </div>

        {/* REFERRED STUDENTS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-black text-[#01295A]">Referred Student Admissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Commission Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {dashboardData.referredStudents.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-black text-[#01295A]">{student.name}</td>
                    <td className="py-3.5 px-4 font-mono">{student.phone}</td>
                    <td className="py-3.5 px-4">{student.studentClass}</td>
                    <td className="py-3.5 px-4">{student.city}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">
                      ₹{dashboardData.commissionRate === '20%' ? '220' : dashboardData.commissionRate === '15%' ? '165' : '55'}
                    </td>
                  </tr>
                ))}
                {dashboardData.referredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">No referred student admissions recorded yet. Share your referral code or link!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}