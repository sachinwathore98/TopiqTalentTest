'use client';
import React from 'react';
import { Trophy, Award, Sparkles, Star } from 'lucide-react';

export default function ScholarshipPrizesDisplay() {
  const prizeTiers = [
    {
      ranks: 'Rank 1 - 10',
      cash: '₹20,000',
      subtitle: 'Per Student',
      perks: ['Hard Copy Certificate', 'Trophy', 'State Level Recognition'],
      badgeColor: 'bg-amber-500',
      borderColor: 'border-amber-300',
      bgGradient: 'from-amber-50 to-orange-50'
    },
    {
      ranks: 'Rank 11 - 25',
      cash: '₹15,000',
      subtitle: 'Per Student',
      perks: ['Hard Copy Certificate', 'Trophy', 'State Level Recognition'],
      badgeColor: 'bg-emerald-500',
      borderColor: 'border-emerald-300',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      ranks: 'Rank 26 - 60',
      cash: '₹10,000',
      subtitle: 'Per Student',
      perks: ['Hard Copy Certificate', 'Trophy', 'State Level Recognition'],
      badgeColor: 'bg-blue-500',
      borderColor: 'border-blue-300',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      ranks: 'Rank 61 - 100',
      cash: '₹5,000',
      subtitle: 'Per Student',
      perks: ['Hard Copy Certificate', 'Trophy', 'State Level Recognition'],
      badgeColor: 'bg-purple-500',
      borderColor: 'border-purple-300',
      bgGradient: 'from-purple-50 to-pink-50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-[#01295A]">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-[10px] font-black bg-[#FE7C02] text-white px-3.5 py-1 rounded-full uppercase tracking-wider">
          Maharashtra State Level
        </span>
        <h2 className="text-2xl sm:text-4xl font-black">Final Scholarship Winners</h2>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold">
          Top 100 students in each class/category receive trophies, certificates, and guaranteed cash rewards[cite: 13]!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prizeTiers.map((tier, idx) => (
          <div 
            key={idx} 
            className={`bg-gradient-to-b ${tier.bgGradient} rounded-3xl border-2 ${tier.borderColor} p-6 shadow-xl flex flex-col justify-between transition transform hover:-translate-y-1`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase text-white ${tier.badgeColor} px-3 py-1 rounded-full`}>
                  {tier.ranks}
                </span>
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-[#01295A]">{tier.cash}</div>
                <div className="text-[10px] font-bold uppercase text-slate-500">{tier.subtitle}[cite: 13]</div>
              </div>

              <hr className="border-slate-200/80" />

              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                {tier.perks.map((perk, pIdx) => (
                  <li key={pIdx} className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-[#FE7C02] fill-[#FE7C02]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#01295A]">
                Top 100 in Each Class[cite: 13]
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}