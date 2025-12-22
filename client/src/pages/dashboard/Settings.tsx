import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Bell, Moon, Lock } from 'lucide-react';

const Settings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appAlerts, setAppAlerts] = useState(true);
  
  // Password Change State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if(password !== confirmPassword) {
          setMessage("Passwords do not match");
          return;
      }
      try {
          await api.auth.changePassword(password);
          setMessage("Password updated successfully");
          setPassword('');
          setConfirmPassword('');
      } catch(e) {
          setMessage("Failed to update password");
      }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Settings</h1>
      
      {/* Notifications */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-light-200 dark:border-dark-600">
          <div className="p-6 border-b border-light-200 dark:border-dark-600">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Notifications
              </h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">Email Alerts</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Receive emails for upcoming deadlines</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                  </div>
              </div>
          </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-light-200 dark:border-dark-600">
          <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" /> Security
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                      <input 
                        type="password" 
                        value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full border border-slate-300 dark:border-dark-500 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full border border-slate-300 dark:border-dark-500 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                  </div>
                  {message && <p className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
                      Change Password
                  </button>
              </form>
          </div>
      </div>
    </div>
  );
};

export default Settings;