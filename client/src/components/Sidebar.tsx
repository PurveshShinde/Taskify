import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  BarChart2,
  Settings,
  ChevronsLeft,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenAssistant?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  onOpenAssistant
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      navigate('/');
    }
  };

  const userEmail = user?.email || 'mianag@mail.com';

  const mainNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/tasks', label: 'To-Do List', icon: CheckSquare },
    { to: '/dashboard/projects', label: 'My Projects', icon: FolderKanban },
    { to: '/dashboard/teams', label: 'Teams', icon: Users },
    { to: '/dashboard/status', label: 'Analytics', icon: BarChart2 },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 sm:w-72 bg-[#fafbfc] border-r border-[#eaecf0]
          transform transition-transform duration-300 ease-in-out
          flex flex-col h-full select-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Top: macOS Traffic Lights & Collapse Button */}
        <div className="pt-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
            title="Collapse Sidebar"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Card */}
        <div className="px-4 pt-4 pb-2">
          <div className="p-2.5 rounded-2xl bg-white border border-[#eaecf0] shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-slate-900 text-sm tracking-tight truncate leading-tight">
                  Taskify
                </p>
                <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          {/* Section: MAIN MENU */}
          <div>
            <p className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            <nav className="space-y-0.5">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm border border-[#eaecf0] font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}

              {onOpenAssistant && (
                <button
                  type="button"
                  onClick={onOpenAssistant}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 hover:bg-indigo-50/70 transition text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>AI Assistant</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100/80 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">
                    Ask
                  </span>
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="px-4 py-2 border-t border-[#eaecf0]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-rose-600 transition py-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
