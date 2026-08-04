'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Award, 
  Video,
  Check,
  UserCheck,
  Laptop
} from 'lucide-react';

const DEMO_STEPS = [
  {
    stage: 1,
    title: "1. Student Login Board",
    desc: "At 8:00 PM, Rahul Sharma signs in with mobile number (+91 89566 43326).",
    type: "LOGIN_FRAME"
  },
  {
    stage: 2,
    title: "2. Class & Category Selection",
    desc: "Rahul selects Class 9 & 10 (Group C - Competitive Foundation).",
    type: "CLASS_FRAME"
  },
  {
    stage: 3,
    title: "3. Attempting Question 1",
    desc: "Q1: Average speed of train (240km / 4hrs)? Answers B) 60 km/h.",
    type: "Q1_FRAME"
  },
  {
    stage: 4,
    title: "4. Attempting Question 2",
    desc: "Q2: Which organ filters blood? Answers C) Kidney.",
    type: "Q2_FRAME"
  },
  {
    stage: 5,
    title: "5. Attempting Question 3",
    desc: "Q3: Synonym for PERSISTENT? Answers B) Determined.",
    type: "Q3_FRAME"
  },
  {
    stage: 6,
    title: "6. Instant Score & Rank Analytics",
    desc: "Instant Marksheet Generated: 10/10 Score • 100% Accuracy • State Rank #4.",
    type: "ANALYTICS_FRAME"
  },
  {
    stage: 7,
    title: "7. Official Answer Key & Solutions",
    desc: "Reviewing question-by-question solution explanations.",
    type: "SOLUTIONS_FRAME"
  }
];

export default function DemoVideoModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // AUTOMATED TIMED STEP SWITCHER
  useEffect(() => {
    let interval;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => (prev < DEMO_STEPS.length - 1 ? prev + 1 : 0));
      }, 3500); // 3.5s per frame step
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  const handleRestart = useCallback(() => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  }, []);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01295A]/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 relative shadow-2xl border border-[#C0C0C0]/60 space-y-4 overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-[#C0C0C0]/40 pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#FE7C02]" />
            <h3 className="text-base md:text-lg font-black text-[#01295A]">Student Portal Walkthrough Video</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#01295A] transition"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCREEN SIMULATOR DEVICE FRAME */}
        <div className="relative aspect-video rounded-2xl bg-[#01295A] text-white p-4 md:p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-[#FE7C02]/30">
          
          {/* TOP REC BANNER */}
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FE7C02] animate-ping"></span>
              <span className="text-[10px] font-black text-[#FE7C02] uppercase tracking-widest">
                REC • STUDENT PORTAL VIDEO SIMULATOR
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#C0C0C0] bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              Stage {currentStepIdx + 1} of {DEMO_STEPS.length}
            </span>
          </div>

          {/* DYNAMIC FRAME SIMULATION DISPLAY */}
          <div className="my-auto animate-fade-in space-y-3 max-w-xl mx-auto w-full z-10">
            
            {/* FRAME 1: LOGIN BOARD */}
            {currentStep.type === "LOGIN_FRAME" && (
              <div className="bg-[#001736] p-5 rounded-2xl border border-white/15 space-y-3 text-center">
                <UserCheck className="w-8 h-8 text-[#FE7C02] mx-auto" />
                <div>
                  <span className="text-[10px] font-black text-[#FE7C02] uppercase">Stage 1: Student Login Board</span>
                  <h4 className="text-sm md:text-base font-black text-white mt-1">Student Entering Credentials...</h4>
                </div>
                <div className="bg-[#01295A] p-2.5 rounded-xl border border-white/15 text-xs font-mono text-[#C0C0C0]">
                  Rahul Sharma • Mobile: +91 89566 43326
                </div>
              </div>
            )}

            {/* FRAME 2: CLASS SELECTION */}
            {currentStep.type === "CLASS_FRAME" && (
              <div className="bg-[#001736] p-5 rounded-2xl border border-white/15 space-y-3 text-center">
                <Laptop className="w-8 h-8 text-[#FE7C02] mx-auto" />
                <div>
                  <span className="text-[10px] font-black text-[#FE7C02] uppercase">Stage 2: Category & Class Selection</span>
                  <h4 className="text-sm md:text-base font-black text-white mt-1">Classes 9 & 10 Selected</h4>
                </div>
                <div className="bg-[#FE7C02]/20 border border-[#FE7C02]/40 p-2.5 rounded-xl text-xs font-bold text-white">
                  Group C • Competitive Foundation Test Bank
                </div>
              </div>
            )}

            {/* FRAME 3: QUESTION 1 */}
            {currentStep.type === "Q1_FRAME" && (
              <div className="bg-[#001736] p-5 rounded-2xl border border-white/15 space-y-3 text-left">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#FE7C02] border-b border-white/15 pb-2">
                  <span>Attempting Question 1 of 10</span>
                  <span>AI Proctoring: ACTIVE 🟢</span>
                </div>
                <p className="text-xs font-bold text-white">Q1. If a train travels 240 km in 4 hours, what is its average speed?</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-[#01295A] border border-white/15 rounded-lg text-[#C0C0C0]">A) 50 km/h</div>
                  <div className="p-2 bg-[#FE7C02] text-white font-black rounded-lg border border-[#FE7C02] flex items-center justify-between">
                    <span>B) 60 km/h</span>
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}

            {/* FRAME 4: QUESTION 2 */}
            {currentStep.type === "Q2_FRAME" && (
              <div className="bg-[#001736] p-5 rounded-2xl border border-white/15 space-y-3 text-left">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#FE7C02] border-b border-white/15 pb-2">
                  <span>Attempting Question 2 of 10</span>
                  <span>Time Remaining: 04:45</span>
                </div>
                <p className="text-xs font-bold text-white">Q2. Which organ in the human body filters blood to produce urine?</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-[#01295A] border border-white/15 rounded-lg text-[#C0C0C0]">A) Heart</div>
                  <div className="p-2 bg-[#FE7C02] text-white font-black rounded-lg border border-[#FE7C02] flex items-center justify-between">
                    <span>C) Kidney</span>
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}

            {/* FRAME 5: QUESTION 3 */}
            {currentStep.type === "Q3_FRAME" && (
              <div className="bg-[#001736] p-5 rounded-2xl border border-white/15 space-y-3 text-left">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#FE7C02] border-b border-white/15 pb-2">
                  <span>Attempting Question 3 of 10</span>
                  <span>Submitting Answers...</span>
                </div>
                <p className="text-xs font-bold text-white">Q3. Select the synonym for 'PERSISTENT':</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-[#FE7C02] text-white font-black rounded-lg border border-[#FE7C02] flex items-center justify-between">
                    <span>B) Determined</span>
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="p-2 bg-[#01295A] border border-white/15 rounded-lg text-[#C0C0C0]">C) Lazy</div>
                </div>
              </div>
            )}

            {/* FRAME 6: RESULT ANALYTICS */}
            {currentStep.type === "ANALYTICS_FRAME" && (
              <div className="bg-[#001736] p-5 rounded-2xl border border-white/15 space-y-3 text-center">
                <Award className="w-8 h-8 text-[#FE7C02] mx-auto" />
                <div>
                  <span className="text-[10px] font-black text-[#FE7C02] uppercase">Stage 6: Instant Evaluation & Rank</span>
                  <h4 className="text-sm md:text-base font-black text-white mt-1">Evaluation Score: 10 / 10</h4>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] border-t border-white/15 pt-2">
                  <div className="text-[#FE7C02] font-bold">100% Accuracy</div>
                  <div className="text-white font-bold">0 Incorrect</div>
                  <div className="text-[#C0C0C0] font-bold">#4 State Rank</div>
                </div>
              </div>
            )}

            {/* FRAME 7: SOLUTIONS */}
            {currentStep.type === "SOLUTIONS_FRAME" && (
              <div className="bg-[#001736] p-5 rounded-2xl border border-white/15 space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <span className="text-[10px] font-black text-[#FE7C02] uppercase">Stage 7: Official Solution Review</span>
                  <span className="text-[10px] text-white font-bold">Correct Solution (+1)</span>
                </div>
                <p className="text-xs font-bold text-white">Q1 Solution Explanation:</p>
                <div className="bg-[#01295A] p-2.5 rounded-xl border border-white/15 text-[11px] text-[#C0C0C0]">
                  💡 Speed = Distance / Time = 240 km / 4 hrs = 60 km/h.
                </div>
              </div>
            )}

          </div>

          {/* BOTTOM PROGRESS BAR */}
          <div className="space-y-1 z-10">
            <div className="w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#FE7C02] h-full transition-all duration-300" 
                style={{ width: `${((currentStepIdx + 1) / DEMO_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* PLAYER CONTROLS */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 bg-[#FE7C02] hover:bg-[#E06B00] text-white rounded-xl transition shadow-xs"
              aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-2.5 bg-slate-100 text-[#01295A] rounded-xl hover:bg-slate-200 transition border border-[#C0C0C0]/50"
              aria-label="Restart Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500">
            Stage {currentStepIdx + 1} of {DEMO_STEPS.length}
          </span>
        </div>

      </div>
    </div>
  );
}