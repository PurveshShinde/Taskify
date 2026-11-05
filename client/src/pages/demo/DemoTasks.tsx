import React, { useState, useEffect } from 'react';
import { Task, TaskPriority } from '../../types';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import {
  Mic,
  MicOff,
  Plus,
  Search,
  Trash2,
  Sparkles
} from 'lucide-react';

const DemoTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskify_isolated_demo_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const speech = useSpeechToText();

  useEffect(() => {
    localStorage.setItem('taskify_isolated_demo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (speech.transcript) {
      setTitle((prev) => (prev ? `${prev} ${speech.transcript}` : speech.transcript));
      speech.resetTranscript();
    }
  }, [speech.transcript]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      _id: 'dt-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
      priority,
      deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      userId: 'demo-user-id',
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle('');
    setDescription('');
  };

  const handleToggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === id
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks &amp; To-Do List</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hands-free voice dictation &bull; Real-time task manager
          </p>
        </div>
      </div>

      {/* Voice Dictation Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eaecf0] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Dictate
            </h2>
          </div>
          <button
            type="button"
            onClick={() => (speech.isListening ? speech.stopListening() : speech.startListening())}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              speech.isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {speech.isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{speech.isListening ? 'Listening...' : 'Dictate with Voice'}</span>
          </button>
        </div>

        <form onSubmit={handleAddTask} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title or speak aloud..."
              className="flex-1 px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="px-3 py-2 rounded-xl border border-[#eaecf0] text-xs font-medium bg-white focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#eaecf0] bg-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-[#eaecf0] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#eaecf0] text-slate-400 text-xs">
            No tasks found. Dictate or add one above!
          </div>
        ) : (
          filtered.map((task) => (
            <div
              key={task._id}
              className="p-3.5 rounded-2xl bg-white border border-[#eaecf0] shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleToggleStatus(task._id)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <p
                    className={`text-xs font-semibold text-slate-900 ${
                      task.status === 'completed' ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                    task.priority === 'high'
                      ? 'bg-rose-50 text-rose-700'
                      : task.priority === 'medium'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {task.priority}
                </span>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="p-1 text-slate-300 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DemoTasks;
