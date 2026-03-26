import { useRef } from 'react';

const NODE_R = 22;

function nodeStyle(id, visitedSet, frontierSet, currentNode) {
  if (id === currentNode)   return { fill: '#002a1f', stroke: '#00d4aa', text: '#00e5b8', glow: 'url(#teal-glow)' };
  if (visitedSet.has(id))   return { fill: '#0d2e22', stroke: '#00a884', text: '#34d399', glow: 'none' };
  if (frontierSet.has(id))  return { fill: '#2e2200', stroke: '#ffd166', text: '#ffd166', glow: 'url(#yellow-glow)' };
  return { fill: 'var(--bg-elevated)', stroke: 'var(--border-strong)', text: 'var(--text-muted)', glow: 'none' };
}

function isTree(edge, treeEdges) {
  return treeEdges.some(
    (te) => (te.from === edge.from && te.to === edge.to) || (te.from === edge.to && te.to === edge.from)
  );
}

export default function GraphCanvas({ nodes, edges, visitedSet, frontierSet, currentNode, treeEdges, onNodeDrag }) {
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
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', minHeight: '380px', userSelect: 'none' }}>

      {nodes.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '380px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Add nodes to begin
        </div>
      ) : (
        <svg width="100%" height="380" style={{ display: 'block' }}>
          <defs>
            <filter id="teal-glow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="yellow-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {edges.map((edge) => {
            const f = nodeMap[edge.from];
            const t = nodeMap[edge.to];
            if (!f || !t) return null;
            const tree = isTree(edge, treeEdges);
            return (
              <line key={edge.id}
                x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke={tree ? '#00d4aa' : 'var(--border-strong)'}
                strokeWidth={tree ? 2.5 : 1.5}
                opacity={tree ? 0.9 : 0.45}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
              />
            );
          })}

          {nodes.map((node) => {
            const s = nodeStyle(node.id, visitedSet, frontierSet, currentNode);
            return (
              <g key={node.id} onMouseDown={(e) => handleMouseDown(e, node.id)} style={{ cursor: 'grab' }}>
                <circle cx={node.x} cy={node.y} r={NODE_R}
                  fill={s.fill} stroke={s.stroke} strokeWidth="2"
                  filter={s.glow}
                  style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
                />
                <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={s.text} fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif"
                  style={{ userSelect: 'none', pointerEvents: 'none', transition: 'fill 0.3s ease' }}>
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
