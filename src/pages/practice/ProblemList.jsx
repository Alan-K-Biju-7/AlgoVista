import React from 'react';
import EmptyState from './EmptyState';
import { isNeetcode150 } from './neetcode150';

export default function ProblemList({ problems = [] }) {
  if (!problems.length) {
    return <EmptyState topicLabel="this selection" />;
  }

  return (
    <div>
      {problems.map((p) => (
        <div
          key={p.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.9rem 1rem',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {p.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {p.pattern}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span
              style={{
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              {p.difficulty}
            </span>

            {isNeetcode150(p.id) && (
              <span
                title="Part of NeetCode 150"
                style={{
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#00d4aa',
                  background: '#00d4aa14',
                  border: '1px solid #00d4aa40',
                }}
              >
                NC150
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
