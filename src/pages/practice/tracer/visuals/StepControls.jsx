import { useState } from 'react';

export default function StepControls({ currentIdx, total, isPlaying, onPrev, onNext, onPlay, onPause, onReset, topicColor }) {
  const [speed, setSpeed] = useState(700);
  if (total === 0) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {/* reset */}
      <button onClick={onReset} title="Reset" style={{ padding: '0.3rem 0.6rem', borderRadius: '0.35rem', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>⏮</button>
      {/* prev */}
      <button onClick={onPrev} disabled={currentIdx === 0} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.35rem', border: '1px solid var(--border-default)', background: 'transparent', color: currentIdx === 0 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: currentIdx === 0 ? 0.4 : 1 }}>◀</button>
      {/* play/pause */}
      <button onClick={isPlaying ? onPause : () => onPlay(speed)} style={{ padding: '0.3rem 0.85rem', borderRadius: '0.35rem', border: 'none', background: topicColor, color: '#000', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      {/* next */}
      <button onClick={onNext} disabled={currentIdx === total - 1} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.35rem', border: '1px solid var(--border-default)', background: 'transparent', color: currentIdx === total - 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentIdx === total - 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: currentIdx === total - 1 ? 0.4 : 1 }}>▶</button>
      {/* step counter */}
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', minWidth: '50px' }}>
        {currentIdx + 1} / {total}
      </span>
      {/* speed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Speed</span>
        {[1000, 700, 400, 200].map(s => (
          <button key={s} onClick={() => { setSpeed(s); if (isPlaying) { onPause(); setTimeout(() => onPlay(s), 50); } }} style={{ padding: '0.2rem 0.45rem', borderRadius: '0.3rem', border: `1px solid ${speed === s ? topicColor : 'var(--border-default)'}`, background: speed === s ? topicColor + '20' : 'transparent', color: speed === s ? topicColor : 'var(--text-muted)', fontSize: '0.65rem', cursor: 'pointer', fontWeight: speed === s ? '700' : '400' }}>
            {s === 1000 ? '0.5×' : s === 700 ? '1×' : s === 400 ? '2×' : '3×'}
          </button>
        ))}
      </div>
    </div>
  );
}
