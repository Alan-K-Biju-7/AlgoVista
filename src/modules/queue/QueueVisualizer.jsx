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
