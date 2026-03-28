import { useState } from 'react';
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
import GraphVisualizer from '../modules/graph/GraphVisualizer';
import HeapVisualizer from '../modules/heap/HeapVisualizer';
import HashVisualizer from '../modules/hashtable/HashVisualizer';
import TrieVisualizer from '../modules/trie/TrieVisualizer';

const sections = [
  { id: 'array',      label: 'Array',          phase: 'P1', color: '#00d4aa', Component: ArrayVisualizer },
  { id: 'linkedlist', label: 'Linked List',     phase: 'P1', color: '#00d4aa', Component: LinkedListVisualizer },
  { id: 'stack',      label: 'Stack',           phase: 'P1', color: '#00d4aa', Component: StackVisualizer },
  { id: 'queue',      label: 'Queue',           phase: 'P1', color: '#00d4aa', Component: QueueVisualizer },
  { id: 'bst',        label: 'BST',             phase: 'P2', color: '#4a9eff', Component: BSTVisualizer },
  { id: 'avl',        label: 'AVL Tree',        phase: 'P2', color: '#4a9eff', Component: AVLVisualizer },
  { id: 'bsearch',    label: 'Binary Search',   phase: 'P3', color: '#8b7cf8', Component: BinarySearchVisualizer },
  { id: 'bubble',     label: 'Bubble Sort',     phase: 'P3', color: '#8b7cf8', Component: BubbleSortVisualizer },
  { id: 'insertion',  label: 'Insertion Sort',  phase: 'P3', color: '#8b7cf8', Component: InsertionSortVisualizer },
  { id: 'selection',  label: 'Selection Sort',  phase: 'P3', color: '#8b7cf8', Component: SelectionSortVisualizer },
];

const phaseGroups = [
  { phase: 'P1', label: 'Linear DS',  color: '#00d4aa' },
  { phase: 'P2', label: 'Trees',      color: '#4a9eff' },
  { phase: 'P3', label: 'Algorithms', color: '#8b7cf8' },
];

export default function SimulatorPage() {
  const [activeId, setActiveId] = useState('array');

  const scrollTo = (id) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ display: 'flex', maxWidth: '1160px', margin: '0 auto', padding: '2rem 1.5rem', gap: '1.75rem' }}>

      {/* Sidebar */}
      <aside style={{
        width: '200px', flexShrink: 0,
        position: 'sticky', top: '76px',
        height: 'fit-content', alignSelf: 'flex-start',
      }}>
        <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Jump to</p>
        {phaseGroups.map((pg) => (
          <div key={pg.phase} style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: pg.color, marginBottom: '0.4rem', paddingLeft: '0.5rem' }}>{pg.label}</p>
            {sections.filter((s) => s.phase === pg.phase).map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                width: '100%', textAlign: 'left', padding: '0.42rem 0.6rem',
                borderRadius: '0.45rem', border: 'none', cursor: 'pointer',
                background: activeId === s.id ? `${s.color}15` : 'transparent',
                color: activeId === s.id ? s.color : 'var(--text-muted)',
                fontSize: '0.82rem', fontWeight: activeId === s.id ? '600' : '400',
                transition: 'all 0.15s', marginBottom: '0.1rem',
                borderLeft: activeId === s.id ? `2px solid ${s.color}` : '2px solid transparent',
              }}>
                {s.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.4rem' }}>Simulator</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Every module is live — interact directly with the structures below.</p>
        </div>

        {sections.map(({ id, label, phase, color, Component }) => (
          <section key={id} id={id} style={{ marginBottom: '4rem', scrollMarginTop: '80px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.25rem', paddingBottom: '0.75rem',
              borderBottom: `1px solid var(--border-subtle)`,
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
              <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '700' }}>{label}</h2>
              <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', background: `${color}15`, border: `1px solid ${color}30`, fontSize: '0.62rem', fontWeight: '700', color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{phase}</span>
            </div>
            <Component />
          </section>
        ))}
      </div>

    </div>
  );
}
