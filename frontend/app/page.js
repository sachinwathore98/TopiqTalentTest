'use client';

import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import BrandingMarqueeBanner from './components/BrandingMarqueeBanner';
import AboutSection from './components/AboutSection';
import LearningGroupsSection from './components/LearningGroupsSection';
import ExamFormatSection from './components/ExamFormatSection';
import AnalyticsSection from './components/AnalyticsSection';
import RecognitionSection from './components/RecognitionSection';
import FranchiseSection from './components/FranchiseSection';
import StudentRegisterModal from './components/StudentRegisterModal';

export default function HomePage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleOpenRegister = () => {
    setIsRegisterOpen(true);
  };

  return (
    <div className="space-y-0 animate-fade-in overflow-hidden pb-0 bg-white text-[#01295A]">
      
      {/* 1. HERO BANNER & DAILY EXAM TIMER */}
      <section id="hero" className="scroll-mt-20 my-0 py-0">
        <HeroSection onOpenStudentModal={handleOpenRegister} />
      </section>

      {/* 2. BRANDING ADV SLIDERS & SCHOLARSHIP HIGHLIGHTS */}
      <BrandingMarqueeBanner onOpenStudentModal={handleOpenRegister} />

      {/* 3. ABOUT TOPIQ TALENT TEST */}
      <section id="about" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <AboutSection />
      </section>


      {/* 5. LEARNING GROUPS */}
      <section id="groups" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <LearningGroupsSection />
      </section>

      {/* 6. SMART EXAM SYSTEM */}
      <section id="format" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <ExamFormatSection />
      </section>

      {/* 7. PERFORMANCE ANALYTICS */}
      <section id="analytics" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <AnalyticsSection />
      </section>

      {/* 8. RECOGNITION & SCHOLARSHIPS */}
      <section id="rewards" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <RecognitionSection />
      </section>

      {/* 9. FRANCHISE BUSINESS MODEL */}
      <section id="franchise" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <FranchiseSection />
      </section>

      {/* REGISTRATION MODAL TRIGGERED FROM HOMEPAGE BUTTONS */}
      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

    </div>
  );
}