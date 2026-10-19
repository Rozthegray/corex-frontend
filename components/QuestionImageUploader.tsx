"use client";

import { useState, useRef } from "react";

export default function QuestionImageUploader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Point this to your active backend port (8001)
      const res = await fetch("http://localhost:8001/api/v1/questions/upload-image", {
        method: "POST",
        body: formData,
        // Note: Do NOT set "Content-Type" headers when sending FormData.
        // The browser automatically sets the multipart boundary.
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      
      // Combine the backend domain with the returned static path
      setImageUrl(`http://localhost:8001${data.image_url}`);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image. Is the backend running?");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Attach Circuit Diagram / Equation Image
      </label>
      
      {imageUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Uploaded diagram" className="w-full object-cover" />
          <button
            onClick={() => setImageUrl(null)}
            className="absolute right-2 top-2 rounded bg-red-500 px-3 py-1 text-xs font-bold text-white hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400 hover:bg-slate-100"
        >
          <div className="text-center">
            <p className="text-sm text-slate-500">
              {isUploading ? "Uploading..." : "Drag and drop an image here, or click to browse"}
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}