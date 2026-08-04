'use client';
import React from 'react';
import { X, Award, BarChart2, CheckCircle } from 'lucide-react';

export default function StudentDashboardModal({ isOpen, studentData, onClose }) {
  if (!isOpen || !studentData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl border border-[#C0C0C0]/60 max-h-[90vh] overflow-y-auto text-[#01295A]">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#01295A] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-[#C0C0C0]/40 pb-4">
            <div className="w-12 h-12 bg-[#FE7C02] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md">
              {studentData.name[0]}
            </div>
            <div>
              <h3 className="text-xl font-black text-[#01295A]">{studentData.name}</h3>
              <p className="text-xs font-semibold text-slate-500">{studentData.studentClass} • Mobile: {studentData.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-2xl border border-[#C0C0C0]/40 shadow-xs">
              <Award className="w-6 h-6 text-[#FE7C02] mx-auto mb-1" />
              <div className="text-xl font-black text-[#01295A]">Day 12</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Current Milestone</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-[#C0C0C0]/40 shadow-xs">
              <CheckCircle className="w-6 h-6 text-[#FE7C02] mx-auto mb-1" />
              <div className="text-xl font-black text-[#01295A]">94.2%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Average Accuracy</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-[#C0C0C0]/40 shadow-xs">
              <BarChart2 className="w-6 h-6 text-[#FE7C02] mx-auto mb-1" />
              <div className="text-xl font-black text-[#01295A]">Rank #4</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">State Position</div>
            </div>
          </div>

          <div className="bg-[#01295A] text-white p-6 rounded-2xl flex items-center justify-between border border-[#FE7C02]/30 shadow-md">
            <div>
              <span className="text-xs font-bold text-[#FE7C02] block mb-1">TODAY'S EXAM SCHEDULE</span>
              <h4 className="font-black text-base">Daily 60-MCQ Test (Day 13)</h4>
              <p className="text-xs text-[#C0C0C0] font-medium">Available today from 8:00 PM to 8:40 PM</p>
            </div>
            <button className="bg-[#FE7C02] text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-[#E06B00] transition shadow-xs">
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}