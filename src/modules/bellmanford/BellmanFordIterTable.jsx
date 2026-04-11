import React, { useMemo } from 'react';

export default function BellmanFordIterTable({
  steps = [],
  currentStepIndex = 0,
  currentIteration = 0,
  step = null,
}) {
  const rows = useMemo(() => buildRows(steps, step), [steps, step]);
  const nodeIds = useMemo(() => collectNodeIds(rows), [rows]);

  return (
    <section
      className="bellmanford-iter-table"
      style={panelStyle}
    >
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Iteration tracking</p>
          <h3 style={titleStyle}>Distance evolution</h3>
        </div>

        <div style={summaryWrapStyle}>
          <span style={summaryChipStyle}>Step {currentStepIndex + 1}</span>
          <span style={summaryChipMutedStyle}>Round {currentIteration}</span>
        </div>
      </div>

      {rows.length === 0 || nodeIds.length === 0 ? (
        <div style={emptyStyle}>
          Iteration snapshots will appear here once Bellman-Ford steps are available.
        </div>
      ) : (
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, ...stickyColStyle }}>Round</th>
                {nodeIds.map((nodeId) => (
                  <th key={nodeId} style={thStyle}>
                    {nodeId}
                  </th>
                ))}
                <th style={thStyle}>Relaxed edge</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const isActive = index === clampIndex(currentStepIndex, rows.length);
                return (
                  <tr
                    key={`${row.iteration}-${index}`}
                    style={isActive ? activeRowStyle : undefined}
                  >
                    <td style={{ ...tdStyle, ...stickyColStyle, fontWeight: 800 }}>
                      {row.iteration}
                    </td>

                    {nodeIds.map((nodeId) => {
                      const rawValue = row.distances[nodeId];
                      const isChanged = row.changedNodes.has(nodeId);

                      return (
                        <td
                          key={`${row.iteration}-${nodeId}`}
                          style={{
                            ...tdStyle,
                            ...(isChanged ? changedCellStyle : null),
                          }}
                        >
                          {formatDistance(rawValue)}
                        </td>
                      );
                    })}

                    <td style={{ ...tdStyle, minWidth: '140px' }}>
                      {formatEdge(row.activeEdge)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function buildRows(steps, currentStep) {
  if (!Array.isArray(steps) || steps.length === 0) {
    if (!currentStep) return [];
    return [normalizeStep(currentStep, 0, null)];
  }

  return steps.map((item, index) => {
    const prev = index > 0 ? steps[index - 1] : null;
    return normalizeStep(item, index, prev);
  });
}

function normalizeStep(step, index, prevStep) {
  const distances = extractDistances(step);
  const prevDistances = extractDistances(prevStep);
  const activeEdge = extractEdge(step);
  const iteration = step?.iteration ?? step?.pass ?? step?.round ?? index;
  const changedNodes = new Set();

  Object.keys(distances).forEach((nodeId) => {
    const currentValue = normalizeDistanceValue(distances[nodeId]);
    const previousValue = normalizeDistanceValue(prevDistances[nodeId]);

    if (index === 0) {
      if (currentValue !== '∞' && currentValue !== previousValue) {
        changedNodes.add(nodeId);
      }
      return;
    }

    if (currentValue !== previousValue) {
      changedNodes.add(nodeId);
    }
  });

  return {
    iteration,
    distances,
    activeEdge,
    changedNodes,
  };
}

function extractDistances(step) {
  if (!step || typeof step !== 'object') return {};

  const candidates = [
    step.distances,
    step.distanceMap,
    step.dist,
    step.currentDistances,
    step.tableRow,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return candidate;
    }
  }

  return {};
}

function extractEdge(step) {
  if (!step || typeof step !== 'object') return null;
  return step.activeEdge || step.edge || step.relaxedEdge || null;
}

function collectNodeIds(rows) {
  const set = new Set();

  rows.forEach((row) => {
    Object.keys(row.distances || {}).forEach((nodeId) => set.add(nodeId));
  });

  return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
}

function normalizeDistanceValue(value) {
  if (
    value === Infinity ||
    value === Number.POSITIVE_INFINITY ||
    value === 'Infinity' ||
    value === null ||
    value === undefined
  ) {
    return '∞';
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return '∞';
  }

  return String(value);
}

function formatDistance(value) {
  return normalizeDistanceValue(value);
}

function formatEdge(edge) {
  if (!edge) return '—';

  if (typeof edge === 'string') return edge;

  const from = edge.from ?? edge.u ?? edge.source ?? '?';
  const to = edge.to ?? edge.v ?? edge.target ?? '?';
  const weight =
    edge.weight ?? edge.w ?? edge.cost ?? edge.label ?? null;

  return weight === null ? `${from} → ${to}` : `${from} → ${to} (${weight})`;
}

function clampIndex(index, length) {
  if (!length) return 0;
  return Math.max(0, Math.min(index, length - 1));
}

const panelStyle = {
  background: 'var(--bg-card, #161b22)',
  border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
  borderRadius: '16px',
  padding: '16px',
  minHeight: '220px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '14px',
  flexWrap: 'wrap',
};

const eyebrowStyle = {
  margin: 0,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary, #94a3b8)',
};

const titleStyle = {
  margin: '4px 0 0',
  fontSize: '18px',
  fontWeight: 800,
  color: 'var(--text-primary, #f8fafc)',
};

const summaryWrapStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const summaryChipStyle = {
  padding: '6px 10px',
  borderRadius: '999px',
  background: 'rgba(0, 212, 170, 0.14)',
  color: '#00d4aa',
  fontSize: '12px',
  fontWeight: 700,
};

const summaryChipMutedStyle = {
  padding: '6px 10px',
  borderRadius: '999px',
  background: 'rgba(148, 163, 184, 0.14)',
  color: 'var(--text-secondary, #94a3b8)',
  fontSize: '12px',
  fontWeight: 700,
};

const emptyStyle = {
  display: 'grid',
  placeItems: 'center',
  minHeight: '140px',
  borderRadius: '12px',
  border: '1px dashed var(--border-color, rgba(255,255,255,0.08))',
  color: 'var(--text-secondary, #94a3b8)',
  fontSize: '14px',
  textAlign: 'center',
  padding: '16px',
};

const tableWrapStyle = {
  overflowX: 'auto',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.06)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '520px',
};

const thStyle = {
  textAlign: 'left',
  fontSize: '12px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary, #94a3b8)',
  background: 'var(--bg-secondary, #0f172a)',
  padding: '12px 14px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '12px 14px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  color: 'var(--text-primary, #e5e7eb)',
  fontSize: '14px',
  whiteSpace: 'nowrap',
};

const stickyColStyle = {
  position: 'sticky',
  left: 0,
  zIndex: 1,
  background: 'inherit',
};

const activeRowStyle = {
  background: 'rgba(74, 158, 255, 0.10)',
};

const changedCellStyle = {
  color: '#00d4aa',
  fontWeight: 800,
};
