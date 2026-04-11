import React from 'react';

export default function BellmanFordHistory({ history = [] }) {
  const items = Array.isArray(history) ? history : [];

  return (
    <section style={panelStyle} className="bellmanford-history">
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Event log</p>
          <h3 style={titleStyle}>Relaxation history</h3>
        </div>
        <span style={countPillStyle}>{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={emptyTitleStyle}>No steps recorded yet</p>
          <p style={emptyBodyStyle}>
            Start the visualizer to see edge checks, relaxations, and cycle alerts appear here.
          </p>
        </div>
      ) : (
        <div style={listStyle}>
          {items.map((item, index) => {
            const tone = getTone(item?.type);

            return (
              <article
                key={item?.id ?? index}
                style={{
                  ...rowStyle,
                  borderColor: tone.border,
                  background: tone.bg,
                }}
              >
                <div
                  style={{
                    ...dotStyle,
                    background: tone.dot,
                    boxShadow: `0 0 0 4px ${tone.ring}`,
                  }}
                />
                <div style={contentStyle}>
                  <div style={metaRowStyle}>
                    <span style={stepBadgeStyle}>Step {index + 1}</span>
                    <span style={{ ...typeBadgeStyle, color: tone.text }}>
                      {labelForType(item?.type)}
                    </span>
                  </div>
                  <p style={messageStyle}>
                    {item?.message || 'Bellman-Ford state updated.'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function getTone(type) {
  if (type === 'warning') {
    return {
      bg: 'rgba(161, 53, 68, 0.10)',
      border: 'rgba(221, 105, 116, 0.26)',
      dot: '#ff8b98',
      ring: 'rgba(255, 139, 152, 0.14)',
      text: '#ffb3bc',
    };
  }

  if (type === 'success') {
    return {
      bg: 'rgba(67, 122, 34, 0.10)',
      border: 'rgba(109, 170, 69, 0.22)',
      dot: '#7ed957',
      ring: 'rgba(126, 217, 87, 0.12)',
      text: '#a6ec89',
    };
  }

  return {
    bg: 'rgba(74, 158, 255, 0.08)',
    border: 'rgba(74, 158, 255, 0.18)',
    dot: '#78b7ff',
    ring: 'rgba(120, 183, 255, 0.12)',
    text: '#9fcbff',
  };
}

function labelForType(type) {
  if (type === 'warning') return 'Cycle alert';
  if (type === 'success') return 'Relaxed';
  return 'Checked';
}

const panelStyle = {
  background: 'var(--bg-card, #161b22)',
  border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
  borderRadius: '18px',
  padding: '16px',
  display: 'grid',
  gap: '14px',
  minHeight: '260px',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
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

const countPillStyle = {
  minWidth: '34px',
  height: '34px',
  borderRadius: '999px',
  display: 'grid',
  placeItems: 'center',
  padding: '0 10px',
  background: 'rgba(245, 166, 35, 0.14)',
  color: '#f5a623',
  fontWeight: 800,
  fontSize: '12px',
};

const emptyStateStyle = {
  borderRadius: '14px',
  border: '1px dashed rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.02)',
  padding: '18px',
  display: 'grid',
  gap: '8px',
  alignContent: 'center',
  minHeight: '170px',
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

const listStyle = {
  display: 'grid',
  gap: '10px',
  maxHeight: '360px',
  overflowY: 'auto',
  paddingRight: '4px',
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '14px 1fr',
  gap: '12px',
  alignItems: 'start',
  border: '1px solid',
  borderRadius: '14px',
  padding: '12px',
};

const dotStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '999px',
  marginTop: '8px',
};

const contentStyle = {
  display: 'grid',
  gap: '8px',
};

const metaRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

const stepBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '24px',
  padding: '0 8px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.06)',
  color: 'var(--text-primary, #f8fafc)',
  fontSize: '11px',
  fontWeight: 700,
};

const typeBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '24px',
  padding: '0 8px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.04)',
  fontSize: '11px',
  fontWeight: 700,
};

const messageStyle = {
  margin: 0,
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '14px',
  lineHeight: 1.6,
};
