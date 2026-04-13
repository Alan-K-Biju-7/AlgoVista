import React, { useEffect, useMemo, useState } from 'react';
import BellmanFordCanvas from './BellmanFordCanvas';
import BellmanFordControls from './BellmanFordControls';
import BellmanFordDistPanel from './BellmanFordDistPanel';
import BellmanFordPathPanel from './BellmanFordPathPanel';
import BellmanFordNegCycleAlert from './BellmanFordNegCycleAlert';
import BellmanFordHistory from './BellmanFordHistory';
import BellmanFordInfo from './BellmanFordInfo';
import * as stepsModule from './bellmanFordSteps';
import * as dataModule from './bellmanFordData';

export default function BellmanFordVisualizer() {
  const generateBellmanFordSteps =
    stepsModule.generateBellmanFordSteps || null;

  const presets =
    dataModule.PRESET_GRAPHS || null;

  const preset = useMemo(() => getDefaultPreset(presets), [presets]);
  const [speed, setSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  const nodes = useMemo(
    () => normalizeNodes(
      preset?.nodes || preset?.vertices || preset?.graph?.nodes || []
    ),
    [preset]
  );

  const edges = useMemo(
    () => normalizeEdges(
      preset?.edges || preset?.graph?.edges || preset?.edgeList || []
    ),
    [preset]
  );

  const source = useMemo(
    () => preset?.source ?? preset?.start ?? nodes[0]?.id ?? null,
    [preset, nodes]
  );

  const target = useMemo(
    () => preset?.target ?? preset?.end ?? nodes[nodes.length - 1]?.id ?? null,
    [preset, nodes]
  );

  const computedSteps = useMemo(() => {
    if (typeof generateBellmanFordSteps === 'function') {
      try {
        const generated = generateBellmanFordSteps({
          nodes,
          edges,
          source,
          target,
          preset,
        });

        if (Array.isArray(generated) && generated.length > 0) {
          return generated.map((step, index) =>
            normalizeStep(step, { index, nodes, edges, source, target })
          );
        }
      } catch (error) {
        console.error('Bellman-Ford step generation failed:', error);
      }
    }

    return buildFallbackSteps({ nodes, edges, source, target });
  }, [generateBellmanFordSteps, nodes, edges, source, target, preset]);

  const safeStepIdx = Math.min(stepIdx, Math.max(computedSteps.length - 1, 0));
  const currentStep = computedSteps[safeStepIdx] || null;

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [source, target, nodes.length, edges.length]);

  useEffect(() => {
    if (!isPlaying || computedSteps.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= computedSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => window.clearInterval(timer);
  }, [isPlaying, speed, computedSteps.length]);

  const distances =
    currentStep?.distances ||
    currentStep?.distanceMap ||
    currentStep?.dist ||
    {};

  const pathModel =
    currentStep?.paths ||
    currentStep?.shortestPaths ||
    currentStep?.path ||
    currentStep?.shortestPath ||
    null;

  const parentMap =
    currentStep?.parentMap ||
    currentStep?.parents ||
    currentStep?.prev ||
    {};

  const historyItems = useMemo(
    () =>
      computedSteps.slice(0, safeStepIdx + 1).map((step, index) => ({
        id: index,
        message:
          step.message ||
          step.description ||
          step.label ||
          `Processed step ${index + 1}`,
        type: step.hasNegativeCycle ? 'warning' : step.updated ? 'success' : 'info',
      })),
    [computedSteps, safeStepIdx]
  );

  const hasNegativeCycle = Boolean(
    currentStep?.hasNegativeCycle ||
      currentStep?.negativeCycle ||
      currentStep?.cycleDetected
  );

  return (
    <div style={pageStyle} className="bellmanford-visualizer">
      <div style={stackStyle}>
        <BellmanFordControls
          isPlaying={isPlaying}
          onPlayPause={() => {
            if (safeStepIdx >= computedSteps.length - 1) {
              setStepIdx(0);
            }
            setIsPlaying((prev) => !prev);
          }}
          onStep={() => {
            setIsPlaying(false);
            setStepIdx((prev) => Math.min(prev + 1, computedSteps.length - 1));
          }}
          onReset={() => {
            setIsPlaying(false);
            setStepIdx(0);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          hasSteps={computedSteps.length > 0}
          isFinished={safeStepIdx >= computedSteps.length - 1}
          canStep={safeStepIdx < computedSteps.length - 1}
        />

        <div style={statusBarStyle}>
          <span style={statusPillStyle}>
            Step {safeStepIdx + 1} / {computedSteps.length}
          </span>
          <span style={statusTextStyle}>
            {currentStep?.message || 'Bellman-Ford state update'}
          </span>
        </div>

        <BellmanFordNegCycleAlert
          hasNegativeCycle={hasNegativeCycle}
          cycleNodes={
            currentStep?.cycleNodes ||
            currentStep?.negativeCycleNodes ||
            []
          }
          message={currentStep?.negativeCycleMessage || currentStep?.message || ''}
          step={currentStep}
        />

        <BellmanFordCanvas
          nodes={nodes}
          edges={edges}
          step={currentStep}
          activeEdge={
            currentStep?.activeEdge ||
            currentStep?.edge ||
            currentStep?.relaxedEdge ||
            null
          }
          source={source}
        />

        <div style={gridStyle}>
          <BellmanFordDistPanel
            distances={distances}
            source={source}
            step={currentStep}
          />

          <BellmanFordPathPanel
            path={Array.isArray(pathModel) ? pathModel : null}
            paths={!Array.isArray(pathModel) && typeof pathModel === 'object' ? pathModel : null}
            parentMap={parentMap}
            source={source}
            target={target}
            step={currentStep}
          />
        </div>

        <div style={gridStyle}>
          <BellmanFordHistory history={historyItems} />
          <BellmanFordInfo
            title="Bellman-Ford"
            complexity="O(VE)"
            supportsNegativeEdges
            detectsNegativeCycles
            description="Bellman-Ford relaxes every edge repeatedly, which lets it compute shortest paths even when edge weights can be negative."
          />
        </div>
      </div>
    </div>
  );
}

function getDefaultPreset(presets) {
  if (Array.isArray(presets) && presets.length > 0) return presets[0];
  if (presets && typeof presets === 'object') {
    const firstKey = Object.keys(presets)[0];
    if (firstKey) return presets[firstKey];
  }

  return {
    source: 'A',
    target: 'D',
    nodes: [
      { id: 'A', x: 110, y: 130 },
      { id: 'B', x: 280, y: 90 },
      { id: 'C', x: 280, y: 250 },
      { id: 'D', x: 500, y: 170 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 5 },
      { from: 'B', to: 'C', weight: -2 },
      { from: 'B', to: 'D', weight: 6 },
      { from: 'C', to: 'D', weight: 3 },
    ],
  };
}

function normalizeNodes(nodes) {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node, index) => ({
    id: node.id ?? node.label ?? String(index),
    x: typeof node.x === 'number' ? node.x : 120 + index * 130,
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

function normalizeStep(step, context) {
  return {
    index: context.index,
    message:
      step?.message ||
      step?.description ||
      step?.label ||
      `Step ${context.index + 1}`,
    distances:
      step?.distances ||
      step?.distanceMap ||
      step?.dist ||
      {},
    parentMap:
      step?.parentMap ||
      step?.parents ||
      step?.prev ||
      {},
    activeEdge:
      step?.activeEdge ||
      step?.edge ||
      step?.relaxedEdge ||
      null,
    path:
      step?.path ||
      step?.shortestPath ||
      null,
    paths:
      step?.paths ||
      step?.shortestPaths ||
      null,
    hasNegativeCycle: Boolean(
      step?.hasNegativeCycle ||
      step?.negativeCycle ||
      step?.cycleDetected
    ),
    cycleNodes:
      step?.cycleNodes ||
      step?.negativeCycleNodes ||
      [],
    negativeCycleMessage:
      step?.negativeCycleMessage ||
      '',
    updated: Boolean(step?.updated ?? step?.didRelax ?? false),
    raw: step,
  };
}

function buildFallbackSteps({ nodes, edges, source, target }) {
  const nodeIds = nodes.map((node) => node.id);
  const distances = Object.fromEntries(nodeIds.map((id) => [id, Infinity]));
  const parents = Object.fromEntries(nodeIds.map((id) => [id, null]));
  if (source != null) distances[source] = 0;

  const steps = [
    {
      message: `Initialize distances. Source ${source} starts at 0.`,
      distances: { ...distances },
      parentMap: { ...parents },
      activeEdge: null,
      paths: buildPathsFromParents(parents, source, nodeIds),
      hasNegativeCycle: false,
      cycleNodes: [],
      updated: false,
    },
  ];

  const rounds = Math.max(nodeIds.length - 1, 1);

  for (let round = 0; round < rounds; round += 1) {
    let changed = false;

    edges.forEach((edge) => {
      const fromDist = distances[edge.from];
      const toDist = distances[edge.to];

      if (fromDist !== Infinity && fromDist + edge.weight < toDist) {
        distances[edge.to] = fromDist + edge.weight;
        parents[edge.to] = edge.from;
        changed = true;

        steps.push({
          message: `Relax edge ${edge.from} → ${edge.to} with weight ${edge.weight}.`,
          distances: { ...distances },
          parentMap: { ...parents },
          activeEdge: edge,
          paths: buildPathsFromParents(parents, source, nodeIds),
          hasNegativeCycle: false,
          cycleNodes: [],
          updated: true,
        });
      } else {
        steps.push({
          message: `Check edge ${edge.from} → ${edge.to}; no shorter path found.`,
          distances: { ...distances },
          parentMap: { ...parents },
          activeEdge: edge,
          paths: buildPathsFromParents(parents, source, nodeIds),
          hasNegativeCycle: false,
          cycleNodes: [],
          updated: false,
        });
      }
    });

    if (!changed) {
      steps.push({
        message: `Round ${round + 1} finished with no updates, so the distances are stable.`,
        distances: { ...distances },
        parentMap: { ...parents },
        activeEdge: null,
        paths: buildPathsFromParents(parents, source, nodeIds),
        hasNegativeCycle: false,
        cycleNodes: [],
        updated: false,
      });
      break;
    }
  }

  const cycleEdge = edges.find((edge) => {
    const fromDist = distances[edge.from];
    return fromDist !== Infinity && fromDist + edge.weight < distances[edge.to];
  });

  if (cycleEdge) {
    steps.push({
      message: `Extra pass still improved ${cycleEdge.to}, so a negative cycle is reachable.`,
      distances: { ...distances },
      parentMap: { ...parents },
      activeEdge: cycleEdge,
      paths: buildPathsFromParents(parents, source, nodeIds),
      hasNegativeCycle: true,
      cycleNodes: [cycleEdge.from, cycleEdge.to],
      negativeCycleMessage:
        'A further relaxation was possible after V - 1 rounds, which indicates a reachable negative cycle.',
      updated: true,
    });
  } else {
    steps.push({
      message:
        target != null
          ? `Finished. Best known path to ${target} is ready to inspect.`
          : 'Finished Bellman-Ford run.',
      distances: { ...distances },
      parentMap: { ...parents },
      activeEdge: null,
      paths: buildPathsFromParents(parents, source, nodeIds),
      hasNegativeCycle: false,
      cycleNodes: [],
      updated: false,
    });
  }

  return steps.map((step, index) =>
    normalizeStep(step, { index, nodes, edges, source, target })
  );
}

function buildPathsFromParents(parents, source, nodeIds) {
  const paths = {};

  nodeIds.forEach((nodeId) => {
    if (String(nodeId) === String(source)) {
      paths[nodeId] = [source];
      return;
    }

    const path = [];
    const seen = new Set();
    let current = nodeId;

    while (current != null && !seen.has(String(current))) {
      path.push(current);
      seen.add(String(current));

      if (String(current) === String(source)) {
        paths[nodeId] = path.reverse();
        return;
      }

      current = parents[current];
    }

    paths[nodeId] = [];
  });

  return paths;
}

const pageStyle = {
  width: '100%',
};

const stackStyle = {
  display: 'grid',
  gap: '16px',
};

const statusBarStyle = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  flexWrap: 'wrap',
  padding: '12px 14px',
  borderRadius: '14px',
  background: 'var(--bg-card, #161b22)',
  border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
};

const statusPillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '30px',
  padding: '0 10px',
  borderRadius: '999px',
  background: 'rgba(245, 166, 35, 0.14)',
  color: '#f5a623',
  fontWeight: 800,
  fontSize: '12px',
};

const statusTextStyle = {
  color: 'var(--text-secondary, #cbd5e1)',
  fontSize: '14px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px',
};
