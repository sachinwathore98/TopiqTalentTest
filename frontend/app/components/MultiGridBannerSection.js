'use client';
import React, { useState, useEffect } from 'react';

export default function MultiGridBannerSection() {
  const [banners, setBanners] = useState([]);

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/superadmin/banners`);
        const data = await res.json();
        if (data.success && data.banners) {
          // Fetch banners meant for grid or general display
          const gridBanners = data.banners.filter(b => b.position !== 'popup' && b.isActive !== false);
          setBanners(gridBanners);
        }
      } catch (err) {
        console.error('Error fetching grid banners:', err);
      }
    };
    fetchBanners();
  }, [apiBaseUrl]);

  if (banners.length === 0) return null;

  // Split banners into large feature cards and smaller grid spotlight cards
  const mainBanners = banners.slice(0, 2); // First 2 large side-by-side cards
  const spotlightBanners = banners.slice(2, 5); // Smaller grid cards

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
      {/* 1. Large Side-by-Side Featured Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mainBanners.map((banner, idx) => (
          <div key={banner._id || idx} className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden group hover:shadow-xl transition duration-300 flex flex-col justify-between">
            <a href={banner.targetLink || '#'} target="_blank" rel="noreferrer" className="block relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <img 
                src={banner.imageUrl} 
                alt={banner.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
              />
              <div className="absolute top-3 left-3 bg-[#01295A]/80 backdrop-blur-xs text-white text-[9px] font-black uppercase px-3 py-1 rounded-full">
                Featured Spotlight
              </div>
            </a>
            <div className="p-5 space-y-1">
              <h3 className="text-base font-black text-[#01295A]">{banner.title}</h3>
              <p className="text-xs text-slate-500 font-medium">Explore active Maharashtra Edition programs & opportunities.</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Smaller Multi-Card Spotlight Grid */}
      {spotlightBanners.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {spotlightBanners.map((spot, idx) => (
            <div key={spot._id || idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition duration-300 flex flex-col justify-between">
              <a href={spot.targetLink || '#'} target="_blank" rel="noreferrer" className="block relative aspect-video w-full overflow-hidden bg-slate-100">
                <img 
                  src={spot.imageUrl} 
                  alt={spot.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
              </a>
              <div className="p-4 space-y-1">
                <h4 className="text-xs font-black text-[#01295A] truncate">{spot.title}</h4>
                <span className="text-[10px] text-[#FE7C02] font-bold uppercase tracking-wider block">Sponsored Spotlight</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}