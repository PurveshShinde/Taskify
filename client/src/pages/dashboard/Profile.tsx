import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Calendar, Trash2, Edit2, Check, X, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../services/api';

const Profile: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.name) {
            setEditName(user.name);
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        if (!editName.trim() || editName === user?.name) {
            setIsEditing(false);
            setEditName(user?.name || '');
            return;
        }

        setIsLoading(true);
        try {
            const updatedUser = await api.users.updateProfile({ name: editName });
            updateUser(updatedUser);
            setIsEditing(false);
        } catch (error: any) {
            console.error("Update failed", error);
            alert("Failed to update profile: " + (error.message || "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure? This will permanently delete your account and all data. This action cannot be undone.")) {
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
            alert("Your account has been deleted.");
        } catch (err: any) {
            console.error("Delete Error:", err);
            if (err.code === 'auth/requires-recent-login') {
                alert("Security Check: Please log out and log in again, then try deleting your account.");
            } else {
                alert("Failed to delete account: " + (err.message || 'Unknown error'));
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">My Profile</h1>

            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-slate-200 dark:border-dark-600 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 mb-6">
                        <div className="w-24 h-24 bg-white dark:bg-dark-800 rounded-full p-1 shadow-lg inline-block">
                            <div className="w-full h-full bg-slate-100 dark:bg-dark-700 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400">
                                {user?.name?.charAt(0) || '?'}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="text-2xl font-bold text-slate-900 border border-slate-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleUpdateProfile}
                                            disabled={isLoading}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        >
                                            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditName(user?.name || '');
                                            }}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {user?.name || 'User'}
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditName(user?.name || '');
                                            }}
                                            className="text-slate-400 hover:text-indigo-600 transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">Taskify Member</p>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-700/50 rounded-lg">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Email</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-700/50 rounded-lg">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Joined</p>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        {user?.createdAt ? format(new Date(user.createdAt), 'PPP') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-900/30"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default Profile;