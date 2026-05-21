import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/concepts', label: 'Learn' },
  { to: '/simulator', label: 'Visualize' },
  { to: '/practice', label: 'Practice' },
  { to: '/ai', label: 'AI Coach' },
  { to: '/about', label: 'About' },
];

function isActivePath(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function MainLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="app-brand" aria-label="AlgoVista home">
          <span className="app-brand__mark">A</span>
          <span className="app-brand__text">
            Algo<span>Vista</span>
          </span>
        </Link>

        <nav className="app-nav" aria-label="Primary navigation">
          {navLinks.map(({ to, label }) => {
            const active = isActivePath(pathname, to);

            return (
              <Link key={to} to={to} className={active ? 'is-active' : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>

        <Link to="/simulator" className="app-header__cta">
          Start
        </Link>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <div className="app-footer__brand">
          <span className="app-brand__mark app-brand__mark--small">A</span>
          <span>© {new Date().getFullYear()} AlgoVista</span>
        </div>

        <div className="app-footer__links">
          {navLinks.slice(1).map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
