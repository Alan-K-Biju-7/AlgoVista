import ArrayVisualizer from '../modules/array/ArrayVisualizer';
import StackVisualizer from '../modules/stack/StackVisualizer';
function HomePage() {
  return (
    <div>
      <section id="hero" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Learn DSA by watching every step happen
        </h1>
        <p style={{ maxWidth: '32rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          AlgoVista is a small visual lab where you can play with arrays, stacks,
          queues, and classic algorithms instead of just reading about them.
        </p>
        <div>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              marginRight: '1rem',
              borderRadius: '999px',
              border: 'none',
              background: '#22c55e',
              color: '#020617',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Explore concepts
          </button>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              border: '1px solid #374151',
              background: 'transparent',
              color: '#e5e7eb',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Try live simulator
          </button>
        </div>
      </section>

      <section id="concepts" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Core topics planned for v1
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          The first version focuses on a small but solid set of data structures and algorithms.
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
          <li>Arrays: insert, delete, update, traverse, linear search</li>
          <li>Linked lists: basic operations and traversal</li>
          <li>Stacks and queues with push / pop / enqueue / dequeue</li>
          <li>Sorting basics: bubble, insertion, and merge sort previews</li>
        </ul>
      </section>

      <section id="simulator">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Start with arrays
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Use this early prototype to add numbers and see how the array changes in memory.
        </p>

        <ArrayVisualizer />
      </section>
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
         Try the stack next
       </h2>
        <StackVisualizer />
      </section>

    </div>
  );
}

export default HomePage;
