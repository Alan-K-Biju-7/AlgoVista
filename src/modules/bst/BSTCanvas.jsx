import { computeLayout } from './bstLayout';

export default function BSTCanvas({ root, highlightPath = [], foundVal = null, deletedVal = null }) {
  if (!root) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--border-default)', fontSize: '0.85rem' }}>
        Tree is empty — insert a value to begin
      </div>
    );
  }

  const { nodes, edges, nodeR } = computeLayout(root);
  const maxX = Math.max(...nodes.map((n) => n.x)) + nodeR + 16;
  const maxY = Math.max(...nodes.map((n) => n.y)) + nodeR + 16;

  const getNodeStyle = (val) => {
    if (val === foundVal)    return { fill: '#14532d', stroke: '#22c55e',  text: '#86efac' };
    if (val === deletedVal)  return { fill: '#450a0a', stroke: '#ef4444',  text: '#fca5a5' };
    if (highlightPath.includes(val) && val !== foundVal)
                             return { fill: '#1e3a5f', stroke: '#3b82f6',  text: '#93c5fd' };
    return                          { fill: 'var(--bg-elevated)', stroke: 'var(--border-default)',  text: 'var(--text-secondary)' };
  };

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '420px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '0.5rem' }}>
      <svg width={Math.max(maxX, 300)} height={Math.max(maxY, 200)} style={{ display: 'block' }}>
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        ))}
        {nodes.map((n) => {
          const s = getNodeStyle(n.val);
          return (
            <g key={n.val} style={{ transition: 'all 0.3s ease' }}>
              <circle cx={n.x} cy={n.y} r={nodeR}
                fill={s.fill} stroke={s.stroke} strokeWidth="2"
                style={{ filter: s.stroke !== 'var(--border-default)' ? `drop-shadow(0 0 6px ${s.stroke}88)` : 'none', transition: 'all 0.3s ease' }}
              />
              <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={s.text} fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif"
                style={{ userSelect: 'none', transition: 'fill 0.3s ease' }}>
                {n.val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
