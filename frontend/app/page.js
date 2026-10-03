'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import BrandingMarqueeBanner from './components/BrandingMarqueeBanner';
import MultiGridBannerSection from './components/MultiGridBannerSection';
import AboutSection from './components/AboutSection';
import LearningGroupsSection from './components/LearningGroupsSection';
import ExamFormatSection from './components/ExamFormatSection';
import AnalyticsSection from './components/AnalyticsSection';
import RecognitionSection from './components/RecognitionSection';
import FranchiseSection from './components/FranchiseSection';
import StudentRegisterModal from './components/StudentRegisterModal';
import { X } from 'lucide-react';

export default function HomePage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [banners, setBanners] = useState([
    '/banners/1.png',
    '/banners/2.png',
    '/banners/3.png',
    '/banners/4.png'
  ]);
  const [popupBanners, setPopupBanners] = useState([]);
  const [festiveBanners, setFestiveBanners] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  // Fetch dynamic banners/ads uploaded from Super Admin dashboard for all positions
  useEffect(() => {
    const fetchLiveBanners = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/superadmin/banners`);
        const data = await res.json();
        if (data.success && data.banners && data.banners.length > 0) {
          // 1. Hero Banners
          const heroBanners = data.banners
            .filter(b => b.position === 'hero' && b.isActive !== false)
            .map(b => b.imageUrl);
          if (heroBanners.length > 0) {
            setBanners(heroBanners);
          }

          // 2. Popup Banners
          const popups = data.banners.filter(b => b.position === 'popup' && b.isActive !== false);
          setPopupBanners(popups);

          // 3. Festive / Flash Offer Banners
          const festive = data.banners.filter(b => b.position === 'festive_offer' && b.isActive !== false);
          setFestiveBanners(festive);
        }
      } catch (err) {
        console.error('Error fetching live banners:', err);
      }
    };
    fetchLiveBanners();
  }, [apiBaseUrl]);

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
      
      {/* POP-UP ANNOUNCEMENT MODAL RENDERER */}
      {popupBanners.length > 0 && showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 relative shadow-2xl border border-slate-200 overflow-hidden">
            <button 
              onClick={() => setShowPopup(false)} 
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            {popupBanners.map((popup, idx) => (
              <div key={idx} className="space-y-3">
                <a href={popup.targetLink || '#'} target="_blank" rel="noreferrer" className="block relative rounded-2xl overflow-hidden aspect-video shadow-inner">
                  <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" />
                </a>
                <div className="font-black text-sm text-[#01295A] text-center">{popup.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FESTIVE / FLASH OFFER BANNER RENDERER */}
      {festiveBanners.length > 0 && (
        <div className="w-full bg-[#FE7C02] text-white py-2 px-4 text-center font-black text-xs md:text-sm shadow-md flex items-center justify-center gap-3">
          {festiveBanners.map((festive, idx) => (
            <a key={idx} href={festive.targetLink || '#'} className="hover:underline flex items-center gap-2">
              <span>🔥 {festive.title}</span>
              <img src={festive.imageUrl} alt="Offer" className="h-6 w-auto object-contain rounded inline-block mx-1" />
            </a>
          ))}
        </div>
      )}

      {/* 1. DYNAMIC PHOTO BANNER SLIDER (Auto-synced with Super Admin Banners) */}
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

      {/* 3. MULTI-CARD PROMOTIONAL GRID SECTION */}
      <MultiGridBannerSection />

      {/* 4. BRANDING ADV SLIDERS & SCHOLARSHIP HIGHLIGHTS */}
      <BrandingMarqueeBanner onOpenStudentModal={handleOpenRegister} />

      {/* 5. ABOUT TOPIQ TALENT TEST */}
      <section id="about" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <AboutSection />
      </section>

      {/* 6. LEARNING GROUPS */}
      <section id="groups" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <LearningGroupsSection />
      </section>

      {/* 7. SMART EXAM SYSTEM */}
      <section id="format" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <ExamFormatSection />
      </section>

      {/* 8. PERFORMANCE ANALYTICS */}
      <section id="analytics" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <AnalyticsSection />
      </section>

      {/* 9. RECOGNITION & SCHOLARSHIPS */}
      <section id="rewards" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <RecognitionSection />
      </section>

      {/* 10. FRANCHISE BUSINESS MODEL */}
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