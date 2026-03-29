export default function DijkstraControls({
  nodes, startNode, setStartNode, endNode, setEndNode,
  addEdgeFrom, setAddEdgeFrom, addEdgeTo, setAddEdgeTo,
  addEdgeWeight, setAddEdgeWeight, onAddEdge,
  onRun, onStepForward, onStepBack, onStop, onReset,
  speed, setSpeed, isRunning,
  stepIndex, totalSteps, message,
}) {
  const sLbl = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', margin: '0.85rem 0 0.4rem' };

  const btn = (label, onClick, variant = '', disabled = false) => (
    <button key={label} onClick={onClick} disabled={disabled} style={{
      padding: '0.38rem 0.7rem', borderRadius: '0.45rem', fontSize: '0.78rem', fontWeight: '500',
      border: variant === 'primary' ? '1px solid var(--accent)'
            : variant === 'danger'  ? '1px solid #7f1d1d'
            : '1px solid var(--border-strong)',
      background: variant === 'primary' ? 'var(--accent)' : variant === 'danger' ? '#1c0a0a' : 'var(--bg-elevated)',
      color: variant === 'primary' ? '#031a14' : variant === 'danger' ? '#fca5a5' : 'var(--text-secondary)',
      opacity: disabled ? 0.35 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
    }}>{label}</button>
  );

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>Controls</p>

      <p style={sLbl}>Source node</p>
      <select value={startNode} onChange={(e) => setStartNode(e.target.value)} style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.82rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
        {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
      </select>

      <p style={sLbl}>Destination</p>
      <select value={endNode} onChange={(e) => setEndNode(e.target.value)} style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.82rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
        <option value="">— Show all —</option>
        {nodes.filter((n) => n.id !== startNode).map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
      </select>

      <p style={sLbl}>Run</p>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {btn('◀',      onStepBack,    '', stepIndex <= 0 || isRunning)}
        {btn('Step ▶', onStepForward, '', stepIndex >= totalSteps - 1 || isRunning)}
        {!isRunning ? btn('Auto ▶', onRun, 'primary') : btn('Stop ■', onStop, 'danger')}
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

      <p style={sLbl}>Add edge</p>
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={addEdgeFrom} onChange={(e) => setAddEdgeFrom(e.target.value.toUpperCase())} placeholder="A" maxLength={3} style={{ width: '40px', padding: '0.38rem 0.45rem', fontSize: '0.8rem' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
        <input value={addEdgeTo} onChange={(e) => setAddEdgeTo(e.target.value.toUpperCase())} placeholder="B" maxLength={3} style={{ width: '40px', padding: '0.38rem 0.45rem', fontSize: '0.8rem' }} />
        <input type="number" value={addEdgeWeight} onChange={(e) => setAddEdgeWeight(e.target.value)} placeholder="w" style={{ width: '44px', padding: '0.38rem 0.45rem', fontSize: '0.8rem' }} />
        {btn('+', onAddEdge, 'primary')}
      </div>

      {totalSteps > 0 && (
        <div style={{ marginTop: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.67rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <span>Step {Math.max(1, stepIndex + 1)} / {totalSteps}</span>
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

      <div style={{ marginTop: '0.6rem' }}>
        {btn('Reset graph', onReset)}
      </div>
    </div>
  );
}
