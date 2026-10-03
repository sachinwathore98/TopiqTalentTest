'use client';
import React, { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, ShieldCheck } from 'lucide-react';
import ScholarshipPrizesDisplay from './ScholarshipPrizesDisplay';

const MILESTONES = [
  { title: "Every 10 Days Milestone", desc: "Trophies, Special Medals & Merit Certificates awarded for top performers every 10 days.", icon: Trophy },
  { title: "100-Day Grand Completion", desc: "Official State Merit Ranker Certificate & Grand Memento for completing all 100 days.", icon: Award },
  { title: "Digital Marksheet & Report", desc: "Instant downloadable scorecards with speed, accuracy, and strength-weakness analytics.", icon: ShieldCheck }
];

export default function RecognitionSection() {
  return (
    <section id="rewards" className="py-12 px-4 max-w-7xl mx-auto space-y-10 bg-white text-[#01295A]">
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

      <ScholarshipPrizesDisplay />

      <div className="grid md:grid-cols-3 gap-6">
        {MILESTONES.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-slate-50 border border-[#C0C0C0]/60 p-6 md:p-8 rounded-3xl shadow-md hover:border-[#FE7C02] transition duration-300 space-y-4 flex flex-col justify-between">
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