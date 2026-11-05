import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Team, Task, ChatMessage, User } from '../../types';
import {
  Users,
  Send,
  MessageSquare,
  CheckSquare,
  Plus,
  UserPlus,
  X,
  Trash2,
  Search,
  CheckCircle,
  Circle,
} from 'lucide-react';
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Invite/Add Member State
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  // Task State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (teamId) {
      loadTeamData();
      const interval = setInterval(loadChat, 3000);
      return () => clearInterval(interval);
    }
  }, [teamId]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (messages.length > 0 && isNearBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadTeamData = async () => {
    try {
      await api.auth.getMe().catch(console.error);

      const t = await api.teams.getById(teamId!);
      if (!t) {
        navigate('/dashboard/teams');
        return;
      }
      setTeam(t);
      loadChat();
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const loadChat = async () => {
    if (!teamId) return;
    try {
      const msgs = await api.teams.getChats(teamId);
      setMessages((prev) => {
        if (prev.length !== msgs.length) return msgs;
        return prev;
      });
    } catch (e) {
      console.error('Chat load error', e);
    }
  };

  const loadTasks = async () => {
    if (!teamId) return;
    const t = await api.tasks.getAll(teamId);
    setTasks(t);
  };

  const loadUsers = async () => {
    try {
      const users = await api.users.getAll();
      setAllUsers(users);
    } catch (e) {
      console.error('Failed to load users', e);
    }
  };

  const handleOpenAddMember = () => {
    setIsAddMemberOpen(true);
    loadUsers();
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !teamId) return;

    const currentUser = api.auth.getCurrentUser();

    const tempMsg: ChatMessage = {
      _id: Date.now().toString(),
      text: newMessage,
      userId: currentUser?._id || '',
      userName: currentUser?.name || 'Me',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage('');

    try {
      await api.teams.sendChat(teamId, tempMsg.text);
      loadChat();
    } catch (e) {
      console.error('Send message failed', e);
    }
  };

  const handleInviteUser = async (userEmail: string) => {
    if (!teamId) return;
    setInviteLoading(true);
    try {
      await api.teams.invite(teamId, userEmail);
      setIsAddMemberOpen(false);
      loadTeamData();
    } catch (e) {
      alert('Failed to add member');
    } finally {
      setInviteLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !teamId) return;
    try {
      await api.tasks.create({ title: newTaskTitle, teamId, status: 'pending' });
      setNewTaskTitle('');
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    setTasks(tasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));
    try {
      await api.tasks.update(task._id, { status: newStatus });
    } catch (e) {
      loadTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) return;
    setTasks(tasks.filter((t) => t._id !== taskId));
    try {
      await api.tasks.delete(taskId);
    } catch (e) {
      loadTasks();
    }
  };

  if (!team) return <div className="p-8 text-center text-xs text-slate-400">Loading team...</div>;

  const filteredUsers = allUsers.filter(
    (u) =>
      !team.members.some((m: any) => m.email === u.email) &&
      (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.includes(searchQuery.toLowerCase()))
  );

  const currentUser = api.auth.getCurrentUser();

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>{team.name}</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {team.members.map((m: any) => m.name || m.email).join(', ')}
          </p>
        </div>

        <button
          onClick={handleOpenAddMember}
          className="inline-flex items-center gap-1.5 bg-[#0f172a] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#eaecf0] mb-5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 px-4 flex items-center gap-1.5 transition relative ${
            activeTab === 'chat'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Discussion Stream</span>
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 px-4 flex items-center gap-1.5 transition relative ${
            activeTab === 'tasks'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Team Tasks</span>
        </button>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-2xl border border-[#eaecf0] shadow-xs overflow-hidden relative min-h-[420px]">
        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="absolute inset-0 flex flex-col">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#fafbfc]">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 mt-16 text-xs">
                  No messages yet. Send an update to your team!
                </div>
              )}
              {messages.map((msg, index) => {
                const currentUserId = currentUser?._id;
                const msgUserId =
                  typeof msg.userId === 'object' && msg.userId !== null
                    ? (msg.userId as any)._id || (msg.userId as any).toString()
                    : msg.userId;

                const isMe = String(msgUserId) === String(currentUserId);

                return (
                  <div
                    key={msg._id || index}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#0f172a] text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-[#eaecf0] shadow-xs rounded-bl-xs'
                      }`}
                    >
                      <p className="text-[10px] opacity-70 mb-1 font-semibold">{msg.userName}</p>
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : ''}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={sendMessage}
              className="p-3 bg-white border-t border-[#eaecf0] flex gap-2 items-center"
            >
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a team message..."
                className="flex-1 rounded-xl border border-[#eaecf0] px-4 py-2 text-xs bg-[#fafbfc] focus:bg-white outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-[#0f172a] hover:bg-slate-800 text-white p-2 rounded-xl transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="absolute inset-0 flex flex-col p-6 overflow-y-auto bg-white">
            <form onSubmit={createTask} className="flex gap-2 mb-6">
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a task for the team..."
                className="flex-1 border border-[#eaecf0] rounded-xl px-4 py-2 text-xs bg-[#fafbfc] focus:bg-white outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="space-y-2">
              {tasks.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between p-3.5 bg-[#fafbfc] rounded-xl border border-[#eaecf0] group hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskStatus(t)}
                      className={`text-slate-400 hover:text-indigo-600 transition ${
                        t.status === 'completed' ? 'text-emerald-500' : ''
                      }`}
                    >
                      {t.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span
                      className={`text-xs font-medium ${
                        t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        t.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {t.status}
                    </span>
                    <button
                      onClick={() => deleteTask(t._id)}
                      className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-slate-400 text-center mt-12 text-xs">
                  No team tasks yet. Add one above!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#eaecf0] animate-fade-in">
            <div className="p-5 border-b border-[#eaecf0] flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900">Add Team Member</h3>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-9 pr-4 py-2 border border-[#eaecf0] rounded-xl text-xs bg-[#fafbfc] focus:bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-xl transition"
                  >
                    <div>
                      <p className="font-semibold text-xs text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                    <button
                      disabled={inviteLoading}
                      onClick={() => handleInviteUser(u.email)}
                      className="bg-[#0f172a] text-white hover:bg-slate-800 px-3 py-1 rounded-lg text-xs font-semibold transition"
                    >
                      Add
                    </button>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-center text-slate-400 text-xs py-6">No users found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
