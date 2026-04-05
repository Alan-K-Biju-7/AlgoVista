import { useState } from 'react';
import { ALL_PROBLEMS } from './practice/allProblems';
import TopicSidebar from './practice/TopicSidebar';
import ProblemList from './practice/ProblemList';
import ProblemDetail from './practice/ProblemDetail';
import { usePracticeProgress } from './practice/usePracticeProgress';

export default function PracticePage() {
  const [activeTopic,   setActiveTopic]   = useState('array');
  const [activeProblem, setActiveProblem] = useState(null);
  const { markSolved, markAttempted, getStatus } = usePracticeProgress();

  const topic = ALL_PROBLEMS[activeTopic];

  return (
    <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', gap: '1.75rem' }}>
      <TopicSidebar activeTopic={activeTopic} onSelect={id => { setActiveTopic(id); setActiveProblem(null); }} getStatus={getStatus} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.3rem' }}>Practice</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Solve problems, get visual hints, and run your code against test cases.</p>
        </div>
        {activeProblem ? (
          <ProblemDetail
            problem={activeProblem}
            topicColor={topic.color}
            onBack={() => setActiveProblem(null)}
            onSolved={markSolved}
            onAttempted={markAttempted}
          />
        ) : (
          <ProblemList
            topic={topic}
            problems={topic.problems}
            onSelect={setActiveProblem}
            getStatus={getStatus}
          />
        )}
      </div>
    </div>
  );
}
