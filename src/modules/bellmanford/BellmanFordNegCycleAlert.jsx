import React, { useMemo } from 'react';

export default function BellmanFordNegCycleAlert({
  hasNegativeCycle = false,
  cycleNodes = [],
  message = '',
  step = null,
}) {
  const model = useMemo(
    () => resolveNegativeCycleState({ hasNegativeCycle, cycleNodes, message, step }),
    [hasNegativeCycle, cycleNodes, message, step]
  );

  if (!model.active) {
    return (
      <section style={safePanelStyle} className="bellmanford-neg-cycle-alert">
        <div style={safeIconWrapStyle}>
          <span style={safeIconStyle}>✓</span>
        </div>

        <div style={contentStyle}>
          <p style={eyebrowStyle}>Cycle check</p>
          <h3 style={titleStyle}>No negative cycle detected</h3>
          <p style={bodyStyle}>
            The current Bellman-Ford state has not found a reachable negative cycle yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={dangerPanelStyle} className="bellmanford-neg-cycle-alert">
      <div style={dangerIconWrapStyle}>
        <span style={dangerIconStyle}>!</span>
      </div>

      <div style={contentStyle}>
        <p style={dangerEyebrowStyle}>Negative cycle detected</p>
        <h3 style={dangerTitleStyle}>Shortest paths are no longer reliable</h3>
        <p style={dangerBodyStyle}>
          {model.message ||
            'A reachable negative cycle was detected during the extra relaxation pass.'}
        </p>

        {model.nodes.length > 0 ? (
          <div style={chipsWrapStyle}>
            {model.nodes.map((node, index) => (
              <span key={`${node}-${index}`} style={nodeChipStyle}>
                {node}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function resolveNegativeCycleState({ hasNegativeCycle, cycleNodes, message, step }) {
  const stepFlag =
    step?.hasNegativeCycle ??
    step?.negativeCycle ??
    step?.isNegativeCycle ??
    step?.cycleDetected ??
    false;

  const active = Boolean(hasNegativeCycle || stepFlag);

  const stepNodes =
    step?.cycleNodes ||
    step?.negativeCycleNodes ||
    step?.affectedNodes ||
    step?.cycle ||
    [];

  const normalizedNodes = normalizeNodes(
    Array.isArray(cycleNodes) && cycleNodes.length ? cycleNodes : stepNodes
  );

  const resolvedMessage =
    message ||
    step?.negativeCycleMessage ||
    step?.message ||
    step?.alert ||
    '';

  return {
    active,
    nodes: normalizedNodes,
    message: resolvedMessage,
  };
}

function normalizeNodes(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);

  if (typeof value === 'string') {
    return value
      .split(/[\s,>-]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === 'object') {
    return Object.values(value).map(String);
  }

  return [];
}

const basePanelStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: '14px',
  alignItems: 'start',
  borderRadius: '16px',
  padding: '16px',
  border: '1px solid',
};

const safePanelStyle = {
  ...basePanelStyle,
  background: 'rgba(67, 122, 34, 0.10)',
  borderColor: 'rgba(67, 122, 34, 0.26)',
};

const dangerPanelStyle = {
  ...basePanelStyle,
  background: 'rgba(161, 53, 68, 0.12)',
  borderColor: 'rgba(221, 105, 116, 0.34)',
};

const safeIconWrapStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  background: 'rgba(67, 122, 34, 0.18)',
  display: 'grid',
  placeItems: 'center',
};

const dangerIconWrapStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  background: 'rgba(221, 105, 116, 0.16)',
  display: 'grid',
  placeItems: 'center',
};

const safeIconStyle = {
  color: '#6daa45',
  fontSize: '20px',
  fontWeight: 900,
  lineHeight: 1,
};

const dangerIconStyle = {
  color: '#ff8b98',
  fontSize: '22px',
  fontWeight: 900,
  lineHeight: 1,
};

const contentStyle = {
  display: 'grid',
  gap: '6px',
};

const eyebrowStyle = {
  margin: 0,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#8ccf65',
};

const dangerEyebrowStyle = {
  margin: 0,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#ff9aa5',
};

const titleStyle = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 800,
  color: 'var(--text-primary, #f8fafc)',
};

const dangerTitleStyle = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 800,
  color: '#fff1f3',
};

const bodyStyle = {
  margin: 0,
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '14px',
  lineHeight: 1.6,
};

const dangerBodyStyle = {
  margin: 0,
  color: '#ffd9de',
  fontSize: '14px',
  lineHeight: 1.6,
};

const chipsWrapStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '4px',
};

const nodeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '34px',
  minHeight: '30px',
  padding: '0 10px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff1f3',
  fontSize: '12px',
  fontWeight: 800,
};
