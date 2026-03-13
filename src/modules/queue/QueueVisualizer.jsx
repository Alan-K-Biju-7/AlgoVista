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

        {/* Queue view */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #374151',
            background: '#020617',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>
            Queue view (front on the left, rear on the right)
          </h3>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              minHeight: '4rem',
              alignItems: 'center',
            }}
          >
            {items.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Queue is currently empty.
              </p>
            ) : (
              items.map((value, index) => {
                const isFront = index === 0;
                const isRear = index === items.length - 1;

                return (
                  <div
                    key={index}
                    style={{
                      minWidth: '3rem',
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      borderRadius: '0.5rem',
                      background: isFront || isRear ? '#1d4ed8' : '#111827',
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
                      {isFront && isRear
                        ? 'front / rear'
                        : isFront
                        ? 'front'
                        : isRear
                        ? 'rear'
                        : index}
                    </div>
                    <div>{value}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default QueueVisualizer;
