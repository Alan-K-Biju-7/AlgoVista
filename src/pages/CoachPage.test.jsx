import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthRequired from '../components/AuthRequired';
import MainLayout from '../layout/MainLayout';
import CoachPage from './CoachPage';

const mockAskCoach = vi.fn();
let mockAuthState;

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthState,
  useOptionalAuth: () => mockAuthState,
}));

function authState(overrides = {}) {
  return {
    askCoach: mockAskCoach,
    isAuthenticated: false,
    loading: false,
    progress: {},
    user: null,
    authError: '',
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}

function renderProtectedCoach(path = '/coach?concept=arrays-binary-search') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthRequired
        feature="AI coaching"
        description="Ask for intuition, dry runs, edge cases, and interview guidance tied to your private learning profile."
      >
        <CoachPage />
      </AuthRequired>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockAskCoach.mockReset();
  mockAuthState = authState();
});

test('shows an accessible account gate and no coaching controls when signed out', () => {
  renderProtectedCoach();

  expect(screen.getByRole('region', { name: /sign in to unlock your personal dsa coach/i }))
    .toBeInTheDocument();
  expect(screen.getByText(/why sign-in is required/i)).toBeInTheDocument();
  expect(screen.getByText(/stay on this page after signing in/i)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/ask the ai coach/i)).not.toBeInTheDocument();
  expect(mockAskCoach).not.toHaveBeenCalled();
});

test('keeps coaching unavailable while the secure session is being restored', () => {
  mockAuthState = authState({ loading: true });
  renderProtectedCoach();

  expect(screen.getByText(/checking your secure session/i)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument();
  expect(mockAskCoach).not.toHaveBeenCalled();
});

test('marks AI Coach as account-protected in primary navigation for signed-out learners', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <MainLayout><p>Learning content</p></MainLayout>
    </MemoryRouter>
  );

  const navigation = within(screen.getByRole('navigation', { name: /primary navigation/i }));
  expect(navigation.getByRole('link', { name: /ai coach.*sign in required/i })).toHaveAttribute(
    'href',
    '/coach'
  );
  expect(navigation.getByText('Sign in')).toBeInTheDocument();
});

test('sends a concept-grounded coaching request after authentication', async () => {
  mockAuthState = authState({
    isAuthenticated: true,
    user: { id: 'learner-1', name: 'Learner', email: 'learner@example.com' },
  });
  mockAskCoach.mockResolvedValue({
    reply: 'Binary search halves a sorted search space while preserving the target range.',
    provider: 'ai-provider',
  });
  renderProtectedCoach();

  const composer = screen.getByLabelText(/ask the ai coach about binary search/i);
  fireEvent.change(composer, { target: { value: 'Explain the invariant with a tiny dry run.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));

  await waitFor(() => expect(mockAskCoach).toHaveBeenCalledTimes(1));
  expect(mockAskCoach).toHaveBeenCalledWith(expect.objectContaining({
    message: 'Explain the invariant with a tiny dry run.',
    concept: expect.objectContaining({ title: 'Binary Search' }),
  }));
  expect(await screen.findByText(/binary search halves a sorted search space/i)).toBeInTheDocument();
});
