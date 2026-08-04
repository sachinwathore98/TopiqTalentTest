'use client';
import React from 'react';
import { BarChart2, CheckCircle2, TrendingUp, Sparkles, Award } from 'lucide-react';

export default function AnalyticsSection() {
  const dailyAnalyticsList = [
    'Daily Score & Daily Percentage',
    'Daily Rank, Branch Rank, District Rank, State Rank',
    'Subject-wise & Chapter/Topic-wise Performance',
    'Correct Answers, Wrong Answers, Unattempted Questions',
    'Accuracy Report & Speed / Time Management Report',
    'Performance Comparison with Previous Tests',
    'Strengths & Weaknesses Analysis & Improvement Report'
  ];

  const grandAnalyticsList = [
    'Overall Score & Overall Percentage',
    'Overall Rank, Branch Rank, District Rank, State Rank',
    'Subject-wise Overall Performance & Topic-wise Overall Performance',
    'Accuracy Analysis & Consistency Report',
    'Speed Improvement Report & Strength/Weakness Report',
    'Growth Graph & Personalized Improvement Suggestions',
    '100-Day Grand Performance Memo'
  ];

  return (
    <section id="analytics" className="py-12 px-4 max-w-7xl mx-auto bg-white text-[#01295A]">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2 animate-fade-in-down">
        <div className="inline-flex items-center gap-2 bg-[#FE7C02]/10 border border-[#FE7C02]/30 px-3.5 py-1 rounded-full text-[#FE7C02] text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#FE7C02]" />
          <span>Deep Insights & Benchmarking</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-[#01295A]">
          Performance Analytics Engine
        </h2>
        <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
          Comprehensive daily breakdowns and cumulative 100-day evaluation reports to track student accuracy, speed, and competitive ranking.
        </p>
      </div>

      {/* DUAL ANALYTICS PANELS GRID */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* PANEL 1: DAILY ANALYTICS (SLIDES IN FROM LEFT) */}
        <div className="bg-slate-50 border border-[#C0C0C0]/60 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-2xl animate-fade-in-left">
          <div className="space-y-6">
            
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#C0C0C0]/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#01295A] text-white rounded-2xl shadow-md">
                  <BarChart2 className="w-6 h-6 text-[#FE7C02]" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#FE7C02] uppercase tracking-wider block">Real-Time Evaluation</span>
                  <h3 className="text-xl font-black text-[#01295A]">Daily Performance Analytics</h3>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-[#01295A]/10 text-[#01295A] px-2.5 py-1 rounded-full border border-[#01295A]/20">
                Post-Test Live
              </span>
            </div>

            {/* LIST */}
            <ul className="space-y-2.5">
              {dailyAnalyticsList.map((item, i) => (
                <li 
                  key={i} 
                  className="flex items-start gap-3 text-xs md:text-sm font-bold text-[#01295A] bg-white p-3.5 rounded-2xl border border-[#C0C0C0]/40 shadow-xs hover:border-[#FE7C02] hover:scale-[1.01] transition duration-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FE7C02] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

          </div>

          <div className="mt-6 pt-4 border-t border-[#C0C0C0]/30 flex items-center justify-between text-[11px] font-extrabold text-slate-500">
            <span>Updated Daily at 8:40 PM</span>
            <span className="text-[#FE7C02] font-black">Instant Marksheet</span>
          </div>
        </div>

        {/* PANEL 2: 100-DAY GRAND ANALYTICS (SLIDES IN FROM RIGHT) */}
        <div className="bg-[#01295A] text-white border border-[#FE7C02]/40 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-2xl animate-fade-in-right">
          <div className="space-y-6">
            
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FE7C02] text-white rounded-2xl shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#FE7C02] uppercase tracking-wider block">Cumulative Progress</span>
                  <h3 className="text-xl font-black text-white">100-Day Grand Analytics</h3>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-[#FE7C02] text-white px-2.5 py-1 rounded-full shadow-xs">
                State Report
              </span>
            </div>

            {/* LIST */}
            <ul className="space-y-2.5">
              {grandAnalyticsList.map((item, i) => (
                <li 
                  key={i} 
                  className="flex items-start gap-3 text-xs md:text-sm font-bold text-white bg-white/10 p-3.5 rounded-2xl border border-white/10 hover:border-[#FE7C02] hover:scale-[1.01] backdrop-blur-xs transition duration-200"
                >
                  <TrendingUp className="w-4 h-4 text-[#FE7C02] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] font-extrabold text-[#C0C0C0]">
            <span>100-Day Consolidated Certificate</span>
            <span className="text-[#FE7C02] font-black">Grand Rank Memo</span>
          </div>
        </div>

      </div>

    </section>
  );
}