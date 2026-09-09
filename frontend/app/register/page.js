'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, ShieldCheck } from 'lucide-react';

export default function PublicRegistrationPage() {
  const [selectedClass, setSelectedClass] = useState('Class 8');
  const [feeDetails, setFeeDetails] = useState({ testFee: 1100, originalFee: 1500 });
  const [loadingFee, setLoadingFee] = useState(true);

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const cleanBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    fetchLiveFeeForClass(selectedClass);
  }, [selectedClass]);

  const fetchLiveFeeForClass = async (className) => {
    setLoadingFee(true);
    try {
      const res = await fetch(`${cleanBaseUrl}/api/superadmin/fees`);
      const data = await res.json();
      if (data.success && data.fees) {
        const found = data.fees.find(f => f.className === className);
        if (found) {
          setFeeDetails({
            testFee: found.testFee || 1100,
            originalFee: found.originalFee || found.testFee || 1500
          });
        } else {
          setFeeDetails({ testFee: 1100, originalFee: 1500 });
        }
      }
    } catch (err) {
      console.error('Failed to sync live fee:', err);
    } finally {
      setLoadingFee(false);
    }
  };

  const discountPercent = feeDetails.originalFee > feeDetails.testFee 
    ? Math.round(((feeDetails.originalFee - feeDetails.testFee) / feeDetails.originalFee) * 100) 
    : 0;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-slate-200 mt-8 space-y-6 text-[#01295A]">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
          <Flame className="w-3.5 h-3.5 fill-rose-600" />
          <span>Limited Time Flash Offer – Secure Your Slot Now!</span>
        </div>
        <h2 className="text-2xl font-black">Student Examination Entry</h2>
        <p className="text-xs text-slate-500 font-semibold">Select your class below to unlock special promotional scholarship pricing.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Select Class / Category *</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 cursor-pointer focus:ring-2 focus:ring-[#FE7C02] outline-none"
          >
            {[
              'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 
              'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 
              '12th & Above & Competitive Exams'
            ].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-5 rounded-2xl border-2 border-orange-200 flex justify-between items-center shadow-inner">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md inline-block">
              Special Discount Active
            </span>
            <div className="text-xs font-black uppercase text-slate-700 block">Applicable Registration Fee:</div>
          </div>

          <div className="text-right">
            {loadingFee ? (
              <span className="text-xs font-bold text-slate-400">Syncing...</span>
            ) : (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-mono text-emerald-600">₹{feeDetails.testFee}</span>
                  {feeDetails.originalFee > feeDetails.testFee && (
                    <span className="text-base font-bold font-mono text-slate-400 line-through">₹{feeDetails.originalFee}</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    You Save {discountPercent}% Off Today!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => alert(`Proceeding to Razorpay payment of ₹{feeDetails.testFee} for ${selectedClass}`)}
          className="w-full py-4 bg-gradient-to-r from-[#FE7C02] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl text-xs shadow-xl cursor-pointer transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          <span>Lock In Offer Price of</span>
          <span className="font-mono text-base underline decoration-amber-200">₹{feeDetails.testFee}</span>
          {feeDetails.originalFee > feeDetails.testFee && (
            <span className="font-mono text-orange-200 line-through text-xs">₹{feeDetails.originalFee}</span>
          )}
          <span>& Register Now</span>
        </button>
      </div>
    </div>
  );
}