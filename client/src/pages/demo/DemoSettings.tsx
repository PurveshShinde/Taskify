import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Calendar,
  Edit2,
  Check,
  X,
  Bell,
  ArrowRight,
  RotateCw,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

const DemoSettings: React.FC = () => {
  const navigate = useNavigate();

  // Profile Name State
  const [name, setName] = useState(() => {
    return localStorage.getItem('taskify_demo_user_name') || 'Demo User';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [nameSuccess, setNameSuccess] = useState('');

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    setName(tempName.trim());
    localStorage.setItem('taskify_demo_user_name', tempName.trim());
    setIsEditingName(false);
    setNameSuccess('Name saved in demo session');
    setTimeout(() => setNameSuccess(''), 3000);
  };

  const handleResetDemoData = () => {
    if (confirm('Reset demo tasks and projects back to initial sample state?')) {
      localStorage.removeItem('taskify_isolated_demo_tasks');
      localStorage.removeItem('taskify_isolated_demo_projects');
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Settings &amp; Profile</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Demo Sandbox
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure your demo profile, simulation alerts, and workspace preferences
          </p>
        </div>

        <button
          onClick={() => navigate('/auth?mode=signup')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <span>Create Real Account</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SECTION 1: Personal Profile Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#eaecf0] overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 h-24 sm:h-28 relative" />

        <div className="px-6 sm:px-8 pb-7">
          <div className="relative -mt-10 sm:-mt-12 mb-4">
            <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-md inline-block">
              <div className="w-full h-full bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-600">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-lg font-bold text-slate-900 border border-[#eaecf0] rounded-xl px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc]"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                      title="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setTempName(name);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{name}</h2>
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        setTempName(name);
                      }}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer"
                      title="Edit name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {nameSuccess && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {nameSuccess}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="font-medium text-slate-600">Lead Product Designer</span>
                <span>&bull;</span>
                <span>Kudemo Workspace</span>
                <span>&bull;</span>
                <span className="px-2 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-semibold">
                  Demo Session
                </span>
              </div>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 bg-[#fafbfc] border border-[#eaecf0] rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#eaecf0] flex items-center justify-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Demo Email</p>
                  <p className="text-xs font-semibold text-slate-900 truncate">demo@taskify.app</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-[#fafbfc] border border-[#eaecf0] rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#eaecf0] flex items-center justify-center text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Session</p>
                  <p className="text-xs font-semibold text-slate-900">
                    {format(new Date(), 'MMMM yyyy')} &bull; Instant Sandbox
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Notification & Simulation Preferences */}
      <div className="p-6 rounded-3xl bg-white border border-[#eaecf0] shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Simulation &amp; Alerts</h3>
            <p className="text-[11px] text-slate-400">Configure reminder frequencies and browser notifications</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#eaecf0] bg-[#fafbfc] cursor-pointer hover:bg-slate-50 transition">
            <div>
              <p className="text-xs font-semibold text-slate-900">Task Deadline Reminders</p>
              <p className="text-[11px] text-slate-400">Display desktop notification when task due date is within 30 minutes</p>
            </div>
            <input
              type="checkbox"
              checked={taskReminders}
              onChange={() => setTaskReminders(!taskReminders)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#eaecf0] bg-[#fafbfc] cursor-pointer hover:bg-slate-50 transition">
            <div>
              <p className="text-xs font-semibold text-slate-900">Workspace Activity Digest</p>
              <p className="text-[11px] text-slate-400">Simulate daily summary of sprint tasks and team messages</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#eaecf0] bg-[#fafbfc] cursor-pointer hover:bg-slate-50 transition">
            <div>
              <p className="text-xs font-semibold text-slate-900">Voice Dictation Audio Cues</p>
              <p className="text-[11px] text-slate-400">Play subtle audio ping when microphone begins and ends recording</p>
            </div>
            <input
              type="checkbox"
              checked={audioFeedback}
              onChange={() => setAudioFeedback(!audioFeedback)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* SECTION 3: Sandbox Data Management */}
      <div className="p-6 rounded-3xl bg-white border border-[#eaecf0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-slate-500" />
              <span>Reset Demo Sandbox</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-lg leading-relaxed">
              Restore all demo tasks, Kudemo Workspace channels, and projects back to their clean initial state.
            </p>
          </div>

          <button
            onClick={handleResetDemoData}
            className="px-4 py-2 rounded-xl border border-[#eaecf0] hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            Reset Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoSettings;
