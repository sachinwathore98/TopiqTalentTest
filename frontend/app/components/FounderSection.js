'use client';
import React from 'react';
import { Quote, Building2 } from 'lucide-react';


export default function FounderSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-white border-b border-[#C0C0C0]/40 text-[#01295A]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-[#C0C0C0]/60 shadow-xl relative overflow-hidden animate-zoom-in hover:shadow-2xl transition duration-500">
          
          {/* BACKGROUND DECORATIVE QUOTE */}
          <Quote className="w-32 h-32 text-[#FE7C02]/10 absolute -top-4 -right-4 pointer-events-none" />

          {/* SECTION BADGE */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in-down">
            <span className="bg-[#FE7C02] text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
              {t('founderTag')}
            </span>
          </div>

          {/* SALUTATION */}
          <p className="text-sm font-extrabold text-[#01295A] mb-4 relative z-10 animate-fade-in-left">
            Dear Students, Parents, Teachers, and the TOPIQ Family,
          </p>

          {/* VERBATIM FOUNDER'S MESSAGE BODY */}
          <div className="space-y-4 text-slate-700 font-medium text-sm md:text-base leading-relaxed relative z-10 animate-fade-in-left delay-100">
            <p>
              In today's highly competitive world, academic success alone is not enough.
              Students must also develop logical thinking, problem-solving skills, time
              management, accuracy, consistency, confidence, and a competitive mindset to
              succeed in their future careers.
            </p>
            <p>
              With this vision, <strong className="text-[#01295A] font-black">TOPIQ TALENT TEST (TTT)</strong> has been introduced as a 100-Day
              Online MCQ Talent Recognition & Scholarship Challenge.
            </p>
            <p>
              TTT is not just an examination; it is an educational initiative designed to
              recognize talent, reward excellence, encourage continuous learning, and provide
              financial support through scholarships.
            </p>
            <p>
              The program motivates students to practice every day, assess their own
              performance, improve continuously, and build a strong foundation for future
              academic and competitive examinations.
            </p>
            <p className="italic font-bold text-[#01295A] bg-[#FE7C02]/10 p-3.5 rounded-r-xl border-l-4 border-[#FE7C02]">
              At TOPIQ, we believe that every student possesses unique talent, and every
              talent deserves the right platform to shine.
            </p>
          </div>

          {/* FOOTER & MOTTO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#C0C0C0]/50 pt-6 mt-8 gap-4 relative z-10 animate-fade-in-up delay-200">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FE7C02] shrink-0" />
                <p className="font-black text-[#01295A] text-base md:text-lg">
                  {t('founderOrg')}
                </p>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-6">
                Organizing Body, TOPIQ TALENT TEST
              </p>
            </div>
            
            <div className="bg-[#01295A] text-white border border-[#01295A] px-4 py-2 rounded-xl text-xs md:text-sm font-black italic shadow-xs">
              "{t('founderSlogan')}"
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}