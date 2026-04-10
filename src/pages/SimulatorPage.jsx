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
    prerequisite: 'Comfort with loops, variables, and zero-based indexing.',
    pattern: 'Two pointers, sliding window, prefix processing.',
    examplePrompt: 'Find the maximum sum subarray of size k.',
    coachTip: 'Track exactly what each index means before you optimize anything.',
    starterPlan: ['Read the prompt slowly', 'Write brute force first', 'Identify repeated work', 'Map it to a known pattern'],
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
    prerequisite: 'Pointers or references, null checks, iterative traversal.',
    pattern: 'Fast and slow pointers, dummy node, pointer rewiring.',
    examplePrompt: 'Reverse a linked list in-place.',
    coachTip: 'Draw next pointers before changing them so you never lose the chain.',
    starterPlan: ['Name current and next pointers', 'Sketch one small list', 'Simulate one mutation', 'Only then code the loop'],
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
    prerequisite: 'Arrays, loops, and conditional branching.',
    pattern: 'Monotonic stack, bracket matching, call stack simulation.',
    examplePrompt: 'Validate whether a parentheses string is balanced.',
    coachTip: 'Ask what the stack should contain after every character or step.',
    starterPlan: ['Define what goes on the stack', 'List push and pop cases', 'Simulate with a tiny input', 'Check the final stack state'],
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
    prerequisite: 'Basic arrays and front/back update logic.',
    pattern: 'Level-order traversal, task scheduling, stream buffering.',
    examplePrompt: 'Simulate a queue of requests arriving over time.',
    coachTip: 'Be explicit about what enters first and what leaves first.',
    starterPlan: ['Mark front and back clearly', 'Trace two enqueue operations', 'Trace one dequeue', 'Confirm order is preserved'],
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
    prerequisite: 'Recursion, tree terminology, binary decisions.',
    pattern: 'Ordered recursion, subtree bounds, successor/predecessor logic.',
    examplePrompt: 'Validate whether a binary tree is a BST.',
    coachTip: 'Think in value ranges, not just parent-child comparisons.',
    starterPlan: ['State the BST rule', 'Decide recursive information', 'Test a broken edge case', 'Then implement bounds cleanly'],
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
    prerequisite: 'BST basics, tree height, recursion.',
    pattern: 'Rebalancing, LL/LR/RR/RL rotations, height propagation.',
    examplePrompt: 'Insert a sequence of keys and rebalance after each step.',
    coachTip: 'Memorize rotation triggers visually before coding the cases.',
    starterPlan: ['Compute balance factor', 'Identify imbalance type', 'Apply correct rotation', 'Update heights afterward'],
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
    prerequisite: 'Sets, adjacency lists, and traversal fundamentals.',
    pattern: 'DFS, BFS, visited tracking, connected components.',
    examplePrompt: 'Count connected components in an undirected graph.',
    coachTip: 'Decide early whether the graph is directed, weighted, or cyclic.',
    starterPlan: ['Choose graph representation', 'Write visited logic', 'Simulate one traversal', 'Count what changes per node'],
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
    prerequisite: 'Tree indexing inside arrays and swap operations.',
    pattern: 'Top-k, greedy selection, priority-driven processing.',
    examplePrompt: 'Return the k largest elements from a stream.',
    coachTip: 'Focus on heap property, not full sorting of the array.',
    starterPlan: ['Define min-heap or max-heap', 'Trace parent-child indices', 'Simulate one sift operation', 'Check the root after updates'],
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
    prerequisite: 'Arrays, modulo intuition, key-value storage.',
    pattern: 'Frequency maps, caching, counting, quick membership checks.',
    examplePrompt: 'Find the first repeated value in an array.',
    coachTip: 'Use the map to remove repeated scanning, not just to store everything.',
    starterPlan: ['Decide key and value meaning', 'Process one element at a time', 'Update frequency or lookup', 'Stop when condition is met'],
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
    prerequisite: 'Strings, character iteration, tree basics.',
    pattern: 'Prefix search, autocomplete, dictionary matching.',
    examplePrompt: 'Build autocomplete suggestions for a search box.',
    coachTip: 'Treat each character like a branching decision, not a full string compare.',
    starterPlan: ['Walk one character at a time', 'Create missing nodes', 'Mark word endings', 'Verify one prefix query'],
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
    prerequisite: 'Sorted arrays and loop invariants.',
    pattern: 'Lower bound, upper bound, answer-space search.',
    examplePrompt: 'Find the first index where value is at least target.',
    coachTip: 'Write down the meaning of left and right before entering the loop.',
    starterPlan: ['Define search interval', 'Choose loop condition', 'Update one boundary only', 'Return the invariant result'],
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
    prerequisite: 'Loops, swaps, and comparison operators.',
    pattern: 'Pass shrinking, adjacent inversion fixing.',
    examplePrompt: 'Sort a small list while counting swaps.',
    coachTip: 'Notice what becomes guaranteed after each full pass.',
    starterPlan: ['Compare adjacent values', 'Swap when needed', 'Finish one full pass', 'Shrink the unsorted region'],
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
    prerequisite: 'Array traversal and shifting values.',
    pattern: 'Growing sorted prefix, local insertion.',
    examplePrompt: 'Insert each number into the right place of a sorted prefix.',
    coachTip: 'Keep the sorted prefix mentally separate from the rest of the array.',
    starterPlan: ['Pick current value', 'Shift larger items right', 'Insert into gap', 'Expand sorted prefix'],
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
    prerequisite: 'Nested loops and min tracking.',
    pattern: 'Find-min then place, deterministic progress.',
    examplePrompt: 'Select the minimum value for each array position.',
    coachTip: 'Separate the search phase from the swap phase in your head.',
    starterPlan: ['Mark current index', 'Scan for minimum', 'Swap once per pass', 'Move boundary forward'],
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
    prerequisite: 'Recursion, temporary arrays, merge logic.',
    pattern: 'Divide and conquer, stable sorting, recursion tree.',
    examplePrompt: 'Sort an unsorted array using merge steps.',
    coachTip: 'Track split boundaries and merge order separately.',
    starterPlan: ['Find midpoint', 'Sort both halves', 'Merge in order', 'Copy leftovers carefully'],
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
    prerequisite: 'Pointers, swapping, and recursion basics.',
    pattern: 'Partition around pivot, in-place divide and conquer.',
    examplePrompt: 'Place each pivot so smaller values go left and larger go right.',
    coachTip: 'Make the partition invariant explicit before coding swaps.',
    starterPlan: ['Choose pivot', 'Move pointers inward', 'Partition correctly', 'Recurse on both sides'],
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
    prerequisite: 'Graphs, weights, priority queue intuition.',
    pattern: 'Greedy shortest path, relax edges, update frontier.',
    examplePrompt: 'Find the shortest path from source to all nodes.',
    coachTip: 'Every pop from the priority queue should answer one clear question.',
    starterPlan: ['Initialize distances', 'Pop smallest frontier node', 'Relax outgoing edges', 'Skip stale queue entries'],
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
    prerequisite: 'Weighted graphs and edge relaxation basics.',
    pattern: 'Repeated relaxation, negative cycle detection, distance updates.',
    examplePrompt: 'Compute shortest paths even when negative edges exist.',
    coachTip: 'Think in rounds over edges, not in expanding frontiers like Dijkstra.',
    starterPlan: ['Initialize all distances', 'Relax every edge for V-1 rounds', 'Run one extra detection pass', 'Trace parent updates carefully'],
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) || sections[0],
    [activeId]
  );

  const ActiveComponent = activeSection.Component;

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="simulator-overview-stack">
          <div className="simulator-panel-grid">
            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Learning outcome</p>
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
          </div>

          <div className="simulator-panel-grid simulator-panel-grid--meta">
            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Prerequisite</p>
              <p className="simulator-info-card__body">{activeSection.prerequisite}</p>
            </article>

            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Common pattern</p>
              <p className="simulator-info-card__body">{activeSection.pattern}</p>
            </article>

            <article className="simulator-info-card simulator-info-card--wide">
              <p className="simulator-info-card__label">Example prompt</p>
              <p className="simulator-info-card__body">{activeSection.examplePrompt}</p>
            </article>
          </div>

          <article className="simulator-info-card">
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
      <div className="simulator-workspace">
        <aside className="simulator-practice-panel">
          <div className="simulator-practice-panel__block">
            <p className="simulator-info-card__label">Practice focus</p>
            <h3 className="simulator-practice-panel__title">{activeSection.examplePrompt}</h3>
            <p className="simulator-practice-panel__body">
              Use the visualizer on the right while thinking through the prompt on the left. This is the bridge
              between concept learning and actual interview-style problem solving.
            </p>
          </div>

          <div className="simulator-practice-panel__block">
            <p className="simulator-info-card__label">Coach tip</p>
            <p className="simulator-practice-panel__body">{activeSection.coachTip}</p>
          </div>

          <div className="simulator-practice-panel__block">
            <p className="simulator-info-card__label">Starter plan</p>
            <ul className="simulator-checklist">
              {activeSection.starterPlan.map((step) => (
                <li key={step} className="simulator-checklist__item">
                  <span className="simulator-checklist__dot" style={{ background: activeSection.color }} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="simulator-visual-card">
          <div className="simulator-visual-card__head">
            <div>
              <p className="simulator-info-card__label">Visualizer</p>
              <h3 className="simulator-visual-card__title">{activeSection.label} state view</h3>
            </div>
            <span
              className="simulator-visual-card__badge"
              style={{
                background: `${activeSection.color}14`,
                borderColor: `${activeSection.color}33`,
                color: activeSection.color,
              }}
            >
              Live module
            </span>
          </div>

          <div className="simulator-visualize-pane">
            <ActiveComponent />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="simulator-shell">
      <button
        type="button"
        className="simulator-mobile-toggle"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? 'Close simulator navigation' : 'Open simulator navigation'}
      >
        <span className="simulator-mobile-toggle__line" />
        <span className="simulator-mobile-toggle__line" />
        <span className="simulator-mobile-toggle__line" />
        <span className="simulator-mobile-toggle__text">
          {sidebarOpen ? 'Close topics' : 'Browse topics'}
        </span>
      </button>

      <aside className={`simulator-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
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
                        setSidebarOpen(false);
                      }}
                      className={`simulator-nav-item ${isActive ? 'is-active' : ''}`}
                      style={{
                        borderColor: isActive ? `${item.color}55` : 'transparent',
                        background: isActive ? `${item.color}14` : 'transparent',
                      }}
                    >
                      <div className="simulator-nav-item__row">
  <div className="simulator-nav-item__left">
    <span
      className="simulator-nav-item__accent"
      style={{ background: item.color }}
    />
    <span
      className="simulator-nav-item__label"
      style={{
        fontWeight: isActive ? 800 : 600,
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
      }}
    >
      {item.label}
    </span>
  </div>

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
                  {activeTab === 'visualize' ? 'Practice + Visualize' : 'Learn'}
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
