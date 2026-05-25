import { PHASE_META, getTopicList } from './allProblems';
export default function TopicSidebar({ activeTopic, onSelect, getStatus }) {
  const topics = getTopicList();
  const phases = Object.values(PHASE_META);
  const totalSolved = topics.flatMap((topic) => topic.problems).filter(
    (problem) => getStatus(problem.id) === 'solved'
  ).length;
  const totalProblems = topics.reduce((sum, topic) => sum + topic.problems.length, 0);

  return (
    <aside
      className="practice-sidebar"
      style={{
        alignSelf: 'flex-start',
      }}
    >
      <div className="practice-sidebar-panel" style={{ marginBottom: '0.9rem' }}>
        <p
          style={{
            fontSize: '0.68rem',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: 0,
            color: 'var(--text-muted)',
            marginBottom: '0.35rem',
          }}
        >
          Learning Map
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>NeetCode 150</strong>
          <span style={{ color: '#00d4aa', fontWeight: 900 }}>{totalSolved}/{totalProblems}</span>
        </div>
        <div className="practice-sidebar-progress">
          <span
            style={{
              width: `${totalProblems ? Math.round((totalSolved / totalProblems) * 100) : 0}%`,
              background: '#00d4aa',
            }}
          />
        </div>
      </div>

      {phases.map((phase) => {
        const phaseTopics = topics.filter((topic) => topic.phase === phase.id);
        if (!phaseTopics.length) return null;

        return (
          <div key={phase.id} style={{ marginBottom: '1.25rem' }}>
            <p
              style={{
                fontSize: '0.63rem',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: 0,
                color: phase.color,
                marginBottom: '0.35rem',
                paddingLeft: '0.5rem',
              }}
            >
              {phase.label}
            </p>

            {phaseTopics.map((topic) => {
              const solved = topic.problems.filter(
                (p) => getStatus(p.id) === 'solved'
              ).length;
              const isActive = activeTopic === topic.id;

              return (
                <button
                  key={topic.id}
                  onClick={() => onSelect(topic.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.55rem 0.62rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? `${topic.color}15` : 'transparent',
                    color: isActive ? topic.color : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? '850' : '650',
                    transition: 'all 0.15s',
                    marginBottom: '0.1rem',
                    boxShadow: isActive
                      ? `inset 0 0 0 1px ${topic.color}40`
                      : 'inset 0 0 0 1px transparent',
                  }}
                >
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {topic.icon} {topic.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      color: solved > 0 ? '#00d4aa' : 'var(--text-muted)',
                    }}
                  >
                    {solved}/{topic.problems.length || 0}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}
