'use client';
import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TestFeesControl() {
  const [feesList, setFeesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);
  const [updatingClass, setUpdatingClass] = useState(null);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('superAdminToken');
      const res = await fetch('https://topiq-talent-test.onrender.com/api/superadmin/fees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        const formatted = data.fees.map(f => ({
          ...f,
          editOfferFee: f.testFee || '',
          editOriginalFee: f.originalFee || f.testFee || ''
        }));
        setFeesList(formatted);
      }
    } catch (err) {
      console.error('Error fetching fees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleFeeChange = (className, field, value) => {
    setFeesList(prev => prev.map(item => 
      item.className === className ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async (item) => {
    setUpdatingClass(item.className);
    setStatusMsg(null);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('superAdminToken');
      const res = await fetch('https://topiq-talent-test.onrender.com/api/superadmin/fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          className: item.className,
          testFee: Number(item.editOfferFee),
          originalFee: Number(item.editOriginalFee),
          passingMarks: item.passingMarks,
          totalMarks: item.totalMarks
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: `Updated dual pricing for ${item.className} successfully!` });
        fetchFees();
      } else {
        throw new Error(data.message || 'Failed to update pricing');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Server connection error.' });
    } finally {
      setUpdatingClass(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs font-bold text-slate-500">Loading fee structure matrix...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-[#01295A]">Master Test Fee Matrix & Dual Pricing Control</h2>
        <p className="text-xs text-slate-500 font-semibold">Set strikethrough original prices and promotional offer prices to grab visitor attention.</p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <th className="p-4">Class / Category</th>
              <th className="p-4">Currently Live (Offer / Original)</th>
              <th className="p-4">Edit Offer Price (₹)</th>
              <th className="p-4">Edit Strikethrough Real Price (₹)</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-[#01295A]">
            {feesList.map((item) => (
              <tr key={item.className} className="hover:bg-slate-50/50 transition">
                <td className="p-4 font-black">{item.className}</td>
                <td className="p-4 font-mono">
                  <span className="text-emerald-600 font-bold">₹{item.testFee}</span>
                  <span className="text-slate-400 line-through ml-2">₹{item.originalFee || item.testFee}</span>
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={item.editOfferFee}
                    onChange={(e) => handleFeeChange(item.className, 'editOfferFee', e.target.value)}
                    className="w-32 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50"
                    placeholder="Offer Price"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={item.editOriginalFee}
                    onChange={(e) => handleFeeChange(item.className, 'editOriginalFee', e.target.value)}
                    className="w-32 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50"
                    placeholder="Original Price"
                  />
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleSave(item)}
                    disabled={updatingClass === item.className}
                    className="px-4 py-2 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{updatingClass === item.className ? 'Saving...' : 'Save & Sync'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}