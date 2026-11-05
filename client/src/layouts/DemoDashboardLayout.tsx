import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DemoSidebar from '../components/DemoSidebar';
import ProjectAssistant from '../components/ProjectAssistant';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  Share2,
  ArrowRight,
  Bell,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

const DemoDashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const assistantRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [demoNotifications, setDemoNotifications] = useState([
    { id: 'dn-1', msg: 'Reminder: "Bento UI Refinements" is due in 30 mins!', time: new Date(), read: false },
    { id: 'dn-2', msg: 'Task "Super Admin Role" assigned to Core Design Team', time: new Date(Date.now() - 3600000), read: false },
    { id: 'dn-3', msg: 'Welcome to the Taskify Demo Sandbox Workspace!', time: new Date(Date.now() - 7200000), read: true }
  ]);

  const unreadCount = demoNotifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setDemoNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Close drawers when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isAssistantOpen && assistantRef.current && !assistantRef.current.contains(event.target as Node)) {
        setIsAssistantOpen(false);
      }
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAssistantOpen, showNotifications]);

  const getBreadcrumbSubpage = () => {
    if (location.pathname.includes('tasks')) return 'To-Do List';
    if (location.pathname.includes('projects')) return 'My Projects';
    if (location.pathname.includes('status')) return 'Analytics';
    if (location.pathname.includes('teams')) return 'Teams';
    if (location.pathname.includes('settings') || location.pathname.includes('profile')) return 'Settings';
    return null;
  };

  const subpage = getBreadcrumbSubpage();

  return (
    <div className="h-screen w-full bg-[#f1f3f7] flex p-0 md:p-3 overflow-hidden select-none">
      {/* Outer Bento Workspace Card (Matching Screenshot) */}
      <div className="flex-1 bg-white rounded-none md:rounded-3xl border border-[#eaecf0] shadow-xl shadow-slate-200/50 flex overflow-hidden w-full relative">
        <DemoSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full bg-white">
          {/* Top Bar matching screenshot */}
          <header className="h-14 border-b border-[#eaecf0] flex items-center justify-between px-4 md:px-8 bg-white z-10 shrink-0">
            {/* Left: Breadcrumbs & Nav buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 md:hidden hover:bg-slate-100 rounded-lg transition"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => navigate(-1)}
                  className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                  title="Back"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                  title="Forward"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 ml-2">
                {subpage ? (
                  <>
                    <span
                      onClick={() => navigate('/demo')}
                      className="hover:text-slate-800 cursor-pointer transition"
                    >
                      Dashboard
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-semibold">{subpage}</span>
                  </>
                ) : (
                  <span className="text-slate-900 font-semibold">Dashboard</span>
                )}
                <span className="ml-2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Demo Sandbox
                </span>
              </div>
            </div>

            {/* Right: + New Tab, Star, Share, Notifications, Create Account CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/demo/projects')}
                className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>New Tab</span>
              </button>

              <button
                onClick={() => setIsStarred(!isStarred)}
                className={`p-1.5 rounded-lg transition ${
                  isStarred ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title="Star Project"
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-500' : ''}`} />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Demo link copied to clipboard!');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                title="Share Demo"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Notification Popover */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#eaecf0] p-4 z-50 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                        Demo Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {demoNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition ${
                            n.read
                              ? 'bg-slate-50 text-slate-500'
                              : 'bg-indigo-50/70 text-indigo-900 font-medium border border-indigo-100'
                          }`}
                        >
                          <p>{n.msg}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {format(n.time, 'h:mm a')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </header>

          {/* Main Demo Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            <Outlet />
          </div>
        </main>

        {/* Floating AI Assistant Companion */}
        {!isAssistantOpen && (
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="fixed bottom-6 right-6 z-30 p-3.5 rounded-2xl bg-[#0f172a] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group flex items-center gap-2 border border-slate-700"
            title="Ask AI Project Assistant"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-semibold pr-1 hidden sm:inline">AI Assistant</span>
          </button>
        )}

        {/* Project AI Assistant Drawer */}
        {isAssistantOpen && (
          <div ref={assistantRef} className="fixed inset-y-0 right-0 z-50 shadow-2xl">
            <ProjectAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoDashboardLayout;
