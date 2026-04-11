import React, { useEffect, useMemo, useState } from 'react';
import BellmanFordCanvas from './BellmanFordCanvas';
import BellmanFordControls from './BellmanFordControls';
import BellmanFordIterTable from './BellmanFordIterTable';
import BellmanFordEdgeList from './BellmanFordEdgeList';
import BellmanFordDistPanel from './BellmanFordDistPanel';
import BellmanFordPathPanel from './BellmanFordPathPanel';
import BellmanFordNegCycleAlert from './BellmanFordNegCycleAlert';
import BellmanFordHistory from './BellmanFordHistory';
import BellmanFordInfo from './BellmanFordInfo';
import { bellmanFordPresets } from './bellmanFordData';
import { generateBellmanFordSteps } from './bellmanFordSteps';

const FALLBACK_PRESET = {
  name: 'Default graph',
  source: 'A',
  nodes: [
    { id: 'A', x: 120, y: 120 },
    { id: 'B', x: 280, y: 90 },
    { id: 'C', x: 280, y: 220 },
    { id: 'D', x: 450, y: 160 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'C', to: 'B', weight: -1 },
    { from: 'B', to: 'D', weight: 2 },
    { from: 'C', to: 'D', weight: 3 },
  ],
};

function resolvePreset() {
  if (Array.isArray(bellmanFordPresets) && bellmanFordPresets.length > 0) {
    return bellmanFordPresets[0];
  }

  if (bellmanFordPresets && typeof bellmanFordPresets === 'object') {
    if (Array.isArray(bellmanFordPresets.presets) && bellmanFordPresets.presets.length > 0) {
      return bellmanFordPresets.presets[0];
    }

    if (Array.isArray(bellmanFordPresets.graphs) && bellmanFordPresets.graphs.length > 0) {
      return bellmanFordPresets.graphs[0];
    }
  }

  return FALLBACK_PRESET;
}

function safeGenerateSteps(preset) {
  try {
    const result = generateBellmanFordSteps?.(preset);

    if (Array.isArray(result)) return result;
    if (result?.steps && Array.isArray(result.steps)) return result.steps;
  } catch (error) {
    console.error('Bellman-Ford step generation failed:', error);
  }

  return [
    {
      type: 'init',
      title: 'Initialization',
      description: 'Initialized source distance and prepared first pass.',
      distances: { [preset.source || 'A']: 0 },
      history: ['Initialized Bellman-Ford state.'],
      iteration: 0,
      activeEdge: null,
      path: [],
      hasNegativeCycle: false,
    },
  ];
}

function getStepHistory(step, index) {
  if (Array.isArray(step?.history) && step.history.length > 0) return step.history;
  if (Array.isArray(step?.events) && step.events.length > 0) return step.events;
  if (step?.description) return [step.description];
  return [`Viewing step ${index + 1}`];
}

export default function BellmanFordVisualizer() {
  const preset = useMemo(() => resolvePreset(), []);
  const [steps] = useState(() => safeGenerateSteps(preset));
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const hasSteps = steps.length > 0;
  const safeIndex = hasSteps ? Math.min(stepIdx, steps.length - 1) : 0;
  const currentStep = hasSteps ? steps[safeIndex] : null;
  const isFinished = !hasSteps || safeIndex >= steps.length - 1;
  const canStep = hasSteps && safeIndex < steps.length - 1;

  useEffect(() => {
    if (!isPlaying || !hasSteps) return undefined;

    if (safeIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setStepIdx((prev) => {
        const next = Math.min(prev + 1, steps.length - 1);
        if (next >= steps.length - 1) {
          setIsPlaying(false);
        }
        return next;
      });
    }, speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, speed, safeIndex, steps, hasSteps]);

  const handlePlayPause = () => {
    if (!hasSteps) return;

    if (isFinished) {
      setStepIdx(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  const handleStep = () => {
    if (!canStep) return;
    setIsPlaying(false);
    setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const handleSpeedChange = (value) => {
    setSpeed(value);
  };

  const distances = currentStep?.distances || currentStep?.distanceMap || {};
  const activeEdge = currentStep?.activeEdge || currentStep?.edge || null;
  const iteration = currentStep?.iteration ?? safeIndex;
  const path = currentStep?.path || currentStep?.shortestPath || [];
  const hasNegativeCycle =
    currentStep?.hasNegativeCycle ||
    currentStep?.negativeCycleDetected ||
    currentStep?.isNegativeCycle ||
    false;

  const historyItems = getStepHistory(currentStep, safeIndex);

  return (
    <div
      className="bellmanford-visualizer"
      style={{
        display: 'grid',
        gap: '16px',
      }}
    >
      <BellmanFordControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onStep={handleStep}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        hasSteps={hasSteps}
        isFinished={isFinished}
        canStep={canStep}
      />

      <div
        className="bellmanford-hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'var(--bg-card, #161b22)',
            border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <BellmanFordCanvas
            nodes={preset.nodes || []}
            edges={preset.edges || []}
            step={currentStep}
            activeEdge={activeEdge}
            source={preset.source}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          <BellmanFordDistPanel
            distances={distances}
            source={preset.source}
            step={currentStep}
          />

          <BellmanFordPathPanel
            path={path}
            step={currentStep}
            source={preset.source}
          />

          <BellmanFordNegCycleAlert
            hasNegativeCycle={hasNegativeCycle}
            step={currentStep}
          />
        </div>
      </div>

      <div
        className="bellmanford-detail-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '16px',
        }}
      >
        <BellmanFordIterTable
          steps={steps}
          currentStepIndex={safeIndex}
          currentIteration={iteration}
          step={currentStep}
        />

        <BellmanFordEdgeList
          edges={preset.edges || []}
          activeEdge={activeEdge}
          step={currentStep}
        />
      </div>

      <div
        className="bellmanford-bottom-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '16px',
        }}
      >
        <BellmanFordHistory
          history={historyItems}
          step={currentStep}
          currentStepIndex={safeIndex}
        />

        <BellmanFordInfo
          algorithm="Bellman-Ford"
          source={preset.source}
          totalSteps={steps.length}
          currentStepIndex={safeIndex}
          presetName={preset.name}
        />
      </div>
    </div>
  );
}
