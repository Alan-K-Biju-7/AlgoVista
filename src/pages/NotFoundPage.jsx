import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-wrapper" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <section
        style={{
          width: 'min(100%, 680px)',
          padding: '2rem',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          background: 'var(--bg-card)',
        }}
      >
        <span className="badge-teal">404</span>
        <h1 style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 900 }}>Page not found</h1>
        <p style={{ margin: '0.7rem 0 1.4rem', lineHeight: 1.7 }}>
          This route is not part of the current AlgoVista learning map.
        </p>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Link to="/dsa-beginners" className="btn-primary" style={{ padding: '0.65rem 1rem', borderRadius: '8px' }}>
            DSA Path
          </Link>
          <Link to="/simulator" className="btn-ghost" style={{ padding: '0.65rem 1rem', borderRadius: '8px' }}>
            Simulator
          </Link>
          <Link to="/practice" className="btn-ghost" style={{ padding: '0.65rem 1rem', borderRadius: '8px' }}>
            Practice
          </Link>
        </div>
      </section>
    </div>
  );
}
