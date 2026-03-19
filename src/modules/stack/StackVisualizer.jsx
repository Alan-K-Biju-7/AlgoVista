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
