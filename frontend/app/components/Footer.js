'use client';
import React from 'react';
import Image from 'next/image';
import { Youtube, Facebook, Instagram, Linkedin, Send, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const whatsappUrl = "https://wa.me/918956643326?text=Hello%20TOPIQ%20Team,%20I%20have%20an%20enquiry%20regarding%20the%20TTT%20Exam.";

  return (
    <footer className="bg-[#01295A] text-white pt-16 pb-12 border-t border-[#C0C0C0]/30 relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FE7C02]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10 mb-12 relative z-10">
        
        {/* BRAND COLUMN (SLIDES DOWN FROM TOP) */}
        <div className="space-y-4 animate-fade-in-down">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-2xl w-10 h-10 flex items-center justify-center shadow-md border border-[#C0C0C0]/50 hover:scale-105 transition duration-300">
              <Image src="/logo.png" alt="TOPIQ Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <span className="block text-sm font-black text-white tracking-wider">TOPIQ TALENT TEST</span>
              <span className="text-[10px] text-[#C0C0C0] uppercase tracking-widest">Balmitra Kids Pvt. Ltd.</span>
            </div>
          </div>
          
          <p className="text-xs text-[#C0C0C0] leading-relaxed font-medium">
            TOPIQ TALENT TEST (TTT) is an educational initiative by Balmitra Kids Private Limited to promote daily competitive learning and scholarship recognition across Maharashtra.
          </p>
          <p className="text-xs font-bold text-[#FE7C02] italic">"Every Talent Deserves Recognition."</p>
        </div>

        {/* QUICK LINKS (SLIDES IN FROM LEFT) */}
        <div className="animate-fade-in-left delay-100">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 inline-block">Quick Links</h4>
          <ul className="space-y-2.5 text-xs text-[#C0C0C0]">
            <li><a href="/about" className="hover:text-[#FE7C02] hover:translate-x-1 inline-block transition-all duration-200">About Balmitra Kids</a></li>
            <li><a href="/groups" className="hover:text-[#FE7C02] hover:translate-x-1 inline-block transition-all duration-200">Learning Groups (A - E)</a></li>
            <li><a href="/format" className="hover:text-[#FE7C02] hover:translate-x-1 inline-block transition-all duration-200">Smart Exam System</a></li>
            <li><a href="/rewards" className="hover:text-[#FE7C02] hover:translate-x-1 inline-block transition-all duration-200">State Scholarships</a></li>
            <li><a href="/franchise" className="hover:text-[#FE7C02] hover:translate-x-1 inline-block transition-all duration-200">Franchise Business Model</a></li>
          </ul>
        </div>

        {/* OFFICIAL CONTACT DETAILS (SLIDES IN FROM RIGHT) */}
        <div className="animate-fade-in-right delay-100">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 inline-block">Contact Us</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5 group">
              <MapPin className="w-4 h-4 text-[#FE7C02] shrink-0 mt-0.5 group-hover:scale-110 transition duration-200" />
              <span className="text-white font-medium">Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India</span>
            </li>
            <li className="flex items-center gap-2.5 group">
              <Phone className="w-4 h-4 text-[#FE7C02] shrink-0 group-hover:scale-110 transition duration-200" />
              <a href="tel:+918956643326" className="hover:text-[#FE7C02] transition font-bold text-white">
                +91 89566 43326
              </a>
            </li>
            <li className="flex items-center gap-2.5 group">
              <MessageCircle className="w-4 h-4 text-[#FE7C02] shrink-0 group-hover:scale-110 transition duration-200" />
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#FE7C02] transition font-bold text-white">
                WhatsApp: 8956643326
              </a>
            </li>
            <li className="flex items-center gap-2.5 group">
              <Mail className="w-4 h-4 text-[#FE7C02] shrink-0 group-hover:scale-110 transition duration-200" />
              <a href="mailto:topiqtalent@gmail.com" className="hover:text-[#FE7C02] transition text-white">
                topiqtalent@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL LINKS (ZOOMS IN) */}
        <div className="animate-zoom-in delay-200">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 inline-block">Connect With Us</h4>
          <p className="text-xs text-[#C0C0C0] mb-4 font-medium">Follow for daily answer keys, exam updates, and winner announcements.</p>
          
          <div className="flex flex-wrap gap-2.5">
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:text-[#FE7C02] hover:border-[#FE7C02] hover:scale-110 transition-all duration-300 shadow-sm" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:text-[#FE7C02] hover:border-[#FE7C02] hover:scale-110 transition-all duration-300 shadow-sm" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:text-[#FE7C02] hover:border-[#FE7C02] hover:scale-110 transition-all duration-300 shadow-sm" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:text-[#FE7C02] hover:border-[#FE7C02] hover:scale-110 transition-all duration-300 shadow-sm" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:text-[#FE7C02] hover:border-[#FE7C02] hover:scale-110 transition-all duration-300 shadow-sm" aria-label="Telegram">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* FOOTER COPYRIGHT (FADES UP) */}
      <div className="max-w-7xl mx-auto px-4 border-t border-white/15 pt-8 text-center text-xs text-[#C0C0C0] font-medium animate-fade-in-up delay-200 relative z-10">
        © 2026 Balmitra Kids Private Limited. All rights reserved.
      </div>
    </footer>
  );
}