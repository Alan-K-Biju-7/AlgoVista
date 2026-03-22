import { Link } from 'react-router-dom';

const stats = [
  { value: '8', label: 'modules' },
  { value: '3', label: 'sort algorithms' },
  { value: '1', label: 'search algorithm' },
  { value: '4', label: 'data structures' },
];

const topics = [
  { icon: '▦', label: 'Array',          desc: 'Insert, delete, update, linear search with index highlights.' },
  { icon: '⬡', label: 'Linked list',    desc: 'HEAD pointer, NULL terminator, traversal animation, all ops.' },
  { icon: '⬆', label: 'Stack',          desc: 'Push and pop with LIFO visualisation and step history.' },
  { icon: '⇉', label: 'Queue',          desc: 'Enqueue and dequeue with front and rear pointer labels.' },
  { icon: '⌖', label: 'Binary search',  desc: 'Sorted array, mid pointer, eliminated halves fade live.' },
  { icon: '↕', label: 'Bubble sort',    desc: 'Adjacent swaps, pass counter, slow/normal/fast speed.' },
  { icon: '⤓', label: 'Insertion sort', desc: 'Key element, sorted portion, shift counter per step.' },
  { icon: '↓', label: 'Selection sort', desc: 'Minimum tracker, scan pointer, exactly n−1 swaps.' },
];

function HomePage() {
  return (
    <div>

      <section style={{ position: 'relative', overflow: 'hidden', padding: '5rem 1.5rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          position: 'absolute', top: '-6rem', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.8rem', borderRadius: '999px',
            border: '1px solid rgba(99,102,241,0.3)',
            background: 'rgba(99,102,241,0.08)',
            fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-light)',
            marginBottom: '1.5rem',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            Interactive DSA lab
          </span>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: '800',
            lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: '1.25rem', maxWidth: '22rem',
          }}>
            Learn DSA by{' '}
            <span style={{
              background: 'linear-gradient(135deg, #e0e7ff 0%, #818cf8 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              watching it happen
            </span>
          </h1>

          <p style={{ maxWidth: '34rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            AlgoVista is a visual lab where you push, pop, sort, and search
            instead of just reading about it. Every pointer move, swap, and
            comparison is shown one step at a time.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link to="/simulator" style={{
              padding: '0.7rem 1.4rem', borderRadius: '0.5rem',
              background: 'var(--accent-dim)', color: '#fff',
              fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none',
              border: '1px solid var(--accent-dim)',
              boxShadow: '0 0 0 0 var(--accent-glow)',
              transition: 'box-shadow 0.2s ease, background 0.2s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--accent-glow), 0 4px 16px rgba(99,102,241,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Open simulator →
            </Link>
            <Link to="/concepts" style={{
              padding: '0.7rem 1.4rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-default)', background: 'transparent',
              color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none',
              transition: 'color 0.15s, border-color 0.15s, background 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Browse concepts
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>What you can explore</h2>
          <Link to="/simulator" style={{ fontSize: '0.82rem', color: 'var(--accent-light)', textDecoration: 'none', fontWeight: '500' }}>
            Open all in simulator →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.75rem' }}>
          {topics.map((t) => (
            <div
              key={t.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.1rem 1.15rem',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.1), 0 4px 16px rgba(0,0,0,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1rem', color: 'var(--accent-light)' }}>{t.icon}</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.88rem' }}>{t.label}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '1.75rem', padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(99,102,241,0.2)',
          background: 'rgba(99,102,241,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
              Ready to try it?
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Every algorithm has Step, Auto run, and speed controls.
            </p>
          </div>
          <Link to="/simulator" style={{
            padding: '0.6rem 1.25rem', borderRadius: '0.5rem',
            background: 'var(--accent-dim)', color: '#fff',
            fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Open simulator
          </Link>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
