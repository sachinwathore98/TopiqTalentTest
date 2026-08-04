'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogIn, UserPlus, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenStudentModal, onOpenLoginModal }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: "Home" },
    { href: '/about', label: "About TTT" },
    { href: '/groups', label: "Learning Groups" },
    { href: '/format', label: "Exam Format" },
    { href: '/rewards', label: "Scholarships" },
    { href: '/franchise', label: "Franchise" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#C0C0C0]/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 flex items-center justify-between gap-3">
        
        {/* LOGO & BRANDING */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl p-0.5 shadow-sm border border-[#C0C0C0]/60 group-hover:scale-105 transition duration-200">
            <Image src="/logo.png" alt="TOPIQ Logo" width={40} height={40} className="object-contain" priority />
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1 leading-none">
              <span className="text-xl md:text-2xl font-black tracking-tight uppercase">
                <span className="text-[#01295A]">TOP</span>
                <span className="text-[#FE7C02]">IQ</span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#FE7C02] fill-[#FE7C02]" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-[#01295A] uppercase tracking-[0.14em] leading-tight mt-0.5 whitespace-nowrap">
              Learn • Compete • Excel
            </span>
          </div>
        </Link>

        {/* DYNAMIC ACTIVE-HIGHLIGHTED NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs md:text-sm font-bold tracking-tight">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap py-1 px-1.5 transition-all duration-200 relative ${
                  isActive 
                    ? 'text-[#FE7C02] font-black scale-105' 
                    : 'text-[#01295A] hover:text-[#FE7C02]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FE7C02] rounded-full animate-zoom-in"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            type="button"
            onClick={onOpenLoginModal} 
            className="flex items-center gap-1.5 text-[#01295A] hover:text-[#FE7C02] font-bold text-xs md:text-sm px-3.5 py-2 rounded-xl border border-[#C0C0C0] bg-white hover:bg-slate-50 whitespace-nowrap transition cursor-pointer shadow-2xs"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FE7C02]" />
            <span>Login</span>
          </button>

          <button 
            type="button"
            onClick={onOpenStudentModal} 
            className="hidden sm:flex items-center gap-1.5 bg-[#FE7C02] hover:bg-[#E06B00] text-white px-4 py-2 rounded-xl font-bold text-xs md:text-sm shadow-md whitespace-nowrap transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

      </div>
    </header>
  );
}