import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { apiRequest } from '../services/apiClient';
import AuthRequired from '../components/AuthRequired';

vi.mock('../services/apiClient', () => ({
  apiRequest: vi.fn(),
  csrfHeader: (token) => (token ? { 'X-CSRF-Token': token } : {}),
}));

function GuestCoachProbe() {
  const { askCoach, askTutor, loading } = useAuth();
  const [error, setError] = useState('');

  const invoke = async (request) => {
    try {
      await request();
    } catch (requestError) {
      setError(`${requestError.code}:${requestError.status}:${requestError.message}`);
    }
  };

  if (loading) return <p>Checking session</p>;

  return (
    <div>
      <button type="button" onClick={() => invoke(() => askCoach({ message: 'Help', concept: {} }))}>
        Ask coach as guest
      </button>
      <button type="button" onClick={() => invoke(() => askTutor({ question: 'Help' }))}>
        Ask tutor as guest
      </button>
      <output>{error}</output>
    </div>
  );
}

function SignedInTutorProbe() {
  const { askTutor } = useAuth();
  return (
    <button
      type="button"
      onClick={() => askTutor({ question: 'Help me debug' }).catch(() => {})}
    >
      Send protected tutor request
    </button>
  );
}

function LogoutProbe() {
  const { isAuthenticated, logout, logoutPending, authError } = useAuth();
  return (
    <div>
      <output>{isAuthenticated ? 'signed-in' : 'signed-out'}</output>
      <button type="button" onClick={logout} disabled={logoutPending}>Log out probe</button>
      {authError && <p>{authError}</p>}
    </div>
  );
}

describe('AuthContext coaching boundary', () => {
  beforeEach(() => {
    window.localStorage.clear();
    apiRequest.mockReset();
    apiRequest.mockRejectedValue(Object.assign(new Error('Sign in required.'), { status: 401 }));
  });

  test.each([
    ['coach', 'Ask coach as guest', 'AI coaching'],
    ['tutor', 'Ask tutor as guest', 'the personal tutor'],
  ])('blocks guest %s requests before the coaching endpoint is called', async (_, buttonName, feature) => {
    render(<AuthProvider><GuestCoachProbe /></AuthProvider>);

    fireEvent.click(await screen.findByRole('button', { name: buttonName }));

    await waitFor(() => {
      expect(screen.getByText(new RegExp(`AUTH_REQUIRED:401:Sign in to use ${feature}`, 'i'))).toBeInTheDocument();
    });
    expect(apiRequest).toHaveBeenCalledTimes(1);
    expect(apiRequest).toHaveBeenCalledWith('/api/auth/session');
    expect(apiRequest).not.toHaveBeenCalledWith('/api/coach', expect.anything());
    expect(apiRequest).not.toHaveBeenCalledWith('/api/tutor/v1/turn', expect.anything());
  });

  test('expires stale client auth and returns to the sign-in gate after a tutor 401', async () => {
    apiRequest.mockImplementation((path) => {
      if (path === '/api/auth/session') {
        return Promise.resolve({
          user: { id: 'learner-1', name: 'Ada', email: 'ada@example.com' },
          csrfToken: 'csrf-token',
          progress: {},
        });
      }
      if (path === '/api/tutor/v1/turn') {
        return Promise.reject(Object.assign(new Error('Session expired.'), { status: 401 }));
      }
      return Promise.reject(new Error(`Unexpected request: ${path}`));
    });

    render(
      <AuthProvider>
        <AuthRequired feature="the personal tutor">
          <SignedInTutorProbe />
        </AuthRequired>
      </AuthProvider>
    );

    fireEvent.click(await screen.findByRole('button', { name: /Send protected tutor request/i }));

    expect(await screen.findByRole('heading', { name: /Sign in to unlock your personal DSA coach/i })).toBeInTheDocument();
    expect(screen.getByText(/secure session expired/i)).toBeInTheDocument();
  });

  test('keeps the visible session when secure logout cannot be confirmed', async () => {
    apiRequest.mockImplementation((path) => {
      if (path === '/api/auth/session') {
        return Promise.resolve({
          user: { id: 'learner-1', name: 'Ada', email: 'ada@example.com' },
          csrfToken: 'csrf-token',
          progress: {},
        });
      }
      if (path === '/api/auth/logout') return Promise.reject(new Error('Network unavailable'));
      return Promise.reject(new Error(`Unexpected request: ${path}`));
    });

    render(<AuthProvider><LogoutProbe /></AuthProvider>);
    expect(await screen.findByText('signed-in')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Log out probe/i }));

    expect(await screen.findByText(/Secure logout could not be confirmed/i)).toBeInTheDocument();
    expect(screen.getByText('signed-in')).toBeInTheDocument();
  });

  test('clears client state only after the server revokes the session', async () => {
    apiRequest.mockImplementation((path) => {
      if (path === '/api/auth/session') {
        return Promise.resolve({
          user: { id: 'learner-1', name: 'Ada', email: 'ada@example.com' },
          csrfToken: 'csrf-token',
          progress: {},
        });
      }
      if (path === '/api/auth/logout') return Promise.resolve({ ok: true });
      return Promise.reject(new Error(`Unexpected request: ${path}`));
    });

    render(<AuthProvider><LogoutProbe /></AuthProvider>);
    expect(await screen.findByText('signed-in')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Log out probe/i }));

    expect(await screen.findByText('signed-out')).toBeInTheDocument();
  });
});
