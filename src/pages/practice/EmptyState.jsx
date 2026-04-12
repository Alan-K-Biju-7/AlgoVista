export default function EmptyState({ topicLabel = 'this topic' }) {
  return (
    <div
      style={{
        padding: '1.2rem',
        borderRadius: '0.7rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        lineHeight: 1.7,
      }}
    >
      No problems match your current filters in {topicLabel}. Try clearing the
      search box or switching the difficulty filter.
    </div>
  );
}
