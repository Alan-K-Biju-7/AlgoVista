import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './ConceptsPage.css';

const G = '#2dd4bf';
const Y = '#f5a623';
const R = '#ff6b6b';
const B = '#60a5fa';
const P = '#a78bfa';

const concepts = [
  { num: '01', icon: '▦', title: 'Array', accent: G, to: '/simulator#array', lessonTo: '/dsa-beginners/arrays-introduction-and-basic-operations',
    desc: 'Contiguous indexed storage with constant-time access and predictable traversal.',
    complexities: [{ label: 'Read', val: 'O(1)', color: G }, { label: 'Insert middle', val: 'O(n)', color: R }, { label: 'Search', val: 'O(n)', color: Y }] },
  { num: '02', icon: '⬡', title: 'Linked List', accent: G, to: '/simulator#linkedlist', lessonTo: '/dsa-beginners/linked-list-singly-linked-list',
    desc: 'A chain of nodes and references built for deliberate pointer movement and rewiring.',
    complexities: [{ label: 'Insert head', val: 'O(1)', color: G }, { label: 'Search', val: 'O(n)', color: R }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '03', icon: '⬆', title: 'Stack', accent: G, to: '/simulator#stack', lessonTo: '/dsa-beginners/stack-implementation-array-and-linked-list',
    desc: 'Last-in, first-out state for nested work, undo systems, parsing, and monotonic patterns.',
    complexities: [{ label: 'Push', val: 'O(1)', color: G }, { label: 'Pop', val: 'O(1)', color: G }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '04', icon: '⇉', title: 'Queue', accent: G, to: '/simulator#queue', lessonTo: '/dsa-beginners/queue-simple-queue',
    desc: 'First-in, first-out processing for BFS, task scheduling, and streaming work.',
    complexities: [{ label: 'Enqueue', val: 'O(1)', color: G }, { label: 'Dequeue', val: 'O(1)', color: G }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '05', icon: '⌘', title: 'BST', accent: B, to: '/simulator#bst', lessonTo: '/dsa-beginners/trees-binary-search-tree-bst',
    desc: 'Ordered branching where left values are smaller and right values are larger.',
    complexities: [{ label: 'Search avg', val: 'O(log n)', color: G }, { label: 'Worst', val: 'O(n)', color: R }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '06', icon: '⚖', title: 'AVL Tree', accent: B, to: '/simulator#avl', lessonTo: '/dsa-beginners/trees-avl-tree',
    desc: 'A self-balancing BST whose rotations preserve logarithmic worst-case operations.',
    complexities: [{ label: 'Insert', val: 'O(log n)', color: G }, { label: 'Delete', val: 'O(log n)', color: G }, { label: 'Rotation', val: 'O(1)', color: P }] },
  { num: '11', icon: '◎', title: 'Graph BFS/DFS', accent: B, to: '/simulator#graph', lessonTo: '/dsa-beginners/graphs-bfs-breadth-first-search',
    desc: 'Explore networks breadth-first or depth-first while tracking a frontier and visited state.',
    complexities: [{ label: 'Time', val: 'O(V+E)', color: G }, { label: 'Space', val: 'O(V)', color: B }, { label: 'Shortest path', val: 'BFS', color: G }] },
  { num: '12', icon: '◇', title: 'Heap / Priority Queue', accent: B, to: '/simulator#heap', lessonTo: '/dsa-beginners/trees-heap-min-heap-max-heap',
    desc: 'A complete tree that keeps the highest-priority value ready at the root.',
    complexities: [{ label: 'Insert', val: 'O(log n)', color: G }, { label: 'Extract', val: 'O(log n)', color: G }, { label: 'Peek', val: 'O(1)', color: G }] },
  { num: '13', icon: '#', title: 'Hash Table', accent: B, to: '/simulator#hashtable', lessonTo: '/dsa-beginners/hashing-hash-table-implementation',
    desc: 'Key-based lookup with buckets, collision handling, and load-factor tradeoffs.',
    complexities: [{ label: 'Insert avg', val: 'O(1)', color: G }, { label: 'Search avg', val: 'O(1)', color: G }, { label: 'Worst', val: 'O(n)', color: R }] },
  { num: '14', icon: '✦', title: 'Trie (Prefix Tree)', accent: B, to: '/simulator#trie', lessonTo: '/dsa-beginners/trees-trie-prefix-tree-insert-search-autocomplete',
    desc: 'A character-by-character tree for prefixes, autocomplete, and dictionary search.',
    complexities: [{ label: 'Insert', val: 'O(m)', color: G }, { label: 'Search', val: 'O(m)', color: G }, { label: 'Prefix', val: 'O(m)', color: B }] },
  { num: '15', icon: '→', title: "Dijkstra's Algorithm", accent: Y, to: '/simulator#dijkstra', lessonTo: '/dsa-beginners/graphs-dijkstra-s-algorithm',
    desc: 'Greedy shortest paths on non-negative weighted graphs using repeated relaxation.',
    complexities: [{ label: 'Heap', val: 'O((V+E)log V)', color: G }, { label: 'Space', val: 'O(V+E)', color: B }, { label: 'Negative edges', val: 'No', color: R }] },
  { num: '18', icon: '⇌', title: 'Bellman-Ford', accent: Y, to: '/simulator#bellmanford', lessonTo: '/dsa-beginners/graphs-bellman-ford-algorithm',
    desc: 'Round-based edge relaxation that supports negative weights and detects negative cycles.',
    complexities: [{ label: 'Time', val: 'O(VE)', color: Y }, { label: 'Space', val: 'O(V)', color: B }, { label: 'Negative edges', val: 'Yes', color: G }] },
  { num: '17', icon: '⚡', title: 'Quick Sort', accent: Y, to: '/simulator#quicksort', lessonTo: '/dsa-beginners/sorting-quick-sort',
    desc: 'Partition around a pivot, then recursively order the two resulting regions.',
    complexities: [{ label: 'Average', val: 'O(n log n)', color: G }, { label: 'Worst', val: 'O(n²)', color: R }, { label: 'Space avg', val: 'O(log n)', color: B }] },
  { num: '16', icon: '↕', title: 'Merge Sort', accent: Y, to: '/simulator#mergesort', lessonTo: '/dsa-beginners/sorting-merge-sort',
    desc: 'Split into smaller arrays, sort recursively, and merge in stable order.',
    complexities: [{ label: 'All cases', val: 'O(n log n)', color: G }, { label: 'Space', val: 'O(n)', color: B }, { label: 'Stable', val: 'Yes', color: G }] },
  { num: '07', icon: '⌖', title: 'Binary Search', accent: P, to: '/simulator#bsearch', lessonTo: '/dsa-beginners/arrays-binary-search',
    desc: 'Use sorted or monotonic structure to prove half the search space impossible each step.',
    complexities: [{ label: 'Best', val: 'O(1)', color: G }, { label: 'Worst', val: 'O(log n)', color: G }, { label: 'Space', val: 'O(1)', color: B }] },
  { num: '08', icon: '↕', title: 'Bubble Sort', accent: P, to: '/simulator#bubble', lessonTo: '/dsa-beginners/sorting-bubble-sort',
    desc: 'Fix adjacent inversions over repeated passes and observe a sorted suffix emerge.',
    complexities: [{ label: 'Best', val: 'O(n)', color: G }, { label: 'Worst', val: 'O(n²)', color: R }, { label: 'Space', val: 'O(1)', color: B }] },
  { num: '09', icon: '⤓', title: 'Insertion Sort', accent: P, to: '/simulator#insertion', lessonTo: '/dsa-beginners/sorting-insertion-sort',
    desc: 'Grow a sorted prefix by shifting larger values and inserting one value at a time.',
    complexities: [{ label: 'Best', val: 'O(n)', color: G }, { label: 'Worst', val: 'O(n²)', color: R }, { label: 'Space', val: 'O(1)', color: B }] },
  { num: '10', icon: '↓', title: 'Selection Sort', accent: P, to: '/simulator#selection', lessonTo: '/dsa-beginners/sorting-selection-sort',
    desc: 'Select the next minimum, place it once, and grow a finalized prefix.',
    complexities: [{ label: 'Comparisons', val: 'O(n²)', color: R }, { label: 'Swaps', val: 'O(n)', color: G }, { label: 'Space', val: 'O(1)', color: B }] },
];

const groups = [
  { phase: 'P1', label: 'Linear data structures', eyebrow: 'Start here', color: G, ids: ['01', '02', '03', '04'] },
  { phase: 'P2', label: 'Trees, graphs & lookup', eyebrow: 'Build structure', color: B, ids: ['05', '06', '11', '12', '13', '14'] },
  { phase: 'P3', label: 'Search & foundational sorting', eyebrow: 'Learn movement', color: P, ids: ['07', '08', '09', '10'] },
  { phase: 'P4', label: 'Advanced algorithms', eyebrow: 'Deepen reasoning', color: Y, ids: ['15', '16', '17', '18'] },
];

function ConceptCard({ concept }) {
  return (
    <article className="concept-card" style={{ '--concept-accent': concept.accent }}>
      <div className="concept-card__header">
        <span className="concept-card__icon" aria-hidden="true">{concept.icon}</span>
        <div>
          <span className="concept-card__number">Module {concept.num}</span>
          <h3>{concept.title}</h3>
        </div>
      </div>

      <p className="concept-card__description">{concept.desc}</p>

      <dl className="concept-card__complexity" aria-label={`${concept.title} complexity summary`}>
        {concept.complexities.map(({ label, val, color }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd style={{ color }}>{val}</dd>
          </div>
        ))}
      </dl>

      <div className="concept-card__actions">
        <Link to={concept.lessonTo} className="concept-card__learn">Learn concept</Link>
        <Link to={concept.to} className="concept-card__simulate">Open simulator <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

export default function ConceptsPage() {
  const [query, setQuery] = useState('');
  const [activePhase, setActivePhase] = useState('all');

  const filteredConcepts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return concepts.filter((concept) => {
      const group = groups.find((item) => item.ids.includes(concept.num));
      const phaseMatches = activePhase === 'all' || group?.phase === activePhase;
      const queryMatches = !normalizedQuery || [
        concept.title,
        concept.desc,
        ...concept.complexities.flatMap((item) => [item.label, item.val]),
      ].join(' ').toLowerCase().includes(normalizedQuery);
      return phaseMatches && queryMatches;
    });
  }, [activePhase, query]);

  return (
    <div className="concepts-page">
      <section className="concepts-hero">
        <div className="concepts-hero__copy">
          <span className="badge-teal">Visual concept library</span>
          <h1>Concepts</h1>
          <p className="concepts-hero__lead">Build the mental model before the muscle memory.</p>
          <p>
            Learn the invariant, trace a small example, inspect the cost model, then manipulate
            the same idea in a live simulator. Each module connects explanation to action.
          </p>
          <div className="concepts-hero__actions">
            <Link className="btn-primary" to="/dsa-beginners">Follow the guided path</Link>
            <Link className="btn-ghost" to="/practice">Practice interview questions</Link>
          </div>
        </div>

        <div className="concepts-learning-loop" aria-label="AlgoVista learning loop">
          <p className="section-label">Learning loop</p>
          {[
            ['01', 'Understand', 'Plain-English mental model'],
            ['02', 'Trace', 'Predict each state change'],
            ['03', 'Simulate', 'Control the algorithm visually'],
            ['04', 'Practice', 'Transfer the pattern to code'],
          ].map(([number, title, detail]) => (
            <div key={number}>
              <span>{number}</span>
              <p><strong>{title}</strong><small>{detail}</small></p>
            </div>
          ))}
        </div>
      </section>

      <section className="concepts-library" aria-labelledby="concept-library-heading">
        <div className="concepts-library__header">
          <div>
            <p className="section-label">18 interactive modules</p>
            <h2 id="concept-library-heading">Choose what you want to understand</h2>
          </div>
          <label className="concepts-search">
            <span>Search concepts</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try graph, heap, O(log n)..."
            />
          </label>
        </div>

        <div className="concepts-filters" aria-label="Filter concepts by learning phase">
          <button
            type="button"
            className={activePhase === 'all' ? 'is-active' : ''}
            aria-pressed={activePhase === 'all'}
            onClick={() => setActivePhase('all')}
          >
            All phases
          </button>
          {groups.map((group) => (
            <button
              key={group.phase}
              type="button"
              className={activePhase === group.phase ? 'is-active' : ''}
              aria-pressed={activePhase === group.phase}
              onClick={() => setActivePhase(group.phase)}
              style={{ '--filter-accent': group.color }}
            >
              {group.phase} · {group.label}
            </button>
          ))}
          <span className="concepts-results" aria-live="polite">
            {filteredConcepts.length} {filteredConcepts.length === 1 ? 'module' : 'modules'}
          </span>
        </div>

        {groups.map((group) => {
          const groupConcepts = filteredConcepts.filter((concept) => group.ids.includes(concept.num));
          if (!groupConcepts.length) return null;

          return (
            <section key={group.phase} className="concept-group" style={{ '--group-color': group.color }}>
              <header className="concept-group__header">
                <span className="concept-group__marker">{group.phase}</span>
                <div>
                  <p>{group.eyebrow}</p>
                  <h2>{group.label}</h2>
                </div>
                <span>{groupConcepts.length} modules</span>
              </header>
              <div className="concept-group__grid">
                {groupConcepts.map((concept) => <ConceptCard key={concept.num} concept={concept} />)}
              </div>
            </section>
          );
        })}

        {!filteredConcepts.length && (
          <div className="concepts-empty" role="status">
            <strong>No matching concept yet</strong>
            <p>Try a structure, algorithm name, or complexity such as “O(n)”.</p>
            <button type="button" onClick={() => { setQuery(''); setActivePhase('all'); }}>Clear filters</button>
          </div>
        )}
      </section>
    </div>
  );
}
