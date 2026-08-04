'use client';
import React, { useState } from 'react';
import { X, User, Phone, Mail, GraduationCap, ShieldCheck, MapPin, AlertCircle, Lock } from 'lucide-react';

export default function StudentRegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    studentClass: 'Class 5',
    pincode: '',
    city: '',
    district: '',
    state: 'Maharashtra',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

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

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBaseUrl}/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && (data.success !== false)) {
        // Save token and redirect directly to student dashboard upon registration
        if (data.token) {
          localStorage.setItem('studentToken', data.token);
        }
        window.location.href = '/student/dashboard';
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Registration failed.' });
      }
    } catch {
      // Fallback demo redirect straight to student dashboard
      window.location.href = '/student/dashboard';
    } finally {
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
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-black text-[#01295A]">Free Student Sign Up</h3>
            <p className="text-xs text-slate-500 font-semibold">Register & redirect instantly to your dashboard</p>
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
                {['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Competitive (12th & Above)'].map((c) => (
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
                placeholder="6-digit Pincode (Auto-fills City & District) *" 
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
            disabled={loading} 
            className="w-full bg-[#FE7C02] hover:bg-[#E06B00] text-white font-black py-3 rounded-xl shadow-md transition cursor-pointer mt-2 text-sm"
          >
            {loading ? 'Creating Account...' : 'Register & Go to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}