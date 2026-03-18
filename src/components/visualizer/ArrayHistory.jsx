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

function ArrayHistory({ history }) {
  return (
    <div style={card}>
      <p style={cardLabel}>Recent steps</p>
      {history.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: '#475569' }}>
          Perform an operation to see it appear here.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {history.map((item) => (
            <p
              key={item.id}
              style={{
                fontSize: '0.78rem',
                color: '#94a3b8',
                borderLeft: '2px solid #334155',
                paddingLeft: '0.5rem',
                lineHeight: 1.6,
              }}
            >
              {item.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArrayHistory;
