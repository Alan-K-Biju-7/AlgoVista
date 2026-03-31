import { buildSplitTree } from './mergeSortLogic';

const NODE_H = 28;
const NODE_W = 72;
const V_GAP  = 52;
const H_GAP  = 8;

function layoutTree(node, depth = 0, offset = { val: 0 }) {
  if (!node) return null;
  const left  = node.left  ? layoutTree(node.left,  depth + 1, offset) : null;
  const x = offset.val * (NODE_W + H_GAP);
  if (!node.left && !node.right) offset.val++;
  const right = node.right ? layoutTree(node.right, depth + 1, offset) : null;
  if (node.left && node.right) {
    node._x = (left._x + right._x) / 2;
  } else {
    node._x = x;
  }
  node._depth = depth;
  node._left  = left;
  node._right = right;
  return node;
}

function collectNodes(node, nodes = [], edges = []) {
  if (!node) return;
  nodes.push(node);
  if (node._left) {
    edges.push({ x1: node._x, y1: node._depth, x2: node._left._x,  y2: node._left._depth });
    collectNodes(node._left,  nodes, edges);
  }
  if (node._right) {
    edges.push({ x1: node._x, y1: node._depth, x2: node._right._x, y2: node._right._depth });
    collectNodes(node._right, nodes, edges);
  }
  return { nodes, edges };
}

export default function MergeSplitTree({ arr, activeRange, phase }) {
  if (!arr || arr.length === 0) return null;

  const tree = buildSplitTree(arr);
  layoutTree(tree);
  const { nodes, edges } = collectNodes(tree);

  const toX = (n) => n._x * (NODE_W + H_GAP) + NODE_W / 2 + 8;
  const toY = (n) => n._depth * V_GAP + NODE_H / 2 + 8;
  const maxX = Math.max(...nodes.map((n) => toX(n))) + NODE_W / 2 + 16;
  const maxY = Math.max(...nodes.map((n) => toY(n))) + NODE_H / 2 + 16;

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflowX: 'auto', overflowY: 'auto', maxHeight: '360px' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0.9rem 1.1rem 0' }}>
        Recursive split tree
      </p>
      <svg width={Math.max(maxX, 400)} height={Math.max(maxY, 200)} style={{ display: 'block', padding: '0.5rem 0.5rem 0.75rem' }}>
        {edges.map((e, i) => {
          const x1 = e.x1 * (NODE_W + H_GAP) + NODE_W / 2 + 8;
          const y1 = e.y1 * V_GAP + NODE_H + 8;
          const x2 = e.x2 * (NODE_W + H_GAP) + NODE_W / 2 + 8;
          const y2 = e.y2 * V_GAP + 8;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-strong)" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />;
        })}

        {nodes.map((node, i) => {
          const cx = toX(node);
          const cy = toY(node);
          const isSingle = node.arr.length === 1;
          const isActive = activeRange &&
            node.startIdx >= activeRange[0] &&
            node.startIdx + node.arr.length - 1 <= activeRange[1];

          const fill   = phase === 'done' ? 'rgba(0,212,170,0.1)'
                       : isSingle ? 'rgba(0,212,170,0.08)'
                       : isActive ? 'rgba(74,158,255,0.08)'
                       : 'var(--bg-elevated)';
          const stroke = phase === 'done' ? 'rgba(0,212,170,0.5)'
                       : isSingle ? 'rgba(0,212,170,0.4)'
                       : isActive ? 'rgba(74,158,255,0.35)'
                       : 'var(--border-default)';
          const textColor = phase === 'done' ? '#34d399'
                          : isSingle ? 'var(--accent)'
                          : isActive ? '#93c5fd'
                          : 'var(--text-muted)';

          const label = node.arr.join(',');
          return (
            <g key={i}>
              <rect x={cx - NODE_W / 2} y={cy - NODE_H / 2} width={NODE_W} height={NODE_H}
                rx={5} fill={fill} stroke={stroke} strokeWidth="1.5"
                style={{ transition: 'fill 0.3s, stroke 0.3s' }}
              />
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                fill={textColor} fontSize="10" fontWeight="700" fontFamily="monospace"
                style={{ userSelect: 'none', transition: 'fill 0.3s' }}>
                {label.length > 10 ? label.slice(0, 9) + '…' : label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
