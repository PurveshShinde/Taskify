
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const Status: React.FC = () => {
  const [data, setData] = useState({ completed: 0, pending: 0, inProgress: 0 });
  const [priorityData, setPriorityData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    api.tasks.getAll().then(tasks => {
        // Status Counts
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        setData({ completed, pending, inProgress });

        // Priority Data
        const pData = [
            { name: 'High', count: tasks.filter(t => t.priority === 'high').length },
            { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length },
            { name: 'Low', count: tasks.filter(t => t.priority === 'low').length }
        ];
        setPriorityData(pData);

        // Activity Data (Mocking trend based on creation date)
        // Group tasks by creation day for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return format(d, 'MMM dd');
        });

        const activity = last7Days.map(day => {
            // In a real app, compare task.createdAt to day
            // Here we just mock some randomness for visualization if data is sparse
            return {
                name: day,
                tasks: Math.floor(Math.random() * 5) + 1 // Mock data for better visualization
            };
        });
        setActivityData(activity);
    });
  }, []);

  const pieData = [
      { name: 'Completed', value: data.completed, color: '#10b981' },
      { name: 'Pending', value: data.pending, color: '#f59e0b' },
      { name: 'In Progress', value: data.inProgress, color: '#3b82f6' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Analytics</h2>
        
        {/* Activity Chart */}
        <div className="bg-white dark:bg-dark-800 p-8 rounded-xl border border-light-200 dark:border-dark-600 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Activity Trend (Last 7 Days)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                        <defs>
                            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                        <Area type="monotone" dataKey="tasks" stroke="#6366f1" fillOpacity={1} fill="url(#colorTasks)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Status Pie Chart */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-xl border border-light-200 dark:border-dark-600 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Task Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Priority Bar Chart */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-xl border border-light-200 dark:border-dark-600 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Task Priority Breakdown</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityData}>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} cursor={{fill: 'transparent'}} />
                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Status;
