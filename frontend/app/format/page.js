'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Camera, 
  Laptop, 
  Award, 
  Play, 
  Pause,
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  XCircle,
  Video,
  X,
  ArrowRight,
  UserCheck,
  Check
} from 'lucide-react';

// CLASS CATEGORIES
const CLASS_OPTIONS = [
  { id: 'CLASS_3_5', name: 'Classes 3 to 5 (Foundation Stage)', group: 'Group A' },
  { id: 'CLASS_6_8', name: 'Classes 6 to 8 (Foundation Plus)', group: 'Group B' },
  { id: 'CLASS_9_10', name: 'Classes 9 & 10 (Competitive Foundation)', group: 'Group C' },
  { id: 'CLASS_11_12', name: 'Classes 11 & 12 (Career Prep)', group: 'Group D' },
  { id: 'COMPETITIVE', name: 'Competitive Exams (12th & Above)', group: 'Group E' },
];

// SAMPLE 10-QUESTION BANKS PER CLASS TIER
const QUESTION_BANKS = {
  CLASS_3_5: [
    { id: 1, question: "What is 15 multiplied by 8?", options: ["100", "120", "130", "140"], correct: 1, explanation: "15 x 8 = 120." },
    { id: 2, question: "Which is the largest land animal in the world?", options: ["Giraffe", "Blue Whale", "African Elephant", "Hippopotamus"], correct: 2, explanation: "African Elephant is the largest land mammal." },
    { id: 3, question: "Choose the correct spelling:", options: ["Beautifull", "Beautiful", "Beautifil", "Beutiful"], correct: 1, explanation: "The correct spelling is B-E-A-U-T-I-F-U-L." },
    { id: 4, question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], correct: 1, explanation: "A hexagon has 6 sides." },
    { id: 5, question: "Which gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2, explanation: "Plants take in Carbon Dioxide to make food." },
    { id: 6, question: "If 1 kg = 1000 grams, how many grams are in 3.5 kg?", options: ["3000g", "3500g", "3050g", "350g"], correct: 1, explanation: "3.5 x 1000 = 3500 grams." },
    { id: 7, question: "Complete the pattern: 2, 4, 8, 16, __", options: ["20", "24", "32", "64"], correct: 2, explanation: "Each number is multiplied by 2. 16 x 2 = 32." },
    { id: 8, question: "Which organ controls all functions of the human body?", options: ["Heart", "Lungs", "Brain", "Stomach"], correct: 2, explanation: "The brain is the control center of the body." },
    { id: 9, question: "Antonym of 'ANCIENT' is:", options: ["Old", "Modern", "Historic", "Past"], correct: 1, explanation: "Modern is the opposite of Ancient." },
    { id: 10, question: "How many hours are there in 2 days?", options: ["24", "36", "48", "60"], correct: 2, explanation: "24 hours/day x 2 = 48 hours." }
  ],
  CLASS_6_8: [
    { id: 1, question: "Simplify: (-12) + (-8) - (-10)", options: ["-10", "-30", "10", "0"], correct: 0, explanation: "-12 - 8 + 10 = -10." },
    { id: 2, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1, explanation: "Mars appears red due to iron oxide on its surface." },
    { id: 3, question: "Identify the pronoun in: 'She sings melodiously.'", options: ["She", "Sings", "Melodiously", "None"], correct: 0, explanation: "'She' is a pronoun." },
    { id: 4, question: "What is the square root of 144?", options: ["11", "12", "14", "16"], correct: 1, explanation: "12 x 12 = 144." },
    { id: 5, question: "Which light color bends the most through a glass prism?", options: ["Red", "Yellow", "Violet", "Green"], correct: 2, explanation: "Violet light has the shortest wavelength and bends the most." },
    { id: 6, question: "An angle measuring 90° is called:", options: ["Acute Angle", "Obtuse Angle", "Right Angle", "Reflex Angle"], correct: 2, explanation: "A 90-degree angle is a Right Angle." },
    { id: 7, question: "Which is the smallest prime number?", options: ["0", "1", "2", "3"], correct: 2, explanation: "2 is the smallest prime number." },
    { id: 8, question: "Chemical symbol for Sodium is:", options: ["So", "Na", "Sd", "S"], correct: 1, explanation: "Sodium symbol is Na." },
    { id: 9, question: "Find the average of 10, 20, 30, 40, and 50:", options: ["25", "30", "35", "40"], correct: 1, explanation: "Sum = 150 / 5 = 30." },
    { id: 10, question: "Which instrument measures atmospheric pressure?", options: ["Thermometer", "Barometer", "Ammeter", "Speedometer"], correct: 1, explanation: "Barometers measure atmospheric pressure." }
  ],
  CLASS_9_10: [
    { id: 1, question: "If a train travels 240 km in 4 hours, what is its average speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], correct: 1, explanation: "Speed = Distance/Time = 240/4 = 60 km/h." },
    { id: 2, question: "Which organ in the human body filters blood to produce urine?", options: ["Heart", "Lungs", "Kidney", "Liver"], correct: 2, explanation: "Kidneys filter waste products from the blood." },
    { id: 3, question: "Select the synonym for 'PERSISTENT':", options: ["Temporary", "Determined", "Lazy", "Uncertain"], correct: 1, explanation: "Persistent means continuing firmly." },
    { id: 4, question: "What is the pH value of pure distilled water?", options: ["5", "7", "9", "14"], correct: 1, explanation: "Pure water is neutral with a pH of 7." },
    { id: 5, question: "Value of sin(30°) is:", options: ["0", "1/2", "1/√2", "1"], correct: 1, explanation: "sin(30°) = 0.5 or 1/2." },
    { id: 6, question: "Unit of electrical resistance is:", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 2, explanation: "Resistance is measured in Ohms (Ω)." },
    { id: 7, question: "Which metal is liquid at room temperature?", options: ["Mercury", "Sodium", "Lead", "Aluminum"], correct: 0, explanation: "Mercury (Hg) is liquid at room temperature." },
    { id: 8, question: "Quadratic equation x² - 9 = 0 has roots:", options: ["±3", "±9", "3 only", "9 only"], correct: 0, explanation: "x² = 9 => x = +3 and -3." },
    { id: 9, question: "Who formulated the Laws of Motion?", options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"], correct: 1, explanation: "Sir Isaac Newton formulated the three laws of motion." },
    { id: 10, question: "Find HCF of 24 and 36:", options: ["6", "8", "12", "18"], correct: 2, explanation: "12 is the highest common factor of 24 and 36." }
  ],
  CLASS_11_12: [
    { id: 1, question: "Derivative of sin(x) with respect to x is:", options: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"], correct: 1, explanation: "d/dx(sin x) = cos x." },
    { id: 2, question: "SI unit of Electric Charge is:", options: ["Farad", "Coulomb", "Tesla", "Weber"], correct: 1, explanation: "Charge is measured in Coulombs (C)." },
    { id: 3, question: "Which gas obeys PV = nRT under ideal conditions?", options: ["Ideal Gas", "Real Gas", "Noble Gas", "Heavy Gas"], correct: 0, explanation: "Ideal gases strictly follow the Ideal Gas Law." },
    { id: 4, question: "Oxidation state of Oxygen in H₂O is:", options: ["+2", "-2", "-1", "0"], correct: 1, explanation: "In H₂O, Oxygen is -2." },
    { id: 5, question: "If log₁₀(x) = 3, then x equals:", options: ["30", "100", "1000", "3000"], correct: 2, explanation: "x = 10³ = 1000." },
    { id: 6, question: "Work done by a force when displacement is perpendicular to force:", options: ["Maximum", "Zero", "Negative", "Infinite"], correct: 1, explanation: "W = F·d·cos(90°) = 0." },
    { id: 7, question: "Which structure produces ribosomes in a cell?", options: ["Mitochondria", "Nucleolus", "Golgi Body", "Lysosome"], correct: 1, explanation: "The nucleolus synthesizes ribosomes." },
    { id: 8, question: "Integral of 1/x dx is:", options: ["x²", "ln|x| + C", "eˣ", "1/x²"], correct: 1, explanation: "∫(1/x)dx = ln|x| + C." },
    { id: 9, question: "Light year is a unit of:", options: ["Time", "Distance", "Speed", "Intensity"], correct: 1, explanation: "Light year measures astronomical distance." },
    { id: 10, question: "Which element has highest electronegativity?", options: ["Fluorine", "Chlorine", "Oxygen", "Nitrogen"], correct: 0, explanation: "Fluorine has the highest electronegativity." }
  ],
  COMPETITIVE: [
    { id: 1, question: "If A can do a job in 10 days and B in 15 days, together they complete it in:", options: ["5 days", "6 days", "8 days", "12 days"], correct: 1, explanation: "Work rate = 1/10 + 1/15 = 1/6 => 6 days." },
    { id: 2, question: "Capital of Maharashtra is:", options: ["Pune", "Nagpur", "Mumbai", "Chhatrapati Sambhajinagar"], correct: 2, explanation: "Mumbai is the state capital." },
    { id: 3, question: "Who is known as the Father of the Indian Constitution?", options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], correct: 1, explanation: "Dr. B.R. Ambedkar chaired the drafting committee." },
    { id: 4, question: "Simple interest on ₹5000 at 10% per annum for 2 years is:", options: ["₹500", "₹1000", "₹1200", "₹1500"], correct: 1, explanation: "SI = (5000 x 10 x 2)/100 = ₹1000." },
    { id: 5, question: "Look at the series: 7, 10, 8, 11, 9, 12, __ What comes next?", options: ["7", "10", "12", "13"], correct: 1, explanation: "Series pattern (-2): 12 - 2 = 10." },
    { id: 6, question: "Which article of Indian Constitution deals with Equality before law?", options: ["Article 12", "Article 14", "Article 19", "Article 21"], correct: 1, explanation: "Article 14 guarantees equality before law." },
    { id: 7, question: "Headquarters of Reserve Bank of India (RBI) is located in:", options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], correct: 1, explanation: "RBI head office is in Mumbai." },
    { id: 8, question: "If CAT = 24 and DOG = 26, then PIG = ?", options: ["32", "30", "36", "40"], correct: 0, explanation: "P(16) + I(9) + G(7) = 32." },
    { id: 9, question: "Largest river basin in India is:", options: ["Ganga", "Godavari", "Krishna", "Narmada"], correct: 0, explanation: "Ganga basin is the largest." },
    { id: 10, question: "Computer CPU stands for:", options: ["Central Processing Unit", "Core Power Utility", "Central Performance Unit", "Control Program Unit"], correct: 0, explanation: "CPU = Central Processing Unit." }
  ]
};

export default function FormatPage() {
  const [step, setStep] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [studentName, setStudentName] = useState('Rahul Sharma');
  const [mobileNumber, setMobileNumber] = useState('8956643326');
  const [selectedClassId, setSelectedClassId] = useState('CLASS_9_10');

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);

  const currentQuestions = QUESTION_BANKS[selectedClassId] || QUESTION_BANKS.CLASS_9_10;

  const [simStep, setSimStep] = useState(0); 
  const [isSimPlaying, setIsSimPlaying] = useState(true);

  useEffect(() => {
    let timer;
    if (step === 3 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 3) {
      setStep(4);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    let simTimer;
    if (isVideoModalOpen && isSimPlaying) {
      simTimer = setInterval(() => {
        setSimStep((prev) => (prev < 6 ? prev + 1 : 0));
      }, 3500);
    }
    return () => clearInterval(simTimer);
  }, [isVideoModalOpen, isSimPlaying]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!studentName || !mobileNumber) return;
    setStep(2);
  };

  const handleStartExam = () => {
    setStep(3);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimeLeft(300);
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = useCallback(() => {
    let correct = 0;
    currentQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct++;
    });
    return correct;
  }, [currentQuestions, selectedAnswers]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-12 min-h-screen bg-slate-50/50 px-4 md:px-6 animate-fade-in space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* 1. HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>EXAM ARCHITECTURE & DEMO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How Students Take the Exam
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
            Experience our full student portal journey—from student login and class category selection to solving sample questions, viewing instant analytics, and inspecting the official answer key.
          </p>
        </div>

        {/* 2. STEP-BY-STEP EXAM WORKFLOW + TUTORIAL VIDEO BANNER */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">🔄 EXAM WORKFLOW</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">Step-by-Step Student Experience</h2>
            </div>

            <button
              onClick={() => {
                setIsVideoModalOpen(true);
                setSimStep(0);
                setIsSimPlaying(true);
              }}
              className="bg-red-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs md:text-sm hover:bg-red-700 transition shadow-md flex items-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
              aria-label="Watch Walkthrough Video"
            >
              <Video className="w-4 h-4 fill-white" />
              <span>Watch Walkthrough Video</span>
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Log in at 8:00 PM", desc: "Students sign into their portal using their registered mobile number. The exam opens precisely at 8:00 PM.", icon: UserCheck },
              { step: "02", title: "AI Camera Verification", desc: "Browser camera permissions activate AI monitoring to ensure fair play and prevent malpractice during the test.", icon: Camera },
              { step: "03", title: "40-Min Timed Test", desc: "60 randomized MCQs appear one by one with a live countdown timer and easy option selection controls.", icon: Laptop },
              { step: "04", title: "Instant Marksheet & Rank", desc: "Upon submission or timer expiry at 8:40 PM, instant digital marksheets and state/district rankings are generated.", icon: Award }
            ].map((stepItem, idx) => {
              const Icon = stepItem.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
                  <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4 pointer-events-none">
                    {stepItem.step}
                  </span>
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 mb-1">{stepItem.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{stepItem.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. SIMULATED EXAM ENGINE CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 md:p-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Live Test Simulator
                </span>
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">🧪 FULL STUDENT PORTAL DEMO</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Practice Exam Engine</h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>1. Login</span>
              <span className="text-slate-300">•</span>
              <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>2. Class</span>
              <span className="text-slate-300">•</span>
              <span className={`px-3 py-1 rounded-full ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>3. Attempt Test</span>
              <span className="text-slate-300">•</span>
              <span className={`px-3 py-1 rounded-full ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>4. Analytics</span>
            </div>
          </div>

          {/* STEP 1: STUDENT LOGIN BOARD SIMULATION */}
          {step === 1 && (
            <div className="max-w-md mx-auto bg-slate-50 p-8 rounded-3xl border border-slate-200/80 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Student Login Board</h3>
                <p className="text-xs text-slate-500">Sign in to start your scheduled daily 100-Day MCQ challenge</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 8956643326"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-3.5 rounded-xl text-xs md:text-sm shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Select Class</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: CLASS SELECT SCREEN */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">Logged in as: <span className="font-black text-indigo-600">{studentName}</span> ({mobileNumber})</span>
                <button onClick={() => setStep(1)} className="text-[11px] font-bold text-indigo-600 underline cursor-pointer">Change Student</button>
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">Select Your Academic Class / Category</h3>
                <p className="text-xs text-slate-500">Choose a class category below to load a tailored 10-question practice test</p>
              </div>

              <div className="space-y-3">
                {CLASS_OPTIONS.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      selectedClassId === cls.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.01]'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${selectedClassId === cls.id ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                        {cls.group}
                      </span>
                      <h4 className="text-xs md:text-sm font-black mt-1.5">{cls.name}</h4>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedClassId === cls.id ? 'border-white bg-white/20' : 'border-slate-300'}`}>
                      {selectedClassId === cls.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleStartExam}
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-sm shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start 10-Question Test</span>
              </button>
            </div>
          )}

          {/* STEP 3: 10-QUESTION EXAM ENGINE */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 text-white p-4 rounded-2xl gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs font-black text-amber-400">AI PROCTORING ACTIVE</span>
                  <span className="text-xs text-slate-400">| Student: {studentName}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs text-slate-300 font-bold">Time Left:</span>
                  <span className="text-sm font-black text-amber-400 font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Question {currentQIndex + 1} of {currentQuestions.length}</span>
                  <span className="text-indigo-600 font-black">{CLASS_OPTIONS.find(c => c.id === selectedClassId)?.name}</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${((currentQIndex + 1) / currentQuestions.length) * 100}%` }}
                  ></div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {currentQuestions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = currentQIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`w-7 h-7 text-xs font-black rounded-lg transition border cursor-pointer ${
                          isCurrent 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                            : isAnswered 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200/80 space-y-6">
                <h3 className="text-base md:text-lg font-black text-slate-900 leading-snug">
                  {currentQuestions[currentQIndex].id}. {currentQuestions[currentQIndex].question}
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  {currentQuestions[currentQIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(currentQIndex, optIdx)}
                        className={`p-4 rounded-xl text-xs md:text-sm font-semibold border text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white/20' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer"
                >
                  Previous
                </button>

                {currentQIndex < currentQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition shadow-md cursor-pointer"
                  >
                    Submit 10-Question Test
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: RESULT ANALYTICS & ANSWER KEY */}
          {step === 4 && (
            <div className="space-y-10 animate-fade-in">
              <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 text-center border border-slate-800">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Instant Result & Performance Report</span>
                  <h3 className="text-2xl md:text-3xl font-black">Exam Evaluation Complete</h3>
                  <p className="text-xs text-slate-300">
                    Student: <span className="font-bold text-white">{studentName}</span> ({mobileNumber}) • Category: <span className="font-bold text-indigo-300">{CLASS_OPTIONS.find(c => c.id === selectedClassId)?.name}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center border-t border-b border-white/10 py-6">
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-emerald-400">{calculateScore()} / {currentQuestions.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Total Score</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-amber-400">{Math.round((calculateScore() / currentQuestions.length) * 100)}%</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-indigo-300">{currentQuestions.length - calculateScore()}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-sky-300">#4 State</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Estimated Rank</div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="bg-white/10 border border-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-white/20 transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Practice Portal</span>
                </button>
              </div>

              {/* ANSWER KEY REVIEW */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">🔑 DAILY OFFICIAL ANSWER KEY</span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">Question-by-Question Solution Review</h3>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                    All 10 Solutions
                  </span>
                </div>

                <div className="space-y-4">
                  {currentQuestions.map((q, idx) => {
                    const userSel = selectedAnswers[idx];
                    const isCorrect = userSel === q.correct;
                    const isAttempted = userSel !== undefined;

                    return (
                      <div key={idx} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : isAttempted ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-sm font-black text-slate-900">
                            Q{idx + 1}. {q.question}
                          </h4>

                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> Correct (+1)
                            </span>
                          ) : isAttempted ? (
                            <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shrink-0">
                              <XCircle className="w-3 h-3" /> Incorrect (0)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shrink-0">
                              Unattempted
                            </span>
                          )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isThisCorrect = optIdx === q.correct;
                            const isThisUserSel = userSel === optIdx;

                            let btnStyle = "bg-white text-slate-700 border-slate-200";
                            if (isThisCorrect) {
                              btnStyle = "bg-emerald-600 text-white border-emerald-600 font-black shadow-xs";
                            } else if (isThisUserSel && !isCorrect) {
                              btnStyle = "bg-rose-600 text-white border-rose-600 font-black";
                            }

                            return (
                              <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${btnStyle}`}>
                                <span>{opt}</span>
                                {isThisCorrect && <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded">Correct Answer</span>}
                                {isThisUserSel && !isThisCorrect && <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded">Your Answer</span>}
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                          <span className="font-black text-indigo-900 block mb-0.5">💡 Solution & Explanation:</span>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. ANIMATED WALKTHROUGH VIDEO SIMULATOR MODAL POPUP */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 relative shadow-2xl border border-slate-100 overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                <h3 className="text-base md:text-lg font-black text-slate-900">Live Exam Portal Video Simulation</h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                aria-label="Close Video Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl bg-slate-950 text-white p-4 md:p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    REC • STUDENT PORTAL VIDEO DEMO ({simStep + 1}/7)
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
                  {simStep * 3.5}s / 24.5s
                </span>
              </div>

              <div className="my-auto animate-fade-in space-y-3 max-w-xl mx-auto w-full">
                {simStep === 0 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-center">
                    <UserCheck className="w-8 h-8 text-indigo-400 mx-auto" />
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase">Stage 1: Student Login Board</span>
                      <h4 className="text-sm md:text-base font-black text-white mt-1">Student Entering Credentials...</h4>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                      Rahul Sharma • Mobile: +91 8956643326
                    </div>
                  </div>
                )}

                {simStep === 1 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-center">
                    <Laptop className="w-8 h-8 text-indigo-400 mx-auto" />
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase">Stage 2: Category & Class Selection</span>
                      <h4 className="text-sm md:text-base font-black text-white mt-1">Classes 9 & 10 Selected</h4>
                    </div>
                    <div className="bg-indigo-600/30 border border-indigo-500/50 p-2.5 rounded-xl text-xs font-bold text-indigo-200">
                      Group C • Competitive Foundation Test Bank
                    </div>
                  </div>
                )}

                {simStep === 2 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 border-b border-slate-800 pb-2">
                      <span>Attempting Question 1 of 10</span>
                      <span>AI Proctoring: ACTIVE 🟢</span>
                    </div>
                    <p className="text-xs font-bold text-white">Q1. If a train travels 240 km in 4 hours, what is its average speed?</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">A) 50 km/h</div>
                      <div className="p-2 bg-emerald-600 text-white font-black rounded-lg border border-emerald-500 flex items-center justify-between">
                        <span>B) 60 km/h</span>
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}

                {simStep === 3 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 border-b border-slate-800 pb-2">
                      <span>Attempting Question 2 of 10</span>
                      <span>Time Remaining: 04:45</span>
                    </div>
                    <p className="text-xs font-bold text-white">Q2. Which organ in the human body filters blood to produce urine?</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">A) Heart</div>
                      <div className="p-2 bg-emerald-600 text-white font-black rounded-lg border border-emerald-500 flex items-center justify-between">
                        <span>C) Kidney</span>
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}

                {simStep === 4 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 border-b border-slate-800 pb-2">
                      <span>Attempting Question 3 of 10</span>
                      <span>Submitting Answers...</span>
                    </div>
                    <p className="text-xs font-bold text-white">Q3. Select the synonym for 'PERSISTENT':</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-emerald-600 text-white font-black rounded-lg border border-emerald-500 flex items-center justify-between">
                        <span>B) Determined</span>
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">C) Lazy</div>
                    </div>
                  </div>
                )}

                {simStep === 5 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-center">
                    <Award className="w-8 h-8 text-amber-400 mx-auto" />
                    <div>
                      <span className="text-[10px] font-black text-amber-400 uppercase">Stage 4: Instant Evaluation & Rank</span>
                      <h4 className="text-sm md:text-base font-black text-white mt-1">Evaluation Score: 10 / 10</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] border-t border-slate-800 pt-2">
                      <div className="text-emerald-400 font-bold">100% Accuracy</div>
                      <div className="text-indigo-300 font-bold">0 Incorrect</div>
                      <div className="text-sky-300 font-bold">#4 State Rank</div>
                    </div>
                  </div>
                )}

                {simStep === 6 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-black text-indigo-400 uppercase">Stage 5: Official Solution Review</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Correct Solution (+1)</span>
                    </div>
                    <p className="text-xs font-bold text-white">Q1 Solution Explanation:</p>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      💡 Speed = Distance / Time = 240 km / 4 hrs = 60 km/h.
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1 z-10">
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-300" 
                    style={{ width: `${((simStep + 1) / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimPlaying(!isSimPlaying)}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer"
                  aria-label={isSimPlaying ? "Pause Walkthrough" : "Play Walkthrough"}
                >
                  {isSimPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => {
                    setSimStep(0);
                    setIsSimPlaying(true);
                  }}
                  className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  aria-label="Restart Walkthrough"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-bold text-slate-500">
                Stage {simStep + 1} of 7
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}