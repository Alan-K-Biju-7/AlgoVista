import { Link } from 'react-router-dom';
import { NEETCODE150 } from './practice/neetcode150';

const stats = [
  { value: String(NEETCODE150.length), label: 'NC150 Problems' },
  { value: '18',  label: 'Visual Modules' },
  { value: '17',  label: 'Pattern Groups' },
  { value: '7',   label: 'Code Tracers' },
];

const phases = [
  { num: '01', label: 'Linear DS',    desc: 'Arrays, Linked Lists, Stacks & Queues',  color: '#00d4aa' },
  { num: '02', label: 'Trees, Graphs & ADT',  desc: 'BST, AVL, Graph, Heap, Hash, Trie', color: '#4a9eff' },
  { num: '03', label: 'Algorithms',   desc: 'Binary Search, Bubble, Insertion, Selection Sort', color: '#8b7cf8' },
  { num: '04', label: 'Practice Track',  desc: 'Curated NC150 patterns with score, tests, hints, and visual links', color: '#f5a623' },
];

const topics = [
  { icon: '▦', label: 'Array',          phase: 'P1', desc: 'Insert, delete, update, linear search.' },
  { icon: '⬡', label: 'Linked List',    phase: 'P1', desc: 'HEAD pointer, traversal, all ops.' },
  { icon: '⬆', label: 'Stack',          phase: 'P1', desc: 'Push / pop with LIFO step history.' },
  { icon: '⇉', label: 'Queue',          phase: 'P1', desc: 'Enqueue / dequeue with pointer labels.' },
  { icon: '🌲', label: 'BST',           phase: 'P2', desc: 'Insert, delete, search, traversals.' },
  { icon: '→',   label: 'Dijkstra',     phase: 'P2', desc: 'Weighted shortest path — live dist table, PQ snapshot, path reconstruction with cost.' },
  { icon: '✦',   label: 'Trie',          phase: 'P2', desc: 'Prefix tree: insert words, search, autocomplete suggestions — letter by letter animation.' },
  { icon: '#',   label: 'Hash Table',    phase: 'P2', desc: 'djb2 hash, separate chaining, live load factor λ, collision visualization.' },
  { icon: '⬡',  label: 'Heap',          phase: 'P2', desc: 'Min-heap: insert bubbles up, extract-min heapifies down. Array + tree view.' },
  { icon: '◉',  label: 'Graph',          phase: 'P2', desc: 'BFS (queue, shortest path) and DFS (stack, deep dive) — drag nodes to rearrange.' },
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
        <div className="practice-home-panel" style={{
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
            AlgoVista pairs visual DSA modules with a curated NeetCode practice track,
            scoring, explanations, tests, and traces where the problem can be replayed.
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
            <Link to="/practice" style={{
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
              NC150 Practice
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

      <section style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 2.5rem 4rem' }}>
        <div style={{
          border: '1px solid rgba(0,212,170,0.22)',
          borderRadius: 'var(--radius-2xl)',
          background: 'var(--bg-card)',
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 1.1fr) repeat(3, minmax(180px, 0.7fr))',
          gap: '0.85rem',
          alignItems: 'stretch',
        }}>
          <div>
            <p className="section-label" style={{ color: 'var(--accent)' }}>Curated practice</p>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>NeetCode 150 with score, visuals, and explanations</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Start from Arrays & Hashing, move through graphs and DP, save bookmarks, run tests, and build a visible practice score.
            </p>
            <Link to="/practice" className="btn-primary" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.65rem 1.15rem',
              borderRadius: '0.55rem',
              textDecoration: 'none',
            }}>
              Open Practice
            </Link>
          </div>

          {[
            { title: 'Score', copy: 'Solved problems add 10 points; attempts add 3 points.' },
            { title: 'Visuals', copy: 'Every problem links back to the closest simulator model.' },
            { title: 'Explanations', copy: 'Each detail page carries examples, hints, and key insight notes.' },
          ].map((item) => (
            <div key={item.title} style={{
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              background: 'rgba(255,255,255,0.015)',
            }}>
              <p style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {item.title}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHASES ── */}
      <section style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 2.5rem 5rem' }}>
        <p className="section-label">Learning path</p>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.75rem' }}>Four phases, one goal</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '4rem' }}>
          {phases.map((p) => (
            <div key={p.num} style={{
              background: 'var(--bg-card)', border: `1px solid ${p.color}22`,
              borderRadius: 'var(--radius-xl)', padding: '1.25rem',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${p.color}55`; e.currentTarget.style.boxShadow = `0 0 20px ${p.color}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${p.color}22`; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: p.color, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>{p.num}</span>
                <span style={{ padding: '0.18rem 0.55rem', borderRadius: '999px', background: `${p.color}18`, border: `1px solid ${p.color}33`, fontSize: '0.65rem', fontWeight: '700', color: p.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Phase</span>
              </div>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{p.label}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Topic grid */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p className="section-label">All modules</p>
            <h2 style={{ fontSize: '1.4rem' }}>What you can explore</h2>
          </div>
          <Link to="/simulator" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            Open all in simulator →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.65rem', marginBottom: '2.5rem' }}>
          {topics.map((t) => {
            const pc = phaseColor[t.phase];
            return (
              <div key={t.label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)', padding: '1.1rem',
                transition: 'border-color 0.2s, box-shadow 0.2s', cursor: 'default',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${pc}44`; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${pc}22`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.95rem', color: pc }}>{t.icon}</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.86rem' }}>{t.label}</span>
                  </div>
                  <span style={{ padding: '0.12rem 0.45rem', borderRadius: '999px', background: `${pc}15`, border: `1px solid ${pc}30`, fontSize: '0.6rem', fontWeight: '700', color: pc }}>{t.phase}</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA banners */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          <div style={{
            padding: '1.75rem 2rem', borderRadius: 'var(--radius-2xl)',
            border: '1px solid rgba(0,212,170,0.2)',
            background: 'linear-gradient(135deg, rgba(0,212,170,0.06) 0%, rgba(0,168,132,0.03) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1.25rem',
            boxShadow: '0 0 40px rgba(0,212,170,0.06)',
          }}>
            <div>
              <p style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Ready to visualize?</p>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Step through every algorithm live.</p>
            </div>
            <Link to="/simulator" style={{
              padding: '0.7rem 1.5rem', borderRadius: '0.55rem',
              background: 'var(--accent)', color: '#031a14',
              fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none',
              whiteSpace: 'nowrap', flexShrink: 0,
              boxShadow: '0 0 16px rgba(0,212,170,0.25)',
              transition: 'all 0.15s',
            }}>
              Open Simulator
            </Link>
          </div>
          <div style={{
            padding: '1.75rem 2rem', borderRadius: 'var(--radius-2xl)',
            border: '1px solid rgba(139,124,248,0.2)',
            background: 'linear-gradient(135deg, rgba(139,124,248,0.06) 0%, rgba(100,90,200,0.03) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1.25rem',
            boxShadow: '0 0 40px rgba(139,124,248,0.06)',
          }}>
            <div>
              <p style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Ready to practice?</p>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Solve problems with hints, editor and test cases.</p>
            </div>
            <Link to="/practice" style={{
              padding: '0.7rem 1.5rem', borderRadius: '0.55rem',
              background: '#8b7cf8', color: '#fff',
              fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none',
              whiteSpace: 'nowrap', flexShrink: 0,
              boxShadow: '0 0 16px rgba(139,124,248,0.25)',
              transition: 'all 0.15s',
            }}>
              Start Practicing
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
