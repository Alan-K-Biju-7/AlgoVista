import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/',          label: 'Home'      },
  { to: '/concepts',  label: 'Concepts'  },
  { to: '/simulator', label: 'Simulator' },
  { to: '/about',     label: 'About'     },
];

function MainLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '56px',
        background: 'rgba(2,8,23,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
      }}>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: '26px', height: '26px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: '800', color: '#fff', flexShrink: 0,
          }}>A</span>
          <span style={{
            fontWeight: '700', fontSize: '0.95rem', letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #e0e7ff, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>AlgoVista</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {navLinks.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#e0e7ff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-elevated)'; }}}
                onMouseLeave={(e) => { if (!isActive) { e.target.style.color = 'var(--text-muted)'; e.target.style.background = 'transparent'; }}}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} AlgoVista — Visual DSA lab
        </span>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {[{ to: '/concepts', label: 'Concepts' }, { to: '/simulator', label: 'Simulator' }, { to: '/about', label: 'About' }].map(({ to, label }) => (
            <Link key={to} to={to} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >{label}</Link>
          ))}
        </div>
      </footer>

    </div>
  );
}

export default MainLayout;
