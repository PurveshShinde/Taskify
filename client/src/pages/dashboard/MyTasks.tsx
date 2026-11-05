import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { Mic, MicOff, Plus, Calendar, Clock, CheckCircle2, CheckSquare, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Independent Speech Hooks
  const titleSpeech = useSpeechToText();
  const descSpeech = useSpeechToText();

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    deadline: string;
    status: TaskStatus;
    priority: TaskPriority;
  }>({
    title: '',
    description: '',
    deadline: '',
    status: 'pending',
    priority: 'medium',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  // AUTO-STOP LOGIC: Title
  useEffect(() => {
    if (titleSpeech.transcript) {
      setFormData((prev) => ({
        ...prev,
        title: prev.title + (prev.title ? ' ' : '') + titleSpeech.transcript,
      }));
      titleSpeech.resetTranscript();
      if (titleSpeech.isListening) {
        titleSpeech.stopListening();
      }
    }
  }, [titleSpeech.transcript, titleSpeech.isListening]);

  // AUTO-STOP LOGIC: Description
  useEffect(() => {
    if (descSpeech.transcript) {
      setFormData((prev) => ({
        ...prev,
        description: prev.description + (prev.description ? ' ' : '') + descSpeech.transcript,
      }));
      descSpeech.resetTranscript();
      if (descSpeech.isListening) {
        descSpeech.stopListening();
      }
    }
  }, [descSpeech.transcript, descSpeech.isListening]);

  const loadTasks = async () => {
    try {
      const data = await api.tasks.getAll();
      setTasks(data);
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      deadline: '',
      status: 'pending',
      priority: 'medium',
    });
    setShowForm(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
      status: task.status,
      priority: task.priority,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    try {
      if (editingTask) {
        await api.tasks.update(editingTask._id, formData);
      } else {
        await api.tasks.create(formData);
      }
      setShowForm(false);
      loadTasks();
    } catch (e) {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.tasks.delete(id);
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.tasks.update(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Todos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize personal tasks, set priority levels, and dictate with voice
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Task Form Modal / Expansion */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaecf0] mb-8 animate-slide-in">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field with Speech Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title
              </label>
              <div className="flex gap-2">
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="flex-1 border border-[#eaecf0] px-3.5 py-2 rounded-xl bg-[#fafbfc] focus:bg-white text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={
                    titleSpeech.isListening
                      ? titleSpeech.stopListening
                      : titleSpeech.startListening
                  }
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                    titleSpeech.isListening
                      ? 'bg-rose-50 text-rose-600 animate-pulse border border-rose-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Speech to Text"
                >
                  {titleSpeech.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Description Field with Speech Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional context or details..."
                  className="w-full border border-[#eaecf0] p-3 pr-10 rounded-xl bg-[#fafbfc] focus:bg-white text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={
                    descSpeech.isListening ? descSpeech.stopListening : descSpeech.startListening
                  }
                  className={`absolute top-2.5 right-2.5 p-1 rounded-lg transition ${
                    descSpeech.isListening
                      ? 'bg-rose-50 text-rose-600 animate-pulse'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Dictate Description"
                >
                  {descSpeech.isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 border border-[#eaecf0] px-3 py-2 rounded-xl bg-[#fafbfc]">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="outline-none text-xs text-slate-700 bg-transparent w-full"
                />
              </div>

              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="border border-[#eaecf0] px-3 py-2 rounded-xl bg-[#fafbfc] text-xs text-slate-700 outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="border border-[#eaecf0] px-3 py-2 rounded-xl bg-[#fafbfc] text-xs text-slate-700 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#eaecf0]">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`bg-white p-4 rounded-xl border border-[#eaecf0] flex items-center justify-between transition-all group ${
              task.status === 'completed'
                ? 'opacity-60 bg-slate-50/50'
                : 'hover:shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => toggleStatus(task)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  task.status === 'completed'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 text-transparent hover:border-indigo-600'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
              <div>
                <h3
                  className={`text-xs sm:text-sm font-semibold ${
                    task.status === 'completed'
                      ? 'line-through text-slate-400'
                      : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  {task.deadline && (
                    <p className="text-[11px] flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{format(new Date(task.deadline), 'MMM d, h:mm a')}</span>
                    </p>
                  )}
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      task.priority === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : task.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium capitalize ${
                  task.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : task.status === 'in-progress'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {task.status.replace('-', ' ')}
              </span>
              <button
                onClick={() => openEditForm(task)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#eaecf0]">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">No tasks yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
