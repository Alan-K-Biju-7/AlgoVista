import { useState } from 'react';
import { ALL_PROBLEMS } from './practice/allProblems';
import TopicSidebar from './practice/TopicSidebar';
import ProblemList from './practice/ProblemList';
import ProblemDetail from './practice/ProblemDetail';
import { usePracticeProgress } from './practice/usePracticeProgress';

function ProgressBanner({ allProblems, getStatus }) {
  const all = Object.values(allProblems).flatMap((t) => t.problems);
  const solved = all.filter((p) => getStatus(p.id) === 'solved').length;
  const pct = all.length ? Math.round((solved / all.length) * 100) : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.6rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        marginBottom: '1.5rem',
      }}
    >
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        Overall Progress
      </span>
      <div
        style={{
          flex: 1,
          height: '6px',
          borderRadius: '999px',
          background: 'var(--border-default)',
          overflow: 'hidden',
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
      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#00d4aa' }}>
        {solved}/{all.length}
      </span>
    </div>
  );
}

export default function PracticePage() {
  const [activeTopic, setActiveTopic] = useState('array');
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

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.3rem' }}>
            Practice
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Solve problems, get visual hints, and run your code against test cases.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <ProgressBanner allProblems={ALL_PROBLEMS} getStatus={getStatus} />
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