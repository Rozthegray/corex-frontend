"use client";

import { useState } from "react";

interface AIDiagramGeneratorProps {
  onImageGenerated: (url: string) => void;
}

export default function AIDiagramGenerator({ onImageGenerated }: AIDiagramGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("http://localhost:8001/api/v1/questions/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Image generation failed");

      const data = await res.json();
      
      // Hand the final static URL back to the Chat or Form
      onImageGenerated(`http://localhost:8001${data.image_url}`);
      setPrompt("");
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI diagram. Check the FastAPI terminal.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
        AI Diagram Generator
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A clean schematic of a second-order RLC circuit..."
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none disabled:opacity-50"
          disabled={isGenerating}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isGenerating ? "Drawing..." : "Generate"}
        </button>
      </div>
    </div>
  );
}