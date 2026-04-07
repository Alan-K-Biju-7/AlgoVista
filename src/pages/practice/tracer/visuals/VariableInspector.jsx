export default function VariableInspector({ vars, changed }) {
  if (!vars || Object.keys(vars).length === 0) return null;
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        Variables
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {Object.entries(vars).map(([k, v]) => {
          const isChanged = changed?.has(k);
          return (
            <div key={k} style={{
              display: 'flex', alignItems: 'center', gap: '0',
              borderRadius: '0.4rem', overflow: 'hidden',
              border: `1px solid ${isChanged ? '#f5a623' : 'var(--border-default)'}`,
              background: isChanged ? '#f5a62308' : 'transparent',
              boxShadow: isChanged ? '0 0 8px #f5a62333' : 'none',
              transition: 'all 0.2s',
            }}>
              <div style={{ padding: '0.28rem 0.5rem', fontSize: '0.72rem', fontFamily: 'monospace', color: isChanged ? '#f5a623' : 'var(--text-muted)', fontWeight: '600', borderRight: '1px solid var(--border-default)', background: 'var(--bg-card)' }}>
                {k}
              </div>
              <div style={{ padding: '0.28rem 0.5rem', fontSize: '0.72rem', fontFamily: 'monospace', color: isChanged ? '#f5a623' : 'var(--text-primary)', fontWeight: '700', background: 'var(--bg-card)' }}>
                {Array.isArray(v) ? `[${v.join(', ')}]` : v === null ? 'null' : v === undefined ? '—' : String(v)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
