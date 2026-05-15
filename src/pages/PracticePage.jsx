import { useState } from 'react';
import { ALL_PROBLEMS } from './practice/allProblems';
import TopicSidebar from './practice/TopicSidebar';
import ProblemList from './practice/ProblemList';
import ProblemDetail from './practice/ProblemDetail';
import { usePracticeProgress } from './practice/usePracticeProgress';
import { NEETCODE150 } from './practice/neetcode150';

function PracticeScoreboard({ getStatus }) {
  const solved = NEETCODE150.filter((p) => getStatus(p.id) === 'solved').length;
  const attempted = NEETCODE150.filter((p) => getStatus(p.id) === 'attempted').length;
  const total = NEETCODE150.length;
  const pct = total ? Math.round((solved / total) * 100) : 0;
  const score = solved * 10 + attempted * 3;

  return (
    <div
      className="practice-scoreboard"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 1.4fr) repeat(3, minmax(120px, 0.45fr))',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: '0.85rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        marginBottom: '1.5rem',
      }}
    >
      <div>
        <p style={{ fontSize: '0.72rem', fontWeight: '800', color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
          Curated NeetCode 150 track
        </p>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Practice score: {score}</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Solve curated problems with examples, hints, visualizer links, traces where available, and saved progress.
        </p>
        <div
          style={{
            height: '7px',
            borderRadius: '999px',
            background: 'var(--border-default)',
            overflow: 'hidden',
            marginTop: '0.85rem',
          }}
        >
          <div
            style={{
              height: '100%',
              width: pct + '%',
              background: '#00d4aa',
              borderRadius: '999px',
              transition: 'width 0.4s',
            }}
          />
        </div>
      </div>

      {[
        { label: 'Solved', value: `${solved}/${total}` },
        { label: 'Attempted', value: attempted },
        { label: 'Completion', value: `${pct}%` },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            border: '1px solid var(--border-default)',
            borderRadius: '0.75rem',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>
            {item.label}
          </span>
          <span style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '900', marginTop: '0.3rem' }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PracticePage() {
  const [activeTopic, setActiveTopic] = useState('nc-arrays-hashing');
  const [activeProblem, setActiveProblem] = useState(null);

  const {
    markSolved,
    markAttempted,
    getStatus,
    toggleBookmark,
    isBookmarked,
  } = usePracticeProgress();

  const topic = ALL_PROBLEMS[activeTopic] || ALL_PROBLEMS.array;

  return (
    <div
      className="practice-shell"
      style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        gap: '1.75rem',
      }}
    >
      <TopicSidebar
        activeTopic={activeTopic}
        onSelect={(id) => {
          setActiveTopic(id);
          setActiveProblem(null);
        }}
        getStatus={getStatus}
      />

      <div className="practice-content" style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge-teal" style={{ marginBottom: '0.85rem' }}>NC150 Practice</span>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '900', marginBottom: '0.35rem' }}>
            Curated NeetCode 150 Practice
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Build score by solving curated interview patterns with explanations, test cases, and visual support.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <PracticeScoreboard getStatus={getStatus} />
          </div>
        </div>

        {activeProblem ? (
          <ProblemDetail
            problem={activeProblem}
            topicColor={topic.color}
            onBack={() => setActiveProblem(null)}
            onSolved={markSolved}
            onAttempted={markAttempted}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
          />
        ) : (
          <ProblemList
            topic={topic}
            problems={topic.problems}
            onSelect={setActiveProblem}
            getStatus={getStatus}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
          />
        )}
      </div>
    </div>
  );
}
