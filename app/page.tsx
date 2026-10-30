"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
   ArrowRight, 
   BookOpen,
   Bot,
   Menu,
   X,
   FileText,
   Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-white font-sans text-gray-900 selection:bg-green-200 selection:text-green-900" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[30px] font-extrabold tracking-tight text-gray-900">Corex <span className="text-green-600">AI</span></span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors text-[10px] font-bold uppercase tracking-wider">Log in</Link>
            <Link href="/register" className="px-8 py-3 rounded-full bg-gray-900 text-white hover:bg-green-700 transition-colors shadow-md text-[10px] font-bold uppercase tracking-wider">Sign up</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col items-center justify-center gap-4">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-4 text-[10px] font-bold uppercase text-gray-700 hover:bg-gray-50 rounded-xl">Log in</Link>
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-4 text-[10px] font-bold uppercase bg-gray-900 text-white rounded-xl">Sign up</Link>
          </div>
        )}
      </nav>

      {/* Minimalist Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Soft Background Accents */}
        <div className="absolute top-20 left-0 md:left-[-10%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-green-50 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[120px] opacity-70 pointer-events-none"></div>
        <div className="absolute top-40 right-0 md:right-[-10%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-yellow-50 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[120px] opacity-70 pointer-events-none"></div>

        <div className="z-10 w-full flex flex-col items-center justify-center gap-8">
          <h1 className="text-[40px] md:text-[60px] font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Stop losing 40% of your grade. <br />
            <span className="text-green-600 block mt-2">Generic AI is failing you.</span>
          </h1>
          
          <p className="text-[20px] md:text-[30px] text-gray-700 leading-snug max-w-4xl">
            Stop studying with ChatGPT. Start passing with your actual lecturer's PDFs and recommended textbooks.
          </p>
          
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold max-w-2xl leading-relaxed">
            Corex AI bypasses generic web answers, generating responses strictly from the exact handouts and departmental materials your lecturers use to set exams.
          </p>
          
          <div className="mt-8 flex justify-center w-full">
            <Link href="https://corex-frontend-rose.vercel.app/chat" className="px-12 py-5 bg-green-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-600/20 hover:-translate-y-1 group">
              Start Now 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Minimalist Who is Corex AI Section */}
      <section className="py-20 md:py-32 bg-white relative border-t border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-16 md:space-y-24 flex flex-col items-center">
          
          <div className="flex flex-col items-center gap-6 w-full">
            <h2 className="text-[40px] md:text-[60px] font-extrabold text-gray-900 tracking-tight leading-[1.1]">Who is Corex AI?</h2>
            <p className="text-[20px] md:text-[30px] text-gray-700 max-w-3xl leading-snug">
              Your lecturer's brain, fully digitized and ready to tutor.
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold max-w-2xl leading-relaxed">
              We eliminate the gap between general internet knowledge and the specific syllabus requirements of your institution. Corex AI ensures you never lose marks on technicalities or formatting again.
            </p>
          </div>
          
          {/* Typographic Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
            
            {/* Feature 1 */}
            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden group hover:border-green-200 transition-colors flex flex-col items-center md:items-start text-center md:text-left">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-green-50 rounded-bl-[100%] z-0 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center md:items-start gap-6 w-full">
                <FileText className="text-green-600 w-10 h-10" />
                <h3 className="text-[24px] md:text-[30px] font-bold text-gray-900 leading-tight">Lecturer's PDF inside.</h3>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold leading-relaxed">
                  Upload your course materials. Corex AI restricts its knowledge base, extracting only the exact definitions, formulas, and formats your lecturer expects to see on your exam script.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden group hover:border-yellow-200 transition-colors flex flex-col items-center md:items-start text-center md:text-left">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-yellow-50 rounded-bl-[100%] z-0 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center md:items-start gap-6 w-full">
                <BookOpen className="text-yellow-600 w-10 h-10" />
                <h3 className="text-[24px] md:text-[30px] font-bold text-gray-900 leading-tight">Stop guessing.</h3>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold leading-relaxed">
                  Practice with AI-generated mock exams modeled directly from your departmental past questions. Get instant feedback on your answers graded strictly against the course marking guide.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="bg-gray-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-green-500" />
            <span className="text-[24px] md:text-[30px] font-extrabold text-white">Corex AI</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            <a href="https://yabatech.edu.ng" target="_blank" rel="noreferrer" className="hover:text-green-400 transition-colors">yabatech.edu.ng</a>
            <span className="hidden md:inline">•</span>
            <span>Developed by Osemene Chibuzor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
