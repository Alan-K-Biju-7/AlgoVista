import { Link, useParams } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { useAuth } from '../context/AuthContext';
import {
  DSA_BEGINNER_CONCEPTS,
  getBeginnerConceptById,
  getBeginnerSectionById,
} from '../data/dsaBeginnersCurriculum';
import { getConceptLesson } from '../data/conceptLessonContent';
import './ConceptLessonPage.css';

const statusMeta = {
  'not-started': { label: 'Not started', confidence: 0 },
  learning: { label: 'Learning', confidence: 35 },
  confident: { label: 'Confident', confidence: 70 },
  mastered: { label: 'Mastered', confidence: 100 },
};

function getNeighborConcept(concept, offset) {
  const index = DSA_BEGINNER_CONCEPTS.findIndex((item) => item.id === concept.id);
  if (index === -1) return null;
  return DSA_BEGINNER_CONCEPTS[index + offset] || null;
}

const arrayVisualTypes = new Set([
  'array-memory',
  'array-traversal',
  'array-shift',
  'linear-search',
  'binary-search',
  'ternary-search',
  'two-pointers',
  'prefix-sum',
  'sliding-window',
  'kadane',
  'matrix-boundaries',
  'sorted-matrix-search',
]);

function ArrayPatternVisual({ visual }) {
  if (visual === 'array-memory') {
    return (
      <div className="viz-array-room">
        <div className="array-address-row">
          {[0, 1, 2, 3, 4].map((index) => (
            <span key={index}>addr + {index}</span>
          ))}
        </div>
        <div className="array-cell-row">
          {[12, 18, 25, 31, 44].map((value, index) => (
            <span key={value} className={index === 2 ? 'is-active' : ''}>
              <b>{value}</b>
              <small>i={index}</small>
            </span>
          ))}
        </div>
        <p>Direct lookup: base address + index gives the slot immediately.</p>
      </div>
    );
  }

  if (visual === 'array-traversal') {
    return (
      <div className="viz-array-room">
        <div className="array-cell-row">
          {[4, 1, 7, 3, 9, 2].map((value, index) => (
            <span key={`${value}-${index}`} className={index < 3 ? 'is-done' : index === 3 ? 'is-active' : ''}>
              <b>{value}</b>
              <small>{index < 3 ? 'seen' : index === 3 ? 'i' : 'wait'}</small>
            </span>
          ))}
        </div>
        <div className="array-state-strip">
          <span>invariant: left side processed</span>
          <span>current = nums[i]</span>
          <span>answer updates once per index</span>
        </div>
      </div>
    );
  }

  if (visual === 'array-shift') {
    return (
      <div className="viz-array-room">
        <div className="array-cell-row array-cell-row--shift">
          {[3, 6, 'gap', 9, 12].map((value, index) => (
            <span key={`${value}-${index}`} className={value === 'gap' ? 'is-gap' : index > 2 ? 'is-moving' : ''}>
              <b>{value}</b>
              <small>{value === 'gap' ? 'insert' : index > 2 ? 'shift ->' : `i=${index}`}</small>
            </span>
          ))}
        </div>
        <p>Open the gap from right to left so existing values are not overwritten.</p>
      </div>
    );
  }

  if (visual === 'linear-search') {
    return (
      <div className="viz-array-room">
        <div className="array-cell-row">
          {[8, 4, 9, 2, 6].map((value, index) => (
            <span key={value} className={index < 2 ? 'is-cut' : index === 2 ? 'is-active' : ''}>
              <b>{value}</b>
              <small>{index < 2 ? 'no' : index === 2 ? 'match' : 'unchecked'}</small>
            </span>
          ))}
        </div>
        <div className="array-state-strip">
          <span>target = 9</span>
          <span>checked indexes: 0..2</span>
          <span>return first matching index</span>
        </div>
      </div>
    );
  }

  if (visual === 'binary-search') {
    return (
      <div className="viz-array-room">
        <div className="array-cell-row">
          {[2, 5, 8, 12, 16, 23, 31].map((value, index) => (
            <span key={value} className={index < 3 ? 'is-cut' : index === 4 ? 'is-active' : index === 3 || index === 6 ? 'is-bound' : ''}>
              <b>{value}</b>
              <small>{index === 3 ? 'L' : index === 4 ? 'M' : index === 6 ? 'R' : index < 3 ? 'discard' : ''}</small>
            </span>
          ))}
        </div>
        <p>If target is larger than mid, every smaller slot is proven impossible.</p>
      </div>
    );
  }

  if (visual === 'ternary-search') {
    return (
      <div className="viz-array-room">
        <div className="array-cell-row">
          {[1, 4, 9, 12, 8, 3, 2].map((value, index) => (
            <span key={`${value}-${index}`} className={index === 2 || index === 4 ? 'is-active' : index < 2 ? 'is-cut' : ''}>
              <b>{value}</b>
              <small>{index === 2 ? 'm1' : index === 4 ? 'm2' : ''}</small>
            </span>
          ))}
        </div>
        <p>Compare two midpoints to decide which third cannot hold the optimum.</p>
      </div>
    );
  }

  if (visual === 'two-pointers') {
    return (
      <div className="viz-array-room">
        <div className="array-cell-row">
          {[1, 2, 4, 6, 9].map((value, index) => (
            <span key={value} className={index === 0 || index === 4 ? 'is-active' : ''}>
              <b>{value}</b>
              <small>{index === 0 ? 'left' : index === 4 ? 'right' : ''}</small>
            </span>
          ))}
        </div>
        <div className="array-state-strip">
          <span>sum = 10</span>
          <span>target = 10</span>
          <span>move one pointer only when the rule proves it</span>
        </div>
      </div>
    );
  }

  if (visual === 'prefix-sum') {
    return (
      <div className="viz-prefix-board">
        <div>
          <strong>nums</strong>
          {[2, 4, 1, 7].map((value) => <span key={value}>{value}</span>)}
        </div>
        <div>
          <strong>prefix</strong>
          {[0, 2, 6, 7, 14].map((value) => <span key={value}>{value}</span>)}
        </div>
        <p>sum(1, 3) = prefix[4] - prefix[1] = 14 - 2 = 12</p>
      </div>
    );
  }

  if (visual === 'sliding-window') {
    return (
      <div className="viz-array-room">
        <div className="array-cell-row">
          {[2, 1, 5, 1, 3, 2].map((value, index) => (
            <span key={`${value}-${index}`} className={index >= 2 && index <= 4 ? 'is-active' : ''}>
              <b>{value}</b>
              <small>{index === 2 ? 'L' : index === 4 ? 'R' : ''}</small>
            </span>
          ))}
        </div>
        <div className="array-state-strip">
          <span>window sum = 9</span>
          <span>remove left when shrinking</span>
          <span>add right when expanding</span>
        </div>
      </div>
    );
  }

  if (visual === 'kadane') {
    return (
      <div className="viz-kadane-board">
        {[
          ['-2', 'drop'],
          ['3', 'start'],
          ['-1', 'extend'],
          ['5', 'best=7'],
          ['-6', 'keep best'],
        ].map(([value, label], index) => (
          <span key={`${value}-${index}`} className={label === 'best=7' ? 'is-active' : ''}>
            <b>{value}</b>
            <small>{label}</small>
          </span>
        ))}
        <p>current = best subarray ending here; best = best anywhere so far.</p>
      </div>
    );
  }

  if (visual === 'matrix-boundaries') {
    return (
      <div className="viz-matrix-lesson">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} className={index < 4 || [7, 11, 15, 14, 13, 12].includes(index) ? 'is-active' : ''}>
            {index + 1}
          </span>
        ))}
        <p>top, right, bottom, left boundaries shrink after each edge.</p>
      </div>
    );
  }

  if (visual === 'sorted-matrix-search') {
    return (
      <div className="viz-matrix-lesson viz-matrix-lesson--sorted">
        {[1, 4, 7, 11, 2, 5, 8, 12, 3, 6, 9, 16, 10, 13, 14, 20].map((value, index) => (
          <span key={`${value}-${index}`} className={[3, 7, 11, 10].includes(index) ? 'is-active' : index === 15 ? 'is-cut' : ''}>
            {value}
          </span>
        ))}
        <p>Start top-right: left is smaller, down is larger.</p>
      </div>
    );
  }

  return null;
}

function VisualLab({ concept, lesson }) {
  return (
    <div className={`lesson-visual lesson-visual--${lesson.kind}`} style={{ '--lesson-color': concept.color }}>
      <div className="lesson-visual__stage">
        {arrayVisualTypes.has(lesson.visual) && (
          <ArrayPatternVisual visual={lesson.visual} />
        )}

        {lesson.kind === 'complexity' && (
          <div className="viz-complexity" aria-label="Complexity growth curves">
            {[
              ['O(1)', 22],
              ['O(log n)', 36],
              ['O(n)', 54],
              ['O(n log n)', 72],
              ['O(n^2)', 92],
            ].map(([label, height]) => (
              <span key={label} style={{ height: `${height}%` }}>
                <b>{label}</b>
              </span>
            ))}
          </div>
        )}

        {lesson.kind === 'search' && (
          <div className="viz-search" aria-label="Search window">
            {[2, 4, 7, 11, 18, 23, 31, 45].map((value, index) => (
              <span key={value} className={index === 3 ? 'is-mid' : index < 2 || index > 5 ? 'is-cut' : ''}>
                <b>{value}</b>
                <small>{index === 2 ? 'L' : index === 3 ? 'M' : index === 5 ? 'R' : ''}</small>
              </span>
            ))}
          </div>
        )}

        {lesson.kind === 'matrix' && (
          <div className="viz-matrix" aria-label="Matrix traversal">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} className={index < 4 || [7, 11, 15, 14, 13, 12].includes(index) ? 'is-path' : ''}>
                {index + 1}
              </span>
            ))}
          </div>
        )}

        {lesson.kind === 'string' && (
          <div className="viz-string" aria-label="String pattern scan">
            {'ALGORITHM'.split('').map((letter, index) => (
              <span key={`${letter}-${index}`} className={index >= 2 && index <= 5 ? 'is-window' : ''}>
                {letter}
              </span>
            ))}
            <em>pattern window</em>
          </div>
        )}

        {lesson.kind === 'recursion' && (
          <div className="viz-recursion" aria-label="Recursion tree">
            <span className="node root">f(5)</span>
            <span className="node left">f(4)</span>
            <span className="node right">f(3)</span>
            <span className="node leaf-a">f(2)</span>
            <span className="node leaf-b">f(1)</span>
            <span className="branch branch-a" />
            <span className="branch branch-b" />
            <span className="branch branch-c" />
            <span className="branch branch-d" />
          </div>
        )}

        {lesson.kind === 'linked-list' && (
          <div className="viz-linked-list" aria-label="Linked list pointer chain">
            {['head', '12', '24', '36', 'null'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        )}

        {lesson.kind === 'stack' && (
          <div className="viz-stack" aria-label="Stack top-first structure">
            {['return C', 'return B', 'return A', 'base'].map((item) => (
              <span key={item}>{item}</span>
            ))}
            <strong>top</strong>
          </div>
        )}

        {lesson.kind === 'queue' && (
          <div className="viz-queue" aria-label="Queue front and back">
            <b>front</b>
            {['A', 'B', 'C', 'D', 'E'].map((item) => (
              <span key={item}>{item}</span>
            ))}
            <b>back</b>
          </div>
        )}

        {lesson.kind === 'hashing' && (
          <div className="viz-hash" aria-label="Hash buckets and chains">
            {[0, 1, 2, 3].map((bucket) => (
              <div key={bucket}>
                <strong>{bucket}</strong>
                <span>{bucket === 0 ? 'cat' : bucket === 1 ? '42 -> 18' : bucket === 2 ? 'sun' : 'empty'}</span>
              </div>
            ))}
          </div>
        )}

        {lesson.kind === 'sorting' && (
          <div className="viz-sorting" aria-label="Sorting bars">
            {[44, 18, 72, 29, 58, 33, 91].map((height, index) => (
              <span key={`${height}-${index}`} style={{ height: `${height}%` }} className={index === 2 || index === 3 ? 'is-compare' : ''} />
            ))}
          </div>
        )}

        {lesson.kind === 'tree' && (
          <div className="viz-tree" aria-label="Tree structure">
            <span className="node root">8</span>
            <span className="node left">3</span>
            <span className="node right">10</span>
            <span className="node leaf-a">1</span>
            <span className="node leaf-b">6</span>
            <span className="branch branch-a" />
            <span className="branch branch-b" />
            <span className="branch branch-c" />
            <span className="branch branch-d" />
          </div>
        )}

        {lesson.kind === 'graph' && (
          <div className="viz-graph" aria-label="Graph frontier">
            {['A', 'B', 'C', 'D', 'E', 'F'].map((node, index) => (
              <span key={node} className={`graph-dot graph-dot--${index}`}>{node}</span>
            ))}
            <i className="edge edge-a" />
            <i className="edge edge-b" />
            <i className="edge edge-c" />
            <i className="edge edge-d" />
          </div>
        )}

        {lesson.kind === 'greedy' && (
          <div className="viz-greedy" aria-label="Greedy selected intervals">
            {['A', 'B', 'C', 'D', 'E'].map((item, index) => (
              <span key={item} className={index === 0 || index === 2 || index === 4 ? 'is-picked' : ''}>
                {item}
              </span>
            ))}
          </div>
        )}

        {lesson.kind === 'dp' && (
          <div className="viz-dp" aria-label="Dynamic programming table">
            {Array.from({ length: 30 }).map((_, index) => (
              <span key={index} className={index % 6 === 0 || index > 20 || index === 14 ? 'is-known' : ''} />
            ))}
          </div>
        )}

        {lesson.kind === 'bits' && (
          <div className="viz-bits" aria-label="Bit operation rows">
            {['1101', '1010', '0111'].map((bits, index) => (
              <span key={bits} className={index === 2 ? 'is-result' : ''}>
                {bits.split('').map((bit, bitIndex) => <b key={bitIndex}>{bit}</b>)}
              </span>
            ))}
          </div>
        )}

        {['divide', 'foundation'].includes(lesson.kind) && (
          <div className="viz-pipeline" aria-label="Concept learning pipeline">
            {['Define', 'Trace', 'Prove', 'Code'].map((item, index) => (
              <span key={item} className={index === 1 ? 'is-active' : ''}>{item}</span>
            ))}
          </div>
        )}
      </div>

      <div className="lesson-visual__caption">
        <strong>{lesson.kind.replace('-', ' ')}</strong>
        <span>{lesson.mentalModel}</span>
      </div>
    </div>
  );
}

function LessonProgress({ concept, progressItem, onSave, isAuthenticated }) {
  const save = async (status) => {
    await onSave({
      conceptId: concept.id,
      status,
      confidence: statusMeta[status].confidence,
      notes: progressItem?.notes || '',
    });
  };

  return (
    <div className="lesson-progress">
      <p className="section-label">Progress</p>
      <strong>{statusMeta[progressItem?.status || 'not-started'].label}</strong>
      <div className="lesson-progress__actions">
        {['learning', 'confident', 'mastered'].map((status) => (
          <button
            key={status}
            type="button"
            className={status === 'mastered' ? 'btn-primary' : 'btn-ghost'}
            onClick={() => save(status)}
            disabled={!isAuthenticated}
          >
            {statusMeta[status].label}
          </button>
        ))}
      </div>
      {!isAuthenticated && <span>Log in to save this lesson.</span>}
    </div>
  );
}

export default function ConceptLessonPage() {
  const { conceptId } = useParams();
  const { progress, updateConceptProgress, isAuthenticated } = useAuth();
  const concept = getBeginnerConceptById(conceptId) || DSA_BEGINNER_CONCEPTS[0];
  const section = getBeginnerSectionById(concept.sectionId);
  const lesson = getConceptLesson(concept);
  const progressItem = progress[concept.id] || {};
  const previous = getNeighborConcept(concept, -1);
  const next = getNeighborConcept(concept, 1);

  return (
    <div className="lesson-page" style={{ '--lesson-color': concept.color }}>
      <section className="lesson-hero">
        <div>
          <Link to="/dsa-beginners" className="lesson-back">Back to DSA Path</Link>
          <p className="section-label">{section?.title || concept.sectionTitle}</p>
          <h1>{concept.title}</h1>
          <p>{lesson.headline}</p>
          <div className="lesson-hero__meta">
            <span>#{String(concept.order).padStart(3, '0')}</span>
            <span>{concept.milestone}</span>
            <span>{concept.level}</span>
          </div>
        </div>
        <AuthPanel compact />
      </section>

      <section className="lesson-layout">
        <main className="lesson-main">
          <VisualLab concept={concept} lesson={lesson} />

          <div className="lesson-grid">
            <article className="lesson-card lesson-card--wide">
              <p className="section-label">Explanation</p>
              <h2>Core idea</h2>
              <p>{lesson.coreIdea}</p>
              <p>{lesson.mentalModel}</p>
            </article>

            {concept.sectionId === 'arrays' && (
              <>
                <article className="lesson-card lesson-card--wide lesson-card--accent">
                  <p className="section-label">Intuition</p>
                  <h2>Why this pattern works</h2>
                  <p>{lesson.intuition}</p>
                  <p><strong>When to use it:</strong> {lesson.pattern}</p>
                </article>

                <article className="lesson-card">
                  <p className="section-label">Dry run</p>
                  <h2>Walkthrough</h2>
                  <ol>
                    {lesson.dryRun.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </article>

                <article className="lesson-card">
                  <p className="section-label">Complexity</p>
                  <h2>Cost model</h2>
                  <div className="lesson-complexity">
                    <span><b>Time</b>{lesson.complexity.time}</span>
                    <span><b>Space</b>{lesson.complexity.space}</span>
                  </div>
                </article>

                {lesson.template && (
                  <article className="lesson-card lesson-card--wide">
                    <p className="section-label">Template</p>
                    <h2>Code shape</h2>
                    <pre><code>{lesson.template}</code></pre>
                  </article>
                )}
              </>
            )}

            <article className="lesson-card">
              <p className="section-label">Trace it</p>
              <h2>How to reason</h2>
              <ol>
                {lesson.reasoningSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>

            <article className="lesson-card">
              <p className="section-label">Avoid this</p>
              <h2>Common traps</h2>
              <ul>
                {lesson.traps.map((trap) => <li key={trap}>{trap}</li>)}
              </ul>
            </article>

            <article className="lesson-card lesson-card--wide">
              <p className="section-label">Practice</p>
              <h2>Do this now</h2>
              <p>{lesson.practice}</p>
              <div className="lesson-checkpoints">
                {lesson.checkpoints.map((checkpoint) => (
                  <span key={checkpoint}>{checkpoint}</span>
                ))}
              </div>
            </article>
          </div>
        </main>

        <aside className="lesson-side">
          <LessonProgress
            concept={concept}
            progressItem={progressItem}
            onSave={updateConceptProgress}
            isAuthenticated={isAuthenticated}
          />

          <div className="lesson-coach">
            <p className="section-label">AI Coach</p>
            <h2>Ask about this concept</h2>
            <p>Open the coach with this lesson already selected.</p>
            <Link to={`/coach?concept=${encodeURIComponent(concept.id)}`} className="btn-primary">
              Open coach
            </Link>
          </div>

          <div className="lesson-next">
            {previous && <Link to={`/dsa-beginners/${previous.id}`}>Previous: {previous.title}</Link>}
            {next && <Link to={`/dsa-beginners/${next.id}`}>Next: {next.title}</Link>}
          </div>
        </aside>
      </section>
    </div>
  );
}
