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

function QueueVisualizer() {
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

  const handleEnqueue = () => {
    if (inputValue.trim() === '') {
      setMessage('Please type a value before enqueueing into the queue.');
      return;
    }
    const next = [...items, inputValue];
    setItems(next);
    const msg = 'Enqueued "' + inputValue + '" at the rear. Queue size: ' + next.length + '.';
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
  };

  const handleDequeue = () => {
    if (items.length === 0) {
      setMessage('Queue underflow: there is nothing to dequeue.');
      pushHistory('Tried to dequeue from an empty queue (underflow).');
      return;
    }
    const [frontItem, ...rest] = items;
    setItems(rest);
    const msg = 'Dequeued "' + frontItem + '" from the front. Remaining: ' + rest.length + '.';
    setMessage(msg);
    pushHistory(msg);
  };

  const handleReset = () => {
    setItems([]);
    setInputValue('');
    setMessage('Cleared the queue back to empty.');
    setHistory([]);
  };

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '1rem' }}>
        Queue
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
              placeholder="value to enqueue"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={handleEnqueue}>Enqueue</button>
            <button onClick={handleDequeue}>Dequeue</button>
            <button onClick={handleReset}>Reset</button>
          </div>

          {message && (
            <p style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#a5b4fc', lineHeight: 1.6 }}>
              {message}
            </p>
          )}
        </div>

        <div style={card}>
          <p style={cardLabel}>Queue view — front left, rear right</p>

          <div style={{ display: 'flex', gap: '0.5rem', minHeight: '5rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {items.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#475569' }}>Queue is currently empty.</p>
            ) : (
              items.map((value, index) => {
                const isFront = index === 0;
                const isRear = index === items.length - 1;
                const isHighlighted = isFront || isRear;

                return (
                  <div
                    key={index}
                    style={{
                      minWidth: '3rem',
                      padding: '0.6rem 0.5rem',
                      textAlign: 'center',
                      borderRadius: '0.5rem',
                      background: isFront ? '#14532d' : isRear ? '#312e81' : '#1e293b',
                      border: isFront ? '1px solid #16a34a' : isRear ? '1px solid #818cf8' : '1px solid #334155',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', color: isHighlighted ? '#a5b4fc' : '#475569', marginBottom: '0.2rem' }}>
                      {isFront && isRear ? 'front/rear' : isFront ? 'front' : isRear ? 'rear' : index}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: isHighlighted ? '#e0e7ff' : '#94a3b8' }}>
                      {value}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7 }}>
            <strong style={{ color: '#e2e8f0' }}>How it works — </strong>
            A queue is a First In, First Out (FIFO) structure. New elements join
            at the rear via enqueue and leave from the front via dequeue.
          </p>

          <div style={{ marginTop: '0.85rem', display: 'flex', gap: '1.5rem', fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b' }}>Enqueue: <span style={{ color: '#34d399' }}>O(1)</span></span>
            <span style={{ color: '#64748b' }}>Dequeue: <span style={{ color: '#34d399' }}>O(1)</span></span>
            <span style={{ color: '#64748b' }}>Peek: <span style={{ color: '#34d399' }}>O(1)</span></span>
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.82rem' }}>
            <strong style={{ color: '#e2e8f0' }}>Front: </strong>
            <span style={{ color: '#86efac' }}>
              {items.length === 0 ? 'none' : '"' + items[0] + '"'}
            </span>
            <strong style={{ color: '#e2e8f0', marginLeft: '1rem' }}>Rear: </strong>
            <span style={{ color: '#a5b4fc' }}>
              {items.length === 0 ? 'none' : '"' + items[items.length - 1] + '"'}
            </span>
          </div>
        </div>
