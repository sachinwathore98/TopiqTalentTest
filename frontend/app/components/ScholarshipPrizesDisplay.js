'use client';
import React from 'react';
import { Trophy, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ScholarshipPrizesDisplay() {
  const stateScholarships = [
    { rank: 'Rank 1–10', amount: '₹11,111', badge: '🥇 Rank 1–10', rewards: '🏆 Trophy + Memento + Cash Prize' },
    { rank: 'Rank 11–25', amount: '₹9,999', badge: '🥈 Rank 11–25', rewards: '🏆 Trophy + Memento + Cash Prize' },
    { rank: 'Rank 26–60', amount: '₹7,777', badge: '🥉 Rank 26–60', rewards: '🏆 Trophy + Memento + Cash Prize' },
    { rank: 'Rank 61–100', amount: '₹5,555', badge: '🏅 Rank 61–100', rewards: '🏆 Trophy + Memento + Cash Prize' }
  ];

  return (
    <div className="bg-[#01295A] text-white rounded-3xl p-6 md:p-10 shadow-2xl border border-[#FE7C02]/40 space-y-8 my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/15 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FE7C02] text-white rounded-2xl shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FE7C02]/20 text-[#FE7C02] border border-[#FE7C02]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Maharashtra State Level
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#FE7C02] animate-pulse" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
              Final Scholarship Winners — Top 100 in Each Class[cite: 13]
            </h3>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stateScholarships.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white/10 border border-white/20 hover:border-[#FE7C02] p-6 rounded-2xl transition-all duration-300 space-y-4 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white bg-white/15 px-3 py-1 rounded-full border border-white/20">
                {item.badge}
              </span>
              <Award className="w-5 h-5 text-[#FE7C02]" />
            </div>

            <div className="space-y-1 py-1">
              <div className="text-3xl font-black text-[#FE7C02] font-mono tracking-tight">
                {item.amount}
              </div>
              <div className="text-xs font-bold text-[#C0C0C0] uppercase tracking-wide">
                {item.rank} (Each Student)[cite: 13]
              </div>
            </div>

            <div className="p-3 bg-[#001736] border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FE7C02] shrink-0" />
              <span>{item.rewards}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}