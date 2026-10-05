'use client';
import React, { useState } from 'react';
import { Trash2, Shield, UserCheck, UserX } from 'lucide-react';

export default function UsersDirectory({ usersList, handleOpenEditUser, handleToggleUserStatus, handleDeleteUser, fetchAllDashboardData }) {
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = usersList.filter(u => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h3 className="text-lg font-black text-[#01295A]">Ecosystem Users & Hierarchy Directory</h3>
          <p className="text-xs text-slate-500 font-medium">Manage all hierarchical accounts (Super Admin, Admin, Franchise, ASM, Coordinator, Agent, Student).</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border text-xs bg-slate-50 font-semibold text-[#01295A] outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="franchise">Franchise</option>
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
              <th className="py-3 px-4">GST / Details</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredUsers.map((u, idx) => (
              <tr key={u._id || idx} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-black text-[#01295A]">{u.name}</td>
                <td className="py-3.5 px-4 font-mono">{u.email}<br/><span className="text-[10px] text-slate-400">{u.phone || 'No phone'}</span></td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px]">{u.gstNumber || 'N/A'}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${u.status === 'active' || !u.status ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {u.status || 'active'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
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
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-400 font-bold uppercase text-[11px]">
                  No users found for this role filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}