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

function InsertionSortVisualizer() {
  const [values, setValues] = useState([7, 3, 5, 2, 1]);
  const [i, setI] = useState(1);
  const [j, setJ] = useState(0);
  const [key, setKey] = useState(3);
  const [phase, setPhase] = useState('compare');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState(
    'Click "Step" to walk through insertion sort, or "Auto run" to animate.'
  );
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [shiftCount, setShiftCount] = useState(0);
  const [stepExplanation, setStepExplanation] = useState(
    'First element is treated as sorted. We now insert the next element into the left side.'
  );
  const intervalRef = useRef(null);

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const handleReset = () => {
    const base = [7, 3, 5, 2, 1];
    setValues(base);
    setI(1);
    setJ(0);
    setKey(base[1]);
    setPhase('compare');
    setIsRunning(false);
    setMessage('Array reset. Use "Step" to insert each next element.');
    setHistory([]);
    setActivePseudoLine(0);
    setComparisonCount(0);
    setShiftCount(0);
    setStepExplanation('First element is treated as sorted. We now insert the next one.');
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1);
    setValues(next);
    setI(1);
    setJ(0);
    setKey(next[1]);
    setPhase('compare');
    setIsRunning(false);
    setMessage('Random array generated. First element is the starting sorted portion.');
    setHistory([]);
    setActivePseudoLine(0);
    setComparisonCount(0);
    setShiftCount(0);
    setStepExplanation('First element is treated as sorted. We now insert the next one.');
  };

  const moveToNextElement = (arr) => {
    const n = arr.length;
    if (i + 1 >= n) {
      setPhase('done');
      setIsRunning(false);
      setMessage('Insertion sort finished. The array is fully sorted.');
      pushHistory('All elements inserted into sorted portion.');
      setActivePseudoLine(0);
      setStepExplanation('Array is sorted. No more insertions needed.');
      return;
    }
    const nextI = i + 1;
    setI(nextI);
    setKey(arr[nextI]);
    setJ(nextI - 1);
    setPhase('compare');
    setActivePseudoLine(1);
    setStepExplanation(\`Take \${arr[nextI]} as the key and insert it into the sorted left part.\`);
    pushHistory(\`Inserting index \${nextI} into sorted portion [0..\${nextI - 1}].\`);
  };

  const performStep = () => {
    if (phase === 'done') { setIsRunning(false); return; }

    setValues((prev) => {
      const arr = [...prev];

      if (phase === 'compare') {
        setActivePseudoLine(4);
        setComparisonCount((c) => c + 1);
        if (j >= 0 && arr[j] > key) {
          setActivePseudoLine(5);
          setStepExplanation(\`Since \${key} < \${arr[j]}, shift \${arr[j]} one position to the right.\`);
          arr[j + 1] = arr[j];
          setShiftCount((s) => s + 1);
          pushHistory(\`Shifted \${arr[j]} from index \${j} to \${j + 1}.\`);
          setActivePseudoLine(6);
          setJ(j - 1);
        } else {
          setActivePseudoLine(7);
          setStepExplanation(\`Place \${key} at position \${j + 1} in the sorted part.\`);
          arr[j + 1] = key;
          pushHistory(\`Inserted key \${key} at index \${j + 1}.\`);
          setPhase('insert');
        }
      } else if (phase === 'insert') {
        moveToNextElement(arr);
      }

      return arr;
    });
  };

  const handleStep = () => { if (isRunning) return; performStep(); };
  const toggleAutoRun = () => { if (phase === 'done') return; setIsRunning((prev) => !prev); };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => { performStep(); }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, i, j, phase, key, speed]);

  const isInSortedPortion = (index) => index < i || phase === 'done';
  const isKeyPosition = (index) => (phase === 'compare' || phase === 'insert') && index === i;

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '1rem' }}>
        Insertion sort
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
          <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.6 }}>{stepExplanation}</p>
          <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.8 }}>
            <div>i = {i} &nbsp;|&nbsp; j = {j} &nbsp;|&nbsp; phase = {phase}</div>
            <div>Comparisons: <span style={{ color: '#818cf8' }}>{comparisonCount}</span></div>
            <div>Shifts: <span style={{ color: '#f472b6' }}>{shiftCount}</span></div>
          </div>
        </div>

        <div style={card}>
          <p style={cardLabel}>Array</p>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', minHeight: '8rem' }}>
            {values.map((value, index) => {
              let bg = '#1e293b';
              let borderColor = '#334155';
              let textColor = '#94a3b8';

              if (isInSortedPortion(index)) { bg = '#14532d'; borderColor = '#16a34a'; textColor = '#86efac'; }
              if (index === j) { bg = '#7c2d12'; borderColor = '#f97316'; textColor = '#fdba74'; }
              if (index === j + 1 && phase === 'compare') { bg = '#1e3a5f'; borderColor = '#3b82f6'; textColor = '#93c5fd'; }
              if (isKeyPosition(index)) { bg = '#713f12'; borderColor = '#eab308'; textColor = '#fde047'; }

              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <div
                    style={{
                      width: '2.75rem',
                      height: \`\${value * 9}px\`,
                      background: bg,
                      borderRadius: '0.4rem 0.4rem 0 0',
                      border: \`1px solid \${borderColor}\`,
                      transition: 'background 0.2s ease',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: '4px',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: textColor, fontWeight: '600' }}>{value}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#475569' }}>{index}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <span>🟢 Sorted</span>
            <span>🟡 Key</span>
            <span>🟠 Comparing</span>
            <span>🔵 Insert position</span>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7 }}>
            <strong style={{ color: '#e2e8f0' }}>How it works — </strong>
            Pick the key at position i. Move j left, shifting larger elements right,
            until the correct slot for the key is found.
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b' }}>Worst: <span style={{ color: '#f87171' }}>O(n²)</span></span>
            <span style={{ color: '#64748b' }}>Best: <span style={{ color: '#34d399' }}>O(n)</span></span>
            <span style={{ color: '#64748b' }}>Space: <span style={{ color: '#60a5fa' }}>O(1)</span></span>
          </div>
        </div>
