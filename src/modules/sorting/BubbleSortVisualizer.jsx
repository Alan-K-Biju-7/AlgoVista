import { useState, useEffect, useRef } from 'react';

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
    setHistory((prev) => [
      { id: prev.length + 1, text },
      ...prev.slice(0, 9),
    ]);
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
    setMessage(
      'Array reset. Click "Step" or "Auto run" to walk through bubble sort.'
    );
    setHistory([]);
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 20) + 1
    );
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
  }, [isRunning, i, j]);

  return (
    <section style={{ marginTop: '1rem' }}>
      <h2 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>
        Bubble sort visualizer
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
            Current pass i = {i}, comparison j = {j}
          </p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#9ca3af' }}>
            Comparisons: {comparisonCount}, Swaps: {swapCount}
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
              const isJ = index === j || index === j + 1;
              const background = isJ ? '#1d4ed8' : '#111827';

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
            <strong>Bubble sort idea</strong>
            <p style={{ marginTop: '0.25rem', lineHeight: 1.6 }}>
              On each pass i, we walk with j from 0 up to n - i - 2 and compare
              adjacent elements. Large elements bubble toward the end; after each pass,
              the last i elements are in their final position.
            </p>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            <strong>Time complexity (bubble sort)</strong>
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
                  'for i from 0 to n - 2',
                  '  for j from 0 to n - i - 2',
                  '    if A[j] > A[j + 1]',
                  '      swap A[j], A[j + 1]',
                  '  end inner loop (one pass done)',
                  'end outer loop',
                ].map((line, index) => {
                  const isActive = index === activePseudoLine;
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

export default BubbleSortVisualizer;
