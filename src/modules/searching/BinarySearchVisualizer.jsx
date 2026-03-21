import { useState, useEffect, useRef } from 'react';

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

function BinarySearchVisualizer() {
  const [values, setValues] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 72]);
  const [target, setTarget] = useState('');
  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);
  const [mid, setMid] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [message, setMessage] = useState('Enter a target value and click "Prepare" to set up binary search, then step through or auto run.');
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(null);
  const [comparisonCount, setComparisonCount] = useState(0);
  const intervalRef = useRef(null);
  const stateRef = useRef({ low: 0, high: 0, target: 0 });

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const clearSearch = () => {
    setLow(null); setHigh(null); setMid(null);
    setFoundIndex(null); setNotFound(false);
    setIsPrepared(false); setIsRunning(false);
    setActivePseudoLine(null); setComparisonCount(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    setValues([2, 5, 8, 12, 16, 23, 38, 45, 56, 72]);
    setTarget('');
    clearSearch();
    setMessage('Array reset. Enter a target and click "Prepare".');
    setHistory([]);
  };

  const handleRandomize = () => {
    const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 99) + 1);
    arr.sort((a, b) => a - b);
    setValues(arr);
    setTarget('');
    clearSearch();
    setMessage('New sorted array generated. Enter a target and click "Prepare".');
    setHistory([]);
  };
