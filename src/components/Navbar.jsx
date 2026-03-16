import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/concepts', label: 'Concepts' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/about', label: 'About' },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 15, 30, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e293b',
        padding: '0 1.5rem',
        height: '3.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: '700',
          fontSize: '1.1rem',
          color: '#818cf8',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        AlgoVista
      </Link>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                padding: '0.35rem 0.85rem',
                borderRadius: '0.45rem',
                fontSize: '0.875rem',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#4f46e5' : 'transparent',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
