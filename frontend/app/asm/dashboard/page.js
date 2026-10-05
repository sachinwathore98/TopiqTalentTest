'use client';
import React, { useState, useEffect } from 'react';
import { Layers, Wallet, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function AsmDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FE7C02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">ASM Portal</span>
            <span className="text-xs text-slate-400 font-medium">5% Commission Tier</span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">ASM Coordination Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-[#FE7C02]" /> Region Assigned: North Maharashtra
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider">Assigned Coordinators</span>
            <Layers className="w-5 h-5 text-[#FE7C02]" />
          </div>
          <div className="text-3xl font-black">14</div>
          <p className="text-xs text-slate-400 font-medium">Active across district</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider">Total 5% Earnings</span>
            <Wallet className="w-5 h-5 text-[#FE7C02]" />
          </div>
          <div className="text-3xl font-black">₹13,750</div>
          <p className="text-xs text-emerald-600 font-bold">Auto-credited to wallet</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider">Settlement Status</span>
            <CheckCircle2 className="w-5 h-5 text-[#FE7C02]" />
          </div>
          <div className="text-3xl font-black">Eligible</div>
          <p className="text-xs text-slate-400 font-medium">10-day settlement active</p>
        </div>
      </div>

      {/* Admissions passing through ASM */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#01295A]">Admissions Passing Through ASM</h3>
          <button className="text-xs font-bold text-[#FE7C02] hover:underline flex items-center gap-1">
            View Ledger <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black">
              <tr>
                <th className="p-4">Admission ID</th>
                <th className="p-4">Coordinator Name</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Fee Amount</th>
                <th className="p-4">5% Share</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="p-4 font-bold">TTT-2026-9041</td>
                <td className="p-4">Sanjay Patil</td>
                <td className="p-4">Pooja Kulkarni</td>
                <td className="p-4">₹1,000</td>
                <td className="p-4 text-emerald-600 font-bold">₹50</td>
                <td className="p-4"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold text-[10px]">Credited</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}