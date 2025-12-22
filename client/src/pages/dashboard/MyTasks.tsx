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
    priority: 'medium'
  });

  useEffect(() => { loadTasks(); }, []);

  // ✅ AUTO-STOP LOGIC: Title
  useEffect(() => {
    if (titleSpeech.transcript) {
      // 1. Add text
      setFormData(prev => ({ ...prev, title: prev.title + (prev.title ? ' ' : '') + titleSpeech.transcript }));
      
      // 2. Clear buffer
      titleSpeech.resetTranscript();
      
      // 3. STOP LISTENING AUTOMATICALLY
      if (titleSpeech.isListening) {
        titleSpeech.stopListening(); 
      }
    }
  }, [titleSpeech.transcript, titleSpeech.isListening]); // Added isListening dependency

  // ✅ AUTO-STOP LOGIC: Description
  useEffect(() => {
    if (descSpeech.transcript) {
      setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? ' ' : '') + descSpeech.transcript }));
      descSpeech.resetTranscript();
      
      // STOP LISTENING AUTOMATICALLY
      if (descSpeech.isListening) {
        descSpeech.stopListening();
      }
    }
  }, [descSpeech.transcript, descSpeech.isListening]);

  const loadTasks = async () => {
    try {
      const data = await api.tasks.getAll();
      setTasks(data);
    } catch (e) { console.error(e); }
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', deadline: '', status: 'pending', priority: 'medium' });
    setShowForm(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
      status: task.status,
      priority: task.priority
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
    } catch (e) { alert('Operation failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.tasks.delete(id);
      loadTasks();
    } catch (e) { console.error(e); }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.tasks.update(task._id, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Todos</h1>
          <p className="text-slate-500 dark:text-slate-400">Keep track of your daily goals</p>
        </div>
        <button onClick={openCreateForm} className="bg-primary hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/20 transition">
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-light-200 dark:border-dark-600 mb-8 animate-slide-in">
          <h3 className="text-lg font-bold mb-4 dark:text-white">{editingTask ? 'Edit Task' : 'New Task'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div className="flex gap-2">
              <input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="What needs to be done?"
                className="flex-1 border border-light-300 dark:border-dark-600 p-3 rounded-lg bg-white dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                required
              />
              <button type="button" onClick={titleSpeech.isListening ? titleSpeech.stopListening : titleSpeech.startListening} className={`p-3 rounded-lg transition ${titleSpeech.isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-light-100 dark:bg-dark-700 text-slate-500 hover:bg-light-200'}`} title="Speech to Text">
                {titleSpeech.isListening ? <MicOff /> : <Mic />}
              </button>
            </div>

            {/* Description Field */}
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description..."
                className="w-full border border-light-300 dark:border-dark-600 p-3 pr-12 rounded-lg bg-white dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                rows={3}
              />
              <button
                type="button"
                onClick={descSpeech.isListening ? descSpeech.stopListening : descSpeech.startListening}
                className={`absolute top-2 right-2 p-2 rounded-lg transition ${descSpeech.isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-light-100 dark:hover:bg-dark-600'}`}
                title="Dictate Description"
              >
                {descSpeech.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 border border-light-300 dark:border-dark-600 p-2.5 rounded-lg bg-white dark:bg-dark-700">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  className="outline-none text-sm text-slate-600 dark:text-slate-300 bg-transparent w-full"
                />
              </div>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="border border-light-300 dark:border-dark-600 p-2.5 rounded-lg bg-white dark:bg-dark-700 dark:text-white outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="border border-light-300 dark:border-dark-600 p-2.5 rounded-lg bg-white dark:bg-dark-700 dark:text-white outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">Cancel</button>
              <button type="submit" className="bg-primary hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition">Save Task</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task._id} className={`bg-white dark:bg-dark-800 p-5 rounded-xl border border-light-200 dark:border-dark-600 flex items-center justify-between transition-all group ${task.status === 'completed' ? 'opacity-60 bg-light-50' : 'hover:shadow-md hover:border-primary/30'}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleStatus(task)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-primary'}`}>
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <div>
                <h3 className={`font-medium text-lg ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-800 dark:text-white'}`}>{task.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  {task.deadline && (
                    <p className={`text-xs flex items-center gap-1 ${new Date(task.deadline) < new Date() && task.status !== 'completed' ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <Clock className="w-3 h-3" />
                      {format(new Date(task.deadline), 'MMM d, h:mm a')}
                    </p>
                  )}
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-600' : task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize mr-2 ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600 dark:bg-dark-700 dark:text-slate-300'
                }`}>
                {task.status.replace('-', ' ')}
              </span>
              <button onClick={() => openEditForm(task)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(task._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-16">
            <CheckSquare className="w-16 h-16 text-slate-200 dark:text-dark-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No tasks yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;