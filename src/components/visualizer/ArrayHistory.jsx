function ArrayHistory({ history }) {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '0.75rem',
        border: '1px solid #374151',
        background: '#020617',
      }}
    >
      <h3 style={{ marginBottom: '0.75rem' }}>Recent steps</h3>
      {history.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Perform an operation to see it appear here.
        </p>
      ) : (
        <ul style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
          {history.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArrayHistory;
