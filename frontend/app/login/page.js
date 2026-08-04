'use client';
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem('studentToken', data.token);
          localStorage.setItem('userRole', data.user?.role || 'student');
        }
        window.location.href = '/student/dashboard';
      } else {
        setErrorMsg(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback demo redirect
      window.location.href = '/student/dashboard';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-[#01295A]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#01295A] text-[#FE7C02] rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-[#01295A] tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-500 font-semibold">Sign in to your TOPIQ Talent Test dashboard</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  required 
                  placeholder="student@gmail.com" 
                  className="w-full pl-10 pr-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200 outline-none font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#FE7C02] hover:bg-[#E06B00] text-white font-black py-3 rounded-xl shadow-md transition cursor-pointer text-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Don&apos;t have an account?{' '}
              <a href="/" className="text-[#FE7C02] font-black hover:underline">Register Free</a>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}