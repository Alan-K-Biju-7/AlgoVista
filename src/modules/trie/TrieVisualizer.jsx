import { useState, useEffect, useRef } from 'react';
import { buildDefaultTrie, createTrie, trieInsert } from './trieLogic';
import { generateInsertSteps } from './trieInsertSteps';
import { generateSearchSteps } from './trieSearchSteps';
import { generateDeleteSteps } from './trieDeleteSteps';
import { generateAutoCompleteSteps } from './trieAutoCompleteSteps';
import TrieCanvas from './TrieCanvas';
import TrieControls from './TrieControls';
import TrieWordList from './TrieWordList';
import TrieInfo from './TrieInfo';
import TrieHistory from './TrieHistory';

export default function TrieVisualizer() {
  const [root,        setRoot]        = useState(buildDefaultTrie);
  const [steps,       setSteps]       = useState([]);
  const [stepIndex,   setStepIndex]   = useState(-1);
  const [isRunning,   setIsRunning]   = useState(false);
  const [wordInput,   setWordInput]   = useState('');
  const [speed,       setSpeed]       = useState(500);
  const [history,     setHistory]     = useState([]);
  const [message,     setMessage]     = useState('Trie loaded with 12 words. Try searching "app" or autocomplete "ca".');
  const timerRef = useRef(null);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 19)]);

  const currentStep   = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const displayRoot   = currentStep ? currentStep.root          : root;
  const highlightPath = currentStep ? currentStep.highlightPath : [];
  const phase         = currentStep ? currentStep.phase         : '';
  const suggestions   = currentStep ? currentStep.suggestions   : [];

  const runSteps = (generated, type, logText) => {
    if (!generated.length) return;
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setSteps(generated);
    setStepIndex(0);
    setMessage(generated[0].message);
    pushHistory(type, logText);
  };

  const commitFinal = (stepsArr) => {
    if (stepsArr.length > 0) setRoot(stepsArr[stepsArr.length - 1].root);
  };

  const getWord = () => {
    const w = wordInput.trim().toLowerCase();
    if (!w) { setMessage('Enter a word or prefix first.'); return null; }
    return w;
  };

  const handleInsert       = () => { const w = getWord(); if (w) runSteps(generateInsertSteps(root, w),       'insert',      `Insert "${w}"`); };
  const handleSearch       = () => { const w = getWord(); if (w) runSteps(generateSearchSteps(root, w),       'search',      `Search "${w}"`); };
  const handleDelete       = () => { const w = getWord(); if (w) runSteps(generateDeleteSteps(root, w),       'delete',      `Delete "${w}"`); };
  const handleAutocomplete = () => { const w = getWord(); if (w) runSteps(generateAutoCompleteSteps(root, w), 'autocomplete',`Autocomplete "${w}"`); };

  const handleStepForward = () => {
    if (!steps.length) { setMessage('Click an operation first.'); return; }
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
    setRoot(buildDefaultTrie());
    setSteps([]); setStepIndex(-1);
    setWordInput('');
    setMessage('Trie reset to default 12 words.');
    setHistory([]);
  };

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>Trie — Prefix Tree</p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <TrieControls
          wordInput={wordInput} setWordInput={setWordInput}
          onInsert={handleInsert} onSearch={handleSearch}
          onDelete={handleDelete} onAutocomplete={handleAutocomplete}
          onStepForward={handleStepForward} onStepBack={handleStepBack}
          onAutoRun={handleAutoRun} onStop={handleStop} onReset={handleReset}
          isRunning={isRunning} stepIndex={stepIndex} totalSteps={steps.length}
          speed={speed} setSpeed={setSpeed} message={message}
        />
        <TrieCanvas root={displayRoot} highlightPath={highlightPath} phase={phase} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '1rem' }}>
        <TrieInfo />
        <TrieWordList root={displayRoot} suggestions={suggestions} phase={phase} />
        <TrieHistory history={history} />
      </div>
    </div>
  );
}
