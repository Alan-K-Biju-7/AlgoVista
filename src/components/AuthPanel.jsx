import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPanel({ compact = false }) {
  const { user, isAuthenticated, login, register, logout, authError } = useAuth();
  const [mode, setMode] = useState('login');
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
        await register(form);
        setMessage('Account created. Progress will now sync here.');
      } else {
        await login(form);
        setMessage('Welcome back. Progress loaded.');
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
        </div>
        <button type="button" className="btn-ghost" onClick={logout}>
          Log out
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
        />
      </div>

      <div>
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="8+ characters"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? 'Saving...' : mode === 'login' ? 'Log in' : 'Create account'}
      </button>

      {(message || authError) && (
        <p className="auth-panel__message">{message || authError}</p>
      )}
    </form>
  );
}
