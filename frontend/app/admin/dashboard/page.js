'use client';
import React, { useState } from 'react';
import { Users, ShieldCheck, CreditCard, Search, PlusCircle, CheckCircle2, AlertCircle, Building, Phone, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock student roster (Connected to your backend database)
  const [students, setStudents] = useState([
    { id: 1, name: 'Rahul Sharma', phone: '8956643326', studentClass: 'Class 9 & 10', city: 'Ch. Sambhajinagar', is_paid: true, branch: 'Main Branch' },
    { id: 2, name: 'Priya Deshmukh', phone: '9822113344', studentClass: 'Class 7', city: 'Pune', is_paid: false, branch: 'Online Self-Reg' },
    { id: 3, name: 'Amit Kulkarni', phone: '9422334455', studentClass: 'Class 12', city: 'Nashik', is_paid: true, branch: 'Nashik Franchise' }
  ]);

  // Offline registration form state (for franchise owners registering cash/UPI walk-ins)
  const [newStudent, setNewStudent] = useState({
    name: '',
    phone: '',
    email: '',
    studentClass: 'Class 9',
    city: '',
    district: '',
    amountPaid: '₹500'
  });

  const handleOfflineRegistration = (e) => {
    e.preventDefault();
    const createdStudent = {
      id: students.length + 1,
      name: newStudent.name,
      phone: newStudent.phone,
      studentClass: newStudent.studentClass,
      city: newStudent.city || 'Ch. Sambhajinagar',
      is_paid: true, // Offline registrations via franchise are pre-paid
      branch: 'Franchise Partner'
    };
    setStudents([createdStudent, ...students]);
    setIsAddModalOpen(false);
    setNewStudent({ name: '', phone: '', email: '', studentClass: 'Class 9', city: '', district: '', amountPaid: '₹500' });
    alert('Student registered successfully! Admission unlocked and login credentials dispatched.');
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.phone.includes(searchTerm) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER & STATS */}
        <div className="bg-[#01295A] text-white rounded-3xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Management Portal
            </span>
            <h1 className="text-2xl md:text-4xl font-black">Admin & Franchise Dashboard</h1>
            <p className="text-xs md:text-sm text-slate-300">
              Manage student admissions, track fee payments, and register offline walk-in candidates.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#FE7C02] hover:bg-[#E06B00] text-white font-black px-5 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Offline Student</span>
          </button>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Registrations</div>
            <div className="text-3xl font-black text-[#01295A]">{students.length} Students</div>
            <div className="text-xs text-emerald-600 font-bold">↑ Active growth across Maharashtra</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Paid Admissions</div>
            <div className="text-3xl font-black text-emerald-600">{students.filter(s => s.is_paid).length} Verified</div>
            <div className="text-xs text-slate-500 font-bold">Full access to 100-Day tests</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Free Explorers</div>
            <div className="text-3xl font-black text-amber-500">{students.filter(s => !s.is_paid).length} Pending</div>
            <div className="text-xs text-slate-500 font-bold">Reviewing sample tests</div>
          </div>
        </div>

        {/* STUDENT ROSTER SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-[#01295A]">Enrolled Student Records</h3>
            
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by name, mobile, city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Source / Branch</th>
                  <th className="py-3 px-4">Admission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-black text-[#01295A]">{s.name}</td>
                    <td className="py-4 px-4 font-mono">{s.phone}</td>
                    <td className="py-4 px-4">{s.studentClass}</td>
                    <td className="py-4 px-4">{s.city}</td>
                    <td className="py-4 px-4 text-indigo-600 font-bold">{s.branch}</td>
                    <td className="py-4 px-4">
                      {s.is_paid ? (
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Paid & Confirmed
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Free Explorer
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* OFFLINE REGISTRATION MODAL (FOR FRANCHISE/ADMIN) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 relative shadow-2xl border border-slate-200 text-[#01295A]">
            <div className="space-y-1 mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black">Offline Franchise Registration</h3>
              <p className="text-xs text-slate-500 font-semibold">Record cash/UPI payment and grant instant access</p>
            </div>

            <form onSubmit={handleOfflineRegistration} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50"
                  placeholder="Enter full name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50"
                    placeholder="10-digit mobile"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Class / Category *</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-white cursor-pointer"
                    value={newStudent.studentClass}
                    onChange={(e) => setNewStudent({ ...newStudent, studentClass: e.target.value })}
                  >
                    {['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9 & 10', 'Class 11 & 12', 'Competitive (12th & Above)'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50"
                    placeholder="City name"
                    value={newStudent.city}
                    onChange={(e) => setNewStudent({ ...newStudent, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Fee Collected *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 font-mono text-emerald-600"
                    value={newStudent.amountPaid}
                    onChange={(e) => setNewStudent({ ...newStudent, amountPaid: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-xl transition text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#FE7C02] hover:bg-[#E06B00] text-white font-black py-3 rounded-xl transition shadow-md text-xs cursor-pointer"
                >
                  Confirm & Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}