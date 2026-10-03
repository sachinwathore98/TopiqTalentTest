'use client';
import React from 'react';
import { Trophy, Award, Sparkles } from 'lucide-react';
import ScholarshipPrizesDisplay from '../components/ScholarshipPrizesDisplay';

const MILESTONE_TABLE = [
  { day: 'Day 1–10 (SPARK)', award: '🏅 District Top 60 Trophy' },
  { day: 'Day 11–20 (RISE)', award: '🌟 District Top 60 Trophy' },
  { day: 'Day 21–30 (SHINE)', award: '⭐ District Top 60 Trophy' },
  { day: 'Day 31–40 (EXCEL)', award: '🏆 District Top 60 Trophy' },
  { day: 'Day 41–50 (FOCUS)', award: '💎 District Top 60 Trophy' },
  { day: 'Day 51–60 (ACHIEVE)', award: '🎖️ District Top 60 Trophy' },
  { day: 'Day 61–70 (INSPIRE)', award: '👑 District Top 60 Trophy' },
  { day: 'Day 71–80 (ELITE)', award: '🚀 District Top 60 Trophy' },
  { day: 'Day 81–90 (CHAMPION)', award: '🏔️ District Top 60 Trophy' },
  { day: 'Day 91–100 (LEGEND)', award: '👑 District Top 60 Trophy' }
];

export default function RewardsPage() {
  return (
    <div className="py-8 min-h-screen bg-white text-[#01295A] px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* PAGE HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-2 animate-fade-in-down">
          <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest block">RECOGNITION STRUCTURE</span>
          <h1 className="text-3xl md:text-5xl font-black text-[#01295A]">Awards, Certificates & Scholarships</h1>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            All Results, Rankings, Awards, Certificates, and Scholarships are declared separately for each class[cite: 13].
          </p>
        </div>

        {/* GRAND STATE SCHOLARSHIPS */}
        <div className="animate-zoom-in">
          <ScholarshipPrizesDisplay />
        </div>

        {/* 10-DAY MILESTONE AWARDS GRID */}
        <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-[#C0C0C0]/60 shadow-xl animate-fade-in-up">
          <h2 className="text-2xl font-black text-[#01295A] mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#FE7C02]" />
            <span>TOPIQ 10-Day Milestone Awards (District Level - Top 60 in Each Class)[cite: 12]</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {MILESTONE_TABLE.map((m, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-[#C0C0C0]/40 text-center shadow-xs hover:border-[#FE7C02] hover:scale-105 transition duration-300">
                <span className="text-xs font-black text-white bg-[#01295A] px-2.5 py-1 rounded-full">{m.day}</span>
                <h3 className="text-xs font-bold text-[#01295A] mt-3">{m.award}</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1">Digital Certificate + Trophy</p>
              </div>
            ))}
          </div>
        </div>

        {/* PARTICIPATION CERTIFICATE BANNER */}
        <div className="bg-[#01295A] text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#FE7C02]/30 animate-fade-in-up">
          <div>
            <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest block mb-2">EVERY PARTICIPANT DESERVES RECOGNITION</span>
            <h3 className="text-2xl font-black mb-2 text-white">Official Digital Participation Certificate</h3>
            <p className="text-xs md:text-sm text-[#C0C0C0] font-medium max-w-xl">
              Every student who registers and participates will receive an official certificate downloadable from their student dashboard upon completion of the challenge.
            </p>
          </div>
          <Award className="w-16 h-16 text-[#FE7C02] shrink-0" />
        </div>

      </div>
    </div>
  );
}