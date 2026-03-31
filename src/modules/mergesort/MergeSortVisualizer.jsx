import { useState, useEffect, useRef } from 'react';
import { DEFAULT_ARRAY, PRESET_ARRAYS } from './mergeSortLogic';
import { generateMergeSortSteps } from './mergeSortSteps';
import MergeArrayBars from './MergeArrayBars';
import MergeSplitTree from './MergeSplitTree';
import MergeSortControls from './MergeSortControls';
import MergeSortInfo from './MergeSortInfo';
import MergeSortHistory from './MergeSortHistory';

export default function MergeSortVisualizer() {
  const [arr,        setArr]        = useState(DEFAULT_ARRAY);
  const [steps,      setSteps]      = useState([]);
  const [stepIndex,  setStepIndex]  = useState(-1);
  const [isRunning,  setIsRunning]  = useState(false);
  const [speed,      setSpeed]      = useState(500);
  const [history,    setHistory]    = useState([]);
  const [message,    setMessage]    = useState('Default array loaded. Click Auto ▶ to run or Step ▶ to go step by step.');
  const timerRef = useRef(null);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 19)]);

  const currentStep  = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const displayArr   = currentStep ? currentStep.arr        : arr;
  const phase        = currentStep ? currentStep.phase      : '';
  const activeRange  = currentStep ? currentStep.activeRange : null;
  const leftPart     = currentStep ? currentStep.leftPart   : null;
  const rightPart    = currentStep ? currentStep.rightPart  : null;
  const mergeRange   = currentStep ? currentStep.mergeRange : null;
  const comparing    = currentStep ? currentStep.comparing  : null;
  const merged       = currentStep ? currentStep.merged     : null;

  const ensureSteps = () => {
    if (steps.length > 0) return steps;
    const gen = generateMergeSortSteps(arr);
    setSteps(gen);
    return gen;
  };

  const handleAutoRun = () => {
    const gen = ensureSteps();
    if (stepIndex >= gen.length - 1) return;
    setIsRunning(true);
    pushHistory('sort', `Merge sort [${arr.join(', ')}]`);
  };

  const handleStepForward = () => {
    const gen = ensureSteps();
    if (steps.length === 0) { setSteps(gen); setStepIndex(0); setMessage(gen[0].message); pushHistory('sort', `Merge sort [${arr.join(', ')}] — stepping`); return; }
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

  const handleStop  = () => { setIsRunning(false); clearTimeout(timerRef.current); };

  const handleReset = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setArr(DEFAULT_ARRAY);
    setSteps([]); setStepIndex(-1);
    setMessage('Reset. Click Auto ▶ or Step ▶.');
    setHistory([]);
  };

  const handleLoadPreset = (key) => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
    const newArr = key === 'random' ? PRESET_ARRAYS.random() : PRESET_ARRAYS[key];
    setArr(newArr);
    setSteps([]); setStepIndex(-1);
    setMessage(`Loaded "${key}" array: [${newArr.join(', ')}]. Ready to sort.`);
    pushHistory('preset', `Loaded preset: ${key}`);
  };

  useEffect(() => {
    if (!isRunning) return;
    if (stepIndex >= steps.length - 1) { setIsRunning(false); return; }
    const startIdx = stepIndex < 0 ? 0 : stepIndex + 1;
    timerRef.current = setTimeout(() => {
      setStepIndex(startIdx);
      setMessage(steps[startIdx].message);
    }, speed);
    return () => clearTimeout(timerRef.current);
  }, [isRunning, stepIndex, steps, speed]);

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>Merge Sort — Divide & Conquer</p>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <MergeSortControls
          onStepForward={handleStepForward} onStepBack={handleStepBack}
          onAutoRun={handleAutoRun} onStop={handleStop} onReset={handleReset}
          onLoadPreset={handleLoadPreset}
          isRunning={isRunning} stepIndex={stepIndex} totalSteps={steps.length}
          speed={speed} setSpeed={setSpeed} message={message}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <MergeArrayBars
            arr={displayArr} phase={phase}
            activeRange={activeRange} leftPart={leftPart} rightPart={rightPart}
            mergeRange={mergeRange} comparing={comparing} merged={merged}
          />
          <MergeSplitTree arr={arr} activeRange={activeRange} phase={phase} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem' }}>
        <MergeSortInfo arraySize={arr.length} />
        <MergeSortHistory history={history} />
      </div>
    </div>
  );
}
