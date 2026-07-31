import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ConceptsPage from './ConceptsPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ConceptsPage />
    </MemoryRouter>
  );
}

describe('ConceptsPage discovery', () => {
  test('searches the visual concept library and exposes both learning paths', () => {
    renderPage();

    fireEvent.change(screen.getByRole('searchbox', { name: /Search concepts/i }), {
      target: { value: 'Bellman' },
    });

    expect(screen.getByRole('heading', { name: 'Bellman-Ford' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Array' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn concept' })).toHaveAttribute(
      'href',
      '/dsa-beginners/graphs-bellman-ford-algorithm'
    );
    expect(screen.getByRole('link', { name: /Open simulator/i })).toHaveAttribute(
      'href',
      '/simulator#bellmanford'
    );
  });

  test('filters modules by learning phase and reports the result count', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /P1 · Linear data structures/i }));

    expect(document.querySelector('.concepts-results')).toHaveTextContent('4 modules');
    expect(screen.getByRole('heading', { name: 'Array' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'BST' })).not.toBeInTheDocument();
  });
});
