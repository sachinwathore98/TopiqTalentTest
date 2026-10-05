'use client';
import React, { useState } from 'react';
import { Trash2, FileText, X } from 'lucide-react';

export default function UsersDirectory({ usersList, handleOpenEditUser, handleToggleUserStatus, handleDeleteUser, fetchAllDashboardData, apiBaseUrl }) {
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partnerAdmissions, setPartnerAdmissions] = useState([]);
  const [loadingAdmissions, setLoadingAdmissions] = useState(false);

  const filteredUsers = usersList.filter(u => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  const handleInspectDownstream = async (partner) => {
    setSelectedPartner(partner);
    setLoadingAdmissions(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/superadmin/admissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.admissions) {
        const filtered = data.admissions.filter(adm => 
          adm.franchiseId?.toString() === partner._id.toString() ||
          adm.asmId?.toString() === partner._id.toString() ||
          adm.coordinatorId?.toString() === partner._id.toString()
        );
        setPartnerAdmissions(filtered);
      }
    } catch (err) {
      console.error('Error fetching downstreams:', err);
      setPartnerAdmissions([]);
    } finally {
      setLoadingAdmissions(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6 text-[#01295A]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h3 className="text-lg font-black text-[#01295A]">Downstream Network & Users Directory</h3>
          <p className="text-xs text-slate-500 font-medium">Manage downstream partners, edit profiles, toggle active/deactivated statuses, and view student admissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="asm">ASM</option>
            <option value="coordinator">Coordinator</option>
            <option value="agent">Agent</option>
            <option value="student">Student</option>
          </select>
          <button onClick={fetchAllDashboardData} className="px-4 py-2 bg-[#01295A] text-white rounded-xl text-xs font-black cursor-pointer">
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 uppercase text-slate-500 font-black border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email / Phone</th>
              <th className="py-3 px-4">Role Tier</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredUsers.map((u, idx) => (
              <tr key={u._id || idx} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-black text-[#01295A]">{u.name}</td>
                <td className="py-3.5 px-4 font-mono">{u.email}<br/><span className="text-[10px] text-slate-400">{u.phone || 'No phone'}</span></td>
                <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">{u.role}</span></td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${u.status === 'active' || !u.status ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {u.status || 'active'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1.5">
                  <button 
                    onClick={() => handleInspectDownstream(u)} 
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] font-bold cursor-pointer inline-flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> Admissions
                  </button>
                  <button onClick={() => handleOpenEditUser(u)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleToggleUserStatus(u._id, u.status || 'active')} 
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${u.status === 'active' || !u.status ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
                  >
                    {u.status === 'active' || !u.status ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(u._id)} 
                    className="p-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 cursor-pointer inline-block"
                    title="Delete User"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedPartner(null)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black">Admissions under {selectedPartner.name}</h3>
            {loadingAdmissions ? (
              <p className="text-xs text-slate-400 uppercase font-bold py-8 text-center">Loading admissions...</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-400 font-black border-b">
                  <tr>
                    <th className="p-3">Admission ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Exam / Class</th>
                    <th className="p-3">Fee Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-slate-700">
                  {partnerAdmissions.map((adm, i) => (
                    <tr key={i}>
                      <td className="p-3 font-mono font-black">{adm.admissionId}</td>
                      <td className="p-3 font-bold">{adm.studentName}</td>
                      <td className="p-3">{adm.examCategory}</td>
                      <td className="p-3 font-mono">₹{adm.admissionAmount}</td>
                    </tr>
                  ))}
                  {partnerAdmissions.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-6 text-slate-400">No admissions found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}