import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, authHeader } from '../services/apiClient';

const TOKEN_KEY = 'algovista.auth.token';
const USER_KEY = 'algovista.auth.user';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(readStoredUser);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest('/api/me', {
          headers: authHeader(token),
        });
        if (!active) return;
        setUser(data.user);
        setProgress(data.progress || {});
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setAuthError('');
      } catch (error) {
        if (!active) return;
        if (error.status === 401) {
          setToken('');
          setUser(null);
          setProgress({});
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
        setAuthError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [token]);

  const persistSession = (data) => {
    setToken(data.token);
    setUser(data.user);
    setProgress(data.progress || {});
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  const register = async ({ name, email, password }) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    persistSession(data);
    return data;
  };

  const login = async ({ email, password }) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    persistSession(data);
    return data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setProgress({});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const refreshProgress = async () => {
    if (!token) return {};
    const data = await apiRequest('/api/progress', {
      headers: authHeader(token),
    });
    setProgress(data.progress || {});
    return data.progress || {};
  };

  const updateConceptProgress = async ({ conceptId, status, confidence = 0, notes = '' }) => {
    if (!token) throw new Error('Log in to save progress.');
    const data = await apiRequest('/api/progress', {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify({ conceptId, status, confidence, notes }),
    });
    setProgress(data.progress || {});
    return data.progress || {};
  };

  const askCoach = async ({ message, concept, history = [] }) => {
    return apiRequest('/api/coach', {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify({ message, concept, progress, history }),
    });
  };

  const value = {
    token,
    user,
    progress,
    loading,
    authError,
    isAuthenticated: Boolean(token && user),
    register,
    login,
    logout,
    refreshProgress,
    updateConceptProgress,
    askCoach,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return value;
}
