import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPanel({
  compact = false,
  defaultMode = 'login',
  onAuthenticated,
  purpose = 'Sync your progress across devices.',
}) {
  const {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    logoutPending,
    authError,
  } = useAuth();
  const [mode, setMode] = useState(defaultMode === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      if (mode === 'register') {
        const session = await register(form);
        setMessage('Account created. Progress will now sync here.');
        onAuthenticated?.(session);
      } else {
        const session = await login(form);
        setMessage('Welcome back. Progress loaded.');
        onAuthenticated?.(session);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className={compact ? 'auth-panel auth-panel--compact' : 'auth-panel'}>
        <div>
          <p className="auth-panel__label">Signed in</p>
          <p className="auth-panel__name">{user.name}</p>
          <p className="auth-panel__email">{user.email}</p>
          {authError && <p className="auth-panel__error" role="alert">{authError}</p>}
        </div>
        <button type="button" className="btn-ghost" onClick={logout} disabled={logoutPending}>
          {logoutPending ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    );
  }

  return (
    <form className={compact ? 'auth-panel auth-panel--compact' : 'auth-panel'} onSubmit={handleSubmit}>
      <div className="auth-panel__header">
        <div>
          <p className="auth-panel__label">Learner account</p>
          <p className="auth-panel__name">{mode === 'login' ? 'Log in' : 'Create account'}</p>
          <p className="auth-panel__purpose">{purpose}</p>
        </div>
        <div className="auth-panel__toggle" aria-label="Auth mode">
          <button
            type="button"
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'is-active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
      </div>

      {mode === 'register' && (
        <div>
          <label htmlFor="auth-name">Name</label>
          <input
            id="auth-name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Alan"
            autoComplete="name"
            required
            minLength="2"
            maxLength="80"
          />
        </div>
      )}

      <div>
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          maxLength="254"
        />
      </div>

      <div>
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder={mode === 'register' ? '12+ characters' : 'Your password'}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
          minLength={mode === 'register' ? 12 : 8}
          maxLength="128"
        />
        {mode === 'register' && (
          <small className="auth-panel__hint">Use 12 or more characters. A memorable passphrase works well.</small>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? 'Saving...' : mode === 'login' ? 'Log in' : 'Create account'}
      </button>

      {(message || authError) && (
        <p className="auth-panel__message" role={message || authError ? 'status' : undefined} aria-live="polite">
          {message || authError}
        </p>
      )}
    </form>
  );
}
