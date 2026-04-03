import { useRef } from 'react';

const NODE_R = 22;

function nodeColor(id, dist, prev, shortestPath, current, negCycleNodes) {
  const INF = Infinity;
  if (negCycleNodes.includes(id))
    return { fill: '#1a0808', stroke: '#ef4444', text: '#fca5a5', glow: true };
  if (shortestPath.includes(id) && shortestPath.length > 1)
    return { fill: '#002a1f', stroke: '#00d4aa', text: '#00e5b8', glow: true };
  if (id === current)
    return { fill: '#1a0e33', stroke: '#8b7cf8', text: '#c4b5fd', glow: true };
  if (dist && dist[id] !== undefined && dist[id] !== INF)
    return { fill: '#0d2e22', stroke: '#00a884', text: '#34d399', glow: false };
  return { fill: 'var(--bg-elevated)', stroke: 'var(--border-strong)', text: 'var(--text-muted)', glow: false };
}

function edgeColor(edge, activeEdge, relaxedEdge, shortestPath, negCycleEdges) {
  if (negCycleEdges.includes(edge.id))
    return { stroke: '#ef4444', width: 2.5, opacity: 1, dash: '5,3' };
  if (shortestPath.length > 1) {
    const inPath = shortestPath.some((id, i) => {
      if (i === 0) return false;
      return shortestPath[i - 1] === edge.from && id === edge.to;
    });
    if (inPath) return { stroke: '#00d4aa', width: 3, opacity: 1, dash: 'none' };
  }
  if (edge.id === relaxedEdge) return { stroke: '#ffd166', width: 2.5, opacity: 1, dash: 'none' };
  if (edge.id === activeEdge)  return { stroke: '#8b7cf8', width: 2, opacity: 1, dash: 'none' };
  return { stroke: edge.weight < 0 ? '#f87171' : 'var(--border-strong)', width: 1.5, opacity: edge.weight < 0 ? 0.55 : 0.4, dash: 'none' };
}

function arrowPoints(x1, y1, x2, y2, r) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ex = x2 - ux * (r + 6);
  const ey = y2 - uy * (r + 6);
  const ax = ex - ux * 10 + uy * 5;
  const ay = ey - uy * 10 - ux * 5;
  const bx = ex - ux * 10 - uy * 5;
  const by = ey - uy * 10 + ux * 5;
  return { ex, ey, ax, ay, bx, by, sx: x1 + ux * (r + 2), sy: y1 + uy * (r + 2) };
}

function midPoint(x1, y1, x2, y2, offset = 0) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const px = -dy / len, py = dx / len;
  return { x: (x1 + x2) / 2 + px * offset, y: (y1 + y2) / 2 + py * offset };
}

export default function BellmanFordCanvas({
  nodes, edges, dist, prev, shortestPath, activeEdge, relaxedEdge,
  negCycleEdges, onNodeDrag,
}) {
  const dragRef = useRef(null);
  const containerRef = useRef(null);

  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });

  const negCycleNodes = new Set();
  negCycleEdges.forEach((eid) => {
    const e = edges.find((x) => x.id === eid);
    if (e) { negCycleNodes.add(e.from); negCycleNodes.add(e.to); }
  });

  const handleMouseDown = (e, id) => { e.preventDefault(); dragRef.current = id; };
  const handleMouseMove = (e) => {
    if (!dragRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(NODE_R + 4, Math.min(e.clientX - rect.left, rect.width  - NODE_R - 4));
    const y = Math.max(NODE_R + 4, Math.min(e.clientY - rect.top,  rect.height - NODE_R - 4));
    onNodeDrag(dragRef.current, Math.round(x), Math.round(y));
  };
  const handleMouseUp = () => { dragRef.current = null; };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', minHeight: '390px', userSelect: 'none' }}>
      <svg width="100%" height="390" style={{ display: 'block' }}>
        <defs>
          <filter id="bf-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="bf-red-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {edges.map((edge) => {
          const f = nodeMap[edge.from];
          const t = nodeMap[edge.to];
          if (!f || !t) return null;
          const s = edgeColor(edge, activeEdge, relaxedEdge, shortestPath, negCycleEdges);
          const a = arrowPoints(f.x, f.y, t.x, t.y, NODE_R);
          const m = midPoint(f.x, f.y, t.x, t.y, -14);
          return (
            <g key={edge.id}>
              <line x1={a.sx} y1={a.sy} x2={a.ex} y2={a.ey}
                stroke={s.stroke} strokeWidth={s.width} opacity={s.opacity}
                strokeLinecap="round" strokeDasharray={s.dash === 'none' ? undefined : s.dash}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
              <polygon points={`${a.ex},${a.ey} ${a.ax},${a.ay} ${a.bx},${a.by}`}
                fill={s.stroke} opacity={s.opacity}
                style={{ transition: 'fill 0.3s' }}
              />
              <rect x={m.x - 12} y={m.y - 9} width={24} height={16} rx={3}
                fill="var(--bg-base)" opacity="0.9" />
              <text x={m.x} y={m.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={edge.weight < 0 ? '#f87171' : s.stroke === '#00d4aa' ? '#00d4aa' : s.stroke === '#ffd166' ? '#ffd166' : 'var(--text-muted)'}
                fontSize="10" fontWeight="700" fontFamily="monospace"
                style={{ userSelect: 'none', transition: 'fill 0.3s' }}>
                {edge.weight}
              </text>
            </g>
          );
        })}

        {nodes.map((node) => {
          const s = nodeColor(node.id, dist, prev, shortestPath, null, [...negCycleNodes]);
          const d = dist ? dist[node.id] : null;
          const distLabel = d === undefined || d === Infinity ? '∞' : d;
          return (
            <g key={node.id} onMouseDown={(e) => handleMouseDown(e, node.id)} style={{ cursor: 'grab' }}>
              <circle cx={node.x} cy={node.y} r={NODE_R}
                fill={s.fill} stroke={s.stroke} strokeWidth="2"
                filter={s.glow ? (s.stroke === '#ef4444' ? 'url(#bf-red-glow)' : 'url(#bf-glow)') : 'none'}
                style={{ transition: 'fill 0.3s, stroke 0.3s' }}
              />
              <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={s.text} fontSize="12" fontWeight="800" fontFamily="Inter, sans-serif"
                style={{ userSelect: 'none', pointerEvents: 'none' }}>
                {node.id}
              </text>
              {dist && (
                <text x={node.x} y={node.y + NODE_R + 13} textAnchor="middle"
                  fill={s.text} fontSize="10" fontWeight="700" fontFamily="monospace"
                  style={{ userSelect: 'none', pointerEvents: 'none', transition: 'fill 0.3s' }}>
                  {distLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
