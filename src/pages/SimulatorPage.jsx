import ArrayVisualizer from '../modules/array/ArrayVisualizer';
import StackVisualizer from '../modules/stack/StackVisualizer';
import QueueVisualizer from '../modules/queue/QueueVisualizer';
import BubbleSortVisualizer from '../modules/sorting/BubbleSortVisualizer';
import InsertionSortVisualizer from '../modules/sorting/InsertionSortVisualizer';
import LinkedListVisualizer from '../modules/linkedlist/LinkedListVisualizer';
import BinarySearchVisualizer from '../modules/searching/BinarySearchVisualizer';

function SimulatorPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ marginBottom: '0.4rem', fontSize: '2rem' }}>Live DSA simulator</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Step through data structures and algorithms one operation at a time.
      </p>

      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#818cf8' }}>Arrays</h2>
        <ArrayVisualizer />
      </section>

      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#818cf8' }}>Stack</h2>
        <StackVisualizer />
      </section>

      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#818cf8' }}>Queue</h2>
        <QueueVisualizer />
      </section>

      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#818cf8' }}>Linked list</h2>
        <LinkedListVisualizer />
      </section>

      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#818cf8' }}>Binary search</h2>
        <BinarySearchVisualizer />
      </section>

      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#818cf8' }}>Sorting</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <BubbleSortVisualizer />
          <InsertionSortVisualizer />
        </div>
      </section>
    </div>
  );
}

export default SimulatorPage;
