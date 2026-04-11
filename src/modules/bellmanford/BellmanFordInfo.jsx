import React from 'react';

export default function BellmanFordInfo({
  title = 'Bellman-Ford',
  complexity = 'O(VE)',
  supportsNegativeEdges = true,
  detectsNegativeCycles = true,
  description = 'Bellman-Ford computes shortest paths from a single source even when some edges are negative.',
}) {
  const highlights = [
    {
      label: 'Time',
      value: complexity,
      tone: '#f5a623',
      bg: 'rgba(245, 166, 35, 0.14)',
    },
    {
      label: 'Negative edges',
      value: supportsNegativeEdges ? 'Supported' : 'Not supported',
      tone: supportsNegativeEdges ? '#7ed957' : '#ff8b98',
      bg: supportsNegativeEdges ? 'rgba(67, 122, 34, 0.14)' : 'rgba(161, 53, 68, 0.14)',
    },
    {
      label: 'Cycle check',
      value: detectsNegativeCycles ? 'Detects reachable negative cycles' : 'No cycle detection',
      tone: detectsNegativeCycles ? '#78b7ff' : '#cbd5e1',
      bg: detectsNegativeCycles ? 'rgba(74, 158, 255, 0.12)' : 'rgba(255,255,255,0.06)',
    },
  ];

  return (
    <section style={panelStyle} className="bellmanford-info">
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Algorithm info</p>
          <h3 style={titleStyle}>{title}</h3>
        </div>
        <span style={badgeStyle}>P4</span>
      </div>

      <p style={descriptionStyle}>{description}</p>

      <div style={pillGridStyle}>
        {highlights.map((item) => (
          <div
            key={item.label}
            style={{
              ...pillCardStyle,
              background: item.bg,
              borderColor: `${item.tone}33`,
            }}
          >
            <p style={pillLabelStyle}>{item.label}</p>
            <p style={{ ...pillValueStyle, color: item.tone }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <p style={sectionLabelStyle}>How it works</p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            Initialize the source distance as 0 and every other node as infinity.
          </li>
          <li style={listItemStyle}>
            Relax every edge for exactly V - 1 rounds to propagate shortest-path improvements.
          </li>
          <li style={listItemStyle}>
            Run one extra pass; if any distance still improves, a reachable negative cycle exists.
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <p style={sectionLabelStyle}>When to use it</p>
        <p style={bodyStyle}>
          Choose Bellman-Ford when edge weights can be negative and you still need single-source
          shortest paths with explicit negative-cycle detection.
        </p>
      </div>

      <div style={sectionStyle}>
        <p style={sectionLabelStyle}>Key contrast with Dijkstra</p>
        <p style={bodyStyle}>
          Dijkstra is faster on non-negative graphs, but Bellman-Ford is safer when negative edges
          are part of the problem.
        </p>
      </div>
    </section>
  );
}

const panelStyle = {
  background: 'var(--bg-card, #161b22)',
  border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
  borderRadius: '18px',
  padding: '16px',
  display: 'grid',
  gap: '16px',
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

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '42px',
  height: '32px',
  padding: '0 10px',
  borderRadius: '999px',
  background: 'rgba(245, 166, 35, 0.14)',
  color: '#f5a623',
  fontWeight: 800,
  fontSize: '12px',
};

const descriptionStyle = {
  margin: 0,
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '14px',
  lineHeight: 1.7,
};

const pillGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '10px',
};

const pillCardStyle = {
  border: '1px solid',
  borderRadius: '14px',
  padding: '12px',
  display: 'grid',
  gap: '6px',
};

const pillLabelStyle = {
  margin: 0,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--text-muted, #94a3b8)',
  fontWeight: 700,
};

const pillValueStyle = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 800,
  lineHeight: 1.5,
};

const sectionStyle = {
  display: 'grid',
  gap: '8px',
};

const sectionLabelStyle = {
  margin: 0,
  color: 'var(--text-primary, #f8fafc)',
  fontSize: '13px',
  fontWeight: 800,
};

const bodyStyle = {
  margin: 0,
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '14px',
  lineHeight: 1.7,
};

const listStyle = {
  margin: 0,
  paddingLeft: '18px',
  display: 'grid',
  gap: '8px',
};

const listItemStyle = {
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '14px',
  lineHeight: 1.6,
};
