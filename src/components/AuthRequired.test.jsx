import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { apiRequest } from '../services/apiClient';
import AuthRequired from './AuthRequired';

vi.mock('../services/apiClient', () => ({
  apiRequest: vi.fn(),
  csrfHeader: (token) => (token ? { 'X-CSRF-Token': token } : {}),
}));

describe('AuthRequired', () => {
  beforeEach(() => {
    window.localStorage.clear();
    apiRequest.mockReset();
    apiRequest.mockImplementation((path) => {
      if (path === '/api/auth/session') {
        return Promise.reject(Object.assign(new Error('Sign in required.'), { status: 401 }));
      }
      if (path === '/api/auth/login') {
        return Promise.resolve({
          user: { id: 'learner-1', name: 'Ada Learner', email: 'ada@example.com' },
          csrfToken: 'csrf-test-token',
          progress: {},
        });
      }
      return Promise.reject(new Error(`Unexpected request: ${path}`));
    });
  });

  test('returns to protected content in place after a successful sign-in', async () => {
    render(
      <AuthProvider>
        <AuthRequired feature="AI interview coaching">
          <section><h2>Private coaching workspace</h2></section>
        </AuthRequired>
      </AuthProvider>
    );

    expect(await screen.findByRole('heading', { name: /Sign in to unlock your personal DSA coach/i })).toBeInTheDocument();
    userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
    userEvent.type(screen.getByLabelText('Password'), 'correct horse battery staple');
    userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('heading', { name: 'Private coaching workspace' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Sign in to unlock/i })).not.toBeInTheDocument();
    expect(apiRequest).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({ method: 'POST' }));
  });
});

