'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Target, 
  Layers, 
  Clock, 
  Camera, 
  Shuffle, 
  FileText, 
  ShieldCheck, 
  BarChart2, 
  CheckCircle2,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const DETAILED_GROUPS = [
  {
    id: 'GROUP_A',
    badge: 'GROUP A',
    title: 'CLASSES 3 TO 5',
    subtitle: 'FOUNDATION STAGE',
    benefits: [
      'Develops regular study habits.',
      'Improves logical thinking and problem-solving skills.',
      'Builds confidence and learning discipline.',
      'Enhances accuracy and speed in solving MCQs.',
      'Creates a strong academic foundation.'
    ],
    focus: [
      'Scholarship Examinations',
      'Olympiads',
      'Foundation for Future Competitive Examinations'
    ],
    subjects: [
      'Mathematics',
      'Science',
      'English',
      'Marathi',
      'Logical Reasoning',
      'Mental Ability',
      'General Knowledge'
    ]
  },
  {
    id: 'GROUP_B',
    badge: 'GROUP B',
    title: 'CLASSES 6 TO 8',
    subtitle: 'FOUNDATION PLUS',
    benefits: [
      'Strengthens conceptual understanding.',
      'Develops analytical thinking.',
      'Improves competitive exam readiness.',
      'Builds confidence through continuous practice.',
      'Encourages self-assessment and performance improvement.'
    ],
    focus: [
      'Scholarship Examinations',
      'Olympiads',
      'Foundation for MHT-CET, JEE & NEET',
      'Future Competitive Examinations'
    ],
    subjects: [
      'Mathematics',
      'Science',
      'English',
      'Marathi',
      'Logical Reasoning',
      'Mental Ability',
      'General Knowledge',
      'Basic Current Affairs'
    ]
  },
  {
    id: 'GROUP_C',
    badge: 'GROUP C',
    title: 'CLASSES 9 & 10',
    subtitle: 'COMPETITIVE FOUNDATION',
    benefits: [
      'Improves Board Exam performance.',
      'Develops competitive aptitude.',
      'Enhances speed, accuracy and time management.',
      'Strengthens logical and analytical thinking.',
      'Builds confidence for entrance examinations.'
    ],
    focus: [
      'SSC Board Examination',
      'MHT-CET Foundation',
      'JEE Foundation',
      'NEET Foundation',
      'Polytechnic Entrance',
      'Olympiads'
    ],
    subjects: [
      'Mathematics',
      'Science',
      'Social Science',
      'English',
      'Logical Reasoning',
      'Mental Ability',
      'General Knowledge',
      'Current Affairs'
    ]
  },
  {
    id: 'GROUP_D',
    badge: 'GROUP D',
    title: 'CLASSES 11 & 12',
    subtitle: 'CAREER PREPARATION',
    benefits: [
      'Improves aptitude and analytical ability.',
      'Strengthens preparation for higher education entrance exams.',
      'Enhances decision-making and problem-solving skills.',
      'Develops confidence for career-oriented examinations.'
    ],
    focus: [
      'MHT-CET',
      'JEE',
      'NEET',
      'CUET',
      'NDA',
      'Other Entrance Examinations'
    ],
    subjects: [
      'Quantitative Aptitude',
      'English',
      'Logical Reasoning',
      'Subject Aptitude',
      'General Knowledge',
      'Current Affairs'
    ]
  },
  {
    id: 'GROUP_E',
    badge: 'GROUP E',
    title: 'COMPETITIVE (12TH & ABOVE)',
    subtitle: 'GOVT & PROFESSIONAL',
    benefits: [
      'Develops strong aptitude and reasoning skills.',
      'Improves accuracy, speed and confidence.',
      'Builds exam temperament.',
      'Helps in continuous competitive exam practice.'
    ],
    focus: [
      'MPSC',
      'SSC',
      'Banking',
      'Railway',
      'Police Recruitment',
      'Defence',
      'Other Competitive Examinations'
    ],
    subjects: [
      'Quantitative Aptitude',
      'Reasoning',
      'English',
      'General Knowledge',
      'Current Affairs',
      'Computer Awareness'
    ]
  }
];

const SMART_EXAM_FEATURES = [
  { title: '100% Online Examination', desc: 'Students can appear for the examination from anywhere using a mobile phone, tablet, laptop, or desktop with an internet connection.', icon: Clock },
  { title: 'AI Camera Monitoring System', desc: 'Every examination will be conducted under an AI-powered Camera Monitoring System to promote fair practices, minimize malpractice, and maintain examination integrity.', icon: Camera },
  { title: 'Randomized Question & Option Sequence', desc: 'Each class will have a separate question paper. The order of questions and answer options will be automatically randomized for every student.', icon: Shuffle },
  { title: 'Same-Day Instant Result', desc: 'Students will receive their examination results immediately after completing the daily test.', icon: FileText },
  { title: 'Daily Digital Marksheet', desc: 'A digital marksheet will be generated and made available on the same day after every examination.', icon: Award },
  { title: 'Daily Official Answer Key', desc: 'Published on the same day, enabling students to verify their answers and learn from their mistakes.', icon: ShieldCheck },
  { title: 'Daily Performance Analysis Report', desc: 'A detailed analysis report showing subject-wise performance, accuracy, strengths, weaknesses, rankings, and areas for improvement.', icon: BarChart2 },
  { title: '100-Day Grand Performance Memo', desc: 'After successfully completing the 100-Day Challenge, every student will receive a consolidated Grand Performance Memo.', icon: Award }
];

const DAILY_ANALYTICS = [
  'Daily Score & Daily Percentage',
  'Daily Rank, Branch Rank, District Rank, State Rank',
  'Subject-wise & Chapter/Topic-wise Performance',
  'Correct Answers, Wrong Answers, Unattempted Questions',
  'Accuracy Report & Speed / Time Management Report',
  'Performance Comparison with Previous Tests',
  'Strengths & Weaknesses Analysis & Improvement Report'
];

const GRAND_ANALYTICS = [
  'Overall Score & Overall Percentage',
  'Overall Rank, Branch Rank, District Rank, State Rank',
  'Subject-wise Overall Performance & Topic-wise Overall Performance',
  'Accuracy Analysis & Consistency Report',
  'Speed Improvement Report & Strength/Weakness Report',
  'Growth Graph & Personalized Improvement Suggestions',
  'Grand Performance Memo'
];

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState('GROUP_A');
  const selectedGroup = DETAILED_GROUPS.find((g) => g.id === activeTab);

  return (
    <div className="py-12 min-h-screen bg-slate-50/50 px-4 md:px-6 animate-fade-in space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* EXAM FORMAT & SPECIFICATIONS BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 relative overflow-hidden border border-indigo-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">📋 EXAM FORMAT</span>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">100-Day Challenge Specifications</h1>
            </div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shrink-0 self-start sm:self-auto shadow-md">
              Fixed Timings
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition">
              <div className="text-2xl md:text-3xl font-black text-amber-400">100 Days</div>
              <div className="text-[10px] md:text-[11px] text-slate-300 mt-1 uppercase font-semibold">Total Duration</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition">
              <div className="text-2xl md:text-3xl font-black text-indigo-300">60 MCQs</div>
              <div className="text-[10px] md:text-[11px] text-slate-300 mt-1 uppercase font-semibold">Daily Questions</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition">
              <div className="text-2xl md:text-3xl font-black text-emerald-400">40 Mins</div>
              <div className="text-[10px] md:text-[11px] text-slate-300 mt-1 uppercase font-semibold">Exam Duration</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition">
              <div className="text-xl md:text-2xl font-black text-sky-300">8:00–8:40 PM</div>
              <div className="text-[10px] md:text-[11px] text-slate-300 mt-1 uppercase font-semibold">Daily Schedule</div>
            </div>
          </div>
        </div>

        {/* LEARNING GROUPS TAB SELECTOR & ACTIVE CARD */}
        <div className="space-y-6">
          <div className="flex flex-nowrap md:flex-wrap overflow-x-auto pb-2 md:pb-0 justify-start md:justify-center gap-3 no-scrollbar">
            {DETAILED_GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveTab(group.id)}
                className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm transition-all duration-200 shrink-0 flex flex-col items-center justify-center min-w-[150px] border cursor-pointer ${
                  activeTab === group.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-102'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{group.title}</span>
                <span className={`text-[10px] font-semibold uppercase mt-0.5 ${activeTab === group.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {group.subtitle}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/30 space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-xl uppercase border border-indigo-100">
                  {selectedGroup.badge}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  {selectedGroup.title} <span className="text-slate-400 font-medium">({selectedGroup.subtitle})</span>
                </h2>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* BENEFITS */}
              <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
                <h3 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Key Benefits</span>
                </h3>
                <ul className="space-y-2.5">
                  {selectedGroup.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 font-semibold">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PREPARATION FOCUS */}
              <div className="space-y-4 bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100/60">
                <h3 className="flex items-center gap-2 text-xs font-black text-indigo-950 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Preparation Focus</span>
                </h3>
                <div className="space-y-2">
                  {selectedGroup.focus.map((f, i) => (
                    <div key={i} className="p-3 bg-white border border-indigo-100 rounded-xl text-xs md:text-sm font-bold text-indigo-900 shadow-2xs flex items-center justify-between">
                      <span>{f}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* KEY SUBJECTS */}
              <div className="space-y-4 bg-amber-50/30 p-5 rounded-2xl border border-amber-100/60">
                <h3 className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>Key Subjects</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGroup.subjects.map((sub, i) => (
                    <span key={i} className="bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-amber-200/60 shadow-2xs">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SMART EXAM SYSTEM DETAILS */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">🔒 SMART EXAM SYSTEM</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">Security & Evaluation Features</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {SMART_EXAM_FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-base font-black text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PERFORMANCE ANALYTICS */}
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">📈 PERFORMANCE ANALYTICS</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">Reporting & Progress Metrics</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <BarChart2 className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                <span>Daily Performance Analytics</span>
              </h3>
              <ul className="space-y-2.5">
                {DAILY_ANALYTICS.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <BarChart2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                <span>100-Day Grand Performance Analytics</span>
              </h3>
              <ul className="space-y-2.5">
                {GRAND_ANALYTICS.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-slate-700 bg-indigo-50/30 p-3 rounded-2xl border border-indigo-100/60">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}