import { useEffect, useState } from 'react';
import HintSystem from './HintSystem';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';
import { runTests } from './testRunner';
import TracerPanel from './tracer/TracerPanel';
import { useTracerSteps } from './tracer/useTracerSteps';
import { TRACER_CONFIGS } from './tracer/configs/index';
import { validateCodeForTracer } from './tracer/validateCode';
import TracerErrorBoundary from './tracer/TracerErrorBoundary';
import StoryModePanel from './StoryModePanel';
import ProblemVisualLab from './ProblemVisualLab';

const DIFF_COLOR = { Easy: '#00d4aa', Medium: '#f5a623', Hard: '#ff6b6b' };

const starterCode = `function solve() {
  // Write your solution here
}`;

function Badge({ children, color }) {
  return (
    <span
      style={{
        padding: '0.18rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.72rem',
        fontWeight: 800,
        color,
        background: `${color}16`,
        border: `1px solid ${color}45`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontSize: '0.68rem',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        marginBottom: '0.6rem',
      }}
    >
      {children}
    </p>
  );
}

function LearningRail({ tab, topicColor, hasTracer, solved }) {
  const steps = hasTracer
    ? [
        ['story', 'Story'],
        ['visual', 'Visual'],
        ['editor', 'Code'],
        ['trace', 'Trace'],
        ['solution', 'Review'],
      ]
    : [
        ['story', 'Story'],
        ['visual', 'Visual'],
        ['editor', 'Code'],
        ['solution', 'Review'],
      ];

  return (
    <div className="learning-rail" style={{ borderColor: `${topicColor}34`, '--rail-steps': steps.length }}>
      {steps.map(([id, label], index) => {
        const active = tab === id;
        const complete = solved || steps.findIndex(([stepId]) => stepId === tab) > index;
        return (
          <div
            key={`${id}-${label}`}
            className={active ? 'is-active' : complete ? 'is-complete' : ''}
            style={active || complete ? { borderColor: `${topicColor}65`, color: topicColor } : null}
          >
            <span>{index + 1}</span>
            <b>{label}</b>
          </div>
        );
      })}
    </div>
  );
}

function CompletionPanel({ allPass, topicColor, nextProblem, onNextProblem, onReviewVisual }) {
  if (!allPass) return null;

  return (
    <div className="completion-panel" style={{ borderColor: `${topicColor}45` }}>
      <div>
        <p style={{ color: topicColor }}>Mission cleared</p>
        <h3>Tests are green. Lock the mental model before moving on.</h3>
      </div>
      <div>
        <button
          type="button"
          onClick={onReviewVisual}
          style={{
            background: `${topicColor}16`,
            borderColor: `${topicColor}55`,
            color: topicColor,
            fontWeight: 850,
          }}
        >
          Review Visual
        </button>
        {nextProblem && (
          <button
            type="button"
            onClick={onNextProblem}
            style={{
              background: topicColor,
              borderColor: topicColor,
              color: '#031a14',
              fontWeight: 900,
            }}
          >
            Next: {nextProblem.title}
          </button>
        )}
      </div>
    </div>
  );
}

function MiniVisual({ type, color }) {
  const accent = color || '#00d4aa';
  const cellStyle = {
    minWidth: '2.25rem',
    height: '2.15rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.4rem',
    border: `1px solid ${accent}45`,
    background: `${accent}12`,
    color: 'var(--text-primary)',
    fontFamily: 'SF Mono, Fira Code, monospace',
    fontSize: '0.82rem',
    fontWeight: 800,
  };

  if (type === 'hashmap' || type === 'hashset') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {[
          ['need', '7'],
          ['seen', '2'],
          ['hit', '9'],
          ['return', '[0,1]'],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
              padding: '0.55rem 0.65rem',
              borderRadius: '0.45rem',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              fontSize: '0.78rem',
            }}
          >
            <span className="mono" style={{ color: accent }}>{k}</span>
            <span className="mono" style={{ color: 'var(--text-primary)' }}>{v}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stack') {
    return (
      <div style={{ display: 'grid', gap: '0.45rem', justifyItems: 'center' }}>
        {[')', ']', '}'].map((item, index) => (
          <div
            key={item}
            style={{
              ...cellStyle,
              width: '62%',
              opacity: 1 - index * 0.15,
            }}
          >
            {item}
          </div>
        ))}
        <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>top</span>
      </div>
    );
  }

  if (type === 'linked-list') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((item, index) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={cellStyle}>{item}</span>
            {index < 3 && <span style={{ color: accent, fontWeight: 900 }}>→</span>}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'tree' || type === 'heap') {
    return (
      <div style={{ display: 'grid', justifyItems: 'center', gap: '0.45rem' }}>
        <span style={cellStyle}>4</span>
        <div style={{ display: 'flex', gap: '2.2rem' }}>
          <span style={cellStyle}>2</span>
          <span style={cellStyle}>7</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[1, 3, 6, 9].map((item) => <span key={item} style={cellStyle}>{item}</span>)}
        </div>
      </div>
    );
  }

  if (type === 'graph') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.7rem', alignItems: 'center' }}>
        {['A', 'B', 'C', 'D', 'E', 'F'].map((node, index) => (
          <div
            key={node}
            style={{
              width: '2.6rem',
              height: '2.6rem',
              borderRadius: '50%',
              border: `1px solid ${index < 4 ? accent : 'var(--border-default)'}`,
              background: index < 4 ? `${accent}14` : 'var(--bg-surface)',
              color: index < 4 ? accent : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
            }}
          >
            {node}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'dp') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 2.1rem)', gap: '0.35rem' }}>
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            style={{
              ...cellStyle,
              minWidth: '2.1rem',
              height: '1.85rem',
              background: index % 4 === 0 ? `${accent}22` : 'var(--bg-surface)',
              color: index % 4 === 0 ? accent : 'var(--text-muted)',
              fontSize: '0.7rem',
            }}
          >
            {index % 4 === 0 ? index / 4 + 1 : ''}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
      {[2, 7, 11, 15].map((item, index) => (
        <div key={item} style={{ display: 'grid', justifyItems: 'center', gap: '0.25rem' }}>
          <span style={cellStyle}>{item}</span>
          <span className="mono" style={{ color: index < 2 ? accent : 'var(--text-faint)', fontSize: '0.68rem' }}>
            {index === 0 ? 'L' : index === 1 ? 'R' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProblemBrief({ problem, topicColor, compact = false }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <SectionLabel>Problem</SectionLabel>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.75 }}>
          {problem.description}
        </p>
      </div>

      <div
        style={{
          padding: '0.85rem',
          borderRadius: '0.6rem',
          background: `${topicColor}0d`,
          border: `1px solid ${topicColor}30`,
        }}
      >
        <SectionLabel>Core Pattern</SectionLabel>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.65 }}>
          {problem.pattern_explanation}
        </p>
      </div>

      <div>
        <SectionLabel>Visual Model</SectionLabel>
        <div
          style={{
            padding: '0.95rem',
            borderRadius: '0.6rem',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            minHeight: '8.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MiniVisual type={problem.viz} color={topicColor} />
        </div>
      </div>

      {!compact && (
        <div>
          <SectionLabel>Examples</SectionLabel>
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Input:{' '}
                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {ex.input}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', marginBottom: ex.explanation ? '0.25rem' : 0 }}>
                Output:{' '}
                <span style={{ color: '#00d4aa', fontFamily: 'monospace' }}>
                  {ex.output}
                </span>
              </div>
              {ex.explanation ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {ex.explanation}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {!compact && <HintSystem hints={problem.hints} />}
    </div>
  );
}

function EditorWorkspace({
  code,
  setCode,
  handleRun,
  handleTrace,
  setTab,
  problem,
  results,
  topicColor,
  tracerConfig,
  allPass,
  nextProblem,
  onNextProblem,
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '0.65rem',
        }}
      >
        <SectionLabel>Your Solution Editor</SectionLabel>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
          Export a function named <span className="mono">solve</span>
        </span>
      </div>
      <CodeEditor value={code} onChange={setCode} height="430px" />
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        <button
          type="button"
          onClick={handleRun}
          style={{
            padding: '0.55rem 1.05rem',
            borderRadius: '0.45rem',
            border: 'none',
            background: topicColor,
            color: '#031a14',
            fontWeight: 900,
          }}
        >
          Run Tests
        </button>
        <button
          type="button"
          onClick={handleTrace}
          style={{
            padding: '0.55rem 1.05rem',
            borderRadius: '0.45rem',
            border: `1px solid ${tracerConfig ? `${topicColor}55` : 'var(--border-default)'}`,
            background: tracerConfig ? `${topicColor}16` : 'transparent',
            color: tracerConfig ? topicColor : 'var(--text-secondary)',
            fontWeight: 800,
          }}
        >
          {tracerConfig ? 'Trace Execution' : 'Open In-page Visual'}
        </button>
        <button
          type="button"
          onClick={() => {
            setCode(problem.solution || starterCode);
            setTab('solution');
          }}
          style={{
            padding: '0.55rem 1.05rem',
            borderRadius: '0.45rem',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontWeight: 750,
            border: '1px solid var(--border-default)',
          }}
        >
          Show Solution
        </button>
      </div>
      <TestResults results={results} />
      <CompletionPanel
        allPass={allPass}
        topicColor={topicColor}
        nextProblem={nextProblem}
        onNextProblem={onNextProblem}
        onReviewVisual={() => setTab('visual')}
      />
    </div>
  );
}

export default function ProblemDetail({
  problem,
  topicColor,
  onBack,
  onSolved,
  onAttempted,
  isBookmarked,
  toggleBookmark,
  status = 'unsolved',
  nextProblem,
  onNextProblem,
}) {
  const [code, setCode] = useState(problem.solution || starterCode);
  const [results, setResults] = useState(null);
  const [tab, setTab] = useState('story');
  const [traceErrors, setTraceErrors] = useState([]);
  const [traceWarnings, setTraceWarnings] = useState([]);
  const tracer = useTracerSteps();
  const tracerConfig = TRACER_CONFIGS[problem.id] || null;
  const bookmarked = isBookmarked ? isBookmarked(problem.id) : false;
  const allPass = Boolean(results?.length && results.every((result) => result.passed));

  useEffect(() => {
    setCode(problem.solution || starterCode);
    setResults(null);
    setTraceErrors([]);
    setTraceWarnings([]);
    setTab('story');
  }, [problem.id, problem.solution]);

  const handleTrace = () => {
    if (!tracerConfig) {
      onAttempted(problem.id);
      setTab('visual');
      return;
    }

    const { valid, errors, warnings } = validateCodeForTracer(code, tracerConfig);
    setTraceErrors([]);
    setTraceWarnings(warnings);
    if (!valid) {
      setTraceErrors(errors);
      setTab('trace');
      return;
    }

    onAttempted(problem.id);
    tracer.run(code, tracerConfig.defaultInput, tracerConfig);
    setTab('trace');
  };

  const handleRun = () => {
    onAttempted(problem.id);
    const res = runTests(code, problem.testCases || []);
    setResults(res);
    if (res.length && res.every((r) => r.passed)) onSolved(problem.id);
  };

  const tabs = [
    ['story', 'Story Mode'],
    ['visual', 'Visual'],
    ['editor', 'Editor'],
    ['problem', 'Explanation'],
    ...(tracerConfig ? [['trace', 'Trace']] : []),
    ['solution', 'Solution'],
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            fontWeight: 750,
          }}
        >
          Back
        </button>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', flex: 1 }}>
          {problem.title}
        </h2>
        <Badge color={DIFF_COLOR[problem.difficulty] || '#8b9cc8'}>{problem.difficulty}</Badge>
        <Badge color={topicColor}>{problem.pattern}</Badge>
        {problem.timeO && <Badge color="#4a9eff">{problem.timeO}</Badge>}
        {problem.spaceO && <Badge color="#f5a623">{problem.spaceO}</Badge>}
        <button
          type="button"
          onClick={() => toggleBookmark?.(problem.id)}
          aria-label={bookmarked ? `Remove ${problem.title} from bookmarks` : `Add ${problem.title} to bookmarks`}
          title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          style={{
            width: '2.2rem',
            height: '2.2rem',
            padding: 0,
            borderRadius: '0.45rem',
            background: bookmarked ? `${topicColor}16` : 'transparent',
            color: bookmarked ? topicColor : 'var(--text-muted)',
            border: bookmarked ? `1px solid ${topicColor}55` : '1px solid var(--border-default)',
            fontWeight: 900,
          }}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>

      <LearningRail
        tab={tab}
        topicColor={topicColor}
        hasTracer={Boolean(tracerConfig)}
        solved={status === 'solved' || allPass}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            style={{
              padding: '0.52rem 1rem',
              borderRadius: '0.4rem 0.4rem 0 0',
              border: 'none',
              borderBottom: tab === id ? `2px solid ${topicColor}` : '2px solid transparent',
              background: tab === id ? 'var(--bg-card)' : 'transparent',
              color: tab === id ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: tab === id ? 900 : 700,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'story' && (
        <StoryModePanel
          problem={problem}
          topicColor={topicColor}
          hasTracer={Boolean(tracerConfig)}
          onStartEditor={() => {
            onAttempted(problem.id);
            setTab('editor');
          }}
          onTrace={handleTrace}
        />
      )}

      {tab === 'editor' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: '1.35rem',
            alignItems: 'start',
          }}
        >
          <ProblemBrief problem={problem} topicColor={topicColor} compact />
          <EditorWorkspace
            code={code}
            setCode={setCode}
            handleRun={handleRun}
            handleTrace={handleTrace}
            setTab={setTab}
            problem={problem}
            results={results}
            topicColor={topicColor}
            tracerConfig={tracerConfig}
            allPass={allPass}
            nextProblem={nextProblem}
            onNextProblem={onNextProblem}
          />
        </div>
      )}

      {tab === 'problem' && (
        <div style={{ maxWidth: '850px' }}>
          <ProblemBrief problem={problem} topicColor={topicColor} />
        </div>
      )}

      {tab === 'visual' && (
        <ProblemVisualLab problem={problem} topicColor={topicColor} />
      )}

      {tab === 'trace' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '1.35rem' }}>
          <div>
            <SectionLabel>Traceable Code</SectionLabel>
            <CodeEditor value={code} onChange={setCode} height="340px" />
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.7rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleTrace}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.45rem',
                  border: 'none',
                  background: topicColor,
                  color: '#031a14',
                  fontWeight: 900,
                }}
              >
                Trace Execution
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                Input: {JSON.stringify(tracerConfig?.defaultInput)}
              </span>
            </div>
          </div>
          <div>
            {traceErrors.length > 0 && (
              <div
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.45rem',
                  background: '#ff6b6b12',
                  border: '1px solid #ff6b6b45',
                  fontSize: '0.78rem',
                  color: '#ff9f9f',
                  lineHeight: 1.6,
                }}
              >
                {traceErrors.join(' / ')}
              </div>
            )}
            {traceWarnings.length > 0 && (
              <div
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.45rem',
                  background: '#f5a62312',
                  border: '1px solid #f5a62340',
                  fontSize: '0.78rem',
                  color: '#f5a623',
                  lineHeight: 1.6,
                }}
              >
                {traceWarnings.join(' / ')}
              </div>
            )}
            <TracerErrorBoundary>
              <TracerPanel tracer={tracer} code={code} topicColor={topicColor} />
            </TracerErrorBoundary>
          </div>
        </div>
      )}

      {tab === 'solution' && (
        <div>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: '0.6rem',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                overflowX: 'auto',
                lineHeight: 1.6,
                fontFamily: 'monospace',
              }}
            >
              {problem.solution || starterCode}
            </pre>
          </div>
          <div
            style={{
              padding: '0.9rem',
              borderRadius: '0.6rem',
              background: `${topicColor}0d`,
              border: `1px solid ${topicColor}30`,
            }}
          >
            <SectionLabel>Key Insight</SectionLabel>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.65 }}>
              {problem.pattern_explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
