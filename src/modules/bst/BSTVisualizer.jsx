import { useState } from 'react';
import { buildFromArray, insert, deleteNode, search, inorder, preorder, postorder, cloneTree } from './bstLogic';
import BSTCanvas from './BSTCanvas';
import BSTControls from './BSTControls';
import BSTInfo from './BSTInfo';
import BSTHistory from './BSTHistory';

const DEFAULT_VALS = [40, 20, 60, 10, 30, 50, 70];

export default function BSTVisualizer() {
  const [root, setRoot] = useState(() => buildFromArray(DEFAULT_VALS));
  const [inputVal, setInputVal] = useState('');
  const [highlightPath, setHighlightPath] = useState([]);
  const [foundVal, setFoundVal] = useState(null);
  const [deletedVal, setDeletedVal] = useState(null);
  const [message, setMessage] = useState('A balanced BST with 7 nodes. Left child < parent < right child at every level.');
  const [history, setHistory] = useState([]);
  const [traversalResult, setTraversalResult] = useState([]);
  const [traversalType, setTraversalType] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const pushHistory = (type, text) =>
    setHistory((prev) => [{ id: Date.now(), type, text }, ...prev.slice(0, 19)]);

  const clearHighlights = () => {
    setHighlightPath([]);
    setFoundVal(null);
    setDeletedVal(null);
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
    const newRoot = insert(cloneTree(root), v);
    setRoot(newRoot);
    const msg = `Inserted ${v}. Traversed from root, placed as ${v} ${v < 40 ? 'left' : 'right'} descendant.`;
    setMessage(msg);
    pushHistory('insert', msg);
    setHighlightPath([v]);
    setInputVal('');
    setTimeout(() => setHighlightPath([]), 1400);
  };

  const handleSearch = () => {
    const v = getVal(); if (v === null) return;
    if (isSearching) return;
    clearHighlights();
    setIsSearching(true);
    const { found, path } = search(root, v);
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
          const msg = `${v} not found. Searched path: ${path.join(' → ')} → NULL`;
          setMessage(msg);
          pushHistory('search', msg);
        }
      }
    }, 500);
  };

  const handleDelete = () => {
    const v = getVal(); if (v === null) return;
    const { found } = search(root, v);
    if (!found) { setMessage(`${v} is not in the tree — nothing to delete.`); return; }
    clearHighlights();
    setDeletedVal(v);
    setTimeout(() => {
      const newRoot = deleteNode(cloneTree(root), v);
      setRoot(newRoot);
      setDeletedVal(null);
      const msg = `Deleted ${v}. BST property maintained — successor used if node had two children.`;
      setMessage(msg);
      pushHistory('delete', msg);
    }, 700);
    setInputVal('');
  };

  const handleReset = () => {
    clearHighlights();
    setRoot(buildFromArray(DEFAULT_VALS));
    setInputVal('');
    setMessage('Tree reset to default balanced BST with 7 nodes.');
    pushHistory('reset', 'Tree reset to default.');
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
    const msg = `${type} traversal: ${result.join(', ')}`;
    setMessage(msg);
    pushHistory('traversal', msg);
    let step = 0;
    const interval = setInterval(() => {
      setHighlightPath(result.slice(0, step + 1));
      step++;
      if (step > result.length) clearInterval(interval);
    }, 350);
  };

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '1rem' }}>Binary Search Tree</p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <BSTControls
          inputVal={inputVal} setInputVal={setInputVal}
          onInsert={handleInsert} onDelete={handleDelete}
          onSearch={handleSearch} onReset={handleReset}
          onInorder={() => runTraversal('Inorder')}
          onPreorder={() => runTraversal('Preorder')}
          onPostorder={() => runTraversal('Postorder')}
          isSearching={isSearching} message={message}
        />
        <BSTCanvas root={root} highlightPath={highlightPath} foundVal={foundVal} deletedVal={deletedVal} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1rem' }}>
        <BSTInfo traversalResult={traversalResult} traversalType={traversalType} />
        <BSTHistory history={history} />
      </div>
    </div>
  );
}
