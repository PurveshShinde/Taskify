import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Mail,
  Calendar,
  Edit2,
  Check,
  X,
  Loader,
  Bell,
  Lock,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

const Settings: React.FC = () => {
  const { user, logout, updateUser } = useAuth();

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSuccessMessage, setNameSuccessMessage] = useState('');

  // Notification Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [workspaceDigest, setWorkspaceDigest] = useState(true);

  // Password Change State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setEditName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!editName.trim() || editName === user?.name) {
      setIsEditingName(false);
      setEditName(user?.name || '');
      return;
    }

    setIsSavingName(true);
    try {
      const updatedUser = await api.users.updateProfile({ name: editName.trim() });
      updateUser(updatedUser);
      setIsEditingName(false);
      setNameSuccessMessage('Name updated successfully');
      setTimeout(() => setNameSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Update failed', error);
      alert('Failed to update name: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setPasswordMessage('Please enter a new password');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setPasswordMessage('Password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage('');
    try {
      await api.auth.changePassword(password);
      setPasswordMessage('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPasswordMessage('Failed to update password: ' + (e.message || 'Please try again'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Are you sure? This will permanently delete your account and all data. This action cannot be undone.'
      )
    ) {
      return;
    }

    const userInput = window.prompt("Type 'DELETE' to confirm:");
    if (userInput !== 'DELETE') return;

    try {
      await api.auth.deleteAccount();

      const { auth } = await import('../../config/firebase');
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }

      logout();
      alert('Your account has been deleted.');
    } catch (err: any) {
      console.error('Delete Error:', err);
      if (err.code === 'auth/requires-recent-login') {
        alert('Security Check: Please log out and log in again, then try deleting your account.');
      } else {
        alert('Failed to delete account: ' + (err.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Settings &amp; Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal details, preferences, security, and account credentials
        </p>
      </div>

      {/* SECTION 1: Personal Profile Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#eaecf0] overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 h-24 sm:h-28 relative" />

        <div className="px-6 sm:px-8 pb-7">
          <div className="relative -mt-10 sm:-mt-12 mb-4">
            <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-md inline-block">
              <div className="w-full h-full bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-600">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
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
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-lg font-bold text-slate-900 border border-[#eaecf0] rounded-xl px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#fafbfc]"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isSavingName}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                      title="Save name"
                    >
                      {isSavingName ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditName(user?.name || '');
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {user?.name || 'Taskify User'}
                    </h2>
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        setEditName(user?.name || '');
                      }}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer"
                      title="Edit name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {nameSuccessMessage && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {nameSuccessMessage}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 font-medium">Taskify Workspace Member</p>
            </div>

            {/* Profile Info Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 bg-[#fafbfc] border border-[#eaecf0] rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#eaecf0] flex items-center justify-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Email Address</p>
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-[#fafbfc] border border-[#eaecf0] rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#eaecf0] flex items-center justify-center text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Member Since</p>
                  <p className="text-xs font-semibold text-slate-900">
                    {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently joined'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Notification Preferences */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#eaecf0] p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Notification Alerts</h3>
            <p className="text-[11px] text-slate-400">Configure how and when you receive task reminders</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-[#fafbfc] rounded-2xl border border-[#eaecf0]">
            <div>
              <p className="text-xs font-semibold text-slate-900">Email Task Alerts</p>
              <p className="text-[11px] text-slate-500">
                Receive notifications when deadlines are due within 24 hours
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#fafbfc] rounded-2xl border border-[#eaecf0]">
            <div>
              <p className="text-xs font-semibold text-slate-900">Workspace Activity Digest</p>
              <p className="text-[11px] text-slate-500">
                Daily summary of team discussions, sprint progress, and completed tasks
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={workspaceDigest}
                onChange={(e) => setWorkspaceDigest(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 3: Security & Password */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#eaecf0] p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Security &amp; Password</h3>
            <p className="text-[11px] text-slate-400">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-3.5 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#eaecf0] rounded-xl px-3.5 py-2 text-xs bg-[#fafbfc] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#eaecf0] rounded-xl px-3.5 py-2 text-xs bg-[#fafbfc] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {passwordMessage && (
            <p
              className={`text-xs font-medium ${
                passwordMessage.includes('success') ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {passwordMessage}
            </p>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: Danger Zone */}
      <div className="bg-white rounded-3xl shadow-xs border border-rose-200/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-rose-700 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Delete Account</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
              Permanently remove your account, profile details, and all associated personal task history. This action cannot be reversed.
            </p>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition border border-rose-200 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
