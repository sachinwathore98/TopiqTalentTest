'use client';
import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, GraduationCap, ShieldCheck, MapPin, AlertCircle, Lock } from 'lucide-react';

export default function StudentRegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    studentClass: 'Class 8',
    pincode: '',
    city: '',
    district: '',
    state: 'Maharashtra',
    password: '',
    role: 'student'
  });
  
  const [feeDetails, setFeeDetails] = useState({ testFee: 1100, originalFee: 1500 });
  const [loadingFee, setLoadingFee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const cleanBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    if (isOpen) {
      fetchClassFee(formData.studentClass);
    }
  }, [isOpen, formData.studentClass]);

  const fetchClassFee = async (className) => {
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
      console.error('Error fetching live fee:', err);
    } finally {
      setLoadingFee(false);
    }
  };

  if (!isOpen) return null;

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode }));

    if (pincode.length === 6) {
      setPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: postOffice.Block || postOffice.Name || '',
            district: postOffice.District || '',
            state: postOffice.State || 'Maharashtra'
          }));
        }
      } catch (err) {
        console.error('Pincode error:', err);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!isLoaded) {
      setStatusMsg({ type: 'error', text: 'Razorpay SDK failed to load.' });
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch(`${cleanBaseUrl}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: feeDetails.testFee })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Could not initiate payment order.');
      }

      const razorpayOrderId = orderData.order?.id || orderData.order_id || orderData.id;
      const razorpayAmount = orderData.order?.amount || orderData.amount || (feeDetails.testFee * 100);
      const razorpayCurrency = orderData.order?.currency || orderData.currency || 'INR';

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayAmount,
        currency: razorpayCurrency,
        name: "TOPIQ Talent Test (TTT)",
        description: `Student Registration Fee (${formData.studentClass} - ₹${feeDetails.testFee})`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${cleanBaseUrl}/api/payment/verify-and-register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userData: { ...formData, registrationFee: feeDetails.testFee }
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (verifyData.token) {
                localStorage.setItem('token', verifyData.token);
                localStorage.setItem('role', verifyData.role || 'student');
              }
              window.location.href = '/student/dashboard';
            } else {
              setStatusMsg({ type: 'error', text: verifyData.message || 'Payment verification failed.' });
              setLoading(false);
            }
          } catch (err) {
            console.error('Verification error:', err);
            setStatusMsg({ type: 'error', text: 'Server error during payment verification.' });
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#01295A" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'An error occurred.' });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl border border-[#C0C0C0]/60 text-[#01295A]">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#01295A] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-[#01295A]">Student Registration & Pay</h3>
              <p className="text-xs text-slate-500 font-semibold">Complete fee payment to access student portal</p>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full font-mono">
              <span className="text-[10px] font-black uppercase text-slate-500">Fee:</span>
              {loadingFee ? (
                <span className="text-[10px] font-bold text-slate-400">Syncing...</span>
              ) : (
                <>
                  <span className="text-xs font-black text-emerald-600">₹{feeDetails.testFee}</span>
                  {feeDetails.originalFee > feeDetails.testFee && (
                    <span className="text-[10px] font-bold text-slate-400 line-through">₹{feeDetails.originalFee}</span>
                  )}
                </>
              )}
            </div>
          </div>

          {statusMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3.5 custom-scrollbar">
            
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                required 
                placeholder="Full Name *" 
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="tel" 
                  required 
                  maxLength="10"
                  placeholder="Mobile Number *" 
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} 
                />
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  required 
                  placeholder="Email Address *" 
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="password" 
                required 
                placeholder="Create Password *" 
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              />
            </div>

            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select 
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-white cursor-pointer" 
                value={formData.studentClass}
                onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
              >
                {[
                  'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 
                  'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 
                  '12th & Above & Competitive Exams'
                ].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                required 
                maxLength="6"
                placeholder="6-digit Pincode *" 
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50" 
                value={formData.pincode}
                onChange={handlePincodeChange} 
              />
              {pincodeLoading && (
                <span className="absolute right-3 top-3 text-[10px] font-bold text-[#FE7C02] animate-pulse">
                  Fetching...
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                required 
                placeholder="City *" 
                className="w-full px-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50" 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
              />
              <input 
                type="text" 
                required 
                placeholder="District *" 
                className="w-full px-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50" 
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })} 
              />
            </div>

          </div>

          <button 
            type="submit" 
            disabled={loading || loadingFee} 
            className="w-full bg-[#FE7C02] hover:bg-[#E06B00] text-white font-black py-3.5 rounded-xl shadow-md transition cursor-pointer mt-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Initializing Payment...' : (
              <>
                <span>Pay</span>
                <span className="font-mono">₹{feeDetails.testFee}</span>
                {feeDetails.originalFee > feeDetails.testFee && (
                  <span className="font-mono text-orange-200 line-through text-xs">₹{feeDetails.originalFee}</span>
                )}
                <span>& Register</span>
              </>
            )}</span>
          </button>
        </form>
      </div>
    </div>
  );
}