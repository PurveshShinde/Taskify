import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProjectAssistant from '../components/ProjectAssistant';
import {
  Menu,
  Bell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { api } from '../services/api';
import { format, differenceInMinutes, isPast } from 'date-fns';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; msg: string; time: Date; read: boolean }[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const notificationRef = useRef<HTMLDivElement>(null);
  const assistantRef = useRef<HTMLDivElement>(null);

  // Notification Poller
  useEffect(() => {
    const checkDeadlines = async () => {
      try {
        const tasks = await api.tasks.getAll();
        const now = new Date();

        tasks.forEach((t) => {
          if (!t.deadline || t.status === 'completed') return;
          const deadline = new Date(t.deadline);
          const diff = differenceInMinutes(deadline, now);

          if (isPast(deadline) || (diff > 0 && diff <= 30)) {
            const msg = isPast(deadline)
              ? `Overdue: "${t.title}" was due at ${format(deadline, 'h:mm a')}`
              : `Reminder: "${t.title}" is due in ${diff} mins!`;
            const id = `${t._id}-${isPast(deadline) ? 'overdue' : 'soon'}`;

            setNotifications((prev) => {
              if (prev.some((n) => n.id === id)) return prev;
              return [{ id, msg, time: now, read: false }, ...prev];
            });
          }
        });
      } catch (e) {
        console.error(e);
      }
    };
    const interval = setInterval(checkDeadlines, 30000);
    checkDeadlines();
    return () => clearInterval(interval);
  }, []);

  // Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (isAssistantOpen && assistantRef.current && !assistantRef.current.contains(event.target as Node)) {
        setIsAssistantOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAssistantOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const unreadCount = notifications.filter((n) => !n.read).length;

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
        <Sidebar
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
                      onClick={() => navigate('/dashboard')}
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
              </div>
            </div>

            {/* Right: + New Tab, Star, Share, Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/dashboard/projects')}
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
                  alert('Link copied to clipboard!');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                title="Share Project"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition relative"
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
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">
                          No new notifications
                        </p>
                      ) : (
                        notifications.map((n) => (
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
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col bg-white">
            <Outlet context={{ openAssistant: () => setIsAssistantOpen(true) }} />
          </div>

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

          {/* AI Assistant Drawer */}
          {isAssistantOpen && (
            <div
              ref={assistantRef}
              className="fixed bottom-6 right-6 z-40 w-96 max-w-[90vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-[#eaecf0] flex flex-col overflow-hidden animate-slide-in"
            >
              <ProjectAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
