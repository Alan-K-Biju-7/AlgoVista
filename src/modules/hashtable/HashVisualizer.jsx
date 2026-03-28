import { useState, useEffect, useRef } from 'react';
import { getDefaultTable, htInsert } from './hashTable';
import { generateInsertSteps } from './hashInsertSteps';
import { generateSearchSteps } from './hashSearchSteps';
import { generateDeleteSteps } from './hashDeleteSteps';
import HashBuckets from './HashBuckets';
import HashControls from './HashControls';
import HashInfo from './HashInfo';
import HashHistory from './HashHistory';

export default function HashVisualizer() {
  const [table,      setTable]      = useState(getDefaultTable);
  const [steps,      setSteps]      = useState([]);
  const [stepIndex,  setStepIndex]  = useState(-1);
  const [isRunning,  setIsRunning]  = useState(false);
  const [keyInput,   setKeyInput]   = useState('');
  const [valInput,   setValInput]   = useState('');
  const [speed,      setSpeed]      = useState(500);
  const [history,    setHistory]    = useState([]);
  const [message,    setMessage]    = useState('Hash table loaded with 7 default entries. Insert, search, or delete a key to see the probe sequence.');
  const timerRef = useRef(null);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 19)]);

  const currentStep  = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const displayTable = currentStep ? currentStep.table        : table;
  const activeIdx    = currentStep ? currentStep.activeIdx    : null;
  const highlightKeys= currentStep ? currentStep.highlightKeys : [];
  const phase        = currentStep ? currentStep.phase        : '';

  const runSteps = (generated, type, logText) => {
    if (!generated.length) return;
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setSteps(generated);
    setStepIndex(0);
    setMessage(generated[0].message);
    pushHistory(type, logText);
  };

  const handleInsert = () => {
    const k = keyInput.trim().toLowerCase();
    const v = valInput.trim();
    if (!k) { setMessage('Enter a key first.'); return; }
    runSteps(generateInsertSteps(table, k, v || k), 'insert', `Insert "${k}" → "${v || k}"`);
  };

  const handleSearch = () => {
    const k = keyInput.trim().toLowerCase();
    if (!k) { setMessage('Enter a key to search.'); return; }
    const gen = generateSearchSteps(table, k);
    if (!gen.length) return;
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setSteps(gen);
    setStepIndex(0);
    setMessage(gen[0].message);
    pushHistory('search', `Search "${k}"`);
  };

  const handleDelete = () => {
    const k = keyInput.trim().toLowerCase();
    if (!k) { setMessage('Enter a key to delete.'); return; }
    runSteps(generateDeleteSteps(table, k), 'delete', `Delete "${k}"`);
  };

  const commitFinal = (stepsArr) => {
    if (stepsArr.length > 0) setTable(stepsArr[stepsArr.length - 1].table);
  };

  const handleStepForward = () => {
    if (!steps.length) { setMessage('Click Insert, Search or Delete first.'); return; }
    const next = Math.min(stepIndex + 1, steps.length - 1);
    setStepIndex(next);
    setMessage(steps[next].message);
    if (next === steps.length - 1) commitFinal(steps);
  };

  const handleStepBack = () => {
    if (stepIndex <= 0) return;
    const prev = stepIndex - 1;
    setStepIndex(prev);
    setMessage(steps[prev].message);
  };

  const handleAutoRun = () => {
    if (!steps.length || stepIndex >= steps.length - 1) {
      setMessage('Generate steps first by clicking an operation.');
      return;
    }
    setIsRunning(true);
  };

  const handleStop = () => { setIsRunning(false); clearTimeout(timerRef.current); };

  useEffect(() => {
    if (!isRunning) return;
    if (stepIndex >= steps.length - 1) { setIsRunning(false); commitFinal(steps); return; }
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
    setTable(getDefaultTable());
    setSteps([]); setStepIndex(-1);
    setKeyInput(''); setValInput('');
    setMessage('Hash table reset to default 7 entries.');
    setHistory([]);
  };

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>Hash Table — Separate Chaining</p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <HashControls
          keyInput={keyInput} setKeyInput={setKeyInput}
          valInput={valInput} setValInput={setValInput}
          onInsert={handleInsert} onSearch={handleSearch} onDelete={handleDelete}
          onStepForward={handleStepForward} onStepBack={handleStepBack}
          onAutoRun={handleAutoRun} onStop={handleStop} onReset={handleReset}
          isRunning={isRunning} stepIndex={stepIndex} totalSteps={steps.length}
          speed={speed} setSpeed={setSpeed} message={message}
        />
        <HashBuckets table={displayTable} activeIdx={activeIdx} highlightKeys={highlightKeys} phase={phase} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1rem' }}>
        <HashInfo table={displayTable} />
        <HashHistory history={history} />
      </div>
    </div>
  );
}
