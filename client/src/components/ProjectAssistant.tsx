import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
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
    { id: '1', text: "Hi! I'm your Taskify Assistant. I can help you organize tasks, suggest project structures, or just chat about productivity. How can I help today?", sender: 'bot' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI delay
    setTimeout(() => {
      const botResponse = generateResponse(userMsg.text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const generateResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('project')) return "To start a new project, define your goals first. I suggest creating a 'Project Initiation' task list including: Scope Definition, Team Selection, and Initial Timeline.";
    if (lower.includes('task') || lower.includes('todo')) return "Breaking down tasks makes them manageable. Try the SMART criteria: Specific, Measurable, Achievable, Relevant, and Time-bound.";
    if (lower.includes('hello') || lower.includes('hi')) return "Hello there! Ready to get things done?";
    return "That's interesting! I recommend checking your Dashboard analytics to see how that fits into your current workflow productivity.";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-light-200 dark:border-dark-600 z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2 font-bold">
              <Bot className="w-6 h-6" />
              <span>Project Assistant</span>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-dark-900">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white dark:bg-dark-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-dark-600 rounded-bl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-dark-800 border-t border-light-200 dark:border-dark-600 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask for help..."
              className="flex-1 bg-slate-100 dark:bg-dark-700 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
            />
            <button type="submit" className="bg-primary text-white p-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-50" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectAssistant;