import ArrayVisualizer from '../modules/array/ArrayVisualizer';
import StackVisualizer from '../modules/stack/StackVisualizer';
import QueueVisualizer from '../modules/queue/QueueVisualizer';
import BubbleSortVisualizer from '../modules/sorting/BubbleSortVisualizer';
import InsertionSortVisualizer from '../modules/sorting/InsertionSortVisualizer';

import InsertionSortVisualizer from '../modules/sorting/InsertionSortVisualizer';

function SimulatorPage() {
  return (
    <div>
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

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Sorting (bubble & insertion)
        </h2>
        <BubbleSortVisualizer />
        <InsertionSortVisualizer />
      </section>
    </div>
  );
}

export default SimulatorPage;
