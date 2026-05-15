import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
}), { virtual: true });

test('renders the AlgoVista landing page', () => {
  render(<App />);
  expect(screen.getAllByText(/AlgoVista/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Open Simulator/i)).toBeInTheDocument();
});
