'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function DynamicBannerDisplay({ position = 'hero' }) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/superadmin/banners`);
        const data = await res.json();
        if (data.success && data.banners) {
          const filtered = data.banners.filter(b => b.position === position && b.isActive !== false);
          setBanners(filtered);
        }
      } catch (err) {
        console.error('Error loading banners:', err);
      }
    };
    fetchBanners();
  }, [apiBaseUrl, position]);

  // Auto-slide for carousel if multiple banners exist for hero/festive positions
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  // Render Pop-up Modal if position is popup
  if (position === 'popup' && showPopup) {
    const banner = banners[0];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 animate-fade-in">
        <div className="bg-white rounded-3xl max-w-lg w-full p-4 relative shadow-2xl border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setShowPopup(false)} 
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <a href={banner.targetLink || '#'} target="_blank" rel="noreferrer" className="block relative rounded-2xl overflow-hidden aspect-video">
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
          </a>
        </div>
      </div>
    );
  }

  // Render Standard Banner Carousel / Image for other positions
  const currentBanner = banners[currentIndex];

  return (
    <div className="w-full relative overflow-hidden rounded-2xl shadow-md my-4">
      <a href={currentBanner.targetLink || '#'} target="_blank" rel="noreferrer" className="block relative w-full aspect-[21/9] sm:aspect-[3/1]">
        <img 
          src={currentBanner.imageUrl} 
          alt={currentBanner.title} 
          className="w-full h-full object-cover" 
        />
      </a>
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}