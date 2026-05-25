import React, { useEffect, useMemo, useRef } from 'react';

const WIDTH = 760;
const HEIGHT = 420;
const NODE_RADIUS = 24;

export default function BellmanFordCanvas({
  nodes = [],
  edges = [],
  step = null,
  activeEdge = null,
  source = null,
}) {
  const canvasRef = useRef(null);

  const normalizedNodes = useMemo(() => normalizeNodes(nodes), [nodes]);
  const normalizedEdges = useMemo(() => normalizeEdges(edges), [edges]);
  const distances = useMemo(() => extractDistances(step), [step]);
  const highlightedEdge = useMemo(
    () => findHighlightedEdge(activeEdge, step, normalizedEdges),
    [activeEdge, step, normalizedEdges]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rectWidth = canvas.clientWidth || WIDTH;
    const rectHeight = canvas.clientHeight || HEIGHT;

    canvas.width = rectWidth * dpr;
    canvas.height = rectHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawScene({
      ctx,
      width: rectWidth,
      height: rectHeight,
      nodes: normalizedNodes,
      edges: normalizedEdges,
      distances,
      highlightedEdge,
      source,
    });
  }, [normalizedNodes, normalizedEdges, distances, highlightedEdge, source]);

  return (
    <div style={wrapStyle}>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={canvasStyle}
      />

      <div style={legendStyle}>
        <LegendDot color="#00d4aa" label="Source / improved node" />
        <LegendDot color="#f5a623" label="Active edge" />
        <LegendDot color="#4a9eff" label="Reachable node" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={legendItemStyle}>
      <span
        style={{
          ...legendSwatchStyle,
          background: color,
          boxShadow: `0 0 0 4px ${hexToAlpha(color, 0.16)}`,
        }}
      />
      <span>{label}</span>
    </div>
  );
}

function drawScene({
  ctx,
  width,
  height,
  nodes,
  edges,
  distances,
  highlightedEdge,
  source,
}) {
  const palette = {
    bgTop: 'var(--bg-secondary, #0f172a)',
    bgBottom: 'var(--bg-card, #111827)',
    grid: 'rgba(255,255,255,0.04)',
    edge: 'rgba(148,163,184,0.55)',
    edgeMuted: 'rgba(148,163,184,0.22)',
    edgeActive: '#f5a623',
    nodeFill: '#1f2937',
    nodeStroke: 'rgba(148,163,184,0.32)',
    nodeText: '#f8fafc',
    reachableFill: '#102a43',
    reachableStroke: '#4a9eff',
    sourceFill: '#0b3b33',
    sourceStroke: '#00d4aa',
    distanceBg: 'rgba(15,23,42,0.95)',
    distanceText: '#e5e7eb',
    labelText: '#94a3b8',
  };

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0b1220');
  gradient.addColorStop(1, '#111827');

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  drawGrid(ctx, width, height, palette.grid);

  edges.forEach((edge) => {
    const from = nodes.find((node) => node.id === edge.from);
    const to = nodes.find((node) => node.id === edge.to);
    if (!from || !to) return;

    const isActive = isSameEdge(edge, highlightedEdge);
    drawDirectedEdge(ctx, from, to, edge.weight, {
      stroke: isActive ? palette.edgeActive : palette.edge,
      text: isActive ? palette.edgeActive : palette.labelText,
      width: isActive ? 3 : 2,
      glow: isActive,
      muted: !isActive && highlightedEdge,
      mutedStroke: palette.edgeMuted,
    });
  });

  nodes.forEach((node) => {
    const distance = distances[node.id];
    const isSource = source && node.id === source;
    const isReachable = distance !== undefined && distance !== null && distance !== Infinity;

    let fill = palette.nodeFill;
    let stroke = palette.nodeStroke;
    let halo = null;

    if (isReachable) {
      fill = palette.reachableFill;
      stroke = palette.reachableStroke;
      halo = hexToAlpha('#4a9eff', 0.18);
    }

    if (isSource) {
      fill = palette.sourceFill;
      stroke = palette.sourceStroke;
      halo = hexToAlpha('#00d4aa', 0.2);
    }

    drawNode(ctx, node, {
      fill,
      stroke,
      text: palette.nodeText,
      halo,
    });

    drawDistanceBadge(
      ctx,
      node,
      formatDistance(distance),
      palette.distanceBg,
      palette.distanceText
    );
  });
}

function drawGrid(ctx, width, height, strokeStyle) {
  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 1;

  for (let x = 24; x < width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 24; y < height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDirectedEdge(ctx, from, to, weight, options) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const startX = from.x + Math.cos(angle) * NODE_RADIUS;
  const startY = from.y + Math.sin(angle) * NODE_RADIUS;
  const endX = to.x - Math.cos(angle) * NODE_RADIUS;
  const endY = to.y - Math.sin(angle) * NODE_RADIUS;

  ctx.save();
  ctx.strokeStyle = options.muted && !options.glow ? options.mutedStroke : options.stroke;
  ctx.lineWidth = options.width;

  if (options.glow) {
    ctx.shadowColor = options.stroke;
    ctx.shadowBlur = 14;
  }

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  drawArrowHead(ctx, endX, endY, angle, options.stroke);
  drawEdgeLabel(ctx, startX, startY, endX, endY, weight, options.text);

  ctx.restore();
}

function drawArrowHead(ctx, x, y, angle, color) {
  const size = 10;

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x - size * Math.cos(angle - Math.PI / 6),
    y - size * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x - size * Math.cos(angle + Math.PI / 6),
    y - size * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawEdgeLabel(ctx, x1, y1, x2, y2, weight, color) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  ctx.save();
  ctx.font = '600 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = String(weight ?? '');
  const metrics = ctx.measureText(text);
  const padX = 8;
  const w = metrics.width + padX * 2;
  const h = 24;

  ctx.fillStyle = 'rgba(15,23,42,0.96)';
  roundRect(ctx, mx - w / 2, my - h / 2, w, h, 999);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  roundRect(ctx, mx - w / 2, my - h / 2, w, h, 999);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(text, mx, my + 0.5);
  ctx.restore();
}

function drawNode(ctx, node, colors) {
  ctx.save();

  if (colors.halo) {
    ctx.shadowColor = colors.halo;
    ctx.shadowBlur = 18;
  }

  ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = colors.text;
  ctx.font = '700 15px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(node.id), node.x, node.y + 0.5);

  ctx.restore();
}

function drawDistanceBadge(ctx, node, text, bg, color) {
  const badgeText = `d=${text}`;
  const x = node.x;
  const y = node.y + NODE_RADIUS + 18;

  ctx.save();
  ctx.font = '600 11px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(badgeText);
  const w = metrics.width + 12;
  const h = 20;

  ctx.fillStyle = bg;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 999);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 999);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(badgeText, x, y + 0.5);

  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function normalizeNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return [
      { id: 'A', x: 120, y: 120 },
      { id: 'B', x: 300, y: 100 },
      { id: 'C', x: 280, y: 250 },
      { id: 'D', x: 500, y: 180 },
    ];
  }

  return nodes.map((node, index) => ({
    id: node.id ?? node.label ?? String(index),
    x: typeof node.x === 'number' ? node.x : 120 + index * 120,
    y: typeof node.y === 'number' ? node.y : 180,
  }));
}

function normalizeEdges(edges) {
  if (!Array.isArray(edges)) return [];
  return edges
    .map((edge) => ({
      from: edge.from ?? edge.u ?? edge.source,
      to: edge.to ?? edge.v ?? edge.target,
      weight: edge.weight ?? edge.w ?? edge.cost ?? 0,
    }))
    .filter((edge) => edge.from !== undefined && edge.to !== undefined);
}

function extractDistances(step) {
  if (!step || typeof step !== 'object') return {};
  return (
    step.distances ||
    step.distanceMap ||
    step.dist ||
    step.currentDistances ||
    {}
  );
}

function findHighlightedEdge(activeEdge, step, edges) {
  const candidate =
    activeEdge ||
    step?.activeEdge ||
    step?.edge ||
    step?.relaxedEdge ||
    null;

  if (!candidate) return null;

  if (typeof candidate === 'string') {
    return edges.find(
      (edge) =>
        `${edge.from}->${edge.to}` === candidate ||
        `${edge.from}-${edge.to}` === candidate
    ) || null;
  }

  const normalized = {
    from: candidate.from ?? candidate.u ?? candidate.source,
    to: candidate.to ?? candidate.v ?? candidate.target,
    weight: candidate.weight ?? candidate.w ?? candidate.cost,
  };

  return (
    edges.find((edge) => isSameEdge(edge, normalized)) ||
    normalized
  );
}

function isSameEdge(a, b) {
  if (!a || !b) return false;
  const sameFrom = String(a.from) === String(b.from);
  const sameTo = String(a.to) === String(b.to);

  if (!sameFrom || !sameTo) return false;

  if (b.weight === undefined || b.weight === null) return true;
  return String(a.weight) === String(b.weight);
}

function formatDistance(value) {
  if (
    value === undefined ||
    value === null ||
    value === Infinity ||
    value === Number.POSITIVE_INFINITY ||
    value === 'Infinity'
  ) {
    return '∞';
  }

  return String(value);
}

function hexToAlpha(hex, alpha) {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((char) => char + char)
          .join('')
      : clean;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const wrapStyle = {
  display: 'grid',
  gap: '12px',
};

const canvasStyle = {
  width: '100%',
  minHeight: '420px',
  height: '420px',
  display: 'block',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(180deg, #0b1220 0%, #111827 100%)',
};

const legendStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
  color: 'var(--text-secondary, #94a3b8)',
  fontSize: '13px',
};

const legendItemStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

const legendSwatchStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '999px',
  display: 'inline-block',
};
