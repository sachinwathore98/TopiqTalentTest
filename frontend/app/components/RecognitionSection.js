'use client';
import React from 'react';
import { Trophy, Award, Sparkles, Gift, ShieldCheck } from 'lucide-react';

const STATE_SCHOLARSHIPS = [
  { rankText: "Rank 1–10", cashText: "₹11,111", badge: "🥇 Rank 1-10", rewards: "🏆 Certificate + Memento + Cash" },
  { rankText: "Rank 11–25", cashText: "₹9,999", badge: "🥈 Rank 11-25", rewards: "🏆 Certificate + Memento + Cash" },
  { rankText: "Rank 26–60", cashText: "₹7,777", badge: "🥉 Rank 26-60", rewards: "🏆 Certificate + Memento + Cash" },
  { rankText: "Rank 61–100", cashText: "₹5,555", badge: "🏅 Rank 61-100", rewards: "🏆 Certificate + Memento + Cash" }
];

const MILESTONES = [
  { title: "Every 10 Days Milestone", desc: "Trophies, Special Medals & Merit Certificates awarded for top performers every 10 days.", icon: Trophy },
  { title: "100-Day Grand Completion", desc: "Official State Merit Ranker Certificate & Grand Memento for completing all 100 days.", icon: Award },
  { title: "Digital Marksheet & Report", desc: "Instant downloadable scorecards with speed, accuracy, and strength-weakness analytics.", icon: ShieldCheck }
];

export default function RecognitionSection() {
  return (
    <section id="rewards" className="py-12 px-4 max-w-7xl mx-auto space-y-10 bg-white text-[#01295A]">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-2 animate-fade-in-down">
        <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest block">
          RECOGNITION STRUCTURE
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-[#01295A]">
          Awards, Certificates & Scholarships
        </h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
          Honoring consistency, rigorous testing temperament, and academic excellence across Maharashtra.
        </p>
      </div>

      {/* STATE EXCELLENCE SCHOLARSHIPS CONTAINER */}
      <div className="bg-[#01295A] text-white border border-[#FE7C02]/40 rounded-3xl p-6 md:p-10 shadow-xl space-y-6 animate-zoom-in">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/15 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FE7C02] text-white rounded-2xl shadow-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FE7C02]/20 text-[#FE7C02] border border-[#FE7C02]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Grand Recognition
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#FE7C02] animate-pulse" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
                State Excellence Scholarships <span className="text-[#FE7C02] font-bold text-sm md:text-base">(After 100 Days)</span>
              </h3>
            </div>
          </div>
        </div>

        {/* 4 SCHOLARSHIP TIER CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATE_SCHOLARSHIPS.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white/10 border border-white/20 hover:border-[#FE7C02] p-5 rounded-2xl transition-all duration-300 space-y-3 hover:-translate-y-1 shadow-lg group flex flex-col justify-between"
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

      {/* MILESTONE REWARDS GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {MILESTONES.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx} 
              className="bg-slate-50 border border-[#C0C0C0]/60 p-6 md:p-8 rounded-3xl shadow-md hover:border-[#FE7C02] hover:-translate-y-1.5 transition duration-300 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-[#01295A] text-[#FE7C02] rounded-2xl flex items-center justify-center mb-4 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-[#01295A] mb-2">{m.title}</h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}