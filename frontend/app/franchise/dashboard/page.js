'use client';
import React, { useState } from 'react';
import { Users, Building, Wallet, Award, Download, Copy, CheckCircle2, TrendingUp, Sparkles, Phone, Mail } from 'lucide-react';

export default function FranchiseDashboard() {
  const [copied, setCopied] = useState(false);

  // Mock franchise branch data
  const branchInfo = {
    branchName: 'Ch. Sambhajinagar Main Branch',
    branchCode: 'CSN-01',
    ownerName: 'SW Digital Hub / Partner',
    territory: 'Ulkanagri, Chhatrapati Sambhajinagar',
    totalRegistrations: 1420,
    targetRegistrations: 3000,
    revenueSharePercentage: '40%',
    totalEarnings: '₹2,84,000',
    referralLink: 'https://topiqtalenttest.com/register?ref=CSN-01'
  };

  const branchStudents = [
    { id: 1, name: 'Atharva Joshi', phone: '9855667788', class: 'Class 10', date: 'August 2, 2026', status: 'Paid & Confirmed' },
    { id: 2, name: 'Tanvi Kulkarni', phone: '9123456789', class: 'Class 8', date: 'August 1, 2026', status: 'Paid & Confirmed' },
    { id: 3, name: 'Rohan Patil', phone: '9988776655', class: 'Class 12', date: 'July 30, 2026', status: 'Free Explorer' }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(branchInfo.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER & BRANCH CARD */}
        <div className="bg-[#01295A] text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-[#FE7C02]/30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FE7C02]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#FE7C02]/20 border border-[#FE7C02]/40 px-4 py-1.5 rounded-full text-[#FE7C02] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Franchise Partner Portal • Code: {branchInfo.branchCode}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{branchInfo.branchName}</h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium">
              Territory: <span className="text-white font-bold">{branchInfo.territory}</span>
            </p>
          </div>

          {/* REFERRAL LINK BOX */}
          <div className="bg-white/10 border border-white/20 p-5 rounded-2xl backdrop-blur-md relative z-10 w-full md:w-auto space-y-2">
            <div className="text-xs text-slate-300 font-bold uppercase">Your Branch Referral Link</div>
            <div className="flex items-center gap-2 bg-black/30 p-2 rounded-xl border border-white/10 font-mono text-xs">
              <span className="text-[#FE7C02] truncate max-w-[220px]">{branchInfo.referralLink}</span>
              <button 
                onClick={handleCopyLink}
                className="bg-[#FE7C02] hover:bg-[#E06B00] text-white px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1"
              >
                {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* METRICS & REVENUE SHARE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-orange-50 text-[#FE7C02] rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">Branch Registrations</div>
            <div className="text-3xl font-black text-[#01295A]">{branchInfo.totalRegistrations} <span className="text-sm font-semibold text-slate-500">/ {branchInfo.targetRegistrations} target</span></div>
            {/* PROGRESS BAR */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#FE7C02] h-full rounded-full" style={{ width: `${(branchInfo.totalRegistrations / branchInfo.targetRegistrations) * 100}%` }}></div>
            </div>
            <div className="text-[11px] text-slate-500 font-bold">Territory allotment threshold in progress</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">Revenue Share Earned ({branchInfo.revenueSharePercentage})</div>
            <div className="text-3xl font-black text-emerald-600">{branchInfo.totalEarnings}</div>
            <div className="text-xs text-slate-500 font-bold">Disbursed directly to branch account</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">Company HR Sponsorship</div>
            <div className="text-xl font-black text-[#01295A] mt-1">4 Salaries Sponsored</div>
            <div className="text-xs text-indigo-600 font-bold">1 Manager + 2 Telesales + 1 Receptionist</div>
          </div>

        </div>

        {/* BRANCH STUDENT ADMISSIONS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest">📋 RECENT ENROLLMENTS</span>
              <h2 className="text-xl font-black text-[#01295A] mt-0.5">Branch Student Admissions</h2>
            </div>
            <button 
              onClick={() => alert('Exporting branch student roster to CSV...')}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FE7C02]" />
              <span>Export Roster</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {branchStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 font-black text-[#01295A]">{s.name}</td>
                    <td className="py-4 px-4 font-mono">{s.phone}</td>
                    <td className="py-4 px-4">{s.class}</td>
                    <td className="py-4 px-4 text-slate-500">{s.date}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                        s.status.includes('Paid') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}