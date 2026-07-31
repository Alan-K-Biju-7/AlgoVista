const MODES = [
  {
    id: 'learn',
    eyebrow: 'Understand',
    label: 'Learn mode',
    description: 'Story, visual model, hint ladder, then code.',
    icon: '◇',
  },
  {
    id: 'focus',
    eyebrow: 'Simulate',
    label: 'Focus mode',
    description: 'Editor first, clean workspace, visible timer.',
    icon: '⌁',
  },
  {
    id: 'review',
    eyebrow: 'Remember',
    label: 'Review mode',
    description: 'Recall solved patterns before they fade.',
    icon: '↻',
  },
];

function recentDays(activity, count = 14) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (count - 1 - index));
    const key = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
    return { key, count: Number(activity?.[key]) || 0, label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
  });
}

export default function PracticeModeBar({ mode, onChange, activity = {}, dueCount = 0 }) {
  const days = recentDays(activity);
  return (
    <section className="practice-mode-bar" aria-label="Choose a practice style">
      <div className="practice-mode-copy">
        <p className="mission-kicker">How do you want to train?</p>
        <h1>Practice with intent, not autopilot.</h1>
        <span>AlgoVista adapts the workspace to understanding, interview simulation, or spaced recall.</span>
      </div>
      <div className="practice-mode-options">
        {MODES.map((item) => (
          <button key={item.id} type="button" className={mode === item.id ? 'is-active' : ''} aria-pressed={mode === item.id} onClick={() => onChange(item.id)}>
            <i>{item.icon}</i>
            <span><small>{item.eyebrow}</small><b>{item.label}</b><em>{item.description}</em></span>
            {item.id === 'review' && dueCount > 0 && <strong>{dueCount} due</strong>}
          </button>
        ))}
      </div>
      <div className="practice-activity" aria-label="Last 14 days practice activity">
        <div><b>Consistency</b><span>{days.filter((day) => day.count > 0).length}/14 active days</span></div>
        <div className="practice-activity__cells">
          {days.map((day) => <i key={day.key} title={`${day.label}: ${day.count} practice events`} className={day.count >= 3 ? 'level-3' : day.count === 2 ? 'level-2' : day.count === 1 ? 'level-1' : ''} />)}
        </div>
      </div>
    </section>
  );
}
