import { useState } from 'react';
import { ALL_PROBLEMS, PHASE_META, getTopicList } from './practice/allProblems';
import TopicSidebar from './practice/TopicSidebar';
import ProblemList from './practice/ProblemList';
import ProblemDetail from './practice/ProblemDetail';
import { usePracticeProgress } from './practice/usePracticeProgress';
import {
  getFocusQueue,
  getPhaseSummaries,
  getProgressSummary,
  getRecommendedProblem,
} from './practice/practicePlanner';
import './practice/PracticeExperience.css';

function MissionControl({ allProblems, topic, getStatus, onSelectProblem }) {
  const { all, solved, attempted, fresh, pct } = getProgressSummary(allProblems, getStatus);
  const nextProblem = getRecommendedProblem({ allProblems, topic, getStatus });
  const topics = getTopicList();
  const phases = getPhaseSummaries(PHASE_META, topics, getStatus);
  const queue = getFocusQueue(topic, getStatus, 3);

  return (
    <section className="mission-control">
      <div className="mission-panel" style={{ borderColor: `${topic.color}34` }}>
        <div className="mission-panel__top">
          <div>
            <div className="mission-kicker" style={{ color: topic.color }}>
              Story Mode Learning Path
            </div>
            <h1>Build intuition first. Then code with confidence.</h1>
            <p>
              {all.length} curated missions with visual models, executable tests, traces,
              hints, and a story-mode walkthrough for the mental model behind each pattern.
            </p>
          </div>
          <span className="mission-chip" style={{ color: topic.color, borderColor: `${topic.color}55` }}>
            {pct}% complete
          </span>
        </div>

        <div className="mission-stat-grid">
          <div className="mission-stat">
            <b>{solved}</b>
            <span>Solved</span>
          </div>
          <div className="mission-stat">
            <b>{attempted}</b>
            <span>Attempted</span>
          </div>
          <div className="mission-stat">
            <b>{fresh}</b>
            <span>Fresh</span>
          </div>
          <div className="mission-stat">
            <b>{topic.problems.length}</b>
            <span>{topic.label}</span>
          </div>
        </div>

        <div className="mission-phase-map">
          {phases.map((phase) => (
            <div key={phase.id} className="mission-phase" style={{ borderColor: `${phase.color}35` }}>
              <span style={{ color: phase.color }}>{phase.id}</span>
              <b>{phase.label}</b>
              <div className="practice-sidebar-progress">
                <span
                  style={{
                    width: `${phase.total ? Math.round((phase.solved / phase.total) * 100) : 0}%`,
                    background: phase.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mission-queue">
          {queue.map((problem) => (
            <button
              key={problem.id}
              type="button"
              onClick={() => onSelectProblem(problem)}
              style={{ borderColor: `${topic.color}35` }}
            >
              <span>{getStatus(problem.id) === 'attempted' ? 'Resume' : 'Start'}</span>
              <b>{problem.title}</b>
              <i>{problem.difficulty}</i>
            </button>
          ))}
        </div>
      </div>

      <div className="mission-next" style={{ borderColor: `${topic.color}34` }}>
        <div>
          <div className="mission-kicker" style={{ color: topic.color }}>
            Recommended Next
          </div>
          <h2>{nextProblem?.title || 'Choose any mission'}</h2>
          <p>
            Start in story mode, predict the invariant, then move to editor and tests.
          </p>
        </div>

        {nextProblem && (
          <>
            <div className="mission-next__meta">
              <span className="mission-chip">{nextProblem.difficulty}</span>
              <span className="mission-chip">{nextProblem.pattern}</span>
              {nextProblem.timeO && <span className="mission-chip">{nextProblem.timeO}</span>}
            </div>
            <button
              type="button"
              onClick={() => onSelectProblem(nextProblem)}
              style={{
                background: topic.color,
                borderColor: topic.color,
                color: '#031a14',
                fontWeight: 900,
              }}
            >
              Enter Story Mode
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default function PracticePage() {
  const [activeTopic, setActiveTopic] = useState('arrays-hashing');
  const [activeProblem, setActiveProblem] = useState(null);

  const {
    markSolved,
    markAttempted,
    getStatus,
    toggleBookmark,
    isBookmarked,
  } = usePracticeProgress();

  const topic = ALL_PROBLEMS[activeTopic] || ALL_PROBLEMS['arrays-hashing'];
  const nextProblem = activeProblem
    ? getRecommendedProblem({
        allProblems: ALL_PROBLEMS,
        topic,
        getStatus,
        currentProblemId: activeProblem.id,
      })
    : null;

  return (
    <div className="practice-shell">
      <TopicSidebar
        activeTopic={activeTopic}
        onSelect={(id) => {
          setActiveTopic(id);
          setActiveProblem(null);
        }}
        getStatus={getStatus}
      />

      <div className="practice-main">
        {activeProblem ? (
          <ProblemDetail
            problem={activeProblem}
            topicColor={topic.color}
            onBack={() => setActiveProblem(null)}
            onSolved={markSolved}
            onAttempted={markAttempted}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
            status={getStatus(activeProblem.id)}
            nextProblem={nextProblem}
            onNextProblem={nextProblem ? () => setActiveProblem(nextProblem) : null}
          />
        ) : (
          <>
            <MissionControl
              allProblems={ALL_PROBLEMS}
              topic={topic}
              getStatus={getStatus}
              onSelectProblem={setActiveProblem}
            />
            <ProblemList
              topic={topic}
              problems={topic.problems}
              onSelect={setActiveProblem}
              getStatus={getStatus}
              isBookmarked={isBookmarked}
              toggleBookmark={toggleBookmark}
            />
          </>
        )}
      </div>
    </div>
  );
}
