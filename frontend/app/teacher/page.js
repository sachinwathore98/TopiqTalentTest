'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState('JEE'); // e.g. JEE, NEET, CBSE
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOption: 0, subject: 'Physics' }
  ]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || (role !== 'teacher' && role !== 'super_admin' && role !== 'admin')) {
      router.push('/login');
    }
  }, [router]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestionField = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOption: 0, subject: 'Physics' }]);
  };

  const removeQuestionField = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handlePublishExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/exams/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, examType, questions })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create exam.');
      }

      setSuccessMsg('Exam published successfully!');
      setTitle('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctOption: 0, subject: 'Physics' }]);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#01295A]">Teacher Panel — Create Daily Exam</h1>
            <p className="text-xs text-gray-500">Upload exam sets, define options, and assign correct answers (+4 / -1 rules apply)</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-xs px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>

        {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{successMsg}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{errorMsg}</div>}

        <form onSubmit={handlePublishExam} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Exam Title / Day Identifier</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Daily Challenge #12 - Comprehensive Test"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#01295A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Exam Category / Board</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#01295A] focus:outline-none bg-white"
              >
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="CBSE">CBSE Board</option>
                <option value="Maharashtra State Board">Maharashtra State Board</option>
                <option value="UPSC">UPSC / MPSC</option>
              </select>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase text-[#01295A]">Question #{qIndex + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestionField(qIndex)}
                      className="text-xs text-red-600 hover:underline font-medium"
                    >
                      Remove Question
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                      placeholder="Enter question statement..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#01295A]"
                    />
                  </div>
                  <div>
                    <select
                      value={q.subject}
                      onChange={(e) => handleQuestionChange(qIndex, 'subject', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#01295A]"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Maths">Maths / Biology</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-500">{String.fromCharCode(65 + oIndex)}.</span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#01295A]"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Correct Answer Option</label>
                  <select
                    value={q.correctOption}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctOption', parseInt(e.target.value))}
                    className="w-full sm:w-1/3 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#01295A]"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={addQuestionField}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
            >
              + Add Another Question
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#01295A] text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition disabled:opacity-50 shadow-md"
            >
              {loading ? 'Publishing Exam...' : 'Publish Exam Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}