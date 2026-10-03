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
  const [popupBanners, setPopupBanners] = useState([]);
  const [festiveBanners, setFestiveBanners] = useState([]);
  const [showPopup, setShowPopup] = useState(true);

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const fetchLiveBanners = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/superadmin/banners`);
        const data = await res.json();
        if (data.success && data.banners && data.banners.length > 0) {
          const popups = data.banners.filter(b => b.position === 'popup' && b.isActive !== false);
          setPopupBanners(popups);

          const festive = data.banners.filter(b => b.position === 'festive_offer' && b.isActive !== false);
          setFestiveBanners(festive);
        }
      } catch (err) {
        console.error('Error fetching live banners:', err);
      }
    };
    fetchLiveBanners();
  }, [apiBaseUrl]);

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

      {/* 1. HERO BANNER & DAILY EXAM TIMER */}
      <section id="hero" className="scroll-mt-20 my-0 py-0">
        <HeroSection onOpenStudentModal={handleOpenRegister} />
      </section>

      {/* 2. TOP PROFESSIONAL SLIDER BANNER CAROUSEL */}
      <MultiGridBannerSection type="slider" />

      {/* SECTIONS 1, 2, 3 */}
      <section id="about" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <AboutSection />
      </section>

      <section id="groups" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <LearningGroupsSection />
      </section>

      <section id="format" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <ExamFormatSection />
      </section>

      {/* PARTNER MARQUEE AFTER EVERY 3 SECTIONS */}
      <MultiGridBannerSection type="marquee" />

      {/* SECTIONS 4, 5, 6 */}
      <section id="analytics" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <AnalyticsSection />
      </section>

      <section id="rewards" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <RecognitionSection />
      </section>

      <section id="franchise" className="scroll-mt-20 my-0 py-0 px-4 md:px-6">
        <FranchiseSection />
      </section>

      {/* BRANDING ADV SLIDERS */}
      <BrandingMarqueeBanner onOpenStudentModal={handleOpenRegister} />

      {/* BOTTOM MARQUEE */}
      <MultiGridBannerSection type="marquee" />

      {/* REGISTRATION MODAL */}
      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

    </div>
  );
}