import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import { Task } from '../types';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Mic, MicOff, Save, Trash2, Menu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Speech Hooks
  const titleSpeech = useSpeechToText();
  const descSpeech = useSpeechToText();

  useEffect(() => {

  }, []);

  // Update form when speech transcript changes
  useEffect(() => {
    if (titleSpeech.transcript) {
      setFormData(prev => ({ ...prev, title: prev.title + (prev.title ? ' ' : '') + titleSpeech.transcript }));
      titleSpeech.resetTranscript();
    }
  }, [titleSpeech.transcript]);

  useEffect(() => {
    if (descSpeech.transcript) {
      setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? ' ' : '') + descSpeech.transcript }));
      descSpeech.resetTranscript();
    }
  }, [descSpeech.transcript]);





  const handleCreateNew = () => {
    setSelectedTask(null);
    setFormData({ title: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (selectedTask) {
        // Update
        const updated = await api.tasks.update(selectedTask._id, formData);
        setSelectedTask(updated);
      } else {
        // Create
        const created = await api.tasks.create(formData);
        setSelectedTask(created);
      }
      alert('Task saved successfully!');
    } catch (err) {
      alert('Failed to save task');
    }
  };

  const handleDelete = async () => {
    if (!selectedTask || !confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.tasks.delete(selectedTask._id);
      handleCreateNew();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 h-full overflow-y-auto bg-slate-50 relative w-full">
        {/* Mobile Header for Menu */}
        <div className="md:hidden p-4 flex items-center bg-surface border-b border-slate-200 sticky top-0 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-2 font-bold text-slate-800">
            {selectedTask ? 'Edit Task' : 'New Task'}
          </h1>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-8">
          <div className="bg-surface rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedTask ? 'Task Details' : 'Create New Task'}
              </h2>
              {selectedTask && (
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Task Title
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="flex-1 rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Review Q3 Marketing Plan"
                  />
                  {titleSpeech.hasRecognition && (
                    <button
                      type="button"
                      onClick={titleSpeech.isListening ? titleSpeech.stopListening : titleSpeech.startListening}
                      className={`p-2 rounded-lg transition-colors ${titleSpeech.isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      title="Speak to type title"
                    >
                      {titleSpeech.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    rows={8}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border-slate-300 border px-4 py-2 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Add details about this task..."
                  />
                  {descSpeech.hasRecognition && (
                    <button
                      type="button"
                      onClick={descSpeech.isListening ? descSpeech.stopListening : descSpeech.startListening}
                      className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${descSpeech.isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      title="Speak to type description"
                    >
                      {descSpeech.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-primary hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;