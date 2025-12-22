
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Team, Task, ChatMessage } from '../../types';
import { Users, Send, MessageSquare, CheckSquare, Plus, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

const TeamDetails: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Invite State
  const [inviteEmail, setInviteEmail] = useState('');
  
  // Task State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if(teamId) {
        loadTeamData();
        const interval = setInterval(loadChat, 3000); // Poll chat every 3s
        return () => clearInterval(interval);
    }
  }, [teamId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadTeamData = async () => {
      try {
          const t = await api.teams.getById(teamId!);
          if(!t) { navigate('/dashboard/teams'); return; }
          setTeam(t);
          loadChat();
          loadTasks();
      } catch(e) { console.error(e); }
  };

  const loadChat = async () => {
      if(!teamId) return;
      const msgs = await api.teams.getChats(teamId);
      setMessages(msgs);
  };

  const loadTasks = async () => {
      if(!teamId) return;
      const t = await api.tasks.getAll(teamId);
      setTasks(t);
  };

  const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newMessage.trim()) return;
      await api.teams.sendChat(teamId!, newMessage);
      setNewMessage('');
      loadChat();
  };

  const handleInvite = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.teams.invite(teamId!, inviteEmail);
          setInviteEmail('');
          alert('Member invited successfully');
          loadTeamData();
      } catch(e: any) { alert(e.message); }
  };

  const createTask = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.tasks.create({ title: newTaskTitle, teamId });
          setNewTaskTitle('');
          loadTasks();
      } catch(e) { alert('Failed'); }
  };

  if(!team) return <div>Loading...</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" />
                    {team.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {team.members.map((m: any) => m.name || m.email).join(', ')}
                </p>
            </div>
            
            <form onSubmit={handleInvite} className="flex gap-2">
                <input 
                    value={inviteEmail} 
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="Invite member by email..."
                    className="border border-slate-300 dark:border-dark-600 rounded-lg px-3 py-1.5 text-sm dark:bg-dark-700 dark:text-white outline-none focus:border-primary"
                />
                <button type="submit" className="bg-slate-800 dark:bg-slate-700 text-white p-2 rounded-lg hover:bg-slate-700 transition">
                    <UserPlus className="w-4 h-4" />
                </button>
            </form>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-dark-600 mb-4">
            <button 
                onClick={() => setActiveTab('chat')}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition border-b-2 ${activeTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
                <MessageSquare className="w-4 h-4" /> Discussion
            </button>
            <button 
                onClick={() => setActiveTab('tasks')}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition border-b-2 ${activeTab === 'tasks' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
                <CheckSquare className="w-4 h-4" /> Team Tasks
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-dark-800 rounded-xl border border-slate-200 dark:border-dark-600 shadow-sm overflow-hidden relative">
            
            {/* CHAT TAB */}
            {activeTab === 'chat' && (
                <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-slate-400 mt-10">Start the conversation!</div>
                        )}
                        {messages.map(msg => {
                             const isMe = msg.userId === api.auth.getCurrentUser()?._id;
                             return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[70%] rounded-xl p-3 ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 dark:bg-dark-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                                        <p className="text-xs opacity-70 mb-1 font-bold">{msg.userName}</p>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1">{format(new Date(msg.createdAt), 'h:mm a')}</span>
                                </div>
                             );
                        })}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="p-4 bg-slate-50 dark:bg-dark-900 border-t border-slate-200 dark:border-dark-600 flex gap-2">
                        <input 
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 rounded-full border border-slate-300 dark:border-dark-600 px-4 py-2 text-sm dark:bg-dark-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button type="submit" className="bg-primary text-white p-2 rounded-full hover:bg-indigo-700 transition">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* TASKS TAB */}
            {activeTab === 'tasks' && (
                <div className="absolute inset-0 flex flex-col p-6 overflow-y-auto">
                    <form onSubmit={createTask} className="flex gap-2 mb-6">
                         <input 
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            placeholder="Add a task for the team..."
                            className="flex-1 border border-slate-300 dark:border-dark-600 rounded-lg px-4 py-2 dark:bg-dark-700 dark:text-white outline-none focus:border-primary"
                         />
                         <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add
                         </button>
                    </form>

                    <div className="space-y-2">
                        {tasks.map(t => (
                            <div key={t._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-700/50 rounded-lg border border-slate-100 dark:border-dark-600">
                                <span className="text-slate-800 dark:text-white">{t.title}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {t.status}
                                </span>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-slate-500 text-center mt-8">No tasks assigned to this team yet.</p>}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default TeamDetails;