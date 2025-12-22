import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();

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
    </div>
  );
};

export default Profile;