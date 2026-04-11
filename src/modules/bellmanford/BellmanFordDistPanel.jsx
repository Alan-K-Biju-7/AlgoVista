import React, { useMemo } from 'react';

export default function BellmanFordDistPanel({
  distances = {},
  source = null,
  step = null,
}) {
  const normalizedDistances = useMemo(
    () => normalizeDistances(distances, step),
    [distances, step]
  );

  const entries = useMemo(
    () =>
      Object.entries(normalizedDistances).sort(([a], [b]) =>
        String(a).localeCompare(String(b))
      ),
    [normalizedDistances]
  );

  return (
    <section style={panelStyle} className="bellmanford-dist-panel">
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Distance values</p>
          <h3 style={titleStyle}>Current shortest estimates</h3>
        </div>

        {source ? <span style={sourceBadgeStyle}>Source: {source}</span> : null}
      </div>

      {entries.length === 0 ? (
        <div style={emptyStyle}>
          No distance state is available for the current Bellman-Ford step.
        </div>
      ) : (
        <div style={gridStyle}>
          {entries.map(([nodeId, value]) => {
            const isSource = source !== null && String(nodeId) === String(source);
            const isInfinite = isInfinityLike(value);

            return (
              <article
                key={nodeId}
                style={{
                  ...cardStyle,
                  ...(isSource ? sourceCardStyle : null),
                }}
              >
                <div style={cardHeaderStyle}>
                  <span style={nodeBadgeStyle}>{nodeId}</span>
                  {isSource ? <span style={miniSourceTagStyle}>source</span> : null}
                </div>

                <div
                  style={{
                    ...distanceValueStyle,
                    color: isInfinite ? '#94a3b8' : isSource ? '#00d4aa' : '#f8fafc',
                  }}
                >
                  {formatDistance(value)}
                </div>

                <p style={hintStyle}>
                  {isInfinite
                    ? 'Not reachable yet'
                    : isSource
                    ? 'Starting point distance'
                    : 'Best known distance so far'}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function normalizeDistances(distances, step) {
  const stepDistances =
    step?.distances ||
    step?.distanceMap ||
    step?.dist ||
    step?.currentDistances ||
    null;

  const candidate =
    isPlainObject(distances) && Object.keys(distances).length > 0
      ? distances
      : stepDistances;

  if (!isPlainObject(candidate)) return {};
  return candidate;
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isInfinityLike(value) {
  return (
    value === undefined ||
    value === null ||
    value === Infinity ||
    value === Number.POSITIVE_INFINITY ||
    value === 'Infinity' ||
    value === '∞'
  );
}

function formatDistance(value) {
  if (isInfinityLike(value)) return '∞';
  return String(value);
}

const panelStyle = {
  background: 'var(--bg-card, #161b22)',
  border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
  borderRadius: '16px',
  padding: '16px',
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

const sourceBadgeStyle = {
  padding: '7px 10px',
  borderRadius: '999px',
  background: 'rgba(0, 212, 170, 0.14)',
  color: '#00d4aa',
  fontSize: '12px',
  fontWeight: 700,
  whiteSpace: 'nowrap',
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '12px',
};

const cardStyle = {
  background: 'var(--bg-secondary, #0f172a)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '14px',
  padding: '12px',
  display: 'grid',
  gap: '8px',
};

const sourceCardStyle = {
  border: '1px solid rgba(0, 212, 170, 0.28)',
  boxShadow: '0 0 0 1px rgba(0, 212, 170, 0.08) inset',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
};

const nodeBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '32px',
  height: '28px',
  padding: '0 10px',
  borderRadius: '999px',
  background: 'rgba(74, 158, 255, 0.14)',
  color: '#4a9eff',
  fontSize: '12px',
  fontWeight: 800,
};

const miniSourceTagStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#00d4aa',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const distanceValueStyle = {
  fontSize: '28px',
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: '-0.03em',
};

const hintStyle = {
  margin: 0,
  color: 'var(--text-secondary, #94a3b8)',
  fontSize: '12px',
  lineHeight: 1.5,
};
