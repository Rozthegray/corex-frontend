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

  // --- 1. LOAD CHAT HISTORY ---
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
          setMessages(data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
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

  // --- 2. IMAGE GENERATOR API CALL ---
  const generateImageFromPrompt = async (messageId: string, imagePrompt: string) => {
    try {
      const token = Cookies.get("access_token");
      const res = await fetch("https://corex-backend-1.onrender.com/api/v1/chat/image", {
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

  // --- 3. PDF DOWNLOADER API CALL ---
  const handleDownloadPdf = async (messageContent: string) => {
    try {
      const token = Cookies.get("access_token");
      const cleanText = messageContent
        .replace(/\[TRIGGER_IMAGE_GENERATION:.*?\]/g, "")
        .replace(/\[TRIGGER_PDF_GENERATION\]/g, "")
        .trim();

      const res = await fetch("https://corex-backend-1.onrender.com/api/v1/chat/pdf", {
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
      const res = await fetch("https://corex-backend-1.onrender.com/api/v1/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          course_code: selectedCourse || null,
          session_id: activeSessionId 
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
                
                if (parsed.session_id && !newlyCreatedSessionId) {
                  newlyCreatedSessionId = parsed.session_id;
                  setActiveSessionId(newlyCreatedSessionId);
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
          <div className="mt-4 overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm">
            {msg.isGeneratingMedia ? (
               <div className="flex flex-col items-center justify-center p-12 text-green-700">
                  <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                  <p className="text-sm font-medium">Corex AI is generating your illustration...</p>
               </div>
            ) : msg.imageUrl ? (
               <div className="relative group">
                 <img src={msg.imageUrl} alt="Generated illustration" className="w-full h-auto object-cover" />
                 <a 
                   href={msg.imageUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="absolute bottom-4 right-4 bg-green-900/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-900"
                 >
                   <Download size={18} />
                 </a>
               </div>
            ) : null}
          </div>
        )}

        {/* PDF DOWNLOAD COMPONENT */}
        {msg.role === "assistant" && hasPdfTrigger && (
           <div className="mt-4 flex items-center justify-between rounded-lg border border-green-100 bg-white p-4 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                   <FileText size={20} />
                </div>
                <div>
                   <p className="text-sm font-bold text-green-900">Research_Report.pdf</p>
                   <p className="text-xs text-green-600/80">Document generated successfully</p>
                </div>
             </div>
             <button 
                onClick={() => handleDownloadPdf(msg.content)}
                className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors"
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
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-white overflow-hidden">
      {/* Background Yabatech Splash Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-100/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-yellow-100/30 blur-[100px]" />
      </div>

      {/* Top Header / Scope Filter */}
      <header className="relative z-10 flex items-center justify-between border-b border-green-100 bg-white/80 backdrop-blur-md px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-green-900">Academic Archive RAG Assistant</h1>
            <p className="text-xs text-green-700/80">Context-grounded retrieval from departmental packs & guides</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-green-800">Course Scope:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
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
            className="flex items-center gap-2 rounded-md bg-white border border-green-200 px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-50 transition-colors shadow-sm"
          >
            <PlusCircle size={16} /> New Chat
          </button>
        </div>
      </header>

      {/* Message Feed */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {messages.length === 0 ? (
            <div className="mt-20 flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-100 to-yellow-100 text-green-700 shadow-sm border border-green-50">
                 <ImageIcon size={36} />
              </div>
              <h3 className="text-xl font-extrabold text-green-900">Corex AI Multimodal Engine</h3>
              <p className="mt-3 max-w-lg text-sm text-green-700/80 leading-relaxed">
                Ask questions, generate research reports, or request detailed engineering diagrams. I will generate exactly what you need based on the Yabatech archives.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-6 py-5 shadow-sm ${
                    msg.role === "user"
                      ? "bg-green-700 text-white rounded-tr-sm"
                      : "border border-green-100 bg-white/90 backdrop-blur-sm text-slate-800 rounded-tl-sm shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
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
      <div className="relative z-10 border-t border-green-100 bg-white/90 backdrop-blur-md p-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-5xl gap-3">
          <input
            type="text"
            value={input}
            disabled={isStreaming}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question, generate an illustration, or draft a PDF report..."
            className="flex-1 rounded-full border border-green-200 bg-white px-6 py-3.5 text-sm text-slate-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 disabled:opacity-60 shadow-inner"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="flex items-center justify-center rounded-full bg-green-700 px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-md hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {isStreaming ? "Retrieving..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}