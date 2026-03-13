function ArrayControls({
  inputValue,
  indexValue,
  message,
  searchValue,
  isSearching,
  onInputChange,
  onIndexChange,
  onSearchValueChange,
  onInsert,
  onUpdate,
  onDelete,
  onReset,
  onLinearSearch,
}) {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '0.75rem',
        border: '1px solid #374151',
        background: '#020617',
      }}
    >
      <h3 style={{ marginBottom: '0.75rem' }}>Controls</h3>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>
          Value
        </label>
        <input
          type="number"
          value={inputValue}
          onChange={onInputChange}
          placeholder="number"
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>
          Index
        </label>
        <input
          type="number"
          value={indexValue}
          onChange={onIndexChange}
          placeholder="0, 1, 2..."
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>
          Search value (linear search)
        </label>
        <input
          type="number"
          value={searchValue}
          onChange={onSearchValueChange}
          placeholder="number to find"
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={onInsert} style={{ padding: '0.5rem 1rem' }}>
          Insert at end
        </button>
        <button onClick={onUpdate} style={{ padding: '0.5rem 1rem' }}>
          Update at index
        </button>
        <button onClick={onDelete} style={{ padding: '0.5rem 1rem' }}>
          Delete at index
        </button>
        <button onClick={onReset} style={{ padding: '0.5rem 1rem' }}>
          Reset array
        </button>
        <button
          onClick={onLinearSearch}
          style={{ padding: '0.5rem 1rem' }}
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Run linear search'}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#a5b4fc' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ArrayControls;
