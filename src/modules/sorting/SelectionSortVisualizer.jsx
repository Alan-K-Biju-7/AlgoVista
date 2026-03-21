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

function SelectionSortVisualizer() {
  const [values, setValues] = useState([29, 10, 14, 37, 13, 8, 22]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(1);
  const [minIndex, setMinIndex] = useState(0);
  const [sortedUpTo, setSortedUpTo] = useState(-1);
  const [isSorted, setIsSorted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState('Click "Step" to walk through selection sort, or "Auto run" to animate.');
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const intervalRef = useRef(null);
  const stateRef = useRef({ i: 0, j: 1, minIndex: 0, values: [29, 10, 14, 37, 13, 8, 22] });

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const resetPointers = (arr) => {
    setI(0); setJ(1); setMinIndex(0); setSortedUpTo(-1);
    setIsSorted(false); setActivePseudoLine(0);
    setComparisonCount(0); setSwapCount(0);
    stateRef.current = { i: 0, j: 1, minIndex: 0, values: arr };
  };

  const handleReset = () => {
    const base = [29, 10, 14, 37, 13, 8, 22];
    setValues(base);
    resetPointers(base);
    setIsRunning(false);
    setMessage('Array reset. Click "Step" or "Auto run" to begin.');
    setHistory([]);
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 1);
    setValues(next);
    resetPointers(next);
    setIsRunning(false);
    setMessage('New array generated. Find the minimum on each pass and place it at the front.');
    setHistory([]);
  };

  const performStep = () => {
    const { i: ci, j: cj, minIndex: cMin, values: arr } = stateRef.current;
    const n = arr.length;

    if (ci >= n - 1) {
      setIsSorted(true); setIsRunning(false);
      setSortedUpTo(n - 1); setActivePseudoLine(5);
      setMessage('Selection sort complete. Every element is in its final position.');
      pushHistory('Array fully sorted.');
      return;
    }

    setActivePseudoLine(2);
    setComparisonCount((c) => c + 1);

    let nextMin = cMin;
    if (arr[cj] < arr[cMin]) {
      nextMin = cj;
      setMessage('New minimum found: ' + arr[cj] + ' at index ' + cj + '.');
      pushHistory('New min: ' + arr[cj] + ' at index ' + cj + ' (pass i = ' + ci + ').');
    } else {
      setMessage('A[' + cj + '] = ' + arr[cj] + ' is not smaller than current min ' + arr[cMin] + '. Move on.');
    }

    setMinIndex(nextMin);
    setJ(cj + 1);

    if (cj + 1 >= n - ci) {
      setActivePseudoLine(3);
      const newArr = [...arr];
      if (nextMin !== ci) {
        const tmp = newArr[ci];
        newArr[ci] = newArr[nextMin];
        newArr[nextMin] = tmp;
        setSwapCount((s) => s + 1);
        pushHistory('Swapped index ' + ci + ' (' + newArr[nextMin] + ') with index ' + nextMin + ' (' + newArr[ci] + ').');
        setMessage('Pass ' + ci + ' done. Swapped min ' + newArr[ci] + ' into position ' + ci + '.');
      } else {
        pushHistory('Pass ' + ci + ': min already at index ' + ci + ', no swap needed.');
        setMessage('Pass ' + ci + ' done. Min was already at index ' + ci + '.');
      }
      setValues(newArr);
      setSortedUpTo(ci);
      setActivePseudoLine(4);
      const nextI = ci + 1;
      const nextJ = nextI + 1;
      setI(nextI); setJ(nextJ); setMinIndex(nextI);
      stateRef.current = { i: nextI, j: nextJ, minIndex: nextI, values: newArr };
    } else {
      stateRef.current = { i: ci, j: cj + 1, minIndex: nextMin, values: arr };
    }
  };

  const handleStep = () => { if (isRunning || isSorted) return; performStep(); };
  const toggleAutoRun = () => { if (isSorted) return; setIsRunning((prev) => !prev); };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => { performStep(); }, speed);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, speed]);

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '1rem' }}>
        Selection sort
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1.8fr', gap: '1rem' }}>

        <div style={card}>
          <p style={cardLabel}>Controls</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={handleRandomize} disabled={isRunning}>Randomize</button>
            <button onClick={handleStep} disabled={isRunning || isSorted}>Step</button>
            <button onClick={toggleAutoRun} disabled={isSorted}>{isRunning ? 'Pause' : 'Auto run'}</button>
            <button onClick={handleReset} disabled={isRunning}>Reset</button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ ...cardLabel, marginBottom: '0.4rem' }}>Speed</p>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[{ label: 'Slow', value: 900 }, { label: 'Normal', value: 500 }, { label: 'Fast', value: 150 }].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSpeed(s.value)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.75rem',
                    background: speed === s.value ? '#4f46e5' : 'transparent',
                    color: speed === s.value ? '#fff' : '#64748b',
                    border: '1px solid',
                    borderColor: speed === s.value ? '#4f46e5' : '#334155',
                    borderRadius: '0.4rem',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#a5b4fc', lineHeight: 1.6 }}>{message}</p>

          <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.9 }}>
            <div>Pass i = <span style={{ color: '#818cf8' }}>{i}</span>
              &nbsp;|&nbsp; Scan j = <span style={{ color: '#60a5fa' }}>{j}</span>
              &nbsp;|&nbsp; Min @ <span style={{ color: '#fbbf24' }}>{minIndex}</span>
            </div>
            <div>Comparisons: <span style={{ color: '#818cf8' }}>{comparisonCount}</span></div>
            <div>Swaps: <span style={{ color: '#f472b6' }}>{swapCount}</span></div>
          </div>
        </div>

        <div style={card}>
          <p style={cardLabel}>Array</p>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', minHeight: '9rem' }}>
            {values.map((value, index) => {
              const isSortedPos  = index <= sortedUpTo;
              const isCurrentMin = index === minIndex && !isSortedPos;
              const isScanning   = index === j && !isSortedPos;
              const isPassStart  = index === i && !isSortedPos;

              let bg = '#1e293b';
              let borderColor = '#334155';
              let textColor = '#94a3b8';

              if (isSortedPos)  { bg = '#14532d'; borderColor = '#16a34a'; textColor = '#86efac'; }
              if (isPassStart && !isSortedPos)  { borderColor = '#818cf8'; }
              if (isScanning)   { bg = '#1e3a5f'; borderColor = '#3b82f6'; textColor = '#93c5fd'; }
              if (isCurrentMin) { bg = '#713f12'; borderColor = '#eab308'; textColor = '#fde047'; }

              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ fontSize: '0.6rem', height: '0.9rem', color: isCurrentMin ? '#fde047' : 'transparent', fontWeight: '700' }}>
                    {isCurrentMin ? 'min' : '·'}
                  </div>
                  <div
                    style={{
                      width: '2.75rem',
                      height: (value * 4 + 8) + 'px',
                      background: bg,
                      borderRadius: '0.4rem 0.4rem 0 0',
                      border: '1px solid ' + borderColor,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: '4px',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: textColor, fontWeight: '600' }}>{value}</span>
                  </div>
                  <span style={{ fontSize: '0.6rem', color: '#475569' }}>{index}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <span>🟢 Sorted</span>
            <span>🟡 Current min</span>
            <span>🔵 Scanning j</span>
            <span style={{ color: '#818cf8' }}>▏ Pass start i</span>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7 }}>
            <strong style={{ color: '#e2e8f0' }}>How it works — </strong>
            On each pass i, scan from i to the end to find the minimum element.
            Swap it into position i. After each pass, one more element is permanently placed.
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b' }}>Worst: <span style={{ color: '#f87171' }}>O(n²)</span></span>
            <span style={{ color: '#64748b' }}>Best: <span style={{ color: '#f87171' }}>O(n²)</span></span>
            <span style={{ color: '#64748b' }}>Swaps: <span style={{ color: '#34d399' }}>O(n)</span></span>
            <span style={{ color: '#64748b' }}>Space: <span style={{ color: '#60a5fa' }}>O(1)</span></span>
          </div>
        </div>
