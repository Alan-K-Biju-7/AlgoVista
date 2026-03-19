import { useState } from 'react';

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
    const msg = 'Pushed "' + inputValue + '" onto the stack. New size: ' + next.length + '.';
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
    const msg = 'Popped "' + popped + '" from the top. Remaining size: ' + next.length + '.';
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
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '1rem' }}>
        Stack
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1.8fr', gap: '1rem' }}>

        <div style={card}>
          <p style={cardLabel}>Controls</p>

          <div style={{ marginBottom: '0.85rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.4rem', display: 'block' }}>
              Value
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="value to push"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={handlePush}>Push</button>
            <button onClick={handlePop}>Pop</button>
            <button onClick={handleReset}>Reset</button>
          </div>

          {message && (
            <p style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#a5b4fc', lineHeight: 1.6 }}>
              {message}
            </p>
          )}
        </div>

        <div style={card}>
          <p style={cardLabel}>Stack view — top at the right</p>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', minHeight: '5rem', marginBottom: '1.25rem' }}>
            {items.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#475569' }}>Stack is currently empty.</p>
            ) : (
              items.map((value, index) => {
                const isTop = index === items.length - 1;
                return (
                  <div
                    key={index}
                    style={{
                      minWidth: '3rem',
                      padding: '0.6rem 0.5rem',
                      textAlign: 'center',
                      borderRadius: '0.5rem',
                      background: isTop ? '#312e81' : '#1e293b',
                      border: isTop ? '1px solid #818cf8' : '1px solid #334155',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', color: isTop ? '#a5b4fc' : '#475569', marginBottom: '0.2rem' }}>
                      {isTop ? 'top' : index}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: isTop ? '#e0e7ff' : '#94a3b8' }}>
                      {value}
                    </div>
                  </div>
                );
              })
            )}
          </div>
