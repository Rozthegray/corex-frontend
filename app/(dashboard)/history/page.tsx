"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { MessageSquare, Calendar, ChevronRight, Loader2, BookOpen, Clock } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  course_code: string | null;
  updated_at: string;
  created_at: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = Cookies.get("access_token");
        const res = await fetch("https://corex-backend-1.onrender.com/api/v1/chat/sessions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to fetch chat history");
        
        const data = await res.json();
        setSessions(data.sessions);
      } catch (err: any) {
        setError("Could not load your archives. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 md:py-12">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-green-100 pb-6">
        <h1 className="text-[30px] md:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
          Chat History & Archives
        </h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          Review your past sessions, generated reports, and mock exams.
        </p>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-800">Retrieving Archives...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-[12px] font-bold text-red-700 uppercase tracking-widest">{error}</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 rounded-3xl border border-green-50 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-[20px] font-bold text-gray-900 mb-2">No history found</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-6">
              You haven't started any study sessions yet.
            </p>
            <Link 
              href="/chat"
              className="px-6 py-3 bg-green-700 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-green-800 transition-all shadow-md"
            >
              Start New Chat
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((session) => (
              <Link 
                key={session.id} 
                href={`/chat/${session.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 bg-white/80 backdrop-blur-md rounded-[1.5rem] border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 hover:bg-green-50/50 transition-all gap-4"
              >
                <div className="flex items-start sm:items-center gap-4 md:gap-6 overflow-hidden">
                  <div className="hidden sm:flex w-12 h-12 rounded-full bg-green-100 items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <MessageSquare className="w-5 h-5 text-green-700" />
                  </div>
                  
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <h3 className="text-[16px] md:text-[20px] font-bold text-gray-900 truncate">
                      {session.title || "Untitled Session"}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(session.updated_at)}
                      </div>
                      
                      {session.course_code && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full border border-green-200">
                          <BookOpen className="w-3.5 h-3.5" />
                          {session.course_code}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 sm:border-0">
                  <span className="sm:hidden text-[10px] font-bold uppercase tracking-widest text-green-600">
                    Open Session
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white text-gray-400 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
      }
