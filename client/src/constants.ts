
// Set this to FALSE to use the real Node.js/MongoDB backend.
// The Demo Mode will explicitly override this when active.
export const USE_MOCK_BACKEND = false;

// Primary Backend URL (Render)
const PRIMARY_BACKEND_URL = 'https://taskify-9wmb.onrender.com';
// Local Fallback URL
// const LOCAL_BACKEND_URL = 'http://localhost:5000';

// Safe backend URL resolution
// Default to Render (Primary) to avoid running local backend.
// To use local backend, set VITE_API_BASE_URL=http://localhost:5000 or swap the variable below.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || PRIMARY_BACKEND_URL;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? LOCAL_BACKEND_URL : PRIMARY_BACKEND_URL); 

if (!API_BASE_URL) {
  throw new Error("API Base URL could not be resolved");
}

export const API_URL = `${API_BASE_URL}/api`;

export enum AppRoutes {
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/',
}