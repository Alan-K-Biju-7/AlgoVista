export default function HeapControls({
  inputVal, setInputVal,
  onInsert, onExtract,
  onStepForward, onStepBack, onAutoRun, onStop, onReset,
  isRunning, stepIndex, totalSteps, speed, setSpeed,
  message,
}) {
  const sectionLabel = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', margin: '0.85rem 0 0.4rem' };

  const btn = (label, onClick, variant = '', disabled = false) => (
    <button key={label} onClick={onClick} disabled={disabled} style={{
      padding: '0.38rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.79rem', fontWeight: '500',
      border: variant === 'primary' ? '1px solid var(--accent)'
            : variant === 'danger'  ? '1px solid #7f1d1d'
            : variant === 'red'     ? '1px solid #991b1b'
            : '1px solid var(--border-strong)',
      background: variant === 'primary' ? 'var(--accent)'
                : variant === 'danger'  ? '#1c0a0a'
                : variant === 'red'     ? '#1c0a0a'
                : 'var(--bg-elevated)',
      color: variant === 'primary' ? '#031a14'
           : variant === 'danger'  ? '#fca5a5'
           : variant === 'red'     ? '#fca5a5'
           : 'var(--text-secondary)',
      opacity: disabled ? 0.35 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>{label}</button>
  );

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>Controls</p>

      <p style={sectionLabel}>Insert value</p>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onInsert(); }}
          placeholder="e.g. 15" />
        {btn('Insert', onInsert, 'primary', isRunning)}
      </div>

      <p style={sectionLabel}>Operations</p>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {btn('Extract Min', onExtract, 'red', isRunning)}
        {btn('Reset', onReset)}
      </div>

      <p style={sectionLabel}>Playback</p>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {btn('◀ Back',  onStepBack,    '', stepIndex <= 0 || isRunning)}
        {btn('Step ▶',  onStepForward, '', stepIndex >= totalSteps - 1 || isRunning)}
        {!isRunning
          ? btn('Auto ▶', onAutoRun, 'primary', totalSteps === 0)
          : btn('Stop ■',  onStop,    'danger')}
      </div>

      <p style={sectionLabel}>Speed</p>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {[['Slow', 900], ['Normal', 500], ['Fast', 200]].map(([l, v]) => (
          <button key={l} onClick={() => setSpeed(v)} style={{
            flex: 1, padding: '0.35rem', fontSize: '0.72rem', fontWeight: '600', borderRadius: '0.4rem',
            border: speed === v ? '1px solid var(--accent)' : '1px solid var(--border-strong)',
            background: speed === v ? 'var(--accent-glow)' : 'var(--bg-elevated)',
            color: speed === v ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {totalSteps > 0 && (
        <div style={{ marginTop: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.67rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <span>Step {Math.max(0, stepIndex + 1)} / {totalSteps}</span>
            <span>{Math.round(((stepIndex + 1) / totalSteps) * 100)}%</span>
          </div>
          <div style={{ height: '3px', background: 'var(--border-default)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((stepIndex + 1) / totalSteps) * 100}%`, background: 'var(--accent)', transition: 'width 0.3s ease', borderRadius: '2px' }} />
          </div>
        </div>
      )}

      <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.75rem', borderRadius: '0.45rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', minHeight: '3rem' }}>
        <p style={{ fontSize: '0.78rem', color: '#a5b4fc', lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  );
}
