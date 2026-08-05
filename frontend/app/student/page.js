'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentExamDashboard() {
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || role !== 'student') {
      router.push('/login');
      return;
    }
    setUserName(name || 'Student');
    fetchTodayExam(token);
  }, [router]);

  const fetchTodayExam = async (token) => {
    try {
      // Replace with your actual backend endpoint to fetch active daily exam
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/exams/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setExam(data.exam);
      }
    } catch (err) {
      console.error('Error fetching exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  const handleSubmitExam = async () => {
    if (!confirm('Are you sure you want to submit your test?')) return;
    setSubmitting(true);
    const token = localStorage.getItem('token');

    // Format answers array matching backend expectations: [{ questionId, selectedOption }]
    const formattedAnswers = Object.keys(selectedAnswers).map(qId => ({
      questionId: qId,
      selectedOption: selectedAnswers[qId]
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/exams/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          examId: exam._id,
          answers: formattedAnswers
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        alert(data.message || 'Submission failed.');
      }
    } catch (err) {
      console.error('Error submitting exam:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#01295A] font-semibold">Loading Daily Challenge...</div>;
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
          <h2 className="text-2xl font-bold text-[#01295A] mb-2">Exam Submitted Successfully!</h2>
          <p className="text-gray-500 mb-6">Here is your performance summary for today's challenge.</p>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg mb-6 text-left border border-gray-200">
            <div className="flex justify-between font-medium"><span>Total Score:</span> <span className="text-[#01295A] font-bold">{result.score} Marks</span></div>
            <div className="flex justify-between font-medium"><span>Correct Answers (+4):</span> <span className="text-green-600 font-bold">{result.correctCount}</span></div>
            <div className="flex justify-between font-medium"><span>Incorrect Answers (-1):</span> <span className="text-red-600 font-bold">{result.wrongCount}</span></div>
            <div className="flex justify-between font-medium"><span>Accuracy:</span> <span className="text-blue-600 font-bold">{result.accuracy}</span></div>
          </div>
          <button
            onClick={() => router.push('/student/analytics')}
            className="w-full py-3 bg-[#01295A] text-white font-medium rounded-lg hover:bg-blue-900 transition text-sm"
          >
            View Full Detailed Analytics & Leaderboard
          </button>
        </div>
      </div>
    );
  }

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold text-[#01295A] mb-2">No Active Daily Exam Found</h2>
        <p className="text-gray-500 text-sm">Please check back later when your teachers publish today's challenge.</p>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-lg font-bold text-[#01295A]">{exam.title}</h1>
            <p className="text-xs text-gray-500">Welcome, {userName} | Rule: +4 Correct, -1 Incorrect</p>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            Question {currentQuestionIndex + 1} of {exam.questions.length}
          </div>
        </div>

        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-blue-50 text-[#01295A] text-xs font-semibold rounded-full mb-3">
            Subject: {currentQ.subject}
          </span>
          <h2 className="text-base sm:text-lg font-medium text-gray-800">{currentQ.questionText}</h2>
        </div>

        <div className="space-y-3 mb-8">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(currentQ._id, idx)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                selectedAnswers[currentQ._id] === idx
                  ? 'border-[#01295A] bg-blue-50 text-[#01295A] font-semibold'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span> {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30"
          >
            Previous
          </button>

          {currentQuestionIndex < exam.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="px-6 py-2 bg-[#01295A] text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition"
            >
              Next
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={handleSubmitExam}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Final Test'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}