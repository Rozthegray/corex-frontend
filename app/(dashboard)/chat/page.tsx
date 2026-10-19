"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { PlusCircle, FileText, Image as ImageIcon, Download, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string; 
  isGeneratingMedia?: boolean; 
}

const COURSE_OPTIONS = [
  { label: "All Courses", value: "" },
  { label: "CTE 411 - Microprocessor Systems", value: "CTE 411" },
  { label: "CTE 413 - Artificial Intelligence", value: "CTE 413" },
  { label: "CTE 422 - Embedded Systems", value: "CTE 422" },
  { label: "CTE 431 - Computer Architecture II", value: "CTE 431" },
];

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  
  // If the URL is /chat/123-abc, this captures the ID. If it's just /chat, it's undefined.
  const routeSessionId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;

  const [activeSessionId, setActiveSessionId] = useState<string | null>(routeSessionId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(!!routeSessionId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 1. LOAD CHAT HISTORY IF ID EXISTS IN URL ---
  useEffect(() => {
    const fetchSession = async () => {
      if (!routeSessionId) return;
      setIsLoadingHistory(true);
      try {
        const token = Cookies.get("access_token");
        const res = await fetch(`http://localhost:8001/api/v1/chat/sessions/${routeSessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Load old messages into the UI
          setMessages(data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            // If the old message contained an image URL in the DB, we could load it here (requires backend support)
          })));
          if (data.session.course_code) setSelectedCourse(data.session.course_code);
        }
      } catch (error) {
        console.error("Failed to load chat history", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchSession();
  }, [routeSessionId]);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setActiveSessionId(null);
    router.push("/chat");
  };

  // --- 2. THE IMAGE GENERATOR API CALL ---
  const generateImageFromPrompt = async (messageId: string, imagePrompt: string) => {
    try {
      const token = Cookies.get("access_token");
      const res = await fetch("http://localhost:8001/api/v1/chat/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      
      if (!res.ok) throw new Error("Image generation failed");
      const data = await res.json();
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, imageUrl: data.image_url, isGeneratingMedia: false } : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId 
            ? { ...msg, isGeneratingMedia: false, content: msg.content + "\n\n*[Error: Could not generate image from DALL-E server]*" } 
            : msg
        )
      );
    }
  };

  // --- 3. THE PDF DOWNLOADER API CALL ---
  const handleDownloadPdf = async (messageContent: string) => {
    try {
      const token = Cookies.get("access_token");
      
      // Clean triggers out of the markdown before converting to PDF
      const cleanText = messageContent
        .replace(/\[TRIGGER_IMAGE_GENERATION:.*?\]/g, "")
        .replace(/\[TRIGGER_PDF_GENERATION\]/g, "")
        .trim();

      const res = await fetch("http://localhost:8001/api/v1/chat/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: "Corex_AI_Research_Report", 
          content: cleanText 
        }),
      });
      
      if (!res.ok) throw new Error("PDF generation failed");
      
      // Convert the binary response into a downloadable file
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "Corex_AI_Research_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert("Failed to generate and download PDF.");
    }
  };

  // --- 4. MAIN CHAT SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input };
    const assistantMessageId = crypto.randomUUID();

    setMessages((prev) => [...prev, userMessage, { id: assistantMessageId, role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const token = Cookies.get("access_token");
      const res = await fetch("http://localhost:8001/api/v1/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          course_code: selectedCourse || null,
          session_id: activeSessionId // Pass active session ID so backend continues the thread
        }),
      });

      if (!res.ok) throw new Error("Could not retrieve RAG context");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let streamedResponse = "";
      let newlyCreatedSessionId = activeSessionId;

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
                
                // If the backend generated a new session ID for a fresh chat, capture it
                if (parsed.session_id && !newlyCreatedSessionId) {
                  newlyCreatedSessionId = parsed.session_id;
                  setActiveSessionId(newlyCreatedSessionId);
                  // Silently update the URL so the sidebar knows we are in a saved chat
                  window.history.replaceState(null, "", `/chat/${newlyCreatedSessionId}`);
                }

                if (parsed.text) {
                  streamedResponse += parsed.text;
                  const isImageTriggered = streamedResponse.includes("[TRIGGER_IMAGE_GENERATION:");
                  
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId 
                        ? { 
                            ...msg, 
                            content: streamedResponse,
                            isGeneratingMedia: isImageTriggered && !msg.imageUrl 
                          } 
                        : msg
                    )
                  );
                }
              } catch {
                // Ignore incomplete JSON chunks during fast streaming
              }
            }
          }
        }
      }

      // POST-STREAM PROCESSING FOR IMAGES
      if (streamedResponse.includes("[TRIGGER_IMAGE_GENERATION:")) {
        const match = streamedResponse.match(/\[TRIGGER_IMAGE_GENERATION:\s*(.*?)\]/);
        if (match && match[1]) {
           generateImageFromPrompt(assistantMessageId, match[1]);
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

  // --- THE UI PARSER ---
  const renderMessageContent = (msg: Message) => {
    let text = msg.content;
    const hasImageTrigger = text.includes("[TRIGGER_IMAGE_GENERATION:");
    const hasPdfTrigger = text.includes("[TRIGGER_PDF_GENERATION]");

    if (hasImageTrigger) text = text.replace(/\[TRIGGER_IMAGE_GENERATION:.*?\]/g, "");
    if (hasPdfTrigger) text = text.replace(/\[TRIGGER_PDF_GENERATION\]/g, "");

    return (
      <div className="space-y-4">
        {text.trim() && <p className="whitespace-pre-wrap leading-relaxed">{text}</p>}
        
        {/* DALL-E IMAGE LOADER / VIEWER */}
        {msg.role === "assistant" && hasImageTrigger && (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {msg.isGeneratingMedia ? (
               <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-sm font-medium">Corex.AI is generating your illustration...</p>
               </div>
            ) : msg.imageUrl ? (
               <div className="relative group">
                 <img src={msg.imageUrl} alt="Generated illustration" className="w-full h-auto object-cover" />
                 <a 
                   href={msg.imageUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="absolute bottom-4 right-4 bg-slate-900/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
                 >
                   <Download size={18} />
                 </a>
               </div>
            ) : null}
          </div>
        )}

        {/* PDF DOWNLOAD COMPONENT */}
        {msg.role === "assistant" && hasPdfTrigger && (
           <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                   <FileText size={20} />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-900">Research_Report_Draft.pdf</p>
                   <p className="text-xs text-slate-500">Document generated successfully</p>
                </div>
             </div>
             <button 
                onClick={() => handleDownloadPdf(msg.content)}
                className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
             >
                <Download size={16} /> Download
             </button>
           </div>
        )}
      </div>
    );
  };

  if (isLoadingHistory) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50">
      {/* Top Header / Scope Filter */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Academic Archive RAG Assistant</h1>
            <p className="text-xs text-slate-500">Context-grounded retrieval from departmental packs & guides</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Course Scope:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-slate-900 focus:outline-none"
            >
              {COURSE_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <PlusCircle size={16} /> New Chat
          </button>
        </div>
      </header>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <div className="mt-20 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                 <ImageIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Corex AI Multimodal Engine</h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                Ask questions, generate research reports, or request detailed engineering diagrams. I will generate exactly what you need.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-sm"
                      : "border border-slate-200 bg-white text-slate-800 rounded-tl-sm"
                  }`}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <div className="border-t border-slate-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-3">
          <input
            type="text"
            value={input}
            disabled={isStreaming}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question, generate an image, or draft a PDF report..."
            className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-6 py-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {isStreaming ? "Retrieving..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}