"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

export default function MockExamsPage() {
  const [courseCode, setCourseCode] = useState("CTE 411");
  const [examType, setExamType] = useState<"test" | "exam">("test");
  const [loading, setLoading] = useState(false);
  const [examSession, setExamSession] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleGenerateExam = async () => {
    setLoading(true);
    setEvaluation(null);
    try {
      const res = await apiClient.post("/mock-exams/generate", {
        course_code: courseCode,
        exam_type: examType,
      });
      setExamSession(res.data);
      setAnswers({});
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to generate mock examination.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswers = async () => {
    if (!examSession) return;
    setLoading(true);
    try {
      const res = await apiClient.post(`/mock-exams/${examSession.exam_id}/submit`, {
        student_submissions: answers,
        time_spent_seconds: 1200,
      });
      setEvaluation(res.data.evaluation);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Grading submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Polytechnic Examination Simulator</h1>
          <p className="text-xs text-slate-500">
            Formulated from official past exam papers, practical tests, and marking rubrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
            placeholder="Course (e.g. CTE 411)"
            className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase"
          />
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value as any)}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs"
          >
            <option value="test">Continuous Assessment (Test)</option>
            <option value="exam">Final Semester Examination</option>
          </select>
          <button
            onClick={handleGenerateExam}
            disabled={loading}
            className="rounded bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Synthesizing Paper..." : "Generate Paper"}
          </button>
        </div>
      </div>

      {/* Exam Paper View */}
      {examSession && !evaluation && (
        <div className="mt-6 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">{examSession.exam.title}</h2>
            <div className="mt-2 flex gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Duration: {examSession.exam.duration_minutes} Mins</span>
              <span>Total Marks: {examSession.exam.total_marks}</span>
            </div>
            <p className="mt-2 text-xs italic text-slate-500">{examSession.exam.instructions}</p>
          </div>

          {examSession.exam.questions.map((q: any) => (
            <div key={q.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>QUESTION {q.id} [Section {q.section}]</span>
                <span>({q.marks} Marks)</span>
              </div>
              <p className="mt-2 text-sm text-slate-900">{q.question}</p>

              {q.type === "mcq" && q.options && (
                <div className="mt-3 space-y-2">
                  {q.options.map((opt: string, idx: number) => (
                    <label key={idx} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type !== "mcq" && (
                <textarea
                  rows={4}
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  placeholder="Type your derivation, formula steps, or answer..."
                  className="mt-3 w-full rounded border border-slate-300 p-2 text-xs font-mono"
                />
              )}
            </div>
          ))}

          <button
            onClick={handleSubmitAnswers}
            disabled={loading}
            className="w-full rounded bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Submit for Automated Grading
          </button>
        </div>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs uppercase text-slate-400 font-semibold">Evaluation Complete</span>
              <h3 className="text-xl font-bold text-slate-900">
                Score: {evaluation.total_score} / {evaluation.max_score} ({evaluation.percentage}%)
              </h3>
            </div>
            <div className="text-2xl font-black text-slate-900 bg-slate-100 px-4 py-2 rounded">
              Grade: {evaluation.grade}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-600 leading-relaxed">{evaluation.general_critique}</p>

          <div className="mt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-700">Question Itemization</h4>
            {evaluation.breakdown.map((item: any, idx: number) => (
              <div key={idx} className="rounded border border-slate-100 bg-slate-50 p-3 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Question {item.question_id}</span>
                  <span>{item.score_awarded} / {item.max_marks} Marks</span>
                </div>
                <p className="mt-1 text-slate-600">{item.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}