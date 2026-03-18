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

function BubbleSortVisualizer() {
  const [values, setValues] = useState([5, 1, 4, 2, 8]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState(
    'Click "Step" to move one comparison at a time, or "Auto run" to animate.'
  );
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const intervalRef = useRef(null);

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const resetPointers = () => {
    setI(0);
    setJ(0);
    setIsSorted(false);
    setActivePseudoLine(0);
    setComparisonCount(0);
    setSwapCount(0);
  };

  const handleReset = () => {
    setValues([5, 1, 4, 2, 8]);
    resetPointers();
    setIsRunning(false);
    setMessage('Array reset. Click "Step" or "Auto run" to walk through bubble sort.');
    setHistory([]);
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1);
    setValues(next);
    resetPointers();
    setIsRunning(false);
    setMessage('Random array generated. Click "Step" to start sorting.');
    setHistory([]);
  };

  const performStep = () => {
    if (isSorted) {
      setIsRunning(false);
      setMessage('Array is fully sorted. Reset or randomize to try again.');
      return;
    }

    setActivePseudoLine(2);
    setValues((prev) => {
      const arr = [...prev];
      setActivePseudoLine(3);
      setComparisonCount((c) => c + 1);
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        setSwapCount((s) => s + 1);
        pushHistory(\`Swapped positions \${j} and \${j + 1}.\`);
      } else {
        pushHistory(\`No swap needed for positions \${j} and \${j + 1}.\`);
      }

      let nextI = i;
      let nextJ = j + 1;

      if (nextJ >= arr.length - nextI - 1) {
        setActivePseudoLine(4);
        nextI += 1;
        nextJ = 0;
        pushHistory(\`Completed pass i = \${nextI - 1}.\`);
        if (nextI >= arr.length - 1) {
          setActivePseudoLine(5);
          setIsSorted(true);
          setIsRunning(false);
          setMessage('Bubble sort finished. Array is sorted.');
          pushHistory('Array is sorted; no more passes needed.');
        }
      }

      setI(nextI);
      setJ(nextJ);
      return arr;
    });
  };

  const handleStep = () => { if (isRunning) return; performStep(); };
  const toggleAutoRun = () => { if (isSorted) return; setIsRunning((prev) => !prev); };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => { performStep(); }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, i, j, speed]);
