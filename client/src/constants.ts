
// Set this to FALSE to use the real Node.js/MongoDB backend.
// The Demo Mode will explicitly override this when active.
export const USE_MOCK_BACKEND = false;

// Safe backend URL resolution
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:5000' : '');
if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

export const API_URL = `${API_BASE_URL}/api`;

export enum AppRoutes {
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/',
}