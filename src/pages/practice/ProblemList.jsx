import { useMemo, useState } from 'react';
import EmptyState from './EmptyState';
import { isNeetcode150 } from './neetcode150';
import { TRACER_CONFIGS } from './tracer/configs';
import { filterProblems } from './problemFilters';

const difficultyColors = {
  Easy: '#00d4aa',
  Medium: '#f5a623',
  Hard: '#ff6b6b',
};

const statusCopy = {
  solved: 'Solved',
  attempted: 'Attempted',
  unsolved: 'Fresh',
};

function Pill({ children, color = 'var(--text-secondary)', filled = false }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '1.55rem',
        padding: '0.15rem 0.55rem',
        borderRadius: '999px',
        fontSize: '0.7rem',
        fontWeight: 800,
        lineHeight: 1,
        color,
        background: filled ? `${color}18` : 'transparent',
        border: `1px solid ${filled ? `${color}55` : 'var(--border-default)'}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function firstSentence(text = '') {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : trimmed).trim();
}

export default function ProblemList({
  topic,
  problems = [],
  allProblems = problems,
  onSelect,
  getStatus = () => 'unsolved',
  isBookmarked = () => false,
  toggleBookmark,
}) {
  const [filters, setFilters] = useState({
    query: '',
    status: 'all',
    difficulty: 'all',
    capability: 'all',
    sort: 'recommended',
  });
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window === 'undefined') return 'list';
    const savedView = window.localStorage.getItem('algovista.practice.library-view');
    return savedView === 'cards' ? 'cards' : 'list';
  });
  const [scope, setScope] = useState('topic');
  const sourceProblems = scope === 'all' ? allProblems : problems;
  const filteredProblems = useMemo(
    () => filterProblems(
      sourceProblems,
      filters,
      getStatus,
      isBookmarked,
      (problemId) => Boolean(TRACER_CONFIGS[problemId])
    ),
    [filters, getStatus, isBookmarked, sourceProblems]
  );
  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const changeView = (nextView) => {
    setViewMode(nextView);
    try {
      window.localStorage.setItem('algovista.practice.library-view', nextView);
    } catch {
      // The selected view remains active for this session.
    }
  };

  if (!problems.length) {
    return <EmptyState topicLabel={topic?.label || 'this selection'} />;
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'end', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <p className="mission-kicker" style={{ color: topic?.color || '#00d4aa' }}>
            Mission Deck
          </p>
          <h2 style={{ fontSize: '1.12rem', letterSpacing: 0 }}>
            {topic?.label || 'Problems'}
          </h2>
        </div>
        <div className="problem-view-actions">
          <span className="mission-chip">{filteredProblems.length}/{sourceProblems.length} problems</span>
          <div role="group" aria-label="Problem library view">
            <button type="button" aria-pressed={viewMode === 'list'} className={viewMode === 'list' ? 'is-active' : ''} onClick={() => changeView('list')} title="Compact list">☷</button>
            <button type="button" aria-pressed={viewMode === 'cards'} className={viewMode === 'cards' ? 'is-active' : ''} onClick={() => changeView('cards')} title="Card grid">▦</button>
          </div>
        </div>
      </div>

      <div className="mission-toolbar" style={{ borderColor: `${topic?.color || '#00d4aa'}30` }}>
        <input
          value={filters.query}
          onChange={(event) => updateFilter('query', event.target.value)}
          className="mission-search"
          type="search"
          placeholder="Search missions"
          aria-label="Search missions"
        />
        <select value={scope} onChange={(event) => setScope(event.target.value)} className="mission-select" aria-label="Problem library scope">
          <option value="topic">This topic</option>
          <option value="all">All 150 problems</option>
        </select>
        <select
          value={filters.status}
          onChange={(event) => updateFilter('status', event.target.value)}
          className="mission-select"
          aria-label="Status filter"
        >
          <option value="all">All status</option>
          <option value="unsolved">Fresh</option>
          <option value="attempted">Attempted</option>
          <option value="solved">Solved</option>
          <option value="bookmarked">Bookmarked</option>
        </select>
        <select
          value={filters.difficulty}
          onChange={(event) => updateFilter('difficulty', event.target.value)}
          className="mission-select"
          aria-label="Difficulty filter"
        >
          <option value="all">All difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={filters.capability}
          onChange={(event) => updateFilter('capability', event.target.value)}
          className="mission-select"
          aria-label="Learning mode filter"
        >
          <option value="all">All modes</option>
          <option value="trace">Reference trace-ready</option>
          <option value="visual">Visual-only</option>
        </select>
        <select
          value={filters.sort}
          onChange={(event) => updateFilter('sort', event.target.value)}
          className="mission-select"
          aria-label="Sort missions"
        >
          <option value="recommended">Recommended</option>
          <option value="status">Status</option>
          <option value="difficulty">Difficulty</option>
          <option value="title">Title</option>
        </select>
      </div>

      {!filteredProblems.length && (
        <div className="mission-empty" style={{ borderColor: `${topic?.color || '#00d4aa'}35` }}>
          <b>No matching missions</b>
          <span>Clear a filter or switch topics.</span>
        </div>
      )}

      <div className={`problem-grid is-${viewMode}`}>
      {filteredProblems.map((p, index) => {
        const status = getStatus(p.id);
        const statusColor =
          status === 'solved' ? '#00d4aa' : status === 'attempted' ? '#f5a623' : 'var(--text-muted)';
        const difficultyColor = difficultyColors[p.difficulty] || 'var(--text-secondary)';
        const hasStepTrace = Boolean(TRACER_CONFIGS[p.id]);
        const bookmarked = isBookmarked(p.id);

        return (
          <article
            key={p.id}
            onClick={() => onSelect?.(p)}
            className={viewMode === 'list' ? 'problem-card problem-card--row' : 'problem-card'}
            style={{
              borderColor: status === 'solved' ? '#00d4aa55' : 'var(--border-default)',
              background: status === 'solved' ? 'rgba(0, 212, 170, 0.06)' : 'rgba(17, 24, 39, 0.78)',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor = `${topic?.color || '#00d4aa'}70`;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor =
                status === 'solved' ? '#00d4aa55' : 'var(--border-default)';
            }}
          >
            <div>
              <div className="problem-card__top">
                <span
                  className="problem-card__number mono"
                  style={{
                    color: topic?.color || '#00d4aa',
                    borderColor: `${topic?.color || '#00d4aa'}55`,
                    background: `${topic?.color || '#00d4aa'}12`,
                  }}
                >
                  {String(index + 1).padStart(3, '0')}
                </span>
                <button
                  type="button"
                  aria-label={bookmarked ? `Remove ${p.title} bookmark` : `Bookmark ${p.title}`}
                  title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleBookmark?.(p.id);
                  }}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    padding: 0,
                    borderRadius: '8px',
                    background: bookmarked ? `${topic?.color || '#00d4aa'}18` : 'transparent',
                    color: bookmarked ? topic?.color || '#00d4aa' : 'var(--text-muted)',
                    border: bookmarked
                      ? `1px solid ${(topic?.color || '#00d4aa')}55`
                      : '1px solid var(--border-default)',
                    fontWeight: 900,
                  }}
                >
                  {bookmarked ? '★' : '☆'}
                </button>
              </div>

              <h3><button type="button" className="problem-card__open-button" onClick={(event) => { event.stopPropagation(); onSelect?.(p); }}>{p.title}</button></h3>
              <p className="problem-card__desc">{firstSentence(p.description)}</p>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <Pill color={difficultyColor} filled>
                  {p.difficulty}
                </Pill>
                {isNeetcode150(p.id) && (
                  <Pill color="#00d4aa" filled>
                    NC150
                  </Pill>
                )}
                <Pill color={statusColor} filled>
                  {statusCopy[status]}
                </Pill>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.55rem' }}>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span className="mission-chip">{p.pattern}</span>
                {p.timeO && <span className="mission-chip mono">{p.timeO}</span>}
                {p.spaceO && <span className="mission-chip mono">{p.spaceO}</span>}
              </div>
            </div>

            <div className="problem-card__footer">
              <Pill color={topic?.color || '#00d4aa'} filled>Story</Pill>
              <Pill color={hasStepTrace ? '#4a9eff' : '#8b7cf8'} filled>
                {hasStepTrace ? 'Reference' : 'Visual'}
              </Pill>
              <span
                style={{
                  marginLeft: 'auto',
                  color: topic?.color || '#00d4aa',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                }}
              >
                Open
              </span>
            </div>
          </article>
        );
      })}
      </div>
    </section>
  );
}
