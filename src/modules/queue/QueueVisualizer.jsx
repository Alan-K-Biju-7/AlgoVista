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
