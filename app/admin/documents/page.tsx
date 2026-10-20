"use client";

import { useState, useRef } from "react";
import { Api } from "@/lib/api-client";
import { 
  UploadCloud, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  FileQuestion, 
  Book, 
  GraduationCap, 
  FileText 
} from "lucide-react";

const CATEGORIES = [
  { id: "syllabus", label: "Syllabus", icon: Book, color: "text-blue-500", bg: "bg-blue-50 border-blue-200" },
  { id: "past_question", label: "Past Question", icon: FileQuestion, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
  { id: "project_manual", label: "Project Manual", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
  { id: "lecturer_guide", label: "Lecturer Guide", icon: FileText, color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
];

export default function AdminDocumentsPage() {
  const [formData, setFormData] = useState({
    title: "",
    course_code: "",
    lecturer_name: "",
    category: "syllabus",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadState("error");
      setStatusMsg("Please select a document to upload.");
      return;
    }

    setUploadState("uploading");
    setStatusMsg("Extracting text and generating Pinecone embeddings...");

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("course_code", formData.course_code);
    payload.append("lecturer_name", formData.lecturer_name);
    payload.append("category", formData.category);
    payload.append("file", file);

    try {
      const res = await Api.Documents.upload(payload);
      setUploadState("success");
      setStatusMsg(`Success! Generated ${res.data.pinecone_vectors_created} vectors. Available in library.`);
      setFormData({ title: "", course_code: "", lecturer_name: "", category: "syllabus" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setUploadState("error");
      setStatusMsg(err.response?.data?.detail || "Failed to process PDF into vector store.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Ingest Knowledge</h1>
        <p className="mt-2 text-slate-600">
          Upload course materials. Corex will automatically chunk, embed, and categorize them for the student library and RAG agent.
        </p>
      </div>

      {uploadState === "success" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          <p className="text-sm font-medium">{statusMsg}</p>
        </div>
      )}

      {uploadState === "error" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 shadow-sm">
          <AlertTriangle className="h-6 w-6 text-rose-500" />
          <p className="text-sm font-medium">{statusMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        
        {/* Visual Category Selector */}
        <div>
          <label className="mb-3 block text-sm font-bold text-slate-900">1. Document Evaluation Type</label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    isSelected 
                      ? `${cat.bg} ring-2 ring-emerald-500 ring-offset-2` 
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 text-slate-500"
                  }`}
                >
                  <Icon className={`h-8 w-8 ${isSelected ? cat.color : "text-slate-400"}`} />
                  <span className={`text-xs font-semibold ${isSelected ? "text-slate-900" : "text-slate-500"}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-900">2. Document Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 2023 Hardware Architecture Final"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900">Course Code</label>
            <input
              type="text"
              required
              value={formData.course_code}
              onChange={(e) => setFormData({ ...formData, course_code: e.target.value.toUpperCase() })}
              placeholder="e.g. CTE 411"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium uppercase focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900">Lecturer Name <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input
              type="text"
              value={formData.lecturer_name}
              onChange={(e) => setFormData({ ...formData, lecturer_name: e.target.value })}
              placeholder="e.g. Dr. Osemene"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-bold text-slate-900">3. Source File</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
              file ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-slate-50 hover:border-amber-400 hover:bg-amber-50"
            }`}
          >
            <UploadCloud className={`h-10 w-10 ${file ? "text-emerald-500" : "text-slate-400"}`} />
            <p className="mt-4 text-sm font-medium text-slate-900">
              {file ? file.name : "Click to browse PDF or Image files"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports .pdf, .png, .jpg up to 50MB"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploadState === "uploading"}
          className={`relative flex w-full items-center justify-center rounded-xl py-4 text-base font-bold text-white transition-all ${
            uploadState === "uploading" 
              ? "bg-amber-500 cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200"
          }`}
        >
          {uploadState === "uploading" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {statusMsg}
            </>
          ) : (
            "Vectorize & Archive Document"
          )}
        </button>
      </form>
    </div>
  );
}