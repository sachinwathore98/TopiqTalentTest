'use client';
import React from 'react';
import { CheckCircle, Target, Layers } from 'lucide-react';

const GROUPS = [
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
    focus: ['Scholarship Examinations', 'Olympiads', 'Foundation for Future Competitive Examinations'],
    subjects: ['Mathematics', 'Science', 'English', 'Marathi', 'Logical Reasoning', 'Mental Ability', 'General Knowledge']
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
    focus: ['Scholarship Examinations', 'Olympiads', 'Foundation for MHT-CET, JEE & NEET', 'Future Competitive Examinations'],
    subjects: ['Mathematics', 'Science', 'English', 'Marathi', 'Logical Reasoning', 'Mental Ability', 'General Knowledge', 'Basic Current Affairs']
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
    focus: ['SSC Board Examination', 'MHT-CET Foundation', 'JEE Foundation', 'NEET Foundation', 'Polytechnic Entrance', 'Olympiads'],
    subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Logical Reasoning', 'Mental Ability', 'General Knowledge', 'Current Affairs']
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
    focus: ['MHT-CET', 'JEE', 'NEET', 'CUET', 'NDA', 'Other Entrance Examinations'],
    subjects: ['Quantitative Aptitude', 'English', 'Logical Reasoning', 'Subject Aptitude', 'General Knowledge', 'Current Affairs']
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
    focus: ['MPSC', 'SSC', 'Banking', 'Railway', 'Police Recruitment', 'Defence', 'Other Competitive Examinations'],
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Knowledge', 'Current Affairs', 'Computer Awareness']
  }
];

export default function LearningGroupsSection() {
  return (
    <section id="groups" className="py-12 bg-white px-4 text-[#01295A]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto animate-fade-in-down">
          <span className="text-xs font-black text-[#FE7C02] uppercase tracking-widest block mb-2">ELIGIBILITY & CATEGORIES</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#01295A] mb-4">5 Specialized Learning Groups (Group A - E)</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            Every category features a separate question paper, question bank, evaluation, result, ranking, awards, certificates, and scholarships.
          </p>
        </div>

        {/* GROUPS LIST */}
        <div className="space-y-8">
          {GROUPS.map((group) => (
            <div 
              key={group.id} 
              className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-[#C0C0C0]/60 shadow-xl space-y-6 animate-fade-in-up hover:shadow-2xl hover:border-[#FE7C02] transition duration-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
                <div>
                  <span className="text-xs font-black text-white bg-[#01295A] px-3.5 py-1 rounded-full uppercase border border-[#01295A]">
                    {group.badge}
                  </span>
                  <h3 className="text-2xl font-black text-[#01295A] mt-2">{group.title} ({group.subtitle})</h3>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* BENEFITS */}
                <div className="bg-white p-5 rounded-2xl border border-[#C0C0C0]/40 shadow-xs">
                  <h4 className="flex items-center gap-2 text-xs font-black text-[#01295A] uppercase tracking-wider mb-3">
                    <CheckCircle className="w-4 h-4 text-[#FE7C02]" />
                    <span>Key Benefits</span>
                  </h4>
                  <ul className="space-y-2">
                    {group.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-bold">
                        <span className="w-1.5 h-1.5 bg-[#FE7C02] rounded-full mt-1.5 shrink-0"></span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PREPARATION FOCUS */}
                <div className="bg-white p-5 rounded-2xl border border-[#C0C0C0]/40 shadow-xs">
                  <h4 className="flex items-center gap-2 text-xs font-black text-[#01295A] uppercase tracking-wider mb-3">
                    <Target className="w-4 h-4 text-[#FE7C02]" />
                    <span>Preparation Focus</span>
                  </h4>
                  <div className="space-y-2">
                    {group.focus.map((f, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-[#C0C0C0]/40 rounded-xl text-xs font-extrabold text-[#01295A]">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* KEY SUBJECTS */}
                <div className="bg-white p-5 rounded-2xl border border-[#C0C0C0]/40 shadow-xs">
                  <h4 className="flex items-center gap-2 text-xs font-black text-[#01295A] uppercase tracking-wider mb-3">
                    <Layers className="w-4 h-4 text-[#FE7C02]" />
                    <span>Key Subjects</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.subjects.map((sub, i) => (
                      <span key={i} className="bg-slate-50 text-[#01295A] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#C0C0C0]/40">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}