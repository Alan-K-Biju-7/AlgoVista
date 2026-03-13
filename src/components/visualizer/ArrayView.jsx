function ArrayView({ values }) {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '0.75rem',
        border: '1px solid #374151',
        background: '#020617',
      }}
    >
      <h3 style={{ marginBottom: '0.75rem' }}>Array view</h3>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {values.map((value, index) => (
          <div
            key={index}
            style={{
              minWidth: '3rem',
              padding: '0.75rem 0.5rem',
              textAlign: 'center',
              borderRadius: '0.5rem',
              background: '#111827',
              border: '1px solid #374151',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{index}</div>
            <div style={{ fontSize: '1.1rem' }}>{value}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
        This is a simple fixed-order array. Insert adds a new value at the end,
        update overwrites the value at a given index, and delete removes the
        element at that index and shifts everything after it to the left.
      </p>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
        <strong>Typical time complexity (array, by index)</strong>
        <ul
          style={{
            listStyle: 'disc',
            paddingLeft: '1.5rem',
            marginTop: '0.5rem',
            lineHeight: 1.6,
          }}
        >
          <li>Read by index: O(1)</li>
          <li>Update by index: O(1)</li>
          <li>Insert / delete at end: O(1) amortized</li>
          <li>Insert / delete in the middle: O(n)</li>
        </ul>
      </div>
    </div>
  );
}

export default ArrayView;
