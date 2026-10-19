"use client";

import { useEffect, useState } from "react";
import { Api } from "@/lib/api-client";
import { FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = () => {
    setLoading(true);
    Api.Admin.getDocuments("past_question")
      .then(setQuestions)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this past question? This removes its vectors from the AI Mock Engine.")) return;
    try {
      await Api.Admin.deleteDocument(id);
      fetchQuestions(); // Refresh list
    } catch (err) {
      alert("Failed to delete document.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exam Archive Manager</h1>
          <p className="mt-1 text-sm text-slate-600">Past questions currently feeding the AI Assessment Simulator.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="text-sm text-slate-500">Loading archive...</div>
        ) : questions.length === 0 ? (
          <div className="col-span-3 rounded-lg border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500">
            No past questions ingested yet. Use the Knowledge Ingestion tab.
          </div>
        ) : (
          questions.map((doc) => (
            <div key={doc.id} className="relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase text-slate-600">
                    {doc.course_code}
                  </span>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="text-slate-400 hover:text-red-600"
                    title="Remove from Vector DB"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{doc.title}</h3>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                Indexed {format(new Date(doc.date), "MMM d, yyyy")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}