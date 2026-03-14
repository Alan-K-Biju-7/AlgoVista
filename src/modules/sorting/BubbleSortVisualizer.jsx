import { useState } from 'react';

function BubbleSortVisualizer() {
  const [values, setValues] = useState([5, 1, 4, 2, 8]);
  const [currentI, setCurrentI] = useState(null);
  const [currentJ, setCurrentJ] = useState(null);
  const [isSorted, setIsSorted] = useState(false);
  const [message, setMessage] = useState(
    'Click "Run one pass" to start walking through bubble sort.'
  );
  const [history, setHistory] = useState([]);

  const pushHistory = (text) => {
    setHistory((prev) => [
      { id: prev.length + 1, text },
      ...prev.slice(0, 9),
    ]);
  };

  const handleReset = () => {
    setValues([5, 1, 4, 2, 8]);
    setCurrentI(null);
    setCurrentJ(null);
    setIsSorted(false);
    setMessage('Click "Run one pass" to start walking through bubble sort.');
    setHistory([]);
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 20) + 1
    );
    setValues(next);
    setCurrentI(null);
    setCurrentJ(null);
    setIsSorted(false);
    setMessage('Random array generated. Click "Run one pass" to sort it slowly.');
    setHistory([]);
  };

  const runOnePass = () => {
    if (isSorted) {
      setMessage('Array already looks sorted. Reset or randomize to try again.');
      return;
    }

    const arr = [...values];
    let swapped = false;

    for (let j = 0; j < arr.length - 1; j += 1) {
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        swapped = true;
      }
    }

    setValues(arr);
    setCurrentI(null);
    setCurrentJ(null);

    if (!swapped) {
      setIsSorted(true);
      const msg = 'No swaps in this pass, so the array is now sorted.';
      setMessage(msg);
      pushHistory(msg);
    } else {
      const msg =
        'Completed one full pass over the array. Larger values are drifting to the right.';
      setMessage(msg);
      pushHistory(msg);
    }
  };

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Bubble sort visualizer (very early)</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr 2fr',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Controls */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Controls</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button onClick={handleRandomize} style={{ padding: '0.5rem 1rem' }}>
              Randomize
            </button>
            <button onClick={runOnePass} style={{ padding: '0.5rem 1rem' }}>
              Run one pass
            </button>
            <button onClick={handleReset} style={{ padding: '0.5rem 1rem' }}>
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
        </div>

        {/* Array view */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Current array</h3>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end',
              minHeight: '6rem',
            }}
          >
            {values.map((value, index) => {
              const isI = index === currentI;
              const isJ = index === currentJ;
              const background = isI || isJ ? '#1d4ed8' : '#111827';

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
              Bubble sort repeatedly walks through the array and swaps adjacent
              elements if they are in the wrong order. Large values slowly
              &quot;bubble&quot; to the end.
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

        {/* Recent steps */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Recent passes</h3>
          {history.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Run a pass to see a summary here.
            </p>
          ) : (
            <ul style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              {history.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default BubbleSortVisualizer;
