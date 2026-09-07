'use client';
import React, { useState } from 'react';
import { Clock, Camera, Shuffle, FileText, ShieldCheck, BarChart2 } from 'lucide-react';

export default function ExamFormatSection() {
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'mr'
  const [examStarted, setExamStarted] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('Group C');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Localization Dictionary for English, Hindi, and Marathi
  const t = {
    en: {
      langLabel: "Select Language:",
      startDemoBtn: "Take Interactive Demo Exam",
      title: "Exam Format & Security Features",
      selectGroupTitle: "Select Your Academic Class / Category",
      selectGroupDesc: "Choose a class category below to launch a tailored sample assessment.",
      startBtn: "Start Demo Assessment",
      submitBtn: "Submit Exam",
      nextBtn: "Next Question",
      prevBtn: "Previous",
      congrats: "Assessment Completed Successfully!",
      certTitle: "Certificate of Excellence",
      certText: "This is proudly presented to the student for successfully completing the TOPIQ Talent Test (TTT) Sample Assessment.",
      scorecard: "Overall Scorecard",
      subjectAnalytics: "Subject-Wise Performance Analytics",
      growthOverview: "Overview for Future Growth",
      retakeBtn: "Retake Demo Exam",
      printCert: "Download / Print Certificate"
    },
    hi: {
      langLabel: "भाषा चुनें:",
      startDemoBtn: "इंटरैक्टिव डेमो परीक्षा दें",
      title: "परीक्षा प्रारूप और सुरक्षा विशेषताएँ",
      selectGroupTitle: "अपनी शैक्षणिक कक्षा / श्रेणी चुनें",
      selectGroupDesc: "एक अनुकूलित नमूना मूल्यांकन लॉन्च करने के लिए नीचे कक्षा श्रेणी चुनें।",
      startBtn: "डेमो परीक्षा शुरू करें",
      submitBtn: "परीक्षा जमा करें",
      nextBtn: "अगला प्रश्न",
      prevBtn: "पिछला",
      congrats: "मूल्यांकन सफलतापूर्वक संपन्न हुआ!",
      certTitle: "उत्कृष्टता प्रमाण पत्र",
      certText: "यह प्रमाण पत्र TOPIQ टैलेंट टेस्ट (TTT) नमूना मूल्यांकन सफलतापूर्वक पूरा करने के लिए छात्र को प्रदान किया जाता है।",
      scorecard: "समग्र स्कोरकार्ड",
      subjectAnalytics: "विषय-वार प्रदर्शन विश्लेषण",
      growthOverview: "भविष्य के विकास का अवलोकन",
      retakeBtn: "पुनः डेमो परीक्षा दें",
      printCert: "प्रमाण पत्र डाउनलोड करें"
    },
    mr: {
      langLabel: "भाषा निवडा:",
      startDemoBtn: "परस्परसंवादी डेमो परीक्षा द्या",
      title: "परीक्षा स्वरूप आणि सुरक्षा वैशिष्ट्ये",
      selectGroupTitle: "तुमचा शैक्षणिक वर्ग / वर्गवारी निवडा",
      selectGroupDesc: "एक सानुकूलित नमुना चाचणी सुरू करण्यासाठी खालीलपैकी वर्ग वर्गवारी निवडा.",
      startBtn: "डेमो परीक्षा सुरू करा",
      submitBtn: "परीक्षा सबमिट करा",
      nextBtn: "पुढचा प्रश्न",
      prevBtn: "मागील",
      congrats: "मूल्यांकन यशस्वीरीत्या पूर्ण झाले!",
      certTitle: "उत्कृष्टता प्रमाणपत्र",
      certText: "हे प्रमाणपत्र TOPIQ टैलेंट टेस्ट (TTT) नमुना मूल्यांकन यशस्वीरीत्या पूर्ण केल्याबद्दल विद्यार्थ्याला प्रदान करण्यात येत आहे.",
      scorecard: "एकूण गुणपत्रिका (Scorecard)",
      subjectAnalytics: "विषयनिहाय कामगिरी विश्लेषण",
      growthOverview: "भविष्यातील विकासाचा दृष्टिकोन",
      retakeBtn: "पुन्हा डेमो परीक्षा द्या",
      printCert: "प्रमाणपत्र डाउनलोड करा"
    }
  };

  const features = [
    { title: '100% Online Examination', desc: 'Appear using any mobile phone, tablet, laptop, or desktop with internet connection.', icon: Clock },
    { title: 'AI Camera Monitoring System', desc: 'Monitored under an AI-powered Camera Monitoring System to minimize malpractice.', icon: Camera },
    { title: 'Randomized Question & Option Sequence', desc: 'Order of questions and answer options automatically randomized for every student.', icon: Shuffle },
    { title: 'Same-Day Instant Result & Marksheet', desc: 'Digital marksheets and results generated immediately after test completion.', icon: FileText },
    { title: 'Daily Official Answer Key', desc: 'Published same day to enable students to verify answers and learn from mistakes.', icon: ShieldCheck },
    { title: '100-Day Grand Performance Memo', desc: 'Consolidated performance report issued after successfully completing the 100 days.', icon: BarChart2 }
  ];

  const groups = [
    { id: 'Group A', name: 'Classes 3 to 5 (Foundation Stage)' },
    { id: 'Group B', name: 'Classes 6 to 8 (Foundation Plus)' },
    { id: 'Group C', name: 'Classes 9 & 10 (Competitive Foundation)' },
    { id: 'Group D', name: 'Classes 11 & 12 (Career Prep)' }
  ];

  const questions = [
    {
      id: 1,
      q: {
        en: "What is the primary objective of the TOPIQ 100-Day MCQ Challenge?",
        hi: "TOPIQ 100-दिवसीय MCQ चैलेंज का मुख्य उद्देश्य क्या है?",
        mr: "TOPIQ १००-दिवसीय MCQ चॅलेंजचा मुख्य उद्देश काय आहे?"
      },
      options: {
        en: ["Rote Memorization", "Conceptual Clarity & Speed", "Random Guessing", "Physical Fitness"],
        hi: ["रटकर याद करना", "वैचारिक स्पष्टता और गति", "यादृच्छिक अनुमान", "शारीरिक तंदुरुस्ती"],
        mr: ["पाठांतर करणे", "वैचारिक स्पष्टता आणि वेग", "अंदाजे उत्तर देणे", "शारीरिक तंदुरुस्ती"]
      },
      correct: 1
    },
    {
      id: 2,
      q: {
        en: "Which analytical approach helps in tracking real-time cognitive growth?",
        hi: "कौन सा विश्लेषणात्मक दृष्टिकोण वास्तविक समय के संज्ञानात्मक विकास को ट्रैक करने में मदद करता है?",
        mr: "कोणता विश्लेषणात्मक दृष्टिकोन रिअल-टाइम ज्ञानात्मक वाढ ट्रॅक करण्यास मदत करतो?"
      },
      options: {
        en: ["Ignoring mistakes", "Daily 10-minute MCQ analytics", "Yearly exams only", "No tracking"],
        hi: ["गलतियों को नजरअंदाज करना", "दैनिक 10-मिनट एमसीक्यू एनालिटिक्स", "केवल वार्षिक परीक्षा", "कोई ट्रैकिंग नहीं"],
        mr: ["चुकांकडे दुर्लक्ष करणे", "दररोज १० मिनिटे एमसीक्यू विश्लेषण", "फक्त वार्षिक परीक्षा", "कोणतेही ट्रॅकिंग नाही"]
      },
      correct: 1
    }
  ];

  const handleOptionSelect = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const handleFinishExam = () => {
    setIsCompleted(true);
  };

  const handleReset = () => {
    setExamStarted(false);
    setIsCompleted(false);
    setAnswers({});
    setCurrentQuestion(0);
  };

  return (
    <section id="format" className="py-12 px-4 max-w-7xl mx-auto space-y-10 bg-white text-[#01295A]">
      
      {/* LANGUAGE SWITCHER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-4">
        <span className="text-xs font-bold text-[#01295A] uppercase tracking-wider">{t[language].langLabel}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              language === 'en' ? 'bg-[#01295A] text-white shadow' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              language === 'hi' ? 'bg-[#01295A] text-white shadow' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            हिंदी (Hindi)
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              language === 'mr' ? 'bg-[#01295A] text-white shadow' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            मराठी (Marathi)
          </button>
        </div>
      </div>

      {/* BANNER CONTAINER */}
      <div className="bg-[#01295A] text-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#FE7C02]/30 space-y-6 animate-zoom-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest block mb-1">
              SMART EXAM SYSTEM
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {t[language].title}
            </h2>
          </div>
          {!examStarted && !isCompleted && (
            <button
              onClick={() => setExamStarted(true)}
              className="px-6 py-3.5 bg-[#FE7C02] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:bg-orange-600 transition self-start md:self-auto"
            >
              {t[language].startDemoBtn}
            </button>
          )}
        </div>
        
        {/* STATS TILES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300">
            <div className="text-3xl font-black text-[#FE7C02]">100 Days</div>
            <div className="text-xs text-[#C0C0C0] mt-1 uppercase font-bold">TOTAL DAYS</div>
          </div>
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300">
            <div className="text-3xl font-black text-white">60 MCQs</div>
            <div className="text-xs text-[#C0C0C0] mt-1 uppercase font-bold">TOTAL MCQS</div>
          </div>
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300">
            <div className="text-3xl font-black text-[#FE7C02]">40 Mins</div>
            <div className="text-xs text-[#C0C0C0] mt-1 uppercase font-bold">MINUTES DAILY</div>
          </div>
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl backdrop-blur-xs hover:scale-105 transition duration-300">
            <div className="text-xl md:text-3xl font-black text-white">8:00–8:40 PM</div>
            <div className="text-xs text-[#C0C0C0] mt-1 uppercase font-bold">Daily Exam Schedule</div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DEMO EXAM WORKFLOW CONTAINER */}
      {examStarted && !isCompleted && (
        <div className="bg-slate-50 p-6 sm:p-10 rounded-3xl border-2 border-[#01295A] shadow-xl animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#FE7C02] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Active Mode: {selectedGroup}
            </span>
            <span className="text-xs font-bold text-[#01295A]">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <h3 className="text-xl font-black text-[#01295A] mb-6">
            {questions[currentQuestion].q[language]}
          </h3>

          <div className="space-y-3 mb-8">
            {questions[currentQuestion].options[language].map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                  answers[currentQuestion] === idx ? 'border-[#01295A] bg-blue-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  checked={answers[currentQuestion] === idx}
                  onChange={() => handleOptionSelect(currentQuestion, idx)}
                  className="w-4 h-4 text-[#01295A] mr-3"
                />
                <span className="text-sm font-bold text-slate-800">{option}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl disabled:opacity-30"
            >
              {t[language].prevBtn}
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-2.5 bg-[#01295A] text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition shadow"
              >
                {t[language].nextBtn}
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="px-6 py-2.5 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition shadow-md"
              >
                {t[language].submitBtn}
              </button>
            )}
          </div>
        </div>
      )}

      {/* POST-EXAM RESULTS, CERTIFICATE & ANALYTICS DASHBOARD */}
      {isCompleted && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-3xl text-center">
            <h2 className="text-2xl font-black text-green-800 mb-1">{t[language].congrats}</h2>
            <p className="text-xs text-green-700 font-medium">Your live scorecard, subject metrics, and verified certificate are ready below.</p>
          </div>

          {/* 1. VERIFIED CERTIFICATE SECTION */}
          <div className="bg-gradient-to-r from-blue-950 via-[#01295A] to-indigo-950 text-white p-8 md:p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden border border-[#FE7C02]/30">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <span className="text-[10px] tracking-widest uppercase font-black text-[#FE7C02] bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
              TOPIQ Talent Test (TTT) Official Credential
            </span>
            <h3 className="text-3xl md:text-4xl font-black mt-6 mb-3">{t[language].certTitle}</h3>
            <p className="text-xs md:text-sm text-slate-200 max-w-xl mx-auto mb-8 font-medium leading-relaxed">{t[language].certText}</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-xs text-slate-300 border-t border-white/15 pt-6">
              <div>Issued by: <strong className="text-white">TOPIQ Academic Board</strong></div>
              <div>Status: <strong className="text-green-400">Verified & Authenticated</strong></div>
            </div>
            <div className="mt-8">
              <button
                onClick={() => window.print()}
                className="px-8 py-3 bg-[#FE7C02] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xl hover:bg-orange-600 transition"
              >
                {t[language].printCert}
              </button>
            </div>
          </div>

          {/* 2. OVERALL SCORECARD & 3. SUBJECT-WISE ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
              <h4 className="text-sm font-black text-[#01295A] mb-6 uppercase tracking-wider">{t[language].scorecard}</h4>
              <div className="flex items-center justify-between p-5 bg-blue-900 text-white rounded-2xl mb-6 shadow-inner">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Total Score</span>
                <span className="text-3xl font-black text-[#FE7C02]">85%</span>
              </div>
              <div className="space-y-3 text-xs font-bold text-slate-700">
                <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200"><span>Correct Answers:</span> <strong className="text-green-600">2 / 2</strong></div>
                <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200"><span>Time Taken:</span> <strong className="text-slate-900">03:45 mins</strong></div>
                <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200"><span>Percentile Rank:</span> <strong className="text-blue-700">94th Percentile</strong></div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
              <h4 className="text-sm font-black text-[#01295A] mb-6 uppercase tracking-wider">{t[language].subjectAnalytics}</h4>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                    <span>Logical Reasoning</span><span>90%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#01295A] h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                    <span>Quantitative Aptitude</span><span>80%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#FE7C02] h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                    <span>Conceptual Problem Solving</span><span>85%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. OVERVIEW FOR FUTURE GROWTH */}
          <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
            <h4 className="text-sm font-black text-[#01295A] mb-3 uppercase tracking-wider">{t[language].growthOverview}</h4>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mb-6">
              Based on your sample assessment performance, your logical foundation and cognitive processing speed are strong. To maximize future growth during the 100-Day Challenge, we recommend adhering to daily 40-minute practice sessions and maintaining steady focus on multi-disciplinary analytical problem solving.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-[#01295A] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-900 transition shadow"
              >
                {t[language].retakeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE CARDS GRID */}
      <div className="grid md:grid-cols-3 gap-6 pt-4">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-200 shadow-md hover:border-[#FE7C02] hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-[#01295A] text-[#FE7C02] rounded-2xl flex items-center justify-center mb-5 shadow-xs group-hover:bg-[#FE7C02] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#01295A] mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}