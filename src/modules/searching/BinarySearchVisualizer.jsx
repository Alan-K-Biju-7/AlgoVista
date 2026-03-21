import { useState, useEffect, useRef } from 'react';

const card = {
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

const cardLabel = {
  fontSize: '0.7rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#64748b',
  marginBottom: '0.75rem',
};

function BinarySearchVisualizer() {
  const [values, setValues] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 72]);
  const [target, setTarget] = useState('');
  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);
  const [mid, setMid] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [message, setMessage] = useState('Enter a target value and click "Prepare" to set up binary search, then step through or auto run.');
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(null);
  const [comparisonCount, setComparisonCount] = useState(0);
  const intervalRef = useRef(null);
  const stateRef = useRef({ low: 0, high: 0, target: 0 });

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const clearSearch = () => {
    setLow(null); setHigh(null); setMid(null);
    setFoundIndex(null); setNotFound(false);
    setIsPrepared(false); setIsRunning(false);
    setActivePseudoLine(null); setComparisonCount(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    setValues([2, 5, 8, 12, 16, 23, 38, 45, 56, 72]);
    setTarget('');
    clearSearch();
    setMessage('Array reset. Enter a target and click "Prepare".');
    setHistory([]);
  };

  const handleRandomize = () => {
    const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 99) + 1);
    arr.sort((a, b) => a - b);
    setValues(arr);
    setTarget('');
    clearSearch();
    setMessage('New sorted array generated. Enter a target and click "Prepare".');
    setHistory([]);
  };

  const handlePrepare = () => {
    if (target.trim() === '') { setMessage('Please enter a target value first.'); return; }
    const t = Number(target);
    const l = 0;
    const h = values.length - 1;
    setLow(l); setHigh(h); setMid(null);
    setFoundIndex(null); setNotFound(false);
    setIsPrepared(true); setIsRunning(false);
    setActivePseudoLine(0); setComparisonCount(0);
    stateRef.current = { low: l, high: h, target: t };
    setMessage('Ready. low = 0, high = ' + h + '. Click "Step" or "Auto run".');
    pushHistory('Prepared search for ' + t + ' in array of length ' + values.length + '.');
  };

  const doStep = (l, h, t) => {
    if (l > h) {
      setLow(null); setHigh(null); setMid(null);
      setNotFound(true); setIsRunning(false);
      setActivePseudoLine(6);
      setMessage(t + ' is not in the array. Search exhausted all possibilities.');
      pushHistory('Not found: ' + t + ' — low exceeded high.');
      return { done: true };
    }

    const m = Math.floor((l + h) / 2);
    setMid(m); setLow(l); setHigh(h);
    setComparisonCount((c) => c + 1);
    setActivePseudoLine(1);

    if (values[m] === t) {
      setFoundIndex(m); setIsRunning(false);
      setActivePseudoLine(2);
      setMessage('Found ' + t + ' at index ' + m + ' after checking mid = ' + m + '.');
      pushHistory('Found ' + t + ' at index ' + m + '.');
      return { done: true };
    } else if (values[m] < t) {
      setActivePseudoLine(4);
      const nextL = m + 1;
      setMessage('A[' + m + '] = ' + values[m] + ' < ' + t + '. Discard left half. New low = ' + nextL + '.');
      pushHistory('mid ' + m + ': ' + values[m] + ' < ' + t + ', moved low to ' + nextL + '.');
      stateRef.current = { low: nextL, high: h, target: t };
      return { done: false, nextL, nextH: h };
    } else {
      setActivePseudoLine(5);
      const nextH = m - 1;
      setMessage('A[' + m + '] = ' + values[m] + ' > ' + t + '. Discard right half. New high = ' + nextH + '.');
      pushHistory('mid ' + m + ': ' + values[m] + ' > ' + t + ', moved high to ' + nextH + '.');
      stateRef.current = { low: l, high: nextH, target: t };
      return { done: false, nextL: l, nextH };
    }
  };

  const handleStep = () => {
    if (!isPrepared || isRunning) return;
    const { low: l, high: h, target: t } = stateRef.current;
    doStep(l, h, t);
  };

  const toggleAutoRun = () => {
    if (!isPrepared || foundIndex !== null || notFound) return;
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const { low: l, high: h, target: t } = stateRef.current;
        const result = doStep(l, h, t);
        if (result.done) {
          setIsRunning(false);
          clearInterval(intervalRef.current);
        }
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, speed]);

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '1rem' }}>
        Binary search
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1.8fr', gap: '1rem' }}>

        <div style={card}>
          <p style={cardLabel}>Controls</p>

          <div style={{ marginBottom: '0.85rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.35rem', display: 'block' }}>
              Target value
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="number to find"
              disabled={isRunning}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={handlePrepare} disabled={isRunning}>Prepare</button>
            <button onClick={handleStep} disabled={!isPrepared || isRunning || foundIndex !== null || notFound}>Step</button>
            <button onClick={toggleAutoRun} disabled={!isPrepared || foundIndex !== null || notFound}>
              {isRunning ? 'Pause' : 'Auto run'}
            </button>
            <button onClick={handleRandomize} disabled={isRunning}>Randomize</button>
            <button onClick={handleReset} disabled={isRunning}>Reset</button>
          </div>
