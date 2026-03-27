import { useState, useEffect, useRef } from 'react';
import { buildMinHeap } from './heapLogic';
import { generateInsertSteps } from './insertSteps';
import { generateExtractSteps } from './extractSteps';
import HeapTreeView from './HeapTreeView';
import HeapArrayView from './HeapArrayView';
import HeapControls from './HeapControls';
import HeapInfo from './HeapInfo';
import HeapHistory from './HeapHistory';

const DEFAULT_HEAP = buildMinHeap([38, 27, 43, 3, 9, 82, 10]);

export default function HeapVisualizer() {
  const [heap,        setHeap]        = useState(DEFAULT_HEAP);
  const [steps,       setSteps]       = useState([]);
  const [stepIndex,   setStepIndex]   = useState(-1);
  const [isRunning,   setIsRunning]   = useState(false);
  const [inputVal,    setInputVal]    = useState('');
  const [speed,       setSpeed]       = useState(500);
  const [history,     setHistory]     = useState([]);
  const [message,     setMessage]     = useState('A valid min-heap — root is always the minimum. Insert a value or extract the min.');
  const timerRef = useRef(null);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 19)]);

  const currentStep  = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const displayHeap  = currentStep ? currentStep.heap         : heap;
  const highlightIdx = currentStep ? currentStep.highlightIdx : [];
  const swapPair     = currentStep ? currentStep.swapPair     : null;
  const phase        = currentStep ? currentStep.phase        : '';

  const handleInsert = () => {
    const v = Number(inputVal);
    if (inputVal.trim() === '' || isNaN(v)) { setMessage('Enter a valid integer.'); return; }
    clearTimeout(timerRef.current);
    setIsRunning(false);
    const generated = generateInsertSteps(heap, v);
    setSteps(generated);
    setStepIndex(0);
    setMessage(generated[0].message);
    setInputVal('');
    pushHistory('insert', `Insert ${v} into heap`);
  };

  const handleExtract = () => {
    if (heap.length === 0) { setMessage('Heap is empty — nothing to extract.'); return; }
    clearTimeout(timerRef.current);
    setIsRunning(false);
    const generated = generateExtractSteps(heap);
    setSteps(generated);
    setStepIndex(0);
    setMessage(generated[0].message);
    pushHistory('extract', `Extract min: ${heap[0]}`);
  };

  const commitFinalHeap = (stepsArr) => {
    if (stepsArr.length > 0) {
      const last = stepsArr[stepsArr.length - 1];
      setHeap(last.heap);
    }
  };

  const handleStepForward = () => {
    if (steps.length === 0) { setMessage('Click Insert or Extract Min first to generate steps.'); return; }
    const next = Math.min(stepIndex + 1, steps.length - 1);
    setStepIndex(next);
    setMessage(steps[next].message);
    if (next === steps.length - 1) commitFinalHeap(steps);
  };

  const handleStepBack = () => {
    if (stepIndex <= 0) return;
    const prev = stepIndex - 1;
    setStepIndex(prev);
    setMessage(steps[prev].message);
  };

  const handleAutoRun = () => {
    if (steps.length === 0 || stepIndex >= steps.length - 1) {
      setMessage('Generate steps first by clicking Insert or Extract Min.');
      return;
    }
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (!isRunning) return;
    if (stepIndex >= steps.length - 1) {
      setIsRunning(false);
      commitFinalHeap(steps);
      return;
    }
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
    setHeap(DEFAULT_HEAP);
    setSteps([]);
    setStepIndex(-1);
    setMessage('Heap reset to default. Root is always the minimum.');
    setHistory([]);
  };

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>Heap — Min Priority Queue</p>

      {/* Top: controls + tree + array */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <HeapControls
          inputVal={inputVal} setInputVal={setInputVal}
          onInsert={handleInsert} onExtract={handleExtract}
          onStepForward={handleStepForward} onStepBack={handleStepBack}
          onAutoRun={handleAutoRun} onStop={handleStop} onReset={handleReset}
          isRunning={isRunning} stepIndex={stepIndex} totalSteps={steps.length}
          speed={speed} setSpeed={setSpeed} message={message}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <HeapTreeView
            heap={displayHeap}
            highlightIdx={highlightIdx}
            swapPair={swapPair}
            phase={phase}
          />
          <HeapArrayView
            heap={displayHeap}
            highlightIdx={highlightIdx}
            swapPair={swapPair}
            phase={phase}
          />
        </div>
      </div>

      {/* Bottom: info + history */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1rem' }}>
        <HeapInfo
          heapSize={displayHeap.length}
          minVal={displayHeap.length > 0 ? displayHeap[0] : null}
        />
        <HeapHistory history={history} />
      </div>
    </div>
  );
}
