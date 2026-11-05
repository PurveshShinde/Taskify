import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Team } from '../../types';
import { Users, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const data = await api.teams.getAll();
      setTeams(data);
    } catch (e) {
      console.error(e);
    }
  };

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.teams.create(newTeamName);
      setNewTeamName('');
      setShowCreate(false);
      loadTeams();
    } catch (e) {
      alert('Failed to create team');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Team Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Collaborate on shared projects, task boards, and team discussions
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team</span>
        </button>
      </div>

      {showCreate && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#eaecf0] mb-8 animate-slide-in">
          <form onSubmit={createTeam} className="flex flex-col sm:flex-row gap-3">
            <input
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="e.g. Design & Frontend Core"
              className="flex-1 border border-[#eaecf0] px-3.5 py-2 rounded-xl bg-[#fafbfc] focus:bg-white text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#0f172a] hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((team) => (
          <div
            key={team._id}
            onClick={() => navigate(`/dashboard/teams/${team._id}`)}
            className="bg-white p-5 rounded-2xl border border-[#eaecf0] shadow-xs cursor-pointer hover:shadow-md hover:border-slate-300 transition group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {team.name}
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                {team.members.length} members
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Contributors:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {team.members.slice(0, 4).map((m: any, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                  >
                    {m.name || m.email}
                  </span>
                ))}
                {team.members.length > 4 && (
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                    +{team.members.length - 4}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#f1f3f7] text-[11px] text-indigo-600 font-medium text-center">
              View discussions &amp; shared tasks &rarr;
            </div>
          </div>
        ))}

        {teams.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500 bg-white rounded-2xl border border-dashed border-[#eaecf0]">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-xs font-medium">No teams created yet. Start a workspace to collaborate!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
