export default function GraphControls({
  nodes, algorithm, setAlgorithm,
  startNode, setStartNode,
  addNodeInput, setAddNodeInput, onAddNode,
  addEdgeFrom, setAddEdgeFrom,
  addEdgeTo, setAddEdgeTo, onAddEdge,
  onRun, onStepForward, onStepBack, onStop, onReset,
  speed, setSpeed, isRunning,
  stepIndex, totalSteps, message,
}) {
  const sectionLabel = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', margin: '0.85rem 0 0.4rem' };
  const btn = (label, onClick, variant = '', disabled = false) => (
    <button key={label} onClick={onClick} disabled={disabled} style={{
      padding: '0.38rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.78rem', fontWeight: '500',
      border: variant === 'primary' ? '1px solid var(--accent)' : variant === 'danger' ? '1px solid #7f1d1d' : '1px solid var(--border-strong)',
      background: variant === 'primary' ? 'var(--accent)' : variant === 'danger' ? '#1c0a0a' : 'var(--bg-elevated)',
      color: variant === 'primary' ? '#031a14' : variant === 'danger' ? '#fca5a5' : 'var(--text-secondary)',
      opacity: disabled ? 0.35 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>{label}</button>
  );

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
      <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Controls</p>

      {/* Algorithm selector */}
      <p style={sectionLabel}>Algorithm</p>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {['BFS', 'DFS'].map((alg) => (
          <button key={alg} onClick={() => setAlgorithm(alg)} style={{
            flex: 1, padding: '0.4rem', borderRadius: '0.4rem', fontSize: '0.82rem', fontWeight: '700',
            border: algorithm === alg ? '1px solid var(--accent)' : '1px solid var(--border-strong)',
            background: algorithm === alg ? 'var(--accent-glow)' : 'var(--bg-elevated)',
            color: algorithm === alg ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{alg}</button>
        ))}
      </div>

      {/* Start node */}
      <p style={sectionLabel}>Start node</p>
      <select value={startNode} onChange={(e) => setStartNode(e.target.value)} style={{ padding: '0.4rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.82rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', width: '100%' }}>
        {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
      </select>

      {/* Step controls */}
      <p style={sectionLabel}>Run</p>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {btn('◀ Back',  onStepBack,    '', stepIndex <= 0 || isRunning)}
        {btn('Step ▶',  onStepForward, '', stepIndex >= totalSteps - 1 || isRunning)}
        {!isRunning ? btn('Auto ▶', onRun, 'primary', totalSteps === 0 && false) : btn('Stop ■', onStop, 'danger')}
      </div>

      {/* Speed */}
      <p style={sectionLabel}>Speed</p>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {[['Slow', 1000], ['Normal', 600], ['Fast', 250]].map(([l, v]) => (
          <button key={l} onClick={() => setSpeed(v)} style={{
            flex: 1, padding: '0.35rem', fontSize: '0.72rem', fontWeight: '600', borderRadius: '0.4rem',
            border: speed === v ? '1px solid var(--accent)' : '1px solid var(--border-strong)',
            background: speed === v ? 'var(--accent-glow)' : 'var(--bg-elevated)',
            color: speed === v ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {/* Add node */}
      <p style={sectionLabel}>Add node</p>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        <input value={addNodeInput} onChange={(e) => setAddNodeInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => { if (e.key === 'Enter') onAddNode(); }}
          placeholder="e.g. G" maxLength={3} style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem' }} />
        {btn('+', onAddNode, 'primary')}
      </div>

      {/* Add edge */}
      <p style={sectionLabel}>Add edge</p>
      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
        <input value={addEdgeFrom} onChange={(e) => setAddEdgeFrom(e.target.value.toUpperCase())} placeholder="A" maxLength={3} style={{ padding: '0.4rem 0.5rem', fontSize: '0.82rem', width: '52px' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
        <input value={addEdgeTo} onChange={(e) => setAddEdgeTo(e.target.value.toUpperCase())} placeholder="B" maxLength={3} style={{ padding: '0.4rem 0.5rem', fontSize: '0.82rem', width: '52px' }} />
        {btn('+', onAddEdge, 'primary')}
      </div>

      {/* Reset */}
      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.85rem' }}>
        {btn('Reset graph', onReset)}
      </div>

      {/* Progress */}
      {totalSteps > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <span>Step {Math.max(0, stepIndex + 1)} / {totalSteps}</span>
            <span>{Math.round(((stepIndex + 1) / totalSteps) * 100)}%</span>
          </div>
          <div style={{ height: '3px', background: 'var(--border-default)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((stepIndex + 1) / totalSteps) * 100}%`, background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Message */}
      <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.45rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', minHeight: '3rem' }}>
        <p style={{ fontSize: '0.78rem', color: '#a5b4fc', lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  );
}
