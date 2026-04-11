import React, { useMemo } from 'react';

export default function BellmanFordPathPanel({
  path = null,
  paths = null,
  parentMap = null,
  source = null,
  target = null,
  step = null,
}) {
  const model = useMemo(
    () => resolvePathModel({ path, paths, parentMap, source, target, step }),
    [path, paths, parentMap, source, target, step]
  );

  const {
    selectedTarget,
    selectedPath,
    pathEntries,
    mode,
  } = model;

  return (
    <section style={panelStyle} className="bellmanford-path-panel">
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Shortest path</p>
          <h3 style={titleStyle}>Path reconstruction</h3>
        </div>

        <div style={metaRowStyle}>
          {source !== null && source !== undefined ? (
            <span style={pillStyle}>Source: {source}</span>
          ) : null}
          {selectedTarget !== null && selectedTarget !== undefined ? (
            <span style={pillStyle}>Target: {selectedTarget}</span>
          ) : null}
        </div>
      </div>

      {mode === 'single' ? (
        <SinglePathView
          source={source}
          target={selectedTarget}
          path={selectedPath}
        />
      ) : (
        <MultiPathView
          entries={pathEntries}
          source={source}
        />
      )}
    </section>
  );
}

function SinglePathView({ source, target, path }) {
  if (!Array.isArray(path) || path.length === 0) {
    return (
      <div style={emptyStyle}>
        No reconstructed path is available for this step yet.
      </div>
    );
  }

  return (
    <div style={singleWrapStyle}>
      <div style={routeStyle}>
        {path.map((node, index) => (
          <React.Fragment key={`${node}-${index}`}>
            <span
              style={{
                ...nodeChipStyle,
                ...(index === 0 ? sourceNodeChipStyle : null),
                ...(index === path.length - 1 ? targetNodeChipStyle : null),
              }}
            >
              {node}
            </span>
            {index < path.length - 1 ? <span style={arrowStyle}>→</span> : null}
          </React.Fragment>
        ))}
      </div>

      <p style={captionStyle}>
        {source != null && target != null
          ? `Current best path from ${source} to ${target}.`
          : 'Current best reconstructed route.'}
      </p>
    </div>
  );
}

function MultiPathView({ entries, source }) {
  if (!entries.length) {
    return (
      <div style={emptyStyle}>
        No per-node paths are available for the current Bellman-Ford state.
      </div>
    );
  }

  return (
    <div style={listStyle}>
      {entries.map(([nodeId, path]) => {
        const validPath = Array.isArray(path) ? path : [];
        const unreachable = validPath.length === 0;

        return (
          <article key={nodeId} style={pathCardStyle}>
            <div style={pathCardHeaderStyle}>
              <span style={nodeLabelStyle}>{nodeId}</span>
              {String(nodeId) === String(source) ? (
                <span style={miniTagStyle}>source</span>
              ) : null}
            </div>

            <div style={miniRouteStyle}>
              {unreachable ? (
                <span style={unreachableStyle}>No path yet</span>
              ) : (
                validPath.map((node, index) => (
                  <React.Fragment key={`${nodeId}-${node}-${index}`}>
                    <span style={miniNodeChipStyle}>{node}</span>
                    {index < validPath.length - 1 ? (
                      <span style={miniArrowStyle}>→</span>
                    ) : null}
                  </React.Fragment>
                ))
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function resolvePathModel({ path, paths, parentMap, source, target, step }) {
  const stepPath = step?.path || step?.shortestPath || step?.currentPath || null;
  const stepPaths = step?.paths || step?.shortestPaths || null;
  const stepParents = step?.parentMap || step?.parents || step?.prev || null;
  const derivedTarget =
    target ?? step?.target ?? step?.destination ?? null;

  const finalParentMap = isPlainObject(parentMap) ? parentMap : stepParents;

  const singlePathCandidate = Array.isArray(path)
    ? path
    : Array.isArray(stepPath)
    ? stepPath
    : null;

  if (singlePathCandidate) {
    return {
      mode: 'single',
      selectedTarget:
        derivedTarget ??
        singlePathCandidate[singlePathCandidate.length - 1] ??
        null,
      selectedPath: singlePathCandidate,
      pathEntries: [],
    };
  }

  const pathCollection = isPlainObject(paths)
    ? paths
    : isPlainObject(stepPaths)
    ? stepPaths
    : null;

  if (pathCollection) {
    const pathEntries = Object.entries(pathCollection).sort(([a], [b]) =>
      String(a).localeCompare(String(b))
    );

    const selectedPath =
      derivedTarget != null ? pathCollection[derivedTarget] : null;

    if (Array.isArray(selectedPath)) {
      return {
        mode: 'single',
        selectedTarget: derivedTarget,
        selectedPath,
        pathEntries,
      };
    }

    return {
      mode: 'multi',
      selectedTarget: derivedTarget,
      selectedPath: null,
      pathEntries,
    };
  }

  if (isPlainObject(finalParentMap) && source != null) {
    const targets = Object.keys(finalParentMap)
      .filter((key) => key !== String(source))
      .sort((a, b) => String(a).localeCompare(String(b)));

    if (derivedTarget != null) {
      return {
        mode: 'single',
        selectedTarget: derivedTarget,
        selectedPath: reconstructPath(finalParentMap, source, derivedTarget),
        pathEntries: targets.map((nodeId) => [
          nodeId,
          reconstructPath(finalParentMap, source, nodeId),
        ]),
      };
    }

    return {
      mode: 'multi',
      selectedTarget: null,
      selectedPath: null,
      pathEntries: [source, ...targets].map((nodeId) => [
        nodeId,
        reconstructPath(finalParentMap, source, nodeId),
      ]),
    };
  }

  return {
    mode: 'single',
    selectedTarget: derivedTarget,
    selectedPath: null,
    pathEntries: [],
  };
}

function reconstructPath(parentMap, source, target) {
  if (target == null || source == null) return [];
  if (String(target) === String(source)) return [source];

  const path = [];
  const seen = new Set();
  let current = target;

  while (current != null && !seen.has(String(current))) {
    path.push(current);
    seen.add(String(current));

    if (String(current) === String(source)) {
      return path.reverse();
    }

    const next =
      parentMap[current] ??
      parentMap[String(current)] ??
      null;

    current = next;
  }

  return [];
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
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
  gap: '12px',
  flexWrap: 'wrap',
  alignItems: 'center',
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

const metaRowStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const pillStyle = {
  padding: '7px 10px',
  borderRadius: '999px',
  background: 'rgba(74, 158, 255, 0.14)',
  color: '#4a9eff',
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

const singleWrapStyle = {
  display: 'grid',
  gap: '12px',
};

const routeStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px',
  padding: '14px',
  borderRadius: '14px',
  background: 'var(--bg-secondary, #0f172a)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const nodeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '42px',
  minHeight: '34px',
  padding: '0 12px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.06)',
  color: '#f8fafc',
  fontWeight: 800,
  fontSize: '14px',
};

const sourceNodeChipStyle = {
  background: 'rgba(0, 212, 170, 0.14)',
  color: '#00d4aa',
};

const targetNodeChipStyle = {
  background: 'rgba(245, 166, 35, 0.14)',
  color: '#f5a623',
};

const arrowStyle = {
  color: 'var(--text-secondary, #94a3b8)',
  fontSize: '18px',
  fontWeight: 800,
};

const captionStyle = {
  margin: 0,
  color: 'var(--text-secondary, #94a3b8)',
  fontSize: '13px',
};

const listStyle = {
  display: 'grid',
  gap: '10px',
};

const pathCardStyle = {
  background: 'var(--bg-secondary, #0f172a)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '14px',
  padding: '12px',
  display: 'grid',
  gap: '10px',
};

const pathCardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
};

const nodeLabelStyle = {
  fontSize: '13px',
  fontWeight: 800,
  color: '#f8fafc',
};

const miniTagStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#00d4aa',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const miniRouteStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '6px',
};

const miniNodeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '30px',
  minHeight: '28px',
  padding: '0 10px',
  borderRadius: '999px',
  background: 'rgba(74, 158, 255, 0.14)',
  color: '#4a9eff',
  fontSize: '12px',
  fontWeight: 800,
};

const miniArrowStyle = {
  color: 'var(--text-secondary, #94a3b8)',
  fontSize: '14px',
  fontWeight: 700,
};

const unreachableStyle = {
  color: 'var(--text-secondary, #94a3b8)',
  fontSize: '13px',
};
