import { getAllWords } from './trieLogic';

const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

export default function TrieWordList({ root, suggestions = [], phase }) {
  const words = getAllWords(root);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      {suggestions.length > 0 && (
        <div style={{ ...card, border: '1px solid rgba(0,212,170,0.25)', background: 'rgba(0,212,170,0.04)' }}>
          <p style={lbl}>Autocomplete suggestions</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {suggestions.map((w) => (
              <span key={w} style={{ padding: '0.22rem 0.65rem', borderRadius: '0.35rem', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent)', fontFamily: 'monospace' }}>{w}</span>
            ))}
          </div>
        </div>
      )}

      <div style={card}>
        <p style={lbl}>All words in trie ({words.length})</p>
        {words.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>No words inserted yet.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {words.map((w) => (
              <span key={w} style={{ padding: '0.2rem 0.55rem', borderRadius: '0.35rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', fontSize: '0.76rem', fontWeight: '600', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{w}</span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
