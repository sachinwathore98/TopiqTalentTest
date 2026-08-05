'use client';
import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Users, Laptop, Megaphone, CheckCircle2, Sparkles, MapPin, Building, Phone, Mail, User, Wallet, FileText, ArrowRight } from 'lucide-react';

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    owner_name: '',
    phone: '',
    email: '',
    pincode: '',
    city: '',
    district: '',
    state: 'Maharashtra',
    current_business: '',
    investment_capacity: '₹3,00,000 - ₹5,00,000',
    preferred_location: '',
    requirements: ''
  });

  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // AUTOMATIC PINCODE LOOKUP USING POSTAL P.I.N. API
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode }));

    if (pincode.length === 6) {
      setPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: postOffice.Block || postOffice.Name || '',
            district: postOffice.District || '',
            state: postOffice.State || 'Maharashtra'
          }));
        }
      } catch (err) {
        console.error('Pincode fetch error:', err);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBaseUrl}/franchise/enquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: 'Franchise application submitted successfully! Branch code assigned.' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Submission failed.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Unable to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  const responsibilities = [
    'Student Admissions & Parent Counselling',
    'Local Marketing, Advertising & Brand Promotion',
    'School, College, Coaching Class & Library Awareness Campaigns',
    'Student Support & Help Desk Operations',
    'Prize Distribution Event Management'
  ];

  return (
    <div className="py-10 min-h-screen bg-white text-[#01295A] px-4 md:px-6 animate-fade-in space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HERO BANNER & APPLICATION FORM GRID */}
        <div className="bg-[#01295A] text-white rounded-3xl p-8 md:p-14 shadow-2xl border border-[#FE7C02]/40 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative overflow-hidden">
          
          {/* AMBIENT GLOW */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FE7C02]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* LEFT INFO (7 COLUMNS) */}
          <div className="lg:col-span-7 animate-fade-in-left space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#FE7C02]/20 border border-[#FE7C02]/40 px-4 py-1.5 rounded-full text-[#FE7C02] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FE7C02]" />
              <span>FRANCHISE BUSINESS MODEL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] text-white tracking-tight">
              Build a Franchise Branch in Maharashtra
            </h1>

            <p className="text-[#C0C0C0] text-base md:text-lg leading-relaxed font-semibold max-w-2xl">
              Partner with Balmitra Kids Pvt. Ltd. Complete software, HR salaries, and promotional support provided.
            </p>

            {/* STATS TILES: FEE & REVENUE SHARE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* TILE 1: FRANCHISE FEE */}
              <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#FE7C02] font-mono">₹3,00,000</div>
                  <div className="text-xs text-[#C0C0C0] font-bold mt-1 uppercase tracking-wide">Franchise Fee</div>
                </div>
              </div>

              {/* TILE 2: REVENUE SHARE */}
              <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-2xl sm:text-3xl font-black text-[#FE7C02]">40%</span>
                    <span className="text-lg font-bold text-[#C0C0C0]">/</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">60%</span>
                  </div>
                  <div className="text-xs text-[#C0C0C0] font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
                    <span>Franchise (40%)</span> <span className="text-[#FE7C02]">•</span> <span>Company (60%)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT APPLICATION FORM CARD (5 COLUMNS) - SHORT & COMPACT UI */}
          <div className="lg:col-span-5 bg-white text-[#01295A] p-5 sm:p-6 rounded-3xl shadow-2xl border border-[#C0C0C0]/60 animate-fade-in-right relative z-10 flex flex-col">
            <div className="space-y-0.5 mb-3 pb-2 border-b border-slate-100">
              <h2 className="text-lg font-black text-[#01295A]">Apply for Franchise Branch</h2>
              <p className="text-[11px] text-slate-500 font-semibold">Territory allotted after target of 3,000 registrations</p>
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold mb-3 flex items-center gap-2 ${
                statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {statusMsg.type === 'success' ? <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5">
              
              {/* FULL NAME */}
              <div>
                <label className="block text-[10px] font-black uppercase text-[#01295A] mb-0.5">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                  placeholder="Enter full name"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                />
              </div>

              {/* MOBILE & EMAIL */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#01295A] mb-0.5">Mobile *</label>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#01295A] mb-0.5">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* PINCODE */}
              <div>
                <label className="block text-[10px] font-black uppercase text-[#01295A] mb-0.5">Pincode *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength="6"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                    placeholder="Enter 6-digit Pincode"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                  />
                  {pincodeLoading && (
                    <span className="absolute right-2.5 top-2.5 text-[9px] font-bold text-[#FE7C02] animate-pulse">
                      Fetching...
                    </span>
                  )}
                </div>
              </div>

              {/* CITY, DISTRICT, STATE */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#01295A] mb-0.5">City *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#01295A] mb-0.5">District *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                    placeholder="District"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#01295A] mb-0.5">State *</label>
                  <select
                    className="w-full px-1.5 py-2 rounded-xl border border-slate-200 outline-none text-[11px] font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* BUSINESS & INVESTMENT */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#01295A] mb-0.5">Current Business</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                    placeholder="e.g. Coaching"
                    value={formData.current_business}
                    onChange={(e) => setFormData({ ...formData, current_business: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#01295A] mb-0.5">Investment Cap *</label>
                  <select
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 outline-none text-[11px] font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                    value={formData.investment_capacity}
                    onChange={(e) => setFormData({ ...formData, investment_capacity: e.target.value })}
                  >
                    <option value="₹3,00,000 - ₹5,00,000">₹3L - ₹5L</option>
                    <option value="₹5,00,000 - ₹10,00,000">₹5L - ₹10L</option>
                    <option value="₹10,00,000+">₹10L+</option>
                  </select>
                </div>
              </div>

              {/* PREFERRED LOCATION */}
              <div>
                <label className="block text-[10px] font-black uppercase text-[#01295A] mb-0.5">Preferred Location *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                  placeholder="Area / Locality"
                  value={formData.preferred_location}
                  onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                />
              </div>

              {/* REQUIREMENTS */}
              <div>
                <label className="block text-[10px] font-black uppercase text-[#01295A] mb-0.5">Requirements</label>
                <textarea
                  rows="1"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 outline-none text-xs font-semibold focus:ring-2 focus:ring-[#FE7C02] bg-slate-50/50 text-[#01295A]"
                  placeholder="Any specific queries..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FE7C02] hover:bg-[#E06B00] active:scale-95 text-white font-black py-3 rounded-xl transition duration-300 shadow-md text-xs cursor-pointer flex items-center justify-center gap-1.5 mt-1"
              >
                <span>{loading ? 'Submitting...' : 'Submit Franchise Application'}</span>
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>

        </div>

        {/* RESPONSIBILITIES & COMPANY SUPPORT CONTAINER */}
        <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-[#C0C0C0]/60 shadow-xl space-y-12 animate-fade-in-up">
          
          {/* RESPONSIBILITIES */}
          <div className="space-y-6">
            <div className="border-b border-[#C0C0C0]/40 pb-4">
              <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest">📋 FRANCHISE DUTIES</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#01295A] mt-1 tracking-tight">Responsibilities of the Franchise</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {responsibilities.map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4.5 rounded-2xl border border-[#C0C0C0]/40 shadow-xs hover:border-[#FE7C02] hover:-translate-y-1 transition duration-300">
                  <div className="p-1.5 bg-[#FE7C02]/10 rounded-xl text-[#FE7C02] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs md:text-sm font-extrabold text-[#01295A] leading-snug">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COMPREHENSIVE COMPANY SUPPORT */}
          <div className="space-y-6">
            <div className="border-b border-[#C0C0C0]/40 pb-4">
              <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest">🤝 BALMITRA KIDS SUPPORT</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#01295A] mt-1 tracking-tight">Comprehensive Company Support Provided</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              
              {/* HR SUPPORT */}
              <div className="p-6 bg-white rounded-2xl border border-[#C0C0C0]/40 shadow-xs hover:border-[#FE7C02] hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-[#01295A] text-[#FE7C02] rounded-2xl flex items-center justify-center shadow-xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#01295A] mb-1">Human Resource Support</h3>
                    <p className="text-xs text-slate-500 font-semibold mb-3">Guaranteed staff salary sponsorship</p>
                  </div>
                  <ul className="text-xs text-slate-700 font-bold space-y-2 border-t border-slate-100 pt-3">
                    <li className="flex items-center gap-2"><span>•</span> Branch Manager Salary Paid by Company</li>
                    <li className="flex items-center gap-2"><span>•</span> Two Tele-Sales Executive Salaries Paid</li>
                    <li className="flex items-center gap-2"><span>•</span> One Reception Executive Salary Paid</li>
                  </ul>
                </div>
              </div>

              {/* TECH SUPPORT */}
              <div className="p-6 bg-white rounded-2xl border border-[#C0C0C0]/40 shadow-xs hover:border-[#FE7C02] hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-[#01295A] text-[#FE7C02] rounded-2xl flex items-center justify-center shadow-xs">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#01295A] mb-1">Technology Support</h3>
                    <p className="text-xs text-slate-500 font-semibold mb-3">Robust digital exam architecture</p>
                  </div>
                  <ul className="text-xs text-slate-700 font-bold space-y-2 border-t border-slate-100 pt-3">
                    <li className="flex items-center gap-2"><span>•</span> Admission Software & Student Dashboards</li>
                    <li className="flex items-center gap-2"><span>•</span> Online Exam Engine with AI Proctoring</li>
                    <li className="flex items-center gap-2"><span>•</span> Result Processing & Performance Analytics</li>
                  </ul>
                </div>
              </div>

              {/* MARKETING SUPPORT */}
              <div className="p-6 bg-white rounded-2xl border border-[#C0C0C0]/40 shadow-xs hover:border-[#FE7C02] hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-[#01295A] text-[#FE7C02] rounded-2xl flex items-center justify-center shadow-xs">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#01295A] mb-1">Marketing & Training</h3>
                    <p className="text-xs text-slate-500 font-semibold mb-3">Territory dominance & branding</p>
                  </div>
                  <ul className="text-xs text-slate-700 font-bold space-y-2 border-t border-slate-100 pt-3">
                    <li className="flex items-center gap-2"><span>•</span> Official Brand License & Territory Allocation</li>
                    <li className="flex items-center gap-2"><span>•</span> Posters, Banners, Brochures & Digital Creatives</li>
                    <li className="flex items-center gap-2"><span>•</span> Complete Franchise, Sales & Technical Training</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}