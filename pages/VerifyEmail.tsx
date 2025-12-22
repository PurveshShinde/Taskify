
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) {
        setStatus('error');
        setMsg('Missing verification token');
        return;
    }

    const verify = async () => {
        try {
            await api.auth.verifyEmail(token);
            setStatus('success');
        } catch (e: any) {
            setStatus('error');
            setMsg(e.message || 'Verification failed');
        }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
            {status === 'verifying' && (
                <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <h2 className="text-xl font-bold text-slate-800">Verifying your email...</h2>
                </div>
            )}
            {status === 'success' && (
                <div className="space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-800">Email Verified!</h2>
                    <p className="text-slate-600">Your account has been successfully verified.</p>
                    <Link to="/auth?mode=signin" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
                        Proceed to Login <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
            {status === 'error' && (
                <div className="space-y-4">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-800">Verification Failed</h2>
                    <p className="text-red-500">{msg}</p>
                    <Link to="/auth?mode=signup" className="text-primary font-bold hover:underline">
                        Back to Signup
                    </Link>
                </div>
            )}
        </div>
    </div>
  );
};

export default VerifyEmail;
