import { Link } from 'react-router-dom';

const stats = [
  { value: '10+', label: 'Modules' },
  { value: '4',   label: 'Data Structures' },
  { value: '3',   label: 'Sort Algorithms' },
  { value: '2',   label: 'Tree Types' },
];

const phases = [
  { num: '01', label: 'Linear DS',    desc: 'Arrays, Linked Lists, Stacks & Queues',  color: '#00d4aa' },
  { num: '02', label: 'Trees',        desc: 'BST, AVL Tree with rotation animations', color: '#4a9eff' },
  { num: '03', label: 'Algorithms',   desc: 'Binary Search, Bubble, Insertion, Selection Sort', color: '#8b7cf8' },
  { num: '04', label: 'Coming soon',  desc: 'Graphs, Heaps, Hash Tables, Merge Sort', color: '#4a5a7a' },
];

const topics = [
  { icon: '▦', label: 'Array',          phase: 'P1', desc: 'Insert, delete, update, linear search.' },
  { icon: '⬡', label: 'Linked List',    phase: 'P1', desc: 'HEAD pointer, traversal, all ops.' },
  { icon: '⬆', label: 'Stack',          phase: 'P1', desc: 'Push / pop with LIFO step history.' },
  { icon: '⇉', label: 'Queue',          phase: 'P1', desc: 'Enqueue / dequeue with pointer labels.' },
  { icon: '🌲', label: 'BST',           phase: 'P2', desc: 'Insert, delete, search, traversals.' },
  { icon: '⚖️', label: 'AVL Tree',      phase: 'P2', desc: 'Self-balancing with LL/RR/LR/RL rotations.' },
  { icon: '⌖', label: 'Binary Search',  phase: 'P3', desc: 'Mid pointer, eliminated halves.' },
  { icon: '↕', label: 'Bubble Sort',    phase: 'P3', desc: 'Adjacent swaps, pass counter.' },
  { icon: '⤓', label: 'Insertion Sort', phase: 'P3', desc: 'Key element, shift counter.' },
  { icon: '↓', label: 'Selection Sort', phase: 'P3', desc: 'Min tracker, n−1 swaps.' },
];

const phaseColor = { P1: '#00d4aa', P2: '#4a9eff', P3: '#8b7cf8', P4: '#4a5a7a' };

export default function HomePage() {
  return (
    <div>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '6rem 2.5rem 5rem', maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,212,170,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '640px' }}>
          <span className="badge-teal" style={{ marginBottom: '1.75rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            Visual DSA Lab
          </span>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
            fontWeight: '900',
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            marginBottom: '1.35rem',
            color: 'var(--text-primary)',
          }}>
            Master DSA by<br />
            <span style={{ color: 'var(--accent)' }}>watching it happen</span>
          </h1>

          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '2.25rem', maxWidth: '480px' }}>
            AlgoVista is a visual lab where every pointer move, swap, rotation, and comparison
            is animated step by step — no more just reading about algorithms.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link to="/simulator" className="btn-primary" style={{
              padding: '0.75rem 1.6rem', borderRadius: '0.55rem',
              fontSize: '0.9rem', fontWeight: '700',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'var(--accent)', color: '#031a14',
              border: '1px solid var(--accent)', textDecoration: 'none',
              boxShadow: '0 0 20px rgba(0,212,170,0.2)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--teal-bright)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(0,212,170,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,170,0.2)'; }}
            >
              Open Simulator →
            </Link>
            <Link to="/concepts" style={{
              padding: '0.75rem 1.6rem', borderRadius: '0.55rem',
              fontSize: '0.9rem', fontWeight: '500',
              display: 'inline-flex', alignItems: 'center',
              border: '1px solid var(--border-strong)',
              background: 'transparent', color: 'var(--text-secondary)',
              textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--accent-glow2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Browse Concepts
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
