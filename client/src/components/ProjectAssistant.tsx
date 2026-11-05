import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface ProjectAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectAssistant: React.FC<ProjectAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Taskify Assistant. I can help organize tasks, break down complex milestones, or suggest priorities for your Craftboard Project. How can I help today?",
      sender: 'bot',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botResponse = generateResponse(userMsg.text);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' },
      ]);
    }, 800);
  };

  const generateResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('project') || lower.includes('craftboard')) {
      return "For the Craftboard Project, focus on the 3 'On Progress' items first—especially the Super Admin Role. Once completed, your sprint velocity will hit 90%.";
    }
    if (lower.includes('task') || lower.includes('todo')) {
      return "You can dictate tasks with your microphone anywhere using the Web Speech API! Try saying 'Schedule quarterly sprint review and set priority high'.";
    }
    if (lower.includes('hello') || lower.includes('hi')) {
      return 'Hello! Ready to streamline your workspace? Ask me to break down any goal into actionable steps.';
    }
    return "Noted! I've analyzed your current task distribution across Craftboard Project and updated your productivity metrics.";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="w-full h-full bg-white flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#0f172a] p-3.5 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2 font-semibold text-xs tracking-tight">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Taskify AI Assistant</span>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/10 p-1 rounded-lg text-slate-400 hover:text-white transition"
              title="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafbfc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0f172a] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-[#eaecf0] shadow-xs rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-[#eaecf0] flex items-center gap-2 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask assistant to organize or prioritize..."
              className="flex-1 bg-[#f4f5f8] border border-[#eaecf0] rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#0f172a] text-white p-2 rounded-xl hover:bg-slate-800 transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectAssistant;
