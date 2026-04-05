import EmptyState from './EmptyState';
const DIFF_COLOR = { Easy: '#00d4aa', Medium: '#f5a623', Hard: '#ff6b6b' };

export default function ProblemList({ topic, problems, onSelect, getStatus }) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>{topic.icon} {topic.label}</h2>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{problems.length} problems</p>
      </div>
      {problems.length === 0 && <EmptyState topicLabel={topic.label} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {problems.map(p => {
          const status = getStatus(p.id);
          return (
            <button key={p.id} onClick={() => onSelect(p)} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.85rem 1rem', borderRadius: '0.6rem',
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
              width: '100%',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = topic.color + '50'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
            >
              <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>
                {status === 'solved' ? '✅' : status === 'attempted' ? '🟡' : '⬜'}
              </span>
              <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>{p.title}</span>
              <span style={{ padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700',
                color: DIFF_COLOR[p.difficulty], background: DIFF_COLOR[p.difficulty] + '18',
                border: `1px solid ${DIFF_COLOR[p.difficulty]}40`,
              }}>{p.difficulty}</span>
              <span style={{ padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600',
                color: 'var(--text-muted)', background: 'var(--border-default)', border: '1px solid var(--border-default)',
              }}>{p.pattern}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
