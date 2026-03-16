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

function BubbleSortVisualizer() {
  const [values, setValues] = useState([5, 1, 4, 2, 8]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Click "Step" to move one comparison at a time, or "Auto run" to animate.'
  );
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const intervalRef = useRef(null);

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const resetPointers = () => {
    setI(0);
    setJ(0);
    setIsSorted(false);
    setActivePseudoLine(0);
    setComparisonCount(0);
    setSwapCount(0);
  };

  const handleReset = () => {
    setValues([5, 1, 4, 2, 8]);
    resetPointers();
    setIsRunning(false);
    setMessage('Array reset. Click "Step" or "Auto run" to walk through bubble sort.');
    setHistory([]);
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1);
    setValues(next);
    resetPointers();
    setIsRunning(false);
    setMessage('Random array generated. Click "Step" to start sorting.');
    setHistory([]);
  };

  const performStep = () => {
    if (isSorted) {
      setIsRunning(false);
      setMessage('Array is fully sorted. Reset or randomize to try again.');
      return;
    }

    setActivePseudoLine(2);
    setValues((prev) => {
      const arr = [...prev];
      setActivePseudoLine(3);
      setComparisonCount((c) => c + 1);
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        setSwapCount((s) => s + 1);
        pushHistory(`Swapped positions ${j} and ${j + 1}.`);
      } else {
        pushHistory(`No swap needed for positions ${j} and ${j + 1}.`);
      }

      let nextI = i;
      let nextJ = j + 1;

      if (nextJ >= arr.length - nextI - 1) {
        setActivePseudoLine(4);
        nextI += 1;
        nextJ = 0;
        pushHistory(`Completed pass i = ${nextI - 1}.`);
        if (nextI >= arr.length - 1) {
          setActivePseudoLine(5);
          setIsSorted(true);
          setIsRunning(false);
          setMessage('Bubble sort finished. Array is sorted.');
          pushHistory('Array is sorted; no more passes needed.');
        }
      }

      setI(nextI);
      setJ(nextJ);
      return arr;
    });
  };

  const handleStep = () => {
    if (isRunning) return;
    performStep();
  };

  const toggleAutoRun = () => {
    if (isSorted) return;
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => { performStep(); }, 500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, i, j]);

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '1rem' }}>
        Bubble sort
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1.8fr', gap: '1rem' }}>
        <div style={card}>
          <p style={cardLabel}>Controls</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={handleRandomize} disabled={isRunning}>Randomize</button>
            <button onClick={handleStep} disabled={isRunning}>Step</button>
            <button onClick={toggleAutoRun}>{isRunning ? 'Pause' : 'Auto run'}</button>
            <button onClick={handleReset} disabled={isRunning}>Reset</button>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#a5b4fc', lineHeight: 1.6 }}>{message}</p>
          <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.8 }}>
            <div>Pass i = {i} &nbsp;|&nbsp; Compare j = {j}</div>
            <div>Comparisons: <span style={{ color: '#818cf8' }}>{comparisonCount}</span></div>
            <div>Swaps: <span style={{ color: '#f472b6' }}>{swapCount}</span></div>
          </div>
        </div>

        <div style={card}>
          <p style={cardLabel}>Array</p>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', minHeight: '8rem' }}>
            {values.map((value, index) => {
              const isActive = index === j || index === j + 1;
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <div
                    style={{
                      width: '2.75rem',
                      height: `${value * 9}px`,
                      background: isActive ? '#4f46e5' : '#1e293b',
                      borderRadius: '0.4rem 0.4rem 0 0',
                      border: isActive ? '1px solid #818cf8' : '1px solid #334155',
                      transition: 'background 0.2s ease',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: '4px',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: isActive ? '#e0e7ff' : '#94a3b8', fontWeight: '600' }}>
                      {value}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#475569' }}>{index}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7 }}>
            <strong style={{ color: '#e2e8f0' }}>How it works — </strong>
            On each pass i, compare adjacent elements j and j+1.
            Swap if out of order. After pass i, the last i elements are in place.
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b' }}>Worst: <span style={{ color: '#f87171' }}>O(n²)</span></span>
            <span style={{ color: '#64748b' }}>Best: <span style={{ color: '#34d399' }}>O(n)</span></span>
            <span style={{ color: '#64748b' }}>Space: <span style={{ color: '#60a5fa' }}>O(1)</span></span>
          </div>
        </div>

        <div style={card}>
          <p style={cardLabel}>Steps</p>
          {history.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#475569' }}>Run a step to see actions here.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {history.map((item) => (
                <p key={item.id} style={{ fontSize: '0.78rem', color: '#94a3b8', borderLeft: '2px solid #334155', paddingLeft: '0.5rem' }}>
                  {item.text}
                </p>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
            <p style={{ ...cardLabel, marginBottom: '0.5rem' }}>Pseudocode</p>
            <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.8 }}>
              {[
                'for i from 0 to n - 2',
                '  for j from 0 to n - i - 2',
                '    if A[j] > A[j + 1]',
                '      swap A[j], A[j + 1]',
                '  end pass',
                'end',
              ].map((line, index) => (
                <div
                  key={index}
                  style={{
                    background: index === activePseudoLine ? '#1e293b' : 'transparent',
                    color: index === activePseudoLine ? '#818cf8' : '#475569',
                    padding: '1px 6px',
                    borderRadius: '3px',
                    borderLeft: index === activePseudoLine ? '2px solid #818cf8' : '2px solid transparent',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BubbleSortVisualizer;
