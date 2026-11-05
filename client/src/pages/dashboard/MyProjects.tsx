import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Project, TaskPriority } from '../../types';
import {
  FolderPlus,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  TrendingUp,
  ArrowRight,
  FolderKanban
} from 'lucide-react';

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    progress: number;
    status: 'active' | 'completed';
  }>({
    title: '',
    description: '',
    priority: 'medium',
    progress: 0,
    status: 'active'
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      progress: 0,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      priority: project.priority,
      progress: project.progress || 0,
      status: (project.status as any) || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.projects.update(editingProject._id, formData);
        if (selectedProject && selectedProject._id === editingProject._id) {
          setSelectedProject({ ...selectedProject, ...formData });
        }
      } else {
        await api.projects.create(formData);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (e) {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.projects.delete(id);
      if (selectedProject?._id === id) {
        setSelectedProject(null);
      }
      loadProjects();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>My Projects &amp; Workspaces</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {projects.length} Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize ongoing initiatives, sprint roadmaps, and workspace deliverables
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Project Bento Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => setSelectedProject(project)}
            className="bg-white p-5 rounded-2xl border border-[#eaecf0] shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      project.priority === 'high'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    }`}
                  >
                    {project.title.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                          project.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {project.status}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        &bull; {project.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => openEditModal(project, e)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                    title="Edit project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(project._id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#eaecf0]/60 space-y-2">
              <div className="flex justify-between text-[11px] font-medium text-slate-500">
                <span>Progress</span>
                <span className="font-bold text-slate-800">{project.progress || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-indigo-600 font-semibold group-hover:translate-x-0.5 transition">
                <span>View project &amp; tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Project Details */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {selectedProject.title.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        selectedProject.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : selectedProject.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {selectedProject.priority} priority
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-[#eaecf0] text-xs text-slate-600 leading-relaxed">
              {selectedProject.description || 'No detailed description set for this project.'}
            </div>

            <div className="space-y-2 bg-[#fafbfc] p-3.5 rounded-2xl border border-[#eaecf0]">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Completion Status</span>
                </span>
                <span className="text-sm font-bold text-indigo-600">{selectedProject.progress || 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${selectedProject.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  const p = selectedProject;
                  setSelectedProject(null);
                  openEditModal(p);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#eaecf0] hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Project</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#eaecf0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    navigate('/dashboard');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <span>Open Kanban Board</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create / Edit Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-[#eaecf0] relative animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-600" />
                <span>{editingProject ? 'Edit Project' : 'Create Project'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title
                </label>
                <input
                  placeholder="e.g. Craftboard Project"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-[#eaecf0] px-3.5 py-2 rounded-xl text-xs bg-[#fafbfc] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Short description of deliverables..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-[#eaecf0] p-3 rounded-xl text-xs bg-[#fafbfc] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as TaskPriority })
                    }
                    className="w-full border border-[#eaecf0] px-3 py-2 rounded-xl text-xs bg-[#fafbfc] focus:bg-white focus:outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as any })
                    }
                    className="w-full border border-[#eaecf0] px-3 py-2 rounded-xl text-xs bg-[#fafbfc] focus:bg-white focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Progress
                  </label>
                  <span className="text-xs font-bold text-indigo-600">{formData.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3.5 py-2 rounded-xl border border-[#eaecf0] hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
