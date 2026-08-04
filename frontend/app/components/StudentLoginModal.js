'use client';
import React, { useState } from 'react';
import { X, Phone, Lock, LogIn } from 'lucide-react';

export default function StudentLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({ name: 'Student Participant', phone, studentClass: 'Class 8' });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 relative shadow-2xl border border-[#C0C0C0]/60 text-[#01295A]">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#01295A] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-xl font-black text-[#01295A]">Student Login</h3>
            <p className="text-xs text-slate-500 font-semibold">Access your daily test dashboard</p>
          </div>

          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input 
              type="tel" 
              required 
              placeholder="Registered Mobile Number" 
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#C0C0C0]/60 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02]" 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input 
              type="password" 
              required 
              placeholder="Password / OTP" 
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#C0C0C0]/60 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02]" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#FE7C02] text-white font-black py-3 rounded-xl shadow-md hover:bg-[#E06B00] transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}