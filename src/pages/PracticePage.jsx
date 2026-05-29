import { useState } from 'react';
import { ALL_PROBLEMS, PHASE_META, getTopicList } from './practice/allProblems';
import TopicSidebar from './practice/TopicSidebar';
import ProblemList from './practice/ProblemList';
import ProblemDetail from './practice/ProblemDetail';
import { usePracticeProgress } from './practice/usePracticeProgress';
import {
  getFocusQueue,
  getDailyTrainingPlan,
  getDifficultySummaries,
  getMasterySignal,
  getPhaseSummaries,
  getProgressSummary,
  getRecommendedProblem,
  getReviewQueue,
} from './practice/practicePlanner';
import './practice/PracticeExperience.css';

function PracticeCommandCenter({
  allProblems,
  getStatus,
  isBookmarked,
  onSelectProblem,
  exportSnapshot,
  importSnapshot,
  resetPracticeData,
}) {
  const [snapshotText, setSnapshotText] = useState('');
  const [transferMessage, setTransferMessage] = useState('');
  const mastery = getMasterySignal(allProblems, getStatus);
  const difficultySummaries = getDifficultySummaries(allProblems, getStatus);
  const reviewQueue = getReviewQueue(allProblems, getStatus, isBookmarked, 5);
  const dailyPlan = getDailyTrainingPlan(allProblems, getStatus, isBookmarked);

  const handleExport = () => {
    setSnapshotText(JSON.stringify(exportSnapshot(), null, 2));
    setTransferMessage('Snapshot ready.');
  };

  const handleImport = () => {
    try {
      importSnapshot(snapshotText);
      setTransferMessage('Snapshot imported.');
    } catch (error) {
      setTransferMessage(`Import failed: ${error.message}`);
    }
  };

  const handleReset = () => {
    resetPracticeData();
    setSnapshotText('');
    setTransferMessage('Local practice progress reset.');
  };

  return (
    <section className="practice-command-center" aria-label="Practice command center">
      <div className="practice-command-center__summary">
        <div>
          <p className="mission-kicker" style={{ color: '#00d4aa' }}>Mastery Signal</p>
          <h2>{mastery.score}% - {mastery.label}</h2>
          <span>{mastery.nextMilestone}</span>
        </div>
        <div className="practice-command-center__dial" aria-label={`${mastery.score}% mastery`}>
          <b>{mastery.score}</b>
          <span>/100</span>
        </div>
      </div>

      <div className="practice-command-center__grid">
        <article className="practice-command-card">
          <p className="mission-kicker">Difficulty Coverage</p>
          <div className="practice-difficulty-stack">
            {difficultySummaries.map((item) => (
              <div key={item.difficulty} className="practice-difficulty-row">
                <div>
                  <b>{item.difficulty}</b>
                  <span>{item.solved}/{item.total} solved - {item.attempted} active</span>
                </div>
                <div className="practice-sidebar-progress" aria-hidden="true">
                  <span style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="practice-command-card">
          <p className="mission-kicker">Review Queue</p>
          <div className="practice-review-list">
            {reviewQueue.map((problem) => (
              <button key={problem.id} type="button" onClick={() => onSelectProblem(problem)}>
                <span>{getStatus(problem.id) === 'attempted' ? 'Resume' : isBookmarked(problem.id) ? 'Bookmark' : 'Review'}</span>
                <b>{problem.title}</b>
                <i>{problem.difficulty}</i>
              </button>
            ))}
          </div>
        </article>

        <article className="practice-command-card practice-command-card--wide">
          <div className="practice-card-head">
            <div>
              <p className="mission-kicker">Today's Training Plan</p>
              <h3>One focused session, no decision fatigue.</h3>
            </div>
          </div>
          <div className="practice-plan-grid">
            {dailyPlan.map((item) => (
              <button key={item.id} type="button" onClick={() => onSelectProblem(item.problem)}>
                <span>{item.duration}</span>
                <b>{item.label}</b>
                <strong>{item.problem.title}</strong>
                <i>{item.reason}</i>
              </button>
            ))}
          </div>
        </article>

        <article className="practice-command-card practice-command-card--wide">
          <div className="practice-card-head">
            <div>
              <p className="mission-kicker">Progress Portability</p>
              <h3>Back up or move your local practice state.</h3>
            </div>
            <div className="practice-transfer-actions">
              <button type="button" onClick={handleExport}>Export</button>
              <button type="button" onClick={handleImport} disabled={!snapshotText.trim()}>Import</button>
              <button type="button" onClick={handleReset}>Reset</button>
            </div>
          </div>
          <textarea
            className="practice-snapshot-box"
            value={snapshotText}
            onChange={(event) => setSnapshotText(event.target.value)}
            rows="5"
            aria-label="Practice progress snapshot"
            placeholder="Export creates a JSON snapshot here. Paste one here to import."
          />
          {transferMessage && <p className="practice-transfer-message">{transferMessage}</p>}
        </article>
      </div>
    </section>
  );
}

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
    exportSnapshot,
    importSnapshot,
    resetPracticeData,
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

  const selectProblem = (problem) => {
    setActiveProblem(problem);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
    }
  };

  return (
    <div className={activeProblem ? 'practice-shell practice-shell--detail' : 'practice-shell'}>
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
            onNextProblem={nextProblem ? () => selectProblem(nextProblem) : null}
          />
        ) : (
          <>
            <MissionControl
              allProblems={ALL_PROBLEMS}
              topic={topic}
              getStatus={getStatus}
              onSelectProblem={selectProblem}
            />
            <PracticeCommandCenter
              allProblems={ALL_PROBLEMS}
              getStatus={getStatus}
              isBookmarked={isBookmarked}
              onSelectProblem={selectProblem}
              exportSnapshot={exportSnapshot}
              importSnapshot={importSnapshot}
              resetPracticeData={resetPracticeData}
            />
            <ProblemList
              topic={topic}
              problems={topic.problems}
              onSelect={selectProblem}
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
