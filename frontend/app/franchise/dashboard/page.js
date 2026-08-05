'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FranchiseDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboard, setLeaderboard] = useState([]);
  const [scope, setScope] = useState('franchise');
  const [loading, setLoading] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !['super_admin', 'admin', 'franchise_owner'].includes(role)) {
      router.push('/login');
      return;
    }
    fetchLeaderboard(scope);
  }, [scope, router]);

  const fetchLeaderboard = async (selectedScope) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leaderboard?scope=${selectedScope}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    const token = localStorage.getItem('token');
    const franchiseId = localStorage.getItem('franchiseId');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...studentForm,
          targetRole: 'student',
          franchiseId: franchiseId || null
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to enroll student.');

      setSuccessMsg(`Student ${studentForm.name} enrolled successfully!`);
      setStudentForm({ name: '', email: '', password: '' });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#01295A]">Franchise Owner Dashboard</h1>
            <p className="text-xs text-gray-500">Manage local student enrollments, regional performance, and leaderboards</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-xs px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'leaderboard' ? 'bg-[#01295A] text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Rankings & Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'admissions' ? 'bg-[#01295A] text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Offline Student Admissions
          </button>
        </div>

        {/* Tab Content: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-base font-bold text-[#01295A]">Performance Leaderboard</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Scope:</span>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#01295A]"
                >
                  <option value="franchise">Franchise-wise</option>
                  <option value="city">City-wise</option>
                  <option value="district">District-wise</option>
                  <option value="state">Maharashtra-wide</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500 text-center py-6">Loading leaderboard...</p>
            ) : leaderboard.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No ranking records found for this scope yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Correct / Wrong</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-bold text-[#01295A]">#{item.rank || idx + 1}</td>
                        <td className="py-3 px-4 font-medium">{item.student?.name || item.name}</td>
                        <td className="py-3 px-4 font-bold text-green-600">{item.score} Marks</td>
                        <td className="py-3 px-4">{item.accuracy ? `${item.accuracy}%` : 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-500">{item.correctCount !== undefined ? `${item.correctCount} / ${item.wrongCount}` : 'Detailed view'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Offline Admissions */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-xl">
            <h2 className="text-base font-bold text-[#01295A] mb-4">Enroll Local Student</h2>
            <p className="text-xs text-gray-500 mb-6">Create secure portal credentials for offline student enrollments under your franchise.</p>

            {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{successMsg}</div>}
            {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{errorMsg}</div>}

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="Enter student name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#01295A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="Enter student email"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#01295A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  placeholder="Set initial password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#01295A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#01295A] text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition shadow-md mt-4"
              >
                Enroll Student Account
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}