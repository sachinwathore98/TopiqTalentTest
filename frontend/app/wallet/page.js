'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Building, ArrowDownRight, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export default function WalletDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchWalletData();
  }, [router]);

  const fetchWalletData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWalletBalance(data.walletBalance || 0);
        if (data.bankDetails) {
          setBankDetails(data.bankDetails);
        }
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();
    setMessage(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/wallet/bank-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bankDetails)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Bank details saved successfully.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save bank details.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error while saving bank details.' });
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBaseUrl}/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: withdrawAmount })
      });
      const data = await res.json();
      if (data.success) {
        setWalletBalance(data.remainingBalance);
        setWithdrawAmount('');
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message || 'Withdrawal request failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error during withdrawal request.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-[#01295A] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Partner Payout Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">Commission Wallet & Withdrawals</h1>
            <p className="text-xs sm:text-sm text-slate-300">Manage earnings (ASM 5%, Franchise 15%, Agent 20%) and direct bank transfers.</p>
          </div>
          <button 
            onClick={fetchWalletData}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* WALLET BALANCE & WITHDRAWAL */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400">Available Wallet Balance</div>
              <div className="text-4xl font-black text-emerald-600 font-mono">
                {loading ? 'Loading...' : `₹${walletBalance.toLocaleString('en-IN')}`}
              </div>
              <p className="text-xs text-slate-500 font-medium">Credited instantly upon student payment verification.</p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="100"
                  max={walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount to withdraw"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || walletBalance <= 0}
                className="w-full py-3.5 bg-[#FE7C02] hover:bg-orange-600 text-white font-black rounded-xl text-xs transition shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Request Bank Payout</span>
              </button>
            </form>
          </div>

          {/* BANK ACCOUNT DETAILS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-[#01295A]" />
              <h3 className="text-base font-black text-[#01295A]">Registered Bank Account</h3>
            </div>

            <form onSubmit={handleSaveBank} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                  placeholder="As per bank passbook"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                    placeholder="SBIN000XXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Bank Name *</label>
                  <input
                    type="text"
                    required
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    placeholder="State Bank of India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] outline-none bg-slate-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#01295A] hover:bg-blue-900 text-white font-black rounded-xl text-xs transition shadow-md cursor-pointer mt-2"
              >
                Save Bank Details
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}