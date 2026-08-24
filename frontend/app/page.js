'use client';

import React, { useState, useEffect } from 'react';
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

  // Banner slider state for your 4 photos
  const banners = ['public/1.jpg', 'public/2.jpg', 'public/3.jpg', 'public/4.jpg'];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-slide effect every 4 seconds for your 4 photos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleOpenRegister = () => {
    setIsRegisterOpen(true);
  };

  return (
    <div className="space-y-0 animate-fade-in overflow-hidden pb-0 bg-white text-[#01295A]">
      
      {/* 1. HERO BANNER & DAILY EXAM TIMER */}
      <section id="hero" className="scroll-mt-20 my-0 py-0">
        <HeroSection onOpenStudentModal={handleOpenRegister} />
      </section>

      {/* 2. DYNAMIC 4-PHOTO BANNER SLIDER */}
      <section className="w-full bg-gray-900 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto relative h-[250px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={banner}
                alt={`TOPIQ Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Indicator Dots */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentBannerIndex ? 'bg-white w-6' : 'bg-white/50 w-2.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. BRANDING ADV SLIDERS & SCHOLARSHIP HIGHLIGHTS */}
      <BrandingMarqueeBanner onOpenStudentModal={handleOpenRegister} />

      {/* 4. ABOUT TOPIQ TALENT TEST */}
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