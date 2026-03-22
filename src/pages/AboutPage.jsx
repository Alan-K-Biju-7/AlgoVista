const card = {
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  padding: '1.5rem',
};

const stack = [
  { label: 'React', desc: 'Component-based UI, hooks for animation state and interval timers.' },
  { label: 'React Router', desc: 'Client-side routing between Home, Concepts, Simulator, and About.' },
  { label: 'Inline styles', desc: 'No CSS framework — every style is written in JS for full control.' },
  { label: 'ESLint', desc: 'Enforces consistent code style across all visualizer modules.' },
];

const modules = [
  'Array — insert, update, delete, linear search',
  'Linked list — head/null pointers, insert, delete, traversal search',
  'Stack — push, pop, LIFO visualisation',
  'Queue — enqueue, dequeue, FIFO visualisation',
  'Binary search — sorted array, mid pointer, half elimination',
  'Bubble sort — adjacent swap, pass counter, speed control',
  'Insertion sort — key insertion, shift counter, step explanation',
  'Selection sort — minimum tracker, n−1 swaps, speed control',
];

function AboutPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>About AlgoVista</h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem', maxWidth: '42rem', lineHeight: 1.7 }}>
        A visual lab for learning data structures and algorithms by interacting with them directly —
        not just reading about them.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

        <div style={card}>
          <h2 style={{ fontSize: '1rem', color: '#e2e8f0', marginBottom: '0.85rem' }}>Why this project</h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.8 }}>
            Most DSA resources explain algorithms with static diagrams or walls of pseudocode.
            AlgoVista was built to fill the gap — a place where you can slow down any algorithm,
            step through it one operation at a time, and watch every pointer and counter update live.
          </p>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: '1rem', color: '#e2e8f0', marginBottom: '0.85rem' }}>Tech stack</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stack.map((s) => (
              <div key={s.label}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#818cf8' }}>{s.label} — </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={card}>
        <h2 style={{ fontSize: '1rem', color: '#e2e8f0', marginBottom: '0.85rem' }}>Modules built</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          {modules.map((m) => (
            <p key={m} style={{ fontSize: '0.8rem', color: '#94a3b8', borderLeft: '2px solid #1e293b', paddingLeft: '0.6rem', lineHeight: 1.65 }}>
              {m}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AboutPage;
