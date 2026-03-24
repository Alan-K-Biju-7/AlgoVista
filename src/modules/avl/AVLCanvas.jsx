import { computeAVLLayout } from './avlLayout';

function bfColor(bf) {
  if (bf === 0) return '#34d399';
  if (Math.abs(bf) === 1) return '#fbbf24';
  return '#f87171';
}

export default function AVLCanvas({ root, highlightPath = [], foundVal = null, deletedVal = null, rotatedVals = [] }) {
  if (!root) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', color: 'var(--border-default)', fontSize: '0.85rem' }}>
        Tree is empty — insert a value to begin
      </div>
    );
  }

  const { nodes, edges, nodeR } = computeAVLLayout(root);
  const maxX = Math.max(...nodes.map((n) => n.x)) + nodeR + 24;
  const maxY = Math.max(...nodes.map((n) => n.y)) + nodeR + 40;

  const getStyle = (val, bf) => {
    if (val === deletedVal)           return { fill: '#450a0a', stroke: '#ef4444',  text: '#fca5a5' };
    if (val === foundVal)             return { fill: '#14532d', stroke: '#22c55e',  text: '#86efac' };
    if (rotatedVals.includes(val))    return { fill: '#2e1065', stroke: '#a78bfa',  text: '#e9d5ff' };
    if (highlightPath.includes(val))  return { fill: '#1e3a5f', stroke: '#3b82f6',  text: '#93c5fd' };
    return                                   { fill: 'var(--bg-elevated)', stroke: 'var(--border-default)',  text: 'var(--text-secondary)' };
  };

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '460px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '0.5rem' }}>
      <svg width={Math.max(maxX, 340)} height={Math.max(maxY, 220)} style={{ display: 'block' }}>
        <defs>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        ))}

        {nodes.map((n) => {
          const s = getStyle(n.val, n.bf);
          const glowFilter = n.val === foundVal ? 'url(#glow-green)'
            : rotatedVals.includes(n.val) ? 'url(#glow-purple)'
            : highlightPath.includes(n.val) ? 'url(#glow-blue)'
            : 'none';

          return (
            <g key={n.val}>
              <circle cx={n.x} cy={n.y} r={nodeR}
                fill={s.fill} stroke={s.stroke} strokeWidth="2"
                filter={glowFilter}
                style={{ transition: 'all 0.35s ease' }}
              />
              <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={s.text} fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif"
                style={{ userSelect: 'none' }}>
                {n.val}
              </text>
              <text x={n.x} y={n.y + nodeR + 11} textAnchor="middle"
                fill={bfColor(n.bf)} fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif"
                style={{ userSelect: 'none' }}>
                bf={n.bf}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
