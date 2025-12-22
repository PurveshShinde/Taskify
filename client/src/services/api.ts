import { User, Task, AuthResponse, Team, Project } from '../types';
import { API_URL } from '../constants';

// Mock data for demo mode
let mockData = {
    users: [] as User[],
    tasks: [] as Task[],
    teams: [] as Team[],
    projects: [] as Project[],
    chats: [] as any[]
};

const demoDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const isDemoMode = () => sessionStorage.getItem('is_demo_mode') === 'true';

export const api = {
    auth: {
        login: async (email: string, password: string): Promise<AuthResponse> => {
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

            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
            return res.json();
        },

        firebaseLogin: async (token: string): Promise<AuthResponse> => {
            const res = await fetch(`${API_URL}/auth/firebase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Firebase Auth failed');
            return res.json();
        },

        changePassword: async (password: string): Promise<void> => {
            if (isDemoMode()) {
                await demoDelay(500);
                return;
            }
            const token = localStorage.getItem('taskify_token');
            const res = await fetch(`${API_URL}/auth/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ password })
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to update password');
        },

        deleteAccount: async (): Promise<void> => {
            if (isDemoMode()) {
                throw new Error("Cannot delete demo account");
            }
            const token = localStorage.getItem('taskify_token');
            const res = await fetch(`${API_URL}/auth/me`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete account');
        },

        logout: () => {
            sessionStorage.removeItem('taskify_token');
            localStorage.removeItem('taskify_token');
            localStorage.removeItem('taskify_current_user');
            sessionStorage.removeItem('is_demo_mode');
        },

        getCurrentUser: (): User | null => {
            const stored = localStorage.getItem('taskify_current_user');
            return stored ? JSON.parse(stored) : null;
        },

        getMe: async (): Promise<User> => {
            if (isDemoMode()) {
                await demoDelay(300);
                return api.auth.getCurrentUser()!;
            }
            const token = localStorage.getItem('taskify_token');
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch user');
            const user = await res.json();
            // Update local storage to keep in sync
            localStorage.setItem('taskify_current_user', JSON.stringify(user));
            return user;
        }
    },

    tasks: {
        getAll: async (teamId?: string): Promise<Task[]> => {
            if (isDemoMode()) {
                await demoDelay(300);
                if (mockData.tasks.length === 0) {
                    mockData.tasks = [
                        { _id: '1', title: 'Review Demo Project', description: 'Explore features', status: 'pending', priority: 'high', userId: 'demo-user-id', createdAt: new Date().toISOString() },
                        { _id: '2', title: 'Try Speech to Text', description: 'Click mic icon', status: 'in-progress', priority: 'medium', userId: 'demo-user-id', createdAt: new Date().toISOString() }
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
            if (isDemoMode()) {
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
            if (isDemoMode()) {
                const idx = mockData.projects.findIndex(p => p._id === id);
                if (idx > -1) mockData.projects[idx] = { ...mockData.projects[idx], ...data };
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
            if (isDemoMode()) {
                mockData.projects = mockData.projects.filter(p => p._id !== id);
                return;
            }
            const token = localStorage.getItem('taskify_token');
            await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        }
    },

    teams: {
        getAll: async (): Promise<Team[]> => {
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
            if (isDemoMode()) return undefined;
            const token = localStorage.getItem('taskify_token');
            const res = await fetch(`${API_URL}/teams/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            return res.json();
        },
        getChats: async (teamId: string) => {
            if (isDemoMode()) return [];
            const token = localStorage.getItem('taskify_token');
            const res = await fetch(`${API_URL}/teams/${teamId}/chat`, { headers: { 'Authorization': `Bearer ${token}` } });
            return res.json();
        },
        sendChat: async (teamId: string, text: string) => {
            if (isDemoMode()) return;
            const token = localStorage.getItem('taskify_token');
            await fetch(`${API_URL}/teams/${teamId}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ text })
            });
        },
        invite: async (teamId: string, email: string) => {
            if (isDemoMode()) throw new Error("Unavailable in demo");
            const token = localStorage.getItem('taskify_token');
            const res = await fetch(`${API_URL}/teams/${teamId}/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ email })
            });
            if (!res.ok) throw new Error((await res.json()).message);
            return res.json();
        }
    },

    users: {
        getAll: async (): Promise<User[]> => {
            if (isDemoMode()) {
                await demoDelay(300);
                return [
                    { _id: 'demo-user-id', name: 'Demo User', email: 'demo@example.com' },
                    { _id: 'u2', name: 'Alice Smith', email: 'alice@example.com' },
                    { _id: 'u3', name: 'Bob Jones', email: 'bob@example.com' },
                ] as any[];
            }
            const token = localStorage.getItem('taskify_token');
            const res = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            return res.json();
        },

        updateProfile: async (data: Partial<User>): Promise<User> => {
            if (isDemoMode()) {
                const currentUser = JSON.parse(localStorage.getItem('taskify_current_user') || '{}');
                const updated = { ...currentUser, ...data };
                localStorage.setItem('taskify_current_user', JSON.stringify(updated));
                return updated;
            }
            const token = localStorage.getItem('taskify_token');
            const res = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to update profile');
            const updatedUser = await res.json();
            localStorage.setItem('taskify_current_user', JSON.stringify(updatedUser));
            return updatedUser;
        }
    }
};
