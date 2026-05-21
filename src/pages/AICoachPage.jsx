import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { NEETCODE_TOPICS } from './practice/neetcode150';
import './AICoachPage.css';

const modes = [
  {
    id: 'explain',
    label: 'Explain',
    title: 'Concept explanation',
    intent: 'Break the topic into a mental model, invariant, and visual trace.',
  },
  {
    id: 'trace',
    label: 'Trace',
    title: 'Step-by-step trace',
    intent: 'Walk through a tiny example and show how the state changes.',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    title: 'Socratic check',
    intent: 'Ask short questions that reveal whether the concept is solid.',
  },
  {
    id: 'debug',
    label: 'Debug',
    title: 'Bug diagnosis',
    intent: 'Convert a wrong answer into a boundary, state, or complexity fix.',
  },
  {
    id: 'plan',
    label: 'Plan',
    title: 'Study sprint',
    intent: 'Generate a focused session with concepts, visuals, and problems.',
  },
];

const tracks = [
  {
    id: 'arrays',
    label: 'Arrays & Hashing',
    topicId: 'nc-arrays-hashing',
    simulator: '/simulator#array',
    accent: '#00d4aa',
    invariant: 'Every index has a role: scanned, candidate, window, or answer.',
    lesson: 'Start with brute force, name repeated work, then store the state you keep recomputing.',
    visual: ['scan index', 'hash map state', 'answer update'],
    quiz: ['What does the hash map store?', 'When is the answer allowed to change?', 'Which duplicate work disappeared?'],
  },
  {
    id: 'binary',
    label: 'Binary Search',
    topicId: 'nc-binary-search',
    simulator: '/simulator#bsearch',
    accent: '#8b7cf8',
    invariant: 'low and high describe the only range where the answer can still live.',
    lesson: 'Binary search is not about the middle. It is about proving one half impossible.',
    visual: ['low/high range', 'mid test', 'discarded half'],
    quiz: ['Is high inclusive or exclusive?', 'What condition discards the left half?', 'Why must the loop terminate?'],
  },
  {
    id: 'graphs',
    label: 'Graphs',
    topicId: 'nc-graphs',
    simulator: '/simulator#graph',
    accent: '#4a9eff',
    invariant: 'Visited means this node has already been accounted for by the traversal rule.',
    lesson: 'Choose BFS for layers and shortest unweighted paths; choose DFS for depth, cycles, and components.',
    visual: ['frontier', 'visited set', 'parent path'],
    quiz: ['What enters the queue first?', 'When do you mark visited?', 'What does parent reconstruction prove?'],
  },
  {
    id: 'trees',
    label: 'Trees',
    topicId: 'nc-trees',
    simulator: '/simulator#bst',
    accent: '#00d4aa',
    invariant: 'Each recursive call owns a subtree and returns one fact about it.',
    lesson: 'Tree problems become simpler when you define exactly what a node needs from its children.',
    visual: ['left answer', 'right answer', 'combine at root'],
    quiz: ['What does the function return?', 'What is the null-node base case?', 'Where is the global answer updated?'],
  },
  {
    id: 'heap',
    label: 'Heap / Priority Queue',
    topicId: 'nc-heap',
    simulator: '/simulator#heap',
    accent: '#f5a623',
    invariant: 'The next item popped is always the best item according to the priority rule.',
    lesson: 'Use a heap when repeated min or max selection is the expensive part of the brute force.',
    visual: ['push candidate', 'bubble priority', 'pop best'],
    quiz: ['What is the priority key?', 'Can stale entries appear?', 'What is the heap size bound?'],
  },
  {
    id: 'dp',
    label: 'Dynamic Programming',
    topicId: 'nc-dp',
    simulator: '/practice',
    accent: '#8b7cf8',
    invariant: 'A state is a reusable answer to a smaller version of the same decision.',
    lesson: 'Define state, transition, base case, and evaluation order before writing code.',
    visual: ['state meaning', 'transition choice', 'memo/table fill'],
    quiz: ['What does dp[i] mean?', 'Which smaller states are needed?', 'What is the base case?'],
  },
];

const responses = {
  explain: {
    heading: 'Teach it like a mental model',
    points: ['Name the invariant in one sentence.', 'Attach each variable to that invariant.', 'Use one tiny example before coding.'],
  },
  trace: {
    heading: 'Replay the algorithm state',
    points: ['Freeze the initial state.', 'Move exactly one pointer, node, or queue item per step.', 'Say why the move is legal.'],
  },
  quiz: {
    heading: 'Check understanding quickly',
    points: ['Ask what each variable means.', 'Ask what breaks the loop.', 'Ask which input attacks the edge case.'],
  },
  debug: {
    heading: 'Find the wrong assumption',
    points: ['Compare expected state versus actual state.', 'Look for off-by-one, stale state, or missing base case.', 'Patch the invariant, then patch code.'],
  },
  plan: {
    heading: 'Run a focused study sprint',
    points: ['Spend 10 minutes on the concept.', 'Spend 15 minutes in the simulator.', 'Solve 3 related problems and review mistakes.'],
  },
};

function getTopicProblems(topicId) {
  const topic = NEETCODE_TOPICS.find((item) => item.id === topicId);
  return topic?.problems?.slice(0, 4) || [];
}

function VisualState({ track }) {
  return (
    <div className="ai-visual-state" style={{ '--ai-accent': track.accent }}>
      {track.visual.map((item, index) => (
        <div key={item} className="ai-visual-state__node">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{item}</strong>
        </div>
      ))}
    </div>
  );
}

export default function AICoachPage() {
  const [activeMode, setActiveMode] = useState('explain');
  const [activeTrack, setActiveTrack] = useState('binary');
  const [studentPrompt, setStudentPrompt] = useState(
    'I understand the idea, but I lose track of the boundary cases when I code.'
  );

  const mode = modes.find((item) => item.id === activeMode) || modes[0];
  const track = tracks.find((item) => item.id === activeTrack) || tracks[0];
  const topicProblems = useMemo(() => getTopicProblems(track.topicId), [track.topicId]);
  const response = responses[activeMode] || responses.explain;

  return (
    <div className="ai-page">
      <section className="ai-hero">
        <div>
          <span className="ai-kicker">AI teaching mode</span>
          <h1>AI Coach</h1>
          <p>
            A guided tutor layer for DSA: explain the concept, trace the state,
            quiz the invariant, debug the mistake, and turn the next study session
            into a clear plan.
          </p>
        </div>
        <div className="ai-hero__links">
          <Link to="/simulator" className="ai-button ai-button--primary">Open simulator</Link>
          <Link to="/practice" className="ai-button ai-button--ghost">Open practice</Link>
        </div>
      </section>

      <section className="ai-workspace">
        <aside className="ai-console">
          <div className="ai-console__section">
            <span className="ai-console__label">Coach mode</span>
            <div className="ai-mode-grid">
              {modes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === activeMode ? 'is-active' : ''}
                  onClick={() => setActiveMode(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-console__section">
            <span className="ai-console__label">Focus concept</span>
            <div className="ai-track-list">
              {tracks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === activeTrack ? 'is-active' : ''}
                  style={{ '--ai-accent': item.accent }}
                  onClick={() => setActiveTrack(item.id)}
                >
                  <span />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-console__section">
            <label htmlFor="student-prompt" className="ai-console__label">Student prompt</label>
            <textarea
              id="student-prompt"
              value={studentPrompt}
              rows={5}
              onChange={(event) => setStudentPrompt(event.target.value)}
            />
          </div>
        </aside>

        <main className="ai-response" style={{ '--ai-accent': track.accent }}>
          <div className="ai-response__top">
            <div>
              <span className="ai-kicker">{mode.label} mode</span>
              <h2>{mode.title}: {track.label}</h2>
              <p>{mode.intent}</p>
            </div>
            <Link to={track.simulator} className="ai-button ai-button--small">
              Visualize topic
            </Link>
          </div>

          <div className="ai-response__prompt">
            <span>Student says</span>
            <p>{studentPrompt}</p>
          </div>

          <div className="ai-response__grid">
            <article className="ai-card ai-card--wide">
              <span className="ai-card__label">{response.heading}</span>
              <h3>{track.invariant}</h3>
              <p>{track.lesson}</p>
              <ul>
                {response.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>

            <article className="ai-card">
              <span className="ai-card__label">Visual state</span>
              <VisualState track={track} />
            </article>
          </div>

          <div className="ai-lower-grid">
            <article className="ai-card">
              <span className="ai-card__label">Quiz checks</span>
              <div className="ai-question-list">
                {track.quiz.map((question) => (
                  <p key={question}>{question}</p>
                ))}
              </div>
            </article>

            <article className="ai-card">
              <span className="ai-card__label">Practice next</span>
              <div className="ai-problem-list">
                {topicProblems.map((problem) => (
                  <div key={problem.id}>
                    <strong>{problem.title}</strong>
                    <span>{problem.difficulty || 'Practice'}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="ai-card">
              <span className="ai-card__label">Session script</span>
              <ol className="ai-session-list">
                <li>Explain the invariant out loud.</li>
                <li>Trace one small input in the visualizer.</li>
                <li>Solve one easy and one medium problem.</li>
                <li>Write the bug or insight in one sentence.</li>
              </ol>
            </article>
          </div>
        </main>
      </section>
    </div>
  );
}
