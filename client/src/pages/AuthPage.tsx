import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckSquare, ArrowLeft, KeyRound } from 'lucide-react'; // Added KeyRound icon
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Independent Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Forgot Password State
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState({ type: '', text: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const mode = searchParams.get('mode');
    setIsSignUp(mode === 'signup');
    setError('');
    setResetMessage({ type: '', text: '' });
    // Reset the password reset view if switching main modes
    if (mode === 'signup') setIsResettingPassword(false);
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(); // Assuming loginWithGoogle is available from useAuth
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google Sign-In popup was closed.');
      } else {
        setError(err.message || 'Google Sign-In failed');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // STRICT SIGNUP FLOW
        const { createUserWithEmailAndPassword, sendEmailVerification } = await import('firebase/auth');
        const { auth } = await import('../config/firebase');

        const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
        await sendEmailVerification(userCredential.user);

        alert("Verification email sent to " + registerEmail + ". Please check your inbox and verify BEFORE logging in.");
        setIsSignUp(false);
        navigate('/auth?mode=signin');
      } else {
        // STRICT LOGIN FLOW
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('../config/firebase');

        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

        if (!userCredential.user.emailVerified) {
          throw new Error("Please verify your email address before logging in. Check your inbox.");
        }

        const idToken = await userCredential.user.getIdToken();
        const { user, token } = await api.auth.firebaseLogin(idToken);

        login(token, user);
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      const { auth } = await import('../config/firebase');

      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage({ type: 'success', text: 'Password reset link sent! Check your email.' });
    } catch (err: any) {
      console.error("Reset Error:", err);
      if (err.code === 'auth/user-not-found') {
        setResetMessage({ type: 'error', text: 'No account found with this email.' });
      } else {
        setResetMessage({ type: 'error', text: 'Failed to send reset link. Try again.' });
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
            onGoogleSignIn={handleGoogleSignIn}
            // Props for forgot password
            isResettingPassword={isResettingPassword}
            setIsResettingPassword={setIsResettingPassword}
            onResetSubmit={handleResetPassword}
            resetEmail={resetEmail}
            setResetEmail={setResetEmail}
            resetMessage={resetMessage}
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
            onGoogleSignIn={handleGoogleSignIn}
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

// Extracted & Enhanced AuthForm to handle Reset View
const AuthForm = ({
  mode, onSubmit, loading, error,
  name, setName, email, setEmail, password, setPassword,
  onGoogleSignIn, // Added this missing prop
  // New props for reset flow
  isResettingPassword, setIsResettingPassword, onResetSubmit, resetEmail, setResetEmail, resetMessage
}: any) => {

  // If we are in "Forgot Password" mode (only applicable for signin)
  if (mode === 'signin' && isResettingPassword) {
    return (
      <form onSubmit={onResetSubmit} className="flex flex-col items-center text-center w-full max-w-sm mx-auto">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl mb-8">
          <KeyRound className="w-8 h-8" />
          <span>Taskify</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-slate-800">Reset Password</h1>
        <p className="text-slate-500 mb-8 text-sm">Enter your email and we'll send you a link to reset your password.</p>

        <div className="w-full space-y-4 mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            className="bg-slate-100 border-none w-full px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>

        {resetMessage?.text && (
          <p className={`text-sm mb-4 font-medium py-1 px-3 rounded-full ${resetMessage.type === 'success' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
            {resetMessage.text}
          </p>
        )}

        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-12 py-3 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 w-full mb-4">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={() => setIsResettingPassword(false)}
          className="text-slate-500 text-xs font-bold uppercase tracking-wider hover:text-indigo-600 transition"
        >
          Back to Sign In
        </button>
      </form>
    );
  }


  // Standard Login/Signup View
  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center text-center w-full max-w-sm mx-auto">
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl mb-8">
        <CheckSquare className="w-8 h-8" />
        <span>Taskify</span>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-slate-800">{mode === 'signin' ? 'Sign In' : 'Create Account'}</h1>

      <div className="w-full space-y-4 mb-2">
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

      {mode === 'signin' && (
        <div className="w-full text-right mb-6">
          <button
            type="button"
            onClick={() => {
              setResetEmail(email); // Pre-fill email if user typed it
              setIsResettingPassword(true);
            }}
            className="text-slate-400 text-sm hover:text-indigo-600 transition font-medium"
          >
            Forgot your password?
          </button>
        </div>
      )}

      {/* Spacing adjustments for SignUp since it has no forgot password link */}
      {mode === 'signup' && <div className="mb-6"></div>}

      {error && <p className="text-red-500 text-sm mb-4 font-medium bg-red-50 py-1 px-3 rounded-full">{error}</p>}

      <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-12 py-3 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 w-full transform active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
      </button>

      <div className="relative w-full my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500 font-bold tracking-wider">Or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={loading}
        className="flex items-center justify-center gap-3 w-full bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm active:scale-95 duration-200 disabled:opacity-70"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.51l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>{mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}</span>
      </button>
    </form>
  );
};

export default AuthPage;