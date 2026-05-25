import { Link, useLocation } from 'react-router-dom';
import '../styles/layout.css';

const navLinks = [
  { to: '/',              label: 'Home'      },
  { to: '/dsa-beginners', label: 'DSA Path'  },
  { to: '/coach',         label: 'AI Coach'  },
  { to: '/practice',      label: 'Practice'  },
  { to: '/simulator',     label: 'Simulator' },
  { to: '/concepts',      label: 'Concepts'  },
  { to: '/about',         label: 'About'     },
];

export default function MainLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">

      <header className="app-header">

        <Link to="/" className="app-brand" aria-label="AlgoVista home">
          <div className="app-brand__mark">
            <span>A</span>
          </div>
          <span className="app-brand__word">
            Algo<span style={{ color: 'var(--accent)' }}>Vista</span>
          </span>
        </Link>

        <nav className="app-nav" aria-label="Primary navigation">
          {navLinks.map(({ to, label }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
            return (
              <Link key={to} to={to} className={active ? 'app-nav__link is-active' : 'app-nav__link'}>
                {label}
              </Link>
            );
          })}
        </nav>

      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="app-footer">
        <div className="app-footer__brand">
          <div className="app-footer__mark">
            <span>A</span>
          </div>
          <span>
            © {new Date().getFullYear()} AlgoVista
          </span>
        </div>
        <div className="app-footer__links">
          {[{ to: '/dsa-beginners', l: 'DSA Path' }, { to: '/coach', l: 'AI Coach' }, { to: '/practice', l: 'Practice' }, { to: '/simulator', l: 'Simulator' }].map(({ to, l }) => (
            <Link key={to} to={to}>{l}</Link>
          ))}
        </div>
      </footer>

    </div>
  );
}
