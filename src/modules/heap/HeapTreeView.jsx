import { computeHeapTreeLayout } from './heapTreeLayout';

function nodeColor(idx, highlightIdx, swapPair, phase) {
  if (swapPair && swapPair.includes(idx)) {
    return { fill: '#2a1a00', stroke: '#ffd166', text: '#ffd166', glow: true };
  }
  if (highlightIdx.includes(idx)) {
    if (phase === 'extract' || phase === 'done')
      return { fill: '#002a1f', stroke: '#00d4aa', text: '#00e5b8', glow: true };
    if (phase === 'insert' || phase === 'move')
      return { fill: '#001a33', stroke: '#4a9eff', text: '#93c5fd', glow: true };
    return { fill: '#1a1233', stroke: '#8b7cf8', text: '#c4b5fd', glow: true };
  }
  if (idx === 0)
    return { fill: 'rgba(0,212,170,0.08)', stroke: 'rgba(0,212,170,0.4)', text: '#34d399', glow: false };
  return { fill: 'var(--bg-elevated)', stroke: 'var(--border-strong)', text: 'var(--text-muted)', glow: false };
}

export default function HeapTreeView({ heap, highlightIdx = [], swapPair = null, phase = '' }) {
  if (!heap || heap.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Heap is empty — insert a value to begin
      </div>
    );
  }

  const { nodes, edges, nodeR } = computeHeapTreeLayout(heap);
  const maxX = Math.max(...nodes.map((n) => n.x)) + nodeR + 20;
  const maxY = Math.max(...nodes.map((n) => n.y)) + nodeR + 20;

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflowX: 'auto', overflowY: 'auto', maxHeight: '320px' }}>
      <svg width={Math.max(maxX, 360)} height={Math.max(maxY, 200)} style={{ display: 'block' }}>
        <defs>
          <filter id="heap-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        ))}

        {nodes.map((n) => {
          const s = nodeColor(n.idx, highlightIdx, swapPair, phase);
          return (
            <g key={n.idx} style={{ transition: 'all 0.35s ease' }}>
              <circle cx={n.x} cy={n.y} r={nodeR}
                fill={s.fill} stroke={s.stroke} strokeWidth="2"
                filter={s.glow ? 'url(#heap-glow)' : 'none'}
                style={{ transition: 'fill 0.3s, stroke 0.3s' }}
              />
              <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={s.text} fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif"
                style={{ userSelect: 'none', transition: 'fill 0.3s' }}>
                {n.val}
              </text>
              <text x={n.x} y={n.y + nodeR + 11} textAnchor="middle"
                fill="var(--text-faint)" fontSize="9" fontFamily="Inter, sans-serif"
                style={{ userSelect: 'none' }}>
                {n.idx}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
