import { useMemo, useState } from 'react';
import './SimulatorPage.css';

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
import DijkstraVisualizer from '../modules/dijkstra/DijkstraVisualizer';
import MergeSortVisualizer from '../modules/mergesort/MergeSortVisualizer';
import QuickSortVisualizer from '../modules/quicksort/QuickSortVisualizer';
import BellmanFordVisualizer from '../modules/bellmanford/BellmanFordVisualizer';

const sections = [
  {
    id: 'array',
    label: 'Array',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'Index-based storage, traversal, updates, and shifting operations.',
    Component: ArrayVisualizer,
  },
  {
    id: 'linkedlist',
    label: 'Linked List',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'Node connections, pointer movement, insertion, and deletion flow.',
    Component: LinkedListVisualizer,
  },
  {
    id: 'stack',
    label: 'Stack',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'LIFO behavior with push, pop, peek, and execution-style thinking.',
    Component: StackVisualizer,
  },
  {
    id: 'queue',
    label: 'Queue',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'FIFO processing with enqueue, dequeue, and ordering intuition.',
    Component: QueueVisualizer,
  },
  {
    id: 'bst',
    label: 'BST',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Binary search tree operations, ordering rules, and recursive paths.',
    Component: BSTVisualizer,
  },
  {
    id: 'avl',
    label: 'AVL Tree',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Self-balancing tree behavior with rotations and height updates.',
    Component: AVLVisualizer,
  },
  {
    id: 'graph',
    label: 'Graph',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Vertices, edges, traversals, adjacency logic, and connectivity.',
    Component: GraphVisualizer,
  },
  {
    id: 'heap',
    label: 'Heap',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Priority-based structure with heapify, insert, and delete behavior.',
    Component: HeapVisualizer,
  },
  {
    id: 'hashtable',
    label: 'Hash Table',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Hashing, collisions, bucket behavior, and lookup efficiency.',
    Component: HashVisualizer,
  },
  {
    id: 'trie',
    label: 'Trie',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Prefix-based lookup, branching paths, and string search structure.',
    Component: TrieVisualizer,
  },
  {
    id: 'bsearch',
    label: 'Binary Search',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Midpoint reasoning, shrinking search space, and sorted-array logic.',
    Component: BinarySearchVisualizer,
  },
  {
    id: 'bubble',
    label: 'Bubble Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Adjacent swaps, repeated passes, and comparison-heavy sorting.',
    Component: BubbleSortVisualizer,
  },
  {
    id: 'insertion',
    label: 'Insertion Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Build a sorted region step by step through insertion and shifting.',
    Component: InsertionSortVisualizer,
  },
  {
    id: 'selection',
    label: 'Selection Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Repeated minimum selection and controlled swap placement.',
    Component: SelectionSortVisualizer,
  },
  {
    id: 'mergesort',
    label: 'Merge Sort',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Divide-and-conquer splitting, merging, and recursive composition.',
    Component: MergeSortVisualizer,
  },
  {
    id: 'quicksort',
    label: 'Quick Sort',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Pivot partitioning, recursive sorting, and in-place strategy.',
    Component: QuickSortVisualizer,
  },
  {
    id: 'dijkstra',
    label: "Dijkstra's",
    phase: 'P4',
    color: '#f5a623',
    summary: 'Shortest paths with greedy relaxation and frontier updates.',
    Component: DijkstraVisualizer,
  },
  {
    id: 'bellmanford',
    label: 'Bellman-Ford',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Edge relaxation across rounds with negative-cycle awareness.',
    Component: BellmanFordVisualizer,
  },
];

const phaseGroups = [
  { phase: 'P1', label: 'Linear DS', color: '#00d4aa' },
  { phase: 'P2', label: 'Trees & ADT', color: '#4a9eff' },
  { phase: 'P3', label: 'Sorting & Search', color: '#8b7cf8' },
  { phase: 'P4', label: 'Graphs & Sorting', color: '#f5a623' },
];

export default function SimulatorPage() {
  const [activeId, setActiveId] = useState('array');

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) || sections[0],
    [activeId]
  );

  const ActiveComponent = activeSection.Component;

  return (
    <div className="simulator-shell">
      <aside className="simulator-sidebar">
        <div className="simulator-sidebar__intro">
          <p className="simulator-sidebar__eyebrow">AlgoVista</p>
          <h2 className="simulator-sidebar__title">Simulator Workspace</h2>
          <p className="simulator-sidebar__copy">
            Pick one topic and focus on a single interactive module at a time.
          </p>
        </div>

        {phaseGroups.map((group) => {
          const items = sections.filter((section) => section.phase === group.phase);

          return (
            <div key={group.phase} className="simulator-sidebar__group">
              <div className="simulator-sidebar__group-head">
                <span
                  className="simulator-sidebar__group-dot"
                  style={{ background: group.color, boxShadow: `0 0 12px ${group.color}55` }}
                />
                <p className="simulator-sidebar__group-label" style={{ color: group.color }}>
                  {group.label}
                </p>
              </div>

              <div className="simulator-sidebar__items">
                {items.map((item) => {
                  const isActive = item.id === activeId;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className={`simulator-nav-item ${isActive ? 'is-active' : ''}`}
                      style={{
                        borderColor: isActive ? `${item.color}55` : 'transparent',
                        background: isActive ? `${item.color}14` : 'transparent',
                      }}
                    >
                      <div className="simulator-nav-item__row">
                        <span
                          className="simulator-nav-item__label"
                          style={{
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                          }}
                        >
                          {item.label}
                        </span>

                        {isActive && (
                          <span
                            className="simulator-nav-item__active-dot"
                            style={{ background: item.color }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </aside>

      <main className="simulator-main">
        <section className="simulator-hero">
          <div className="simulator-hero__chips">
            <span
              className="simulator-chip"
              style={{
                background: `${activeSection.color}14`,
                borderColor: `${activeSection.color}33`,
                color: activeSection.color,
              }}
            >
              {activeSection.phase}
            </span>

            <span
              className="simulator-hero__pulse"
              style={{
                background: activeSection.color,
                boxShadow: `0 0 12px ${activeSection.color}88`,
              }}
            />
            <span className="simulator-hero__meta">Interactive DSA workspace</span>
          </div>

          <div className="simulator-hero__content">
            <div className="simulator-hero__text">
              <h1 className="simulator-hero__title">{activeSection.label}</h1>
              <p className="simulator-hero__summary">{activeSection.summary}</p>
            </div>

            <div className="simulator-hero__stats">
              <div className="simulator-stat-card">
                <p className="simulator-stat-card__label">Mode</p>
                <p className="simulator-stat-card__value">Visualize</p>
              </div>
              <div className="simulator-stat-card">
                <p className="simulator-stat-card__label">Focus</p>
                <p className="simulator-stat-card__value">One module</p>
              </div>
            </div>
          </div>
        </section>

        <section className="simulator-stage">
          <div className="simulator-stage__toolbar">
            <div>
              <p className="simulator-stage__eyebrow">Active module</p>
              <h2 className="simulator-stage__title">{activeSection.label} Visualizer</h2>
            </div>

            <div className="simulator-stage__actions">
              <button type="button" className="simulator-stage__button simulator-stage__button--ghost">
                Problem tab soon
              </button>
              <button
                type="button"
                className="simulator-stage__button simulator-stage__button--accent"
                style={{
                  borderColor: `${activeSection.color}33`,
                  background: `${activeSection.color}14`,
                  color: activeSection.color,
                }}
              >
                Editor integration next
              </button>
            </div>
          </div>

          <div className="simulator-stage__body">
            <ActiveComponent />
          </div>
        </section>
      </main>
    </div>
  );
}
