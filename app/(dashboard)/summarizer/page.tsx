"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { BookOpen, Sparkles } from "lucide-react";

export default function TopicSummarizerPage() {
  const [courseCode, setCourseCode] = useState("CTE 411");
  const [topicTitle, setTopicTitle] = useState("8086 Interrupt Vector Table & Service Routines");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    setLoading(true);
    setSummary("");
    try {
      const res = await apiClient.post("/summarizer/generate", {
        course_code: courseCode,
        topic_title: topicTitle,
      });
      setSummary(res.data.content);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to generate topic breakdown.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-slate-900">Topic-by-Topic Lecture Summarizer</h1>
        <p className="text-xs text-slate-500">
          Synthesizes syllabus topics strictly following the lecturer's methodology and generates original practice examples.
        </p>
      </div>

      <form onSubmit={handleGenerateSummary} className="mt-6 flex gap-3">
        <input
          type="text"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
          placeholder="Course (e.g. CTE 411)"
          className="w-32 rounded border border-slate-300 px-3 py-2 text-xs font-semibold uppercase focus:border-slate-900 focus:outline-none"
        />
        <input
          type="text"
          value={topicTitle}
          onChange={(e) => setTopicTitle(e.target.value)}
          placeholder="Topic (e.g. 8086 Interrupt Vector Table)"
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 rounded bg-slate-900 px-5 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {loading ? "Synthesizing..." : "Generate Breakdown"}
        </button>
      </form>

      {summary && (
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="prose max-w-none text-xs leading-relaxed text-slate-800">
            <pre className="whitespace-pre-wrap font-sans">{summary}</pre>
          </div>
        </div>
      )}
    </div>
  );
}