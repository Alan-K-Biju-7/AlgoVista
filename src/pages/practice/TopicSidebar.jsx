import { ALL_PROBLEMS } from './allProblems';
import { usePracticeProgress } from './usePracticeProgress';

export default function TopicSidebar({ activeTopic, onSelect, getStatus }) {
  const phases = [
    { id: 'P1', label: 'Linear DS',        color: '#00d4aa' },
    { id: 'P2', label: 'Trees & Graphs',   color: '#4a9eff' },
    { id: 'P3', label: 'Search & Sort',    color: '#8b7cf8' },
    { id: 'P4', label: 'Graph Algorithms', color: '#f5a623' },
  ];
  return (
    <aside style={{ width: '210px', flexShrink: 0, position: 'sticky', top: '76px', height: 'fit-content', alignSelf: 'flex-start' }}>
      <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Topics</p>
      {phases.map(ph => {
        const topics = Object.entries(ALL_PROBLEMS).filter(([,v]) => v.phase === ph.id);
        if (!topics.length) return null;
        return (
          <div key={ph.id} style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.63rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: ph.color, marginBottom: '0.35rem', paddingLeft: '0.5rem' }}>{ph.label}</p>
            {topics.map(([id, topic]) => {
              const solved = topic.problems.filter(p => getStatus(p.id) === 'solved').length;
              const isActive = activeTopic === id;
              return (
                <button key={id} onClick={() => onSelect(id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', textAlign: 'left', padding: '0.42rem 0.6rem',
                  borderRadius: '0.45rem', border: 'none', cursor: 'pointer',
                  background: isActive ? `${topic.color}15` : 'transparent',
                  color: isActive ? topic.color : 'var(--text-muted)',
                  fontSize: '0.82rem', fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.15s', marginBottom: '0.1rem',
                  borderLeft: isActive ? `2px solid ${topic.color}` : '2px solid transparent',
                }}>
                  <span>{topic.icon} {topic.label}</span>
                  <span style={{ fontSize: '0.68rem', color: solved > 0 ? '#00d4aa' : 'var(--text-muted)' }}>{solved}/{topic.problems.length}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}
