import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Project, Task } from '../../types';
import { FolderKanban, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({ projects: 0, todos: 0, completed: 0, pending: 0 });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, tasks] = await Promise.all([
           api.projects.getAll(),
           api.tasks.getAll()
        ]);
        
        setStats({
           projects: projects.length,
           todos: tasks.length,
           completed: tasks.filter(t => t.status === 'completed').length,
           pending: tasks.filter(t => t.status !== 'completed').length
        });
        setRecentProjects(projects.slice(0, 3));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
       <div>
         <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Dashboard Overview</h2>
         <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Projects" 
            value={stats.projects} 
            icon={FolderKanban} 
            color="indigo" 
            onClick={() => navigate('/dashboard/projects')} 
          />
          <StatCard 
            title="Total Todos" 
            value={stats.todos} 
            icon={CheckSquare} 
            color="blue" 
            onClick={() => navigate('/dashboard/tasks')} 
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon={TrendingUp} 
            color="emerald" 
            onClick={() => navigate('/dashboard/tasks')} 
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={Clock} 
            color="amber" 
            onClick={() => navigate('/dashboard/tasks')} 
          />
       </div>

       {/* Recent Projects & Activity */}
       <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="flex justify-between items-center">
               <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Projects</h3>
               <Link to="/dashboard/projects" className="text-primary text-sm font-medium hover:underline">View All</Link>
             </div>
             <div className="grid gap-4">
                {recentProjects.map(project => (
                   <div key={project._id} className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-light-200 dark:border-dark-600 shadow-sm flex justify-between items-center hover:shadow-md transition">
                      <div>
                         <h4 className="font-bold text-slate-800 dark:text-white">{project.title}</h4>
                         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{project.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            project.status === 'active' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-600'
                         }`}>
                            {project.status}
                         </span>
                         <span className="text-xs text-slate-400 mt-2">
                            {new Date(project.createdAt).toLocaleDateString()}
                         </span>
                      </div>
                   </div>
                ))}
                {recentProjects.length === 0 && (
                   <div className="p-8 text-center bg-white dark:bg-dark-800 rounded-xl border border-dashed border-light-300 dark:border-dark-600">
                      <p className="text-slate-500">No projects yet.</p>
                      <Link to="/dashboard/projects" className="text-primary font-bold mt-2 inline-block">Create your first project</Link>
                   </div>
                )}
             </div>
          </div>
          
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-slate-800 dark:text-white">Quick Actions</h3>
             <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-light-200 dark:border-dark-600 shadow-sm space-y-4">
                <Link to="/dashboard/tasks" className="block w-full p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-center font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition">
                   + New Task
                </Link>
                <Link to="/dashboard/projects" className="block w-full p-3 bg-slate-50 dark:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-lg text-center font-bold hover:bg-slate-100 dark:hover:bg-dark-600 transition">
                   + New Project
                </Link>
                <div className="pt-4 border-t border-light-200 dark:border-dark-600">
                   <p className="text-xs text-slate-400 mb-2 font-medium uppercase">System Status</p>
                   <div className="flex items-center gap-2 text-sm text-emerald-500">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      All Systems Operational
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, onClick }: any) => {
    const colors: any = {
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    };

    return (
        <div 
            onClick={onClick}
            className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-light-200 dark:border-dark-600 shadow-sm hover:shadow-md transition cursor-pointer"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    );
};

export default DashboardHome;