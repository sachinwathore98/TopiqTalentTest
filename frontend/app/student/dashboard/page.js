'use client';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, CreditCard, Award, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

export default function StudentDashboard() {
  const [student, setStudent] = useState({
    name: 'Rahul Sharma',
    studentClass: 'Class 9 & 10 (Group C)',
    is_paid: false // Toggle this to true to see unlocked state
  });
  const [paying, setPaying] = useState(false);

  const handlePayAdmission = () => {
    setPaying(true);
    // Integrate Razorpay / PhonePe payment gateway SDK here
    setTimeout(() => {
      setStudent((prev) => ({ ...prev, is_paid: true }));
      setPaying(false);
      alert('Payment successful! Your admission is now fully confirmed.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* WELCOME BANNER */}
        <div className="bg-[#01295A] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl gap-4">
          <div>
            <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">Student Portal</span>
            <h1 className="text-2xl md:text-3xl font-black mt-2">Welcome back, {student.name}!</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">Category: <span className="text-amber-400 font-bold">{student.studentClass}</span></p>
          </div>

          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl text-center backdrop-blur-md">
            <div className="text-xs text-slate-300 font-bold uppercase">Admission Status</div>
            <div className={`text-sm font-black mt-0.5 ${student.is_paid ? 'text-emerald-400' : 'text-amber-400'}`}>
              {student.is_paid ? '✅ Confirmed (Paid)' : '⏳ Free Exploration Mode'}
            </div>
          </div>
        </div>

        {/* UNPAID LOCK BANNER (OPTION 1 WORKFLOW) */}
        {!student.is_paid && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase">
                <Lock className="w-3.5 h-3.5" /> Admission Pending
              </div>
              <h3 className="text-xl md:text-2xl font-black">Unlock Your Daily 8:00 PM Live Exams & Scholarships</h3>
              <p className="text-xs md:text-sm text-amber-100 font-medium">
                You are currently exploring in free mode. Pay your admission fee to participate in the official 100-Day MCQ Challenge and compete for State Scholarships.
              </p>
            </div>
            <button
              onClick={handlePayAdmission}
              disabled={paying}
              className="bg-white text-slate-950 font-black px-6 py-4 rounded-2xl shadow-lg hover:bg-slate-100 transition shrink-0 cursor-pointer text-sm flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-orange-600" />
              <span>{paying ? 'Processing Payment...' : 'Pay Admission Fee Now'}</span>
            </button>
          </div>
        )}

        {/* DASHBOARD GRID CONTENT */}
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black">Daily 100-Day Challenge</h3>
            <p className="text-xs text-slate-500">Live test window daily at 8:00 PM - 8:40 PM.</p>
            <div className={`p-3 rounded-xl text-xs font-bold ${student.is_paid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
              {student.is_paid ? '🟢 Ready for tonight at 8:00 PM' : '🔒 Locked until admission fee is paid'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black">Sample Question Banks</h3>
            <p className="text-xs text-slate-500">Free practice mock tests available for exploration.</p>
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
              🟢 Unlocked & Accessible
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black">State Rankings & Rewards</h3>
            <p className="text-xs text-slate-500">Track your district and state positions.</p>
            <div className={`p-3 rounded-xl text-xs font-bold ${student.is_paid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
              {student.is_paid ? '🟢 Live Ranking Active' : '🔒 Locked until admission fee is paid'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}