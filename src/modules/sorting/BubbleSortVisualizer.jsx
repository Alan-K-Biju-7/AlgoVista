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
