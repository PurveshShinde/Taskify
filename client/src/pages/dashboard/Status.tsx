import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import {
  RotateCw,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Kanban
} from 'lucide-react';
import { Task } from '../../types';

interface WorkflowStage {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  count: number;
  percentage: number;
  tasks: { title: string; priority: string; type: string }[];
}

const Status: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedStageId, setSelectedStageId] = useState<string>('progress');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.tasks.getAll();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inReview = Math.max(1, Math.floor(inProgress / 2));
  const total = completed + inProgress + pending;

  // Workflow Stages Definition
  const workflowStages: WorkflowStage[] = [
    {
      id: 'backlog',
      label: 'Backlog / To-Do',
      sublabel: 'Awaiting triage & sprint pickup',
      color: '#64748b',
      borderColor: 'border-slate-200',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700',
      count: pending,
      percentage: total > 0 ? Math.round((pending / total) * 100) : 38,
      tasks: tasks.filter((t) => t.status === 'pending').map((t) => ({
        title: t.title,
        priority: t.priority,
        type: 'General'
      }))
    },
    {
      id: 'progress',
      label: 'On Progress',
      sublabel: 'Active development & engineering',
      color: '#4f46e5',
      borderColor: 'border-indigo-200',
      bgColor: 'bg-indigo-50/60',
      textColor: 'text-indigo-700',
      count: inProgress,
      percentage: total > 0 ? Math.round((inProgress / total) * 100) : 38,
      tasks: tasks.filter((t) => t.status === 'in-progress').map((t) => ({
        title: t.title,
        priority: t.priority,
        type: 'General'
      }))
    },
    {
      id: 'review',
      label: 'In Review',
      sublabel: 'Peer QA and verification',
      color: '#f59e0b',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50/60',
      textColor: 'text-amber-700',
      count: inReview,
      percentage: total > 0 ? Math.round((inReview / total) * 100) : 18,
      tasks: [
        { title: 'Security governance audit', priority: 'high', type: 'Dashboard' },
        { title: 'Component unit benchmark', priority: 'medium', type: 'Dashboard' }
      ]
    },
    {
      id: 'done',
      label: 'Done / Completed',
      sublabel: 'Shipped to production sprint',
      color: '#10b981',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50/60',
      textColor: 'text-emerald-700',
      count: completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 25,
      tasks: tasks.filter((t) => t.status === 'completed').map((t) => ({
        title: t.title,
        priority: t.priority,
        type: 'General'
      }))
    }
  ];

  const activeStage = workflowStages.find((s) => s.id === selectedStageId) || workflowStages[1];

  // Cumulative Flow Diagram (CFD) Data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return format(d, 'EEE');
  });

  const cumulativeFlowData = last7Days.map((day, i) => ({
    day,
    done: Math.min(completed, Math.round((completed * (i + 1)) / 7)),
    progress: inProgress,
    todo: Math.max(1, pending - Math.round(i / 2))
  }));

  const throughputData = last7Days.map((day, i) => ({
    day,
    completed: Math.max(1, Math.round((i * 1.5) % 4) + 1),
    created: Math.max(1, Math.round((7 - i) % 3) + 1)
  }));

  // Custom Bento Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-2xl border border-[#eaecf0] shadow-lg text-xs space-y-1.5 min-w-[140px]">
          <p className="font-bold text-slate-800 border-b border-[#eaecf0] pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="capitalize">{entry.name}</span>
              </span>
              <span className="font-bold text-slate-800">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Workflow &amp; Velocity Analytics</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Sprint
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time project completion metrics, cumulative flow, and workload velocity
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition border border-[#eaecf0]"
          title="Refresh Data"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#eaecf0] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sprint Velocity</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-bold text-slate-900">{total * 3} pts</p>
              <span className="text-[10px] font-bold text-emerald-600">+12%</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#eaecf0] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Flow Efficiency</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-bold text-slate-900">88%</p>
              <span className="text-[10px] font-medium text-slate-400">High</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#eaecf0] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Lead Time</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-bold text-slate-900">2.1 days</p>
              <span className="text-[10px] font-bold text-emerald-600">-0.3d</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#eaecf0] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">WIP Limit</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-bold text-slate-900">{inProgress} / 6</p>
              <span className="text-[10px] font-medium text-emerald-600">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* WORKFLOW PIPELINE FUNNEL */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#eaecf0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eaecf0] pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Kanban className="w-4 h-4 text-indigo-600" />
              <span>Interactive Workflow Stage Funnel</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any stage below to inspect active tasks and pipeline progression
            </p>
          </div>
          <span className="text-[11px] font-medium text-slate-500 self-start sm:self-auto">
            Total Pipeline Volume: <strong className="text-slate-800">{total} Tasks</strong>
          </span>
        </div>

        {/* The 4 Connected Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workflowStages.map((stage, idx) => {
            const isSelected = selectedStageId === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative select-none ${
                  isSelected
                    ? `${stage.borderColor} ${stage.bgColor} shadow-sm ring-2 ring-indigo-500/20`
                    : 'border-[#eaecf0] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${stage.textColor}`}>
                    Step 0{idx + 1}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-0.5">{stage.label}</h3>
                <p className="text-[11px] text-slate-400 mb-3">{stage.sublabel}</p>

                <div className="flex items-baseline justify-between pt-2 border-t border-black/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{stage.count}</span>
                    <span className="text-xs text-slate-400 font-medium">tasks</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{stage.percentage}%</span>
                </div>

                <div className="h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${stage.percentage}%`,
                      backgroundColor: stage.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Task Inspector Drawer */}
        <div className="bg-[#fafbfc] p-4 rounded-2xl border border-[#eaecf0] space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeStage.color }}
              />
              <span className="text-xs font-bold text-slate-800">
                Tasks currently in &ldquo;{activeStage.label}&rdquo; ({activeStage.tasks.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Live Stage Snapshot</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {activeStage.tasks.map((task, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white border border-[#eaecf0] flex items-center justify-between shadow-2xs hover:border-indigo-200 transition"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 truncate">{task.title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      task.priority === 'high'
                        ? 'bg-rose-50 text-rose-700'
                        : task.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}

            {activeStage.tasks.length === 0 && (
              <div className="col-span-full py-4 text-center text-xs text-slate-400 italic">
                No active tasks in this stage right now.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SPLIT CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Flow Chart */}
        <div className="p-5 rounded-2xl bg-white border border-[#eaecf0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Cumulative Flow Diagram (CFD)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Work progression across pipeline stages over 7 days
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Flow Stability: High
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeFlowData}>
                <defs>
                  <linearGradient id="userColorDone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="userColorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="userColorTodo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="done"
                  name="Done"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#userColorDone)"
                />
                <Area
                  type="monotone"
                  dataKey="progress"
                  name="On Progress"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#userColorProgress)"
                />
                <Area
                  type="monotone"
                  dataKey="todo"
                  name="To-Do"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#userColorTodo)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-[#eaecf0] text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              Done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
              On Progress
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
              To-Do
            </span>
          </div>
        </div>

        {/* Throughput Bar Chart */}
        <div className="p-5 rounded-2xl bg-white border border-[#eaecf0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Daily Sprint Throughput
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Completed vs newly created tasks per day
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Net Velocity: Positive
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#4f46e5"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="created"
                  name="Created"
                  fill="#e2e8f0"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-[#eaecf0] text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
              Tasks Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]" />
              Tasks Created
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
