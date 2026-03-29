import { useRef } from 'react';

const NODE_R = 22;

function nodeColor(id, visited, current, shortestPath) {
  if (shortestPath.includes(id) && shortestPath.length > 1)
    return { fill: '#002a1f', stroke: '#00d4aa', text: '#00e5b8', glow: true };
  if (id === current)
    return { fill: '#1a0e33', stroke: '#8b7cf8', text: '#c4b5fd', glow: true };
  if (visited.includes(id))
    return { fill: '#0d2e22', stroke: '#00a884', text: '#34d399', glow: false };
  return { fill: 'var(--bg-elevated)', stroke: 'var(--border-strong)', text: 'var(--text-muted)', glow: false };
}

function edgeColor(edge, relaxedEdge, shortestPath) {
  if (shortestPath.length > 1) {
    const inPath = shortestPath.some((id, i) => {
      if (i === 0) return false;
      const prev = shortestPath[i - 1];
      return (prev === edge.from && id === edge.to) || (prev === edge.to && id === edge.from);
    });
    if (inPath) return { stroke: '#00d4aa', width: 3, opacity: 1 };
  }
  if (relaxedEdge &&
    ((relaxedEdge.from === edge.from && relaxedEdge.to === edge.to) ||
     (relaxedEdge.from === edge.to   && relaxedEdge.to === edge.from)))
    return { stroke: '#ffd166', width: 2.5, opacity: 1 };
  return { stroke: 'var(--border-strong)', width: 1.5, opacity: 0.4 };
}

export default function DijkstraCanvas({ nodes, edges, visited, current, relaxedEdge, shortestPath, dist, onNodeDrag }) {
  const dragRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseDown = (e, id) => { e.preventDefault(); dragRef.current = id; };
  const handleMouseMove = (e) => {
    if (!dragRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(NODE_R + 4, Math.min(e.clientX - rect.left, rect.width  - NODE_R - 4));
    const y = Math.max(NODE_R + 4, Math.min(e.clientY - rect.top,  rect.height - NODE_R - 4));
    onNodeDrag(dragRef.current, Math.round(x), Math.round(y));
  };
  const handleMouseUp = () => { dragRef.current = null; };

  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', minHeight: '390px', userSelect: 'none' }}>
      <svg width="100%" height="390" style={{ display: 'block' }}>
        <defs>
          <filter id="dijk-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dijk-purple-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {edges.map((edge) => {
          const f = nodeMap[edge.from];
          const t = nodeMap[edge.to];
          if (!f || !t) return null;
          const s = edgeColor(edge, relaxedEdge, shortestPath);
          const mx = (f.x + t.x) / 2;
          const my = (f.y + t.y) / 2;
          return (
            <g key={edge.id}>
              <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke={s.stroke} strokeWidth={s.width} opacity={s.opacity}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
              <rect x={mx - 10} y={my - 9} width={20} height={16} rx={3}
                fill="var(--bg-base)" opacity="0.85" />
              <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="middle"
                fill={s.stroke === '#00d4aa' ? '#00d4aa' : s.stroke === '#ffd166' ? '#ffd166' : 'var(--text-muted)'}
                fontSize="10" fontWeight="700" fontFamily="monospace"
                style={{ userSelect: 'none', transition: 'fill 0.3s' }}>
                {edge.weight}
              </text>
            </g>
          );
        })}

        {nodes.map((node) => {
          const s = nodeColor(node.id, visited, current, shortestPath);
          const d = dist ? dist[node.id] : null;
          const distLabel = d === undefined || d === Infinity ? '∞' : d;
          return (
            <g key={node.id} onMouseDown={(e) => handleMouseDown(e, node.id)} style={{ cursor: 'grab' }}>
              <circle cx={node.x} cy={node.y} r={NODE_R}
                fill={s.fill} stroke={s.stroke} strokeWidth="2"
                filter={s.glow ? 'url(#dijk-glow)' : 'none'}
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
