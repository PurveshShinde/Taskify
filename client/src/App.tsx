import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts & Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

// 1. ISOLATED DEMO DASHBOARD (Completely Separate, Zero Auth Gate, Standalone)
import DemoDashboardLayout from './layouts/DemoDashboardLayout';
import DemoDashboardHome from './pages/demo/DemoDashboardHome';
import DemoTasks from './pages/demo/DemoTasks';
import DemoProjects from './pages/demo/DemoProjects';
import DemoTeams from './pages/demo/DemoTeams';
import DemoStatus from './pages/demo/DemoStatus';
import DemoSettings from './pages/demo/DemoSettings';

// 2. AUTHENTICATED USER DASHBOARD (Connected to Backend, Gated by OAuth/Auth)
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyTasks from './pages/dashboard/MyTasks';
import MyProjects from './pages/dashboard/MyProjects';
import Teams from './pages/dashboard/Teams';
import TeamDetails from './pages/dashboard/TeamDetails';
import Status from './pages/dashboard/Status';
import Settings from './pages/dashboard/Settings';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC MARKETING & AUTH ROUTES --- */}
          <Route
            path="/"
            element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />

          {/* ========================================================
              DASHBOARD 1: DEDICATED DEMO DASHBOARD
              (Zero Auth / No OAuth Required / Persistent Across Refresh)
             ======================================================== */}
          <Route path="/demo" element={<DemoDashboardLayout />}>
            <Route index element={<DemoDashboardHome />} />
            <Route path="tasks" element={<DemoTasks />} />
            <Route path="projects" element={<DemoProjects />} />
            <Route path="teams" element={<DemoTeams />} />
            <Route path="status" element={<DemoStatus />} />
            <Route path="settings" element={<DemoSettings />} />
            <Route path="profile" element={<Navigate to="/demo/settings" replace />} />
          </Route>

          {/* ========================================================
              DASHBOARD 2: REAL USER DASHBOARD
              (Authenticated via OAuth/Firebase, Protected, Real Data)
             ======================================================== */}
          <Route
            path="/dashboard"
            element={user ? <DashboardLayout /> : <Navigate to="/auth" replace />}
          >
            <Route index element={<DashboardHome />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="teams" element={<Teams />} />
            <Route path="teams/:teamId" element={<TeamDetails />} />
            <Route path="status" element={<Status />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Navigate to="/dashboard/settings" replace />} />
          </Route>

          {/* --- CATCH ALL --- */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;