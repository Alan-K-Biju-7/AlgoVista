import ArrayVisualizer from '../modules/array/ArrayVisualizer';
import StackVisualizer from '../modules/stack/StackVisualizer';
import QueueVisualizer from '../modules/queue/QueueVisualizer';
import BubbleSortVisualizer from '../modules/sorting/BubbleSortVisualizer';
import InsertionSortVisualizer from '../modules/sorting/InsertionSortVisualizer';

function SimulatorPage() {
  return (
    <div style={{ paddingInline: '0.5rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Live DSA simulator</h1>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Arrays
        </h2>
        <ArrayVisualizer />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Stack
        </h2>
        <StackVisualizer />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Queue
        </h2>
        <QueueVisualizer />
      </section>

      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Sorting (bubble & insertion)
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem',
          }}
        >
          <BubbleSortVisualizer />
          <InsertionSortVisualizer />
        </div>
        <div
          style={{
            marginTop: '1.75rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
            fontSize: '0.85rem',
          }}
        >
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
            Comparison hint
          </h3>
          <p style={{ lineHeight: 1.6, color: '#e5e7eb' }}>
            Use the counters in each card to compare how many comparisons and
            swaps/shifts bubble sort and insertion sort perform on the same
            input. Insertion sort usually does fewer writes than bubble sort,
            especially when the array is partially sorted.
          </p>
        </div>
      </section>
    </div>
  );
}

export default SimulatorPage;
