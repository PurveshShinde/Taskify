
// Set this to FALSE to use the real Node.js/MongoDB backend.
// The Demo Mode will explicitly override this when active.
export const USE_MOCK_BACKEND = false;

// Default Backend Endpoints
const LOCAL_BACKEND_URL = 'http://localhost:5000';
const PRODUCTION_BACKEND_URL = 'https://taskify-9wmb.onrender.com';

// Safe backend URL resolution:
// 1. Checks VITE_API_BASE_URL environment variable if set.
// 2. In local development (DEV), defaults to local backend.
// 3. In production, defaults to deployed production backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? LOCAL_BACKEND_URL : PRODUCTION_BACKEND_URL); 

if (!API_BASE_URL) {
  throw new Error("API Base URL could not be resolved");
}

export const API_URL = `${API_BASE_URL}/api`;

export enum AppRoutes {
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/',
}