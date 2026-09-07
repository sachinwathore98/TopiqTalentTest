'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
      const cleanBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

      const response = await fetch(`${cleanBaseUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials or login failed.');
      }

      // Save Authentication and User Metadata to LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userName', data.name);
      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id);
      }

      // Exact Role-Based Redirection Routing
      switch (data.role) {
        case 'super_admin':
        case 'admin':
          router.push('/superadmin');
          break;
        case 'asm':
        case 'franchise':
        case 'agent':
          router.push('/partners/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        default:
          router.push('/');
      }

    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 text-[#01295A]">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
            Secure Authentication
          </span>
          <h1 className="text-2xl font-black mt-2">TOPIQ Talent Test</h1>
          <p className="text-xs text-slate-500 font-semibold">Sign in to your administrative or partner portal</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="topiqtalenttest@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FE7C02] focus:outline-none text-xs font-semibold bg-slate-50/50"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FE7C02] focus:outline-none text-xs font-semibold bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl transition duration-200 text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}