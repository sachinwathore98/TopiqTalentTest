'use client';
import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ShieldCheck, ArrowLeft, BookOpen, Download, Share2 } from 'lucide-react';

export default function StudentResultReview() {
  // Mock performance data for completed exam session
  const examResult = {
    examTitle: '100-Day Challenge • Day 45 (Group C)',
    studentName: 'Rahul Sharma',
    date: 'August 3, 2026',
    totalScore: 48,
    totalQuestions: 60,
    accuracy: '80%',
    stateRank: '#4 State Rank',
    districtRank: '#1 District Rank',
    questions: [
      { 
        id: 1, 
        question: "If a train travels 240 km in 4 hours, what is its average speed?", 
        options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], 
        correct: 1, 
        userSelection: 1, 
        explanation: "Speed = Distance / Time = 240 km / 4 hours = 60 km/h." 
      },
      { 
        id: 2, 
        question: "Which organ in the human body filters blood to produce urine?", 
        options: ["Heart", "Lungs", "Kidney", "Liver"], 
        correct: 2, 
        userSelection: 0, // Incorrect choice
        explanation: "Kidneys filter metabolic waste products and excess ions from the blood." 
      },
      { 
        id: 3, 
        question: "Select the synonym for 'PERSISTENT':", 
        options: ["Temporary", "Determined", "Lazy", "Uncertain"], 
        correct: 1, 
        userSelection: 1, 
        explanation: "Persistent means continuing firmly in a course of action despite difficulty (synonym: Determined)." 
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#01295A] py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* BACK BUTTON & HEADER */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.location.href = '/student/dashboard'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#01295A] transition cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert('Digital Marksheet downloaded successfully!')}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#01295A] text-white px-4 py-2 rounded-xl hover:bg-[#013b7a] transition cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#FE7C02]" />
              <span>Download Marksheet</span>
            </button>
          </div>
        </div>

        {/* SCORECARD BANNER */}
        <div className="bg-[#01295A] text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden border border-[#FE7C02]/30">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FE7C02]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-[10px] font-black text-[#FE7C02] uppercase tracking-widest">{examResult.examTitle}</span>
              <h1 className="text-2xl md:text-3xl font-black mt-1">Official Performance Evaluation</h1>
              <p className="text-xs text-slate-300">Student: <span className="font-bold text-white">{examResult.studentName}</span> • Date: {examResult.date}</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider self-start sm:self-auto">
              Verified Result 🟢
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl md:text-3xl font-black text-emerald-400">{examResult.totalScore} / {examResult.totalQuestions}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase mt-1">Total Score</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl md:text-3xl font-black text-amber-400">{examResult.accuracy}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase mt-1">Accuracy Rate</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl md:text-3xl font-black text-sky-300">{examResult.stateRank}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase mt-1">Maharashtra Rank</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl md:text-3xl font-black text-indigo-300">{examResult.districtRank}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase mt-1">District Position</div>
            </div>
          </div>
        </div>

        {/* QUESTION-BY-QUESTION ANSWER KEY REVIEW */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest">🔑 OFFICIAL ANSWER KEY & SOLUTIONS</span>
              <h2 className="text-xl md:text-2xl font-black text-[#01295A] mt-0.5">Detailed Solution Review</h2>
            </div>
            <span className="text-xs font-bold bg-slate-200/70 text-slate-700 px-3 py-1 rounded-xl">
              Showing All Solutions
            </span>
          </div>

          <div className="space-y-4">
            {examResult.questions.map((q, idx) => {
              const isCorrect = q.userSelection === q.correct;

              return (
                <div key={idx} className={`p-6 rounded-3xl border shadow-xs space-y-4 ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                  
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm md:text-base font-black text-[#01295A]">
                      Q{idx + 1}. {q.question}
                    </h3>

                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-full shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isThisCorrect = optIdx === q.correct;
                      const isThisUserSel = optIdx === q.userSelection;

                      let style = "bg-white text-slate-700 border-slate-200";
                      if (isThisCorrect) {
                        style = "bg-emerald-600 text-white border-emerald-600 font-black shadow-xs";
                      } else if (isThisUserSel && !isCorrect) {
                        style = "bg-rose-600 text-white border-rose-600 font-black";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${style}`}>
                          <span>{opt}</span>
                          {isThisCorrect && <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded">Correct Answer</span>}
                          {isThisUserSel && !isThisCorrect && <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded">Your Answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3.5 bg-white/90 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium space-y-0.5">
                    <span className="font-black text-[#01295A] block">💡 Official Solution Explanation:</span>
                    <p>{q.explanation}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}