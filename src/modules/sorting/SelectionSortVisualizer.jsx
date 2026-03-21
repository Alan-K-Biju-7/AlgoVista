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

function SelectionSortVisualizer() {
  const [values, setValues] = useState([29, 10, 14, 37, 13, 8, 22]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(1);
  const [minIndex, setMinIndex] = useState(0);
  const [sortedUpTo, setSortedUpTo] = useState(-1);
  const [isSorted, setIsSorted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState('Click "Step" to walk through selection sort, or "Auto run" to animate.');
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const intervalRef = useRef(null);
  const stateRef = useRef({ i: 0, j: 1, minIndex: 0, values: [29, 10, 14, 37, 13, 8, 22] });

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const resetPointers = (arr) => {
    setI(0); setJ(1); setMinIndex(0); setSortedUpTo(-1);
    setIsSorted(false); setActivePseudoLine(0);
    setComparisonCount(0); setSwapCount(0);
    stateRef.current = { i: 0, j: 1, minIndex: 0, values: arr };
  };

  const handleReset = () => {
    const base = [29, 10, 14, 37, 13, 8, 22];
    setValues(base);
    resetPointers(base);
    setIsRunning(false);
    setMessage('Array reset. Click "Step" or "Auto run" to begin.');
    setHistory([]);
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 1);
    setValues(next);
    resetPointers(next);
    setIsRunning(false);
    setMessage('New array generated. Find the minimum on each pass and place it at the front.');
    setHistory([]);
  };

  const performStep = () => {
    const { i: ci, j: cj, minIndex: cMin, values: arr } = stateRef.current;
    const n = arr.length;

    if (ci >= n - 1) {
      setIsSorted(true); setIsRunning(false);
      setSortedUpTo(n - 1); setActivePseudoLine(5);
      setMessage('Selection sort complete. Every element is in its final position.');
      pushHistory('Array fully sorted.');
      return;
    }

    setActivePseudoLine(2);
    setComparisonCount((c) => c + 1);

    let nextMin = cMin;
    if (arr[cj] < arr[cMin]) {
      nextMin = cj;
      setMessage('New minimum found: ' + arr[cj] + ' at index ' + cj + '.');
      pushHistory('New min: ' + arr[cj] + ' at index ' + cj + ' (pass i = ' + ci + ').');
    } else {
      setMessage('A[' + cj + '] = ' + arr[cj] + ' is not smaller than current min ' + arr[cMin] + '. Move on.');
    }

    setMinIndex(nextMin);
    setJ(cj + 1);

    if (cj + 1 >= n - ci) {
      setActivePseudoLine(3);
      const newArr = [...arr];
      if (nextMin !== ci) {
        const tmp = newArr[ci];
        newArr[ci] = newArr[nextMin];
        newArr[nextMin] = tmp;
        setSwapCount((s) => s + 1);
        pushHistory('Swapped index ' + ci + ' (' + newArr[nextMin] + ') with index ' + nextMin + ' (' + newArr[ci] + ').');
        setMessage('Pass ' + ci + ' done. Swapped min ' + newArr[ci] + ' into position ' + ci + '.');
      } else {
        pushHistory('Pass ' + ci + ': min already at index ' + ci + ', no swap needed.');
        setMessage('Pass ' + ci + ' done. Min was already at index ' + ci + '.');
      }
      setValues(newArr);
      setSortedUpTo(ci);
      setActivePseudoLine(4);
      const nextI = ci + 1;
      const nextJ = nextI + 1;
      setI(nextI); setJ(nextJ); setMinIndex(nextI);
      stateRef.current = { i: nextI, j: nextJ, minIndex: nextI, values: newArr };
    } else {
      stateRef.current = { i: ci, j: cj + 1, minIndex: nextMin, values: arr };
    }
  };

  const handleStep = () => { if (isRunning || isSorted) return; performStep(); };
  const toggleAutoRun = () => { if (isSorted) return; setIsRunning((prev) => !prev); };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => { performStep(); }, speed);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, speed]);
