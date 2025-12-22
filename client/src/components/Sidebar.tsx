
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, LayoutDashboard, CheckSquare, FolderKanban, Users, BarChart2, User as UserIcon, Settings, X, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenAssistant?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onOpenAssistant }) => {
  const { user, logout, isDemo } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/projects', icon: FolderKanban, label: 'My Projects' },
    { to: '/dashboard/tasks', icon: CheckSquare, label: 'My Todos' },
    // Teams disabled in Demo
    { to: '/dashboard/teams', icon: Users, label: 'Teams', disabled: isDemo },
    { to: '/dashboard/status', icon: BarChart2, label: 'Analytics' },
    { to: '/dashboard/profile', icon: UserIcon, label: 'Profile' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30
        w-72 bg-white dark:bg-dark-800 border-r border-light-200 dark:border-dark-700 
        transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-light-100 dark:border-dark-700">
          <div className="flex items-center gap-3 text-primary-dark dark:text-primary font-bold text-2xl tracking-tight">
            <CheckSquare className="w-8 h-8" />
            <span>Taskify</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="px-6 py-6">
           <div className={`p-4 rounded-xl border flex items-center gap-3 ${isDemo ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50' : 'bg-light-50 dark:bg-dark-700/50 border-light-100 dark:border-dark-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isDemo ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate text-sm">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{isDemo ? 'Demo Mode' : user?.email}</p>
              </div>
           </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
            {navItems.map((item) => (
              item.disabled ? (
                 <div key={item.to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-70 group relative">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    <span className="ml-auto text-xs bg-slate-100 dark:bg-dark-700 px-1.5 py-0.5 rounded">Locked</span>
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded hidden group-hover:block w-32 z-50">
                        Login required
                    </div>
                 </div>
              ) : (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                    className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                    ${isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-light-100 dark:hover:bg-dark-700 hover:text-slate-900 dark:hover:text-slate-100'}
                    `}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                </NavLink>
              )
            ))}
            
            <div className="mt-8">
               <div 
                 onClick={onOpenAssistant}
                 className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="relative z-10">
                     <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                        <MessageSquare className="w-5 h-5 text-white" />
                     </div>
                     <h4 className="font-bold mb-1">Project Assistant</h4>
                     <p className="text-xs text-indigo-100 mb-3">Need help organizing?</p>
                     <button className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-50 transition">Ask AI</button>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
               </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-light-200 dark:border-dark-700">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-sm font-medium w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>{isDemo ? 'Exit Demo' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
