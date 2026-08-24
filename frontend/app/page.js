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

  // Correct path pointing to your banners folder inside public
  const banners = [
    '/banners/1.png',
    '/banners/2.png',
    '/banners/3.png',
    '/banners/4.png'
  ];
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-slide effect every 4 seconds
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
      
      {/* 1. DYNAMIC 4-PHOTO BANNER SLIDER (Zero gap, exact image sizing) */}
      <section className="w-full bg-black m-0 p-0 leading-none">
        <div className="w-full relative m-0 p-0 overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`w-full transition-opacity duration-1000 ease-in-out ${
                index === currentBannerIndex ? 'opacity-100 relative z-10 block' : 'opacity-0 absolute inset-0 z-0 hidden'
              }`}
            >
              <img
                src={banner}
                alt={`TOPIQ Banner ${index + 1}`}
                className="w-full h-auto object-contain block m-0 p-0"
              />
            </div>
          ))}
          
          {/* Indicator Dots Overlay */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center space-x-2 pointer-events-auto">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`h-2 rounded-full transition-all shadow-md ${
                  index === currentBannerIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. HERO BANNER & DAILY EXAM TIMER */}
      <section id="hero" className="scroll-mt-20 my-0 py-0">
        <HeroSection onOpenStudentModal={handleOpenRegister} />
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