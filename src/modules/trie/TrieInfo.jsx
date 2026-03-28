const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

const ops = [
  { op: 'Insert',       val: 'O(m)',    note: 'm = word length' },
  { op: 'Search',       val: 'O(m)',    note: 'Exact word lookup' },
  { op: 'Starts with',  val: 'O(m)',    note: 'Prefix check' },
  { op: 'Autocomplete', val: 'O(m+k)',  note: 'k = results returned' },
  { op: 'Delete',       val: 'O(m)',    note: 'Prune empty nodes' },
  { op: 'Space',        val: 'O(ALPHABET × N)', note: 'Worst case' },
];

export default function TrieInfo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>How a Trie works</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          A <strong style={{ color: 'var(--text-primary)' }}>Trie</strong> (retrieval tree) stores strings character by character.
          Each edge represents one letter. Nodes shared by words with a common prefix are <strong style={{ color: 'var(--accent)' }}>reused</strong> — so "apple", "app", "apply" all share the path a→p→p.
          End-of-word nodes are marked <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>isEnd = true</span>.
        </p>
        <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { c: '#4a9eff',       t: 'Active path' },
            { c: 'var(--accent)', t: 'Found / end-of-word' },
            { c: '#f87171',       t: 'Not found' },
            { c: '#a78bfa',       t: 'Autocomplete DFS' },
          ].map((l) => (
            <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: l.c, flexShrink: 0, display: 'inline-block' }} />{l.t}
            </span>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Trie vs Hash Table</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.5rem', fontSize: '0.72rem' }}>
          {['', 'Trie', 'Hash Table'].map((h, i) => (
            <span key={i} style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {[
            ['Prefix search', '✓ O(m)', '✗ N/A'],
            ['Autocomplete',  '✓ O(m+k)', '✗ Scan all'],
            ['Lookup',        'O(m)', 'O(1) avg'],
            ['Space',         'O(alphabet×n)', 'O(n)'],
            ['Sorted output', '✓ Yes', '✗ No'],
          ].map(([prop, t, h]) => (
            <>
              <span key={prop}   style={{ color: 'var(--text-muted)' }}>{prop}</span>
              <span key={prop+'t'} style={{ color: 'var(--accent)', fontWeight: '600' }}>{t}</span>
              <span key={prop+'h'} style={{ color: 'var(--text-secondary)' }}>{h}</span>
            </>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Time complexity</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {ops.map((c) => (
            <div key={c.op} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.32rem 0.5rem', borderRadius: '0.35rem', background: 'var(--bg-elevated)' }}>
              <span style={{ fontSize: '0.77rem', color: 'var(--text-secondary)' }}>{c.op}</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{c.note}</span>
                <span style={{ fontSize: '0.77rem', fontWeight: '700', color: '#34d399', fontFamily: 'monospace', minWidth: '72px', textAlign: 'right' }}>{c.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
