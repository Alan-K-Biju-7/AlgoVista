import { computeTrieLayout } from './trieLayout';

function nodeStyle(node, highlightPath, phase) {
  const inPath = node.label !== 'ROOT' && highlightPath.includes(node.label);
  const isRoot = node.label === 'ROOT';

  if (phase === 'found' && inPath)
    return { fill: '#002a1f', stroke: '#00d4aa', text: '#00e5b8', ring: false };
  if (phase === 'notfound' && inPath)
    return { fill: '#2a0000', stroke: '#f87171', text: '#fca5a5', ring: false };
  if (inPath)
    return { fill: '#001a33', stroke: '#4a9eff', text: '#93c5fd', ring: false };
  if (node.isEnd)
    return { fill: 'rgba(0,212,170,0.08)', stroke: 'rgba(0,212,170,0.5)', text: '#34d399', ring: true };
  if (isRoot)
    return { fill: 'var(--bg-elevated)', stroke: 'var(--border-strong)', text: 'var(--text-muted)', ring: false };
  return { fill: 'var(--bg-elevated)', stroke: 'var(--border-default)', text: 'var(--text-muted)', ring: false };
}

export default function TrieCanvas({ root, highlightPath = [], phase = '' }) {
  if (!root || Object.keys(root.children).length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '280px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Trie is empty — insert a word to begin
      </div>
    );
  }

  const { nodes, edges, nodeR } = computeTrieLayout(root);
  const maxX = nodes.length ? Math.max(...nodes.map((n) => n.x)) + nodeR + 20 : 400;
  const maxY = nodes.length ? Math.max(...nodes.map((n) => n.y)) + nodeR + 20 : 280;

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflowX: 'auto', overflowY: 'auto', maxHeight: '420px' }}>
      <svg width={Math.max(maxX, 500)} height={Math.max(maxY, 280)} style={{ display: 'block' }}>
        <defs>
          <filter id="trie-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {edges.map((e, i) => (
          <g key={i}>
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <text x={(e.x1 + e.x2) / 2 - 8} y={(e.y1 + e.y2) / 2}
              fill={highlightPath.includes(e.label) ? '#4a9eff' : 'var(--text-muted)'}
              fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif"
              style={{ userSelect: 'none', transition: 'fill 0.3s' }}>
              {e.label}
            </text>
          </g>
        ))}

        {nodes.map((n) => {
          const s = nodeStyle(n, highlightPath, phase);
          const isPathNode = highlightPath.includes(n.label);
          return (
            <g key={n.id}>
              {n.isEnd && (
                <circle cx={n.x} cy={n.y} r={nodeR + 4}
                  fill="none" stroke="rgba(0,212,170,0.25)" strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}
              <circle cx={n.x} cy={n.y} r={nodeR}
                fill={s.fill} stroke={s.stroke} strokeWidth="2"
                filter={isPathNode ? 'url(#trie-glow)' : 'none'}
                style={{ transition: 'fill 0.3s, stroke 0.3s' }}
              />
              <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={s.text} fontSize={n.label === 'ROOT' ? '9' : '11'} fontWeight="700"
                fontFamily="Inter, sans-serif" style={{ userSelect: 'none' }}>
                {n.label === 'ROOT' ? '●' : n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
