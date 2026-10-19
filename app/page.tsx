"use client";

import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string; // Added to support displaying images in the chat feed
}

const COURSE_OPTIONS = [
  { label: "All Courses", value: "" },
  { label: "CTE 411 - Microprocessor Systems", value: "CTE 411" },
  { label: "CTE 413 - Artificial Intelligence", value: "CTE 413" },
  { label: "CTE 422 - Embedded Systems", value: "CTE 422" },
  { label: "CTE 431 - Computer Architecture II", value: "CTE 431" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  // New States for Image Upload
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- NEW: Image Upload Handler ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8001/api/v1/questions/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      setAttachedImage(`http://localhost:8001${data.image_url}`);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image. Is the backend running?");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachedImage) || isStreaming) return;

    const userMessage: Message = { 
      id: crypto.randomUUID(), 
      role: "user", 
      content: input,
      imageUrl: attachedImage || undefined 
    };
    const assistantMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);
    
    setInput("");
    setAttachedImage(null); // Clear attachment after sending
    setIsStreaming(true);

    try {
      const token = Cookies.get("access_token");
      
      // We append a note to the backend if an image was sent, so the AI knows about it
      const payloadMessage = attachedImage 
        ? `${userMessage.content}\n[User attached an image: ${attachedImage}]` 
        : userMessage.content;

      const res = await fetch("http://localhost:8001/api/v1/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: payloadMessage,
          course_code: selectedCourse || null,
        }),
      });

      if (!res.ok) throw new Error("Could not retrieve RAG context");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let streamedResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const rawChunk = decoder.decode(value);
          const lines = rawChunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataPayload = line.replace("data: ", "").trim();
              if (dataPayload === "[DONE]") break;

              try {
                const parsed = JSON.parse(dataPayload);
                if (parsed.text) {
                  streamedResponse += parsed.text;
                  
                  // In a full app, you would parse [TRIGGER_IMAGE_GENERATION] here
                  
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId ? { ...msg, content: streamedResponse } : msg
                    )
                  );
                }
              } catch {
                // Ignore chunk parse edges
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Error communicating with the academic archive engine." }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Top Header / Scope Filter */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Academic Archive RAG Assistant</h1>
          <p className="text-xs text-slate-500">Context-grounded retrieval from departmental packs & guides</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-600">Course Scope:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-slate-900 focus:outline-none"
          >
            {COURSE_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <div className="mt-20 text-center">
              <h3 className="text-base font-semibold text-slate-800">Knowledge Base Ready</h3>
              <p className="mt-1 text-sm text-slate-500">
                Ask questions, generate diagrams, or upload circuit images for analysis.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-800 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Render uploaded image in the chat bubble if it exists */}
                  {msg.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={msg.imageUrl} 
                      alt="Attached" 
                      className="mt-3 max-w-sm rounded-md border border-slate-700 object-contain"
                    />
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box Area */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="mx-auto max-w-3xl">
          
          {/* Image Attachment Preview Thumbnail */}
          {attachedImage && (
            <div className="mb-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={attachedImage} alt="Preview" className="h-16 w-16 rounded object-cover border border-slate-300" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-700">Image attached</p>
              </div>
              <button
                onClick={() => setAttachedImage(null)}
                className="text-xs font-medium text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-3">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isStreaming || isUploading}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              title="Attach Image"
            >
              {isUploading ? (
                <span className="text-[10px] font-bold">...</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              )}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              disabled={isStreaming}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or upload a diagram..."
              className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-slate-900 focus:outline-none disabled:bg-slate-50"
            />
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isStreaming || (!input.trim() && !attachedImage)}
              className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isStreaming ? "Retrieving..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}