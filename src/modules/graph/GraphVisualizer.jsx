import { useState, useEffect, useRef } from 'react';
import { DEFAULT_NODES, DEFAULT_EDGES, buildAdjList, addNode, addEdge, removeNode } from './graphData';
import { generateBFSSteps } from './bfsLogic';
import { generateDFSSteps } from './dfsLogic';
import GraphCanvas from './GraphCanvas';
import GraphControls from './GraphControls';
import GraphAdjList from './GraphAdjList';
import GraphInfo from './GraphInfo';
import GraphHistory from './GraphHistory';

export default function GraphVisualizer() {
  const [nodes,         setNodes]         = useState(DEFAULT_NODES);
  const [edges,         setEdges]         = useState(DEFAULT_EDGES);
  const [steps,         setSteps]         = useState([]);
  const [stepIndex,     setStepIndex]     = useState(-1);
  const [isRunning,     setIsRunning]     = useState(false);
  const [algorithm,     setAlgorithm]     = useState('BFS');
  const [startNode,     setStartNode]     = useState('A');
  const [speed,         setSpeed]         = useState(600);
  const [addNodeInput,  setAddNodeInput]  = useState('');
  const [addEdgeFrom,   setAddEdgeFrom]   = useState('');
  const [addEdgeTo,     setAddEdgeTo]     = useState('');
  const [history,       setHistory]       = useState([]);
  const [message,       setMessage]       = useState('Choose BFS or DFS, pick a start node, then click Auto ▶ or Step ▶.');
  const timerRef = useRef(null);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 19)]);

  const adjList = buildAdjList(nodes, edges);

  const currentStep  = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const visitedArr   = currentStep ? currentStep.visited   : [];
  const frontierArr  = currentStep ? currentStep.frontier  : [];
  const currentNode  = currentStep ? currentStep.current   : null;
  const treeEdges    = currentStep ? currentStep.treeEdges : [];
  const visitedSet   = new Set(visitedArr);
  const frontierSet  = new Set(frontierArr);

  const generateSteps = (alg, start, ns, es) => {
    const adj = buildAdjList(ns, es);
    if (!adj[start]) return [];
    return alg === 'BFS'
      ? generateBFSSteps(adj, start)
      : generateDFSSteps(adj, start);
  };

  const handleRun = () => {
    if (isRunning) return;
    const generated = generateSteps(algorithm, startNode, nodes, edges);
    if (generated.length === 0) { setMessage('Start node not found in graph.'); return; }
    setSteps(generated);
    setStepIndex(0);
    setMessage(generated[0].message);
    setIsRunning(true);
    pushHistory(algorithm.toLowerCase(), `${algorithm} from ${startNode}`);
  };

  const handleStop = () => { setIsRunning(false); };

  const handleStepForward = () => {
    if (steps.length === 0) {
      const generated = generateSteps(algorithm, startNode, nodes, edges);
      if (!generated.length) { setMessage('Start node not found.'); return; }
      setSteps(generated);
      setStepIndex(0);
      setMessage(generated[0].message);
      pushHistory(algorithm.toLowerCase(), `${algorithm} from ${startNode} — stepping`);
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
    if (!isRunning) { clearTimeout(timerRef.current); return; }
    if (stepIndex >= steps.length - 1) { setIsRunning(false); return; }
    timerRef.current = setTimeout(() => {
      const next = stepIndex + 1;
      setStepIndex(next);
      setMessage(steps[next].message);
    }, speed);
    return () => clearTimeout(timerRef.current);
  }, [isRunning, stepIndex, steps, speed]);

  const handleReset = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setSteps([]);
    setStepIndex(-1);
    setMessage('Graph reset to default. Choose an algorithm and start node.');
    setHistory([]);
  };

  const handleAddNode = () => {
    const newNodes = addNode(nodes, addNodeInput);
    if (newNodes === nodes) { setMessage(`Node "${addNodeInput}" already exists or is invalid.`); return; }
    setNodes(newNodes);
    setSteps([]); setStepIndex(-1);
    pushHistory('add', `Added node ${addNodeInput.trim().toUpperCase()}`);
    setAddNodeInput('');
    setMessage(`Node ${addNodeInput.trim().toUpperCase()} added.`);
  };

  const handleAddEdge = () => {
    const newEdges = addEdge(edges, nodes, addEdgeFrom, addEdgeTo);
    if (newEdges === edges) { setMessage('Edge already exists, nodes not found, or self-loop.'); return; }
    setEdges(newEdges);
    setSteps([]); setStepIndex(-1);
    const f = addEdgeFrom.trim().toUpperCase();
    const t = addEdgeTo.trim().toUpperCase();
    pushHistory('add', `Added edge ${f} — ${t}`);
    setAddEdgeFrom(''); setAddEdgeTo('');
    setMessage(`Edge ${f} — ${t} added.`);
  };

  const handleNodeDrag = (nodeId, x, y) => {
    setNodes((prev) => prev.map((n) => n.id === nodeId ? { ...n, x, y } : n));
  };

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>Graph — BFS & DFS</p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <GraphControls
          nodes={nodes}
          algorithm={algorithm} setAlgorithm={(alg) => { setAlgorithm(alg); setSteps([]); setStepIndex(-1); }}
          startNode={startNode} setStartNode={setStartNode}
          addNodeInput={addNodeInput} setAddNodeInput={setAddNodeInput} onAddNode={handleAddNode}
          addEdgeFrom={addEdgeFrom} setAddEdgeFrom={setAddEdgeFrom}
          addEdgeTo={addEdgeTo} setAddEdgeTo={setAddEdgeTo} onAddEdge={handleAddEdge}
          onRun={handleRun} onStepForward={handleStepForward} onStepBack={handleStepBack}
          onStop={handleStop} onReset={handleReset}
          speed={speed} setSpeed={setSpeed} isRunning={isRunning}
          stepIndex={stepIndex} totalSteps={steps.length} message={message}
        />
        <GraphCanvas
          nodes={nodes} edges={edges}
          visitedSet={visitedSet} frontierSet={frontierSet}
          currentNode={currentNode} treeEdges={treeEdges}
          onNodeDrag={handleNodeDrag}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '1rem' }}>
        <GraphAdjList
          nodes={nodes} adjList={adjList}
          visitedArr={visitedArr} frontierArr={frontierArr}
          algorithm={algorithm} stepIndex={stepIndex}
        />
        <GraphInfo algorithm={algorithm} />
        <GraphHistory history={history} />
      </div>
    </div>
  );
}
