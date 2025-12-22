import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../services/api';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();

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
            <h1 className="text-3xl font-bold text-slate-800 mb-8">My Profile</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 mb-6">
                        <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg inline-block">
                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400">
                                {user?.name.charAt(0)}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                            <p className="text-slate-500">Taskify Member</p>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Email</p>
                                    <p className="font-medium text-slate-900">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Joined</p>
                                    <p className="font-medium text-slate-900">
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
                    className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default Profile;
