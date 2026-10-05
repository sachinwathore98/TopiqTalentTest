'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Wallet, CheckCircle2, FileText } from 'lucide-react';

export default function CoordinatorDashboard() {
  const router = useRouter();
  const [admissionForm, setAdmissionForm] = useState({ studentName: '', mobile: '', email: '', examCategory: 'Group C', admissionAmount: 1000 });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'coordinator'].includes(role)) {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleCreateAdmission = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admissions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(admissionForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create admission');

      setSuccessMsg(`Admission created successfully! ID: ${data.admission.admissionId}`);
      setAdmissionForm({ studentName: '', mobile: '', email: '', examCategory: 'Group C', admissionAmount: 1000 });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#FE7C02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Coordinator Portal</span>
              <span className="text-xs text-slate-400 font-medium">20% Commission Tier</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">Exam & Admission Coordinator Panel</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Create new student exam admissions and track automatic 20% wallet credits[cite: 17].</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-xs px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Create Admission Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-black text-[#01295A] uppercase tracking-wider flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#FE7C02]" /> Create New Student Admission
          </h2>

          {successMsg && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">{successMsg}</div>}
          {errorMsg && <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200">{errorMsg}</div>}

          <form onSubmit={handleCreateAdmission} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={admissionForm.studentName}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, studentName: e.target.value })}
                  placeholder="Enter student name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={admissionForm.mobile}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, mobile: e.target.value })}
                  placeholder="Enter 10-digit mobile"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Exam Category *</label>
                <select
                  value={admissionForm.examCategory}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, examCategory: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] font-medium cursor-pointer"
                >
                  <option value="Group A">Group A (Class 1-2)</option>
                  <option value="Group B">Group B (Class 3-4)</option>
                  <option value="Group C">Group C (Class 5-6)</option>
                  <option value="Group D">Group D (Class 7-8)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-[#01295A] tracking-wider mb-1.5">Admission Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={admissionForm.admissionAmount}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, admissionAmount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FE7C02] hover:bg-[#e06d02] text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg mt-2"
            >
              Submit Admission & Trigger Automatic Commission
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}