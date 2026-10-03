'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function MultiGridBannerSection({ type = 'slider' }) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/superadmin/banners`);
        const data = await res.json();
        if (data.success && data.banners) {
          const activeBanners = data.banners.filter(b => b.position !== 'popup' && b.isActive !== false);
          setBanners(activeBanners);
        }
      } catch (err) {
        console.error('Error fetching grid banners:', err);
      }
    };
    fetchBanners();
  }, [apiBaseUrl]);

  // Auto-slide effect for the main slider
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  // 1. TOP PROFESSIONAL SLIDER
  if (type === 'slider') {
    const currentBanner = banners[currentIndex];
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-[#01295A] group">
          <div className="relative aspect-[21/9] sm:aspect-[3.8/1] w-full overflow-hidden">
            <img 
              src={currentBanner.imageUrl} 
              alt={currentBanner.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#FE7C02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Featured Spotlight
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight">{currentBanner.title}</h2>
            </div>
          </div>

          {banners.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-xs transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-xs transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 right-6 flex space-x-1.5 z-10">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#FE7C02] w-5' : 'bg-white/50 w-1.5'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  // 2. INTERLEAVED SECTION AD SPOT (Appears after every 3 sections)
  if (type === 'interleaved') {
    const banner = banners[currentIndex % banners.length];
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <a href={banner.targetLink || '#'} target="_blank" rel="noreferrer" className="w-full sm:w-1/3 aspect-video rounded-2xl overflow-hidden bg-slate-200 block shrink-0 shadow-inner">
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
          </a>
          <div className="space-y-2 w-full text-center sm:text-left">
            <span className="text-[10px] font-black uppercase bg-[#FE7C02]/10 text-[#FE7C02] px-3 py-1 rounded-full border border-[#FE7C02]/30">
              Sponsored Advertisement Spot
            </span>
            <h3 className="text-lg font-black text-[#01295A]">{banner.title}</h3>
            <p className="text-xs text-slate-500 font-medium">Explore premium educational resources and institutional opportunities across Maharashtra.</p>
          </div>
        </div>
      </section>
    );
  }

  // 3. BOTTOM SMOOTH RIGHT-TO-LEFT MOVING MARQUEE
  return (
    <section className="w-full bg-slate-50 border-t border-slate-200 py-8 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollRightToLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-rtl {
          display: flex;
          width: max-content;
          animation: scrollRightToLeft 25s linear infinite;
        }
        .marquee-rtl-container:hover .animate-marquee-rtl {
          animation-play-state: paused;
        }
      `}} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-4 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Official Partners & Spotlights</h3>
      </div>

      <div className="marquee-rtl-container relative flex items-center overflow-hidden w-full">
        <div className="animate-marquee-rtl flex items-center gap-5">
          {/* Quadruplicate array to ensure seamless infinite looping */}
          {[...banners, ...banners, ...banners, ...banners].map((banner, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-3 w-72 shrink-0 shadow-sm space-y-2 group hover:border-[#FE7C02] transition">
              <a href={banner.targetLink || '#'} target="_blank" rel="noreferrer" className="block relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              </a>
              <div className="font-black text-xs text-[#01295A] truncate">{banner.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}