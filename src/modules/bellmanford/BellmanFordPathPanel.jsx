import React from 'react';

export default function BellmanFordPathPanel({
  paths = {},
  selectedNode = null,
  source = null,
}) {
  const entries = Object.entries(paths || {}).sort(([a], [b]) =>
    String(a).localeCompare(String(b))
  );

  const activePath =
    selectedNode != null && paths && paths[selectedNode]
      ? paths[selectedNode]
      : null;

  return (
    <section style={panelStyle} className="bellmanford-path-panel">
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Path reconstruction</p>
          <h3 style={titleStyle}>Shortest paths from source</h3>
        </div>
        <span style={badgeStyle}>
          Source: <strong>{source ?? '—'}</strong>
        </span>
      </div>

      {selectedNode != null ? (
        <div style={focusCardStyle}>
          <p style={focusLabelStyle}>Selected target</p>
          <div style={focusRowStyle}>
            <span style={targetBadgeStyle}>{selectedNode}</span>
            <span style={arrowStyle}>←</span>
            <span style={focusHintStyle}>
              {Array.isArray(activePath) && activePath.length > 0
                ? 'Path available below'
                : 'No reconstructed path yet'}
            </span>
          </div>

          <div style={routeBoxStyle}>
            {Array.isArray(activePath) && activePath.length > 0 ? (
              <PathChips path={activePath} />
            ) : (
              <p style={emptyInlineStyle}>
                Step further through the algorithm to reconstruct this path.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {entries.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={emptyTitleStyle}>No paths yet</p>
          <p style={emptyBodyStyle}>
            Once parent updates begin, this panel can show the reconstructed route to each node.
          </p>
        </div>
      ) : (
        <div style={listStyle}>
          {entries.map(([node, path]) => {
            const hasPath = Array.isArray(path) && path.length > 0;
            const isActive = selectedNode != null && String(node) === String(selectedNode);

            return (
              <article
                key={node}
                style={{
                  ...pathCardStyle,
                  borderColor: isActive ? 'rgba(245, 166, 35, 0.28)' : 'rgba(255,255,255,0.08)',
                  background: isActive ? 'rgba(245, 166, 35, 0.08)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={pathCardHeadStyle}>
                  <div style={pathNodeMetaStyle}>
                    <span
                      style={{
                        ...nodeBadgeStyle,
                        background: isActive ? 'rgba(245, 166, 35, 0.18)' : 'rgba(255,255,255,0.06)',
                        color: isActive ? '#f5a623' : 'var(--text-primary, #f8fafc)',
                      }}
                    >
                      {node}
                    </span>
                    <span style={statusStyle(hasPath)}>
                      {hasPath ? `${path.length - 1} edge${path.length - 1 === 1 ? '' : 's'}` : 'Unreachable'}
                    </span>
                  </div>
                </div>

                <div style={routeBoxStyle}>
                  {hasPath ? (
                    <PathChips path={path} />
                  ) : (
                    <p style={emptyInlineStyle}>No route from source yet.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PathChips({ path }) {
  return (
    <div style={chipsWrapStyle}>
      {path.map((node, index) => (
        <React.Fragment key={`${node}-${index}`}>
          <span style={chipStyle}>{node}</span>
          {index < path.length - 1 ? <span style={connectorStyle}>→</span> : null}
        </React.Fragment>
      ))}
    </div>
  );
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

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  minHeight: '32px',
  padding: '0 10px',
  borderRadius: '999px',
  background: 'rgba(74, 158, 255, 0.14)',
  color: '#78b7ff',
  fontSize: '12px',
  fontWeight: 700,
};

const focusCardStyle = {
  display: 'grid',
  gap: '10px',
  padding: '14px',
  borderRadius: '14px',
  border: '1px solid rgba(245, 166, 35, 0.2)',
  background: 'rgba(245, 166, 35, 0.06)',
};

const focusLabelStyle = {
  margin: 0,
  color: 'var(--text-muted, #94a3b8)',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const focusRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

const targetBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '36px',
  minHeight: '30px',
  padding: '0 12px',
  borderRadius: '999px',
  background: 'rgba(245, 166, 35, 0.18)',
  color: '#f5a623',
  fontWeight: 800,
  fontSize: '12px',
};

const arrowStyle = {
  color: 'var(--text-muted, #94a3b8)',
  fontWeight: 800,
};

const focusHintStyle = {
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '13px',
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

const listStyle = {
  display: 'grid',
  gap: '10px',
};

const pathCardStyle = {
  display: 'grid',
  gap: '10px',
  border: '1px solid',
  borderRadius: '14px',
  padding: '12px',
};

const pathCardHeadStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '10px',
};

const pathNodeMetaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap',
};

const nodeBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '34px',
  minHeight: '30px',
  padding: '0 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 800,
};

const routeBoxStyle = {
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  padding: '12px',
  overflowX: 'auto',
};

const chipsWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '30px',
  padding: '0 10px',
  borderRadius: '999px',
  background: 'rgba(126, 217, 87, 0.12)',
  color: '#9be16f',
  border: '1px solid rgba(126, 217, 87, 0.18)',
  fontSize: '12px',
  fontWeight: 800,
};

const connectorStyle = {
  color: 'var(--text-muted, #94a3b8)',
  fontWeight: 800,
};

const emptyInlineStyle = {
  margin: 0,
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '13px',
  lineHeight: 1.6,
};

function statusStyle(hasPath) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '24px',
    padding: '0 8px',
    borderRadius: '999px',
    background: hasPath ? 'rgba(67, 122, 34, 0.14)' : 'rgba(148, 163, 184, 0.12)',
    color: hasPath ? '#9be16f' : '#94a3b8',
    fontSize: '11px',
    fontWeight: 700,
  };
}
