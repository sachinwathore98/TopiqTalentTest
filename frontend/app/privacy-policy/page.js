'use client';
import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-[#01295A] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb / Back */}
        <div>
          <Link href="/" className="text-xs font-bold text-[#FE7C02] hover:underline uppercase tracking-wider">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-black mt-2 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Last updated: October 2026</p>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-[#01295A]">1. Introduction</h2>
            <p>
              Welcome to TOPIQ Talent Test (operated by Balmitra Kids Pvt. Ltd.). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-[#01295A]">2. Information We Collect</h2>
            <p>
              We collect personal information that you provide to us when registering for the Talent Test, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us. This includes names, email addresses, phone numbers, educational institutions, and student learning groups.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-[#01295A]">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our platform for a variety of business purposes described below, including facilitating student registrations, generating digital marksheets, administering daily MCQ challenges, distributing scholarships, and communicating regarding franchise opportunities.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-[#01295A]">4. AI-Proctoring & Exam Security</h2>
            <p>
              To ensure fairness during competitive examinations, our platform may utilize proctoring frameworks compliant with educational standards. Data captured during proctored exams is strictly secured and used solely for anti-cheating verification.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}