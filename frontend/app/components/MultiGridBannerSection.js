'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function MultiGridBannerSection({ type = 'slider' }) {
  const [banners, setBanners] = useState([]);

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

  if (banners.length === 0) return null;

  // 1. SMALL COMPACT BANNER GRID (Replacing the large top banner)
  if (type === 'slider') {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FE7C02]" /> Featured Spotlights & Campaigns
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((banner, idx) => (
            <div key={banner._id || idx} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition group flex flex-col justify-between">
              <a href={banner.targetLink || '#'} target="_blank" rel="noreferrer" className="block relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
              </a>
              <div className="pt-3 pb-1 px-1 flex items-center justify-between">
                <div className="font-black text-xs text-[#01295A] truncate">{banner.title}</div>
                <span className="text-[9px] bg-[#FE7C02]/10 text-[#FE7C02] font-bold uppercase px-2 py-0.5 rounded-full">Active</span>
              </div>
            </div>
          ))}
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