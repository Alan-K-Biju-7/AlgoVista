import { useState } from 'react';

function StackVisualizer() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const pushHistory = (text) => {
    setHistory((prev) => [
      { id: prev.length + 1, text },
      ...prev.slice(0, 9),
    ]);
  };

  const handlePush = () => {
    if (inputValue.trim() === '') {
      setMessage('Please type a value before pushing onto the stack.');
      return;
    }

    const next = [...items, inputValue];
    setItems(next);
    const msg = `Pushed "${inputValue}" onto the stack.`;
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
  };

  const handlePop = () => {
    if (items.length === 0) {
      setMessage('Stack underflow: there is nothing to pop.');
      pushHistory('Tried to pop from an empty stack (underflow).');
      return;
    }

    const next = [...items];
    const popped = next.pop();
    setItems(next);
    const msg = `Popped "${popped}" from the top of the stack.`;
    setMessage(msg);
    pushHistory(msg);
  };

  const handleReset = () => {
    setItems([]);
    setInputValue('');
    setMessage('Cleared the stack back to empty.');
    setHistory([]);
  };

  const topItem = items.length > 0 ? items[items.length - 1] : null;

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Stack visualizer (push / pop)</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 2fr',
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

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>
              Value
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="value to push"
              style={{ padding: '0.5rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={handlePush} style={{ padding: '0.5rem 1rem' }}>
              Push
            </button>
            <button onClick={handlePop} style={{ padding: '0.5rem 1rem' }}>
              Pop
            </button>
            <button onClick={handleReset} style={{ padding: '0.5rem 1rem' }}>
              Reset stack
            </button>
          </div>

          {message && (
            <p
              style={{
                marginTop: '0.75rem',
                fontSize: '0.9rem',
                color: '#a5b4fc',
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* Stack view */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Stack view (top at the right)</h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '0.5rem',
              minHeight: '4rem',
            }}
          >
            {items.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Stack is currently empty.
              </p>
            ) : (
              items.map((value, index) => {
                const isTop = index === items.length - 1;
                return (
                  <div
                    key={index}
                    style={{
                      minWidth: '3rem',
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      borderRadius: '0.5rem',
                      background: isTop ? '#1d4ed8' : '#111827',
                      border: '1px solid #374151',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {isTop ? 'top' : index}
                    </div>
                    <div>{value}</div>
                  </div>
                );
              })
            )}
          </div>

          <p style={{ fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.6 }}>
            A stack is a Last In, First Out (LIFO) structure. Push adds a new
            element on top; pop removes the current top element.[web:42][web:48]
          </p>

          <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            <strong>Top element:</strong>{' '}
            {topItem == null ? 'none (stack is empty)' : `"${topItem}"`}
          </div>
        </div>

        {/* Recent operations */}
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
              Perform a push or pop to see it appear here.
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

export default StackVisualizer;
