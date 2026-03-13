import { useState } from 'react';

function ArrayVisualizer() {
  const [values, setValues] = useState([3, 7, 1, 9, 5]);
  const [inputValue, setInputValue] = useState('');

  const handleInsert = () => {
    if (inputValue.trim() === '') return;
    const next = [...values, Number(inputValue)];
    setValues(next);
    setInputValue('');
  };

  const handleReset = () => {
    setValues([3, 7, 1, 9, 5]);
    setInputValue('');
  };

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Array visualizer (very early draft)</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
          style={{ padding: '0.5rem', marginRight: '0.75rem' }}
        />
        <button onClick={handleInsert} style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
          Insert at end
        </button>
        <button onClick={handleReset} style={{ padding: '0.5rem 1rem' }}>
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
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
            <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{index}</div>
            <div style={{ fontSize: '1.1rem' }}>{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ArrayVisualizer;
