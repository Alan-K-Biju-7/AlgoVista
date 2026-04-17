import React from 'react';

export default function EmptyState({ topicLabel }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      color: 'var(--text-muted)',
      fontSize: '0.88rem',
      border: '1px dashed var(--border-default)',
      borderRadius: '0.6rem',
      background: 'var(--bg-card)',
    }}>
      <div style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>🧭</div>
      <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.25rem' }}>
        Nothing matches your filters in {topicLabel}
      </div>
      <div>Try clearing the search or switching the pattern chip to "All".</div>
      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem' }}>
        New here? Start with Two Sum, then Contains Duplicate, then Valid Anagram.
      </div>
    </div>
  );
}
