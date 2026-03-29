import { useState, useEffect, useRef } from 'react';
import { DEFAULT_NODES, DEFAULT_EDGES, buildWeightedAdj, addWeightedEdge } from './dijkstraData';
import { generateDijkstraSteps } from './dijkstraSteps';
import { reconstructPath } from './dijkstraLogic';
import DijkstraCanvas from './DijkstraCanvas';
import DijkstraControls from './DijkstraControls';
import DijkstraDistTable from './DijkstraDistTable';
import DijkstraPQView from './DijkstraPQView';
import DijkstraPathPanel from './DijkstraPathPanel';
import DijkstraInfo from './DijkstraInfo';
import DijkstraHistory from './DijkstraHistory';

export default function DijkstraVisualizer() {
  const [nodes,          setNodes]          = useState(DEFAULT_NODES);
  const [edges,          setEdges]          = useState(DEFAULT_EDGES);
  const [steps,          setSteps]          = useState([]);
  const [stepIndex,      setStepIndex]      = useState(-1);
  const [isRunning,      setIsRunning]      = useState(false);
  const [startNode,      setStartNode]      = useState('A');
  const [endNode,        setEndNode]        = useState('D');
  const [speed,          setSpeed]          = useState(500);
  const [addEdgeFrom,    setAddEdgeFrom]    = useState('');
  const [addEdgeTo,      setAddEdgeTo]      = useState('');
  const [addEdgeWeight,  setAddEdgeWeight]  = useState('');
  const [history,        setHistory]        = useState([]);
  const [message,        setMessage]        = useState('Select source and destination, then click Auto ▶ or Step ▶ to run Dijkstra.');
  const timerRef = useRef(null);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 19)]);

  const currentStep  = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const dist         = currentStep ? currentStep.dist        : null;
  const prev         = currentStep ? currentStep.prev        : null;
  const visited      = currentStep ? currentStep.visited     : [];
  const current      = currentStep ? currentStep.current     : null;
  const relaxedEdge  = currentStep ? currentStep.relaxedEdge : null;
  const pqSnapshot   = currentStep ? currentStep.pqSnapshot  : [];
  const phase        = currentStep ? currentStep.phase       : '';
  const isDone       = phase === 'done';

  const shortestPath = isDone && dist && prev && endNode
    ? reconstructPath(prev, startNode, endNode)
    : [];

  const adjList = buildWeightedAdj(nodes, edges);

  const generateSteps = () => {
    const adj = buildWeightedAdj(nodes, edges);
    return generateDijkstraSteps(adj, nodes, startNode);
  };

  const handleRun = () => {
    if (isRunning) return;
    const generated = generateSteps();
    setSteps(generated);
    setStepIndex(0);
    setMessage(generated[0].message);
    setIsRunning(true);
    pushHistory('run', `Dijkstra from ${startNode}`);
  };

  const handleStop = () => { setIsRunning(false); clearTimeout(timerRef.current); };

  const handleStepForward = () => {
    if (steps.length === 0) {
      const generated = generateSteps();
      setSteps(generated);
      setStepIndex(0);
      setMessage(generated[0].message);
      pushHistory('run', `Dijkstra from ${startNode} — stepping`);
      return;
    }
    const next = Math.min(stepIndex + 1, steps.length - 1);
    setStepIndex(next);
    setMessage(steps[next].message);
  };

  const handleStepBack = () => {
    if (stepIndex <= 0) return;
    const prev = stepIndex - 1;
    setStepIndex(prev);
    setMessage(steps[prev].message);
  };

  useEffect(() => {
    if (!isRunning) return;
    if (stepIndex >= steps.length - 1) { setIsRunning(false); return; }
    timerRef.current = setTimeout(() => {
      const next = stepIndex + 1;
      setStepIndex(next);
      setMessage(steps[next].message);
    }, speed);
    return () => clearTimeout(timerRef.current);
  }, [isRunning, stepIndex, steps, speed]);

  useEffect(() => {
    if (isDone && endNode) {
      const path = reconstructPath(prev, startNode, endNode);
      if (path.length > 1) {
        pushHistory('path', `Shortest ${startNode}→${endNode}: [${path.join('→')}] cost=${dist[endNode]}`);
      }
    }
  }, [isDone, endNode]);

  const handleReset = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setSteps([]); setStepIndex(-1);
    setMessage('Graph reset. Select source and destination and run Dijkstra.');
    setHistory([]);
  };

  const handleAddEdge = () => {
    const newEdges = addWeightedEdge(edges, nodes, addEdgeFrom, addEdgeTo, addEdgeWeight);
    if (newEdges === edges) { setMessage('Invalid edge — check node IDs, weight > 0, and no duplicates.'); return; }
    setEdges(newEdges);
    setSteps([]); setStepIndex(-1);
    const f = addEdgeFrom.trim().toUpperCase();
    const t = addEdgeTo.trim().toUpperCase();
    pushHistory('add', `Added edge ${f}—${t} weight=${addEdgeWeight}`);
    setAddEdgeFrom(''); setAddEdgeTo(''); setAddEdgeWeight('');
    setMessage(`Edge ${f}—${t} (w=${addEdgeWeight}) added. Re-run to update shortest paths.`);
  };

  const handleNodeDrag = (id, x, y) =>
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, x, y } : n));

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>Dijkstra — Shortest Path</p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <DijkstraControls
          nodes={nodes}
          startNode={startNode} setStartNode={(v) => { setStartNode(v); setSteps([]); setStepIndex(-1); }}
          endNode={endNode} setEndNode={setEndNode}
          addEdgeFrom={addEdgeFrom} setAddEdgeFrom={setAddEdgeFrom}
          addEdgeTo={addEdgeTo} setAddEdgeTo={setAddEdgeTo}
          addEdgeWeight={addEdgeWeight} setAddEdgeWeight={setAddEdgeWeight}
          onAddEdge={handleAddEdge}
          onRun={handleRun} onStepForward={handleStepForward}
          onStepBack={handleStepBack} onStop={handleStop} onReset={handleReset}
          speed={speed} setSpeed={setSpeed} isRunning={isRunning}
          stepIndex={stepIndex} totalSteps={steps.length} message={message}
        />
        <DijkstraCanvas
          nodes={nodes} edges={edges}
          visited={visited} current={current}
          relaxedEdge={relaxedEdge} shortestPath={shortestPath}
          dist={dist} onNodeDrag={handleNodeDrag}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', marginBottom: '1rem' }}>
        <DijkstraPathPanel
          shortestPath={shortestPath} dist={dist}
          startId={startNode} endId={endNode} isDone={isDone}
        />
        <DijkstraPQView pqSnapshot={pqSnapshot} current={current} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '1rem' }}>
        <DijkstraDistTable
          nodes={nodes} dist={dist} prev={prev}
          visited={visited} current={current}
          startId={startNode} shortestPath={shortestPath}
        />
        <DijkstraInfo nodeCount={nodes.length} edgeCount={edges.length} />
        <DijkstraHistory history={history} />
      </div>
    </div>
  );
}
