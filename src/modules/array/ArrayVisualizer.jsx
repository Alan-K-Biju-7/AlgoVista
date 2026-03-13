import { useState } from 'react';
import ArrayControls from '../../components/visualizer/ArrayControls';
import ArrayView from '../../components/visualizer/ArrayView';
import ArrayHistory from '../../components/visualizer/ArrayHistory';

function ArrayVisualizer() {
  const [values, setValues] = useState([3, 7, 1, 9, 5]);
  const [inputValue, setInputValue] = useState('');
  const [indexValue, setIndexValue] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentSearchIndex, setCurrentSearchIndex] = useState(null);
  const [searchFoundIndex, setSearchFoundIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);


  const resetMessage = () => setMessage('');

  const pushHistory = (text) => {
    setHistory((prev) => [
      { id: prev.length + 1, text },
      ...prev.slice(0, 9),
    ]);
  };

  const handleInsert = () => {
    resetMessage();
    if (inputValue.trim() === '') {
      setMessage('Please enter a number to insert.');
      return;
    }
    const next = [...values, Number(inputValue)];
    setValues(next);
    const msg = `Inserted ${Number(inputValue)} at index ${next.length - 1}.`;
    setMessage(msg);
    pushHistory(msg);
    setInputValue('');
  };

  const handleUpdate = () => {
    resetMessage();
    const idx = Number(indexValue);
    if (Number.isNaN(idx) || idx < 0 || idx >= values.length) {
      setMessage('Please enter a valid index inside the array range.');
      return;
    }
    if (inputValue.trim() === '') {
      setMessage('Please enter a new value to write at that index.');
      return;
    }
    const next = [...values];
    const old = next[idx];
    next[idx] = Number(inputValue);
    setValues(next);
    const msg = `Updated index ${idx} from ${old} to ${Number(inputValue)}.`;
    setMessage(msg);
    pushHistory(msg);
  };

  const handleDelete = () => {
    resetMessage();
    const idx = Number(indexValue);
    if (Number.isNaN(idx) || idx < 0 || idx >= values.length) {
      setMessage('Please enter a valid index to delete.');
      return;
    }
    const deleted = values[idx];
    const next = values.filter((_, i) => i !== idx);
    setValues(next);
    const msg = `Deleted value ${deleted} at index ${idx}.`;
    setMessage(msg);
    pushHistory(msg);
  };

  const handleReset = () => {
    setValues([3, 7, 1, 9, 5]);
    setInputValue('');
    setIndexValue('');
    const msg = 'Reset the array back to its starting state.';
    setMessage(msg);
    setHistory([]);
  };
  const handleLinearSearch = () => {
  if (searchValue.trim() === '') {
    setMessage('Please enter a value to search for.');
    return;
  }

  setIsSearching(true);
  setCurrentSearchIndex(0);
  setSearchFoundIndex(null);
  setMessage(`Starting linear search for ${Number(searchValue)}.`);

  const target = Number(searchValue);

  let i = 0;

  const intervalId = setInterval(() => {
    setCurrentSearchIndex(i);

    if (values[i] === target) {
      const msg = `Found ${target} at index ${i} using linear search.`;
      setMessage(msg);
      pushHistory(msg);
      setSearchFoundIndex(i);
      setIsSearching(false);
      clearInterval(intervalId);
      return;
    }

    i += 1;

    if (i >= values.length) {
      const msg = `Did not find ${target} in the current array.`;
      setMessage(msg);
      pushHistory(msg);
      setIsSearching(false);
      setCurrentSearchIndex(null);
      clearInterval(intervalId);
    }
  }, 600);
};


  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Array visualizer (early draft)</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr 2fr',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        <ArrayControls
             inputValue={inputValue}
             indexValue={indexValue}
             message={message}
             searchValue={searchValue}
             isSearching={isSearching}
             onInputChange={(e) => setInputValue(e.target.value)}
             onIndexChange={(e) => setIndexValue(e.target.value)}
             onSearchValueChange={(e) => setSearchValue(e.target.value)}
             onInsert={handleInsert}
             onUpdate={handleUpdate}
             onDelete={handleDelete}
             onReset={handleReset}
             onLinearSearch={handleLinearSearch}
 
        />

         <ArrayView
        values={values}
        currentSearchIndex={currentSearchIndex}
        searchFoundIndex={searchFoundIndex}
      />

        <ArrayHistory history={history} />
      </div>
    </section>
  );
}

export default ArrayVisualizer;
