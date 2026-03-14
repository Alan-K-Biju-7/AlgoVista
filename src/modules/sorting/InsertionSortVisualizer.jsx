import { useState, useEffect, useRef } from 'react';

function InsertionSortVisualizer() {
  const [values, setValues] = useState([7, 3, 5, 2, 1]);
  const [i, setI] = useState(1); // current index being inserted
  const [j, setJ] = useState(0); // scan index in sorted portion
  const [key, setKey] = useState(3);
  const [phase, setPhase] = useState('compare'); // 'compare' | 'insert' | 'done'
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Click "Step" to walk through insertion sort, or "Auto run" to animate.'
  );
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  const pushHistory = (text) => {
    setHistory((prev) => [
      { id: prev.length + 1, text },
      ...prev.slice(0, 9),
    ]);
  };
  const handleReset = () => {
    const base = [7, 3, 5, 2, 1];
    setValues(base);
    setI(1);
    setJ(0);
    setKey(base[1]);
    setPhase('compare');
    setIsRunning(false);
    setMessage(
      'Array reset. First element is treated as sorted. Use "Step" to insert each next element.'
    );
    setHistory([]);
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 20) + 1
    );
    setValues(next);
    setI(1);
    setJ(0);
    setKey(next[1]);
    setPhase('compare');
    setIsRunning(false);
    setMessage(
      'Random array generated. First element is the starting sorted portion.'
    );
    setHistory([]);
  };
