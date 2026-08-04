'use client';
import React from 'react';
import { Clock, Camera, Shuffle, FileText, ShieldCheck, BarChart2 } from 'lucide-react';

export default function ExamFormatSection() {
  const features = [
    { title: '100% Online Examination', desc: 'Appear using any mobile phone, tablet, laptop, or desktop with internet connection.', icon: Clock },
    { title: 'AI Camera Monitoring System', desc: 'Monitored under an AI-powered Camera Monitoring System to minimize malpractice.', icon: Camera },
    { title: 'Randomized Question & Option Sequence', desc: 'Order of questions and answer options automatically randomized for every student.', icon: Shuffle },
    { title: 'Same-Day Instant Result & Marksheet', desc: 'Digital marksheets and results generated immediately after test completion.', icon: FileText },
    { title: 'Daily Official Answer Key', desc: 'Published same day to enable students to verify answers and learn from mistakes.', icon: ShieldCheck },
    { title: '100-Day Grand Performance Memo', desc: 'Consolidated performance report issued after successfully completing the 100 days.', icon: BarChart2 }
  ];

  return (
    <section id="format" className="py-12 px-4 max-w-7xl mx-auto space-y-10 bg-white text-[#01295A]">
      
      {/* BANNER CONTAINER */}
      <div className="bg-[#01295A] text-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#FE7C02]/30 space-y-6 animate-zoom-in">
        <div>
          <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest block mb-1">
            SMART EXAM SYSTEM
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Exam Format & Security Features
          </h2>
        </div>
        
        {/* STATS TILES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300">
            <div className="text-3xl font-black text-[#FE7C02]">100 Days</div>
            <div className="text-xs text-[#C0C0C0] mt-1 uppercase font-bold">TOTAL DAYS</div>
          </div>
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300">
            <div className="text-3xl font-black text-white">60 MCQs</div>
            <div className="text-xs text-[#C0C0C0] mt-1 uppercase font-bold">TOTAL MCQS</div>
          </div>
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300">
            <div className="text-3xl font-black text-[#FE7C02]">40 Mins</div>
            <div className="text-xs text-[#C0C0C0] mt-1 uppercase font-bold">MINUTES DAILY</div>
          </div>
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300">
            <div className="text-2xl md:text-3xl font-black text-white">8:00–8:40 PM</div>
            <div className="text-xs text-[#C0C0C0] mt-1 uppercase font-bold">Daily Exam Schedule</div>
          </div>
        </div>
      </div>

      {/* FEATURE CARDS GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="p-6 md:p-8 bg-slate-50 rounded-3xl border border-[#C0C0C0]/60 shadow-md hover:border-[#FE7C02] hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between animate-fade-in-up"
            >
              <div>
                <div className="w-12 h-12 bg-[#01295A] text-[#FE7C02] rounded-2xl flex items-center justify-center mb-5 shadow-xs group-hover:bg-[#FE7C02] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#01295A] mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}