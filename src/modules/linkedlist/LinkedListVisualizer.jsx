import { useState, useRef } from 'react';

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

function LinkedListVisualizer() {
  const [nodes, setNodes] = useState([10, 20, 30, 40]);
  const [inputValue, setInputValue] = useState('');
  const [indexValue, setIndexValue] = useState('');
  const [message, setMessage] = useState('A linked list starts at the HEAD node. Each node holds a value and a pointer to the next node. The last node points to NULL.');
  const [history, setHistory] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [traversalIndex, setTraversalIndex] = useState(null);
  const [searchFoundIndex, setSearchFoundIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const intervalRef = useRef(null);

  const pushHistory = (text) => {
    setHistory((prev) => [{ id: prev.length + 1, text }, ...prev.slice(0, 9)]);
  };

  const handleInsertHead = () => {
    if (inputValue.trim() === '') { setMessage('Enter a value to insert at the head.'); return; }
    const val = Number(inputValue);
    setNodes((prev) => [val, ...prev]);
    const msg = 'Inserted ' + val + ' at the HEAD. It is now the first node.';
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
    setHighlightIndex(0);
    setTimeout(() => setHighlightIndex(null), 1200);
  };

  const handleInsertTail = () => {
    if (inputValue.trim() === '') { setMessage('Enter a value to insert at the tail.'); return; }
    const val = Number(inputValue);
    setNodes((prev) => {
      setHighlightIndex(prev.length);
      setTimeout(() => setHighlightIndex(null), 1200);
      return [...prev, val];
    });
    const msg = 'Inserted ' + val + ' at the TAIL. It now points to NULL.';
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
  };

  const handleInsertAt = () => {
    if (inputValue.trim() === '') { setMessage('Enter a value to insert.'); return; }
    const idx = Number(indexValue);
    if (isNaN(idx) || idx < 0 || idx > nodes.length) {
      setMessage('Index must be between 0 and ' + nodes.length + '.'); return;
    }
    const val = Number(inputValue);
    const next = [...nodes];
    next.splice(idx, 0, val);
    setNodes(next);
    const msg = 'Inserted ' + val + ' at index ' + idx + '. Previous node now points to it.';
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
    setHighlightIndex(idx);
    setTimeout(() => setHighlightIndex(null), 1200);
  };

  const handleDeleteValue = () => {
    if (inputValue.trim() === '') { setMessage('Enter a value to delete.'); return; }
    const val = Number(inputValue);
    const idx = nodes.indexOf(val);
    if (idx === -1) { setMessage('Value ' + val + ' not found in the list.'); return; }
    const next = nodes.filter((_, i) => i !== idx);
    setNodes(next);
    const msg = 'Deleted node with value ' + val + ' at index ' + idx + '. Pointers relinked.';
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
  };

  const handleDeleteAt = () => {
    const idx = Number(indexValue);
    if (isNaN(idx) || idx < 0 || idx >= nodes.length) {
      setMessage('Index must be between 0 and ' + (nodes.length - 1) + '.'); return;
    }
    const val = nodes[idx];
    const next = nodes.filter((_, i) => i !== idx);
    setNodes(next);
    const msg = 'Deleted node ' + val + ' at index ' + idx + '. Pointers relinked.';
    setMessage(msg);
    pushHistory(msg);
    setIndexValue('');
  };

  const handleReset = () => {
    setNodes([10, 20, 30, 40]);
    setInputValue('');
    setIndexValue('');
    setHighlightIndex(null);
    setTraversalIndex(null);
    setSearchFoundIndex(null);
    setIsSearching(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMessage('List reset to default. HEAD points to 10.');
    setHistory([]);
  };

  const handleSearch = () => {
    if (inputValue.trim() === '') { setMessage('Enter a value to search for.'); return; }
    if (nodes.length === 0) { setMessage('The list is empty.'); return; }
    if (isSearching) return;
    const target = Number(inputValue);
    setIsSearching(true);
    setTraversalIndex(0);
    setSearchFoundIndex(null);
    setMessage('Starting traversal from HEAD looking for ' + target + '...');
    let i = 0;
    intervalRef.current = setInterval(() => {
      setTraversalIndex(i);
      if (nodes[i] === target) {
        setSearchFoundIndex(i);
        setIsSearching(false);
        setMessage('Found ' + target + ' at index ' + i + ' after traversing ' + (i + 1) + ' node(s).');
        pushHistory('Search found ' + target + ' at index ' + i + '.');
        clearInterval(intervalRef.current);
        return;
      }
      i += 1;
      if (i >= nodes.length) {
        setIsSearching(false);
        setTraversalIndex(null);
        setMessage(target + ' was not found. Reached NULL after traversing all ' + nodes.length + ' nodes.');
        pushHistory('Search for ' + target + ' reached NULL — not found.');
        clearInterval(intervalRef.current);
      }
    }, 700);
  };

  return (
    <div>
      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '1rem' }}>
        Linked list
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 4fr', gap: '1rem', marginBottom: '1rem' }}>

        <div style={card}>
          <p style={cardLabel}>Controls</p>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.35rem', display: 'block' }}>Value</label>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="enter a number" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.35rem', display: 'block' }}>Index</label>
            <input type="number" value={indexValue} onChange={(e) => setIndexValue(e.target.value)} placeholder="0, 1, 2 ..." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button onClick={handleInsertHead}>Insert head</button>
              <button onClick={handleInsertTail}>Insert tail</button>
              <button onClick={handleInsertAt}>Insert at index</button>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button onClick={handleDeleteValue}>Delete value</button>
              <button onClick={handleDeleteAt}>Delete at index</button>
              <button onClick={handleReset}>Reset</button>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search value'}
              </button>
            </div>
          </div>
          <p style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#a5b4fc', lineHeight: 1.6 }}>{message}</p>
        </div>

        <div style={card}>
          <p style={cardLabel}>List visualization</p>
          {nodes.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#4f46e5', border: '1px solid #818cf8', fontSize: '0.82rem', color: '#e0e7ff', fontWeight: '700' }}>HEAD</div>
              <div style={{ color: '#4f46e5', fontSize: '1.2rem' }}>→</div>
              <div style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #334155', fontSize: '0.82rem', color: '#f87171', fontStyle: 'italic' }}>NULL</div>
              <p style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#475569' }}>List is empty — HEAD points directly to NULL.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '0.25rem' }}>
                  <div style={{ padding: '0.3rem 0.65rem', borderRadius: '0.4rem', background: '#4f46e5', border: '1px solid #818cf8', fontSize: '0.72rem', color: '#e0e7ff', fontWeight: '700', marginBottom: '0.3rem' }}>HEAD</div>
                  <div style={{ color: '#4f46e5', fontSize: '1.1rem' }}>↓</div>
                </div>

                {nodes.map((value, index) => {
                  const isHighlighted = index === highlightIndex;
                  const isTraversal = index === traversalIndex && searchFoundIndex === null;
                  const isFound = index === searchFoundIndex;

                  let nodeBg = '#1e293b';
                  let nodeBorder = '#334155';
                  let nodeTextColor = '#94a3b8';
                  let pointerBg = '#0f172a';
                  let pointerBorder = '#1e293b';

                  if (isHighlighted) { nodeBg = '#312e81'; nodeBorder = '#818cf8'; nodeTextColor = '#e0e7ff'; }
                  if (isTraversal)   { nodeBg = '#1e3a5f'; nodeBorder = '#3b82f6'; nodeTextColor = '#93c5fd'; pointerBg = '#1e3a5f'; pointerBorder = '#3b82f6'; }
                  if (isFound)       { nodeBg = '#14532d'; nodeBorder = '#16a34a'; nodeTextColor = '#86efac'; pointerBg = '#14532d'; pointerBorder = '#16a34a'; }

                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.6rem', color: index === 0 ? '#4f46e5' : '#475569', marginBottom: '0.2rem', fontWeight: index === 0 ? '700' : '400' }}>{index}</div>
                        <div style={{ display: 'flex', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid ' + nodeBorder, transition: 'all 0.2s ease' }}>
                          <div style={{ padding: '0.6rem 0.9rem', background: nodeBg, minWidth: '2.8rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#475569', marginBottom: '0.2rem' }}>val</div>
                            <div style={{ fontSize: '1rem', fontWeight: '700', color: nodeTextColor }}>{value}</div>
                          </div>
                          <div style={{ padding: '0.6rem 0.5rem', background: pointerBg, borderLeft: '1px solid ' + pointerBorder, minWidth: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.6rem', color: '#475569', marginBottom: '0.15rem' }}>next</div>
                            <div style={{ fontSize: '0.75rem', color: index === nodes.length - 1 ? '#f87171' : '#60a5fa' }}>
                              {index === nodes.length - 1 ? '∅' : '→'}
                            </div>
                          </div>
                        </div>
                        {isTraversal && <div style={{ fontSize: '0.65rem', color: '#60a5fa', marginTop: '0.3rem', fontWeight: '600' }}>◀ curr</div>}
                        {isFound && <div style={{ fontSize: '0.65rem', color: '#4ade80', marginTop: '0.3rem', fontWeight: '600' }}>✓ found</div>}
                      </div>
                      {index < nodes.length - 1 && (
                        <div style={{ color: '#334155', fontSize: '1.3rem', margin: '0 0.1rem', marginTop: '-1rem' }}>→</div>
                      )}
                    </div>
                  );
                })}

                <div style={{ color: '#334155', fontSize: '1.3rem', margin: '0 0.1rem', marginTop: '-1rem' }}>→</div>
                <div style={{ padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', fontSize: '0.82rem', color: '#f87171', fontStyle: 'italic', fontWeight: '600' }}>NULL</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={card}>
          <p style={cardLabel}>How a linked list works</p>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.8 }}>
            Each <strong style={{ color: '#e2e8f0' }}>node</strong> stores a value and a <strong style={{ color: '#e2e8f0' }}>next pointer</strong> to the following node.
            The list starts at the <strong style={{ color: '#818cf8' }}>HEAD</strong> pointer. The last node's next pointer is <strong style={{ color: '#f87171' }}>NULL</strong>, marking the end.
            Unlike arrays, nodes are not stored contiguously — you must traverse from HEAD to reach any node.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b' }}>Insert head: <span style={{ color: '#34d399' }}>O(1)</span></span>
            <span style={{ color: '#64748b' }}>Insert tail: <span style={{ color: '#fbbf24' }}>O(n)</span></span>
            <span style={{ color: '#64748b' }}>Delete: <span style={{ color: '#fbbf24' }}>O(n)</span></span>
            <span style={{ color: '#64748b' }}>Search: <span style={{ color: '#f87171' }}>O(n)</span></span>
            <span style={{ color: '#64748b' }}>Space: <span style={{ color: '#60a5fa' }}>O(n)</span></span>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <span>🟣 HEAD</span>
            <span>🔵 Traversal pointer</span>
            <span>🟢 Found</span>
            <span>🟤 Newly inserted</span>
            <span style={{ color: '#f87171' }}>∅ NULL</span>
          </div>
        </div>

        <div style={card}>
          <p style={cardLabel}>Pseudocode — traversal / search</p>
          <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.9 }}>
            {[
              'curr = HEAD',
              'while curr != NULL:',
              '  if curr.val == target:',
              '    return curr   // found',
              '  curr = curr.next',
              'return NULL       // not found',
            ].map((line, index) => {
              const isActive = isSearching && traversalIndex !== null && index === 1;
              return (
                <div key={index} style={{ background: isActive ? '#1e293b' : 'transparent', color: isActive ? '#818cf8' : '#475569', padding: '1px 6px', borderRadius: '3px', borderLeft: isActive ? '2px solid #818cf8' : '2px solid transparent' }}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <div style={card}>
          <p style={cardLabel}>Recent steps</p>
          {history.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#475569' }}>Operations will appear here as you interact with the list.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {history.map((item) => (
                <p key={item.id} style={{ fontSize: '0.78rem', color: '#94a3b8', borderLeft: '2px solid #334155', paddingLeft: '0.5rem', lineHeight: 1.6 }}>
                  {item.text}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LinkedListVisualizer;

  const handleInsertTail = () => {
    if (inputValue.trim() === '') { setMessage('Enter a value to insert at the tail.'); return; }
    const val = Number(inputValue);
    setNodes((prev) => [...prev, val]);
    const msg = 'Inserted ' + val + ' at the TAIL. It now points to NULL.';
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
    setHighlightIndex(nodes.length);
    setTimeout(() => setHighlightIndex(null), 1200);
  };

  const handleInsertAt = () => {
    if (inputValue.trim() === '') { setMessage('Enter a value to insert.'); return; }
    const idx = Number(indexValue);
    if (isNaN(idx) || idx < 0 || idx > nodes.length) {
      setMessage('Index must be between 0 and ' + nodes.length + '.');
      return;
    }
    const val = Number(inputValue);
    const next = [...nodes];
    next.splice(idx, 0, val);
    setNodes(next);
    const msg = 'Inserted ' + val + ' at index ' + idx + '. Previous node now points to it.';
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
    setHighlightIndex(idx);
    setTimeout(() => setHighlightIndex(null), 1200);
  };

  const handleDeleteValue = () => {
    if (inputValue.trim() === '') { setMessage('Enter a value to delete.'); return; }
    const val = Number(inputValue);
    const idx = nodes.indexOf(val);
    if (idx === -1) { setMessage('Value ' + val + ' not found in the list.'); return; }
    const next = nodes.filter((_, i) => i !== idx);
    setNodes(next);
    const msg = 'Deleted node with value ' + val + ' at index ' + idx + '. Pointers relinked.';
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
  };

  const handleDeleteAt = () => {
    const idx = Number(indexValue);
    if (isNaN(idx) || idx < 0 || idx >= nodes.length) {
      setMessage('Index must be between 0 and ' + (nodes.length - 1) + '.');
      return;
    }
    const val = nodes[idx];
    const next = nodes.filter((_, i) => i !== idx);
    setNodes(next);
    const msg = 'Deleted node ' + val + ' at index ' + idx + '. Pointers relinked.';
    setMessage(msg);
    pushHistory(msg);
    setIndexValue('');
  };

  const handleReset = () => {
    setNodes([10, 20, 30, 40]);
    setInputValue('');
    setIndexValue('');
    setHighlightIndex(null);
    setTraversalIndex(null);
    setSearchFoundIndex(null);
    setIsSearching(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMessage('List reset to default. HEAD points to 10.');
    setHistory([]);
  };
