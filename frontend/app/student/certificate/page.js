'use client';
import React from 'react';
import { Award, Download, Share2, ShieldCheck, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

export default function StudentCertificate() {
  // Mock certificate details retrieved from database
  const certData = {
    certificateNo: 'TTT-2026-MH-89421',
    studentName: 'Rahul Sharma',
    studentClass: 'Class 9 & 10 (Group C)',
    achievement: '💎 TOPIQ Elite Award & State Rank #4 Merit Scholar',
    issueDate: 'August 3, 2026',
    branchCode: 'CSN-01 (Ch. Sambhajinagar Main)',
    validity: 'Lifetime Verified'
  };

  const handleDownload = () => {
    alert('Generating high-resolution printable PDF certificate...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TOPIQ Talent Test Certificate',
        text: `Proud to achieve ${certData.achievement} in the Maharashtra 100-Day TTT Challenge!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-[#01295A] py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* NAVIGATION & ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            onClick={() => window.location.href = '/student/dashboard'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#01295A] transition bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#01295A] px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-[#FE7C02]" />
              <span>Share Achievement</span>
            </button>

            <button 
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FE7C02] text-white px-5 py-2.5 rounded-xl hover:bg-[#E06B00] transition cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Certificate</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CONTAINER */}
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-2xl border-8 border-[#01295A] relative overflow-hidden space-y-8 text-center">
          
          {/* WATERMARK BACKGROUND EFFECT */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-[500px] h-[500px] text-[#01295A]" />
          </div>

          {/* CERTIFICATE HEADER */}
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full text-[#FE7C02] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Balmitra Kids Pvt. Ltd. • Official State Certification</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-[#01295A] tracking-tight">
              Certificate of Excellence
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">
              TOPIQ Talent Test (TTT) • 100-Day State Level Scholarship Challenge
            </p>
          </div>

          {/* CERTIFICATE BODY */}
          <div className="space-y-4 py-4 relative z-10 max-w-2xl mx-auto">
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              This is proudly presented to
            </p>

            <div className="text-2xl md:text-4xl font-black text-[#01295A] border-b-2 border-[#FE7C02] pb-2 inline-block px-6">
              {certData.studentName}
            </div>

            <p className="text-xs md:text-sm text-slate-600 font-medium pt-2">
              enrolled in <span className="font-bold text-[#01295A]">{certData.studentClass}</span>, for exceptional dedication, brilliant academic aptitude, and securing recognition as:
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-[#01295A] text-sm md:text-base font-black tracking-wide shadow-xs">
              🏆 {certData.achievement}
            </div>
          </div>

          {/* FOOTER SIGNATURES & VERIFICATION SEAL */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 text-left items-end relative z-10">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Issue Date</div>
              <div className="text-xs font-black text-[#01295A] mt-0.5">{certData.issueDate}</div>
            </div>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#01295A] text-[#FE7C02] rounded-full flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-[9px] font-black uppercase text-emerald-600 tracking-wider">Officially Verified</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Branch Code</div>
              <div className="text-xs font-black text-[#01295A] mt-0.5">{certData.branchCode}</div>
            </div>
          </div>

          {/* CERTIFICATE ID FOOTER */}
          <div className="text-[10px] font-mono text-slate-400 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
            <span>Certificate ID: {certData.certificateNo}</span>
            <span>Verify online at topiqtalenttest.com/verify</span>
          </div>

        </div>

      </div>
    </div>
  );
}