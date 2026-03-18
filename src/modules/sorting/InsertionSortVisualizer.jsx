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

function InsertionSortVisualizer() {
  const [values, setValues] = useState([7, 3, 5, 2, 1]);
  const [i, setI] = useState(1);
  const [j, setJ] = useState(0);
  const [key, setKey] = useState(3);
  const [phase, setPhase] = useState('compare');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState(
    'Click "Step" to walk through insertion sort, or "Auto run" to animate.'
  );
  const [history, setHistory] = useState([]);
  const [activePseudoLine, setActivePseudoLine] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [shiftCount, setShiftCount] = useState(0);
  const [stepExplanation, setStepExplanation] = useState(
    'First element is treated as sorted. We now insert the next element into the left side.'
  );
  const intervalRef = useRef(null);

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const handleReset = () => {
    const base = [7, 3, 5, 2, 1];
    setValues(base);
    setI(1);
    setJ(0);
    setKey(base[1]);
    setPhase('compare');
    setIsRunning(false);
    setMessage('Array reset. Use "Step" to insert each next element.');
    setHistory([]);
    setActivePseudoLine(0);
    setComparisonCount(0);
    setShiftCount(0);
    setStepExplanation('First element is treated as sorted. We now insert the next one.');
  };

  const handleRandomize = () => {
    const next = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1);
    setValues(next);
    setI(1);
    setJ(0);
    setKey(next[1]);
    setPhase('compare');
    setIsRunning(false);
    setMessage('Random array generated. First element is the starting sorted portion.');
    setHistory([]);
    setActivePseudoLine(0);
    setComparisonCount(0);
    setShiftCount(0);
    setStepExplanation('First element is treated as sorted. We now insert the next one.');
  };

  const moveToNextElement = (arr) => {
    const n = arr.length;
    if (i + 1 >= n) {
      setPhase('done');
      setIsRunning(false);
      setMessage('Insertion sort finished. The array is fully sorted.');
      pushHistory('All elements inserted into sorted portion.');
      setActivePseudoLine(0);
      setStepExplanation('Array is sorted. No more insertions needed.');
      return;
    }
    const nextI = i + 1;
    setI(nextI);
    setKey(arr[nextI]);
    setJ(nextI - 1);
    setPhase('compare');
    setActivePseudoLine(1);
    setStepExplanation(\`Take \${arr[nextI]} as the key and insert it into the sorted left part.\`);
    pushHistory(\`Inserting index \${nextI} into sorted portion [0..\${nextI - 1}].\`);
  };

  const performStep = () => {
    if (phase === 'done') { setIsRunning(false); return; }

    setValues((prev) => {
      const arr = [...prev];

      if (phase === 'compare') {
        setActivePseudoLine(4);
        setComparisonCount((c) => c + 1);
        if (j >= 0 && arr[j] > key) {
          setActivePseudoLine(5);
          setStepExplanation(\`Since \${key} < \${arr[j]}, shift \${arr[j]} one position to the right.\`);
          arr[j + 1] = arr[j];
          setShiftCount((s) => s + 1);
          pushHistory(\`Shifted \${arr[j]} from index \${j} to \${j + 1}.\`);
          setActivePseudoLine(6);
          setJ(j - 1);
        } else {
          setActivePseudoLine(7);
          setStepExplanation(\`Place \${key} at position \${j + 1} in the sorted part.\`);
          arr[j + 1] = key;
          pushHistory(\`Inserted key \${key} at index \${j + 1}.\`);
          setPhase('insert');
        }
      } else if (phase === 'insert') {
        moveToNextElement(arr);
      }

      return arr;
    });
  };

  const handleStep = () => { if (isRunning) return; performStep(); };
  const toggleAutoRun = () => { if (phase === 'done') return; setIsRunning((prev) => !prev); };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => { performStep(); }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, i, j, phase, key, speed]);

  const isInSortedPortion = (index) => index < i || phase === 'done';
  const isKeyPosition = (index) => (phase === 'compare' || phase === 'insert') && index === i;
