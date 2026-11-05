import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, TaskPriority } from '../../types';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  CheckCircle2,
  Circle,
  Layers,
  ArrowRight,
  TrendingUp,
  FolderKanban
} from 'lucide-react';

interface DemoProjectItem extends Project {
  milestones?: { id: string; title: string; completed: boolean }[];
}

const INITIAL_PROJECTS: DemoProjectItem[] = [
  {
    _id: 'proj-1',
    title: 'Craftboard Project',
    description: 'Design system, Bento UI components, and core dashboard modules',
    status: 'active',
    priority: 'high',
    progress: 75,
    ownerId: 'demo-user-id',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    milestones: [
      { id: 'm1', title: 'Japanese Bento UI layout architecture', completed: true },
      { id: 'm2', title: 'Live speech-to-text integration', completed: true },
      { id: 'm3', title: 'Super Admin permissions and governance', completed: false },
      { id: 'm4', title: 'Multi-screen responsive testing', completed: false }
    ]
  },
  {
    _id: 'proj-2',
    title: 'Visionary Tasks',
    description: 'Product roadmap, voice dictation workflows, and task milestone tracking',
    status: 'active',
    priority: 'medium',
    progress: 40,
    ownerId: 'demo-user-id',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    milestones: [
      { id: 'm5', title: 'Voice transcription audio buffer setup', completed: true },
      { id: 'm6', title: 'Sprint backlog prioritization matrix', completed: false },
      { id: 'm7', title: 'Deadline countdown notification triggers', completed: false }
    ]
  },
  {
    _id: 'proj-3',
    title: 'Infrastructure Core',
    description: 'Database indexing, API throughput optimization, and session state hardening',
    status: 'active',
    priority: 'low',
    progress: 20,
    ownerId: 'demo-user-id',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    milestones: [
      { id: 'm8', title: 'Database connection pool optimization', completed: true },
      { id: 'm9', title: 'Token refresh and rate limiting policies', completed: false }
    ]
  },
  {
    _id: 'proj-4',
    title: 'Angular Studio',
    description: 'Component kit migration, velocity benchmark metrics, and UI design audit',
    status: 'active',
    priority: 'medium',
    progress: 60,
    ownerId: 'demo-user-id',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    milestones: [
      { id: 'm10', title: 'Design token parity check', completed: true },
      { id: 'm11', title: 'Velocity graph component refactor', completed: true },
      { id: 'm12', title: 'Lighthouse performance score 95+', completed: false }
    ]
  },
  {
    _id: 'proj-5',
    title: 'Kudemo Workspace',
    description: 'Real-time collaborative team stream, channel discussions, and member activity',
    status: 'active',
    priority: 'high',
    progress: 85,
    ownerId: 'demo-user-id',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    milestones: [
      { id: 'm13', title: 'Real-time collaborative chat channel setup', completed: true },
      { id: 'm14', title: 'Interactive member profile inspection', completed: true },
      { id: 'm15', title: 'Instant teammate invitation simulation', completed: true }
    ]
  }
];

const DemoProjects: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<DemoProjectItem[]>(() => {
    const saved = localStorage.getItem('taskify_isolated_demo_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If parsed projects contain old mock names like "Demotion" or "Cudemo", update with clean English
        const hasLegacyNames = parsed.some((p: any) =>
          p.title?.includes('Demotion') || p.title?.includes('Cudemo')
        );
        if (!hasLegacyNames && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
  });

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DemoProjectItem | null>(null);
  const [editingProject, setEditingProject] = useState<DemoProjectItem | null>(null);

  // Form States
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

  const saveProjects = (updated: DemoProjectItem[]) => {
    setProjects(updated);
    localStorage.setItem('taskify_isolated_demo_projects', JSON.stringify(updated));
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      progress: 0,
      status: 'active'
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (p: DemoProjectItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProject(p);
    setFormData({
      title: p.title,
      description: p.description || '',
      priority: p.priority,
      progress: p.progress || 0,
      status: (p.status as any) || 'active'
    });
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newProj: DemoProjectItem = {
      _id: 'proj-' + Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      progress: formData.progress,
      ownerId: 'demo-user-id',
      createdAt: new Date().toISOString(),
      milestones: [
        { id: 'm-' + Date.now() + '-1', title: 'Initial requirements analysis', completed: true },
        { id: 'm-' + Date.now() + '-2', title: 'Execution and verification sprint', completed: false }
      ]
    };

    saveProjects([newProj, ...projects]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !formData.title.trim()) return;

    const updated = projects.map((p) => {
      if (p._id === editingProject._id) {
        return {
          ...p,
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          progress: formData.progress,
          status: formData.status
        };
      }
      return p;
    });

    saveProjects(updated);

    // Also update selectedProject if currently viewing details
    if (selectedProject && selectedProject._id === editingProject._id) {
      setSelectedProject({
        ...selectedProject,
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        progress: formData.progress,
        status: formData.status
      });
    }

    setEditingProject(null);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to remove this project?')) return;
    const updated = projects.filter((p) => p._id !== id);
    saveProjects(updated);
    if (selectedProject?._id === id) {
      setSelectedProject(null);
    }
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    const updated = projects.map((p) => {
      if (p._id === projectId && p.milestones) {
        const updatedMilestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...p, milestones: updatedMilestones, progress: newProgress };
      }
      return p;
    });
    saveProjects(updated);

    if (selectedProject && selectedProject._id === projectId && selectedProject.milestones) {
      const updatedMilestones = selectedProject.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
      setSelectedProject({ ...selectedProject, milestones: updatedMilestones, progress: newProgress });
    }
  };

  const updateProgressSlider = (projectId: string, newProgress: number) => {
    const updated = projects.map((p) =>
      p._id === projectId ? { ...p, progress: newProgress } : p
    );
    saveProjects(updated);
    if (selectedProject && selectedProject._id === projectId) {
      setSelectedProject({ ...selectedProject, progress: newProgress });
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Kudemo Projects &amp; Workspaces</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {projects.length} Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any project to inspect milestones, adjust progress, or launch its task board
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => setSelectedProject(project)}
            className="p-5 rounded-2xl bg-white border border-[#eaecf0] shadow-xs flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition">
                    {project.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                      <span>{project.title}</span>
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          project.priority === 'high'
                            ? 'bg-rose-50 text-rose-700'
                            : project.priority === 'medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {project.priority} priority
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium capitalize">
                        &bull; {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Top Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => openEditModal(project, e)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                    title="Edit project details"
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

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided.'}
              </p>

              {/* Milestones count preview */}
              {project.milestones && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {project.milestones.filter((m) => m.completed).length} of {project.milestones.length} milestones complete
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Progress & Quick Action */}
            <div className="pt-4 mt-4 border-t border-[#eaecf0]/60 space-y-2">
              <div className="flex justify-between text-[11px] font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <span>Progress</span>
                </span>
                <span className="font-bold text-slate-800">{project.progress || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-indigo-600 font-semibold group-hover:translate-x-0.5 transition">
                <span>View details &amp; milestones</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Project Details & Milestone Management */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-fade-in">
            {/* Header */}
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

            {/* Description */}
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-[#eaecf0] text-xs text-slate-600 leading-relaxed">
              {selectedProject.description || 'No detailed description set for this project.'}
            </div>

            {/* Interactive Progress Bar & Presets */}
            <div className="space-y-2 bg-[#fafbfc] p-3.5 rounded-2xl border border-[#eaecf0]">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Completion Status</span>
                </span>
                <span className="text-sm font-bold text-indigo-600">{selectedProject.progress || 0}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={selectedProject.progress || 0}
                onChange={(e) => updateProgressSlider(selectedProject._id, Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">Quick adjust:</span>
                <div className="flex gap-1.5">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => updateProgressSlider(selectedProject._id, pct)}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition ${
                        selectedProject.progress === pct
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-[#eaecf0] hover:bg-slate-50'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Milestones Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sprint Milestones</span>
                </h4>
                <span className="text-[11px] text-slate-400">Click to check off</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {(selectedProject.milestones || []).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(selectedProject._id, m.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#eaecf0] bg-white hover:bg-slate-50 cursor-pointer transition select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          m.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800'
                        }`}
                      >
                        {m.title}
                      </span>
                    </div>
                  </div>
                ))}

                {(!selectedProject.milestones || selectedProject.milestones.length === 0) && (
                  <p className="text-xs text-slate-400 italic py-2 text-center">
                    No individual milestones defined.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedProject(null);
                  openEditModal(selectedProject);
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
                    navigate('/demo');
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

      {/* MODAL 2: Create Project */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-600" />
                <span>Create New Project</span>
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NextGen Web App"
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of deliverables, goals, and key stakeholders..."
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs font-medium focus:outline-none bg-[#fafbfc]"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({ ...formData, progress: Math.min(100, Math.max(0, Number(e.target.value))) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs font-medium focus:outline-none bg-[#fafbfc]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#eaecf0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Project */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-600" />
                <span>Edit Project</span>
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs font-medium focus:outline-none bg-[#fafbfc]"
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs font-medium focus:outline-none bg-[#fafbfc]"
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
                  onClick={() => setEditingProject(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#eaecf0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoProjects;
