import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/',          label: 'Home'      },
  { to: '/concepts',  label: 'Concepts'  },
  { to: '/simulator', label: 'Simulator' },
  { to: '/about',     label: 'About'     },
];

export default function MainLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: '60px',
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #00d4aa, #00a884)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0,212,170,0.35)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#031a14' }}>A</span>
          </div>
          <span style={{ fontWeight: '800', fontSize: '1rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Algo<span style={{ color: 'var(--accent)' }}>Vista</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          {navLinks.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} style={{
                padding: '0.38rem 0.9rem',
                borderRadius: '0.45rem',
                fontSize: '0.85rem',
                fontWeight: active ? '600' : '400',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                background: active ? 'var(--accent-glow)' : 'transparent',
                border: active ? '1px solid var(--border-accent)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}>
                {label}
              </Link>
            );
          })}
        </nav>

      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'linear-gradient(135deg, #00d4aa, #00a884)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: '900', color: '#031a14' }}>A</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} AlgoVista
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[{ to: '/concepts', l: 'Concepts' }, { to: '/simulator', l: 'Simulator' }, { to: '/about', l: 'About' }].map(({ to, l }) => (
            <Link key={to} to={to} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', transition: 'color 0.15s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >{l}</Link>
          ))}
        </div>
      </footer>

    </div>
  );
}
