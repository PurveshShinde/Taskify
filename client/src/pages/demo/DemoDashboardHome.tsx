import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import {
  Kanban,
  List,
  Calendar,
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
  Mic,
  MicOff,
  UserPlus,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

type ViewMode = 'list' | 'kanban' | 'timeline';

interface DemoTaskItem extends Task {
  taskType?: string;
}

const INITIAL_DEMO_TASKS: DemoTaskItem[] = [
  {
    _id: 'dt-1',
    title: 'Employee Details',
    description: 'Create a page where there is information about employees',
    status: 'pending',
    priority: 'medium',
    userId: 'demo-user-id',
    projectId: 'proj-1',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    taskType: 'Dashboard'
  },
  {
    _id: 'dt-2',
    title: 'Darkmode version',
    description: 'Darkmode version for all screens',
    status: 'pending',
    priority: 'low',
    userId: 'demo-user-id',
    projectId: 'proj-1',
    deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
    createdAt: new Date().toISOString(),
    taskType: 'Mobile App'
  },
  {
    _id: 'dt-3',
    title: 'Super Admin Role',
    description: 'Manage access controls and permissions',
    status: 'pending',
    priority: 'medium',
    userId: 'demo-user-id',
    projectId: 'proj-1',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    taskType: 'Dashboard'
  },
  {
    _id: 'dt-4',
    title: 'Super Admin Role',
    description: 'Configure multi-tier governance and audits',
    status: 'in-progress',
    priority: 'high',
    userId: 'demo-user-id',
    projectId: 'proj-1',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    taskType: 'Dashboard'
  },
  {
    _id: 'dt-5',
    title: 'Settings Page',
    description: 'Account settings and notification preferences',
    status: 'in-progress',
    priority: 'medium',
    userId: 'demo-user-id',
    projectId: 'proj-1',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    taskType: 'Mobile App'
  },
  {
    _id: 'dt-6',
    title: 'KPI and Employee Statistics',
    description: 'Create a design that displays KPIs and employee statistics',
    status: 'in-progress',
    priority: 'low',
    userId: 'demo-user-id',
    projectId: 'proj-1',
    deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    createdAt: new Date().toISOString(),
    taskType: 'Dashboard'
  },
  {
    _id: 'dt-7',
    title: 'Customer Role',
    description: 'Customer access rules and interface permissions',
    status: 'completed',
    priority: 'medium',
    userId: 'demo-user-id',
    projectId: 'proj-1',
    deadline: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    taskType: 'Dashboard'
  },
  {
    _id: 'dt-8',
    title: 'Admin Role',
    description: 'Set up with relevant information such as profile picture, phone number etc',
    status: 'completed',
    priority: 'high',
    userId: 'demo-user-id',
    projectId: 'proj-1',
    deadline: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    taskType: 'Mobile App'
  }
];

const DemoDashboardHome: React.FC = () => {
  const [tasks, setTasks] = useState<DemoTaskItem[]>(() => {
    const saved = localStorage.getItem('taskify_isolated_demo_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DEMO_TASKS;
      }
    }
    return INITIAL_DEMO_TASKS;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Voice Speech-to-Text
  const speech = useSpeechToText();

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskify_isolated_demo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Form State for New Task
  const [newTaskForm, setNewTaskForm] = useState<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    deadline: string;
    taskType: string;
  }>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    taskType: 'Dashboard',
  });

  // Auto-fill transcript when speaking
  useEffect(() => {
    if (speech.transcript) {
      setNewTaskForm((prev) => ({
        ...prev,
        title: prev.title ? `${prev.title} ${speech.transcript}` : speech.transcript,
      }));
      speech.resetTranscript();
    }
  }, [speech.transcript]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    const newTask: DemoTaskItem = {
      _id: 'dt-' + Date.now(),
      title: newTaskForm.title.trim(),
      description: newTaskForm.description.trim(),
      status: newTaskForm.status,
      priority: newTaskForm.priority,
      deadline: newTaskForm.deadline,
      userId: 'demo-user-id',
      projectId: 'proj-1',
      createdAt: new Date().toISOString(),
      taskType: newTaskForm.taskType || 'Dashboard'
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsNewTaskModalOpen(false);
    setNewTaskForm({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      taskType: 'Dashboard',
    });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const handleResetDemoData = () => {
    if (confirm('Reset demo board back to initial Craftboard sample tasks?')) {
      setTasks(INITIAL_DEMO_TASKS);
      localStorage.setItem('taskify_isolated_demo_tasks', JSON.stringify(INITIAL_DEMO_TASKS));
    }
  };

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Low
          </span>
        );
    }
  };

  const getTypeBadge = (type?: string) => {
    const label = type || 'Dashboard';
    if (label.toLowerCase().includes('mobile')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
          Mobile App
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/50">
        Dashboard
      </span>
    );
  };

  const renderTaskTable = (
    groupTitle: string,
    groupStatus: TaskStatus,
    groupColor: string,
    groupCount: number
  ) => {
    const groupKey = groupStatus;
    const isCollapsed = collapsedGroups[groupKey];
    const groupTasks = filteredTasks.filter((t) => t.status === groupStatus);

    return (
      <div key={groupKey} className="mb-6">
        {/* Group Header */}
        <div
          onClick={() => toggleGroupCollapse(groupKey)}
          className="flex items-center justify-between py-2 px-3 bg-white hover:bg-slate-50/70 rounded-xl cursor-pointer border-b border-[#eaecf0] transition select-none"
        >
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-700">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2">
              <span className={`w-1 h-3 rounded-full ${groupColor}`}></span>
              <span className="font-bold text-slate-900 text-xs tracking-tight">{groupTitle}</span>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-md">
                {groupCount}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setNewTaskForm((p) => ({ ...p, status: groupStatus }));
              setIsNewTaskModalOpen(true);
            }}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition"
            title="Add task to this section"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Group Table */}
        {!isCollapsed && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#eaecf0] text-slate-400 font-medium">
                  <th className="py-2.5 px-4 font-semibold text-slate-500 w-1/4">Task Name</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-500 w-1/3">Description</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-500">Estimation</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-500">Type</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-500">People</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-500">Priority</th>
                  <th className="py-2.5 px-3 text-right">
                    <Plus className="w-3.5 h-3.5 inline text-slate-400" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaecf0]/70">
                {groupTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-slate-400 text-xs italic">
                      No tasks in this section. Click &ldquo;+&rdquo; above to add one.
                    </td>
                  </tr>
                ) : (
                  groupTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-slate-50/70 transition group"
                    >
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <span className={task.status === 'completed' ? 'line-through text-slate-400' : ''}>
                          {task.title}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-500 truncate max-w-xs">
                        {task.description || '-'}
                      </td>

                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {task.deadline
                          ? format(new Date(task.deadline), 'MMM d, yyyy')
                          : 'Feb 14, 2024 - Feb 1, 2024'}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {getTypeBadge(task.taskType)}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center -space-x-1.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold flex items-center justify-center border border-white">
                            AL
                          </span>
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold flex items-center justify-center border border-white">
                            DT
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Project Header (Matching Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Big 'C' Icon + Project Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            C
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              Craftboard Project
            </h1>
            <p className="text-xs text-slate-400">
              Interactive Japanese Bento Demo Workspace &bull; All changes saved in browser
            </p>
          </div>
        </div>

        {/* Right: Member Avatars + Invite Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              AL
            </span>
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              DT
            </span>
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              MP
            </span>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#eaecf0] hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Invite</span>
          </button>

          <button
            onClick={handleResetDemoData}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline ml-1"
            title="Reset to default sample tasks"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Control Bar: View Tabs + Search + Filter + New Task */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eaecf0] pb-3">
        {/* View Tabs matching screenshot */}
        <div className="flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 pb-2 transition relative ${
              viewMode === 'kanban'
                ? 'text-slate-900 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Kanban</span>
            {viewMode === 'kanban' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 pb-2 transition relative ${
              viewMode === 'timeline'
                ? 'text-slate-900 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Timeline</span>
            {viewMode === 'timeline' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 pb-2 transition relative ${
              viewMode === 'list'
                ? 'text-slate-900 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List</span>
            {viewMode === 'list' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>
        </div>

        {/* Search, Filter, New Task button */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#eaecf0] bg-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 w-36 sm:w-44"
            />
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none pl-7 pr-6 py-1.5 rounded-xl border border-[#eaecf0] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer focus:outline-none"
            >
              <option value="all">Filter</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Main Content: List View (Matching Screenshot) */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {renderTaskTable(
            'To-do',
            'pending',
            'bg-slate-400',
            tasks.filter((t) => t.status === 'pending').length
          )}

          {renderTaskTable(
            'On Progress',
            'in-progress',
            'bg-blue-500',
            tasks.filter((t) => t.status === 'in-progress').length
          )}

          {renderTaskTable(
            'In Review',
            'completed',
            'bg-emerald-500',
            tasks.filter((t) => t.status === 'completed').length
          )}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['pending', 'in-progress', 'completed'] as TaskStatus[]).map((colStatus) => {
            const colTitle =
              colStatus === 'pending'
                ? 'To-do'
                : colStatus === 'in-progress'
                ? 'On Progress'
                : 'In Review';
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);

            return (
              <div
                key={colStatus}
                className="bg-[#fafbfc] rounded-2xl p-3 border border-[#eaecf0] flex flex-col"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{colTitle}</span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 text-[10px] font-bold">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setNewTaskForm((p) => ({ ...p, status: colStatus }));
                      setIsNewTaskModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-3 bg-white rounded-xl border border-[#eaecf0] shadow-xs space-y-2 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-xs text-slate-900 leading-snug">
                          {task.title}
                        </p>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-slate-300 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-[#eaecf0]/60">
                        {getTypeBadge(task.taskType)}
                        <div className="flex items-center gap-1.5">
                          {getPriorityBadge(task.priority)}
                          {colStatus !== 'completed' && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  task._id,
                                  colStatus === 'pending' ? 'in-progress' : 'completed'
                                )
                              }
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold px-1 rounded hover:bg-indigo-50 transition"
                              title="Advance to next workflow stage"
                            >
                              &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-2xl border border-[#eaecf0] p-6 text-center space-y-3">
          <Calendar className="w-8 h-8 text-indigo-500 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900">Project Timeline</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Interactive gantt chart and deadline tracker. Dictate tasks or switch status to see live updates.
          </p>
          <div className="space-y-2 max-w-md mx-auto pt-3">
            {filteredTasks.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#eaecf0] text-xs text-left"
              >
                <span className="font-semibold text-slate-900">{t.title}</span>
                <span className="text-[11px] text-slate-400">
                  {t.deadline ? format(new Date(t.deadline), 'MMM d, yyyy') : 'Q1 2024'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Task with Speech-to-Text */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900">Add New Demo Task</h2>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Voice Dictation Banner */}
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-900">
                  {speech.isListening ? 'Listening... Speak now!' : 'Dictate task with Voice'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => (speech.isListening ? speech.stopListening() : speech.startListening())}
                className={`p-2 rounded-xl transition ${
                  speech.isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                title="Toggle Voice Input"
              >
                {speech.isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) =>
                    setNewTaskForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Design Settings Page"
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newTaskForm.description}
                  onChange={(e) =>
                    setNewTaskForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Detailed task description..."
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newTaskForm.status}
                    onChange={(e) =>
                      setNewTaskForm((p) => ({
                        ...p,
                        status: e.target.value as TaskStatus,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs font-medium focus:outline-none"
                  >
                    <option value="pending">To-do</option>
                    <option value="in-progress">On Progress</option>
                    <option value="completed">In Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) =>
                      setNewTaskForm((p) => ({
                        ...p,
                        priority: e.target.value as TaskPriority,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs font-medium focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#eaecf0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Demo Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900">Invite to Craftboard</h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              In demo mode, invitations simulate collaborative access without modifying production credentials.
            </p>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-[#eaecf0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (inviteEmail) {
                    alert(`Simulated invitation sent to ${inviteEmail}!`);
                    setIsInviteModalOpen(false);
                    setInviteEmail('');
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoDashboardHome;
