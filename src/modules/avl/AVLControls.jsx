export default function AVLControls({
  inputVal, setInputVal,
  onInsert, onDelete, onSearch, onReset,
  onInorder, onPreorder, onPostorder,
  isSearching, message,
}) {
  const handleKey = (e) => { if (e.key === 'Enter') onInsert(); };

  const btn = (label, onClick, disabled = false, variant = '') => (
    <button key={label} onClick={onClick} disabled={disabled} style={{
      padding: '0.38rem 0.85rem', borderRadius: '0.45rem', fontSize: '0.8rem',
      fontWeight: '500', cursor: disabled ? 'not-allowed' : 'pointer',
      border: variant === 'danger'  ? '1px solid #7f1d1d'
            : variant === 'primary' ? '1px solid var(--accent-dim)'
            : '1px solid var(--border-default)',
      background: variant === 'primary' ? 'var(--accent-dim)'
                : variant === 'danger'  ? '#1c0a0a'
                : 'var(--bg-elevated)',
      color: variant === 'primary' ? '#fff'
           : variant === 'danger'  ? '#fca5a5'
           : 'var(--text-secondary)',
      opacity: disabled ? 0.4 : 1,
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap',
    }}>{label}</button>
  );

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Controls</p>

      <div style={{ marginBottom: '0.9rem' }}>
        <label style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Value</label>
        <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={handleKey} placeholder="e.g. 15" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {btn('Insert', onInsert, false, 'primary')}
          {btn('Search', onSearch, isSearching)}
          {btn('Delete', onDelete, false, 'danger')}
          {btn('Reset', onReset)}
        </div>
        <div>
          <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '0.6rem 0 0.35rem' }}>Traversals</p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {btn('Inorder', onInorder)}
            {btn('Preorder', onPreorder)}
            {btn('Postorder', onPostorder)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.85rem', padding: '0.6rem 0.75rem', borderRadius: '0.45rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', minHeight: '2.8rem' }}>
        <p style={{ fontSize: '0.79rem', color: '#a5b4fc', lineHeight: 1.6, margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}
