import React from 'react';
import EmptyState from './EmptyState';
import { isNeetcode150 } from './neetcode150';

const DIFF_COLOR = { Easy: '#00d4aa', Medium: '#f5a623', Hard: '#ff6b6b' };

export default function ProblemList({
  topic,
  problems = [],
  onSelect,
  getStatus,
  isBookmarked,
  toggleBookmark,
}) {
  const [filter, setFilter] = React.useState('All');
  const [query, setQuery] = React.useState('');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = React.useState(false);

  const filtered = problems.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesDifficulty = filter === 'All' || p.difficulty === filter;
    const matchesBookmark = showBookmarkedOnly ? isBookmarked?.(p.id) : true;
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.pattern || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q);

    return matchesDifficulty && matchesBookmark && matchesQuery;
  });

  if (!problems.length) {
    return <EmptyState topicLabel={topic?.label || 'this selection'} />;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-primary)' }}>
              {topic.icon} {topic.label}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              {filtered.length} of {problems.length} problems shown
            </p>
          </div>

          {topic.id?.startsWith('nc-') ? (
            <span style={{
              padding: '0.3rem 0.7rem',
              borderRadius: '999px',
              border: '1px solid #00d4aa40',
              background: '#00d4aa14',
              color: '#00d4aa',
              fontSize: '0.72rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Curated NC150
            </span>
          ) : null}
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, pattern, or explanation"
          style={{
            width: '100%',
            marginTop: '0.9rem',
            padding: '0.72rem 0.85rem',
            borderRadius: '0.6rem',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '0.84rem',
          }}
        />

        <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setFilter(d)}
              style={{
                padding: '0.25rem 0.7rem',
                borderRadius: '999px',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: filter === d ? '800' : '500',
                background: filter === d ? topic.color + '22' : 'transparent',
                color: filter === d ? topic.color : 'var(--text-muted)',
              }}
            >
              {d}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowBookmarkedOnly((prev) => !prev)}
            aria-pressed={showBookmarkedOnly}
            style={{
              padding: '0.25rem 0.7rem',
              borderRadius: '999px',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: showBookmarkedOnly ? '800' : '500',
              background: showBookmarkedOnly ? topic.color + '22' : 'transparent',
              color: showBookmarkedOnly ? topic.color : 'var(--text-muted)',
            }}
          >
            Bookmarked
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState topicLabel={topic.label} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map((p) => {
            const status = getStatus?.(p.id) || 'unsolved';
            const bookmarked = isBookmarked ? isBookmarked(p.id) : false;
            const difficultyColor = DIFF_COLOR[p.difficulty] || topic.color;

            return (
              <div
                key={p.id}
                className="practice-problem-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.65rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = topic.color + '55';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              >
                <span style={{
                  width: '1.15rem',
                  color: status === 'solved' ? '#00d4aa' : status === 'attempted' ? '#f5a623' : 'var(--text-muted)',
                  fontWeight: '900',
                  textAlign: 'center',
                }}>
                  {status === 'solved' ? '✓' : status === 'attempted' ? '•' : '○'}
                </span>

                <button
                  type="button"
                  onClick={() => onSelect?.(p)}
                  aria-label={`Open ${p.title}`}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.18rem' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.pattern_explanation || p.description || p.pattern}
                  </div>
                </button>

                <span className="practice-problem-chip" style={{
                  padding: '0.16rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: difficultyColor,
                  background: difficultyColor + '18',
                  border: `1px solid ${difficultyColor}40`,
                }}>
                  {p.difficulty}
                </span>

                <span className="practice-problem-chip" style={{
                  padding: '0.16rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  background: 'var(--border-default)',
                  border: '1px solid var(--border-default)',
                }}>
                  {p.pattern}
                </span>

                {isNeetcode150(p.id) ? (
                  <span className="practice-problem-chip" title="Part of the curated NeetCode 150 track" style={{
                    padding: '0.16rem 0.55rem',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    color: '#00d4aa',
                    background: '#00d4aa14',
                    border: '1px solid #00d4aa40',
                  }}>
                    NC150
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark?.(p.id);
                  }}
                  aria-label={bookmarked ? `Remove ${p.title} bookmark` : `Bookmark ${p.title}`}
                  title={bookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                  style={{
                    border: `1px solid ${bookmarked ? topic.color + '55' : 'var(--border-default)'}`,
                    background: bookmarked ? topic.color + '16' : 'transparent',
                    color: bookmarked ? topic.color : 'var(--text-muted)',
                    borderRadius: '0.5rem',
                    padding: '0.35rem 0.55rem',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {bookmarked ? 'Saved' : 'Save'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
