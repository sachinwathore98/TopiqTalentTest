'use client';
import React, { useState, useEffect } from 'react';

export default function PublicRegistrationPage() {
  const [selectedClass, setSelectedClass] = useState('Class 8');
  const [currentFee, setCurrentFee] = useState(1100);
  const [loadingFee, setLoadingFee] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';

  // Fetch live configured fees on component load
  useEffect(() => {
    fetchLiveFees();
  }, []);

  const fetchLiveFees = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/fees`);
      const data = await res.json();
      if (data.success && data.fees) {
        // Find fee for currently selected class
        const classFeeObj = data.fees.find(f => f.className === selectedClass);
        if (classFeeObj) {
          setCurrentFee(classFeeObj.testFee);
        }
      }
    } catch (err) {
      console.error('Failed to fetch live fees:', err);
    } finally {
      setLoadingFee(false);
    }
  };

  // Update fee dynamically when user changes the class dropdown
  const handleClassChange = async (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);

    try {
      const res = await fetch(`${apiBaseUrl}/api/superadmin/fees`);
      const data = await res.json();
      if (data.success && data.fees) {
        const classFeeObj = data.fees.find(f => f.className === newClass);
        if (classFeeObj) {
          setCurrentFee(classFeeObj.testFee);
        } else {
          setCurrentFee(1100); // Default fallback fee
        }
      }
    } catch (err) {
      console.error('Error updating fee on class change:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-slate-200 mt-8 space-y-6 text-[#01295A]">
      <div>
        <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
          Live Auto-Sync Registration
        </span>
        <h2 className="text-2xl font-black mt-2">Student Examination Entry</h2>
        <p className="text-xs text-slate-500 font-semibold">Select your class to view the dynamically updated registration fee.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Select Class / Category *</label>
          <select 
            value={selectedClass} 
            onChange={handleClassChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 cursor-pointer"
          >
            {[
              'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 
              'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 
              '12th & Above (Competitive)', 'Govt & Professional Exams'
            ].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
          <span className="text-xs font-black uppercase text-slate-600">Applicable Registration Fee:</span>
          <span className="text-2xl font-black font-mono text-emerald-600">
            {loadingFee ? 'Syncing...' : `₹${currentFee}`}
          </span>
        </div>

        <button 
          onClick={() => alert(`Proceeding to Razorpay payment of ₹${currentFee} for ${selectedClass}`)}
          className="w-full py-3.5 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs shadow-md cursor-pointer transition"
        >
          Proceed to Pay ₹{currentFee}
        </button>
      </div>
    </div>
  );
}