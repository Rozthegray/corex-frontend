"use client"; // Add this line at the top

import React, { useState, useEffect } from 'react';
import { 
   ArrowRight, 
   BookOpen,
   Bot,
   Layers,
   Menu,
   X,
   Search,
   MessageSquare,
   FileText,
   LogOut,
   Sparkles
   // Instagram removed
} from 'lucide-react';

// --- ROUTER COMPONENT ---
// --- ROUTER COMPONENT ---
export default function App() {
  // 1. Initialize with a safe default for the server build
  const [currentPath, setCurrentPath] = useState('#/');

  // 2. Read the window object only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.hash || '#/');
    }
  }, []);

  // 3. Keep your existing hash change listener
  useEffect(() => {
    const onHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ... rest of your component
  const renderRoute = () => {
    switch (currentPath) {
      case '#/dashboard':
        return <Dashboard />;
      case '#/login':
        return <AuthPage type="login" />;
      case '#/signup':
      case '#/signup':
      return <AuthPage type="register" />;
      case '#/':
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-green-200 selection:text-green-900" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {renderRoute()}
    </div>
  );
}

// --- LANDING PAGE ---
function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '#/'}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[30px] font-extrabold tracking-tight text-gray-900">Corex <span className="text-green-600">AI</span></span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#/login" className="text-gray-600 hover:text-gray-900 transition-colors text-[10px] font-bold uppercase tracking-wider">Log in</a>
            <a href="#/signup" className="px-6 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-md text-[10px] font-bold uppercase tracking-wider">Sign up</a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-4">
            <a href="#/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 text-[10px] font-bold uppercase text-gray-700 hover:bg-gray-50 rounded-xl">Log in</a>
            <a href="#/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 text-[10px] font-bold uppercase bg-gray-900 text-white rounded-xl">Sign up</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        {/* Background Accents */}
        <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-green-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none"></div>
        <div className="absolute top-40 right-[-10%] w-[400px] h-[400px] bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="flex-1 space-y-10 z-10 text-center lg:text-left">
          <h1 className="text-[60px] font-extrabold text-gray-900 leading-[1.1]">
            Stop losing 40% of your score, <br className="hidden md:block"/>
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-green-600">because you use generic AI.</span>
              <svg className="absolute w-full h-4 -bottom-1 left-0 text-yellow-400 z-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 50 25 100 10 L 100 20 L 0 20 Z" fill="currentColor"></path>
              </svg>
            </span>
          </h1>
          
          <p className="text-[10px] text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed uppercase tracking-widest">
            Corex AI turns your departmental archives, past questions, and course materials into an interactive, intelligent tutoring experience tailored specifically to Yabatech.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a href="#/dashboard" className="w-full sm:w-auto px-10 py-5 bg-green-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-600/30 hover:shadow-green-600/40 hover:-translate-y-1 group">
              Start Now 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </a>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl lg:max-w-none relative z-10 mt-10 lg:mt-0">
          <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-gradient-to-tr from-green-50 to-yellow-50 p-4 sm:p-8 shadow-2xl border border-white flex items-center justify-center overflow-visible">
            {/* Soft inner glow */}
            <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_100px_rgba(255,255,255,0.8)]"></div>
            
            {/* Robot Image */}
            <img 
              src="White_friendly_robot_standing_2K_20261019171820.jpg" 
              alt="Corex AI Friendly Robot Tutor" 
              className="relative z-20 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
              style={{ filter: 'drop-shadow(0px 20px 40px rgba(0, 135, 81, 0.15))' }}
            />
          </div>
        </div>
      </section>

      {/* Who is Corex AI Section */}
      <section className="py-32 bg-white relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[30px] font-extrabold text-gray-900 tracking-tight mb-4">Who is Corex AI?</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Bridging the gap between general knowledge and your specific curriculum.</p>
          </div>
          
          {/* Feature 1: Chat View */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <h3 className="text-[30px] font-bold text-gray-900 leading-[1.2]">A mission to see more students succeed.</h3>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Our primary goal is to see more students go through college successfully. We achieve this by embedding the unique Yabatech orientation directly into our AI. You aren't just getting generic answers; you're getting responses modeled after how your specific lecturers teach and test.
              </p>
              <ul className="space-y-4 pt-4">
                 <li className="flex items-center gap-3 text-[10px] text-gray-700 font-bold"><Bot size={16} className="text-green-600" /> Custom Yabatech AI Models</li>
                 <li className="flex items-center gap-3 text-[10px] text-gray-700 font-bold"><BookOpen size={16} className="text-yellow-500" /> Syllabus-Aligned Responses</li>
              </ul>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-[3rem] transform rotate-3 scale-105"></div>
              <div className="relative bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 flex flex-col gap-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-900">Corex Tutor</h4>
                    <p className="text-[10px] text-gray-500">Online • Ready to help</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-100 rounded-[2rem] rounded-tr-sm p-4 text-[10px] text-gray-800 self-end max-w-[80%] shadow-sm">
                    Explain the concept of Data Structures as taught in COM 312.
                  </div>
                  <div className="bg-green-50 rounded-[2rem] rounded-tl-sm p-4 text-[10px] text-green-900 self-start max-w-[90%] shadow-sm border border-green-100">
                    Based on the Yabatech COM 312 syllabus, Data Structures involves organizing data in memory... <br/><br/>
                    <b>Pro tip:</b> Focus on Trees and Graphs, they appeared in 4 out of the last 5 past questions!
                  </div>
                </div>
                
                <div className="mt-2 flex items-center gap-2 bg-gray-50 rounded-full p-2 border border-gray-200">
                  <input type="text" placeholder="Ask a question..." className="flex-1 bg-transparent border-none outline-none text-[10px] px-3" />
                  <button className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white"><ArrowRight size={14}/></button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Archive View */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <h3 className="text-[30px] font-bold text-gray-900 leading-[1.2]">Your digital academic archive.</h3>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Stop scrambling for materials days before exams. Corex AI provides a structured, easily accessible archive of your departmental past questions, notes, and handouts, instantly readable by your AI tutor.
              </p>
               <ul className="space-y-4 pt-4">
                 <li className="flex items-center gap-3 text-[10px] text-gray-700 font-bold"><Layers size={16} className="text-gray-900" /> Organized by Course Code</li>
                 <li className="flex items-center gap-3 text-[10px] text-gray-700 font-bold"><Search size={16} className="text-green-600" /> Instant Search & Retrieval</li>
              </ul>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-bl from-yellow-100 to-yellow-50 rounded-[3rem] transform -rotate-3 scale-105"></div>
              <div className="relative bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 flex flex-col gap-4 max-w-md mx-auto">
                 <h4 className="text-[30px] font-bold text-gray-900 border-b border-gray-100 pb-4">Archives</h4>
                 
                 {['COM 312 Past Questions 2025.pdf', 'STA 111 Lecture Notes.docx', 'GNS 201 Summary & Keypoints.pdf'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-[1rem] hover:bg-green-50 border border-gray-100 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-3">
                         <FileText size={20} className="text-gray-400 group-hover:text-green-600" />
                         <span className="text-[10px] font-bold text-gray-700">{item}</span>
                       </div>
                       <span className="text-[10px] text-green-600 bg-green-100 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Analyzed</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-green-500" />
            <span className="text-[30px] font-bold text-white">Corex AI</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest">
            <a href="https://yabatech.edu.ng" target="_blank" rel="noreferrer" className="hover:text-green-400 transition-colors">yabatech.edu.ng</a>
            <span className="hidden md:inline">•</span>
            <span>Developed by Osemene Chibuzor</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors">
             
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- DASHBOARD PLACEHOLDER ---
function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '#/'}>
           <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
             <Sparkles className="w-4 h-4 text-white" />
           </div>
           <span className="text-xl font-extrabold text-gray-900">Corex <span className="text-green-600">AI</span></span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl font-medium transition-colors">
            <MessageSquare size={20} /> AI Tutor
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <FileText size={20} /> My Archives
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <BookOpen size={20} /> Yabatech Courses
          </a>
        </div>
        <div className="p-4 border-t border-gray-100">
          <a href="#/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors">
            <LogOut size={20} /> Log Out
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-gray-800">Welcome back, Scholar</h2>
          <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-white shadow-sm flex items-center justify-center text-yellow-700 font-bold">
            JD
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Search/Ask Box */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all">
              <div className="pl-4 text-gray-400"><Search size={24}/></div>
              <input 
                type="text" 
                placeholder="Ask Corex AI about COM 312 or paste a past question..." 
                className="w-full p-4 bg-transparent outline-none text-lg text-gray-800 placeholder-gray-400"
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition">
                Ask
              </button>
            </div>

            {/* Quick Stats/Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-white shadow-lg shadow-green-900/20 relative overflow-hidden">
                <Bot className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">Start a new session</h3>
                <p className="text-green-100 mb-6 relative z-10">Your AI tutor is ready to assist with your Yabatech coursework.</p>
                <button className="bg-white text-green-700 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-50 transition relative z-10">
                  New Chat
                </button>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Archives</h3>
                <ul className="space-y-3">
                  {['COM 312 Past Questions 2025', 'STA 111 Lecture Notes', 'GNS 201 Summary'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 hover:text-green-600 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                      <FileText size={18} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- AUTH PAGES (LOGIN / SIGNUP) ---
function AuthPage({ type }: { type: 'login' | 'register' }) {
    const isLogin = type === 'login';
    // ...
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 font-sans selection:bg-green-200 selection:text-green-900" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-gray-200">
        
        {/* Left Pane - Form */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center bg-white relative z-10">
           <button onClick={() => window.location.hash = '#/'} className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer text-gray-900 hover:text-green-600 transition-colors">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Back</span>
           </button>

          <h2 className="text-[60px] font-extrabold text-gray-900 leading-[1.1] tracking-tight mt-8">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-[30px] text-gray-500 leading-tight mt-2 mb-10">
            {isLogin ? 'Log in to continue your session.' : 'Brainstorm in chat, build in cowork.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-2xl text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-all hover:shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fillRule="evenodd" /></svg>
              {isLogin ? 'Log in with Google' : 'Sign up with Google'}
            </button>
            <button className="flex-1 flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-2xl text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-all hover:shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.14-.49-3.25 0-1.14.51-2.06.52-2.98-.4-3.5-3.5-5.38-8.58-3.04-12.05 1.14-1.68 2.88-2.73 4.79-2.76 1.4-.04 2.65.68 3.5 1.06.91.4 1.83.47 2.62 0 1.06-.61 2.38-1.25 4.02-.95 1.63.29 3.12 1.3 4.04 2.76-3.4 2.03-2.88 6.5.6 7.9-1.02 2.68-2.62 5.09-4.22 6.04zM12.03 5.4c-.16-2.18 1.66-4.14 3.75-4.4.25 2.3-1.8 4.27-3.75 4.4z"/></svg>
              {isLogin ? 'Log in with Apple' : 'Sign up with Apple'}
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form className="space-y-5" action="#" method="POST" onSubmit={(e) => { e.preventDefault(); window.location.hash = '#/dashboard'; }}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <input id="name" name="name" type="text" required className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-[10px] bg-gray-50/50" placeholder="John Doe" />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-[10px] bg-gray-50/50" placeholder="student@yabatech.edu.ng" />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-[10px] bg-gray-50/50" placeholder="••••••••" />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-[10px] text-gray-700 font-bold uppercase tracking-wider">Remember me</label>
                </div>
                <a href="#" className="text-[10px] font-bold text-green-600 hover:text-green-500 uppercase tracking-wider">Forgot your password?</a>
              </div>
            )}

            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-600/20 text-[10px] font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all hover:-translate-y-0.5 uppercase tracking-widest mt-6">
              {isLogin ? 'Sign in' : 'Create Account'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href={isLogin ? "#/signup" : "#/login"} className="text-green-600 hover:text-green-500 transition-colors">
              {isLogin ? 'Sign up' : 'Log in'}
            </a>
          </p>
        </div>

        {/* Right Pane - Visual */}
        <div className="hidden md:flex flex-1 relative bg-[#0a0a0a] overflow-hidden flex-col justify-center p-12 lg:p-20">
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          
          {/* Grainy Glowing Gradients */}
          <div className="absolute top-[-20%] right-[-20%] w-[120%] h-[120%] bg-gradient-to-bl from-green-500 via-yellow-400 to-transparent rounded-full mix-blend-screen filter blur-[100px] opacity-90 z-0"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-green-700/60 rounded-full mix-blend-screen filter blur-[120px] z-0"></div>

          {/* Text Content */}
          <div className="relative z-20 max-w-md">
            <h2 className="text-[60px] font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-2xl">
              Think fast, <br /> Build faster.
            </h2>
            <p className="mt-6 text-[30px] text-white/90 leading-tight drop-shadow-lg">
              Join the academic revolution tailored exclusively for Yabatech.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple dummy icon for CheckCircle2
function CheckCircle2({ size = 24, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}