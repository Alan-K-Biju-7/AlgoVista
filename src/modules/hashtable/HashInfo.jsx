import { computeLoadFactor, loadFactorColor } from './hashUtils';

const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

const ops = [
  { op: 'Insert',  avg: 'O(1)',    worst: 'O(n)', note: 'Worst when all keys collide' },
  { op: 'Search',  avg: 'O(1)',    worst: 'O(n)', note: 'Chain traversal in worst case' },
  { op: 'Delete',  avg: 'O(1)',    worst: 'O(n)', note: 'Must scan chain to remove' },
  { op: 'Space',   avg: 'O(n+m)',  worst: 'O(n+m)', note: 'n entries + m buckets' },
];

export default function HashInfo({ table }) {
  const lf = computeLoadFactor(table.count, table.size);
  const lfColor = loadFactorColor(parseFloat(lf));
  const maxChain = Math.max(...table.buckets.map((b) => b.length));
  const occupied = table.buckets.filter((b) => b.length > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>Live stats</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {[
            { label: 'Load factor λ', value: lf,       color: lfColor },
            { label: 'Entries',       value: table.count, color: 'var(--accent)' },
            { label: 'Occupied buckets', value: `${occupied} / ${table.size}`, color: '#4a9eff' },
            { label: 'Max chain len', value: maxChain,  color: maxChain > 2 ? '#f87171' : '#34d399' },
          ].map((s) => (
            <div key={s.label} style={{ padding: '0.5rem 0.65rem', borderRadius: '0.45rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>{s.label}</p>
              <p style={{ fontSize: '1.15rem', fontWeight: '900', color: s.color, letterSpacing: '-0.03em' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>How separate chaining works</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Each bucket holds a <strong style={{ color: 'var(--text-primary)' }}>linked list (chain)</strong> of entries that hash to the same index.
          A good hash function distributes keys uniformly, keeping chains short.
          The <strong style={{ color: lfColor }}>load factor λ = entries / buckets</strong> measures how full the table is — 
          keep λ &lt; 0.75 for O(1) average performance.
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[{ c: '#34d399', t: 'λ < 0.5 — healthy' }, { c: '#ffd166', t: 'λ < 0.75 — ok' }, { c: '#f87171', t: 'λ ≥ 0.75 — resize!' }].map((l) => (
            <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: l.c, display: 'inline-block' }} />{l.t}
            </span>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Time complexity</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.6rem', fontSize: '0.73rem' }}>
          {['Op', 'Avg', 'Worst'].map((h) => (
            <span key={h} style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {ops.map((c) => (
            <>
              <span key={c.op}      style={{ color: 'var(--text-secondary)' }}>{c.op}</span>
              <span key={c.op+'a'}  style={{ color: '#34d399', fontWeight: '600', fontFamily: 'monospace' }}>{c.avg}</span>
              <span key={c.op+'w'}  style={{ color: '#ffd166', fontWeight: '600', fontFamily: 'monospace' }}>{c.worst}</span>
            </>
          ))}
        </div>
      </div>

    </div>
  );
}
