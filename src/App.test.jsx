import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import {
  DSA_BEGINNER_CONCEPTS,
  DSA_BEGINNERS_CURRICULUM,
} from './data/dsaBeginnersCurriculum';

vi.mock('react-router-dom', () => {
  const React = require('react');
  const RouterContext = React.createContext(null);

  function readLocation() {
    return {
      pathname: globalThis.location.pathname,
      hash: globalThis.location.hash,
    };
  }

  function normalizeTo(to) {
    if (typeof to === 'string') return to;
    return `${to.pathname || ''}${to.hash || ''}` || '/';
  }

  function matchRoute(routePath, pathname) {
    if (routePath === pathname) return true;
    if (!routePath || !routePath.includes(':')) return false;
    const routeParts = routePath.split('/').filter(Boolean);
    const pathParts = pathname.split('/').filter(Boolean);
    return routeParts.length === pathParts.length && routeParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  }

  function BrowserRouter({ children }) {
    const [location, setLocation] = React.useState(readLocation);
    const navigate = (to) => {
      const next = normalizeTo(to);
      globalThis.history.pushState({}, '', next);
      setLocation(readLocation());
    };

    return React.createElement(
      RouterContext.Provider,
      { value: { ...location, navigate } },
      children
    );
  }

  function Routes({ children }) {
    const location = React.useContext(RouterContext) || readLocation();
    let fallback = null;
    const routes = React.Children.toArray(children);
    const match = routes.find((route) => {
      if (route.props.path === '*') {
        fallback = route;
        return false;
      }
      return matchRoute(route.props.path, location.pathname);
    });

    return match ? match.props.element : fallback?.props.element || null;
  }

  function Route() {
    return null;
  }

  function Link({ to, children, ...props }) {
    const location = React.useContext(RouterContext);
    const href = normalizeTo(to);
    return React.createElement(
      'a',
      {
        ...props,
        href,
        onClick: (event) => {
          event.preventDefault();
          location?.navigate(href);
        },
      },
      children
    );
  }

  function useLocation() {
    return React.useContext(RouterContext) || readLocation();
  }

  function useNavigate() {
    const context = React.useContext(RouterContext);
    return context?.navigate || (() => {});
  }

  function useParams() {
    const location = React.useContext(RouterContext) || readLocation();
    const practiceMatch = location.pathname.match(/^\/practice\/([^/]+)$/);
    const conceptMatch = location.pathname.match(/^\/dsa-beginners\/([^/]+)$/);
    if (practiceMatch) return { problemId: decodeURIComponent(practiceMatch[1]) };
    if (conceptMatch) return { conceptId: decodeURIComponent(conceptMatch[1]) };
    return {};
  }

  return {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useLocation,
    useNavigate,
    useParams,
  };
});

function renderAt(path) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 401,
    text: async () => JSON.stringify({ error: 'Sign in required.' }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('ships the complete DSA for Beginners curriculum map', () => {
  expect(DSA_BEGINNERS_CURRICULUM).toHaveLength(16);
  expect(DSA_BEGINNER_CONCEPTS.length).toBeGreaterThan(100);
  expect(DSA_BEGINNER_CONCEPTS.map((concept) => concept.title)).toEqual(
    expect.arrayContaining([
      'What is DSA?',
      'Binary Search',
      "Dijkstra's Algorithm",
      'Memoization and Tabulation',
      'KMP and Z Algorithm (String Matching)',
    ])
  );
});

test('primary navigation opens the practice learning workspace', async () => {
  renderAt('/');

  expect(screen.getByRole('heading', { name: /master dsa by/i })).toBeInTheDocument();
  userEvent.click(screen.getAllByRole('link', { name: /^Practice$/i })[0]);

  expect(await screen.findByText(/Story Mode Learning Path/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Build intuition first/i })).toBeInTheDocument();
});

test('AI coach route keeps the requested URL and renders a sign-in boundary for guests', async () => {
  renderAt('/coach?concept=binary-search');

  expect(await screen.findByRole('heading', { name: /Sign in to unlock your personal DSA coach/i })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/coach');
  expect(screen.getByText(/current page and problem context will be preserved/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^Log in$/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /DSA coach that knows/i })).not.toBeInTheDocument();
});

test('concepts page exposes every advanced simulator module', async () => {
  renderAt('/concepts');

  expect(await screen.findByRole('heading', { name: 'Concepts' })).toBeInTheDocument();
  expect(screen.getByText('Merge Sort')).toBeInTheDocument();
  expect(screen.getByText('Quick Sort')).toBeInTheDocument();
  expect(screen.getByText('Bellman-Ford')).toBeInTheDocument();
});

test('simulator hash deep links and editor actions are functional', async () => {
  renderAt('/simulator#heap');

  expect(await screen.findByRole(
    'heading',
    { level: 1, name: 'Heap' },
    { timeout: 5_000 }
  )).toBeInTheDocument();

  userEvent.click(screen.getByRole('tab', { name: 'Editor' }));
  userEvent.click(screen.getByRole('button', { name: 'Explain' }));
  expect(await screen.findByText('Why this works')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(await screen.findByText('Template reset')).toBeInTheDocument();
});

test('unknown routes render a useful 404 recovery page', () => {
  renderAt('/not-a-real-algovista-page');

  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: 'Simulator' }).some((link) => {
    return link.getAttribute('href') === '/simulator';
  })).toBe(true);
});
