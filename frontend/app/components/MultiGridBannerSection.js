'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function MultiGridBannerSection() {
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

  // Auto-slide effect for the main promotional slider
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
      {/* 1. PROFESSIONAL AUTO-SLIDING PROMOTIONAL BANNER CAROUSEL */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-[#01295A] group">
        <div className="relative aspect-[21/9] sm:aspect-[3.5/1] w-full overflow-hidden">
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

        {/* Carousel Navigation Arrows */}
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

            {/* Indicator Dots */}
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

      {/* 2. DISTRIBUTED SPONSOR / POST CARDS (Grid display for remaining items) */}
      {banners.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {banners.map((banner, idx) => (
            <div key={banner._id || idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition duration-300 flex flex-col justify-between">
              <a href={banner.targetLink || '#'} target="_blank" rel="noreferrer" className="block relative aspect-video w-full overflow-hidden bg-slate-100">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
              </a>
              <div className="p-4 space-y-1">
                <h4 className="text-xs font-black text-[#01295A] truncate">{banner.title}</h4>
                <span className="text-[10px] text-[#FE7C02] font-bold uppercase tracking-wider block">Official Partner Post</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}