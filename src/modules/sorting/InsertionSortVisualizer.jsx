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
