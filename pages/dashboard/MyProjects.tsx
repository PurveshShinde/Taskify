import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Project, TaskPriority } from '../../types';
import { FolderPlus, Trash2, Calendar, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const MyProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<{
      title: string;
      description: string;
      priority: TaskPriority;
  }>({ title: '', description: '', priority: 'medium' });

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
       const data = await api.projects.getAll();
       setProjects(data);
    } catch(e) { console.error(e); }
  };

  const openCreateModal = () => {
      setEditingProject(null);
      setFormData({ title: '', description: '', priority: 'medium' });
      setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
      setEditingProject(project);
      setFormData({ 
          title: project.title, 
          description: project.description, 
          priority: project.priority 
      });
      setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
          await api.projects.update(editingProject._id, formData);
      } else {
          await api.projects.create(formData);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch(e) { alert('Operation failed'); }
  };

  const handleDelete = async (id: string) => {
      if(!confirm("Delete project?")) return;
      try {
          await api.projects.delete(id);
          loadProjects();
      } catch(e) { console.error(e); }
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-8">
           <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Projects</h2>
              <p className="text-slate-500 dark:text-slate-400">Manage your ongoing work</p>
           </div>
           <button onClick={openCreateModal} className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition">
               <FolderPlus className="w-5 h-5" /> New Project
           </button>
       </div>

       {isModalOpen && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
               <div className="bg-white dark:bg-dark-800 rounded-xl p-6 w-full max-w-md shadow-2xl border dark:border-dark-600">
                   <h3 className="text-xl font-bold mb-4 dark:text-white">{editingProject ? 'Edit Project' : 'Create Project'}</h3>
                   <form onSubmit={handleSubmit} className="space-y-4">
                       <input 
                         placeholder="Project Title" 
                         value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                         className="w-full border p-2 rounded-lg dark:bg-dark-700 dark:border-dark-600 dark:text-white" required
                       />
                       <textarea 
                         placeholder="Description" 
                         value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                         className="w-full border p-2 rounded-lg dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                       />
                       <select 
                         value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}
                         className="w-full border p-2 rounded-lg dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                       >
                           <option value="low">Low Priority</option>
                           <option value="medium">Medium Priority</option>
                           <option value="high">High Priority</option>
                       </select>
                       <div className="flex justify-end gap-2 pt-2">
                           <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400">Cancel</button>
                           <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingProject ? 'Update' : 'Create'}</button>
                       </div>
                   </form>
               </div>
           </div>
       )}

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {projects.map(project => (
               <div key={project._id} className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-light-200 dark:border-dark-600 shadow-sm hover:border-primary/50 transition group relative">
                   <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                       <button onClick={() => openEditModal(project)} className="text-slate-400 hover:text-blue-500">
                           <Edit2 className="w-5 h-5" />
                       </button>
                       <button onClick={() => handleDelete(project._id)} className="text-slate-400 hover:text-red-500">
                           <Trash2 className="w-5 h-5" />
                       </button>
                   </div>
                   <div className="flex justify-between items-start mb-4">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${project.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'} dark:bg-opacity-20`}>
                           <FolderPlus className="w-6 h-6" />
                       </div>
                   </div>
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{project.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                   <div className="flex items-center justify-between text-xs text-slate-400 border-t border-light-100 dark:border-dark-700 pt-4">
                       <div className="flex items-center gap-1">
                           <Calendar className="w-3 h-3" />
                           {format(new Date(project.createdAt), 'MMM d, yyyy')}
                       </div>
                       <span className="uppercase font-semibold tracking-wider">{project.status}</span>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

export default MyProjects;