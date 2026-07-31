import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOptionalAuth } from '../context/AuthContext';
import '../styles/layout.css';

const navLinks = [
  { to: '/',              label: 'Home'      },
  { to: '/dsa-beginners', label: 'DSA Path'  },
  { to: '/coach',         label: 'AI Coach', requiresAuth: true },
  { to: '/practice',      label: 'Practice'  },
  { to: '/simulator',     label: 'Simulator' },
  { to: '/concepts',      label: 'Concepts'  },
  { to: '/about',         label: 'About'     },
];

function getPageTitle(pathname) {
  if (pathname.startsWith('/dsa-beginners/')) return 'Concept Lesson';
  const current = navLinks.find(({ to }) => (
    to === '/' ? pathname === '/' : pathname.startsWith(to)
  ));
  return current?.label || 'Learning Workspace';
}

export default function MainLayout({ children }) {
  const { pathname } = useLocation();
  const auth = useOptionalAuth();
  const mainRef = useRef(null);
  const previousPathRef = useRef(pathname);
  const initials = String(auth?.user?.name || auth?.user?.email || 'Learner')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  useEffect(() => {
    document.title = `${getPageTitle(pathname)} | AlgoVista`;
    if (previousPathRef.current !== pathname) {
      mainRef.current?.focus({ preventScroll: false });
    }
    previousPathRef.current = pathname;
  }, [pathname]);

  return (
    <div className="app-shell">

      <a className="app-skip-link" href="#main-content">Skip to learning content</a>

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
          {navLinks.map(({ to, label, requiresAuth }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
            const locked = requiresAuth && !auth?.isAuthenticated;
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                aria-label={locked ? `${label} (sign in required)` : label}
                className={`${active ? 'app-nav__link is-active' : 'app-nav__link'} ${locked ? 'is-locked' : ''}`.trim()}
              >
                <span>{label}</span>
                {locked && <small className="app-nav__access"><span aria-hidden="true">▣</span> Sign in</small>}
              </Link>
            );
          })}
        </nav>

        {auth?.isAuthenticated ? (
          <div className="app-account" aria-label="Signed-in learner account">
            <span className="app-account__avatar" aria-hidden="true">{initials || 'AV'}</span>
            <span className="app-account__identity">
              <b>{auth.user.name}</b>
              <small>Progress syncing</small>
            </span>
            <button type="button" onClick={auth.logout} disabled={auth.logoutPending}>
              {auth.logoutPending ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        ) : (
          <Link
            className="app-account app-account--guest"
            to="/coach"
            aria-label="Sign in to sync progress and unlock AI coaching"
          >
            <span className="app-account__avatar" aria-hidden="true">↗</span>
            <span className="app-account__identity">
              <b>Sign in</b>
              <small>Sync progress + AI</small>
            </span>
          </Link>
        )}

      </header>

      {auth?.authError && (
        <div className="app-auth-alert" role="alert" aria-atomic="true">
          <span className="app-auth-alert__mark" aria-hidden="true">!</span>
          <div className="app-auth-alert__copy">
            <b>Account action needs attention</b>
            <span>{auth.authError}</span>
          </div>
          <div className="app-auth-alert__actions">
            {auth.isAuthenticated ? (
              <button type="button" onClick={auth.logout} disabled={auth.logoutPending}>
                {auth.logoutPending ? 'Retrying…' : 'Retry secure logout'}
              </button>
            ) : (
              <Link to="/coach" onClick={auth.clearAuthError}>Open sign in</Link>
            )}
            <button
              type="button"
              className="app-auth-alert__dismiss"
              onClick={auth.clearAuthError}
              aria-label="Dismiss account error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main id="main-content" ref={mainRef} tabIndex="-1" style={{ flex: 1 }}>{children}</main>

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
