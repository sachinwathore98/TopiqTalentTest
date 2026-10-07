'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export default function PublicRegistrationPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('Class 8');
  const [feeDetails, setFeeDetails] = useState({ testFee: 1999, originalFee: 2499 });
  const [loadingFee, setLoadingFee] = useState(true);
  const [studentForm, setStudentForm] = useState({
    studentName: '', mobile: '', email: '', school: '', parentDetails: '', address: ''
  });

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const cleanBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    fetchLiveFeeForClass(selectedClass);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
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
            testFee: found.testFee || 1999,
            originalFee: found.originalFee || found.testFee || 2499
          });
        }
      }
    } catch (err) {
      console.error('Failed to sync live fee:', err);
    } finally {
      setLoadingFee(false);
    }
  };

  const handlePublicRazorpayPayment = async (e) => {
    e.preventDefault();
    try {
      const orderAmountInPaise = Math.round(Number(feeDetails.testFee || 0) * 100);
      const orderRes = await fetch(`${cleanBaseUrl}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderAmountInPaise,
          currency: 'INR'
        })
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message || 'Failed to initiate payment gateway order.');

      const orderAmount = orderData.amount || orderAmountInPaise;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: orderData.currency || 'INR',
        name: 'TOPIQ Talent Test (TTT)',
        description: `Exam Registration for ${selectedClass}`,
        order_id: orderData.order_id || orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${cleanBaseUrl}/api/payment/verify-and-register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userData: {
                  name: studentForm.studentName,
                  phone: studentForm.mobile,
                  email: studentForm.email,
                  studentClass: selectedClass,
                  school: studentForm.school || '',
                  parentDetails: studentForm.parentDetails || '',
                  address: studentForm.address || '',
                  password: 'Topiq@123',
                  city: '',
                  district: '',
                  state: 'Maharashtra',
                  pincode: '',
                  registrationFee: feeDetails.testFee
                }
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.message || 'Payment verification failed.');

            if (verifyData.token) {
              localStorage.setItem('token', verifyData.token);
              localStorage.setItem('role', verifyData.role || 'student');
            }

            const admissionId = verifyData.admission?.admissionId || 'TOPIQ-ADM-000001';
            window.location.href = `/student/success?admissionId=${admissionId}`;
          } catch (verifyErr) {
            alert(verifyErr.message || 'Something went wrong during verification.');
          }
        },
        prefill: {
          name: studentForm.studentName,
          email: studentForm.email,
          contact: studentForm.mobile
        },
        theme: { color: '#FE7C02' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message || 'Error processing checkout.');
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
        <p className="text-xs text-slate-500 font-semibold">Fill your details and select your class to complete registration securely.</p>
      </div>

      <form onSubmit={handlePublicRazorpayPayment} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Select Class / Category *</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 cursor-pointer outline-none"
          >
            {[
              'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 
              'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 
              'Competitive / Above 12'
            ].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label><input type="text" required value={studentForm.studentName} onChange={e => setStudentForm({ ...studentForm, studentName: e.target.value })} placeholder="Student Name" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
          <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Mobile Number *</label><input type="text" required value={studentForm.mobile} onChange={e => setStudentForm({ ...studentForm, mobile: e.target.value })} placeholder="Mobile Number" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 font-mono" /></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label><input type="email" required value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
          <div><label className="block text-[10px] font-black uppercase text-slate-500 mb-1">School Name</label><input type="text" value={studentForm.school} onChange={e => setStudentForm({ ...studentForm, school: e.target.value })} placeholder="School Name" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" /></div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Parent / Guardian Details</label>
            <input type="text" value={studentForm.parentDetails} onChange={e => setStudentForm({ ...studentForm, parentDetails: e.target.value })} placeholder="Parent Name & Contact" className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Address</label>
            <textarea value={studentForm.address} onChange={e => setStudentForm({ ...studentForm, address: e.target.value })} placeholder="Residential Address" rows={3} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 resize-none" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-5 rounded-2xl border-2 border-orange-200 flex justify-between items-center shadow-inner">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md inline-block">Special Discount Active</span>
            <div className="text-xs font-black uppercase text-slate-700 block">Registration Fee:</div>
          </div>
          <div className="text-right">
            {loadingFee ? <span className="text-xs font-bold text-slate-400">Syncing...</span> : (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-mono text-emerald-600">₹{feeDetails.testFee}</span>
                  {feeDetails.originalFee > feeDetails.testFee && <span className="text-base font-bold font-mono text-slate-400 line-through">₹{feeDetails.originalFee}</span>}
                </div>
                {discountPercent > 0 && <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider">You Save {discountPercent}% Off Today!</span>}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#FE7C02] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl text-xs shadow-xl cursor-pointer transition flex items-center justify-center gap-2 uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          <span>Pay ₹{feeDetails.testFee} & Register Now</span>
        </button>
      </form>
    </div>
  );
}