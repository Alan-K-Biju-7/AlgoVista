import React from 'react';
import EmptyState from './EmptyState';

const DIFF_COLOR = { Easy: '#00d4aa', Medium: '#f5a623', Hard: '#ff6b6b' };

export default function ProblemList({ topic, problems, onSelect, getStatus, isBookmarked, toggleBookmark }) {
  const [filter, setFilter] = React.useState('All');
  const [query, setQuery] = React.useState('');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = React.useState(false);

  const filtered = problems.filter((p) => {
    const matchesDifficulty = filter === 'All' ? true : p.difficulty === filter;
    const matchesBookmark = showBookmarkedOnly ? isBookmarked?.(p.id) : true;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.pattern || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q);

    return matchesDifficulty && matchesBookmark && matchesQuery;
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2
          style={{
            fontSize: '1.3rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
          }}
        >
          {topic.icon} {topic.label}
        </h2>

        <p
          style={{
            fontSize: '0.83rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
          }}
        >
          {query.trim() || filter !== 'All'
            ? `Showing ${filtered.length} of ${problems.length} problem${problems.length === 1 ? '' : 's'}`
            : `${problems.length} problem${problems.length === 1 ? '' : 's'} available`}
        </p>

        <p
          style={{
            fontSize: '0.76rem',
            color: 'var(--text-muted)',
            marginTop: '0.35rem',
          }}
        >
          Filter by difficulty or search by keyword to narrow this list.
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this topic by title, pattern, or description"
          style={{
            width: '100%',
            marginTop: '0.8rem',
            padding: '0.7rem 0.85rem',
            borderRadius: '0.6rem',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            outline: 'none',
          }}
        />

        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: filter === d ? '700' : '400',
                background: filter === d ? topic.color + '25' : 'transparent',
                color: filter === d ? topic.color : 'var(--text-muted)',
              }}
            >
              {d}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowBookmarkedOnly((prev) => !prev)}
            style={{
              padding: '0.2rem 0.65rem',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: showBookmarkedOnly ? '700' : '400',
              background: showBookmarkedOnly ? topic.color + '25' : 'transparent',
              color: showBookmarkedOnly ? topic.color : 'var(--text-muted)',
            }}
            aria-pressed={showBookmarkedOnly}
          >
            🔖 Bookmarked
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState topicLabel={topic.label} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map((p) => {
          const status = getStatus(p.id);
          const bookmarked = isBookmarked ? isBookmarked(p.id) : false;

          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: '0.6rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                textAlign: 'left',
                transition: 'border-color 0.15s',
                width: '100%',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = topic.color + '50')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = 'var(--border-default)')
              }
            >
              <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>
                {status === 'solved' ? '✅' : status === 'attempted' ? '🟡' : '⬜'}
              </span>

              <button
                type="button"
                onClick={() => onSelect(p)}
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
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '0.18rem',
                  }}
                >
                  {p.title}
                </div>

                {p.description ? (
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.description}
                  </div>
                ) : null}
              </button>

              <span
                style={{
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: DIFF_COLOR[p.difficulty],
                  background: DIFF_COLOR[p.difficulty] + '18',
                  border: `1px solid ${DIFF_COLOR[p.difficulty]}40`,
                }}
              >
                {p.difficulty}
              </span>

              <span
                style={{
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  background: 'var(--border-default)',
                  border: '1px solid var(--border-default)',
                }}
              >
                {p.pattern}
              </span>

              {p.timeO && (
                <span
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: '600',
                    color: '#4a9eff',
                    background: '#4a9eff12',
                    border: '1px solid #4a9eff30',
                  }}
                >
                  {p.timeO}
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark?.(p.id);
                }}
                aria-label={bookmarked ? `Remove ${p.title} from bookmarks` : `Add ${p.title} to bookmarks`}
                title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                style={{
                  border: '1px solid ' + (bookmarked ? topic.color + '55' : 'var(--border-default)'),
                  background: bookmarked ? topic.color + '16' : 'transparent',
                  color: bookmarked ? topic.color : 'var(--text-muted)',
                  borderRadius: '0.5rem',
                  padding: '0.35rem 0.55rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {bookmarked ? '🔖' : '📑'}
              </button>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}
