import { useState } from 'react';

const OPTIONS = [
  { id: 'shaky', label: 'Need another pass', copy: 'Review tomorrow', icon: '↻' },
  { id: 'developing', label: 'I see the pattern', copy: 'Review in 3 days', icon: '◐' },
  { id: 'confident', label: 'I could teach it', copy: 'Review in 7 days', icon: '◆' },
];

export default function LearningDebrief({ record, onReflect, color = '#00d4aa' }) {
  const [selected, setSelected] = useState(record?.confidence || null);
  const [explanation, setExplanation] = useState(record?.explanation || '');
  const [prompt, setPrompt] = useState('');

  const choose = (confidence) => {
    if (explanation.trim().length < 12) {
      setPrompt('Write one clear sentence first—retrieval is the learning step.');
      return;
    }
    setSelected(confidence);
    setPrompt('');
    onReflect?.({ confidence, explanation: explanation.trim() });
  };

  return (
    <section className="learning-debrief" style={{ borderColor: `${color}45` }}>
      <div className="learning-debrief__copy">
        <p style={{ color }}>Make the solve stick</p>
        <h3>Could you explain the invariant without looking at your code?</h3>
        <span>Accepted measures correctness now. Your answer schedules the recall that builds long-term mastery.</span>
      </div>
      <label className="learning-debrief__explanation"><span>Your invariant, from memory</span><textarea rows="2" value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="After each step, what must still be true?" aria-label="Explain the invariant from memory" /></label>
      <div className="learning-debrief__options">
        {OPTIONS.map((option) => (
          <button key={option.id} type="button" onClick={() => choose(option.id)} className={selected === option.id ? 'is-active' : ''} style={selected === option.id ? { borderColor: color, color } : null}>
            <i>{option.icon}</i><span><b>{option.label}</b><small>{option.copy}</small></span>
          </button>
        ))}
      </div>
      {prompt && <p className="learning-debrief__prompt" role="alert">{prompt}</p>}
      {selected && <p className="learning-debrief__saved">Review scheduled. Mastery means retrieving the idea later—not only passing once.</p>}
    </section>
  );
}
