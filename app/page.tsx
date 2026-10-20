"use client";

import {
  ChartNetworkIcon,
  ImageIcon,
  MapIcon,
  PenToolIcon,
  ScanTextIcon,
  SparklesIcon,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// --- Hero AI Component ---
const CorexInterface = () => {
  return (
    <Card className="flex h-full min-h-[500px] w-full max-w-[480px] flex-col gap-6 p-4 shadow-2xl ring-1 ring-slate-200/50 bg-white dark:bg-slate-950">
      <div className="flex flex-row items-center justify-end p-0">
        <Button variant="ghost" size="icon" className="size-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="size-4 text-muted-foreground"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
            />
          </svg>
        </Button>
      </div>
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex flex-col items-center justify-center space-y-8 p-6">
          {/* Corex Logo SVG */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-inner">
             <BrainCircuit size={32} className="text-emerald-400" />
          </div>

          <div className="flex flex-col space-y-2.5 text-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-medium tracking-tight text-muted-foreground">
                Hi Innovator,
              </h2>
              <h3 className="text-lg font-medium tracking-[-0.006em]">
                Welcome to Corex. Ready to study?
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              I have loaded your department's specific past questions, lecture slides, and marking guides.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="h-7 min-w-7 cursor-pointer gap-1.5 text-xs rounded-md">
              <ScanTextIcon className="text-pink-500 size-3.5" />
              Summarize Lecture 4
            </Badge>
            <Badge variant="secondary" className="h-7 min-w-7 cursor-pointer gap-1.5 text-xs rounded-md">
              <MapIcon className="text-green-500 size-3.5" />
              Solve 2023 Past Question
            </Badge>
            <Badge variant="secondary" className="h-7 min-w-7 cursor-pointer gap-1.5 text-xs rounded-md">
              <ChartNetworkIcon className="text-orange-500 size-3.5" />
              Explain Hardware Architecture
            </Badge>
          </div>
        </div>

        <div className="relative mt-auto flex-col rounded-md ring-1 ring-border shadow-sm">
          <div className="relative">
            <Textarea
              placeholder="Ask a question from your syllabus..."
              className="peer bg-transparent min-h-[100px] resize-none rounded-b-none border-none py-3 ps-9 pe-9 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex items-center justify-between rounded-b-md border-t bg-muted/50 px-3 py-2 dark:bg-muted">
            <Select defaultValue="corex-pro">
              <SelectTrigger size="sm" className="h-7 bg-background text-xs w-[120px] border-none shadow-none">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="corex-pro">
                  <span className="font-semibold text-emerald-600">Corex RAG Engine</span>
                </SelectItem>
                <SelectItem className="text-xs" value="generic" disabled>
                  Generic AI (Not Recommended)
                </SelectItem>
              </SelectContent>
            </Select>

            <Button className="h-7 px-4 text-xs bg-slate-900 text-white hover:bg-slate-800" size="sm">
              Ask Corex
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-200">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform">
          <div className="h-[40rem] w-[80rem] rounded-full bg-emerald-50 opacity-50 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              
              {/* Hero Text */}
              <div className="max-w-2xl">
                <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 text-sm font-semibold">
                  Stop settling for generic answers.
                </Badge>
                
                <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl mb-6 leading-[1.1]">
                  Stop losing <span className="text-rose-500">50%</span> of your exam score.
                </h1>
                
                <p className="text-lg leading-8 text-slate-600 mb-8 font-medium">
                  You are failing because you use generic AI. ChatGPT doesn't know what your lecturer taught in class. It doesn't know your department's marking guide. <strong className="text-slate-900">Corex does.</strong>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="h-14 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-200 transition-all hover:scale-105">
                    Start Studying with Corex
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-slate-300 bg-white hover:bg-slate-50">
                    View Demo
                  </Button>
                </div>

                <div className="mt-10 flex items-center gap-x-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Trained on your syllabus
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Exact marking schemes
                  </div>
                </div>
              </div>

              {/* Hero UI Component */}
              <div className="flex justify-center lg:justify-end relative">
                {/* Decorative glow behind the card */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-100 to-blue-50 opacity-50 blur-2xl -z-10"></div>
                <div className="transform transition-transform hover:-translate-y-2 duration-500 w-full max-w-[480px]">
                  <CorexInterface />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- MEET COREX SECTION (Slide-up effect imitation) --- */}
      <section className="bg-slate-900 py-24 sm:py-32 relative z-10 border-t-8 border-emerald-500">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-base font-semibold leading-7 text-emerald-400">The Ultimate Academic Agent</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet Corex.
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              An AI agent whose entire knowledge base and solution engine is built directly off <strong className="text-white">every lecture slide, past question, and handout</strong> your department has ever produced.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              
              {/* Feature 1 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <GraduationCap className="h-6 w-6 text-emerald-400" aria-hidden="true" />
                  </div>
                  Context-Aware Answers
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-400">
                  Generic AI gives generic answers. Corex answers based on how your specific professor taught the topic in week 4.
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <BrainCircuit className="h-6 w-6 text-blue-400" aria-hidden="true" />
                  </div>
                  Retrieval-Augmented Generation
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-400">
                  Powered by a 1536-dimensional Pinecone vector database that instantly retrieves the exact page of the handout you need.
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <TrendingUp className="h-6 w-6 text-rose-400" aria-hidden="true" />
                  </div>
                  Proven Score Improvement
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-400">
                  Stop losing marks for writing definitions from Wikipedia. Use the definitions your examiners are actually looking for.
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </section>

      {/* --- THE PROOF / PLAN SECTION --- */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Will Corex actually improve your exam score?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Let's look at a standard Computer Engineering past question: <br/> 
              <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">"Explain the Harvard Architecture."</span>
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* The Generic Way */}
            <Card className="border-rose-200 bg-rose-50/50 shadow-none">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <span className="font-bold text-xl">X</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Using Generic AI</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 p-4 bg-white rounded-lg border border-slate-200">
                    "Harvard architecture is a computer architecture with separate storage and signal pathways for instructions and data..."
                  </p>
                  <div className="pt-4 border-t border-rose-100">
                    <p className="font-bold text-rose-600 text-sm">Result: 4/10 Marks</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Reason: The answer is technically true, but misses the specific micro-controller examples (like PIC) the lecturer emphasized in class.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* The Corex Way */}
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-none ring-1 ring-emerald-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Using Corex.AI</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-slate-800 p-4 bg-white rounded-lg border border-emerald-200 shadow-sm">
                    <span className="text-xs text-emerald-600 font-bold mb-2 block">Found in: CTE 411 Handout, Page 12</span>
                    "Unlike Von Neumann, the Harvard Architecture allows the CPU to fetch both an instruction and data simultaneously. As taught in class, this is the architecture utilized by the PIC16F84A microcontroller we are using for our lab projects..."
                  </p>
                  <div className="pt-4 border-t border-emerald-200">
                    <p className="font-bold text-emerald-700 text-sm">Result: 10/10 Marks</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Reason: Exact definition matched to the department's expected marking scheme, complete with the specific hardware references taught by the professor.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="mt-16 flex justify-center">
            <Button size="lg" className="h-14 px-8 text-base bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xl">
              Join the Corex Platform Today
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}