import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, csrfHeader } from '../services/apiClient';

const TOKEN_KEY = 'algovista.auth.token';
const USER_KEY = 'algovista.auth.user';

const AuthContext = createContext(null);

export function createAuthRequiredError(feature = 'AI coaching') {
  const error = new Error(`Sign in to use ${feature}.`);
  error.name = 'AuthenticationRequiredError';
  error.code = 'AUTH_REQUIRED';
  error.status = 401;
  return error;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [logoutPending, setLogoutPending] = useState(false);

  const requireSession = (feature) => {
    if (loading || !user || !csrfToken) throw createAuthRequiredError(feature);
    return csrfToken;
  };

  const expireSession = () => {
    setUser(null);
    setCsrfToken('');
    setProgress({});
    setAuthError('Your secure session expired. Sign in to continue.');
  };

  const clearAuthError = () => setAuthError('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      // Retire credentials left by older builds. Authentication now comes only
      // from an opaque HttpOnly cookie that application JavaScript cannot read.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      try {
        const data = await apiRequest('/api/auth/session');
        if (!active) return;
        setUser(data.user);
        setCsrfToken(data.csrfToken || '');
        setProgress(data.progress || {});
        setAuthError('');
      } catch (error) {
        if (!active) return;
        setUser(null);
        setCsrfToken('');
        setProgress({});
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const persistSession = (data) => {
    setUser(data.user);
    setCsrfToken(data.csrfToken || '');
    setProgress(data.progress || {});
    setAuthError('');
  };

  const register = async ({ name, email, password }) => {
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      persistSession(data);
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      persistSession(data);
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    if (logoutPending || !user) return false;
    setLogoutPending(true);
    setAuthError('');
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        headers: csrfHeader(csrfToken),
      });
      setUser(null);
      setCsrfToken('');
      setProgress({});
      return true;
    } catch {
      // With an HttpOnly cookie, clearing React state cannot revoke the real
      // session. Keep the signed-in state visible and let the learner retry.
      setAuthError('Secure logout could not be confirmed. Check your connection and try again.');
      return false;
    } finally {
      setLogoutPending(false);
    }
  };

  const refreshProgress = async () => {
    if (!user) return {};
    const data = await apiRequest('/api/progress');
    setProgress(data.progress || {});
    return data.progress || {};
  };

  const updateConceptProgress = async ({ conceptId, status, confidence = 0, notes = '' }) => {
    if (!user) throw new Error('Log in to save progress.');
    const data = await apiRequest('/api/progress', {
      method: 'PATCH',
      headers: csrfHeader(csrfToken),
      body: JSON.stringify({ conceptId, status, confidence, notes }),
    });
    setProgress(data.progress || {});
    return data.progress || {};
  };

  const askCoach = async ({ message, concept, history = [] }) => {
    const currentCsrfToken = requireSession('AI coaching');
    try {
      return await apiRequest('/api/coach', {
        method: 'POST',
        headers: csrfHeader(currentCsrfToken),
        body: JSON.stringify({ message, concept, progress, history }),
      });
    } catch (error) {
      if (error.status === 401) expireSession();
      throw error;
    }
  };

  const askTutor = async (request, { signal } = {}) => {
    const currentCsrfToken = requireSession('the personal tutor');
    try {
      return await apiRequest('/api/tutor/v1/turn', {
        method: 'POST',
        headers: csrfHeader(currentCsrfToken),
        body: JSON.stringify(request),
        signal,
      });
    } catch (error) {
      if (error.status === 401) expireSession();
      throw error;
    }
  };

  const refreshPracticeProgress = async () => {
    if (!user) return {};
    const data = await apiRequest('/api/practice-progress');
    return data.progress || {};
  };

  const updatePracticeProgress = async ({ problemId, ...record }) => {
    if (!user) throw new Error('Log in to sync practice progress.');
    const data = await apiRequest('/api/practice-progress', {
      method: 'PATCH',
      headers: csrfHeader(csrfToken),
      body: JSON.stringify({ problemId, ...record }),
    });
    return data.record || data.progress || {};
  };

  const value = {
    // Compatibility field for older embedded practice code. No credential is
    // exposed to JavaScript; requests use the HttpOnly cookie automatically.
    token: '',
    user,
    progress,
    loading,
    authError,
    clearAuthError,
    logoutPending,
    isAuthenticated: Boolean(!loading && user),
    register,
    login,
    logout,
    refreshProgress,
    updateConceptProgress,
    refreshPracticeProgress,
    updatePracticeProgress,
    askCoach,
    askTutor,
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

export function useOptionalAuth() {
  return useContext(AuthContext);
}
