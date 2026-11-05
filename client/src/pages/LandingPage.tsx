import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Mic,
  Users,
  BarChart2,
  ArrowRight,
  Play,
  Plus,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans antialiased selection:bg-indigo-500/10 selection:text-indigo-900">
      {/* Subtle Japanese Minimalist Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-indigo-100/50 to-transparent rounded-full blur-[90px]" />
      </div>

      {/* Header / Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9fa]/90 backdrop-blur-md border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 font-bold text-lg tracking-tight">Taskify</span>
          </Link>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              onClick={handleDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#eaecf0] hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
            >
              <Play className="w-3 h-3 fill-emerald-500 text-emerald-500" />
              <span>Live Demo</span>
            </button>

            <Link
              to="/auth?mode=signin"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition hidden sm:block"
            >
              Sign In
            </Link>

            <Link
              to="/auth?mode=signup"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.15]"
        >
          A calmer way to organize, <br className="hidden sm:inline" />
          dictate, and deliver.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed"
        >
          Crafted with Japanese minimalist precision. Voice-activated task capture, real-time team workspaces, and effortless status tracking in one serene workspace.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/auth?mode=signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#eaecf0] hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-xs transition group"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>Launch Live Demo</span>
          </button>
        </motion.div>

        <p className="mt-3 text-xs text-slate-400">
          Zero setup required &bull; 100% Free &amp; Open Source &bull; Instant demo mode
        </p>

        {/* Bento Grid Showcase Section */}
        <div className="mt-12 text-left">
          {/* Main Large Bento Card: Craftboard Project Preview (Exact Replica of Dashboard Screenshot) */}
          <div
            onClick={handleDemo}
            className="rounded-3xl bg-white border border-[#eaecf0] shadow-xl shadow-slate-200/50 p-5 sm:p-7 transition-all duration-300 hover:shadow-2xl cursor-pointer group relative overflow-hidden"
          >
            {/* Window Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#eaecf0] mb-5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="ml-3 text-xs text-slate-400 font-mono hidden sm:inline">
                  Dashboard
                </span>
              </div>

              {/* Active Session Badge ON THE RIGHT HAND SIDE (as requested) */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active Session</span>
                </span>
                <span className="text-xs text-indigo-600 font-semibold hidden md:inline group-hover:underline">
                  Click to Test Drive &rarr;
                </span>
              </div>
            </div>

            {/* Project Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#5244e4] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                  C
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Craftboard Project
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center border-2 border-white">
                    AL
                  </span>
                  <span className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold flex items-center justify-center border-2 border-white">
                    DT
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-600 px-3 py-1 rounded-xl border border-[#eaecf0] bg-[#fafbfc]">
                  + Invite
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-[#eaecf0] mb-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="hover:text-slate-800">Kanban</span>
                <span className="hover:text-slate-800">Timeline</span>
                <span className="text-slate-900 font-bold border-b-2 border-slate-900 pb-2 -mb-3">
                  List
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                  Search...
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#0f172a] text-white text-xs font-semibold">
                  + New Task
                </span>
              </div>
            </div>

            {/* Group 1: To-do */}
            <div className="mb-4">
              <div className="flex items-center justify-between py-1.5 text-xs font-bold text-slate-800 border-b border-[#f1f3f7] mb-2">
                <div className="flex items-center gap-1.5">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>| To-do</span>
                  <span className="text-slate-400 font-normal">3</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-12 items-center py-2 px-2 hover:bg-slate-50 rounded-lg">
                  <div className="col-span-5 sm:col-span-4 font-medium text-slate-900">
                    <span>Employee Details</span>
                  </div>
                  <div className="col-span-4 hidden sm:block text-slate-500 truncate">
                    Create a page where there is information about employees
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-slate-400">Feb 14 - Feb 1</div>
                  <div className="col-span-3 sm:col-span-2 flex justify-end">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      &bull; Medium
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center py-2 px-2 hover:bg-slate-50 rounded-lg">
                  <div className="col-span-5 sm:col-span-4 font-medium text-slate-900">
                    <span>Bento UI Refinements</span>
                  </div>
                  <div className="col-span-4 hidden sm:block text-slate-500 truncate">
                    Light aesthetic layout polish for all screens
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-slate-400">Feb 14 - Feb 1</div>
                  <div className="col-span-3 sm:col-span-2 flex justify-end">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      &bull; Low
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 2: On Progress */}
            <div>
              <div className="flex items-center justify-between py-1.5 text-xs font-bold text-slate-800 border-b border-[#f1f3f7] mb-2">
                <div className="flex items-center gap-1.5">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>| On Progress</span>
                  <span className="text-slate-400 font-normal">3</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-12 items-center py-2 px-2 hover:bg-slate-50 rounded-lg">
                  <div className="col-span-5 sm:col-span-4 font-medium text-slate-900">
                    <span>Settings Page</span>
                  </div>
                  <div className="col-span-4 hidden sm:block text-slate-500 truncate">
                    Account configuration &amp; preferences
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-slate-400">Feb 14 - Feb 1</div>
                  <div className="col-span-3 sm:col-span-2 flex justify-end">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      &bull; High
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Complementary Bento Cards (Japanese Craft Simplicity) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Bento Card 1: Voice Dictation */}
            <div className="rounded-3xl bg-white border border-[#eaecf0] p-6 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Voice-to-Text Dictation
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Speak task titles and descriptions naturally. Browser Web Speech recognition captures and formats ideas instantaneously.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-mono">
                &ldquo;Create user permissions table and assign to team&rdquo;
              </div>
            </div>

            {/* Bento Card 2: Team Collaboration */}
            <div className="rounded-3xl bg-white border border-[#eaecf0] p-6 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Real-Time Team Sync
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Invite contributors, assign roles, and converse in project message streams. Everyone stays aligned with zero sync delay.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Instant team workspace collaboration</span>
              </div>
            </div>

            {/* Bento Card 3: Visual Analytics */}
            <div className="rounded-3xl bg-white border border-[#eaecf0] p-6 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Effortless Analytics
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Monitor sprint progress, distribution charts, and upcoming deadlines with calm visual clarity.
              </p>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[82%]" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                <span>Sprint Progress</span>
                <span className="font-bold text-slate-700">82%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Japanese Bento Callout Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#0f172a] text-white p-8 sm:p-12 text-center shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
            Experience Taskify with one click.
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-6">
            Explore the Craftboard Project board, voice dictation, and status analytics with zero setup or database required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition"
            >
              <Play className="w-3.5 h-3.5 fill-slate-900" />
              <span>Launch Live Demo</span>
            </button>
            <Link
              to="/auth?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Clean White Zen Footer */}
      <footer className="border-t border-[#eaecf0] bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#0f172a] text-white flex items-center justify-center font-bold text-[10px]">
              T
            </div>
            <span className="text-xs font-bold text-slate-800">Taskify</span>
            <span className="text-xs text-slate-400">&bull; Crafted with Japanese Minimalist Design</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-500">
            <button onClick={handleDemo} className="hover:text-slate-900 transition">
              Live Demo
            </button>
            <Link to="/auth?mode=signin" className="hover:text-slate-900 transition">
              Sign In
            </Link>
            <Link to="/auth?mode=signup" className="hover:text-slate-900 transition">
              Get Started
            </Link>
            <a
              href="https://github.com/PurveshShinde/Taskify"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition"
            >
              GitHub
            </a>
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Taskify. MIT Licensed.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
