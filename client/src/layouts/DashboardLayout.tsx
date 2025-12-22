import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProjectAssistant from '../components/ProjectAssistant';
import { Menu, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { format, differenceInMinutes, isPast } from 'date-fns';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string, msg: string, time: Date, read: boolean }[]>([]);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);

  // Notification Poller
  useEffect(() => {
    const checkDeadlines = async () => {
      try {
        const tasks = await api.tasks.getAll();
        const now = new Date();

        tasks.forEach(t => {
          if (!t.deadline || t.status === 'completed') return;
          const deadline = new Date(t.deadline);
          const diff = differenceInMinutes(deadline, now);

          // Trigger if deadline is past or within 30 mins
          if (isPast(deadline) || (diff > 0 && diff <= 30)) {
            const msg = isPast(deadline)
              ? `Overdue: "${t.title}" was due at ${format(deadline, 'h:mm a')}`
              : `Reminder: "${t.title}" is due in ${diff} mins!`;

            // Check if we already have this specific alert in state to avoid dupes visually
            // In a real app, IDs would come from backend
            const id = `${t._id}-${isPast(deadline) ? 'overdue' : 'soon'}`;

            // Only add if not already present
            setNotifications(prev => {
              if (prev.some(n => n.id === id)) return prev;
              return [{ id, msg, time: now, read: false }, ...prev];
            });
          }
        });
      } catch (e) { console.error(e); }
    };

    const interval = setInterval(checkDeadlines, 30000); // Check every 30s
    checkDeadlines();

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageTitle = () => {
    if (location.pathname.includes('tasks')) return 'My Todos';
    if (location.pathname.includes('projects')) return 'My Projects';
    if (location.pathname.includes('teams')) {
      if (location.pathname.split('/').length > 3) return 'Team Space';
      return 'Teams';
    }
    if (location.pathname.includes('status')) return 'Analytics';
    if (location.pathname.includes('settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="h-screen w-full bg-light-50 dark:bg-dark-900 flex overflow-hidden transition-colors duration-300">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-dark-800 border-b border-light-200 dark:border-dark-700 flex items-center justify-between px-4 md:px-8 z-10 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden hover:bg-light-100 dark:hover:bg-dark-700 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-xl text-slate-800 dark:text-white">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-light-100 dark:text-slate-400 dark:hover:bg-dark-700 transition"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-slate-500 hover:bg-light-100 dark:text-slate-400 dark:hover:bg-dark-700 transition relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-dark-800"></span>}
              </button>

              {/* Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-600 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                  <div className="p-3 border-b border-light-100 dark:border-dark-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} className="text-xs text-primary hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-light-100 dark:border-dark-700 hover:bg-light-50 dark:hover:bg-dark-700/50 transition flex gap-3 ${n.read ? 'opacity-60' : 'bg-indigo-50/30 dark:bg-indigo-900/10'}`}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-slate-300' : 'bg-red-500'}`}></div>
                          <div>
                            <p className="text-sm text-slate-800 dark:text-slate-200">{n.msg}</p>
                            <p className="text-xs text-slate-400 mt-1">{format(n.time, 'h:mm a')}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-primary font-bold">
              U
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <Outlet />
        </div>

        {/* Project Assistant */}
        <ProjectAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      </main>
    </div>
  );
};

export default DashboardLayout;