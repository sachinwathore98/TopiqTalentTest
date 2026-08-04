'use client';

import React from 'react';
import { Target, Rocket, CheckCircle2, Quote, Award, Sparkles, HeartHandshake, Building2 } from 'lucide-react';

export default function AboutPage() {
  const missions = [
    'To develop a habit of regular learning among students.',
    'To build a strong competitive mindset.',
    'To enhance logical thinking, analytical ability, and problem-solving skills.',
    'To provide a meaningful platform for identifying and recognizing talented students.',
    'To motivate students through awards, recognition, and scholarships.',
    'To build a strong foundation for future academic and competitive examinations.'
  ];

  return (
    <div className="py-8 min-h-screen bg-white text-[#01295A] px-4 md:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER BANNER */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest block">ABOUT THE INITIATIVE</span>
          <h1 className="text-3xl md:text-5xl font-black text-[#01295A] tracking-tight">Innovative Educational Initiative by Balmitra Kids Pvt. Ltd.</h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">TOPIQ TALENT TEST (TTT) is a 100-Day Online MCQ Talent Recognition & Scholarship Challenge specially designed for students across Maharashtra.</p>
        </div>

        {/* FOUNDER'S MESSAGE CARD */}
        <div className="bg-slate-50 p-6 md:p-10 rounded-3xl border border-[#C0C0C0]/60 shadow-md relative overflow-hidden space-y-5">
          <Quote className="w-28 h-28 text-[#FE7C02]/10 absolute -top-3 -right-3 pointer-events-none" />

          <div className="flex items-center gap-2">
            <span className="bg-[#FE7C02] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
              FOUNDER'S MESSAGE
            </span>
          </div>

          <div className="text-[#01295A] font-medium text-xs md:text-sm leading-relaxed space-y-3 relative z-10">
            <p className="font-extrabold text-[#01295A] text-sm md:text-base">
              Dear Students, Parents, Teachers, and the TOPIQ Family,
            </p>
            <p className="text-slate-700">
              In today's highly competitive world, academic success alone is not enough. Students must also develop logical thinking, problem-solving skills, time management, accuracy, consistency, confidence, and a competitive mindset to succeed in their future careers.
            </p>
            <p className="text-slate-700">
              With this vision, <strong className="text-[#01295A] font-black">TOPIQ TALENT TEST (TTT)</strong> has been introduced as a 100-Day Online MCQ Talent Recognition & Scholarship Challenge.
            </p>
            <p className="text-slate-700">
              TTT is not just an examination; it is an educational initiative designed to recognize talent, reward excellence, encourage continuous learning, and provide financial support through scholarships.
            </p>
            <p className="text-slate-700">
              The program motivates students to practice every day, assess their own performance, improve continuously, and build a strong foundation for future academic and competitive examinations.
            </p>
            <p className="italic font-bold text-[#01295A] bg-[#FE7C02]/10 p-3 rounded-r-xl border-l-4 border-[#FE7C02]">
              "At TOPIQ, we believe that every student possesses unique talent, and every talent deserves the right platform to shine."
            </p>
          </div>

          {/* FOUNDER FOOTER & ORGANIZING BODY */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#C0C0C0]/50 pt-4 gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FE7C02] shrink-0" />
                <p className="font-black text-[#01295A] text-sm md:text-base">Balmitra Kids Private Limited</p>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-6">Organizing Body, TOPIQ TALENT TEST</p>
            </div>

            <div className="bg-[#01295A] text-white border border-[#01295A] px-4 py-2 rounded-xl text-xs font-black italic shadow-xs self-start sm:self-auto">
              "Every Talent Deserves Recognition."
            </div>
          </div>
        </div>

        {/* VISION & MISSION GRID */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          
          {/* VISION CARD */}
          <div className="bg-[#01295A] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-[#FE7C02]/30 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-[#FE7C02] text-white rounded-2xl shadow-md">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-white">VISION</h2>
              </div>
              <p className="text-[#C0C0C0] text-sm md:text-base font-medium leading-relaxed">
                "To become Maharashtra's most trusted platform for Talent Recognition, Scholarships, Competitive Learning, and Academic Excellence."
              </p>
            </div>

            {/* CORE VISION PILLARS */}
            <div className="space-y-2.5 pt-4 border-t border-white/15">
              <span className="text-[10px] font-black text-[#FE7C02] uppercase tracking-widest block">
                Core Pillars of Our Vision
              </span>

              <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-2.5 rounded-2xl backdrop-blur-xs">
                <Award className="w-4 h-4 text-[#FE7C02] shrink-0" />
                <div>
                  <h3 className="text-xs font-black text-white">Talent Recognition & Merit</h3>
                  <p className="text-[10px] text-[#C0C0C0]">Identifying unique student capabilities early on.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-2.5 rounded-2xl backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-[#FE7C02] shrink-0" />
                <div>
                  <h3 className="text-xs font-black text-white">Competitive Excellence</h3>
                  <p className="text-[10px] text-[#C0C0C0]">Fostering daily practice and analytical speed.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-2.5 rounded-2xl backdrop-blur-xs">
                <HeartHandshake className="w-4 h-4 text-[#FE7C02] shrink-0" />
                <div>
                  <h3 className="text-xs font-black text-white">Equal Opportunity & Financial Support</h3>
                  <p className="text-[10px] text-[#C0C0C0]">Providing transparent scholarships across Maharashtra.</p>
                </div>
              </div>
            </div>
          </div>

          {/* MISSION CARD */}
          <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-[#C0C0C0]/60 shadow-md space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-[#01295A] text-white rounded-2xl shadow-md">
                  <Rocket className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-[#01295A]">OUR MISSION</h2>
              </div>

              <div className="space-y-2">
                {missions.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 bg-white rounded-2xl border border-[#C0C0C0]/40 shadow-xs hover:border-[#FE7C02] transition">
                    <CheckCircle2 className="w-4 h-4 text-[#FE7C02] shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm font-bold text-[#01295A]">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}