"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { PlusCircle, FileText, Image as ImageIcon, Download, Loader2, Menu, X, Share2 } from "lucide-react";
import Sidebar from "@/components/SideBar"; // Ensure this import path is correct

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
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Sharing State
  const [isSharing, setIsSharing] = useState(false);

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
        const res = await fetch(`https://corex-backend-1.onrender.com/api/v1/chat/sessions/${routeSessionId}`, {
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
    setIsMobileSidebarOpen(false); // Close sidebar on mobile
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
            ? { ...msg, isGeneratingMedia: false, content: msg.content + "\n\n*[Error: Could not generate image from server]*" } 
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

  // --- 4. SHARE CHAT API CALL ---
  const handleShare = async () => {
    if (!activeSessionId) return;
    setIsSharing(true);
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`https://corex-backend-1.onrender.com/api/v1/chat/sessions/${activeSessionId}/share`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const shareUrl = `https://corex-frontend-rose.vercel.app/share/${activeSessionId}`;
        await navigator.clipboard.writeText(shareUrl);
        alert("Chat link copied to clipboard!");
      } else {
         alert("Failed to share chat.");
      }
    } catch (error) {
      alert("Failed to share chat.");
    } finally {
      setIsSharing(false);
    }
  };

  // --- 5. MAIN CHAT SUBMIT ---
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
      <div className="space-y-4 text-[16px]">
        {text.trim() && <p className="whitespace-pre-wrap leading-relaxed">{text}</p>}
        
        {/* IMAGE VIEWER */}
        {msg.role === "assistant" && hasImageTrigger && (
          <div className="mt-4 overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm">
            {msg.isGeneratingMedia ? (
               <div className="flex flex-col items-center justify-center p-12 text-green-700">
                  <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                  <p className="text-[12px] font-medium uppercase tracking-widest">Corex AI is generating your illustration...</p>
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
           <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-green-100 bg-white p-4 shadow-sm gap-4">
             <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                   <FileText size={24} />
                </div>
                <div>
                   <p className="text-[14px] font-bold text-green-900">Research_Report.pdf</p>
                   <p className="text-[10px] text-green-600/80 uppercase tracking-widest">Document generated successfully</p>
                </div>
             </div>
             <button 
                onClick={() => handleDownloadPdf(msg.content)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-md"
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
      <div className="flex h-screen items-center justify-center bg-white" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-white selection:bg-green-200 selection:text-green-900" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      
      {/* Background Splashes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-100/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-yellow-100/20 blur-[100px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Collapsible on Mobile */}
      <div className={`fixed md:relative inset-y-0 left-0 z-50 transform ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
         <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col w-full min-w-0 bg-white/40 backdrop-blur-3xl">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-green-100 bg-white/80 backdrop-blur-md px-4 md:px-6 py-3.5 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-[16px] md:text-[20px] font-bold text-green-900 leading-tight">Academic RAG Assistant</h1>
              <p className="text-[10px] text-green-700/80 uppercase tracking-widest hidden sm:block">Context-grounded retrieval</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-green-800">Scope:</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="rounded-lg border border-green-200 bg-white px-2 md:px-3 py-1.5 text-[12px] font-medium text-green-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 max-w-[120px] md:max-w-[200px] truncate cursor-pointer"
              >
                {COURSE_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {activeSessionId && (
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center justify-center p-2 md:px-4 md:py-2 rounded-full bg-green-50 border border-green-100 text-[10px] font-bold uppercase tracking-wider text-green-800 hover:bg-green-100 transition-colors shadow-sm"
                title="Share Chat"
              >
                <Share2 size={16} className="md:mr-2" />
                <span className="hidden md:inline">{isSharing ? "Sharing..." : "Share"}</span>
              </button>
            )}
            
            <button 
              onClick={handleNewChat}
              className="md:hidden flex items-center justify-center p-2 rounded-full bg-gray-900 text-white shadow-sm"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {messages.length === 0 ? (
              <div className="mt-10 md:mt-20 flex flex-col items-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-green-50 to-yellow-50 text-green-700 shadow-sm border border-green-100">
                   <ImageIcon size={40} className="opacity-80" />
                </div>
                <h3 className="text-[24px] md:text-[30px] font-extrabold text-green-900 tracking-tight">Corex AI Tutor</h3>
                <p className="mt-4 max-w-md text-[14px] text-green-800/70 leading-relaxed font-medium px-4">
                  Generate tricky mock questions based on past exams, request detailed research reports, or ask for explanations grounded in Yabatech archives.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[85%] rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 shadow-sm ${
                      msg.role === "user"
                        ? "bg-gray-900 text-white rounded-tr-sm"
                        : "border border-green-100 bg-white/95 backdrop-blur-sm text-gray-900 rounded-tl-sm shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]"
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

        {/* Input Box - Sticky at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-green-100 bg-white/95 backdrop-blur-md p-3 md:p-4 z-20">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl gap-2 md:gap-3 items-center">
             {/* Mobile Course Dropdown (Moved to bottom for space) */}
             <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="sm:hidden rounded-full border border-green-200 bg-gray-50 px-2 py-3 text-[12px] font-medium text-green-900 focus:outline-none max-w-[80px] truncate"
              >
                {COURSE_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.value || "All"}
                  </option>
                ))}
              </select>

            <input
              type="text"
              value={input}
              disabled={isStreaming}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or generate mock exams..."
              className="flex-1 rounded-full border border-green-200 bg-white px-4 md:px-6 py-3 md:py-3.5 text-[14px] text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 disabled:opacity-60 shadow-inner"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="flex items-center justify-center rounded-full bg-green-700 px-6 md:px-8 py-3 md:py-3.5 text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-white shadow-md hover:bg-green-800 disabled:opacity-50 transit
