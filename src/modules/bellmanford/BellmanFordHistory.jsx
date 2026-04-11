import React from 'react';

export default function BellmanFordHistory({
  history = [],
  step = null,
  currentStepIndex = 0,
}) {
  const items = normalizeHistory(history, step, currentStepIndex);

  return (
    <section
      className="bellmanford-history"
      style={panelStyle}
    >
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Event log</p>
          <h3 style={titleStyle}>Relaxation history</h3>
        </div>

        <span style={countBadgeStyle}>
          {items.length} {items.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {items.length === 0 ? (
        <div style={emptyStyle}>
          No history available for this step yet.
        </div>
      ) : (
        <div style={listStyle}>
          {items.map((entry, index) => (
            <article
              key={`${index}-${entry}`}
              style={itemStyle}
            >
              <div style={markerWrapStyle}>
                <span style={markerStyle} />
                {index !== items.length - 1 && <span style={connectorStyle} />}
              </div>

              <div style={contentStyle}>
                <div style={entryMetaStyle}>
                  <span style={stepChipStyle}>Step {currentStepIndex + 1}</span>
                  <span style={indexBadgeStyle}>#{index + 1}</span>
                </div>

                <p style={entryTextStyle}>{entry}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function normalizeHistory(history, step, currentStepIndex) {
  if (Array.isArray(history) && history.length > 0) {
    return history.map((item) => String(item));
  }

  if (Array.isArray(step?.history) && step.history.length > 0) {
    return step.history.map((item) => String(item));
  }

  if (Array.isArray(step?.events) && step.events.length > 0) {
    return step.events.map((item) => String(item));
  }

  if (typeof step?.description === 'string' && step.description.trim()) {
    return [step.description.trim()];
  }

  if (typeof step?.message === 'string' && step.message.trim()) {
    return [step.message.trim()];
  }

  if (step) {
    return [`Viewing Bellman-Ford state at step ${currentStepIndex + 1}.`];
  }

  return [];
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
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '14px',
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

const countBadgeStyle = {
  padding: '7px 10px',
  borderRadius: '999px',
  background: 'rgba(74, 158, 255, 0.14)',
  color: '#4a9eff',
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

const listStyle = {
  display: 'grid',
  gap: '12px',
};

const itemStyle = {
  display: 'grid',
  gridTemplateColumns: '18px 1fr',
  gap: '12px',
  alignItems: 'flex-start',
};

const markerWrapStyle = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100%',
};

const markerStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '999px',
  background: '#00d4aa',
  marginTop: '8px',
  boxShadow: '0 0 0 4px rgba(0, 212, 170, 0.15)',
};

const connectorStyle = {
  position: 'absolute',
  top: '22px',
  bottom: '-12px',
  width: '2px',
  background: 'rgba(255,255,255,0.08)',
};

const contentStyle = {
  background: 'var(--bg-secondary, #0f172a)',
  border: '1px solid var(--border-color, rgba(255,255,255,0.06))',
  borderRadius: '12px',
  padding: '12px 14px',
};

const entryMetaStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  marginBottom: '8px',
};

const stepChipStyle = {
  padding: '4px 8px',
  borderRadius: '999px',
  background: 'rgba(245, 166, 35, 0.14)',
  color: '#f5a623',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const indexBadgeStyle = {
  fontSize: '12px',
  color: 'var(--text-secondary, #94a3b8)',
  fontWeight: 700,
};

const entryTextStyle = {
  margin: 0,
  color: 'var(--text-primary, #e5e7eb)',
  fontSize: '14px',
  lineHeight: 1.6,
};
