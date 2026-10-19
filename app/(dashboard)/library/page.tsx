"use client";

import { useEffect, useState } from "react";
import { Api } from "@/lib/api-client";
import { FileText, Download, Book, FileQuestion, GraduationCap } from "lucide-react";
import { format } from "date-fns";

export default function StudentLibraryPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    Api.Documents.getLibrary(filter || undefined)
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, [filter]);

  const handleDownload = (doc: any) => {
    Api.Documents.download(doc.id, `${doc.course_code}_${doc.title}.pdf`).catch(() => {
      alert("Failed to download document.");
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "past_question": return <FileQuestion className="h-5 w-5 text-purple-500" />;
      case "syllabus": return <Book className="h-5 w-5 text-blue-500" />;
      case "project_manual": return <GraduationCap className="h-5 w-5 text-emerald-500" />;
      default: return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Archive Library</h1>
          <p className="mt-1 text-sm text-slate-600">
            Download raw past questions, syllabi, and lab manuals directly to your device.
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="past_question">Past Questions</option>
          <option value="syllabus">Syllabi</option>
          <option value="project_manual">Project Manuals</option>
          <option value="lecturer_guide">Lecturer Guides</option>
        </select>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-10 text-center text-sm text-slate-500">Loading archives...</div>
        ) : documents.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500">
            No documents found for this category.
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase text-slate-700">
                    {doc.course_code}
                  </span>
                  {getCategoryIcon(doc.category)}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">{doc.title}</h3>
                <p className="mt-1 text-xs font-medium text-slate-500">{doc.lecturer_name || "Departmental Archive"}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">
                  {format(new Date(doc.date), "MMM d, yyyy")}
                </span>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-600 transition"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}