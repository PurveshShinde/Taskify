
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Independent Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup');
    setError(''); // Clear error on mode switch
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // STRICT SIGNUP FLOW: Client-side only
        const { createUserWithEmailAndPassword, sendEmailVerification } = await import('firebase/auth');
        const { auth } = await import('../config/firebase'); // Dynamic import to avoid cycles/bundling issues if any

        const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
        await sendEmailVerification(userCredential.user);

        alert("Verification email sent to " + registerEmail + ". Please check your inbox and verify BEFORE logging in.");
        setIsSignUp(false); // Switch to login mode
        navigate('/auth?mode=signin');
      } else {
        // STRICT LOGIN FLOW: Verify Email First
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('../config/firebase');

        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

        // Force refresh to get latest claim if needed, but emailVerified property is usually up to date on fresh sign in
        if (!userCredential.user.emailVerified) {
          throw new Error("Please verify your email address before logging in. Check your inbox.");
        }

        const idToken = await userCredential.user.getIdToken();

        // Final secure step: Send to backend to get App JWT & create Shadow User
        const { user, token } = await api.auth.firebaseLogin(idToken);

        login(token, user);
        navigate('/dashboard/tasks');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Is the backend running?');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Please login.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = !isSignUp ? 'signup' : 'signin';
    navigate(`/auth?mode=${newMode}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px]"></div>
      </div>

      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-sm z-50 font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden relative z-10">

        {/* Sign In Form (Left Panel) */}
        <div className={`w-1/2 p-12 flex flex-col justify-center transition-all duration-500 absolute top-0 h-full ${isSignUp ? 'translate-x-full opacity-0 z-0' : 'left-0 opacity-100 z-10'}`}>
          <AuthForm
            mode="signin"
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            email={loginEmail} setEmail={setLoginEmail}
            password={loginPassword} setPassword={setLoginPassword}
          />
        </div>

        {/* Sign Up Form (Right Panel) */}
        <div className={`w-1/2 p-12 flex flex-col justify-center transition-all duration-500 absolute top-0 h-full ${isSignUp ? 'right-0 opacity-100 z-10' : '-translate-x-full opacity-0 z-0'}`}>
          <AuthForm
            mode="signup"
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            name={registerName} setName={setRegisterName}
            email={registerEmail} setEmail={setRegisterEmail}
            password={registerPassword} setPassword={setRegisterPassword}
          />
        </div>

        {/* Overlay Container (Sliding Panel) */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-50 ${isSignUp ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className={`bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative -left-full h-full w-[200%] transform transition-transform duration-500 ease-in-out ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>

            {/* Overlay Left (Visible when Sign Up is active) */}
            <div className={`absolute top-0 flex flex-col items-center justify-center w-1/2 h-full px-12 text-center transition-transform duration-500 ${isSignUp ? 'translate-x-0' : '-translate-x-[20%]'}`}>
              <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
              <p className="mb-8 text-indigo-100 opacity-80">To keep connected with us please login with your personal info</p>
              <button onClick={toggleMode} className="border border-white/40 bg-white/10 backdrop-blur-md px-12 py-3 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-indigo-600 transition shadow-lg">
                Sign In
              </button>
            </div>

            {/* Overlay Right (Visible when Sign In is active) */}
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-12 text-center transition-transform duration-500 ${isSignUp ? 'translate-x-[20%]' : 'translate-x-0'}`}>
              <h1 className="text-3xl font-bold mb-4">Hello, Friend!</h1>
              <p className="mb-8 text-indigo-100 opacity-80">Enter your personal details and start your journey with us</p>
              <button onClick={toggleMode} className="border border-white/40 bg-white/10 backdrop-blur-md px-12 py-3 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-indigo-600 transition shadow-lg">
                Sign Up
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const AuthForm = ({ mode, onSubmit, loading, error, name, setName, email, setEmail, password, setPassword }: any) => (
  <form onSubmit={onSubmit} className="flex flex-col items-center text-center w-full max-w-sm mx-auto">
    <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl mb-8">
      <CheckSquare className="w-8 h-8" />
      <span>Taskify</span>
    </div>
    <h1 className="text-3xl font-bold mb-6 text-slate-800">{mode === 'signin' ? 'Sign In' : 'Create Account'}</h1>

    <div className="w-full space-y-4 mb-6">
      {mode === 'signup' && (
        <input
          id="signup-name"
          name="signup-name"
          type="text"
          placeholder="Name"
          required
          autoComplete="name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="bg-slate-100 border-none w-full px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 font-medium"
        />
      )}
      <input
        id={`${mode}-email`}
        name={`${mode}-email`}
        type="email"
        placeholder="Email"
        required
        autoComplete="username"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="bg-slate-100 border-none w-full px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 font-medium"
      />
      <input
        id={`${mode}-password`}
        name={`${mode}-password`}
        type="password"
        placeholder="Password"
        required
        autoComplete={mode === 'signin' ? "current-password" : "new-password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="bg-slate-100 border-none w-full px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 font-medium"
      />
    </div>

    {error && <p className="text-red-500 text-sm mb-4 font-medium bg-red-50 py-1 px-3 rounded-full">{error}</p>}

    <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-12 py-3 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 w-full transform active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
      {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
    </button>
  </form>
);

export default AuthPage;
