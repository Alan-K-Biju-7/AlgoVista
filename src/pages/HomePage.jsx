import { Link } from 'react-router-dom';
import { NEETCODE150, NEETCODE_TOPICS } from './practice/neetcode150';
import './HomePage.css';

const modules = [
  'Arrays',
  'Linked List',
  'Stack',
  'Queue',
  'Hash Table',
  'Binary Search',
  'BST',
  'AVL',
  'Heap',
  'Trie',
  'Graphs',
  'Dijkstra',
  'Bellman-Ford',
  'Merge Sort',
  'Quick Sort',
  'DP Patterns',
  'Backtracking',
  'Greedy',
];

const heroBars = [44, 72, 38, 88, 58, 96, 66, 52, 80, 46];

const stats = [
  { value: String(NEETCODE150.length), label: 'curated problems' },
  { value: String(modules.length), label: 'visual labs' },
  { value: String(NEETCODE_TOPICS.length), label: 'pattern tracks' },
  { value: '7', label: 'code tracers' },
];

const cockpitLinks = [
  {
    title: 'Learn concepts',
    eyebrow: 'Step 01',
    copy: 'Build the mental model first: operations, complexity, edge cases, and pattern vocabulary.',
    to: '/concepts',
    action: 'Open concepts',
    accent: '#00d4aa',
  },
  {
    title: 'Visualize operations',
    eyebrow: 'Step 02',
    copy: 'Run the data structure live, pause at any state, and watch pointers, queues, heaps, and paths move.',
    to: '/simulator',
    action: 'Open simulator',
    accent: '#4a9eff',
  },
  {
    title: 'Practice deliberately',
    eyebrow: 'Step 03',
    copy: 'Solve the curated interview set with saved progress, hints, tests, bookmarks, and visual links.',
    to: '/practice',
    action: 'Start practice',
    accent: '#f5a623',
  },
  {
    title: 'Use AI Coach',
    eyebrow: 'Step 04',
    copy: 'Turn confusion into a plan: explain, trace, quiz, debug, and generate a focused study sprint.',
    to: '/ai',
    action: 'Enter AI mode',
    accent: '#8b7cf8',
  },
];

const learningPath = [
  {
    phase: 'Foundation',
    title: 'Make memory visible',
    copy: 'Arrays, lists, stacks, queues, hashing, pointers, and invariants.',
    items: ['Index meaning', 'Pointer rewiring', 'LIFO/FIFO', 'Collision handling'],
  },
  {
    phase: 'Patterns',
    title: 'Recognize the shape',
    copy: 'Two pointers, sliding window, monotonic stack, binary search, recursion, and sorting.',
    items: ['State transitions', 'Eliminated search space', 'Loop invariants', 'Trace tables'],
  },
  {
    phase: 'Advanced DSA',
    title: 'Control complex systems',
    copy: 'Trees, heaps, tries, graph traversal, shortest paths, balancing, and DP thinking.',
    items: ['AVL rotations', 'Priority queues', 'Relaxation', 'Memo states'],
  },
  {
    phase: 'Interview ready',
    title: 'Practice with feedback',
    copy: 'Use curated problems, test cases, hints, visual replays, and AI teaching sessions.',
    items: ['NC150 plan', 'Debug review', 'Complexity proof', 'Mock prompts'],
  },
];

const advancedTiles = [
  { title: 'Graph algorithms', meta: 'BFS, DFS, Dijkstra, Bellman-Ford', accent: '#4a9eff' },
  { title: 'Balanced trees', meta: 'BST plus AVL rotations with height logic', accent: '#00d4aa' },
  { title: 'Priority systems', meta: 'Heap arrays, tree view, extract-min flow', accent: '#f5a623' },
  { title: 'String intelligence', meta: 'Trie insert, search, delete, autocomplete', accent: '#8b7cf8' },
  { title: 'Divide and conquer', meta: 'Merge sort, quick sort, partition traces', accent: '#ff6b6b' },
  { title: 'Pattern practice', meta: 'DP, greedy, intervals, bit manipulation', accent: '#00d4aa' },
];

const topicPreview = NEETCODE_TOPICS.slice(0, 10);

function HeroVisualizer() {
  return (
    <div className="home-visual" aria-label="Animated DSA learning visual">
      <div className="home-visual__topline">
        <span className="home-visual__status">live lesson</span>
        <span className="home-visual__complexity">O(log n)</span>
      </div>

      <div className="home-visual__graph">
        {['A', 'B', 'C', 'D', 'E', 'F'].map((node, index) => (
          <span key={node} className={`home-visual__node home-visual__node--${index + 1}`}>
            {node}
          </span>
        ))}
        <span className="home-visual__edge home-visual__edge--1" />
        <span className="home-visual__edge home-visual__edge--2" />
        <span className="home-visual__edge home-visual__edge--3" />
      </div>

      <div className="home-visual__bars">
        {heroBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className="home-visual__bar"
            style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }}
          >
            <span>{index}</span>
          </span>
        ))}
      </div>

      <div className="home-visual__trace">
        <div>
          <span className="home-visual__trace-label">pointer</span>
          <strong>mid = 4</strong>
        </div>
        <div>
          <span className="home-visual__trace-label">decision</span>
          <strong>discard left</strong>
        </div>
        <div>
          <span className="home-visual__trace-label">next</span>
          <strong>low = 5</strong>
        </div>
      </div>
    </div>
  );
}

function TopicRibbon() {
  return (
    <div className="home-ribbon" aria-label="Practice topic preview">
      {topicPreview.map((topic) => (
        <span key={topic.id} style={{ borderColor: `${topic.color}44`, color: topic.color }}>
          {topic.label}
        </span>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__mesh" />
        <div className="home-hero__content">
          <div className="home-hero__copy">
            <span className="home-kicker">
              <span />
              Visual DSA learning platform
            </span>
            <h1>AlgoVista</h1>
            <p className="home-hero__lead">
              A study-first coding platform where every DSA concept becomes a visual story,
              every practice problem has a path, and AI mode turns confusion into the next
              concrete step.
            </p>

            <div className="home-hero__actions" aria-label="Primary actions">
              <Link to="/simulator" className="home-button home-button--primary">
                Start visual learning
              </Link>
              <Link to="/ai" className="home-button home-button--violet">
                Try AI Coach
              </Link>
              <Link to="/practice" className="home-button home-button--ghost">
                Practice NC150
              </Link>
            </div>

            <div className="home-hero__stats" aria-label="Platform stats">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <HeroVisualizer />
        </div>
      </section>

      <section className="home-section home-section--tight" aria-labelledby="cockpit-title">
        <div className="home-section__head">
          <span className="home-section__eyebrow">Study cockpit</span>
          <h2 id="cockpit-title">One clean route from concept to confidence</h2>
          <p>
            The app now presents DSA as a guided studio: learn the idea, watch the state
            change, solve the pattern, then ask the coach to close the gap.
          </p>
        </div>

        <div className="home-cockpit">
          {cockpitLinks.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="home-cockpit-card"
              style={{ '--card-accent': item.accent }}
            >
              <span className="home-cockpit-card__eyebrow">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="home-cockpit-card__action">{item.action}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="path-title">
        <div className="home-section__head home-section__head--split">
          <div>
            <span className="home-section__eyebrow">Curriculum engine</span>
            <h2 id="path-title">Step-by-step DSA, from beginner to advanced</h2>
          </div>
          <Link to="/concepts" className="home-link">Browse full concept map</Link>
        </div>

        <div className="home-path">
          {learningPath.map((phase, index) => (
            <article key={phase.phase} className="home-path-card">
              <div className="home-path-card__number">{String(index + 1).padStart(2, '0')}</div>
              <span>{phase.phase}</span>
              <h3>{phase.title}</h3>
              <p>{phase.copy}</p>
              <div className="home-path-card__items">
                {phase.items.map((item) => (
                  <em key={item}>{item}</em>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-practice" aria-labelledby="practice-title">
        <div className="home-practice__content">
          <span className="home-section__eyebrow">Curated practice</span>
          <h2 id="practice-title">Beyond a problem list: a visual NC150 practice system</h2>
          <p>
            Practice is organized by interview pattern, backed by saved progress, examples,
            hints, test cases, and links into the simulator whenever the concept should be seen.
          </p>

          <div className="home-practice__metrics">
            <div>
              <strong>{NEETCODE150.length}</strong>
              <span>problems</span>
            </div>
            <div>
              <strong>{NEETCODE_TOPICS.length}</strong>
              <span>topics</span>
            </div>
            <div>
              <strong>10 pts</strong>
              <span>per solve</span>
            </div>
          </div>

          <Link to="/practice" className="home-button home-button--primary">
            Open practice arena
          </Link>
        </div>

        <div className="home-practice__panel">
          <div className="home-practice__track">
            <span>Today focus</span>
            <strong>Sliding Window</strong>
            <p>Window invariant -> trace state -> solve 3 problems -> coach review</p>
          </div>
          <TopicRibbon />
        </div>
      </section>

      <section className="home-section home-ai-preview" aria-labelledby="ai-title">
        <div className="home-ai-preview__panel">
          <div className="home-ai-preview__chat">
            <div className="home-ai-preview__bubble home-ai-preview__bubble--user">
              I can code binary search, but I keep messing up boundaries.
            </div>
            <div className="home-ai-preview__bubble">
              Name what low and high mean before the loop. Then preserve that invariant every
              time you move a pointer.
            </div>
            <div className="home-ai-preview__steps">
              <span>1. Define invariant</span>
              <span>2. Dry run one miss</span>
              <span>3. Prove termination</span>
            </div>
          </div>
        </div>

        <div className="home-ai-preview__copy">
          <span className="home-section__eyebrow">AI powered teaching mode</span>
          <h2 id="ai-title">A coach beside the visualizer</h2>
          <p>
            AI mode is designed around the way students actually get stuck: it can explain a
            concept, generate a practice sprint, quiz assumptions, and translate code errors
            into a better mental model.
          </p>
          <Link to="/ai" className="home-button home-button--violet">
            Open AI Coach
          </Link>
        </div>
      </section>

      <section className="home-section" aria-labelledby="advanced-title">
        <div className="home-section__head">
          <span className="home-section__eyebrow">Advanced DSA studio</span>
          <h2 id="advanced-title">Serious topics, made inspectable</h2>
          <p>
            Advanced DSA becomes less intimidating when every queue, heap, edge relaxation,
            rotation, and recursion branch is visible.
          </p>
        </div>

        <div className="home-advanced-grid">
          {advancedTiles.map((tile) => (
            <article key={tile.title} style={{ '--tile-accent': tile.accent }}>
              <span />
              <h3>{tile.title}</h3>
              <p>{tile.meta}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-final">
        <div>
          <span className="home-section__eyebrow">Ready for the next session</span>
          <h2>Turn DSA from memorization into motion.</h2>
        </div>
        <div className="home-final__actions">
          <Link to="/simulator" className="home-button home-button--primary">
            Visualize now
          </Link>
          <Link to="/practice" className="home-button home-button--ghost">
            Solve problems
          </Link>
        </div>
      </section>
    </div>
  );
}
