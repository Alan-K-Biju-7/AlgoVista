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
    difficulty: 'Beginner',
    outcome: 'Understand contiguous memory, indexing, and common mutations.',
    Component: ArrayVisualizer,
  },
  {
    id: 'linkedlist',
    label: 'Linked List',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'Node connections, pointer movement, insertion, and deletion flow.',
    difficulty: 'Beginner',
    outcome: 'Track references clearly and reason about node-by-node changes.',
    Component: LinkedListVisualizer,
  },
  {
    id: 'stack',
    label: 'Stack',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'LIFO behavior with push, pop, peek, and execution-style thinking.',
    difficulty: 'Beginner',
    outcome: 'Build intuition for undo flows, recursion, and nested evaluation.',
    Component: StackVisualizer,
  },
  {
    id: 'queue',
    label: 'Queue',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'FIFO processing with enqueue, dequeue, and ordering intuition.',
    difficulty: 'Beginner',
    outcome: 'Understand service order, buffering, and breadth-first processing.',
    Component: QueueVisualizer,
  },
  {
    id: 'bst',
    label: 'BST',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Binary search tree operations, ordering rules, and recursive paths.',
    difficulty: 'Intermediate',
    outcome: 'Reason about ordered insertion, lookup, and tree traversal paths.',
    Component: BSTVisualizer,
  },
  {
    id: 'avl',
    label: 'AVL Tree',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Self-balancing tree behavior with rotations and height updates.',
    difficulty: 'Intermediate',
    outcome: 'See how rotations preserve balance after insertions and deletions.',
    Component: AVLVisualizer,
  },
  {
    id: 'graph',
    label: 'Graph',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Vertices, edges, traversals, adjacency logic, and connectivity.',
    difficulty: 'Intermediate',
    outcome: 'Map problems to graph models and inspect traversal state clearly.',
    Component: GraphVisualizer,
  },
  {
    id: 'heap',
    label: 'Heap',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Priority-based structure with heapify, insert, and delete behavior.',
    difficulty: 'Intermediate',
    outcome: 'Understand parent-child ordering and priority queue mechanics.',
    Component: HeapVisualizer,
  },
  {
    id: 'hashtable',
    label: 'Hash Table',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Hashing, collisions, bucket behavior, and lookup efficiency.',
    difficulty: 'Intermediate',
    outcome: 'Visualize hashing tradeoffs, collisions, and bucket placement.',
    Component: HashVisualizer,
  },
  {
    id: 'trie',
    label: 'Trie',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Prefix-based lookup, branching paths, and string search structure.',
    difficulty: 'Intermediate',
    outcome: 'Think in prefixes and branching character paths for fast lookup.',
    Component: TrieVisualizer,
  },
  {
    id: 'bsearch',
    label: 'Binary Search',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Midpoint reasoning, shrinking search space, and sorted-array logic.',
    difficulty: 'Beginner',
    outcome: 'Practice boundary updates and off-by-one safe reasoning.',
    Component: BinarySearchVisualizer,
  },
  {
    id: 'bubble',
    label: 'Bubble Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Adjacent swaps, repeated passes, and comparison-heavy sorting.',
    difficulty: 'Beginner',
    outcome: 'Observe how repeated local swaps gradually create global order.',
    Component: BubbleSortVisualizer,
  },
  {
    id: 'insertion',
    label: 'Insertion Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Build a sorted region step by step through insertion and shifting.',
    difficulty: 'Beginner',
    outcome: 'See how partial order grows as each value finds its position.',
    Component: InsertionSortVisualizer,
  },
  {
    id: 'selection',
    label: 'Selection Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Repeated minimum selection and controlled swap placement.',
    difficulty: 'Beginner',
    outcome: 'Develop a clean mental model for selection and fixed progress.',
    Component: SelectionSortVisualizer,
  },
  {
    id: 'mergesort',
    label: 'Merge Sort',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Divide-and-conquer splitting, merging, and recursive composition.',
    difficulty: 'Advanced',
    outcome: 'Understand recursive splitting and stable merging mechanics.',
    Component: MergeSortVisualizer,
  },
  {
    id: 'quicksort',
    label: 'Quick Sort',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Pivot partitioning, recursive sorting, and in-place strategy.',
    difficulty: 'Advanced',
    outcome: 'Track pivots, partitions, and recursive boundaries with confidence.',
    Component: QuickSortVisualizer,
  },
  {
    id: 'dijkstra',
    label: "Dijkstra's",
    phase: 'P4',
    color: '#f5a623',
    summary: 'Shortest paths with greedy relaxation and frontier updates.',
    difficulty: 'Advanced',
    outcome: 'Learn why the closest unsettled node drives the algorithm forward.',
    Component: DijkstraVisualizer,
  },
  {
    id: 'bellmanford',
    label: 'Bellman-Ford',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Edge relaxation across rounds with negative-cycle awareness.',
    difficulty: 'Advanced',
    outcome: 'Inspect repeated relaxation passes and detect impossible states.',
    Component: BellmanFordVisualizer,
  },
];

const phaseGroups = [
  { phase: 'P1', label: 'Linear DS', color: '#00d4aa' },
  { phase: 'P2', label: 'Trees & ADT', color: '#4a9eff' },
  { phase: 'P3', label: 'Sorting & Search', color: '#8b7cf8' },
  { phase: 'P4', label: 'Graphs & Sorting', color: '#f5a623' },
];

const workspaceTabs = ['overview', 'problem', 'editor', 'visualize'];

export default function SimulatorPage() {
  const [activeId, setActiveId] = useState('array');
  const [activeTab, setActiveTab] = useState('overview');

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) || sections[0],
    [activeId]
  );

  const ActiveComponent = activeSection.Component;

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="simulator-panel-grid">
          <article className="simulator-info-card">
            <p className="simulator-info-card__label">What you will learn</p>
            <h3 className="simulator-info-card__title">{activeSection.label}</h3>
            <p className="simulator-info-card__body">{activeSection.outcome}</p>
          </article>

          <article className="simulator-info-card">
            <p className="simulator-info-card__label">Difficulty</p>
            <h3 className="simulator-info-card__title">{activeSection.difficulty}</h3>
            <p className="simulator-info-card__body">
              Start here to build intuition before moving into timed problem solving.
            </p>
          </article>

          <article className="simulator-info-card simulator-info-card--wide">
            <p className="simulator-info-card__label">How to use this module</p>
            <p className="simulator-info-card__body">
              First inspect the state changes, then step through operations slowly, and only after that
              move into code-writing mode. This keeps the visual model and the implementation model aligned.
            </p>
          </article>
        </div>
      );
    }

    if (activeTab === 'problem') {
      return (
        <div className="simulator-empty-state">
          <p className="simulator-empty-state__eyebrow">Problem workspace</p>
          <h3 className="simulator-empty-state__title">Problem panel coming next</h3>
          <p className="simulator-empty-state__body">
            This tab will hold NeetCode-style prompts, constraints, examples, hints, and test cases for the
            currently selected topic.
          </p>
        </div>
      );
    }

    if (activeTab === 'editor') {
      return (
        <div className="simulator-empty-state">
          <p className="simulator-empty-state__eyebrow">Editor workspace</p>
          <h3 className="simulator-empty-state__title">Code editor shell coming next</h3>
          <p className="simulator-empty-state__body">
            We will use this area for writing code, running tests, stepping through execution, and syncing
            line-by-line behavior with the visualizer.
          </p>
        </div>
      );
    }

    return (
      <div className="simulator-visualize-pane">
        <ActiveComponent />
      </div>
    );
  };

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
                      onClick={() => {
                        setActiveId(item.id);
                        setActiveTab('overview');
                      }}
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
                <p className="simulator-stat-card__value">
                  {activeTab === 'visualize' ? 'Visualize' : 'Learn'}
                </p>
              </div>
              <div className="simulator-stat-card">
                <p className="simulator-stat-card__label">Difficulty</p>
                <p className="simulator-stat-card__value">{activeSection.difficulty}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="simulator-stage">
          <div className="simulator-stage__toolbar">
            <div>
              <p className="simulator-stage__eyebrow">Active workspace</p>
              <h2 className="simulator-stage__title">{activeSection.label}</h2>
            </div>

            <div className="simulator-stage__tabs" role="tablist" aria-label="Simulator workspace tabs">
              {workspaceTabs.map((tab) => {
                const isActive = tab === activeTab;
                const label = tab.charAt(0).toUpperCase() + tab.slice(1);

                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`simulator-tab ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      borderColor: isActive ? `${activeSection.color}33` : 'var(--border-subtle)',
                      background: isActive ? `${activeSection.color}14` : 'var(--bg-panel)',
                      color: isActive ? activeSection.color : 'var(--text-muted)',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="simulator-stage__body">{renderTabContent()}</div>
        </section>
      </main>
    </div>
  );
}
