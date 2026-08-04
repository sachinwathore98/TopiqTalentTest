'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Camera, ShieldCheck, AlertTriangle, CheckCircle2, ChevronRight, Award, Lock, Play } from 'lucide-react';

export default function LiveExamRoom() {
  // Exam state
  const [examStarted, setExamStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [aiWarning, setAiWarning] = useState(false);
  
  const videoRef = useRef(null);

  // Sample 60-question mock bank simulation for Group C (Classes 9 & 10)
  const questions = [
    { id: 1, question: "If a train travels 240 km in 4 hours, what is its average speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], correct: 1, explanation: "Speed = Distance / Time = 240 / 4 = 60 km/h." },
    { id: 2, question: "Which organ in the human body filters blood to produce urine?", options: ["Heart", "Lungs", "Kidney", "Liver"], correct: 2, explanation: "Kidneys filter waste products and excess water from blood." },
    { id: 3, question: "Select the synonym for 'PERSISTENT':", options: ["Temporary", "Determined", "Lazy", "Uncertain"], correct: 1, explanation: "Persistent means continuing firmly or being determined." },
    { id: 4, question: "What is the pH value of pure distilled water at 25°C?", options: ["5", "7", "9", "14"], correct: 1, explanation: "Pure distilled water is neutral with a pH of exactly 7." },
    { id: 5, question: "Value of sin(30°) is:", options: ["0", "1/2", "1/√2", "1"], correct: 1, explanation: "Standard trigonometric ratio: sin(30°) = 0.5 or 1/2." }
  ];

  // Timer countdown
  useEffect(() => {
    let timer;
    if (examStarted && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && examStarted && !isSubmitted) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft, isSubmitted]);

  // Anti-cheating tab switch detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && examStarted && !isSubmitted) {
        setTabSwitchCount((prev) => prev + 1);
        setAiWarning(true);
        setTimeout(() => setAiWarning(false), 5000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examStarted, isSubmitted]);

  // Enable webcam feed for AI monitoring simulation
  useEffect(() => {
    if (examStarted && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.log('Webcam access error:', err));
    }
  }, [examStarted]);

  const handleOptionSelect = (qIdx, optIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {!examStarted ? (
          /* PRE-EXAM INSTRUCTION & PROCTORING CHECK */
          <div className="max-w-2xl mx-auto bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-6 text-center shadow-2xl mt-12">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Daily 8:00 PM Test Window</span>
              <h1 className="text-2xl md:text-3xl font-black text-white">Group C Live Exam Room</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                This exam is conducted under an AI Camera Monitoring System to ensure complete fairness and minimize malpractice. Ensure your front camera is enabled.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left space-y-2">
              <div className="text-xs font-black text-indigo-400 uppercase">Exam Specifications:</div>
              <ul className="text-xs text-slate-300 space-y-1 font-semibold">
                <li>• Total Duration: 40 Minutes (8:00 PM – 8:40 PM)</li>
                <li>• Total Questions: 60 MCQs (Randomized sequence)</li>
                <li>• Marking Scheme: +1 for correct, 0 for incorrect/unattempted</li>
                <li>• Rule: Switching browser tabs triggers AI warnings.</li>
              </ul>
            </div>

            <button
              onClick={() => setExamStarted(true)}
              className="w-full bg-[#FE7C02] hover:bg-[#E06B00] text-white font-black py-4 rounded-2xl shadow-lg transition cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Live Examination</span>
            </button>
          </div>
        ) : isSubmitted ? (
          /* POST-EXAM RESULT DISPLAY */
          <div className="max-w-2xl mx-auto bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-6 text-center shadow-2xl mt-12 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Instant Evaluation Complete</span>
              <h2 className="text-2xl md:text-3xl font-black">Your Score: {calculateScore()} / {questions.length}</h2>
              <p className="text-xs text-slate-400">Digital Marksheet and Daily Performance Report generated successfully.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-800 py-4 text-center">
              <div>
                <div className="text-xl font-black text-amber-400">{Math.round((calculateScore() / questions.length) * 100)}%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Accuracy</div>
              </div>
              <div>
                <div className="text-xl font-black text-indigo-400">{tabSwitchCount}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Tab Warnings</div>
              </div>
              <div>
                <div className="text-xl font-black text-sky-400">#4 State</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Est. Rank</div>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/student/dashboard'}
              className="w-full bg-white text-slate-950 font-black py-3.5 rounded-2xl hover:bg-slate-100 transition text-xs cursor-pointer"
            >
              Return to Student Dashboard
            </button>
          </div>
        ) : (
          /* ACTIVE EXAM INTERFACE WITH WEBCAM FEED */
          <div className="space-y-6 animate-fade-in">
            
            {/* TOP BAR: TIMER & AI CAMERA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">AI PROCTORING ACTIVE</span>
                <span className="text-xs text-slate-400">| Tab Warnings: <span className="text-rose-400 font-bold">{tabSwitchCount}</span></span>
              </div>

              <div className="flex items-center gap-4">
                {/* Simulated Webcam Feed Box */}
                <div className="relative w-24 h-16 bg-black rounded-xl overflow-hidden border border-slate-700">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror"></video>
                  <span className="absolute bottom-1 left-1 text-[8px] font-black bg-black/60 text-emerald-400 px-1.5 py-0.5 rounded">REC 🟢</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs text-slate-300 font-bold">Time Left:</span>
                  <span className="text-sm font-black text-amber-400 font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {aiWarning && (
              <div className="bg-rose-950/80 border border-rose-600 text-rose-200 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>AI Warning: Leaving the exam tab is monitored and recorded against your examination integrity record!</span>
              </div>
            )}

            {/* QUESTION PANEL */}
            <div className="bg-slate-950 p-6 md:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
                <span>Question {currentQIndex + 1} of {questions.length}</span>
                <span className="text-amber-400 font-black">Group C • MCQ Challenge</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-black text-white">
                  {questions[currentQIndex].id}. {questions[currentQIndex].question}
                </h3>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {questions[currentQIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(currentQIndex, optIdx)}
                        className={`p-4 rounded-xl text-xs md:text-sm font-semibold border text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white/20' : 'border-slate-600'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 disabled:opacity-30 hover:bg-slate-900 transition cursor-pointer"
                >
                  Previous
                </button>

                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-lg cursor-pointer"
                  >
                    Submit Final Exam
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}