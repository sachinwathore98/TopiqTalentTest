'use client';
import React, { useState, useEffect } from 'react';

export default function PublicRegistrationPage() {
  const [selectedClass, setSelectedClass] = useState('Class 8');
  const [feeDetails, setFeeDetails] = useState({ testFee: 1100, originalFee: 1500 });
  const [loadingFee, setLoadingFee] = useState(true);

  // Auto-sanitize API URL to prevent trailing slash errors
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
          setFeeDetails({ testFee: 1100, originalFee: 1500 }); // Fallback default
        }
      }
    } catch (err) {
      console.error('Failed to sync live fee:', err);
    } finally {
      setLoadingFee(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-slate-200 mt-8 space-y-6 text-[#01295A]">
      <div>
        <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
          Live Auto-Sync Registration
        </span>
        <h2 className="text-2xl font-black mt-2">Student Examination Entry</h2>
        <p className="text-xs text-slate-500 font-semibold">Select your class to view the dynamically updated dual registration fee.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Select Class / Category *</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 cursor-pointer"
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

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
          <span className="text-xs font-black uppercase text-slate-600">Applicable Registration Fee:</span>
          <div className="flex items-center gap-2">
            {loadingFee ? (
              <span className="text-xs font-bold text-slate-400">Syncing...</span>
            ) : (
              <>
                <span className="text-2xl font-black font-mono text-emerald-600">₹{feeDetails.testFee}</span>
                {feeDetails.originalFee > feeDetails.testFee && (
                  <span className="text-sm font-bold font-mono text-slate-400 line-through">₹{feeDetails.originalFee}</span>
                )}
              </>
            )}
          </div>
        </div>

        <button 
          onClick={() => alert(`Proceeding to Razorpay payment of ₹${feeDetails.testFee} for ${selectedClass}`)}
          className="w-full py-3.5 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs shadow-md cursor-pointer transition flex items-center justify-center gap-2"
        >
          <span>Proceed to Pay</span>
          <span className="font-mono font-bold">₹{feeDetails.testFee}</span>
          {feeDetails.originalFee > feeDetails.testFee && (
            <span className="font-mono text-orange-200 line-through text-[11px]">₹{feeDetails.originalFee}</span>
          )}
        </button>
      </div>
    </div>
  );
}