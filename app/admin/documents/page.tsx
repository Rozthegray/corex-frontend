"use client";

import { useState } from "react";
import { Api } from "@/lib/api-client";

export default function AdminDocumentsPage() {
  const [formData, setFormData] = useState({
    title: "",
    course_code: "",
    lecturer_name: "",
    category: "syllabus",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("course_code", formData.course_code);
    payload.append("lecturer_name", formData.lecturer_name);
    payload.append("category", formData.category);
    payload.append("file", file);

    try {
      const res = await Api.Documents.upload(payload);
      setStatus({
        type: "success",
        message: `Successfully ingested document. Generated ${res.data.pinecone_vectors_created} Pinecone vectors.`,
      });
      setFormData({ title: "", course_code: "", lecturer_name: "", category: "syllabus" });
      setFile(null);
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.response?.data?.detail || "Failed to process PDF into vector store.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Ingest Academic Material</h1>
      <p className="mt-1 text-sm text-slate-600">
        Upload course PDFs to automatically chunk and embed them into the Pinecone database.
      </p>

      {status && (
        <div
          className={`mt-4 rounded-md p-3 text-sm ${
            status.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700">Document Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Laboratory Manual for CTE 411"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700">Course Code</label>
            <input
              type="text"
              required
              value={formData.course_code}
              onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
              placeholder="e.g. CTE 411"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700">Lecturer / Supervisor</label>
            <input
              type="text"
              value={formData.lecturer_name}
              onChange={(e) => setFormData({ ...formData, lecturer_name: e.target.value })}
              placeholder="e.g. Engr. Bello"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700">Document Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          >
            <option value="syllabus">Syllabus</option>
            <option value="project_manual">Project Manual</option>
            <option value="lecturer_guide">Lecturer Guide</option>
            <option value="past_question">Past Question</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700">Source PDF File</label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="mt-2 w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {uploading ? "Parsing & Generating Vector Embeddings..." : "Upload & Vectorize"}
        </button>
      </form>
    </div>
  );
}