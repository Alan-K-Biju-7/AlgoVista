import { Link } from 'react-router-dom';

function Badge({ label, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '0.18rem 0.52rem',
      borderRadius: '0.3rem', fontSize: '0.68rem', fontWeight: '700',
      background: `${color}18`, border: `1px solid ${color}40`, color,
    }}>{label}</span>
  );
}

function ConceptCard({ num, icon, title, desc, complexities, to, accent }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)', padding: '1.35rem',
      display: 'flex', flexDirection: 'column', gap: '0.85rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${accent}22`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
            background: `${accent}18`, border: `1px solid ${accent}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}>{icon}</div>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: '700', color: accent, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.1rem' }}>{num}</p>
            <h3 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: '700' }}>{title}</h3>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{desc}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {complexities.map(({ label, val, color }) => (
          <span key={label} style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {label}:{' '}
            <span style={{ fontWeight: '700', color, fontFamily: 'monospace' }}>{val}</span>
          </span>
        ))}
      </div>

      <Link to={to} style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        fontSize: '0.78rem', color: accent, fontWeight: '600',
        padding: '0.38rem 0.8rem', borderRadius: '0.4rem',
        border: `1px solid ${accent}30`, background: `${accent}10`,
        alignSelf: 'flex-start', transition: 'all 0.15s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}20`; e.currentTarget.style.borderColor = `${accent}55`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.borderColor = `${accent}30`; }}
      >
        Open in simulator →
      </Link>
    </div>
  );
}

const G = '#00d4aa';
const B = '#4a9eff';
const P = '#8b7cf8';

const concepts = [
  { num: '01', icon: '▦',  title: 'Array',          accent: G, to: '/simulator#array',
    desc: 'Contiguous memory block. O(1) access by index, O(n) insert/delete in the middle.',
    complexities: [{ label: 'Read', val: 'O(1)', color: G }, { label: 'Insert end', val: 'O(1)', color: G }, { label: 'Insert mid', val: 'O(n)', color: '#ff6b6b' }, { label: 'Search', val: 'O(n)', color: '#ffd166' }] },
  { num: '02', icon: '⬡',  title: 'Linked List',    accent: G, to: '/simulator#linkedlist',
    desc: 'Nodes linked by pointers. O(1) insert at head, O(n) traversal to reach any node.',
    complexities: [{ label: 'Insert head', val: 'O(1)', color: G }, { label: 'Insert tail', val: 'O(n)', color: '#ffd166' }, { label: 'Search', val: 'O(n)', color: '#ff6b6b' }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '03', icon: '⬆',  title: 'Stack',          accent: G, to: '/simulator#stack',
    desc: 'LIFO — Last In First Out. Push and pop both O(1). Used in call stacks and undo systems.',
    complexities: [{ label: 'Push', val: 'O(1)', color: G }, { label: 'Pop', val: 'O(1)', color: G }, { label: 'Peek', val: 'O(1)', color: G }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '04', icon: '⇉',  title: 'Queue',          accent: G, to: '/simulator#queue',
    desc: 'FIFO — First In First Out. Enqueue and dequeue both O(1). Used in BFS and task scheduling.',
    complexities: [{ label: 'Enqueue', val: 'O(1)', color: G }, { label: 'Dequeue', val: 'O(1)', color: G }, { label: 'Peek', val: 'O(1)', color: G }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '05', icon: '🌲', title: 'BST',            accent: B, to: '/simulator#bst',
    desc: 'Binary Search Tree: left < parent < right. O(log n) average for all ops, O(n) worst on skewed trees.',
    complexities: [{ label: 'Insert avg', val: 'O(log n)', color: G }, { label: 'Search avg', val: 'O(log n)', color: G }, { label: 'Worst', val: 'O(n)', color: '#ff6b6b' }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '06', icon: '⚖️', title: 'AVL Tree',       accent: B, to: '/simulator#avl',
    desc: 'Self-balancing BST. Maintains balance factor (bf = lh − rh). LL/RR/LR/RL rotations guarantee O(log n) worst-case.',
    complexities: [{ label: 'Insert', val: 'O(log n)', color: G }, { label: 'Delete', val: 'O(log n)', color: G }, { label: 'Rotation', val: 'O(1)', color: '#a78bfa' }, { label: 'Space', val: 'O(n)', color: B }] },
  { num: '11', icon: '◉',  title: 'Graph BFS/DFS', accent: B, to: '/simulator#graph',
    desc: 'Graph of nodes and edges. BFS (queue) explores level by level and finds shortest path. DFS (stack) dives deep first and is used for cycle detection and topological sort.',
    complexities: [{ label: 'Time', val: 'O(V+E)', color: G }, { label: 'BFS space', val: 'O(V)', color: B }, { label: 'DFS space', val: 'O(V)', color: B }, { label: 'Shortest path', val: 'BFS ✓', color: G }] },
  { num: '12', icon: '⬡',  title: 'Heap / Priority Queue', accent: B, to: '/simulator#heap',
    desc: 'Complete binary tree stored as an array. Min-heap keeps smallest at root (index 0). Insert bubbles up, extract-min heapifies down. Powers Dijkstra, A*, and task schedulers.',
    complexities: [{ label: 'Insert', val: 'O(log n)', color: G }, { label: 'Extract min', val: 'O(log n)', color: G }, { label: 'Peek', val: 'O(1)', color: G }, { label: 'Build', val: 'O(n)', color: B }] },
  { num: '13', icon: '#',   title: 'Hash Table',   accent: B, to: '/simulator#hashtable',
    desc: 'Array of buckets with separate chaining for collision resolution. djb2 hash maps keys to bucket indices. Load factor λ = entries/buckets — keep λ < 0.75 for O(1) average ops.',
    complexities: [{ label: 'Insert', val: 'O(1) avg', color: G }, { label: 'Search', val: 'O(1) avg', color: G }, { label: 'Delete', val: 'O(1) avg', color: G }, { label: 'Space', val: 'O(n+m)', color: B }] },
  { num: '14', icon: '✦',  title: 'Trie (Prefix Tree)', accent: B, to: '/simulator#trie',
    desc: 'Tree where each edge = one character. Words with common prefix share nodes. Powers autocomplete, spell-check and IP routing. O(m) insert/search where m = word length.',
    complexities: [{ label: 'Insert', val: 'O(m)', color: G }, { label: 'Search', val: 'O(m)', color: G }, { label: 'Autocomplete', val: 'O(m+k)', color: G }, { label: 'Space', val: 'O(α×n)', color: B }] },
  { num: '15', icon: '→',  title: "Dijkstra's Algorithm", accent: B, to: '/simulator#dijkstra',
    desc: "Greedy shortest path on weighted graphs. Pops the lowest-dist unvisited node from a min-PQ, relaxes all its edges. Once settled a node's distance is final. Cannot handle negative weights.",
    complexities: [{ label: 'Time (heap)', val: 'O((V+E)logV)', color: G }, { label: 'Time (array)', val: 'O(V²)', color: Y }, { label: 'Space', val: 'O(V+E)', color: B }, { label: 'Negative w', val: '✗ No', color: R }] },
  { num: '07', icon: '⌖',  title: 'Binary Search',  accent: P, to: '/simulator#bsearch',
    desc: 'Halves the search space each step on a sorted array. O(log n) vs O(n) for linear search.',
    complexities: [{ label: 'Best', val: 'O(1)', color: G }, { label: 'Average', val: 'O(log n)', color: G }, { label: 'Worst', val: 'O(log n)', color: G }, { label: 'Space', val: 'O(1)', color: B }] },
  { num: '08', icon: '↕',  title: 'Bubble Sort',    accent: P, to: '/simulator#bubble',
    desc: 'Repeatedly swaps adjacent elements if out of order. Best case O(n) on nearly sorted data.',
    complexities: [{ label: 'Best', val: 'O(n)', color: G }, { label: 'Worst', val: 'O(n²)', color: '#ff6b6b' }, { label: 'Swaps', val: 'O(n²)', color: '#ff6b6b' }, { label: 'Space', val: 'O(1)', color: B }] },
  { num: '09', icon: '⤓',  title: 'Insertion Sort', accent: P, to: '/simulator#insertion',
    desc: 'Builds sorted portion one element at a time. Powers Timsort for small arrays and nearly sorted data.',
    complexities: [{ label: 'Best', val: 'O(n)', color: G }, { label: 'Worst', val: 'O(n²)', color: '#ff6b6b' }, { label: 'Shifts', val: 'O(n²)', color: '#ffd166' }, { label: 'Space', val: 'O(1)', color: B }] },
  { num: '10', icon: '↓',  title: 'Selection Sort', accent: P, to: '/simulator#selection',
    desc: 'Finds the minimum each pass and places it. Always O(n²) comparisons but only O(n) swaps.',
    complexities: [{ label: 'Best', val: 'O(n²)', color: '#ff6b6b' }, { label: 'Worst', val: 'O(n²)', color: '#ff6b6b' }, { label: 'Swaps', val: 'O(n)', color: G }, { label: 'Space', val: 'O(1)', color: B }] },
];

const groups = [
  { phase: 'P1', label: 'Phase 01 — Linear Data Structures', color: G, ids: ['01','02','03','04'] },
  { phase: 'P2', label: 'Phase 02 — Trees, Graphs & Advanced DS', color: B, ids: ['05','06','11','12','13','14','15'] },
  { phase: 'P3', label: 'Phase 03 — Algorithms',             color: P, ids: ['07','08','09','10'] },
];

export default function ConceptsPage() {
  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      <span className="badge-teal" style={{ marginBottom: '1.25rem' }}>All concepts</span>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Concepts</h1>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '3.5rem', maxWidth: '44rem', lineHeight: 1.7 }}>
        Every data structure and algorithm in AlgoVista — plain-English explanation, time complexity, and a direct link into the live simulator.
      </p>

      {groups.map((g) => (
        <div key={g.phase} style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: `1px solid var(--border-subtle)` }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.color, display: 'inline-block', boxShadow: `0 0 6px ${g.color}` }} />
            <h2 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '700' }}>{g.label}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.9rem' }}>
            {concepts.filter((c) => g.ids.includes(c.num)).map((c) => (
              <ConceptCard key={c.num} {...c} />
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}
