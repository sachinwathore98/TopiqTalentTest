'use client';
import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#01295A] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb / Back */}
        <div>
          <Link href="/" className="text-xs font-bold text-[#FE7C02] hover:underline uppercase tracking-wider">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-black mt-2 tracking-tight">Terms & Conditions</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Last updated: October 2026</p>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-[#01295A]">1. Agreement to Terms</h2>
            <p>
              These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Balmitra Kids Pvt. Ltd. (TOPIQ Talent Test) concerning your access to and use of the platform.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-[#01295A]">2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the platform is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site are owned or controlled by us.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-[#01295A]">3. User Representations</h2>
            <p>
              By using the TOPIQ Talent Test, you represent and warrant that all registration information you submit will be true, accurate, current, and complete, and that you will maintain the accuracy of such information.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-[#01295A]">4. Limitation of Liability</h2>
            <p>
              In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the platform.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}