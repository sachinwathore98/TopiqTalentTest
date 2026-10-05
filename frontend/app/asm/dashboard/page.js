'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, Wallet, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function AsmDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ admissionsCount: 0, totalCommission: 0 });
  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'asm'].includes(role)) {
      router.push('/login');
      return;
    }
    // Fetch ASM data from backend API
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#FE7C02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">ASM Portal</span>
              <span className="text-xs text-slate-400 font-medium">5% Commission Tier</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">ASM Coordination Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Track regional downstream admissions passing through assigned coordinators and 5% commission earnings.</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-xs px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Assigned Coordinators</span>
            <div className="text-3xl font-black">14</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Total 5% Earnings</span>
            <div className="text-3xl font-black">₹13,750</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Wallet Settlement</span>
            <div className="text-3xl font-black">Eligible</div>
          </div>
        </div>

      </div>
    </div>
  );
}