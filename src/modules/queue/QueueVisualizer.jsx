import { useState } from 'react';

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
    const msg = `Enqueued "${inputValue}" at the rear of the queue.`;
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
    const msg = `Dequeued "${frontItem}" from the front of the queue.`;
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
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>
        Queue visualizer (enqueue / dequeue)
      </h2>

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
              placeholder="value to enqueue"
              style={{ padding: '0.5rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={handleEnqueue} style={{ padding: '0.5rem 1rem' }}>
              Enqueue
            </button>
            <button onClick={handleDequeue} style={{ padding: '0.5rem 1rem' }}>
              Dequeue
            </button>
            <button onClick={handleReset} style={{ padding: '0.5rem 1rem' }}>
              Reset queue
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
      </div>
    </section>
  );
}

export default QueueVisualizer;
