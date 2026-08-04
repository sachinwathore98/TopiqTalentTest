'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is the TOPIQ Talent Test (TTT) 100-Day Challenge?",
      answer: "The TTT 100-Day Challenge is a state-level competitive MCQ examination designed for students from Class 3 to Class 12 and Competitive Exam aspirants across Maharashtra. Students take a daily 40-minute test at 8:00 PM to build consistent aptitude and compete for state-level scholarships."
    },
    {
      question: "How do the daily tests work and what time do they open?",
      answer: "Every evening at exactly 8:00 PM, the daily test window opens on the student dashboard. Students have 40 minutes (until 8:40 PM) to complete 60 randomized MCQs. The session is monitored by an AI camera proctoring system to ensure absolute fairness."
    },
    {
      question: "What is the difference between Free Exploration and Paid Admission?",
      answer: "Students can sign up for free to explore the platform, view course structures, and practice sample mock tests. To participate in the official 100-Day Challenge, view live state rankings, and qualify for scholarships and certificates, students must complete their admission fee payment."
    },
    {
      question: "How does the Franchise Revenue Share and HR Sponsorship work?",
      answer: "Franchise partners in Maharashtra operate under a 40% (Franchise) / 60% (Company) revenue sharing model for registrations. Additionally, the company provides sponsored salaries for branch staff, including a Branch Manager, two Tele-Sales Executives, and a Receptionist."
    },
    {
      question: "How are student ranks and certificates generated?",
      answer: "Rankings are updated instantly after each test based on accuracy and speed. Verified participants receive official digital marksheets, official answer key solutions, and verifiable milestone certificates featuring unique branch codes."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white text-[#01295A] px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FE7C02]/10 border border-[#FE7C02]/30 px-4 py-1.5 rounded-full text-[#FE7C02] text-xs font-black uppercase tracking-wider mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#01295A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold max-w-xl mx-auto">
            Everything you need to know about the TOPIQ Talent Test platform, daily exams, and franchise opportunities in Maharashtra.
          </p>
        </div>

        {/* ACCORDION LIST */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                className={`rounded-2xl border transition duration-300 overflow-hidden ${
                  isOpen ? 'border-[#FE7C02] bg-slate-50/60 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm md:text-base font-black text-[#01295A] flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-[#FE7C02]' : 'text-slate-400'}`} />
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full transition ${isOpen ? 'bg-[#FE7C02] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}