'use client';
import React from 'react';
import Link from 'next/link';
import { Award, Clock, ArrowRight, Trophy, Sparkles, Gift } from 'lucide-react';

export default function HeroSection({ onOpenStudentModal }) {
  return (
    <section className="relative bg-white text-[#01295A] pt-10 pb-16 px-4 md:px-8 overflow-hidden border-b border-[#C0C0C0]/40">
      
      {/* AMBIENT GLOW ACCENTS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FE7C02]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#01295A]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN: HERO TEXT & CTAS (7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* TOP BADGE */}
          <div className="inline-flex items-center gap-2 bg-[#FE7C02]/10 border border-[#FE7C02]/30 px-4 py-2 rounded-full text-[#FE7C02] font-black text-xs uppercase tracking-wider animate-fade-in-down shadow-xs">
            <Award className="w-4 h-4 text-[#FE7C02]" />
            <span>India&apos;s 100-Day MCQ Talent Recognition & Scholarship Challenge</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-[#01295A] animate-fade-in-left">
            Learn Daily. <br />
            Compete Fairly.{' '}
            <span className="text-[#FE7C02] inline-block hover:scale-105 transition-transform duration-300">
              Earn Scholarships.
            </span>
          </h1>

          {/* SUBTEXT / DESCRIPTION */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-semibold max-w-2xl animate-fade-in-left delay-100">
            A revolutionary daily 60-MCQ competitive learning ecosystem designed for Class 3 to 12 & Competitive Aspirants across Maharashtra.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-4 pt-3 animate-zoom-in delay-200">
            {/* ENROLL BUTTON - OPENS REGISTRATION MODAL */}
            <button
              type="button"
              onClick={onOpenStudentModal}
              className="bg-[#FE7C02] hover:bg-[#E06B00] active:scale-95 text-white px-8 py-4 rounded-2xl font-black text-base hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#FE7C02]/25 flex items-center gap-2.5 cursor-pointer"
            >
              <span>Enroll for TTT 2026</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            {/* FRANCHISE BUTTON - NAVIGATES TO /franchise LANDING PAGE */}
            <Link
              href="/franchise"
              className="bg-[#01295A] hover:bg-[#001736] active:scale-95 text-white px-8 py-4 rounded-2xl font-black text-base hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <span>Franchise Enquiry</span>
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN: DAILY EXAM SCHEDULE & SCHOLARSHIP CARD (5 COLUMNS) */}
        <div className="lg:col-span-5 animate-fade-in-right">
          <div className="bg-slate-50/90 border border-[#C0C0C0]/60 p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-float-soft backdrop-blur-md space-y-6">
            
            {/* HEADER TIME WINDOW */}
            <div className="flex items-center justify-between border-b border-[#C0C0C0]/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FE7C02]/10 rounded-xl border border-[#FE7C02]/30">
                  <Clock className="w-5 h-5 text-[#FE7C02]" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#FE7C02] uppercase tracking-wider block">Live Schedule</span>
                  <span className="font-black text-base md:text-lg text-[#01295A]">Daily Exam Schedule</span>
                </div>
              </div>
              <span className="bg-[#FE7C02] text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-xs">
                8:00 PM – 8:40 PM
              </span>
            </div>

            {/* STATS TILES GRID */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3.5 rounded-2xl border border-[#C0C0C0]/50 shadow-xs hover:-translate-y-1 transition duration-300">
                <div className="text-2xl sm:text-3xl font-black text-[#FE7C02]">100</div>
                <div className="text-[10px] text-slate-500 mt-1 font-extrabold uppercase">TOTAL DAYS</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#C0C0C0]/50 shadow-xs hover:-translate-y-1 transition duration-300">
                <div className="text-2xl sm:text-3xl font-black text-[#01295A]">6,000</div>
                <div className="text-[10px] text-slate-500 mt-1 font-extrabold uppercase">TOTAL MCQS</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#C0C0C0]/50 shadow-xs hover:-translate-y-1 transition duration-300">
                <div className="text-2xl sm:text-3xl font-black text-[#FE7C02]">40</div>
                <div className="text-[10px] text-slate-500 mt-1 font-extrabold uppercase">MINUTES DAILY</div>
              </div>
            </div>

            {/* SCHOLARSHIP TIERS CONTAINER */}
            <div className="bg-[#01295A] text-white border border-[#FE7C02]/40 rounded-2xl p-5 space-y-3.5 shadow-md">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#FE7C02]" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    State Scholarship Pool
                  </span>
                </div>
                <span className="text-[10px] font-black bg-[#FE7C02] text-white px-2.5 py-0.5 rounded-full uppercase">
                  Each Class
                </span>
              </div>

              {/* SCHOLARSHIP BADGES GRID */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center justify-between bg-white/10 border border-white/10 px-3 py-2 rounded-xl">
                  <span className="text-[#C0C0C0] font-bold">🥇 Rank 1–10</span>
                  <span className="font-black text-[#FE7C02]">₹11,111</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 border border-white/10 px-3 py-2 rounded-xl">
                  <span className="text-[#C0C0C0] font-bold">🥈 Rank 11–25</span>
                  <span className="font-black text-[#FE7C02]">₹9,999</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 border border-white/10 px-3 py-2 rounded-xl">
                  <span className="text-[#C0C0C0] font-bold">🥉 Rank 26–60</span>
                  <span className="font-black text-[#FE7C02]">₹7,777</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 border border-white/10 px-3 py-2 rounded-xl">
                  <span className="text-[#C0C0C0] font-bold">🏅 Rank 61–100</span>
                  <span className="font-black text-[#FE7C02]">₹5,555</span>
                </div>
              </div>

              {/* FOOTER BADGES */}
              <div className="flex items-center justify-between text-[11px] font-black text-[#C0C0C0] pt-1">
                <span className="flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#FE7C02]" />
                  10-Day Milestone Trophies
                </span>
                <span className="flex items-center gap-1.5 text-[#FE7C02]">
                  <Gift className="w-3.5 h-3.5" />
                  Digital Certificates
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}