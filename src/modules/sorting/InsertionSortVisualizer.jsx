import { useState, useEffect, useRef } from 'react';

function InsertionSortVisualizer() {
  const [values, setValues] = useState([7, 3, 5, 2, 1]);
  const [i, setI] = useState(1);
  const [j, setJ] = useState(0);
  const [key, setKey] = useState(3);
  const [phase, setPhase] = useState('compare');
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Click "Step" to walk through insertion sort, or "Auto run" to animate.'
  );
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [shiftCount, setShiftCount] = useState(0);
  const intervalRef = useRef(null);

  const pushHistory = (text) => {
    setHistory((prev) => [
      { id: prev.length + 1, text },
      ...prev.slice(0, 9),
    ]);
  };

  const handleReset = () => {
    const base = [7, 3, 5, 2, 1];
    setValues(base);
    setI(1);
    setJ(0);
    setKey(base[1]);
    setPhase('compare');
    setIsRunning(false);
    setMessage(
      'Array reset. First element is treated as sorted. Use "Step" to insert each next element.'
    );
    setHistory([]);
    setActivePseudoLine(0);
    setComparisonCount(0);
    setShiftCount(0);
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 20) + 1
    );
    setValues(next);
    setI(1);
    setJ(0);
    setKey(next[1]);
    setPhase('compare');
    setIsRunning(false);
    setMessage(
      'Random array generated. First element is the starting sorted portion.'
    );
    setHistory([]);
    setActivePseudoLine(0);
    setComparisonCount(0);
    setShiftCount(0);
  };

  const moveToNextElement = (arr) => {
    const n = arr.length;
    if (i + 1 >= n) {
      setPhase('done');
      setIsRunning(false);
      setMessage('Insertion sort finished. The array is fully sorted.');
      pushHistory('All elements have been inserted into the sorted portion.');
      setActivePseudoLine(0);
      return;
    }

    const nextI = i + 1;
    setI(nextI);
    setKey(arr[nextI]);
    setJ(nextI - 1);
    setPhase('compare');
    setActivePseudoLine(1);
    pushHistory(
      `Now inserting element at index ${nextI} into the sorted portion [0..${nextI - 1}].`
    );
  };

  const performStep = () => {
    if (phase === 'done') {
      setIsRunning(false);
      return;
    }

    setValues((prev) => {
      const arr = [...prev];

      if (phase === 'compare') {
        setActivePseudoLine(4);
        setComparisonCount((c) => c + 1);
        if (j >= 0 && arr[j] > key) {
          setActivePseudoLine(5);
          arr[j + 1] = arr[j];
          setShiftCount((s) => s + 1);
          pushHistory(`Shifted value ${arr[j]} from index ${j} to index ${j + 1}.`);
          setActivePseudoLine(6);
          setJ(j - 1);
        } else {
          setActivePseudoLine(7);
          arr[j + 1] = key;
          pushHistory(`Inserted key ${key} at index ${j + 1}.`);
          setPhase('insert');
        }
      } else if (phase === 'insert') {
        moveToNextElement(arr);
      }

      return arr;
    });
  };

  const handleStep = () => {
    if (isRunning) return;
    performStep();
  };

  const toggleAutoRun = () => {
    if (phase === 'done') return;
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        performStep();
      }, 500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, i, j, phase, key]);

  const isInSortedPortion = (index) => index < i || phase === 'done';
  const isKeyPosition = (index) =>
    (phase === 'compare' || phase === 'insert') && index === i;

  return (
    <section style={{ marginTop: '1rem' }}>
      <h2 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>
        Insertion sort visualizer
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr 2fr',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Controls</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              onClick={handleRandomize}
              disabled={isRunning}
              style={{ padding: '0.5rem 1rem', opacity: isRunning ? 0.6 : 1 }}
            >
              Randomize
            </button>
            <button
              onClick={handleStep}
              disabled={isRunning}
              style={{ padding: '0.5rem 1rem', opacity: isRunning ? 0.6 : 1 }}
            >
              Step
            </button>
            <button
              onClick={toggleAutoRun}
              style={{ padding: '0.5rem 1rem' }}
            >
              {isRunning ? 'Pause' : 'Auto run'}
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              style={{ padding: '0.5rem 1rem', opacity: isRunning ? 0.6 : 1 }}
            >
              Reset
            </button>
          </div>
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.9rem',
              color: '#a5b4fc',
            }}
          >
            {message}
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
            Current i = {i}, j = {j}, phase = {phase}
          </p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#9ca3af' }}>
            Comparisons: {comparisonCount}, Shifts: {shiftCount}
          </p>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Current array</h3>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end',
              minHeight: '6rem',
            }}
          >
            {values.map((value, index) => {
              let background = '#111827';

              if (isInSortedPortion(index)) {
                background = '#16a34a';
              }
              if (index === j) {
                background = '#f97316';
              }
              if (index === j + 1 && phase === 'compare') {
                background = '#1d4ed8';
              }
              if (isKeyPosition(index)) {
                background = '#eab308';
              }

              return (
                <div
                  key={index}
                  style={{
                    minWidth: '2.5rem',
                    height: `${value * 6}px`,
                    background,
                    borderRadius: '0.5rem 0.5rem 0 0',
                    border: '1px solid #374151',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    color: '#e5e7eb',
                    fontSize: '0.8rem',
                  }}
                >
                  {value}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            <strong>Insertion sort idea</strong>
            <p style={{ marginTop: '0.25rem', lineHeight: 1.6 }}>
              We treat the left part of the array as sorted and repeatedly take
              the next element (key) from the right, shifting larger elements to
              the right until we find the correct spot for the key.
            </p>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            <strong>Time complexity (insertion sort)</strong>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: '1.5rem',
                marginTop: '0.5rem',
                lineHeight: 1.6,
              }}
            >
              <li>Worst / average: O(n²)</li>
              <li>Best (already sorted): O(n)</li>
              <li>Space: O(1) extra</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Recent steps</h3>
          {history.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Click "Step" or "Auto run" to see actions here.
            </p>
          ) : (
            <ul style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              {history.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          )}

          <div
            style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #374151',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Pseudocode</h3>
            <pre
              style={{
                fontSize: '0.8rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              <code>
                {[
                  'for i from 1 to n - 1',
                  '  key = A[i]',
                  '  j = i - 1',
                  '  while j >= 0 and A[j] > key',
                  '    A[j + 1] = A[j]',
                  '    j = j - 1',
                  '  A[j + 1] = key',
                ].map((line, index) => {
                  const lineNumber = index + 1;
                  const isActive = lineNumber === activePseudoLine;
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: isActive ? '#1f2937' : 'transparent',
                        padding: '2px 4px',
                        borderRadius: '4px',
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InsertionSortVisualizer;
