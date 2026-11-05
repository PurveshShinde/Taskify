import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
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
  X
} from 'lucide-react';
import { format } from 'date-fns';

type ViewMode = 'list' | 'kanban' | 'timeline';

const DashboardHome: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Voice Speech-to-Text
  const speech = useSpeechToText();

  // Form State for New Task
  const [newTaskForm, setNewTaskForm] = useState<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    deadline: string;
    type: string;
  }>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    type: 'Dashboard',
  });

  useEffect(() => {
    loadTasks();
  }, []);

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

  const loadTasks = async () => {
    try {
      const data = await api.tasks.getAll();
      setTasks(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    try {
      await api.tasks.create({
        title: newTaskForm.title,
        description: newTaskForm.description,
        status: newTaskForm.status,
        priority: newTaskForm.priority,
        deadline: newTaskForm.deadline,
      });
      setIsNewTaskModalOpen(false);
      setNewTaskForm({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        type: 'Dashboard',
      });
      loadTasks();
    } catch (e) {
      console.error('Failed to create task', e);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      await api.tasks.update(task._id, { status: newStatus });
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.tasks.delete(id);
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleGroupCollapse = (key: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const inReviewTasks = filteredTasks.filter((t) => t.status === 'completed' && t.priority === 'medium');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed' && t.priority !== 'medium');

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Low
          </span>
        );
    }
  };

  const getTypeBadge = (title: string) => {
    const isMobile = title.toLowerCase().includes('darkmode') || title.toLowerCase().includes('settings') || title.toLowerCase().includes('admin');
    if (isMobile) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-amber-200 text-amber-700 bg-amber-50/70">
          Mobile App
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-purple-200 text-purple-700 bg-purple-50/70">
        Dashboard
      </span>
    );
  };

  const renderGroup = (
    groupKey: string,
    title: string,
    groupTasks: Task[],
    statusToAssign: TaskStatus
  ) => {
    const isCollapsed = collapsedGroups[groupKey];

    return (
      <div className="mb-6">
        {/* Group Header */}
        <div className="flex items-center justify-between py-2 border-b border-[#eaecf0] mb-1">
          <button
            onClick={() => toggleGroupCollapse(groupKey)}
            className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-indigo-600 transition"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>| {title}</span>
            <span className="text-[11px] font-semibold text-slate-400">
              {groupTasks.length}
            </span>
          </button>

          <button
            onClick={() => {
              setNewTaskForm((prev) => ({ ...prev, status: statusToAssign }));
              setIsNewTaskModalOpen(true);
            }}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
            title={`Add task to ${title}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Group Table */}
        {!isCollapsed && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] text-slate-400 font-semibold border-b border-[#f1f3f7]">
                  <th className="py-2.5 pl-4 font-medium">Task Name</th>
                  <th className="py-2.5 font-medium">Description</th>
                  <th className="py-2.5 font-medium">Estimation</th>
                  <th className="py-2.5 font-medium">Type</th>
                  <th className="py-2.5 font-medium">People</th>
                  <th className="py-2.5 font-medium">Priority</th>
                  <th className="py-2.5 pr-3 w-8 text-right">+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f8fa] text-xs">
                {groupTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-[#f8f9fb] transition-colors group"
                  >
                    {/* Task Name */}
                    <td className="py-3 pl-4 pr-4 font-medium text-slate-900 min-w-[180px]">
                      <span className={task.status === 'completed' ? 'line-through text-slate-400' : ''}>
                        {task.title}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 pr-4 text-slate-500 max-w-xs truncate min-w-[220px]">
                      {task.description || '-'}
                    </td>

                    {/* Estimation */}
                    <td className="py-3 pr-4 text-slate-500 min-w-[160px] whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {task.deadline
                            ? `${format(new Date(task.deadline), 'MMM d, yyyy')} - ${format(
                                new Date(task.createdAt),
                                'MMM d'
                              )}`
                            : 'Feb 14, 2024 - Feb 1, 2024'}
                        </span>
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3 pr-4 min-w-[110px]">
                      {getTypeBadge(task.title)}
                    </td>

                    {/* People Avatars */}
                    <td className="py-3 pr-4 min-w-[90px]">
                      <div className="flex items-center -space-x-1.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center border border-white">
                          AL
                        </span>
                        <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-bold flex items-center justify-center border border-white">
                          DT
                        </span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 pr-4 min-w-[100px]">
                      {getPriorityBadge(task.priority)}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3 pr-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {groupTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-3 text-center text-slate-400 italic text-[11px]">
                      No tasks in this section. Click + to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
      {/* 1. Project Title & Invite Header (Matching Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3.5">
          {/* Square Blue 'C' Icon Badge */}
          <div className="w-11 h-11 rounded-2xl bg-[#5244e4] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            C
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Craftboard Project
            </h1>
          </div>
        </div>

        {/* Member Avatars & Invite Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center border-2 border-white shadow-xs">
              AL
            </span>
            <span className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold flex items-center justify-center border-2 border-white shadow-xs">
              DT
            </span>
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold flex items-center justify-center border-2 border-white shadow-xs">
              JS
            </span>
          </div>

          <button
            onClick={() => alert('Invite link copied to clipboard!')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#eaecf0] hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-xs transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* 2. View Switcher Tabs & Action Toolbar (Matching Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#eaecf0] mb-6">
        {/* Left: Kanban | Timeline | List */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 pb-2 transition relative ${
              viewMode === 'kanban' ? 'text-slate-900 font-bold' : 'hover:text-slate-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban</span>
            {viewMode === 'kanban' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-slate-900" />
            )}
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 pb-2 transition relative ${
              viewMode === 'timeline' ? 'text-slate-900 font-bold' : 'hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
            {viewMode === 'timeline' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-slate-900" />
            )}
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 pb-2 transition relative ${
              viewMode === 'list' ? 'text-slate-900 font-bold' : 'hover:text-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
            {viewMode === 'list' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-slate-900" />
            )}
          </button>
        </div>

        {/* Right: Search, Filter, + New Task */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#eaecf0] text-xs bg-[#fafbfc] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-44 transition"
            />
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none pl-7 pr-6 py-1.5 rounded-xl border border-[#eaecf0] text-xs bg-[#fafbfc] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="all">Filter</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 3. Main Content: Grouped List View or Kanban View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {renderGroup('todo', 'To-do', todoTasks, 'pending')}
          {renderGroup('progress', 'On Progress', inProgressTasks, 'in-progress')}
          {renderGroup('review', 'In Review', inReviewTasks, 'completed')}
          {renderGroup('done', 'Completed', completedTasks, 'completed')}
        </div>
      )}

      {/* Kanban Board View Toggle */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* To-Do Column */}
          <div className="bg-[#f8f9fb] p-4 rounded-2xl border border-[#eaecf0]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                To-Do ({todoTasks.length})
              </span>
              <button
                onClick={() => {
                  setNewTaskForm((prev) => ({ ...prev, status: 'pending' }));
                  setIsNewTaskModalOpen(true);
                }}
                className="p-1 hover:bg-white rounded transition"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              {todoTasks.map((t) => (
                <div
                  key={t._id}
                  className="p-3.5 bg-white rounded-xl border border-[#eaecf0] shadow-xs space-y-2.5"
                >
                  <p className="font-medium text-xs text-slate-900">{t.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{t.description || '-'}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    {getTypeBadge(t.title)}
                    {getPriorityBadge(t.priority)}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleStatusChange(t, 'in-progress')}
                      className="text-[10px] text-indigo-600 hover:underline font-semibold"
                    >
                      Move to Progress &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On Progress Column */}
          <div className="bg-[#f8f9fb] p-4 rounded-2xl border border-[#eaecf0]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                On Progress ({inProgressTasks.length})
              </span>
              <button
                onClick={() => {
                  setNewTaskForm((prev) => ({ ...prev, status: 'in-progress' }));
                  setIsNewTaskModalOpen(true);
                }}
                className="p-1 hover:bg-white rounded transition"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((t) => (
                <div
                  key={t._id}
                  className="p-3.5 bg-white rounded-xl border border-[#eaecf0] shadow-xs space-y-2.5"
                >
                  <p className="font-medium text-xs text-slate-900">{t.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{t.description || '-'}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    {getTypeBadge(t.title)}
                    {getPriorityBadge(t.priority)}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between">
                    <button
                      onClick={() => handleStatusChange(t, 'pending')}
                      className="text-[10px] text-slate-500 hover:underline"
                    >
                      &larr; To-do
                    </button>
                    <button
                      onClick={() => handleStatusChange(t, 'completed')}
                      className="text-[10px] text-emerald-600 hover:underline font-semibold"
                    >
                      Complete &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Review / Completed Column */}
          <div className="bg-[#f8f9fb] p-4 rounded-2xl border border-[#eaecf0]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                In Review / Done ({inReviewTasks.length + completedTasks.length})
              </span>
            </div>
            <div className="space-y-3">
              {[...inReviewTasks, ...completedTasks].map((t) => (
                <div
                  key={t._id}
                  className="p-3.5 bg-white rounded-xl border border-[#eaecf0] shadow-xs space-y-2.5 opacity-90"
                >
                  <p className="font-medium text-xs text-slate-900 line-through text-slate-400">
                    {t.title}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{t.description || '-'}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    {getTypeBadge(t.title)}
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline View Placeholder */}
      {viewMode === 'timeline' && (
        <div className="py-12 text-center bg-[#f8f9fb] rounded-2xl border border-[#eaecf0]">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Sprint Timeline</p>
          <p className="text-xs text-slate-400 mt-1">Feb 14, 2024 &mdash; Feb 1, 2025</p>
        </div>
      )}

      {/* 4. New Task Modal (with Integrated Voice Dictation) */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl p-6 sm:p-7 max-w-lg w-full animate-fade-in relative">
            <button
              onClick={() => setIsNewTaskModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Create New Task</h3>
            <p className="text-xs text-slate-500 mb-5">
              Add a new task to Craftboard Project or dictate with your microphone.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Task Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Employee Details"
                    value={newTaskForm.title}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eaecf0] text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={speech.isListening ? speech.stopListening : speech.startListening}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition ${
                      speech.isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                    }`}
                    title={speech.isListening ? 'Stop dictation' : 'Dictate with voice'}
                  >
                    {speech.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                {speech.isListening && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium animate-pulse">
                    Listening... Speak task details clearly.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Create a page where there is information about employees"
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eaecf0] text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, priority: e.target.value as TaskPriority })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs bg-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Stage
                  </label>
                  <select
                    value={newTaskForm.status}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, status: e.target.value as TaskStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs bg-white focus:outline-none"
                  >
                    <option value="pending">To-do</option>
                    <option value="in-progress">On Progress</option>
                    <option value="completed">In Review / Done</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-slate-800 text-white shadow-sm transition"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
