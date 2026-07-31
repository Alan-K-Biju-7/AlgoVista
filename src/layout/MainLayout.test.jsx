import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from './MainLayout';

const { mockUseOptionalAuth } = vi.hoisted(() => ({
  mockUseOptionalAuth: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useOptionalAuth: mockUseOptionalAuth,
}));

function renderLayout() {
  return render(
    <MemoryRouter>
      <MainLayout><p>Learning workspace</p></MainLayout>
    </MemoryRouter>
  );
}

describe('MainLayout account error alert', () => {
  test('provides a skip target and a route-specific document title', () => {
    mockUseOptionalAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      authError: '',
    });

    renderLayout();

    expect(screen.getByRole('link', { name: 'Skip to learning content' })).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(document.title).toBe('Home | AlgoVista');
  });

  test('makes a failed secure logout globally visible, retryable, and dismissible', () => {
    const logout = vi.fn();
    const clearAuthError = vi.fn();
    mockUseOptionalAuth.mockReturnValue({
      user: { name: 'Ada Learner', email: 'ada@example.com' },
      isAuthenticated: true,
      authError: 'Secure logout could not be confirmed. Check your connection and try again.',
      logoutPending: false,
      logout,
      clearAuthError,
    });

    renderLayout();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/Secure logout could not be confirmed/i);

    fireEvent.click(screen.getByRole('button', { name: 'Retry secure logout' }));
    expect(logout).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss account error' }));
    expect(clearAuthError).toHaveBeenCalledTimes(1);
  });

  test('offers a sign-in recovery path when the session is no longer authenticated', () => {
    const clearAuthError = vi.fn();
    mockUseOptionalAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      authError: 'Your secure session expired. Sign in to continue.',
      logoutPending: false,
      clearAuthError,
    });

    renderLayout();

    expect(screen.getByRole('alert')).toHaveTextContent(/session expired/i);
    expect(screen.getByRole('link', { name: 'Open sign in' })).toHaveAttribute('href', '/coach');
  });
});
