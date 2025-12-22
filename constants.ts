
// Set this to FALSE to use the real Node.js/MongoDB backend.
// The Demo Mode will explicitly override this when active.
export const USE_MOCK_BACKEND = false;

export const API_URL = 'http://localhost:5000/api';

export enum AppRoutes {
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/',
}
