'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'franchise_owner',
    franchiseId: ''
  });

  const currentUserRole = typeof window !== 'undefined' ? localStorage.getItem('role') : '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || (role !== 'super_admin' && role !== 'admin')) {
      router.push('/login');
    }
  }, [router]);

  const handleUserCreation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://topiq-talent-test.onrender.com/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseErr) {
        throw new Error('Server returned an invalid response. Please check backend connection.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user.');
      }

      setSuccessMsg(`Successfully created ${formData.targetRole} account for ${formData.name}!`);
      setFormData({ name: '', email: '', password: '', targetRole: 'franchise_owner', franchiseId: '' });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#01295A]">
              {currentUserRole === 'super_admin' ? 'Super Admin Portal' : 'Operations Admin Dashboard'}
            </h1>
            <p className="text-xs text-gray-500">Manage platform users, franchises, and ecosystem permissions</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-xs px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-base font-bold text-[#01295A] mb-4">Create New Account / User</h2>
          
          {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{successMsg}</div>}
          {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{errorMsg}</div>}

          <form onSubmit={handleUserCreation} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#01295A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#01295A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Set account password"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#01295A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Target Role</label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-[#01295A] focus:outline-none"
              >
                {currentUserRole === 'super_admin' && <option value="admin">Operations Admin</option>}
                <option value="franchise_owner">Franchise Owner</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#01295A] text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition disabled:opacity-50 shadow-md mt-4"
            >
              {loading ? 'Creating Account...' : 'Create User Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}