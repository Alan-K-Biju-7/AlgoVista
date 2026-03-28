import { Link } from 'react-router-dom';

const stack = [
  { label: 'React 18',          desc: 'Component architecture, hooks, state management' },
  { label: 'React Router v6',   desc: 'Client-side routing and navigation' },
  { label: 'SVG (native)',      desc: 'All tree visualizations — no canvas library needed' },
  { label: 'Vanilla CSS-in-JS', desc: 'Inline styles + CSS variables, zero dependencies' },
  { label: 'Git + GitHub',      desc: 'Version control, commit-by-commit feature building' },
];

const features = [
  { icon: '🎬', label: 'Step-by-step animation',   desc: 'Every operation is broken into discrete steps you can step through manually or auto-run.' },
  { icon: '⚖️', label: 'AVL rotations',            desc: 'LL, RR, LR, RL — each rotation fires a live panel explaining why it happened.' },
  { icon: '🌲', label: 'SVG tree rendering',        desc: 'Trees are rendered with a custom in-order layout engine — no third-party library.' },
  { icon: '📊', label: 'Complexity breakdown',      desc: 'Every concept card shows time and space complexity with colour-coded tokens.' },
  { icon: '📝', label: 'Step history log',          desc: 'Every operation is logged with type badges so you can trace exactly what happened.' },
  { icon: '🔍', label: 'Animated search',           desc: 'Binary search, BST search, and AVL search all animate path traversal node-by-node.' },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Header */}
      <span className="badge-teal" style={{ marginBottom: '1.25rem' }}>About</span>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.75rem' }}>About AlgoVista</h1>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '44rem', lineHeight: 1.8, marginBottom: '3.5rem' }}>
        AlgoVista is a self-built visual DSA lab — built as a learning project to make
        data structures and algorithms tangible instead of abstract. Every feature was
        implemented commit by commit: logic first, then visualizer, then UI.
      </p>

      {/* Features grid */}
      <div style={{ marginBottom: '3.5rem' }}>
        <p className="section-label">What's inside</p>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Key features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {features.map((f) => (
            <div key={f.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)', padding: '1.25rem',
              display: 'flex', gap: '0.9rem', alignItems: 'flex-start',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,170,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '9px', flexShrink: 0,
                background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
              }}>{f.icon}</div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{f.label}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div style={{ marginBottom: '3.5rem' }}>
        <p className="section-label">Built with</p>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Tech stack</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '560px' }}>
          {stack.map((s, i) => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.85rem 1.1rem',
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,170,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            >
              <span style={{
                width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0,
                background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: '900', color: 'var(--accent)',
              }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p style={{ fontWeight: '700', fontSize: '0.86rem', color: 'var(--text-primary)' }}>{s.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: '2rem', borderRadius: 'var(--radius-2xl)',
        border: '1px solid rgba(0,212,170,0.2)',
        background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(0,168,132,0.03))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
        boxShadow: '0 0 40px rgba(0,212,170,0.06)',
      }}>
        <div>
          <p style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            See it in action
          </p>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
            15 modules — arrays, linked list, stack, queue, BST, AVL, graph, heap, hash table, trie, sorting, search.
          </p>
        </div>
        <Link to="/simulator" style={{
          padding: '0.7rem 1.5rem', borderRadius: '0.55rem',
          background: 'var(--accent)', color: '#031a14',
          fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none',
          boxShadow: '0 0 16px rgba(0,212,170,0.25)', flexShrink: 0,
        }}>
          Open Simulator
        </Link>
      </div>

    </div>
  );
}
