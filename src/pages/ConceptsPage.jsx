import { Link } from 'react-router-dom';

const card = {
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  padding: '1.5rem',
};

const badge = (color) => ({
  display: 'inline-block',
  padding: '0.2rem 0.55rem',
  borderRadius: '0.35rem',
  fontSize: '0.7rem',
  fontWeight: '700',
  background: color + '22',
  color: color,
  border: '1px solid ' + color + '44',
  marginRight: '0.4rem',
});

const complexity = (label, value, color) => (
  <span style={{ fontSize: '0.78rem', color: '#64748b', marginRight: '1rem' }}>
    {label}: <span style={{ color }}>{value}</span>
  </span>
);

function ConceptsPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Concepts</h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem', maxWidth: '42rem', lineHeight: 1.7 }}>
        Every data structure and algorithm in AlgoVista — with a plain-English explanation,
        time complexity, and a direct link into the live simulator.
      </p>

      <h2 style={{ fontSize: '1.05rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Data structures</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0' }}>Array</h3>
            <span style={badge('#34d399')}>O(1) access</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>
            A contiguous block of memory where every element is stored at a fixed index.
            Reading or writing any element by index is instant. Inserting or deleting in
            the middle is slow because every following element must shift.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {complexity('Read', 'O(1)', '#34d399')}
            {complexity('Insert end', 'O(1)', '#34d399')}
            {complexity('Insert middle', 'O(n)', '#f87171')}
            {complexity('Search', 'O(n)', '#fbbf24')}
          </div>
          <Link to="/simulator" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
            → Open in simulator
          </Link>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0' }}>Linked list</h3>
            <span style={badge('#818cf8')}>Dynamic size</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>
            A chain of nodes where each node holds a value and a pointer to the next node.
            The list starts at the HEAD. Inserting at the head is instant; reaching any
            other position requires traversing from HEAD one step at a time.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {complexity('Insert head', 'O(1)', '#34d399')}
            {complexity('Insert tail', 'O(n)', '#fbbf24')}
            {complexity('Search', 'O(n)', '#f87171')}
            {complexity('Space', 'O(n)', '#60a5fa')}
          </div>
          <Link to="/simulator" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
            → Open in simulator
          </Link>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0' }}>Stack</h3>
            <span style={badge('#f472b6')}>LIFO</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>
            A Last In, First Out structure. Think of a stack of plates — you can only
            add or remove from the top. Push adds an element; pop removes the top element.
            Used in undo systems, call stacks, and expression parsing.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {complexity('Push', 'O(1)', '#34d399')}
            {complexity('Pop', 'O(1)', '#34d399')}
            {complexity('Peek', 'O(1)', '#34d399')}
            {complexity('Space', 'O(n)', '#60a5fa')}
          </div>
          <Link to="/simulator" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
            → Open in simulator
          </Link>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0' }}>Queue</h3>
            <span style={badge('#fbbf24')}>FIFO</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>
            A First In, First Out structure. Like a queue at a counter — the first person
            to join is the first to be served. Enqueue adds to the rear; dequeue removes
            from the front. Used in task scheduling, BFS, and print queues.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {complexity('Enqueue', 'O(1)', '#34d399')}
            {complexity('Dequeue', 'O(1)', '#34d399')}
            {complexity('Peek', 'O(1)', '#34d399')}
            {complexity('Space', 'O(n)', '#60a5fa')}
          </div>
          <Link to="/simulator" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
            → Open in simulator
          </Link>
        </div>

      </div>

      <h2 style={{ fontSize: '1.05rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Searching</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0' }}>Binary search</h3>
            <span style={badge('#a78bfa')}>O(log n)</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>
            Works only on a sorted array. Pick the middle element — if it matches the target
            you are done. If the target is smaller, discard the right half; if larger, discard
            the left. Each step halves the search space. Searching 1,000,000 elements takes
            at most 20 comparisons.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {complexity('Best', 'O(1)', '#34d399')}
            {complexity('Worst', 'O(log n)', '#fbbf24')}
            {complexity('vs linear', 'O(n)', '#f87171')}
            {complexity('Space', 'O(1)', '#60a5fa')}
          </div>
          <Link to="/simulator" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
            → Open in simulator
          </Link>
        </div>

      </div>

      <h2 style={{ fontSize: '1.05rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Sorting</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0' }}>Bubble sort</h3>
            <span style={badge('#f87171')}>O(n²)</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>
            On each pass, compare adjacent pairs and swap them if out of order. After every
            full pass, the largest unsorted element "bubbles up" to its correct position at
            the end. Simple to understand but inefficient on large arrays. Best case O(n)
            if the array is already sorted.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {complexity('Best', 'O(n)', '#34d399')}
            {complexity('Worst', 'O(n²)', '#f87171')}
            {complexity('Swaps', 'O(n²)', '#f87171')}
            {complexity('Space', 'O(1)', '#60a5fa')}
          </div>
          <Link to="/simulator" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
            → Open in simulator
          </Link>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0' }}>Insertion sort</h3>
            <span style={badge('#fbbf24')}>O(n²) worst</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>
            Build a sorted portion from left to right. Pick the next element as the key,
            then shift larger elements in the sorted portion one step right to make room,
            and drop the key in. Excellent on nearly-sorted data and small arrays. Used
            in practice inside hybrid sorts like Timsort.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {complexity('Best', 'O(n)', '#34d399')}
            {complexity('Worst', 'O(n²)', '#f87171')}
            {complexity('Shifts', 'O(n²)', '#fbbf24')}
            {complexity('Space', 'O(1)', '#60a5fa')}
          </div>
          <Link to="/simulator" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
            → Open in simulator
          </Link>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#e2e8f0' }}>Selection sort</h3>
            <span style={badge('#60a5fa')}>O(n) swaps</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>
            On each pass, scan the unsorted portion to find the minimum element, then
            swap it into its correct position at the front. Always makes exactly n−1 swaps
            regardless of input order — making it useful when write operations are
            significantly more expensive than reads.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {complexity('Best', 'O(n²)', '#f87171')}
            {complexity('Worst', 'O(n²)', '#f87171')}
            {complexity('Swaps', 'O(n)', '#34d399')}
            {complexity('Space', 'O(1)', '#60a5fa')}
          </div>
          <Link to="/simulator" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
            → Open in simulator
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ConceptsPage;
