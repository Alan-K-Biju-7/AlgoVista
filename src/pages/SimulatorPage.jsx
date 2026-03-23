import ArrayVisualizer from '../modules/array/ArrayVisualizer';
import StackVisualizer from '../modules/stack/StackVisualizer';
import QueueVisualizer from '../modules/queue/QueueVisualizer';
import LinkedListVisualizer from '../modules/linkedlist/LinkedListVisualizer';
import BinarySearchVisualizer from '../modules/searching/BinarySearchVisualizer';
import BubbleSortVisualizer from '../modules/sorting/BubbleSortVisualizer';
import InsertionSortVisualizer from '../modules/sorting/InsertionSortVisualizer';
import SelectionSortVisualizer from '../modules/sorting/SelectionSortVisualizer';
import BSTVisualizer from '../modules/bst/BSTVisualizer';
import AVLVisualizer from '../modules/avl/AVLVisualizer';

const sections = [
  { id: 'array',      label: 'Array',          Component: ArrayVisualizer },
  { id: 'linkedlist', label: 'Linked List',     Component: LinkedListVisualizer },
  { id: 'stack',      label: 'Stack',           Component: StackVisualizer },
  { id: 'queue',      label: 'Queue',           Component: QueueVisualizer },
  { id: 'bst',        label: 'BST',             Component: BSTVisualizer },
  { id: 'avl',        label: 'AVL Tree',         Component: AVLVisualizer },
  { id: 'bsearch',    label: 'Binary Search',   Component: BinarySearchVisualizer },
  { id: 'bubble',     label: 'Bubble Sort',     Component: BubbleSortVisualizer },
  { id: 'insertion',  label: 'Insertion Sort',  Component: InsertionSortVisualizer },
  { id: 'selection',  label: 'Selection Sort',  Component: SelectionSortVisualizer },
];

function SimulatorPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>Simulator</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '2.5rem' }}>
        Every module is live — interact directly with the structures below.
      </p>
      {sections.map(({ id, label, Component }) => (
        <section key={id} id={id} style={{ marginBottom: '3.5rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: '1rem', paddingBottom: '0.6rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{label}</h2>
          </div>
          <Component />
        </section>
      ))}
    </div>
  );
}

export default SimulatorPage;
