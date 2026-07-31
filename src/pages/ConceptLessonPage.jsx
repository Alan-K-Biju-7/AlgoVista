import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import VisualConceptStudio from '../components/learning';
import { useAuth } from '../context/AuthContext';
import {
  DSA_BEGINNER_CONCEPTS,
  getBeginnerConceptById,
  getBeginnerSectionById,
} from '../data/dsaBeginnersCurriculum';
import { getConceptLesson } from '../data/conceptLessonContent';
import { buildLessonSimulation } from './lessonSimulation';
import './ConceptLessonPage.css';

const statusMeta = {
  'not-started': { label: 'Not started', confidence: 0 },
  learning: { label: 'Learning', confidence: 35 },
  confident: { label: 'Confident', confidence: 70 },
  mastered: { label: 'Mastered', confidence: 100 },
};

const visualValues = {
  complexity: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
  'array-memory': [12, 18, 25, 31, 44],
  'array-traversal': [4, 1, 7, 3, 9, 2],
  'array-shift': [3, 6, 'gap', 9, 12],
  'linear-search': [8, 4, 9, 2, 6],
  'binary-search': [2, 5, 8, 12, 16, 23, 31],
  'ternary-search': [1, 4, 9, 12, 8, 3, 2],
  'two-pointers': [1, 2, 4, 6, 9],
  'prefix-sum': [0, 2, 6, 7, 14],
  'sliding-window': [2, 1, 5, 1, 3, 2],
  kadane: [-2, 3, -1, 5, -6],
  'matrix-boundaries': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  'sorted-matrix-search': [1, 4, 7, 11, 2, 5, 8, 12, 3, 6, 9, 16, 10, 13, 14, 20],
};

const kindModels = {
  foundation: ['Define', 'Example', 'Connect', 'Explain'],
  array: ['Index', 'Value', 'State', 'Answer'],
  string: ['Character', 'Window', 'Pattern', 'Match'],
  recursion: ['Choice', 'Smaller call', 'Base case', 'Return'],
  'linked-list': ['Head', 'Current', 'Next', 'Tail'],
  stack: ['Bottom', 'Pending work', 'Top', 'Output'],
  queue: ['Front', 'Waiting work', 'Back', 'Output'],
  hashing: ['Key', 'Hash', 'Bucket', 'Value'],
  sorting: ['Input', 'Compare', 'Reorder', 'Sorted'],
  tree: ['Root', 'Branch', 'Leaf', 'Result'],
  graph: ['Source', 'Frontier', 'Visited', 'Result'],
  greedy: ['Candidates', 'Safe choice', 'Proof', 'Answer'],
  dp: ['State', 'Base case', 'Transition', 'Answer'],
  bits: ['Value', 'Mask', 'Operator', 'Result'],
  divide: ['Problem', 'Split', 'Solve', 'Combine'],
};

function modelItemsFor(lesson) {
  const values = visualValues[lesson.visual] || kindModels[lesson.kind] || kindModels.foundation;
  return values.map((value, index) => ({
    id: String(index),
    value: String(value),
    label: `State ${index + 1}`,
  }));
}

function getNeighborConcept(concept, offset) {
  const index = DSA_BEGINNER_CONCEPTS.findIndex((item) => item.id === concept.id);
  if (index === -1) return null;
  return DSA_BEGINNER_CONCEPTS[index + offset] || null;
}

function getRelatedSimulatorId(concept) {
  const title = concept.title.toLowerCase();
  const exactMatches = [
    [['bellman-ford'], 'bellmanford'],
    [['dijkstra'], 'dijkstra'],
    [['quick sort'], 'quicksort'],
    [['merge sort'], 'mergesort'],
    [['bubble sort'], 'bubble'],
    [['insertion sort'], 'insertion'],
    [['selection sort'], 'selection'],
    [['binary search'], 'bsearch'],
    [['avl'], 'avl'],
    [['trie'], 'trie'],
    [['heap', 'priority queue'], 'heap'],
    [['binary search tree', 'bst'], 'bst'],
  ];
  const exact = exactMatches.find(([terms]) => terms.some((term) => title.includes(term)));
  if (exact) return exact[1];

  return {
    arrays: 'array',
    'linked-list': 'linkedlist',
    stack: 'stack',
    queue: 'queue',
    hashing: 'hashtable',
    graphs: 'graph',
  }[concept.sectionId] || null;
}

function buildStudioConcept(concept, section, lesson) {
  const frames = buildLessonSimulation(lesson);
  return {
    ...concept,
    ...lesson,
    section: section?.title || concept.sectionTitle,
    objective: `Explain ${concept.title}, trace its changing state, justify its cost, and recognize it in an interview problem.`,
    tags: [concept.sectionTitle, concept.level, 'Interview pattern'],
    mentalModel: {
      title: `${concept.title} mental model`,
      kind: lesson.kind,
      description: lesson.mentalModel,
      items: modelItemsFor(lesson),
      legend: ['Accent = current state', 'Faded = eliminated', 'Checked = completed work'],
    },
    simulation: {
      title: 'See the state change',
      description: 'Predict the next move, advance one step, then compare your reasoning with the invariant.',
      steps: frames,
    },
    complexity: {
      ...lesson.complexity,
      summary: 'Tie every complexity claim to the work repeated and the extra state retained.',
      tradeoffs: [{
        choice: 'Clarity before optimization',
        gain: 'A small, explicit state is easier to explain, test, and prove correct.',
        cost: 'The first correct approach may not yet meet the final time or memory target.',
        useWhen: 'Start here, then optimize only the repeated work you can identify.',
      }],
    },
    misconceptions: lesson.traps.map((trap) => ({
      myth: trap,
      truth: 'Treat this as a failure mode. Restore the invariant and verify the smallest edge case before continuing.',
    })),
    interviewPrompts: [
      {
        question: `What clue tells you to consider ${concept.title}?`,
        followUp: 'Name one similar-looking problem where this pattern would be wrong.',
        strongAnswer: [lesson.pattern, 'The assumptions the pattern requires'],
      },
      {
        question: 'What remains true after every step?',
        followUp: 'Use that invariant to explain why discarded states cannot contain the answer.',
        strongAnswer: [frames[0]?.invariant || lesson.mentalModel, 'The update rule and stopping condition'],
      },
      {
        question: 'How would you test and defend this solution?',
        strongAnswer: ['Time and space complexity', 'The smallest input', 'A boundary case', 'A hostile or duplicate-heavy input'],
      },
    ],
    retrievalCheck: {
      questions: [
        {
          id: 'explain',
          prompt: `Explain ${concept.title} from memory.`,
          criteria: lesson.checkpoints,
        },
        {
          id: 'transfer',
          prompt: lesson.practice,
          criteria: [
            'Name the state before tracing.',
            'Show each update instead of jumping to the answer.',
            'Finish by checking the invariant and complexity.',
          ],
        },
      ],
    },
  };
}

function LessonProgress({ concept, progressItem, onSave, isAuthenticated }) {
  const currentStatus = progressItem?.status || 'not-started';
  const currentMeta = statusMeta[currentStatus] || statusMeta['not-started'];
  const [saveState, setSaveState] = useState({ status: 'idle', message: '' });

  const save = async (status) => {
    setSaveState({ status: 'saving', message: 'Saving progress…' });
    try {
      await onSave({
        conceptId: concept.id,
        status,
        confidence: statusMeta[status].confidence,
        notes: progressItem?.notes || '',
      });
      setSaveState({ status: 'saved', message: `${statusMeta[status].label} saved to your account.` });
    } catch {
      setSaveState({
        status: 'error',
        message: 'Progress could not be saved. Check your connection and try again.',
      });
    }
  };

  return (
    <div className="lesson-progress">
      <p className="section-label">Progress</p>
      <strong>{currentMeta.label}</strong>
      <div
        className="lesson-progress__meter"
        role="progressbar"
        aria-label="Concept confidence"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={currentMeta.confidence}
      >
        <span style={{ width: `${currentMeta.confidence}%` }} />
      </div>
      <div className="lesson-progress__actions">
        {['learning', 'confident', 'mastered'].map((status) => (
          <button
            key={status}
            type="button"
            className={status === 'mastered' ? 'btn-primary' : 'btn-ghost'}
            onClick={() => save(status)}
            disabled={!isAuthenticated || saveState.status === 'saving'}
            aria-pressed={progressItem?.status === status}
          >
            {statusMeta[status].label}
          </button>
        ))}
      </div>
      {!isAuthenticated && <span>Sign in to save this lesson to your account.</span>}
      {isAuthenticated && saveState.message && (
        <span
          role={saveState.status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {saveState.message}
        </span>
      )}
    </div>
  );
}

export default function ConceptLessonPage() {
  const { conceptId } = useParams();
  const { progress, updateConceptProgress, isAuthenticated } = useAuth();
  const requestedConcept = getBeginnerConceptById(conceptId);
  const concept = requestedConcept || DSA_BEGINNER_CONCEPTS[0];
  const section = getBeginnerSectionById(concept.sectionId);
  const lesson = useMemo(() => getConceptLesson(concept), [concept]);
  const progressItem = progress[concept.id] || {};
  const previous = getNeighborConcept(concept, -1);
  const next = getNeighborConcept(concept, 1);
  const relatedSimulatorId = getRelatedSimulatorId(concept);
  const studioConcept = useMemo(
    () => buildStudioConcept(concept, section, lesson),
    [concept, lesson, section]
  );

  if (!requestedConcept) {
    return <Navigate replace to="/dsa-beginners" />;
  }

  return (
    <div className="lesson-page" style={{ '--lesson-color': concept.color }}>
      <section className="lesson-hero">
        <div>
          <Link to="/dsa-beginners" className="lesson-back"><span aria-hidden="true">←</span> Back to DSA Path</Link>
          <p className="section-label">{section?.title || concept.sectionTitle}</p>
          <h1>{concept.title}</h1>
          <p>{lesson.headline}</p>
          <div className="lesson-hero__meta">
            <span>#{String(concept.order).padStart(3, '0')}</span>
            <span>{concept.milestone}</span>
            <span>{concept.level}</span>
          </div>
          <div className="lesson-hero__outcomes" aria-label="Lesson outcomes">
            <strong>Learn it four ways</strong>
            <ul>
              <li>understand the model</li>
              <li>trace every state change</li>
              <li>reason about cost and traps</li>
              <li>retrieve it without notes</li>
            </ul>
          </div>
        </div>
        <div id="lesson-account">
          <AuthPanel compact purpose="Sign in to save mastery and unlock concept coaching." />
        </div>
      </section>

      <section className="lesson-layout lesson-layout--studio">
        <section className="lesson-main" aria-label={`${concept.title} visual lesson`}>
          <VisualConceptStudio concept={studioConcept} accentColor={concept.color} />
        </section>

        <aside className="lesson-side">
          <LessonProgress
            concept={concept}
            progressItem={progressItem}
            onSave={updateConceptProgress}
            isAuthenticated={isAuthenticated}
          />

          <div className="lesson-coach">
            <p className="section-label">Personal tutor</p>
            {isAuthenticated ? (
              <>
                <h2>Ask about this concept</h2>
                <p>Your tutor opens with this lesson and your learning profile already selected.</p>
                <Link to={`/coach?concept=${encodeURIComponent(concept.id)}`} className="btn-primary">
                  Open personal tutor
                </Link>
              </>
            ) : (
              <>
                <span className="lesson-coach__lock">Sign-in required</span>
                <h2>Coaching stays personal</h2>
                <p>Sign in above to unlock concept-aware tutoring and private progress history.</p>
                <Link to={`/coach?concept=${encodeURIComponent(concept.id)}`} className="btn-ghost">
                  Sign in to use tutor
                </Link>
              </>
            )}
          </div>

          <div className="lesson-transfer">
            <p className="section-label">Transfer the skill</p>
            <h2>Turn understanding into recall</h2>
            {relatedSimulatorId && (
              <Link to={`/simulator#${relatedSimulatorId}`}>Open related simulator <span aria-hidden="true">→</span></Link>
            )}
            <Link to="/practice">Choose an interview problem <span aria-hidden="true">→</span></Link>
          </div>

          <div className="lesson-next">
            {previous && <Link to={`/dsa-beginners/${previous.id}`}><small>Previous lesson</small>{previous.title}</Link>}
            {next && <Link to={`/dsa-beginners/${next.id}`}><small>Next lesson</small>{next.title}</Link>}
          </div>
        </aside>
      </section>
    </div>
  );
}
