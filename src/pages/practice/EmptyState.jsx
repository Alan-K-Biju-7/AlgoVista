export default function EmptyState({ topicLabel = 'this topic' }) {
  return (
    <div
      style={{
        padding: '1.2rem',
        borderRadius: '0.7rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          fontSize: '0.95rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '0.35rem',
        }}
      >
        No matching problems
      </div>

      <div
        style={{
          fontSize: '0.85rem',
          lineHeight: 1.7,
        }}
      >
        No problems match your current filters in {topicLabel}. Try clearing the
        search box or switching the difficulty filter to see more problems.
      </div>
    </div>
  );
}
