export default function TrieControls({
  wordInput, setWordInput,
  onInsert, onSearch, onDelete, onAutocomplete,
  onStepForward, onStepBack, onAutoRun, onStop, onReset,
  isRunning, stepIndex, totalSteps, speed, setSpeed,
  message,
}) {
  const sLbl = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', margin: '0.85rem 0 0.4rem' };

  const btn = (label, onClick, variant = '', disabled = false) => (
    <button key={label} onClick={onClick} disabled={disabled} style={{
      padding: '0.36rem 0.7rem', borderRadius: '0.45rem', fontSize: '0.78rem', fontWeight: '500',
      border: variant === 'primary' ? '1px solid var(--accent)'
            : variant === 'danger'  ? '1px solid #7f1d1d'
            : variant === 'red'     ? '1px solid #991b1b'
            : variant === 'purple'  ? '1px solid #5b21b6'
            : '1px solid var(--border-strong)',
      background: variant === 'primary' ? 'var(--accent)'
                : variant === 'danger'  ? '#1c0a0a'
                : variant === 'red'     ? '#1c0a0a'
                : variant === 'purple'  ? 'rgba(139,124,248,0.1)'
                : 'var(--bg-elevated)',
      color: variant === 'primary' ? '#031a14'
           : variant === 'danger'  ? '#fca5a5'
           : variant === 'red'     ? '#fca5a5'
           : variant === 'purple'  ? '#c4b5fd'
           : 'var(--text-secondary)',
      opacity: disabled ? 0.35 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
    }}>{label}</button>
  );

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>Controls</p>

      <p style={sLbl}>Word / Prefix</p>
      <input value={wordInput} onChange={(e) => setWordInput(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
        onKeyDown={(e) => { if (e.key === 'Enter') onInsert(); }}
        placeholder="e.g. apple" />

      <p style={sLbl}>Operations</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {btn('Insert',      onInsert,      'primary', isRunning)}
          {btn('Search',      onSearch,      '',        isRunning)}
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {btn('Delete',      onDelete,      'red',     isRunning)}
          {btn('Autocomplete',onAutocomplete,'purple',  isRunning)}
        </div>
        <div>{btn('Reset', onReset)}</div>
      </div>

      <p style={sLbl}>Playback</p>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {btn('◀',      onStepBack,    '', stepIndex <= 0 || isRunning)}
        {btn('Step ▶', onStepForward, '', stepIndex >= totalSteps - 1 || isRunning)}
        {!isRunning
          ? btn('Auto ▶', onAutoRun, 'primary', totalSteps === 0)
          : btn('Stop ■', onStop,    'danger')}
      </div>

      <p style={sLbl}>Speed</p>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {[['Slow', 900], ['Normal', 500], ['Fast', 200]].map(([l, v]) => (
          <button key={l} onClick={() => setSpeed(v)} style={{
            flex: 1, padding: '0.32rem', fontSize: '0.72rem', fontWeight: '600', borderRadius: '0.4rem',
            border: speed === v ? '1px solid var(--accent)' : '1px solid var(--border-strong)',
            background: speed === v ? 'var(--accent-glow)' : 'var(--bg-elevated)',
            color: speed === v ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {totalSteps > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.67rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <span>Step {Math.max(1, stepIndex + 1)} / {totalSteps}</span>
            <span>{Math.round(((stepIndex + 1) / totalSteps) * 100)}%</span>
          </div>
          <div style={{ height: '3px', background: 'var(--border-default)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((stepIndex + 1) / totalSteps) * 100}%`, background: 'var(--accent)', transition: 'width 0.3s ease', borderRadius: '2px' }} />
          </div>
        </div>
      )}

      <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.45rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', minHeight: '3rem' }}>
        <p style={{ fontSize: '0.78rem', color: '#a5b4fc', lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  );
}
