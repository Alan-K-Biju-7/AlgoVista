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
  marginBottom: '0.4rem',
  display: 'block',
};

function ArrayControls({
  inputValue,
  indexValue,
  message,
  searchValue,
  isSearching,
  isStepMode,
  onInputChange,
  onIndexChange,
  onSearchValueChange,
  onInsert,
  onUpdate,
  onDelete,
  onReset,
  onLinearSearch,
  onPrepareStepSearch,
  onNextSearchStep,
}) {
  return (
    <div style={card}>
      <p style={{ ...cardLabel, fontSize: '0.75rem', marginBottom: '1rem', color: '#94a3b8' }}>
        Controls
      </p>

      <div style={{ marginBottom: '0.85rem' }}>
        <label style={cardLabel}>Value</label>
        <input
          type="number"
          value={inputValue}
          onChange={onInputChange}
          placeholder="enter a number"
        />
      </div>

      <div style={{ marginBottom: '0.85rem' }}>
        <label style={cardLabel}>Index</label>
        <input
          type="number"
          value={indexValue}
          onChange={onIndexChange}
          placeholder="0, 1, 2 ..."
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={cardLabel}>Search value</label>
        <input
          type="number"
          value={searchValue}
          onChange={onSearchValueChange}
          placeholder="number to find"
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <button onClick={onInsert}>Insert at end</button>
        <button onClick={onUpdate}>Update at index</button>
        <button onClick={onDelete}>Delete at index</button>
        <button onClick={onReset}>Reset</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={onLinearSearch} disabled={isSearching && !isStepMode}>
          {isSearching && !isStepMode ? 'Searching...' : 'Run linear search'}
        </button>
        <button onClick={onPrepareStepSearch}>Prepare step search</button>
        <button onClick={onNextSearchStep} disabled={!isStepMode}>Next step</button>
      </div>

      {message && (
        <p style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#a5b4fc', lineHeight: 1.6 }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ArrayControls;
