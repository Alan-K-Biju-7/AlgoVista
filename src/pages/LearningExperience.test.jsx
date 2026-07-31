import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ConceptLessonPage from './ConceptLessonPage';
import ConceptsPage from './ConceptsPage';
import DSABeginnersPage from './DSABeginnersPage';

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = () => Promise.resolve({
    ok: false,
    status: 401,
    text: async () => JSON.stringify({ error: 'Sign in required.' }),
  });
});

afterEach(() => {
  cleanup();
  global.fetch = originalFetch;
});

test('lets learners step through a narrated binary-search simulation', async () => {
  render(
    <MemoryRouter initialEntries={['/dsa-beginners/arrays-binary-search']}>
      <AuthProvider>
        <Routes>
          <Route path="/dsa-beginners/:conceptId" element={<ConceptLessonPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

  expect(await screen.findByRole('heading', { level: 1, name: 'Binary Search' })).toBeTruthy();
  expect(screen.getByText('Step 1 of 3')).toBeTruthy();
  expect(screen.getByText('Probe the middle')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: /Next simulation step/i }));

  expect(screen.getByText('Step 2 of 3')).toBeTruthy();
  expect(screen.getByText('Discard the left half')).toBeTruthy();
  expect(screen.getByText('Explain, defend, extend')).toBeTruthy();
});

test('searches the entire curriculum instead of only the selected section', async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <DSABeginnersPage />
      </AuthProvider>
    </MemoryRouter>
  );

  const search = await screen.findByRole('searchbox', { name: 'Search curriculum' });
  fireEvent.change(search, { target: { value: 'Dijkstra' } });

  expect(screen.getByText("Dijkstra's Algorithm")).toBeTruthy();
  expect(screen.getByText(/1 concepts match across every learning track/i)).toBeTruthy();
});

test('filters the visual concept library and keeps learn and simulate actions together', () => {
  render(
    <MemoryRouter>
      <ConceptsPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByRole('searchbox', { name: 'Search concepts' }), {
    target: { value: 'priority queue' },
  });

  expect(screen.getByText('Heap / Priority Queue')).toBeTruthy();
  expect(screen.getByText('1 module')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Learn concept' }).getAttribute('href'))
    .toBe('/dsa-beginners/trees-heap-min-heap-max-heap');
  expect(screen.getByRole('link', { name: /Open simulator/i }).getAttribute('href'))
    .toBe('/simulator#heap');
});
