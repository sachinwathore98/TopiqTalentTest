'use client';
import React from 'react';
import { Target, Rocket, CheckCircle2, Award, Sparkles, HeartHandshake } from 'lucide-react';

export default function AboutSection() {
  const missions = [
    'To develop a habit of regular learning among students.',
    'To build a strong competitive mindset.',
    'To enhance logical thinking, analytical ability, and problem-solving skills.',
    'To provide a meaningful platform for identifying and recognizing talented students.',
    'To motivate students through awards, recognition, and scholarships.',
    'To build a strong foundation for future academic and competitive examinations.'
  ];

  return (
    <section id="about" className="py-12 px-4 max-w-7xl mx-auto space-y-10 bg-white text-[#01295A]">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-2 animate-fade-in-down">
        <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest block">
          ABOUT THE INITIATIVE
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-[#01295A]">
          Innovative Educational Initiative by Balmitra Kids Pvt. Ltd.
        </h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
          TOPIQ TALENT TEST (TTT) is a 100-Day Online MCQ Talent Recognition & Scholarship Challenge specially designed for students across Maharashtra.
        </p>
      </div>

      {/* VISION & MISSION DUAL GRID */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* VISION CARD */}
        <div className="bg-[#01295A] text-white p-8 rounded-3xl shadow-xl border border-[#FE7C02]/30 flex flex-col justify-between animate-fade-in-left hover:shadow-2xl transition duration-500">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#FE7C02] text-white rounded-2xl shadow-md">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-wide">
                VISION
              </h3>
            </div>

            <p className="text-[#C0C0C0] text-base md:text-lg leading-relaxed font-medium mb-8">
              "To become Maharashtra's most trusted platform for Talent Recognition, Scholarships, Competitive Learning, and Academic Excellence."
            </p>
          </div>

          {/* VISION PILLARS */}
          <div className="space-y-3 pt-6 border-t border-white/15 animate-fade-in-up delay-200">
            <span className="text-[10px] font-black text-[#FE7C02] uppercase tracking-widest block mb-2">
              Core Pillars of Our Vision
            </span>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-3 rounded-2xl backdrop-blur-xs hover:border-[#FE7C02] transition">
              <Award className="w-5 h-5 text-[#FE7C02] shrink-0" />
              <div>
                <h4 className="text-xs font-black text-white">Talent Recognition & Merit</h4>
                <p className="text-[11px] text-[#C0C0C0]">Identifying unique student capabilities early on.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-3 rounded-2xl backdrop-blur-xs hover:border-[#FE7C02] transition">
              <Sparkles className="w-5 h-5 text-[#FE7C02] shrink-0" />
              <div>
                <h4 className="text-xs font-black text-white">Competitive Excellence</h4>
                <p className="text-[11px] text-[#C0C0C0]">Fostering daily practice and analytical speed.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-3 rounded-2xl backdrop-blur-xs hover:border-[#FE7C02] transition">
              <HeartHandshake className="w-5 h-5 text-[#FE7C02] shrink-0" />
              <div>
                <h4 className="text-xs font-black text-white">Equal Opportunity & Financial Support</h4>
                <p className="text-[11px] text-[#C0C0C0]">Providing transparent scholarships across Maharashtra.</p>
              </div>
            </div>
          </div>
        </div>

        {/* MISSION CARD */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-[#C0C0C0]/60 shadow-xl space-y-4 flex flex-col justify-between animate-fade-in-right hover:shadow-2xl transition duration-500">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#01295A] text-white rounded-2xl shadow-md">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#01295A] tracking-wide">
                OUR MISSION
              </h3>
            </div>

            <div className="space-y-3">
              {missions.map((m, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-[#C0C0C0]/40 shadow-xs hover:border-[#FE7C02] hover:-translate-y-0.5 transition duration-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FE7C02] shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm font-bold text-[#01295A]">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}