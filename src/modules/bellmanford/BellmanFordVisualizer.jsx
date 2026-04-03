import { useState, useEffect, useRef } from 'react';
import { PRESET_GRAPHS, addDirectedEdge } from './bellmanFordData';
import { reconstructPath } from './bellmanFordLogic';
import { generateBellmanFordSteps } from './bellmanFordSteps';
import BellmanFordCanvas    from './BellmanFordCanvas';
import BellmanFordIterTable from './BellmanFordIterTable';
import BellmanFordEdgeList  from './BellmanFordEdgeList';
import BellmanFordDistPanel from './BellmanFordDistPanel';
import BellmanFordNegCycleAlert from './BellmanFordNegCycleAlert';
import BellmanFordPathPanel from './BellmanFordPathPanel';
import BellmanFordControls  from './BellmanFordControls';
import BellmanFordInfo      from './BellmanFordInfo';
import BellmanFordHistory   from './BellmanFordHistory';

function buildIterHistory(steps, nodes) {
  const snapshots = [];
  const INF = Infinity;
  const init = {};
  nodes.forEach((n) => { init[n.id] = INF; });
  snapshots.push({ ...init });

  let lastIterEnd = { ...init };
  for (const s of steps) {
    if (s.phase === 'iter_end') {
      snapshots.push({ ...s.dist });
    }
  }
  return snapshots;
}

export default function BellmanFordVisualizer() {
  const [nodes,    setNodes]    = useState(PRESET_GRAPHS.default.nodes);
  const [edges,    setEdges]    = useState(PRESET_GRAPHS.default.edges);
  const [steps,    setSteps]    = useState([]);
  const [stepIdx,  setStepIdx]  = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed,    setSpeed]    = useState(500);
  const [startNode, setStartNode] = useState('S');
  const [endNode,   setEndNode]   = useState('');
  const [history,  setHistory]  = useState([]);
  const [message,  setMessage]  = useState('Default graph loaded (CLRS classic with negative edges). Click Auto ▶ or Step ▶.');
  const [addEdgeFrom,   setAddEdgeFrom]   = useState('');
  const [addEdgeTo,     setAddEdgeTo]     = useState('');
  const [addEdgeWeight, setAddEdgeWeight] = useState('');
  const timerRef = useRef(null);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 19)]);

  const cur     = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null;
  const dist    = cur ? cur.dist            : null;
  const prev_   = cur ? cur.prev            : null;
  const activeEdge   = cur ? cur.activeEdge   : null;
  const relaxedEdge  = cur ? cur.relaxedEdge  : null;
  const negCycleEdges = cur ? cur.negCycleEdges : [];
  const iteration    = cur ? cur.iteration    : 0;
  const isDone       = cur ? cur.phase === 'done' : false;
  const V = nodes.length;

  const shortestPath = isDone && endNode && prev_ && dist
    ? reconstructPath(prev_, startNode, endNode)
    : [];

  const iterHistory = steps.length > 0 ? buildIterHistory(steps, nodes) : [];

  const ensureSteps = () => {
    if (steps.length > 0) return steps;
    const gen = generateBellmanFordSteps(nodes, edges, startNode);
    setSteps(gen);
    return gen;
  };

  const handleAutoRun = () => {
    const gen = ensureSteps();
    if (stepIdx >= gen.length - 1) return;
    setIsRunning(true);
    pushHistory('run', `Bellman-Ford from ${startNode} on ${nodes.length} nodes, ${edges.length} edges`);
  };

  const handleStepForward = () => {
    const gen = ensureSteps();
    if (steps.length === 0) {
      setSteps(gen); setStepIdx(0); setMessage(gen[0].message);
      pushHistory('run', `Bellman-Ford from ${startNode} — stepping`);
      return;
    }
    const next = Math.min(stepIdx + 1, steps.length - 1);
    setStepIdx(next);
    setMessage(steps[next].message);
    if (steps[next].phase === 'done') {
      const hasCycle = steps[next].negCycleEdges.length > 0;
      if (hasCycle) pushHistory('cycle', 'Negative cycle detected!');
      else          pushHistory('run',   `Complete — no negative cycle`);
    }
  };

  const handleStepBack = () => {
    if (stepIdx <= 0) return;
    const p = stepIdx - 1;
    setStepIdx(p);
    setMessage(steps[p].message);
  };

  const handleStop  = () => { setIsRunning(false); clearTimeout(timerRef.current); };

  const handleReset = () => {
    clearTimeout(timerRef.current); setIsRunning(false);
    setSteps([]); setStepIdx(-1);
    setMessage('Reset. Click Auto ▶ or Step ▶.');
    setHistory([]);
  };

  const handleLoadPreset = (key) => {
    clearTimeout(timerRef.current); setIsRunning(false);
    const g = PRESET_GRAPHS[key];
    setNodes(g.nodes); setEdges(g.edges);
    setStartNode(g.nodes[0].id); setEndNode('');
    setSteps([]); setStepIdx(-1);
    setMessage(key === 'negCycle'
      ? '⚠ Negative cycle graph loaded. Run to detect the cycle!'
      : `Loaded "${key}" graph. Ready to run Bellman-Ford.`);
    pushHistory('preset', `Loaded preset: ${key}`);
  };

  const handleNodeDrag = (id, x, y) =>
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, x, y } : n));

  const handleAddEdge = () => {
    const updated = addDirectedEdge(edges, nodes, addEdgeFrom, addEdgeTo, addEdgeWeight);
    if (updated.length > edges.length) {
      setEdges(updated);
      setSteps([]); setStepIdx(-1);
      pushHistory('add', `Added edge ${addEdgeFrom.toUpperCase()}→${addEdgeTo.toUpperCase()} (w=${addEdgeWeight})`);
      setAddEdgeFrom(''); setAddEdgeTo(''); setAddEdgeWeight('');
    }
  };

  useEffect(() => {
    if (isDone && endNode && prev_ && dist) {
      const path = reconstructPath(prev_, startNode, endNode);
      if (path.length > 1) pushHistory('path', `Shortest path ${startNode}→${endNode}: ${path.join('→')} (cost ${dist[endNode]})`);
    }
  }, [endNode, isDone]);

  useEffect(() => {
    if (!isRunning) return;
    if (stepIdx >= steps.length - 1) { setIsRunning(false); return; }
    const next = stepIdx < 0 ? 0 : stepIdx + 1;
    timerRef.current = setTimeout(() => {
      setStepIdx(next);
      setMessage(steps[next].message);
      if (steps[next].phase === 'done') {
        setIsRunning(false);
        const hasCycle = steps[next].negCycleEdges.length > 0;
        if (hasCycle) pushHistory('cycle', 'Negative cycle detected!');
        else          pushHistory('run',   'Complete — no negative cycle');
      }
    }, speed);
    return () => clearTimeout(timerRef.current);
  }, [isRunning, stepIdx, steps, speed]);

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>Bellman-Ford — Shortest Paths with Negative Weights</p>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <BellmanFordControls
          nodes={nodes} startNode={startNode} setStartNode={setStartNode}
          endNode={endNode} setEndNode={setEndNode}
          onRun={handleAutoRun} onStepForward={handleStepForward}
          onStepBack={handleStepBack} onStop={handleStop} onReset={handleReset}
          onLoadPreset={handleLoadPreset}
          speed={speed} setSpeed={setSpeed}
          isRunning={isRunning} stepIndex={stepIdx} totalSteps={steps.length}
          message={message}
          addEdgeFrom={addEdgeFrom} setAddEdgeFrom={setAddEdgeFrom}
          addEdgeTo={addEdgeTo} setAddEdgeTo={setAddEdgeTo}
          addEdgeWeight={addEdgeWeight} setAddEdgeWeight={setAddEdgeWeight}
          onAddEdge={handleAddEdge}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <BellmanFordCanvas
            nodes={nodes} edges={edges} dist={dist} prev={prev_}
            shortestPath={shortestPath} activeEdge={activeEdge}
            relaxedEdge={relaxedEdge} negCycleEdges={negCycleEdges}
            onNodeDrag={handleNodeDrag}
          />
          {isDone && (
            <BellmanFordNegCycleAlert
              negCycleEdges={negCycleEdges} edges={edges} isDone={isDone}
            />
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <BellmanFordIterTable
          nodes={nodes} iterHistory={iterHistory}
          currentIter={iteration} shortestPath={shortestPath}
          negCycleEdges={negCycleEdges}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <BellmanFordEdgeList
            edges={edges} activeEdge={activeEdge} relaxedEdge={relaxedEdge}
            negCycleEdges={negCycleEdges} iteration={iteration} totalIter={V - 1}
          />
          <BellmanFordDistPanel
            nodes={nodes} dist={dist} prev={prev_}
            shortestPath={shortestPath} negCycleEdges={negCycleEdges} isDone={isDone}
          />
          <BellmanFordPathPanel
            shortestPath={shortestPath} dist={dist}
            startId={startNode} endId={endNode} isDone={isDone}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem' }}>
        <BellmanFordInfo nodeCount={nodes.length} edgeCount={edges.length} />
        <BellmanFordHistory history={history} />
      </div>
    </div>
  );
}
