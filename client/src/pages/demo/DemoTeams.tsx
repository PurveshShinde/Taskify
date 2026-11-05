import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  Send,
  UserPlus,
  Hash,
  X,
  Mail,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';

interface WorkspaceMember {
  id: string;
  name: string;
  role: string;
  email: string;
  initial: string;
  bg: string;
  status: 'online' | 'busy' | 'away';
  focus: string;
  isSelf?: boolean;
}

interface MessageReaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

interface TeamMessage {
  id: string;
  channelId: string;
  sender: string;
  senderId: string;
  text: string;
  time: Date;
  isSelf: boolean;
  reactions: MessageReaction[];
}

const INITIAL_MEMBERS: WorkspaceMember[] = [
  {
    id: 'u-1',
    name: 'Demo User (You)',
    role: 'Lead Product Designer',
    email: 'demo@taskify.app',
    initial: 'DU',
    bg: 'bg-indigo-600',
    status: 'online',
    focus: 'Reviewing Bento UI components & sprint backlog',
    isSelf: true
  },
  {
    id: 'u-2',
    name: 'Alice Smith',
    role: 'Frontend Lead',
    email: 'alice@taskify.app',
    initial: 'AS',
    bg: 'bg-emerald-600',
    status: 'online',
    focus: 'Super Admin Role permission guardrails & KPI charts'
  },
  {
    id: 'u-3',
    name: 'Bob Jones',
    role: 'Fullstack Dev',
    email: 'bob@taskify.app',
    initial: 'BJ',
    bg: 'bg-amber-600',
    status: 'online',
    focus: 'Real-time WebSocket event streams & database indexing'
  }
];

const INITIAL_CHANNELS = [
  { id: 'kudemo-general', name: 'kudemo-general', desc: 'Core workspace discussions & updates' },
  { id: 'design-sprint', name: 'design-sprint', desc: 'Bento UI prototypes & visual reviews' },
  { id: 'announcements', name: 'announcements', desc: 'Company news & milestone releases' }
];

const INITIAL_MESSAGES: TeamMessage[] = [
  {
    id: 'm-1',
    channelId: 'kudemo-general',
    sender: 'Alice Smith',
    senderId: 'u-2',
    text: 'Hey team! Welcome to the Kudemo Workspace. Reviewing the sprint deliverables and Craftboard Project board today.',
    time: new Date(Date.now() - 3600000 * 2),
    isSelf: false,
    reactions: [
      { emoji: '👋', count: 3, reactedByMe: true },
      { emoji: '🚀', count: 2, reactedByMe: false }
    ]
  },
  {
    id: 'm-2',
    channelId: 'kudemo-general',
    sender: 'Bob Jones',
    senderId: 'u-3',
    text: 'I verified the workflow velocity charts. The cumulative flow pipeline looks very clean and responsive!',
    time: new Date(Date.now() - 3600000 * 1),
    isSelf: false,
    reactions: [
      { emoji: '👍', count: 2, reactedByMe: true }
    ]
  },
  {
    id: 'm-3',
    channelId: 'design-sprint',
    sender: 'Alice Smith',
    senderId: 'u-2',
    text: 'Bento layout spacing is set to 16px-24px with soft neutral borders (#eaecf0). Ready for team feedback.',
    time: new Date(Date.now() - 3600000 * 3),
    isSelf: false,
    reactions: [
      { emoji: '🎨', count: 2, reactedByMe: false }
    ]
  },
  {
    id: 'm-4',
    channelId: 'announcements',
    sender: 'Bob Jones',
    senderId: 'u-3',
    text: 'Kudemo Workspace milestone 4 has officially launched with hands-free voice dictation!',
    time: new Date(Date.now() - 86400000),
    isSelf: false,
    reactions: [
      { emoji: '🎉', count: 4, reactedByMe: true }
    ]
  }
];

const DemoTeams: React.FC = () => {
  const [members, setMembers] = useState<WorkspaceMember[]>(INITIAL_MEMBERS);
  const [activeChannelId, setActiveChannelId] = useState<string>('kudemo-general');
  const [messages, setMessages] = useState<TeamMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Selected Member for Profile Inspection
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Product Designer');
  const [inviteEmail, setInviteEmail] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  const activeChannel = INITIAL_CHANNELS.find((c) => c.id === activeChannelId) || INITIAL_CHANNELS[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: TeamMessage = {
      id: 'm-' + Date.now(),
      channelId: activeChannelId,
      sender: 'Demo User',
      senderId: 'u-1',
      text: userText,
      time: new Date(),
      isSelf: true,
      reactions: []
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated Smart Teammate Response after 1.2s
    setTimeout(() => {
      const isAlice = Math.random() > 0.5;
      let replyText = 'Got it! Looking into this right away.';
      if (userText.toLowerCase().includes('review') || userText.toLowerCase().includes('pr')) {
        replyText = 'Reviewing the latest changes now. Code looks solid!';
      } else if (userText.toLowerCase().includes('task') || userText.toLowerCase().includes('project')) {
        replyText = 'Updated the Craftboard Project board with these details 👍';
      } else if (userText.toLowerCase().includes('hi') || userText.toLowerCase().includes('hello')) {
        replyText = 'Hey! Ready for today’s sprint check-in.';
      } else {
        replyText = `Great point! Let's align on this for the upcoming milestone.`;
      }

      const botReply: TeamMessage = {
        id: 'm-' + (Date.now() + 1),
        channelId: activeChannelId,
        sender: isAlice ? 'Alice Smith' : 'Bob Jones',
        senderId: isAlice ? 'u-2' : 'u-3',
        text: replyText,
        time: new Date(),
        isSelf: false,
        reactions: [{ emoji: '👍', count: 1, reactedByMe: false }]
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
        let updatedReactions: MessageReaction[];

        if (existingReaction) {
          if (existingReaction.reactedByMe) {
            // Remove user's reaction
            updatedReactions = msg.reactions
              .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, reactedByMe: false } : r))
              .filter((r) => r.count > 0);
          } else {
            // Add user's reaction
            updatedReactions = msg.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true } : r
            );
          }
        } else {
          // New reaction emoji
          updatedReactions = [...msg.reactions, { emoji, count: 1, reactedByMe: true }];
        }

        return { ...msg, reactions: updatedReactions };
      })
    );
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const initials = inviteName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'TM';

    const newMember: WorkspaceMember = {
      id: 'u-' + Date.now(),
      name: inviteName.trim(),
      role: inviteRole.trim() || 'Contributor',
      email: inviteEmail.trim() || `${inviteName.toLowerCase().replace(/\s+/g, '.')}@taskify.app`,
      initial: initials,
      bg: 'bg-purple-600',
      status: 'online',
      focus: 'Newly joined Kudemo Workspace'
    };

    setMembers((prev) => [...prev, newMember]);

    // Send automated welcome message in general channel
    const welcomeMsg: TeamMessage = {
      id: 'm-welcome-' + Date.now(),
      channelId: 'kudemo-general',
      sender: 'Kudemo Bot',
      senderId: 'bot',
      text: `🎉 Please welcome ${newMember.name} (${newMember.role}) to the Kudemo Workspace!`,
      time: new Date(),
      isSelf: false,
      reactions: [{ emoji: '🎉', count: 3, reactedByMe: true }]
    };

    setMessages((prev) => [...prev, welcomeMsg]);
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleDirectMessage = (member: WorkspaceMember) => {
    setSelectedMember(null);
    setInputText(`@${member.name} `);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Kudemo Workspace</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Team Stream
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Click members to inspect profile, switch channels, and collaborate in real-time
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Teammate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Channels & Clickable Members */}
        <div className="space-y-4">
          {/* Channels Bento Box */}
          <div className="bg-white rounded-2xl border border-[#eaecf0] p-4 space-y-3 shadow-xs">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Workspace Channels
            </h2>
            <div className="space-y-1">
              {INITIAL_CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeChannelId === ch.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ch.name}</span>
                  </div>
                  {activeChannelId === ch.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Members Bento Box (Fully Clickable) */}
          <div className="bg-white rounded-2xl border border-[#eaecf0] p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Members ({members.length})</span>
              </h2>
              <span className="text-[10px] text-slate-400">Click to view</span>
            </div>

            <div className="space-y-1.5">
              {members.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-[#eaecf0] hover:bg-slate-50 cursor-pointer transition select-none group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                      className={`w-8 h-8 rounded-xl ${m.bg} text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0`}
                    >
                      {m.initial}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition truncate">
                        {m.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{m.role}</p>
                    </div>
                  </div>

                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-2"
                    title="Online"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#eaecf0]/60 px-1">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All team communication and assigned task updates sync across the Kudemo Workspace.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eaecf0] shadow-xs flex flex-col h-[560px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#eaecf0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-slate-900">#{activeChannel.name}</span>
                <p className="text-[10px] text-slate-400">{activeChannel.desc}</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
              Live Stream &bull; {members.length} Active
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col group ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-700">{msg.sender}</span>
                  <span>&bull;</span>
                  <span>{format(new Date(msg.time), 'h:mm a')}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-2xs leading-relaxed relative ${
                    msg.isSelf
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-[#eaecf0] text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Reactions list and quick emoji trigger */}
                <div className="flex items-center gap-1 mt-1 px-1">
                  {msg.reactions.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleToggleReaction(msg.id, r.emoji)}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border transition cursor-pointer ${
                        r.reactedByMe
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-white text-slate-600 border-[#eaecf0] hover:bg-slate-50'
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span>{r.count}</span>
                    </button>
                  ))}

                  {/* Hover Quick Reaction Buttons */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition ml-1">
                    {['👍', '❤️', '🚀', '👀'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleToggleReaction(msg.id, emoji)}
                        className="p-1 text-[11px] hover:scale-125 transition rounded cursor-pointer"
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#eaecf0] flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${activeChannel.name}...`}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc] focus:bg-white"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs cursor-pointer"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* MODAL 1: Clickable Member Profile Inspector */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-sm w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl ${selectedMember.bg} text-white flex items-center justify-center font-bold text-base shadow-sm`}
                >
                  {selectedMember.initial}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedMember.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-[#fafbfc] p-3 rounded-xl border border-[#eaecf0]">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{selectedMember.email}</span>
              </div>

              <div className="space-y-1.5 bg-[#fafbfc] p-3 rounded-xl border border-[#eaecf0]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Current Sprint Focus</span>
                </p>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {selectedMember.focus}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Workspace Status:</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Online
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#eaecf0] flex justify-end gap-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-3.5 py-2 rounded-xl border border-[#eaecf0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => handleDirectMessage(selectedMember)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Message {selectedMember.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Invite Teammate */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#eaecf0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>Invite to Kudemo Workspace</span>
              </h2>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  required
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  placeholder="e.g. Senior QA Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. sarah@taskify.app"
                  className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc] focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#eaecf0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Add Teammate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoTeams;
