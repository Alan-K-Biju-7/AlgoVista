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
