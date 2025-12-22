
import { User, Task, AuthResponse, Team, Project } from '../types';
import { API_URL } from '../constants';

// --- IN-MEMORY MOCK DB (For Demo Mode Only) ---
// Data resets on every page reload
let mockData = {
  users: [] as User[],
  tasks: [] as Task[],
  teams: [] as Team[],
  projects: [] as Project[],
  chats: [] as any[]
};

const demoDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to check if we are in Demo Mode
export const isDemoMode = () => sessionStorage.getItem('is_demo_mode') === 'true';

// --- API IMPLEMENTATION ---

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      // Demo Login (Simulated)
      if (isDemoMode()) {
        await demoDelay(500);
        const demoUser = { 
            _id: 'demo-user-id', 
            name: 'Demo User', 
            email: 'demo@example.com',
            createdAt: new Date().toISOString() 
        };
        sessionStorage.setItem('taskify_token', 'demo-token');
        localStorage.setItem('taskify_current_user', JSON.stringify(demoUser));
        return { user: demoUser, token: 'demo-token' };
      }

      // Real Login
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      return res.json();
    },

    register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
       // Registration not available in Demo
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      return res.json();
    },

    verifyEmail: async (token: string): Promise<void> => {
        const res = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        if(!res.ok) throw new Error((await res.json()).message || 'Verification failed');
    },

    changePassword: async (password: string): Promise<void> => {
        if(isDemoMode()) {
            await demoDelay(500);
            return;
        }
        const token = localStorage.getItem('taskify_token');
        const res = await fetch(`${API_URL}/auth/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ password })
        });
        if(!res.ok) throw new Error((await res.json()).message || 'Failed to update password');
    },

    logout: () => {
      sessionStorage.removeItem('taskify_token'); // Clear Demo token
      localStorage.removeItem('taskify_token');   // Clear Real token
      localStorage.removeItem('taskify_current_user');
      sessionStorage.removeItem('is_demo_mode');
    },

    getCurrentUser: (): User | null => {
      const stored = localStorage.getItem('taskify_current_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  tasks: {
    getAll: async (teamId?: string): Promise<Task[]> => {
      if (isDemoMode()) {
        await demoDelay(300);
        // Return mock tasks
        if (mockData.tasks.length === 0) {
            // Seed some initial data for demo
            mockData.tasks = [
                { _id: '1', title: 'Review Demo Project', description: 'Explore the features of Taskify', status: 'pending', priority: 'high', userId: 'demo-user-id', createdAt: new Date().toISOString() },
                { _id: '2', title: 'Try Speech to Text', description: 'Click the mic icon to dictate', status: 'in-progress', priority: 'medium', userId: 'demo-user-id', createdAt: new Date().toISOString() }
            ];
        }
        return mockData.tasks.filter(t => teamId ? t.teamId === teamId : !t.teamId);
      }

      const token = localStorage.getItem('taskify_token');
      const params = teamId ? `?type=team&teamId=${teamId}` : `?type=personal`;
      const res = await fetch(`${API_URL}/tasks${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },

    create: async (data: Partial<Task>): Promise<Task> => {
      if (isDemoMode()) {
        await demoDelay(300);
        const newTask: any = {
          _id: crypto.randomUUID(),
          ...data,
          status: data.status || 'pending',
          priority: data.priority || 'medium',
          userId: 'demo-user-id',
          createdAt: new Date().toISOString()
        };
        mockData.tasks.push(newTask);
        return newTask;
      }

      const token = localStorage.getItem('taskify_token');
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    },

    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
      if (isDemoMode()) {
          const idx = mockData.tasks.findIndex(t => t._id === id);
          if (idx > -1) mockData.tasks[idx] = { ...mockData.tasks[idx], ...updates };
          return mockData.tasks[idx];
      }

      const token = localStorage.getItem('taskify_token');
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      return res.json();
    },

    delete: async (id: string): Promise<void> => {
        if(isDemoMode()) {
            mockData.tasks = mockData.tasks.filter(t => t._id !== id);
            return;
        }
        const token = localStorage.getItem('taskify_token');
        await fetch(`${API_URL}/tasks/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
       });
    }
  },

  projects: {
    getAll: async (): Promise<Project[]> => {
        if (isDemoMode()) return mockData.projects;
        const token = localStorage.getItem('taskify_token');
        const res = await fetch(`${API_URL}/projects`, { headers: { 'Authorization': `Bearer ${token}` } });
        return res.json();
    },
    create: async (data: Partial<Project>): Promise<Project> => {
        if (isDemoMode()) {
            const newP: any = { _id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString(), status: 'active' };
            mockData.projects.push(newP);
            return newP;
        }
        const token = localStorage.getItem('taskify_token');
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    update: async (id: string, data: Partial<Project>): Promise<Project> => {
        if(isDemoMode()) {
            const idx = mockData.projects.findIndex(p => p._id === id);
            if(idx > -1) mockData.projects[idx] = { ...mockData.projects[idx], ...data };
            return mockData.projects[idx];
        }
        const token = localStorage.getItem('taskify_token');
        const res = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    delete: async (id: string): Promise<void> => {
        if(isDemoMode()) {
             mockData.projects = mockData.projects.filter(p => p._id !== id);
             return;
        }
        const token = localStorage.getItem('taskify_token');
        await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    }
  },

  teams: {
    getAll: async (): Promise<Team[]> => {
      // Teams are disabled in Demo Mode
      if (isDemoMode()) return []; 
      const token = localStorage.getItem('taskify_token');
      const res = await fetch(`${API_URL}/teams`, { headers: { 'Authorization': `Bearer ${token}` } });
      return res.json();
    },
    create: async (name: string): Promise<Team> => {
        if (isDemoMode()) throw new Error("Teams feature requires an account.");
        const token = localStorage.getItem('taskify_token');
        const res = await fetch(`${API_URL}/teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name })
        });
        return res.json();
    },
    getById: async (id: string) => {
        if(isDemoMode()) return undefined;
        const token = localStorage.getItem('taskify_token');
        const res = await fetch(`${API_URL}/teams/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        return res.json();
    },
    getChats: async (teamId: string) => {
        if(isDemoMode()) return [];
        const token = localStorage.getItem('taskify_token');
        const res = await fetch(`${API_URL}/teams/${teamId}/chat`, { headers: { 'Authorization': `Bearer ${token}` } });
        return res.json();
    },
    sendChat: async (teamId: string, text: string) => {
        if(isDemoMode()) return;
        const token = localStorage.getItem('taskify_token');
        await fetch(`${API_URL}/teams/${teamId}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ text })
        });
    },
    invite: async (teamId: string, email: string) => {
        if(isDemoMode()) throw new Error("Unavailable in demo");
        const token = localStorage.getItem('taskify_token');
        const res = await fetch(`${API_URL}/teams/${teamId}/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ email })
        });
        if(!res.ok) throw new Error((await res.json()).message);
        return res.json();
    }
  }
};