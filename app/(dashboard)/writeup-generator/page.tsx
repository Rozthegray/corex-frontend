"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api-client";
import { FileText, Download } from "lucide-react";

export default function WriteupGeneratorPage() {
  const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState(
    "# Lab 1: Microprocessor Architecture\n\nExplain the ALU logic here. Use inline math $a^2 + b^2 = c^2$ or display math:\n\n$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$"
  );
  
  const [includeCover, setIncludeCover] = useState(false);
  const [meta, setMeta] = useState({ title: "", course_code: "", lecturer_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExportPDF = async () => {
    setLoading(true);
    setError("");

    try {
      // Must set responseType to blob to handle the raw binary stream
      const response = await apiClient.post(
        "/generator/render-pdf",
        {
          markdown_content: content,
          include_cover: includeCover,
          ...meta
        },
        { responseType: "blob" }
      );

      // Create browser download link for the binary blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${meta.course_code || "Document"}_Export.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      if (err.response?.data?.type === "application/json") {
        // Blob responses obfuscate JSON errors; read it manually
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        setError(json.detail || "PDF generation failed.");
      } else {
        setError("Network error occurred during PDF generation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Editor Panel */}
      <div className="flex w-1/2 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Engineering Draft</h2>
          <p className="text-xs text-slate-500">
            Write using Markdown. Use $math$ for inline and $$math$$ for block equations.
          </p>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 resize-none p-6 font-mono text-sm leading-relaxed text-slate-800 focus:outline-none"
          spellCheck={false}
        />
      </div>

      {/* PDF Settings Panel */}
      <div className="w-1/2 overflow-y-auto px-10 py-8">
        <h3 className="text-xl font-bold text-slate-900">Document Settings</h3>
        
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Official Cover Page</h4>
              <p className="text-xs text-slate-500">Injects the Yaba College crest and your student details.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input 
                type="checkbox" 
                checked={includeCover} 
                onChange={(e) => setIncludeCover(e.target.checked)} 
                className="peer sr-only" 
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
            </label>
          </div>

          {includeCover && (
            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700">Project / Report Title</label>
                <input
                  type="text"
                  value={meta.title}
                  onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                  placeholder="Design of a 4-bit ALU"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700">Course Code</label>
                  <input
                    type="text"
                    value={meta.course_code}
                    onChange={(e) => setMeta({ ...meta, course_code: e.target.value })}
                    placeholder="CTE 431"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700">Lecturer</label>
                  <input
                    type="text"
                    value={meta.lecturer_name}
                    onChange={(e) => setMeta({ ...meta, lecturer_name: e.target.value })}
                    placeholder="Engr. Olalekan Bello"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            PDF Quota Remaining: <span className="font-bold text-slate-900">{user?.pdf_quota_remaining || 0}</span>
          </p>
          
          <button
            onClick={handleExportPDF}
            disabled={loading || (user?.pdf_quota_remaining ?? 0) <= 0}
            className="flex items-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? (
              "Compiling WeasyPrint..."
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Archival PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}