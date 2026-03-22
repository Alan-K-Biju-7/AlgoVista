import { Link } from 'react-router-dom';

const featureCard = {
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

const topics = [
  { label: 'Array', desc: 'Insert, delete, update, linear search with step-by-step highlighting.' },
  { label: 'Linked list', desc: 'HEAD pointer, NULL terminator, traversal animation, all operations.' },
  { label: 'Stack', desc: 'Push and pop with LIFO visualisation and history log.' },
  { label: 'Queue', desc: 'Enqueue and dequeue with front and rear pointer labels.' },
  { label: 'Binary search', desc: 'Sorted array, mid pointer, eliminated halves fade in real time.' },
  { label: 'Bubble sort', desc: 'Adjacent swaps, pass counter, slow/normal/fast speed control.' },
  { label: 'Insertion sort', desc: 'Key element, sorted portion, shift counter, per-step explanation.' },
  { label: 'Selection sort', desc: 'Minimum tracker, scan pointer, exactly n−1 swaps highlighted.' },
];

function HomePage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      <section style={{ marginBottom: '4rem', paddingTop: '2rem' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4f46e5', marginBottom: '1rem' }}>
          Visual DSA lab
        </p>
        <h1 style={{ fontSize: '2.6rem', lineHeight: 1.2, marginBottom: '1.25rem', maxWidth: '28rem' }}>
          Learn DSA by watching every step happen
        </h1>
        <p style={{ maxWidth: '34rem', lineHeight: 1.75, color: '#94a3b8', marginBottom: '2rem', fontSize: '0.95rem' }}>
          AlgoVista is an interactive lab where you can push, pop, sort, and search
          instead of just reading about it. Every pointer move, swap, and comparison
          is shown one step at a time.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/simulator"
            style={{ padding: '0.7rem 1.4rem', borderRadius: '0.5rem', background: '#4f46e5', color: '#fff', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}
          >
            Open simulator
          </Link>
          <Link
            to="/concepts"
            style={{ padding: '0.7rem 1.4rem', borderRadius: '0.5rem', border: '1px solid #1e293b', background: 'transparent', color: '#94a3b8', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none' }}
          >
            Browse concepts
          </Link>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: '#e2e8f0' }}>What you can explore</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
          {topics.map((t) => (
            <div key={t.label} style={featureCard}>
              <p style={{ fontWeight: '600', color: '#c7d2fe', marginBottom: '0.4rem', fontSize: '0.9rem' }}>{t.label}</p>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.65 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default HomePage;
