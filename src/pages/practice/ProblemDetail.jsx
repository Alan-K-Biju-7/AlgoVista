import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
import HintSystem from './HintSystem';
import TestResults from './TestResults';
import { runTestsAsync } from './testRunner';
import TracerPanel from './tracer/TracerPanel';
import { useTracerSteps } from './tracer/useTracerSteps';
import { TRACER_CONFIGS } from './tracer/configs/index';
import { validateCodeForTracer } from './tracer/validateCode';
import TracerErrorBoundary from './tracer/TracerErrorBoundary';
import StoryModePanel from './StoryModePanel';
import ProblemVisualLab from './ProblemVisualLab';
import LearningDebrief from './LearningDebrief';
import { PRACTICE_LANGUAGES, buildStarterCode, getLanguage } from './languageConfig';
import ContextualPracticeTutor from './tutor';
import { buildTutorTurnRequest } from './tutor/tutorRequestAdapter';
import { createClientTutorFallback, shouldUseClientTutorFallback } from './tutor/clientTutorFallback';
import { createAuthRequiredError, useOptionalAuth } from '../../context/AuthContext';
import AuthRequired from '../../components/AuthRequired';

const CodeEditor = lazy(() => import('./CodeEditor'));

function EditorModuleLoading({ height = 360 }) {
  return (
    <div className="code-editor-frame editor-module-loading" style={{ height }} role="status" aria-live="polite">
      <span>Loading professional editor…</span>
    </div>
  );
}

const DIFF_COLOR = { Easy: '#00d4aa', Medium: '#f5a623', Hard: '#ff6b6b' };

const defaultStarterCode = buildStarterCode('', 'javascript');
const PREFERRED_LANGUAGE_KEY = 'algovista.practice.preferred-language.v1';

function accountScopedKey(baseKey, accountScope = '') {
  const normalized = String(accountScope || '').trim().slice(0, 160);
  return normalized ? `${baseKey}:account:${encodeURIComponent(normalized)}` : baseKey;
}

function draftKey(problemId, language, scope = 'main', accountScope = '') {
  return accountScopedKey(`algovista.practice.draft.v1:${scope}:${problemId}:${language}`, accountScope);
}

function notesKey(problemId, accountScope = '') {
  return accountScopedKey(`algovista.practice.notes.v1:${problemId}`, accountScope);
}

function customCaseKey(problemId, accountScope = '') {
  return accountScopedKey(`algovista.practice.custom-case.v1:${problemId}`, accountScope);
}

function submissionsKey(problemId, accountScope = '') {
  return accountScopedKey(`algovista.practice.submissions.v1:${problemId}`, accountScope);
}

function readLocalString(key, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function readLocalJson(key, fallback) {
  try {
    const parsed = JSON.parse(readLocalString(key, ''));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

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
        ['trace', 'Reference'],
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

function ProblemBrief({ problem, topicColor, compact = false, revealPattern = true }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <SectionLabel>Problem</SectionLabel>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.75 }}>
          {problem.description}
        </p>
      </div>

      {revealPattern && <div
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
      </div>}

      {revealPattern && <div>
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
      </div>}

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

      {!compact && <HintSystem hints={problem.hints} />}
    </div>
  );
}

function PracticeSessionBar({ mode, onModeChange, seconds, running, onToggleTimer, onResetTimer, topicColor }) {
  const modeCopy = {
    learn: ['Learn', 'Visual guidance on'],
    focus: ['Focus', 'Interview simulation'],
    review: ['Review', 'Recall from memory'],
  };
  return (
    <div className="practice-session-bar">
      <div className="practice-session-bar__mode">
        <span>Session</span>
        <div>
          {Object.entries(modeCopy).map(([id, copy]) => (
            <button key={id} type="button" className={mode === id ? 'is-active' : ''} aria-pressed={mode === id} onClick={() => onModeChange?.(id)} style={mode === id ? { borderColor: `${topicColor}65`, color: topicColor } : null}>{copy[0]}</button>
          ))}
        </div>
        <small>{modeCopy[mode]?.[1]}</small>
      </div>
      <div className="practice-session-bar__timer">
        <span className={running ? 'is-live' : ''} />
        <div><small>Session time</small><b className="mono">{formatClock(seconds)}</b></div>
        <button type="button" onClick={onToggleTimer}>{running ? 'Pause' : 'Resume'}</button>
        <button type="button" onClick={onResetTimer} aria-label="Reset session timer">↺</button>
      </div>
      <div className="practice-shortcut-hint"><kbd>Ctrl</kbd><span>+</span><kbd>Enter</kbd><span>run tests</span></div>
    </div>
  );
}

function LearningScratchpad({ problem, topicColor, accountScope = '' }) {
  const storageKey = notesKey(problem.id, accountScope);
  const initial = readLocalJson(storageKey, {});
  const [plan, setPlan] = useState(initial.plan || '');
  const [complexity, setComplexity] = useState(initial.complexity || '');
  const [edgeCase, setEdgeCase] = useState(initial.edgeCase || '');

  useEffect(() => {
    const next = readLocalJson(notesKey(problem.id, accountScope), {});
    setPlan(next.plan || '');
    setComplexity(next.complexity || '');
    setEdgeCase(next.edgeCase || '');
  }, [accountScope, problem.id]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ plan, complexity, edgeCase }));
    } catch {
      // The scratchpad remains usable if local persistence is unavailable.
    }
  }, [complexity, edgeCase, plan, storageKey]);

  return (
    <section className="learning-scratchpad" style={{ borderColor: `${topicColor}35` }}>
      <div><p style={{ color: topicColor }}>Think before typing</p><span>Retrieving the plan first makes the implementation easier to remember.</span></div>
      <label><span>Invariant in one sentence</span><textarea rows="3" value={plan} onChange={(event) => setPlan(event.target.value)} placeholder="What remains true after every iteration?" /></label>
      <div className="learning-scratchpad__row">
        <label><span>Target complexity</span><select value={complexity} onChange={(event) => setComplexity(event.target.value)}><option value="">Predict…</option><option>O(1)</option><option>O(log n)</option><option>O(n)</option><option>O(n log n)</option><option>O(n²)</option></select></label>
        <label><span>Edge case to protect</span><input value={edgeCase} onChange={(event) => setEdgeCase(event.target.value)} placeholder="empty, duplicate, overflow…" /></label>
      </div>
      <small>Autosaved on this device</small>
    </section>
  );
}

function CustomTestcasePanel({ problem, onRun, disabled, accountScope = '' }) {
  const firstCase = problem.testCases?.[0] || { input: [], expected: null };
  const storageKey = customCaseKey(problem.id, accountScope);
  const stored = readLocalJson(storageKey, {});
  const [input, setInput] = useState(stored.input || JSON.stringify(firstCase.input));
  const [expected, setExpected] = useState(stored.expected || JSON.stringify(firstCase.expected));
  const [error, setError] = useState('');

  useEffect(() => {
    const next = readLocalJson(customCaseKey(problem.id, accountScope), {});
    const fallback = problem.testCases?.[0] || { input: [], expected: null };
    setInput(next.input || JSON.stringify(fallback.input));
    setExpected(next.expected || JSON.stringify(fallback.expected));
    setError('');
  }, [accountScope, problem.id, problem.testCases]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ input, expected }));
    } catch {
      // Custom cases still work when storage is unavailable.
    }
  }, [expected, input, storageKey]);

  const run = () => {
    try {
      const parsedInput = JSON.parse(input);
      if (!Array.isArray(parsedInput)) throw new Error('Input must be a JSON array of function arguments.');
      const parsedExpected = JSON.parse(expected);
      setError('');
      onRun?.({ input: parsedInput, expected: parsedExpected });
    } catch (parseError) {
      setError(parseError.message);
    }
  };

  return (
    <div className="custom-testcase-panel">
      <div className="custom-testcase-panel__intro"><b>Design an edge case</b><span>Input is a JSON array containing the arguments passed to <code>solve(...)</code>.</span></div>
      <div className="custom-testcase-grid">
        <label><span>Input arguments</span><textarea aria-label="Custom testcase input" rows="3" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" /></label>
        <label><span>Expected output</span><textarea aria-label="Custom testcase expected output" rows="3" value={expected} onChange={(event) => setExpected(event.target.value)} spellCheck="false" /></label>
      </div>
      <div className="custom-testcase-panel__actions"><button type="button" onClick={run} disabled={disabled}>▶ Run custom case</button><span>{error || 'Custom cases are cached locally.'}</span></div>
    </div>
  );
}

function SubmissionHistory({ submissions, onRestore }) {
  if (!submissions.length) {
    return <div className="submission-empty"><b>No runs yet</b><span>Run your code to create a local history. You can restore any earlier attempt.</span></div>;
  }
  return (
    <div className="submission-history">
      {submissions.map((submission) => (
        <article key={submission.id}>
          <span className={submission.accepted ? 'is-accepted' : submission.label.includes('passed') ? 'is-passed' : 'is-failed'}>{submission.accepted ? 'Accepted' : submission.label}</span>
          <div><b>{submission.languageLabel}</b><small>{new Date(submission.createdAt).toLocaleString()}</small></div>
          <code>{submission.passed}/{submission.total} cases · {submission.runtimeMs} ms</code>
          <button type="button" onClick={() => onRestore(submission)}>Restore code</button>
        </article>
      ))}
    </div>
  );
}

function EditorWorkspace({
  code,
  setCode,
  handleRun,
  handleCustomRun,
  handleTrace,
  onShowSolution,
  onReviewVisual,
  problem,
  results,
  topicColor,
  tracerConfig,
  allPass,
  nextProblem,
  onNextProblem,
  language,
  onLanguageChange,
  onResetCode,
  practiceRecord,
  onReflect,
  isExecuting,
  onExplainFailure,
  tutorRequiresAuth,
  accountScope,
}) {
  const [consoleTab, setConsoleTab] = useState(results ? 'result' : 'testcase');
  const [fullscreen, setFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(() => Number(readLocalString('algovista.practice.editor-font-size', '13')) || 13);
  const workspaceRef = useRef(null);
  const fullscreenToggleRef = useRef(null);
  const editorId = useId();
  const workspaceId = `${editorId}-workspace`;
  const editorTitleId = `${editorId}-title`;
  const editorDescriptionId = `${editorId}-description`;
  const consoleId = `${editorId}-console`;
  const currentLanguage = getLanguage(language);
  const consoleTabs = [
    ['testcase', `Testcases ${problem.testCases?.length || 0}`],
    ['custom', 'Custom case'],
    ['result', results ? `Result ${results.filter((result) => result.passed).length}/${results.length}` : 'Result'],
  ];

  useEffect(() => {
    if (results) setConsoleTab('result');
  }, [results]);

  useEffect(() => {
    try {
      window.localStorage.setItem('algovista.practice.editor-font-size', String(fontSize));
    } catch {
      // Editor preferences remain in memory when storage is unavailable.
    }
  }, [fontSize]);

  useEffect(() => {
    if (!fullscreen) return undefined;

    const workspace = workspaceRef.current;
    const focusBeforeOpen = fullscreenToggleRef.current;
    const isolatedSiblings = [];
    let branch = workspace;

    while (branch?.parentElement) {
      const parent = branch.parentElement;
      Array.from(parent.children).forEach((sibling) => {
        if (sibling === branch) return;
        isolatedSiblings.push({
          element: sibling,
          inert: sibling.hasAttribute('inert'),
          ariaHidden: sibling.getAttribute('aria-hidden'),
        });
        sibling.setAttribute('inert', '');
        sibling.setAttribute('aria-hidden', 'true');
      });
      branch = parent;
      if (parent === document.body) break;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    fullscreenToggleRef.current?.focus();

    const handleModalKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setFullscreen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = Array.from(workspace?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || []);
      if (!focusable.length) {
        event.preventDefault();
        workspace?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !workspace?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !workspace?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleModalKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleModalKeyDown, true);
      document.body.style.overflow = previousOverflow;
      isolatedSiblings.forEach(({ element, inert, ariaHidden }) => {
        if (!inert) element.removeAttribute('inert');
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      if (focusBeforeOpen?.isConnected) focusBeforeOpen.focus();
    };
  }, [fullscreen]);

  const activateConsoleTab = (nextTab) => setConsoleTab(nextTab);

  const handleConsoleTabKeyDown = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateConsoleTab(id);
      return;
    }

    const index = consoleTabs.findIndex(([tabId]) => tabId === id);
    const nextIndex = event.key === 'ArrowRight'
      ? (index + 1) % consoleTabs.length
      : event.key === 'ArrowLeft'
        ? (index - 1 + consoleTabs.length) % consoleTabs.length
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? consoleTabs.length - 1
            : null;
    if (nextIndex === null) return;
    event.preventDefault();
    event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  };

  return (
    <div
      ref={workspaceRef}
      id={workspaceId}
      className={fullscreen ? 'coding-workspace is-fullscreen' : 'coding-workspace'}
      role={fullscreen ? 'dialog' : undefined}
      aria-modal={fullscreen ? 'true' : undefined}
      aria-labelledby={fullscreen ? editorTitleId : undefined}
      aria-describedby={fullscreen ? editorDescriptionId : undefined}
      tabIndex={fullscreen ? -1 : undefined}
    >
      <div className="editor-workspace-top">
        <div className="editor-title"><span className="editor-title__icon">&lt;/&gt;</span><div><b id={editorTitleId}>Code</b><small id={editorDescriptionId}>{fullscreen ? 'Focused coding workspace' : 'Write, run, improve'}</small></div></div>
        <div className="editor-workspace-pills" aria-label="Editor runtime">
          <label className="language-picker">
            <span className="practice-sr-only">Programming language</span>
            <select value={language} onChange={(event) => onLanguageChange(event.target.value)} aria-label="Programming language">
              {PRACTICE_LANGUAGES.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.version}</option>)}
            </select>
          </label>
          <span className={currentLanguage.runnable ? 'runtime-pill' : 'runtime-pill is-editor-only'}><i /> {currentLanguage.runnable ? 'Timed browser worker' : 'Editor only'}</span>
        </div>
      </div>
      <div className="editor-utilitybar">
        <div><button type="button" onClick={() => setFontSize((value) => Math.max(11, value - 1))} aria-label="Decrease editor font size">A−</button><span>{fontSize}px</span><button type="button" onClick={() => setFontSize((value) => Math.min(20, value + 1))} aria-label="Increase editor font size">A+</button></div>
        <div><button type="button" onClick={onResetCode}>Reset code</button><button ref={fullscreenToggleRef} type="button" aria-expanded={fullscreen} aria-controls={workspaceId} onClick={() => setFullscreen((value) => !value)}>{fullscreen ? 'Exit focus' : 'Expand editor'}</button></div>
      </div>
      {!currentLanguage.runnable && <div className="language-notice"><b>{currentLanguage.label} editing mode</b><span>A language-specific starter and independent draft are ready. Secure execution still requires an isolated judge service; switch to JavaScript to run tests today.</span></div>}
      <Suspense fallback={<EditorModuleLoading height={470} />}>
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          fontSize={fontSize}
          height="540px"
          minHeight={380}
          maxHeight={900}
          storageKey={`algovista:practice-editor:${problem.id}`}
        />
      </Suspense>
      <div className="editor-actionbar">
        <button
          type="button"
          onClick={() => handleRun('run')}
          disabled={!currentLanguage.runnable || isExecuting}
          aria-label="Run Tests"
          style={{
            padding: '0.55rem 1.05rem',
            borderRadius: '0.45rem',
            border: 'none',
            background: topicColor,
            color: '#031a14',
            fontWeight: 900,
          }}
        >
          <span className="action-icon">{isExecuting ? '…' : '▶'}</span> {isExecuting ? 'Running' : 'Run'}
        </button>
        <button
          type="button"
          onClick={() => handleRun('submit')}
          aria-label="Submit"
          disabled={!currentLanguage.runnable || isExecuting}
          className="editor-submit-button"
        >
          <span className="action-icon">✓</span> Submit
        </button>
        <button
          type="button"
          onClick={handleTrace}
          aria-label={tracerConfig ? 'Trace Execution' : 'Open In-page Visual'}
          style={{
            padding: '0.55rem 1.05rem',
            borderRadius: '0.45rem',
            border: `1px solid ${tracerConfig ? `${topicColor}55` : 'var(--border-default)'}`,
            background: tracerConfig ? `${topicColor}16` : 'transparent',
            color: tracerConfig ? topicColor : 'var(--text-secondary)',
            fontWeight: 800,
          }}
        >
          {tracerConfig ? 'Reference Trace' : 'Open Visual'}
        </button>
        <button
          type="button"
          onClick={onShowSolution}
          style={{
            padding: '0.55rem 1.05rem',
            borderRadius: '0.45rem',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontWeight: 750,
            border: '1px solid var(--border-default)',
          }}
        >
          Solution
        </button>
      </div>
      <section className="test-console">
        <div className="test-console__tabs" role="tablist" aria-label="Test console" aria-orientation="horizontal">
          {consoleTabs.map(([id, label]) => (
            <button
              key={id}
              id={`${consoleId}-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={consoleTab === id}
              aria-controls={`${consoleId}-panel-${id}`}
              tabIndex={consoleTab === id ? 0 : -1}
              className={consoleTab === id ? 'is-active' : ''}
              onClick={() => activateConsoleTab(id)}
              onKeyDown={(event) => handleConsoleTabKeyDown(event, id)}
            >
              {label}
            </button>
          ))}
        </div>
        {consoleTabs.filter(([id]) => id !== consoleTab).map(([id]) => (
          <div
            key={`inactive-console-panel-${id}`}
            id={`${consoleId}-panel-${id}`}
            role="tabpanel"
            aria-labelledby={`${consoleId}-tab-${id}`}
            tabIndex={-1}
            hidden
          />
        ))}
        <div
          id={`${consoleId}-panel-${consoleTab}`}
          className="test-console__body"
          role="tabpanel"
          aria-labelledby={`${consoleId}-tab-${consoleTab}`}
          tabIndex={0}
        >
          {consoleTab === 'testcase' && <div className="builtin-testcases">{(problem.testCases || []).map((testCase, index) => <article key={index}><b>Case {index + 1}</b><div><span>Input</span><code>{JSON.stringify(testCase.input)}</code></div><div><span>Expected</span><code>{JSON.stringify(testCase.expected)}</code></div></article>)}</div>}
          {consoleTab === 'custom' && (
            <CustomTestcasePanel
              key={`${problem.id}:${accountScope || 'guest'}`}
              problem={problem}
              onRun={handleCustomRun}
              disabled={!currentLanguage.runnable || isExecuting}
              accountScope={accountScope}
            />
          )}
          {consoleTab === 'result' && (results ? <TestResults results={results} accepted={allPass} onExplainFailure={onExplainFailure} tutorRequiresAuth={tutorRequiresAuth} /> : <div className="console-empty"><span>▷</span><b>Run your code to see diagnostics</b><p>AlgoVista will focus the first failing case and show where your output diverges.</p></div>)}
        </div>
      </section>
      <CompletionPanel
        allPass={allPass}
        topicColor={topicColor}
        nextProblem={nextProblem}
        onNextProblem={onNextProblem}
        onReviewVisual={onReviewVisual}
      />
      {allPass && <LearningDebrief record={practiceRecord} onReflect={onReflect} color={topicColor} />}
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
  practiceMode = 'learn',
  onPracticeModeChange,
  practiceRecord,
  onHintViewed,
  onSolutionViewed,
  onReflect,
}) {
  const auth = useOptionalAuth();
  const accountScope = auth?.isAuthenticated
    ? String(auth.user?.id || auth.user?.email || '').trim()
    : '';
  const [language, setLanguage] = useState(() => readLocalString(PREFERRED_LANGUAGE_KEY, 'javascript'));
  const [code, setCode] = useState(() => {
    const preferred = readLocalString(PREFERRED_LANGUAGE_KEY, 'javascript');
    return practiceMode === 'review'
      ? buildStarterCode(problem.solution, preferred)
      : readLocalString(draftKey(problem.id, preferred, 'main', accountScope), buildStarterCode(problem.solution, preferred));
  });
  const [results, setResults] = useState(null);
  const [tab, setTab] = useState(practiceMode === 'learn' ? 'story' : 'editor');
  const [traceErrors, setTraceErrors] = useState([]);
  const [traceWarnings, setTraceWarnings] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(practiceMode !== 'learn');
  const [submissions, setSubmissions] = useState(() => readLocalJson(submissionsKey(problem.id, accountScope), []));
  const [loadedAccountScope, setLoadedAccountScope] = useState(accountScope);
  const [isExecuting, setIsExecuting] = useState(false);
  const [acceptedSubmission, setAcceptedSubmission] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorMode, setTutorMode] = useState('socratic');
  const [tutorStarterQuestion, setTutorStarterQuestion] = useState('');
  const workspaceTabsId = useId();
  const tracer = useTracerSteps();
  const tracerConfig = TRACER_CONFIGS[problem.id] || null;
  const bookmarked = isBookmarked ? isBookmarked(problem.id) : false;

  const openTutor = (nextMode = 'socratic', starterQuestion = '') => {
    setTutorMode(nextMode);
    setTutorStarterQuestion(starterQuestion);
    setTutorOpen(true);
  };

  const askContextualTutor = async (payload) => {
    if (!auth?.isAuthenticated || typeof auth.askTutor !== 'function') {
      throw createAuthRequiredError('the personal tutor');
    }

    try {
      const response = await auth.askTutor(
        buildTutorTurnRequest(payload),
        { signal: payload.signal }
      );
      return response?.tutor ? response : createClientTutorFallback(payload);
    } catch (error) {
      if (shouldUseClientTutorFallback(error)) return createClientTutorFallback(payload);
      throw error;
    }
  };

  useEffect(() => {
    if (loadedAccountScope === accountScope) return;
    const nextCode = practiceMode === 'review'
      ? buildStarterCode(problem.solution, language)
      : readLocalString(
          draftKey(problem.id, language, 'main', accountScope),
          buildStarterCode(problem.solution, language)
        );
    setCode(nextCode);
    setSubmissions(readLocalJson(submissionsKey(problem.id, accountScope), []));
    setResults(null);
    setAcceptedSubmission(false);
    setLoadedAccountScope(accountScope);
  }, [accountScope, language, loadedAccountScope, practiceMode, problem.id, problem.solution]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (loadedAccountScope !== accountScope) return;
    try {
      window.localStorage.setItem(
        draftKey(problem.id, language, practiceMode === 'review' ? 'review' : 'main', accountScope),
        code
      );
    } catch {
      // Draft remains available for the current session.
    }
  }, [accountScope, code, language, loadedAccountScope, practiceMode, problem.id]);

  useEffect(() => {
    setAcceptedSubmission(false);
  }, [code]);

  useEffect(() => {
    if (loadedAccountScope !== accountScope) return;
    try {
      window.localStorage.setItem(
        submissionsKey(problem.id, accountScope),
        JSON.stringify(submissions.slice(0, 20))
      );
    } catch {
      // Submission history remains available for this session.
    }
  }, [accountScope, loadedAccountScope, problem.id, submissions]);

  useEffect(() => {
    if (practiceMode !== 'learn') {
      setTab('editor');
      setTimerRunning(true);
    }
  }, [practiceMode]);

  const changeLanguage = (nextLanguage) => {
    try {
      window.localStorage.setItem(
        draftKey(problem.id, language, practiceMode === 'review' ? 'review' : 'main', accountScope),
        code
      );
      window.localStorage.setItem(PREFERRED_LANGUAGE_KEY, nextLanguage);
    } catch {
      // Continue with in-memory drafts.
    }
    setLanguage(nextLanguage);
    setCode(practiceMode === 'review'
      ? buildStarterCode(problem.solution, nextLanguage)
      : readLocalString(
          draftKey(problem.id, nextLanguage, 'main', accountScope),
          buildStarterCode(problem.solution, nextLanguage)
        ));
    setResults(null);
  };

  const resetCode = () => {
    if (typeof window !== 'undefined' && !window.confirm('Reset this language draft to the starter template?')) return;
    setCode(buildStarterCode(problem.solution, language));
    setResults(null);
  };

  const saveSubmission = (res, kind = 'run') => {
    const passed = res.filter((result) => result.passed).length;
    const firstFailed = res.find((result) => !result.passed);
    const allPassed = Boolean(res.length && passed === res.length);
    const label = allPassed
      ? kind === 'submit' ? 'Accepted' : kind === 'custom' ? 'Custom passed' : 'Tests passed'
      : firstFailed?.kind === 'timeout'
        ? 'Time Limit'
        : firstFailed?.kind === 'syntax'
          ? 'Compile Error'
          : firstFailed?.error
            ? 'Runtime Error'
            : kind === 'custom'
              ? 'Custom failed'
              : 'Wrong Answer';
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      accepted: kind === 'submit' && allPassed,
      label,
      passed,
      total: res.length,
      runtimeMs: res.runtimeMs || 0,
      language,
      languageLabel: getLanguage(language).label,
      code,
      kind,
    };
    setSubmissions((current) => [entry, ...current].slice(0, 20));
  };

  const handleTrace = () => {
    if (!tracerConfig) {
      onAttempted(problem.id, { track: false });
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

    onAttempted(problem.id, { durationSeconds: elapsedSeconds, language });
    tracer.run(code, tracerConfig.defaultInput, tracerConfig);
    setTab('trace');
  };

  const handleRun = async (kind = 'run') => {
    onAttempted(problem.id, { durationSeconds: elapsedSeconds, language });
    setIsExecuting(true);
    const res = await runTestsAsync(code, problem.testCases || []);
    setIsExecuting(false);
    setResults(res);
    saveSubmission(res, kind);
    const accepted = Boolean(res.length && res.every((r) => r.passed));
    setAcceptedSubmission(kind === 'submit' && accepted);
    if (kind === 'submit' && accepted) {
      onSolved(problem.id, { durationSeconds: elapsedSeconds, language, mode: practiceMode });
      if (kind === 'submit') setTimerRunning(false);
    }
  };

  const handleCustomRun = async (testCase) => {
    onAttempted(problem.id, { durationSeconds: elapsedSeconds, language });
    setIsExecuting(true);
    const res = await runTestsAsync(code, [testCase]);
    setIsExecuting(false);
    setResults(res);
    setAcceptedSubmission(false);
    saveSubmission(res, 'custom');
  };

  useEffect(() => {
    const runShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && tab === 'editor') {
        event.preventDefault();
        if (getLanguage(language).runnable) handleRun('run');
      }
    };
    window.addEventListener('keydown', runShortcut);
    return () => window.removeEventListener('keydown', runShortcut);
  });

  const tabs = [
    ['story', 'Story Mode'],
    ['visual', 'Visual'],
    ['editor', 'Editor'],
    ['problem', 'Explanation'],
    ...(tracerConfig ? [['trace', 'Reference Trace']] : []),
    ['submissions', `Runs${submissions.length ? ` (${submissions.length})` : ''}`],
    ['solution', 'Solution'],
  ];

  const workspaceTabId = (id) => `${workspaceTabsId}-tab-${id}`;
  const workspacePanelId = (id) => `${workspaceTabsId}-panel-${id}`;
  const workspacePanelProps = (id) => ({
    id: workspacePanelId(id),
    role: 'tabpanel',
    'aria-labelledby': workspaceTabId(id),
    tabIndex: 0,
  });

  const activateWorkspaceTab = (id) => {
    if (id === 'solution') onSolutionViewed?.();
    setTab(id);
  };

  return (
    <div className="problem-detail-page">
      <div className="problem-detail-header">
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
        {practiceMode === 'learn' && <Badge color={topicColor}>{problem.pattern}</Badge>}
        {practiceMode === 'learn' && problem.timeO && <Badge color="#4a9eff">{problem.timeO}</Badge>}
        {practiceMode === 'learn' && problem.spaceO && <Badge color="#f5a623">{problem.spaceO}</Badge>}
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
        <button
          type="button"
          className={`practice-tutor-launcher ${auth?.isAuthenticated ? '' : 'is-locked'}`.trim()}
          style={{ '--tutor-launcher-color': topicColor }}
          onClick={() => openTutor('socratic', 'Help me find the next step without giving away the solution.')}
          aria-haspopup="dialog"
          aria-expanded={tutorOpen}
          aria-label={auth?.isAuthenticated ? 'Open Personal Tutor' : 'Sign in to open Personal Tutor'}
        >
          <span aria-hidden="true">{auth?.isAuthenticated ? '✦' : '▣'}</span>
          <b>Personal Tutor</b>
          <small>{auth?.isAuthenticated ? 'Context-aware' : 'Sign in to use'}</small>
        </button>
      </div>

      <PracticeSessionBar
        mode={practiceMode}
        onModeChange={onPracticeModeChange}
        seconds={elapsedSeconds}
        running={timerRunning}
        onToggleTimer={() => setTimerRunning((value) => !value)}
        onResetTimer={() => setElapsedSeconds(0)}
        topicColor={topicColor}
      />

      <LearningRail
        tab={tab}
        topicColor={topicColor}
        hasTracer={Boolean(tracerConfig)}
        solved={status === 'solved' || acceptedSubmission}
      />

      <div
        role="tablist"
        aria-label="Problem workspace"
        aria-orientation="horizontal"
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
            id={workspaceTabId(id)}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls={workspacePanelId(id)}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => activateWorkspaceTab(id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateWorkspaceTab(id);
                return;
              }
              const index = tabs.findIndex(([tabId]) => tabId === id);
              const nextIndex = event.key === 'ArrowRight'
                ? (index + 1) % tabs.length
                : event.key === 'ArrowLeft'
                  ? (index - 1 + tabs.length) % tabs.length
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? tabs.length - 1
                      : null;
              if (nextIndex !== null) {
                event.preventDefault();
                event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
              }
            }}
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

      {tabs.filter(([id]) => id !== tab).map(([id]) => (
        <div key={`inactive-panel-${id}`} {...workspacePanelProps(id)} hidden />
      ))}

      {tab === 'story' && (
        <div {...workspacePanelProps('story')}>
          <StoryModePanel
            problem={problem}
            topicColor={topicColor}
            hasTracer={Boolean(tracerConfig)}
            onStartEditor={() => {
              onAttempted(problem.id, { track: false });
              setTab('editor');
            }}
            onTrace={handleTrace}
          />
        </div>
      )}

      {tab === 'editor' && (
        <div className="leetcode-workspace" {...workspacePanelProps('editor')}>
          <aside className="workspace-problem-pane">
            <div className="workspace-pane-head"><b>Description</b><span>{problem.difficulty}</span></div>
            <ProblemBrief problem={problem} topicColor={topicColor} compact revealPattern={practiceMode === 'learn'} />
            <LearningScratchpad
              key={`${problem.id}:${accountScope || 'guest'}`}
              problem={problem}
              topicColor={topicColor}
              accountScope={accountScope}
            />
            {practiceMode === 'learn' && <HintSystem hints={problem.hints || []} onReveal={onHintViewed} />}
          </aside>
          <EditorWorkspace
            code={code}
            setCode={setCode}
            handleRun={handleRun}
            handleCustomRun={handleCustomRun}
            handleTrace={handleTrace}
            onShowSolution={() => {
              onSolutionViewed?.();
              setTab('solution');
            }}
            onReviewVisual={() => setTab('visual')}
            problem={problem}
            results={results}
            topicColor={topicColor}
            tracerConfig={tracerConfig}
            allPass={acceptedSubmission}
            nextProblem={nextProblem}
            onNextProblem={onNextProblem}
            language={language}
            onLanguageChange={changeLanguage}
            onResetCode={resetCode}
            practiceRecord={practiceRecord}
            onReflect={onReflect}
            isExecuting={isExecuting}
            tutorRequiresAuth={!auth?.isAuthenticated}
            accountScope={accountScope}
            onExplainFailure={(diagnostic) => {
              const evidence = diagnostic?.firstMismatch || diagnostic?.error || 'the first failing visible case';
              openTutor('debug', `Help me understand why my code failed at ${evidence}. Start from the evidence and ask me one focused question.`);
            }}
          />
        </div>
      )}

      {tab === 'problem' && (
        <div {...workspacePanelProps('problem')} style={{ maxWidth: '850px' }}>
          <ProblemBrief problem={problem} topicColor={topicColor} />
        </div>
      )}

      {tab === 'visual' && (
        <div {...workspacePanelProps('visual')}>
          <ProblemVisualLab problem={problem} topicColor={topicColor} />
        </div>
      )}

      {tab === 'submissions' && (
        <section className="runs-panel" {...workspacePanelProps('submissions')}>
          <div className="runs-panel__header"><div><p>Local run history</p><h3>Compare, recover, and learn from every attempt.</h3></div><span>{submissions.length} saved</span></div>
          <SubmissionHistory submissions={submissions} onRestore={(submission) => { setLanguage(submission.language); setCode(submission.code); setResults(null); setTab('editor'); }} />
        </section>
      )}

      {tab === 'trace' && (
        <div {...workspacePanelProps('trace')} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '1.35rem' }}>
          <div>
            <SectionLabel>Code for pattern comparison</SectionLabel>
            <Suspense fallback={<EditorModuleLoading height={360} />}>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                height="360px"
                minHeight={280}
                maxHeight={760}
                storageKey={`algovista:trace-editor:${problem.id}`}
              />
            </Suspense>
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
                Run Reference Trace
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                Input: {JSON.stringify(tracerConfig?.defaultInput)}
              </span>
            </div>
          </div>
          <div>
            <div className="reference-trace-notice"><b>Reference walkthrough</b><span>This visual follows the canonical algorithm events for this pattern. It validates compatible JavaScript, but it is not yet a line-perfect trace of arbitrary learner code.</span></div>
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
        <div {...workspacePanelProps('solution')}>
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
              {problem.solution || defaultStarterCode}
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

      {tutorOpen && !auth?.isAuthenticated && (
        <AuthRequired
          variant="dialog"
          feature="the personal tutor"
          title="Sign in to continue with this problem"
          description="Your private session lets AlgoVista ground coaching in this problem and keep every learner’s data isolated."
          onDismiss={() => setTutorOpen(false)}
        >
          <span />
        </AuthRequired>
      )}

      <ContextualPracticeTutor
        open={tutorOpen && Boolean(auth?.isAuthenticated)}
        onClose={() => setTutorOpen(false)}
        problem={problem}
        code={code}
        language={language}
        testResults={results}
        learnerContext={practiceRecord || {}}
        mode={tutorMode}
        onModeChange={setTutorMode}
        starterQuestion={tutorStarterQuestion}
        conversationKey={problem.id}
        accentColor={topicColor}
        onAsk={askContextualTutor}
        onFeedback={(outcome, response) => auth.recordCoachFeedback?.({
          outcome,
          sessionId: `practice-${problem.id}`,
          attemptId: `${problem.id}-${practiceRecord?.attempts || 0}`,
          conceptId: problem.topic || problem.id,
          hintLevel: response?.hintLevel || 0,
        })}
        onVisualAction={() => {
          setTutorOpen(false);
          setTab('visual');
        }}
        onNextExercise={onNextProblem ? () => {
          setTutorOpen(false);
          onNextProblem();
        } : undefined}
      />
    </div>
  );
}
