'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, BookOpen, ArrowRight, Download } from 'lucide-react';

export default function StudentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const admissionId = searchParams.get('admissionId');
  const [admissionDetails, setAdmissionDetails] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <div>
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Admission Confirmed</span>
          <h1 className="text-xl font-black text-[#01295A] mt-2">Registration Successful!</h1>
          <p className="text-xs text-slate-500 mt-1">Your payment was processed successfully and your admission has been registered in the system.</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border text-left space-y-2">
          <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Admission ID:</span> <span className="font-mono font-black text-[#01295A]">{admissionId || 'TOPIQ-ADM-000001'}</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Exam Track:</span> <span className="font-bold text-indigo-600">100-Day MCQ Challenge</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Status:</span> <span className="font-bold text-emerald-600">Confirmed & Commission Credited</span></div>
        </div>

        <div className="space-y-2">
          <button onClick={() => router.push('/login')} className="w-full py-3.5 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-2">
            Proceed to Student Exam Login <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}