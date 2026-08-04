'use client';

import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Award, 
  Trophy, 
  CheckCircle2, 
  Zap, 
  Target,
  Medal,
  ShieldCheck,
  TrendingUp,
  Brain,
  Users,
  Flame
} from 'lucide-react';

const LEFT_TARGETS = [
  { title: "Classes 3rd to 5th", subtitle: "Foundation Stage", desc: "Develops regular MCQ study habits & curiosity", icon: GraduationCap },
  { title: "Classes 6th to 8th", subtitle: "Foundation Plus Stage", desc: "Strengthens logical thinking & subject concepts", icon: Brain },
  { title: "Classes 9th & 10th", subtitle: "Competitive Foundation", desc: "Prepares for SSC Boards & NTSE/Olympiads", icon: Target },
  { title: "Classes 11th & 12th", subtitle: "Career Prep Stage", desc: "Boosts speed & accuracy for MHT-CET, JEE & NEET", icon: Zap },
  { title: "12th & Above Aspirants", subtitle: "Govt & Professional Prep", desc: "Master Quantitative Aptitude, Reasoning & GK", icon: Users }
];

const RIGHT_BENEFITS = [
  { title: "Daily 100-Day MCQ Habit", subtitle: "Consistency Engine", desc: "Builds rigorous exam temperament & time discipline", icon: TrendingUp },
  { title: "AI Camera Monitoring", subtitle: "100% Fair Testing", desc: "Proctored environment ensuring absolute integrity", icon: ShieldCheck },
  { title: "Same-Day Instant Marksheet", subtitle: "Immediate Evaluation", desc: "Get official answer key & score right after test", icon: CheckCircle2 },
  { title: "State & District Live Ranks", subtitle: "Real Benchmarking", desc: "Compare performance with thousands of students", icon: Trophy },
  { title: "100-Day Grand Memo", subtitle: "Consolidated Report", desc: "Complete strength, weakness & speed analytics", icon: Medal }
];

const STATE_SCHOLARSHIPS = [
  { rankText: "Rank 1–10", cashText: "₹11,111", badge: "🥇 Rank 1-10", rewards: "🏆 Certificate + Memento + Cash" },
  { rankText: "Rank 11–25", cashText: "₹9,999", badge: "🥈 Rank 11-25", rewards: "🏆 Certificate + Memento + Cash" },
  { rankText: "Rank 26–60", cashText: "₹7,777", badge: "🥉 Rank 26-60", rewards: "🏆 Certificate + Memento + Cash" },
  { rankText: "Rank 61–100", cashText: "₹5,555", badge: "🏅 Rank 61-100", rewards: "🏆 Certificate + Memento + Cash" }
];

export default function BrandingMarqueeBanner({ onOpenStudentModal }) {
  return (
    <div className="w-full bg-slate-50 border-b border-[#C0C0C0]/50 py-6 px-4 md:px-6 space-y-6 overflow-hidden relative text-[#01295A]">
      
      {/* MARQUEE KEYFRAMES */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marquee 24s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}</style>

      {/* TOP ROW: TWO COLUMNS */}
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT COLUMN: EXAM FOR WHOM */}
        <div className="bg-white border border-[#C0C0C0]/60 rounded-3xl p-4 shadow-md relative overflow-hidden flex flex-col justify-between space-y-3 animate-fade-in-left hover:shadow-xl transition duration-500">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 px-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FE7C02]/10 text-[#FE7C02] rounded-xl border border-[#FE7C02]/30 shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#01295A] uppercase tracking-wider">Exam For Whom</h3>
                <p className="text-[10px] text-slate-500 font-semibold">Target Categories (Classes 3–12 & Competitive)</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-[#FE7C02] bg-[#FE7C02]/10 px-2.5 py-0.5 rounded-full border border-[#FE7C02]/30">
              5 Groups
            </span>
          </div>

          <div className="marquee-container relative flex items-center overflow-hidden py-1 group">
            <div className="animate-marquee-left flex items-center gap-3">
              {[...LEFT_TARGETS, ...LEFT_TARGETS, ...LEFT_TARGETS].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-slate-50 border border-[#C0C0C0]/50 hover:border-[#FE7C02] hover:bg-white p-3.5 rounded-2xl w-64 shrink-0 transition-all duration-300 shadow-xs hover:shadow-md flex items-start gap-3 hover:-translate-y-0.5"
                  >
                    <div className="p-2 rounded-xl border border-[#FE7C02]/40 bg-[#FE7C02]/10 text-[#FE7C02] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="text-xs font-black text-[#01295A] truncate">{card.title}</h4>
                      <span className="text-[10px] font-bold text-[#FE7C02] block uppercase tracking-wider">{card.subtitle}</span>
                      <p className="text-[10px] text-slate-600 leading-tight line-clamp-1 font-medium">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: KEY BENEFITS */}
        <div className="bg-white border border-[#C0C0C0]/60 rounded-3xl p-4 shadow-md relative overflow-hidden flex flex-col justify-between space-y-3 animate-fade-in-right hover:shadow-xl transition duration-500">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 px-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#01295A]/10 text-[#01295A] rounded-xl border border-[#01295A]/20 shadow-xs">
                <Zap className="w-4 h-4 text-[#01295A]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#01295A] uppercase tracking-wider">Key Benefits</h3>
                <p className="text-[10px] text-slate-500 font-semibold">Why Students Participate Daily</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-[#01295A] bg-[#01295A]/10 px-2.5 py-0.5 rounded-full border border-[#01295A]/20">
              100-Day Value
            </span>
          </div>

          <div className="marquee-container relative flex items-center overflow-hidden py-1 group">
            <div className="animate-marquee-right flex items-center gap-3">
              {[...RIGHT_BENEFITS, ...RIGHT_BENEFITS, ...RIGHT_BENEFITS].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-slate-50 border border-[#C0C0C0]/50 hover:border-[#FE7C02] hover:bg-white p-3.5 rounded-2xl w-64 shrink-0 transition-all duration-300 shadow-xs hover:shadow-md flex items-start gap-3 hover:-translate-y-0.5"
                  >
                    <div className="p-2 rounded-xl border border-[#01295A]/20 bg-[#01295A]/10 text-[#01295A] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="text-xs font-black text-[#01295A] truncate">{card.title}</h4>
                      <span className="text-[10px] font-bold text-[#FE7C02] block uppercase tracking-wider">{card.subtitle}</span>
                      <p className="text-[10px] text-slate-600 leading-tight line-clamp-1 font-medium">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: SCHOLARSHIPS BANNER */}
      <div className="bg-[#01295A] text-white border border-[#FE7C02]/40 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6 animate-zoom-in delay-200">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/15 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FE7C02] text-white rounded-2xl shadow-lg font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FE7C02]/20 text-[#FE7C02] border border-[#FE7C02]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Grand Recognition
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#FE7C02] animate-pulse" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
                State Excellence Scholarships <span className="text-[#FE7C02] font-bold text-sm md:text-base">(After 100 Days)</span>
              </h2>
            </div>
          </div>

          {/* WORKING REGISTRATION OPEN BUTTON */}
          <button
            type="button"
            onClick={onOpenStudentModal}
            className="inline-flex items-center gap-2 bg-[#FE7C02] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shrink-0 self-start sm:self-auto hover:bg-[#E06B00] transition active:scale-95 hover:scale-105 duration-300 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>Registration Open</span>
          </button>
        </div>

        {/* 4 SCHOLARSHIP TIER CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATE_SCHOLARSHIPS.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white/10 border border-white/20 hover:border-[#FE7C02] p-5 rounded-2xl transition-all duration-300 space-y-3 hover:-translate-y-1 shadow-lg group flex flex-col justify-between animate-fade-in-up"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  {item.badge}
                </span>
                <Award className="w-5 h-5 text-[#FE7C02] shrink-0" />
              </div>

              <div className="space-y-1 py-1">
                <div className="text-3xl font-black text-[#FE7C02] tracking-tight font-mono">
                  {item.cashText}
                </div>
                <div className="text-xs font-bold text-[#C0C0C0] uppercase tracking-wide">
                  {item.rankText}
                </div>
              </div>

              <div className="p-2.5 bg-[#001736] border border-white/10 rounded-xl text-[11px] font-bold text-white flex items-center gap-1.5">
                <span className="truncate">{item.rewards}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}