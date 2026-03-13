import { useState } from 'react';

function ArrayVisualizer() {
  const [values, setValues] = useState([3, 7, 1, 9, 5]);
  const [inputValue, setInputValue] = useState('');
  const [indexValue, setIndexValue] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const resetMessage = () => setMessage('');

  const pushHistory = (text) => {
    setHistory((prev) => [
      { id: prev.length + 1, text },
      ...prev.slice(0, 9), // keep last 10 actions
    ]);
  };

  const handleInsert = () => {
    resetMessage();

    if (inputValue.trim() === '') {
      setMessage('Please enter a number to insert.');
      return;
    }

    const next = [...values, Number(inputValue)];
    setValues(next);
    const msg = `Inserted ${Number(inputValue)} at index ${next.length - 1}.`;
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
  };

  const handleUpdate = () => {
    resetMessage();

    const idx = Number(indexValue);
    if (Number.isNaN(idx) || idx < 0 || idx >= values.length) {
      setMessage('Please enter a valid index inside the array range.');
      return;
    }
    if (inputValue.trim() === '') {
      setMessage('Please enter a new value to write at that index.');
      return;
    }

    const next = [...values];
    const old = next[idx];
    next[idx] = Number(inputValue);
    setValues(next);
    const msg = `Updated index ${idx} from ${old} to ${Number(inputValue)}.`;
    setMessage(msg);
    pushHistory(msg);
  };

  const handleDelete = () => {
    resetMessage();

    const idx = Number(indexValue);
    if (Number.isNaN(idx) || idx < 0 || idx >= values.length) {
      setMessage('Please enter a valid index to delete.');
      return;
    }

    const deleted = values[idx];
    const next = values.filter((_, i) => i !== idx);
    setValues(next);
    const msg = `Deleted value ${deleted} at index ${idx}.`;
    setMessage(msg);
    pushHistory(msg);
  };

  const handleReset = () => {
    setValues([3, 7, 1, 9, 5]);
    setInputValue('');
    setIndexValue('');
    const msg = 'Reset the array back to its starting state.';
    setMessage(msg);
    setHistory([]);
  };

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Array visualizer (early draft)</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr 2fr',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Controls panel */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Controls</h3>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>
              Value
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="number"
              style={{ padding: '0.5rem', width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>
              Index
            </label>
            <input
              type="number"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
              placeholder="0, 1, 2..."
              style={{ padding: '0.5rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button onClick={handleInsert} style={{ padding: '0.5rem 1rem' }}>
              Insert at end
            </button>
            <button onClick={handleUpdate} style={{ padding: '0.5rem 1rem' }}>
              Update at index
            </button>
            <button onClick={handleDelete} style={{ padding: '0.5rem 1rem' }}>
              Delete at index
            </button>
            <button onClick={handleReset} style={{ padding: '0.5rem 1rem' }}>
              Reset array
            </button>
          </div>

          {message && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#a5b4fc' }}>
              {message}
            </p>
          )}
        </div>

        {/* Array + explanation panel */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Array view</h3>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {values.map((value, index) => (
              <div
                key={index}
                style={{
                  minWidth: '3rem',
                  padding: '0.75rem 0.5rem',
                  textAlign: 'center',
                  borderRadius: '0.5rem',
                  background: '#111827',
                  border: '1px solid #374151',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{index}</div>
                <div style={{ fontSize: '1.1rem' }}>{value}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
            This is a simple fixed-order array. Insert adds a new value at the end,
            update overwrites the value at a given index, and delete removes the
            element at that index and shifts everything after it to the left.
          </p>
        </div>

        {/* History panel */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Recent steps</h3>
          {history.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Perform an operation to see it appear here.
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

export default ArrayVisualizer;
