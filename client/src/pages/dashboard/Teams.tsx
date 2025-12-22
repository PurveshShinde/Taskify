import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Team } from '../../types';
import { Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadTeams(); }, []);

  const loadTeams = async () => {
      try {
          const data = await api.teams.getAll();
          setTeams(data);
      } catch(e) { console.error(e); }
  };

  const createTeam = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.teams.create(newTeamName);
          setNewTeamName('');
          setShowCreate(false);
          loadTeams();
      } catch(e) { alert('Failed to create team'); }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Teams</h1>
                <p className="text-slate-500 dark:text-slate-400">Collaborate with your coworkers</p>
            </div>
            <button onClick={() => setShowCreate(!showCreate)} className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                <Plus className="w-5 h-5" />
                Create Team
            </button>
        </div>

        {showCreate && (
            <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-600 mb-8 animate-slide-in">
                <form onSubmit={createTeam} className="flex gap-4">
                    <input 
                      value={newTeamName} onChange={e => setNewTeamName(e.target.value)}
                      placeholder="Team Name" className="flex-1 border border-slate-300 dark:border-dark-600 p-2 rounded-lg bg-white dark:bg-dark-700 dark:text-white outline-none focus:ring-2 focus:ring-primary" required
                    />
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Create</button>
                </form>
            </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
                <div 
                    key={team._id} 
                    onClick={() => navigate(`/dashboard/teams/${team._id}`)}
                    className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-slate-200 dark:border-dark-600 shadow-sm cursor-pointer hover:shadow-md hover:border-primary/50 transition group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 group-hover:text-primary transition">
                            <Users className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                            {team.name}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-dark-700 px-2 py-1 rounded-full">
                            {team.members.length} members
                        </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Members:</p>
                        <div className="flex flex-wrap gap-2">
                            {team.members.slice(0, 4).map((m: any, idx) => (
                                <span key={idx} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-900">
                                    {m.name || m.email}
                                </span>
                            ))}
                            {team.members.length > 4 && (
                                <span className="text-xs bg-slate-100 dark:bg-dark-700 text-slate-500 px-2 py-1 rounded-md">
                                    +{team.members.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 dark:border-dark-700 text-sm text-slate-500 dark:text-slate-400 text-center">
                        Click to view discussions & tasks
                    </div>
                </div>
            ))}
            {teams.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-dark-800 rounded-xl border border-dashed border-slate-300 dark:border-dark-600">
                    No teams yet. Create one to start collaborating!
                </div>
            )}
        </div>
    </div>
  );
};

export default Teams;