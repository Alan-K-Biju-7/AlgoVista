import React, { useState } from 'react';
import EmptyState from './EmptyState';
const DIFF_COLOR = { Easy: '#00d4aa', Medium: '#f5a623', Hard: '#ff6b6b' };

export default function ProblemList({ topic, problems, onSelect, getStatus }) {
  const [filter, setFilter] = React.useState('All');
  const filtered = filter === 'All' ? problems : problems.filter(p => p.difficulty === filter);
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>{topic.icon} {topic.label}</h2>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{problems.length} problems</p>
      <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.75rem' }}>
        {['All','Easy','Medium','Hard'].map(d => (
          <button key={d} onClick={() => setFilter(d)} style={{ padding:'0.2rem 0.65rem', borderRadius:'999px', border:'none', cursor:'pointer', fontSize:'0.75rem', fontWeight: filter===d?'700':'400', background: filter===d?topic.color+'25':'transparent', color: filter===d?topic.color:'var(--text-muted)' }}>{d}</button>
        ))}
      </div>
      </div>
      {filtered.length === 0 && <EmptyState topicLabel={topic.label} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {filtered.map(p => {
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
              <span style={{ padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', background: 'var(--border-default)', border: '1px solid var(--border-default)' }}>{p.pattern}</span>
              {p.timeO && <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: '600', color: '#4a9eff', background: '#4a9eff12', border: '1px solid #4a9eff30' }}>{p.timeO}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
