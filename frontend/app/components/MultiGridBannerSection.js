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

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  // 1. TOP WIDE CINEMATIC SLIDER
  if (type === 'slider') {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-black group">
          {/* Changed aspect ratio to aspect-[4.5/1] for a wide cinematic banner look */}
          <div className="relative aspect-[3.5/1] sm:aspect-[4.5/1] w-full overflow-hidden">
            {banners.map((banner, idx) => (
              <div 
                key={banner._id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
              >
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 md:p-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#FE7C02] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                      <Sparkles className="w-2.5 h-2.5" /> Featured Spotlight
                    </span>
                  </div>
                  <h2 className="text-sm md:text-lg font-black tracking-tight">{banner.title}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/85 text-white p-2 rounded-full backdrop-blur-xs transition cursor-pointer shadow-md"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/85 text-white p-2 rounded-full backdrop-blur-xs transition cursor-pointer shadow-md"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute bottom-3 right-5 flex space-x-1.5 z-25">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer shadow ${idx === currentIndex ? 'bg-[#FE7C02] w-5' : 'bg-white/50 w-1.5'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  // 2. BOTTOM SMOOTH RIGHT-TO-LEFT MOVING MARQUEE
  return (
    <section className="w-full bg-slate-50 border-y border-slate-200 py-6 overflow-hidden relative my-4">
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
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Official Partners & Spotlights</h3>
      </div>

      <div className="marquee-rtl-container relative flex items-center overflow-hidden w-full">
        <div className="animate-marquee-rtl flex items-center gap-5">
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