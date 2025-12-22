import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Team, Task, ChatMessage, User } from '../../types';
import { Users, Send, MessageSquare, CheckSquare, Plus, UserPlus, X, Trash2, Search, CheckCircle, Circle } from 'lucide-react';
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
            const interval = setInterval(loadChat, 3000); // Poll chat every 3s
            return () => clearInterval(interval);
        }
    }, [teamId]);

    // Optimized Scroll
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
            // Ensure we have correct user info first
            await api.auth.getMe().catch(console.error);

            const t = await api.teams.getById(teamId!);
            if (!t) { navigate('/dashboard/teams'); return; }
            setTeam(t);
            loadChat();
            loadTasks();
        } catch (e) { console.error(e); }
    };

    const loadChat = async () => {
        if (!teamId) return;
        try {
            const msgs = await api.teams.getChats(teamId);
            setMessages(prev => {
                if (prev.length !== msgs.length) return msgs;
                return prev;
            });
        } catch (e) { console.error("Chat load error", e); }
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
        } catch (e) { console.error("Failed to load users", e); }
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
            _id: Date.now().toString(), // Temporary ID
            text: newMessage,
            userId: currentUser?._id || '',
            userName: currentUser?.name || 'Me',
            createdAt: new Date().toISOString(),
            teamId
        };

        // Optimistic Update
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');

        // Scroll to bottom
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 10);

        try {
            await api.teams.sendChat(teamId, tempMsg.text);
            loadChat(); // Sync with server
        } catch (e) {
            console.error("Failed to send message");
            // Optional: Add error handling/toast here
        }
    };

    const handleInviteUser = async (email: string) => {
        setInviteLoading(true);
        try {
            await api.teams.invite(teamId!, email); // Or addMember if you changed the API
            await loadTeamData();
            alert('Member added successfully');
            setIsAddMemberOpen(false); // Close modal on success
        } catch (e: any) {
            alert(e.message || 'Failed to add member');
        } finally {
            setInviteLoading(false);
        }
    };

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            await api.tasks.create({ title: newTaskTitle, teamId });
            setNewTaskTitle('');
            loadTasks();
        } catch (e) { alert('Failed to create task'); }
    };

    const toggleTaskStatus = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));

        try {
            await api.tasks.update(task._id, { status: newStatus });
        } catch (e) {
            loadTasks(); // revert on fail
        }
    };

    const deleteTask = async (taskId: string) => {
        if (!window.confirm("Delete this task?")) return;
        setTasks(tasks.filter(t => t._id !== taskId));
        try {
            await api.tasks.delete(taskId);
        } catch (e) { loadTasks(); }
    };

    if (!team) return <div>Loading...</div>;

    const filteredUsers = allUsers.filter(u =>
        !team.members.some((m: any) => m.email === u.email) &&
        (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.includes(searchQuery.toLowerCase()))
    );

    const currentUser = api.auth.getCurrentUser();

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col relative">
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

                <button
                    onClick={handleOpenAddMember}
                    className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition flex items-center gap-2 text-sm"
                >
                    <UserPlus className="w-4 h-4" /> Add Member
                </button>
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
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-slate-400 mt-10">Start the conversation!</div>
                            )}
                            {messages.map((msg, index) => {
                                const currentUserId = currentUser?._id;
                                // Handle both string and object IDs safely
                                const msgUserId = typeof msg.userId === 'object' && msg.userId !== null
                                    ? (msg.userId as any)._id || (msg.userId as any).toString()
                                    : msg.userId;

                                const isMe = String(msgUserId) === String(currentUserId);

                                return (
                                    <div key={msg._id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[70%] rounded-xl p-3 ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 dark:bg-dark-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                                            <p className="text-xs opacity-70 mb-1 font-bold">{msg.userName}</p>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1">
                                            {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : '...'}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        {/* FIXED: Added 'items-center' to align button with input */}
                        <form onSubmit={sendMessage} className="p-4 bg-slate-50 dark:bg-dark-900 border-t border-slate-200 dark:border-dark-600 flex gap-2 items-center relative z-10">
                            <input
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border border-slate-300 dark:border-dark-600 px-4 py-2 text-sm dark:bg-dark-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button type="submit" className="bg-primary text-white p-2 rounded-full hover:bg-indigo-700 transition flex-shrink-0 shadow-sm">
                                <Send className="w-5 h-5" />
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
                                <div key={t._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-700/50 rounded-lg border border-slate-100 dark:border-dark-600 group">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => toggleTaskStatus(t)} className={`text-slate-400 hover:text-primary transition ${t.status === 'completed' ? 'text-green-500' : ''}`}>
                                            {t.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                        </button>
                                        <span className={`text-slate-800 dark:text-white ${t.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                                            {t.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {t.status}
                                        </span>
                                        <button onClick={() => deleteTask(t._id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {tasks.length === 0 && <p className="text-slate-500 text-center mt-8">No tasks assigned to this team yet.</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Member Modal */}
            {isAddMemberOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-dark-600 flex justify-between items-center">
                            <h3 className="font-bold text-lg dark:text-white">Add Team Member</h3>
                            <button onClick={() => setIsAddMemberOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white outline-none focus:border-primary"
                                />
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {filteredUsers.map(user => (
                                    <div key={user._id} className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-dark-700 rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                        <button
                                            disabled={inviteLoading}
                                            onClick={() => handleInviteUser(user._id)} // NOTE: Passing ID here, make sure your backend expects ID now
                                            className="text-primary hover:bg-primary/10 px-3 py-1 rounded text-xs font-medium transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <p className="text-center text-slate-500 text-sm py-4">No users found.</p>
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