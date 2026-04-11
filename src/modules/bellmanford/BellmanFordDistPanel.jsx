import React from 'react';

export default function BellmanFordDistPanel({
  distances = {},
  source = null,
  step = null,
}) {
  const entries = Object.entries(distances || {}).sort(([a], [b]) =>
    String(a).localeCompare(String(b))
  );

  return (
    <section style={panelStyle} className="bellmanford-dist-panel">
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Distance table</p>
          <h3 style={titleStyle}>Current shortest estimates</h3>
        </div>
        <span style={sourceBadgeStyle}>
          Source: <strong>{source ?? '—'}</strong>
        </span>
      </div>

      {step?.message ? <p style={captionStyle}>{step.message}</p> : null}

      {entries.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={emptyTitleStyle}>No distances yet</p>
          <p style={emptyBodyStyle}>
            Start or step through the algorithm to populate the distance table.
          </p>
        </div>
      ) : (
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Node</th>
                <th style={thStyle}>Distance</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([node, value]) => {
                const isSource = String(node) === String(source);
                const isInfinite = value === Infinity || value === 'Infinity' || value == null;

                return (
                  <tr key={node} style={rowStyle}>
                    <td style={tdStyle}>
                      <div style={nodeCellStyle}>
                        <span
                          style={{
                            ...nodeBadgeStyle,
                            background: isSource
                              ? 'rgba(245, 166, 35, 0.16)'
                              : 'rgba(255,255,255,0.06)',
                            color: isSource ? '#f5a623' : 'var(--text-primary, #f8fafc)',
                            borderColor: isSource
                              ? 'rgba(245, 166, 35, 0.28)'
                              : 'rgba(255,255,255,0.08)',
                          }}
                        >
                          {node}
                        </span>
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...distanceValueStyle,
                          color: isInfinite ? '#94a3b8' : '#7ed957',
                        }}
                      >
                        {formatDistance(value)}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusPillStyle,
                          background: isSource
                            ? 'rgba(245, 166, 35, 0.14)'
                            : isInfinite
                            ? 'rgba(148, 163, 184, 0.12)'
                            : 'rgba(67, 122, 34, 0.14)',
                          color: isSource
                            ? '#f5a623'
                            : isInfinite
                            ? '#94a3b8'
                            : '#9be16f',
                        }}
                      >
                        {isSource ? 'Source' : isInfinite ? 'Unreached' : 'Reachable'}
                      </span>
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

function formatDistance(value) {
  if (value === Infinity || value === 'Infinity' || value == null) return '∞';
  if (typeof value === 'number' && Number.isInteger(value)) return String(value);
  if (typeof value === 'number') return value.toFixed(2);
  return String(value);
}

const panelStyle = {
  background: 'var(--bg-card, #161b22)',
  border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
  borderRadius: '18px',
  padding: '16px',
  display: 'grid',
  gap: '14px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
  flexWrap: 'wrap',
};

const eyebrowStyle = {
  margin: 0,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--text-muted, #94a3b8)',
  fontWeight: 700,
};

const titleStyle = {
  margin: '4px 0 0',
  color: 'var(--text-primary, #f8fafc)',
  fontSize: '18px',
  fontWeight: 800,
};

const sourceBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  minHeight: '32px',
  padding: '0 10px',
  borderRadius: '999px',
  background: 'rgba(245, 166, 35, 0.14)',
  color: '#f5a623',
  fontSize: '12px',
  fontWeight: 700,
};

const captionStyle = {
  margin: 0,
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '14px',
  lineHeight: 1.6,
};

const emptyStateStyle = {
  borderRadius: '14px',
  border: '1px dashed rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.02)',
  padding: '18px',
  display: 'grid',
  gap: '8px',
  minHeight: '150px',
  alignContent: 'center',
};

const emptyTitleStyle = {
  margin: 0,
  color: 'var(--text-primary, #f8fafc)',
  fontSize: '15px',
  fontWeight: 700,
};

const emptyBodyStyle = {
  margin: 0,
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '14px',
  lineHeight: 1.6,
};

const tableWrapStyle = {
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  textAlign: 'left',
  padding: '0 0 12px',
  color: 'var(--text-muted, #94a3b8)',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const rowStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const tdStyle = {
  padding: '12px 0',
  verticalAlign: 'middle',
};

const nodeCellStyle = {
  display: 'flex',
  alignItems: 'center',
};

const nodeBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '34px',
  minHeight: '30px',
  padding: '0 10px',
  borderRadius: '999px',
  border: '1px solid',
  fontSize: '12px',
  fontWeight: 800,
};

const distanceValueStyle = {
  fontSize: '15px',
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
};

const statusPillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '26px',
  padding: '0 8px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 700,
};
