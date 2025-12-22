import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts & Pages
import DashboardLayout from './layouts/DashboardLayout'; // Check this path!
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

// Dashboard Views
import DashboardHome from './pages/dashboard/DashboardHome';
import MyTasks from './pages/dashboard/MyTasks';
import MyProjects from './pages/dashboard/MyProjects';
import Teams from './pages/dashboard/Teams';
import TeamDetails from './pages/dashboard/TeamDetails';
import Status from './pages/dashboard/Status';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ROUTES (Clean URLs) --- */}
          <Route 
            path="/" 
            element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/auth" 
            element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} 
          />

          {/* --- PROTECTED ROUTES (Dashboard) --- */}
          <Route 
            path="/dashboard" 
            element={user ? <DashboardLayout /> : <Navigate to="/auth" replace />}
          >
            {/* Nested Views */}
            <Route index element={<DashboardHome />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="teams" element={<Teams />} />
            <Route path="teams/:teamId" element={<TeamDetails />} />
            <Route path="status" element={<Status />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* --- CATCH ALL --- */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;