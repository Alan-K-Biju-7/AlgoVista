import { useState, useEffect, useRef } from 'react';
import { DEFAULT_ARRAY, PRESET_ARRAYS } from './quickSortLogic';
import { generateQuickSortSteps } from './quickSortSteps';
import QuickArrayBars from './QuickArrayBars';
import QuickPartitionView from './QuickPartitionView';
import QuickSortControls from './QuickSortControls';
import QuickSortInfo from './QuickSortInfo';
import QuickSortHistory from './QuickSortHistory';

export default function QuickSortVisualizer() {
  const [arr,        setArr]        = useState(DEFAULT_ARRAY);
  const [steps,      setSteps]      = useState([]);
  const [stepIndex,  setStepIndex]  = useState(-1);
  const [isRunning,  setIsRunning]  = useState(false);
  const [speed,      setSpeed]      = useState(500);
  const [history,    setHistory]    = useState([]);
  const [message,    setMessage]    = useState('Default array loaded. Click Auto ▶ or Step ▶. Try "Reversed" for the O(n²) worst case!');
  const timerRef = useRef(null);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 19)]);

  const currentStep    = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const displayArr     = currentStep ? currentStep.arr            : arr;
  const phase          = currentStep ? currentStep.phase          : '';
  const pivotIdx       = currentStep ? currentStep.pivotIdx       : null;
  const pivotVal       = currentStep ? currentStep.pivot          : null;
  const lo             = currentStep ? currentStep.lo             : null;
  const hi             = currentStep ? currentStep.hi             : null;
  const iPtr           = currentStep ? currentStep.i              : null;
  const jPtr           = currentStep ? currentStep.j              : null;
  const sortedIndices  = currentStep ? currentStep.sortedIndices  : [];
  const swapPair       = currentStep ? currentStep.swapPair       : null;

  const ensureSteps = () => {
    if (steps.length > 0) return steps;
    const gen = generateQuickSortSteps(arr);
    setSteps(gen);
    return gen;
  };

  const handleAutoRun = () => {
    const gen = ensureSteps();
    if (stepIndex >= gen.length - 1) return;
    setIsRunning(true);
    pushHistory('sort', `Quick sort [${arr.join(', ')}]`);
  };

  const handleStepForward = () => {
    const gen = ensureSteps();
    if (steps.length === 0) { setSteps(gen); setStepIndex(0); setMessage(gen[0].message); pushHistory('sort', `Quick sort [${arr.join(', ')}] — stepping`); return; }
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
    setMessage(key === 'reversed'
      ? `Reversed array loaded — this is the O(n²) worst case for Lomuto with last-element pivot!`
      : `Loaded "${key}": [${newArr.join(', ')}]. Ready to sort.`);
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
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#a78bfa', marginBottom: '1rem' }}>Quick Sort — Lomuto Partition</p>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <QuickSortControls
          onStepForward={handleStepForward} onStepBack={handleStepBack}
          onAutoRun={handleAutoRun} onStop={handleStop} onReset={handleReset}
          onLoadPreset={handleLoadPreset}
          isRunning={isRunning} stepIndex={stepIndex} totalSteps={steps.length}
          speed={speed} setSpeed={setSpeed} message={message}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <QuickArrayBars
            arr={displayArr} phase={phase}
            pivotIdx={pivotIdx} i={iPtr} j={jPtr}
            lo={lo} hi={hi}
            sortedIndices={sortedIndices} swapPair={swapPair}
          />
          <QuickPartitionView
            arr={displayArr} lo={lo} hi={hi}
            pivotIdx={pivotIdx} pivotVal={pivotVal}
            i={iPtr} j={jPtr} phase={phase}
            sortedIndices={sortedIndices}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem' }}>
        <QuickSortInfo arraySize={arr.length} />
        <QuickSortHistory history={history} />
      </div>
    </div>
  );
}
