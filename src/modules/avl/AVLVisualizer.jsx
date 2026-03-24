import { useState } from 'react';
import { cloneAVL, buildAVLFromArray } from './avlUtils';
import { avlInsert } from './avlInsert';
import { avlDelete } from './avlDelete';
import { avlSearch, inorder, preorder, postorder } from './avlTraversals';
import AVLCanvas from './AVLCanvas';
import AVLControls from './AVLControls';
import AVLRotationPanel from './AVLRotationPanel';
import AVLInfo from './AVLInfo';
import AVLHistory from './AVLHistory';

const DEFAULT_VALS = [30, 20, 40, 10, 25, 35, 50];

export default function AVLVisualizer() {
  const [root,            setRoot]            = useState(() => buildAVLFromArray(DEFAULT_VALS));
  const [inputVal,        setInputVal]        = useState('');
  const [highlightPath,   setHighlightPath]   = useState([]);
  const [foundVal,        setFoundVal]        = useState(null);
  const [deletedVal,      setDeletedVal]      = useState(null);
  const [rotatedVals,     setRotatedVals]     = useState([]);
  const [lastRotation,    setLastRotation]    = useState(null);
  const [message,         setMessage]         = useState('A balanced AVL tree. Every node shows its balance factor (bf = left height − right height).');
  const [history,         setHistory]         = useState([]);
  const [traversalResult, setTraversalResult] = useState([]);
  const [traversalType,   setTraversalType]   = useState('');
  const [isSearching,     setIsSearching]     = useState(false);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now() + Math.random(), type, text }, ...prev.slice(0, 24)]);

  const clearHighlights = () => {
    setHighlightPath([]);
    setFoundVal(null);
    setDeletedVal(null);
    setRotatedVals([]);
    setTraversalResult([]);
    setTraversalType('');
  };

  const getVal = () => {
    const v = Number(inputVal);
    if (inputVal.trim() === '' || isNaN(v)) { setMessage('Enter a valid integer first.'); return null; }
    return v;
  };

  const handleInsert = () => {
    const v = getVal(); if (v === null) return;
    clearHighlights();
    const rotLog = [];
    const newRoot = avlInsert(cloneAVL(root), v, rotLog);
    setRoot(newRoot);
    setInputVal('');
    setHighlightPath([v]);
    if (rotLog.length > 0) {
      const last = rotLog[rotLog.length - 1];
      setLastRotation(last);
      setRotatedVals([last.pivot]);
      const msg = `Inserted ${v}. Triggered ${last.type} rotation at node ${last.pivot}.`;
      setMessage(msg);
      pushHistory('insert', msg);
      pushHistory('rotation', last.description);
    } else {
      const msg = `Inserted ${v}. Tree remained balanced — no rotation needed.`;
      setMessage(msg);
      pushHistory('insert', msg);
    }
    setTimeout(() => { setHighlightPath([]); setRotatedVals([]); }, 1600);
  };

  const handleSearch = () => {
    const v = getVal(); if (v === null) return;
    if (isSearching) return;
    clearHighlights();
    setIsSearching(true);
    const { found, path } = avlSearch(root, v);
    let step = 0;
    const interval = setInterval(() => {
      setHighlightPath(path.slice(0, step + 1));
      step++;
      if (step >= path.length) {
        clearInterval(interval);
        setIsSearching(false);
        if (found) {
          setFoundVal(v);
          const msg = `Found ${v} after visiting ${path.length} node(s): ${path.join(' → ')}`;
          setMessage(msg);
          pushHistory('search', msg);
        } else {
          const msg = `${v} not found. Path: ${path.join(' → ')} → NULL`;
          setMessage(msg);
          pushHistory('search', msg);
        }
      }
    }, 480);
  };

  const handleDelete = () => {
    const v = getVal(); if (v === null) return;
    const { found } = avlSearch(root, v);
    if (!found) { setMessage(`${v} is not in the tree.`); return; }
    clearHighlights();
    setDeletedVal(v);
    setTimeout(() => {
      const rotLog = [];
      const newRoot = avlDelete(cloneAVL(root), v, rotLog);
      setRoot(newRoot);
      setDeletedVal(null);
      setInputVal('');
      if (rotLog.length > 0) {
        const last = rotLog[rotLog.length - 1];
        setLastRotation(last);
        const msg = `Deleted ${v}. Triggered ${last.type} rotation at node ${last.pivot} to rebalance.`;
        setMessage(msg);
        pushHistory('delete', msg);
        pushHistory('rotation', last.description);
      } else {
        const msg = `Deleted ${v}. Tree remained balanced — no rotation needed.`;
        setMessage(msg);
        pushHistory('delete', msg);
      }
    }, 700);
  };

  const handleReset = () => {
    clearHighlights();
    setRoot(buildAVLFromArray(DEFAULT_VALS));
    setInputVal('');
    setLastRotation(null);
    setMessage('Tree reset to default balanced AVL tree with 7 nodes.');
    setHistory([]);
  };

  const runTraversal = (type) => {
    clearHighlights();
    let result = [];
    if (type === 'Inorder')   result = inorder(root);
    if (type === 'Preorder')  result = preorder(root);
    if (type === 'Postorder') result = postorder(root);
    setTraversalResult(result);
    setTraversalType(type);
    const msg = `${type}: ${result.join(', ')}`;
    setMessage(msg);
    pushHistory('traversal', msg);
    let step = 0;
    const interval = setInterval(() => {
      setHighlightPath(result.slice(0, step + 1));
      step++;
      if (step > result.length) clearInterval(interval);
    }, 320);
  };

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>AVL Tree</p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <AVLControls
          inputVal={inputVal} setInputVal={setInputVal}
          onInsert={handleInsert} onDelete={handleDelete}
          onSearch={handleSearch} onReset={handleReset}
          onInorder={() => runTraversal('Inorder')}
          onPreorder={() => runTraversal('Preorder')}
          onPostorder={() => runTraversal('Postorder')}
          isSearching={isSearching} message={message}
        />
        <AVLCanvas
          root={root}
          highlightPath={highlightPath}
          foundVal={foundVal}
          deletedVal={deletedVal}
          rotatedVals={rotatedVals}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 220px', gap: '1rem' }}>
        <AVLInfo traversalResult={traversalResult} traversalType={traversalType} />
        <AVLRotationPanel lastRotation={lastRotation} />
        <AVLHistory history={history} />
      </div>
    </div>
  );
}
