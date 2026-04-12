import { ALL_PROBLEMS, PHASE_META, getTopicList } from './allProblems';

export default function TopicSidebar({ activeTopic, onSelect, getStatus }) {
  const topics = getTopicList();
  const phases = Object.values(PHASE_META);

  return (
    <aside
      style={{
        width: '210px',
        flexShrink: 0,
        position: 'sticky',
        top: '76px',
        height: 'fit-content',
        alignSelf: 'flex-start',
      }}
    >
      <p
        style={{
          fontSize: '0.68rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
        }}
      >
        Topics
      </p>

      {phases.map((phase) => {
        const phaseTopics = topics.filter((topic) => topic.phase === phase.id);
        if (!phaseTopics.length) return null;

        return (
          <div key={phase.id} style={{ marginBottom: '1.25rem' }}>
            <p
              style={{
                fontSize: '0.63rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
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
                    padding: '0.42rem 0.6rem',
                    borderRadius: '0.45rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? `${topic.color}15` : 'transparent',
                    color: isActive ? topic.color : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? '600' : '400',
                    transition: 'all 0.15s',
                    marginBottom: '0.1rem',
                    borderLeft: isActive
                      ? `2px solid ${topic.color}`
                      : '2px solid transparent',
                  }}
                >
                  <span>
                    {topic.icon} {topic.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
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
