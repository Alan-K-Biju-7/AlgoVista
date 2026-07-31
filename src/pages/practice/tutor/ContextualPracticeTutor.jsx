import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ContextualPracticeTutor.css';

export const TUTOR_MODES = Object.freeze([
  {
    id: 'socratic',
    label: 'Socratic',
    shortLabel: 'Think',
    icon: '?',
    description: 'Questions first. Clarify the invariant without giving away the solution.',
    prompts: ['Help me identify the invariant', 'Ask me one question at a time'],
  },
  {
    id: 'debug',
    label: 'Debug',
    shortLabel: 'Debug',
    icon: '!',
    description: 'Locate the first divergence, classify the bug, and choose one next experiment.',
    prompts: ['Diagnose my first failing case', 'Help me shrink the counterexample'],
  },
  {
    id: 'dry-run',
    label: 'Dry run',
    shortLabel: 'Trace',
    icon: '→',
    description: 'Trace variables and data-structure state one decision at a time.',
    prompts: ['Walk through the smallest example', 'Quiz me on the next state'],
  },
  {
    id: 'quiz',
    label: 'Quiz',
    shortLabel: 'Quiz',
    icon: '◇',
    description: 'Use short retrieval checks to test understanding instead of recognition.',
    prompts: ['Give me a two-minute retrieval check', 'Test an edge case misconception'],
  },
  {
    id: 'complexity',
    label: 'Complexity',
    shortLabel: 'Big O',
    icon: 'Θ',
    description: 'Reason about bottlenecks, tradeoffs, and how work grows with input size.',
    prompts: ['Challenge my time-complexity claim', 'Help me find the bottleneck'],
  },
  {
    id: 'review',
    label: 'Review',
    shortLabel: 'Recall',
    icon: '↻',
    description: 'Retrieve the idea from memory and connect it to a new problem shape.',
    prompts: ['Check whether I can explain this from memory', 'Give me a transfer question'],
  },
]);

const MODE_IDS = new Set(TUTOR_MODES.map((mode) => mode.id));
const RESPONSE_FIELDS = [
  'diagnosis',
  'explanation',
  'nextQuestion',
  'hint',
  'nextAction',
  'hintLevel',
  'solutionRevealed',
  'citations',
  'masterySignal',
  'warnings',
  'meta',
  'visualAction',
  'nextExercise',
  'sources',
];
const SENSITIVE_CONTEXT_KEYS = /^(?:(?:current|editor|source|starter|submitted|reference)?code|(?:reference|canonical|full)?solution)$/i;
const USER_HISTORY_TURNS = 6;
const USER_HISTORY_MESSAGE_LENGTH = 600;

function nextMessageId(counterRef) {
  counterRef.current += 1;
  return `tutor-message-${counterRef.current}`;
}

function normalizeInitialMessages(messages, counterRef) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => message && ['user', 'assistant'].includes(message.role))
    .map((message) => ({
      id: message.id || nextMessageId(counterRef),
      role: message.role,
      mode: MODE_IDS.has(message.mode) ? message.mode : 'socratic',
      content: message.role === 'assistant'
        ? normalizeTutorResponse(message.content ?? message.response ?? message.text)
        : String(message.content ?? message.text ?? ''),
      createdAt: message.createdAt || new Date().toISOString(),
    }))
    .filter((message) => message.role === 'assistant' || message.content.trim());
}

function normalizeTutorResponse(value) {
  if (typeof value === 'string') return { explanation: value };
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { explanation: 'The tutor returned an empty response. Try asking in a different way.' };
  }

  const isServerEnvelope = value.tutor && typeof value.tutor === 'object' && !Array.isArray(value.tutor);
  const candidate = isServerEnvelope
    ? value.tutor
    : value.response && typeof value.response === 'object'
      ? value.response
      : value;
  const isTutorPayload = candidate.message != null && (
    candidate.version != null ||
    candidate.nextAction != null ||
    candidate.hintLevel != null ||
    candidate.masterySignal != null
  );

  if (isServerEnvelope || isTutorPayload) {
    return {
      explanation: candidate.message == null
        ? 'The tutor returned an empty response. Try asking in a different way.'
        : String(candidate.message),
      nextQuestion: candidate.nextQuestion,
      nextAction: candidate.nextAction,
      hintLevel: candidate.hintLevel,
      solutionRevealed: candidate.solutionRevealed === true,
      citations: Array.isArray(candidate.citations) ? candidate.citations : [],
      masterySignal: candidate.masterySignal,
      warnings: Array.isArray(candidate.warnings) ? candidate.warnings : [],
      meta: {
        requestId: isServerEnvelope ? value.requestId : undefined,
        source: isServerEnvelope ? value.source : undefined,
        degraded: isServerEnvelope && value.degraded === true,
        version: candidate.version,
        mode: candidate.mode,
      },
    };
  }

  const hasStructuredField = RESPONSE_FIELDS.some((field) => candidate[field] != null);

  if (!hasStructuredField) {
    const fallback = candidate.message ?? candidate.answer ?? candidate.text;
    return {
      explanation: fallback == null
        ? 'The tutor returned an unrecognized response. Try asking in a different way.'
        : String(fallback),
    };
  }

  return RESPONSE_FIELDS.reduce((response, field) => {
    if (candidate[field] != null) response[field] = candidate[field];
    return response;
  }, {});
}

function stripSensitiveFields(value, seen = new WeakSet()) {
  if (value == null || typeof value !== 'object') return value;
  if (seen.has(value)) return undefined;
  seen.add(value);

  if (Array.isArray(value)) {
    return value
      .map((item) => stripSensitiveFields(item, seen))
      .filter((item) => item !== undefined);
  }

  return Object.entries(value).reduce((clean, [key, item]) => {
    if (SENSITIVE_CONTEXT_KEYS.test(key)) return clean;
    const sanitized = stripSensitiveFields(item, seen);
    if (sanitized !== undefined) clean[key] = sanitized;
    return clean;
  }, {});
}

function buildProblemContext(problem = {}) {
  return {
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    pattern: problem.pattern,
    description: problem.description,
    constraints: problem.constraints,
    examples: problem.examples,
    timeTarget: problem.timeO,
    spaceTarget: problem.spaceO,
  };
}

function buildExecutionContext(language, testResults, sharedCode) {
  const result = Array.isArray(testResults)
    ? testResults.find((test) => test && test.passed === false) || testResults[0]
    : testResults;
  const sanitizedResult = stripSensitiveFields(result && typeof result === 'object' ? result : {});
  const execution = {
    language,
    ...(Array.isArray(testResults)
      ? {
        verdict: result ? (result.verdict || result.kind || (result.passed ? 'accepted' : 'wrong-answer')) : 'unknown',
        failedCase: sanitizedResult,
      }
      : sanitizedResult),
  };
  if (sharedCode) execution.code = sharedCode;
  return execution;
}

function serializeUserHistory(messages) {
  return messages
    .filter((message) => message?.role === 'user')
    .slice(-USER_HISTORY_TURNS)
    .map((message) => ({
      role: 'user',
      content: String(message.content ?? '').trim().slice(0, USER_HISTORY_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content);
}

function useOnlineStatus(explicitOnline) {
  const [detectedOnline, setDetectedOnline] = useState(() => (
    typeof navigator === 'undefined' ? true : navigator.onLine !== false
  ));

  useEffect(() => {
    if (typeof explicitOnline === 'boolean' || typeof window === 'undefined') return undefined;
    const markOnline = () => setDetectedOnline(true);
    const markOffline = () => setDetectedOnline(false);
    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);
    return () => {
      window.removeEventListener('online', markOnline);
      window.removeEventListener('offline', markOffline);
    };
  }, [explicitOnline]);

  return typeof explicitOnline === 'boolean' ? explicitOnline : detectedOnline;
}

function readableValue(value, fallback = 'Not recorded') {
  if (value == null || value === '') return fallback;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ') || fallback;
  if (typeof value === 'object') return value.label || value.title || fallback;
  return String(value);
}

function summarizeTests(testResults) {
  if (!Array.isArray(testResults) || testResults.length === 0) return null;
  const passed = testResults.filter((result) => result?.passed).length;
  return `${passed}/${testResults.length} passing`;
}

function textParts(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.flatMap((item) => textParts(item));
  if (typeof value === 'object') {
    const text = value.text ?? value.content ?? value.summary ?? value.detail ?? value.description;
    return text == null ? [] : textParts(text);
  }
  return String(value).split('\n').filter(Boolean);
}

function objectTitle(value, fallback) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  return value.title || value.label || fallback;
}

function safeHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value) ? value : null;
}

function humanizeToken(value) {
  if (value == null || value === '') return '';
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function warningCopy(value) {
  const warnings = {
    'offline-tutor': 'Live coaching is unavailable, so this guidance was created by AlgoVista’s grounded fallback.',
    'grounding-missing': 'Some lesson context was unavailable. Treat this as a thinking prompt, not a factual explanation.',
    'provider-response-invalid': 'The live tutor returned an invalid response, so AlgoVista substituted safe fallback guidance.',
    'provider-response-empty': 'The live tutor returned no usable explanation, so AlgoVista substituted safe fallback guidance.',
    'provider-solution-blocked': 'A complete solution was withheld to protect your learning attempt.',
    'backend-unavailable': 'The tutor service is unavailable, so this response stayed in your browser.',
  };
  return warnings[value] || humanizeToken(value);
}

function FieldCard({ className = '', eyebrow, title, children }) {
  return (
    <section className={`av-tutor__field-card ${className}`.trim()}>
      {eyebrow && <p className="av-tutor__eyebrow">{eyebrow}</p>}
      {title && <h4>{title}</h4>}
      {children}
    </section>
  );
}

function TextContent({ value, ordered = false }) {
  const parts = textParts(value);
  if (!parts.length) return null;
  if (parts.length === 1) return <p className="av-tutor__response-copy">{parts[0]}</p>;
  const List = ordered ? 'ol' : 'ul';
  return <List className="av-tutor__response-list">{parts.map((part, index) => <li key={`${part}-${index}`}>{part}</li>)}</List>;
}

function StructuredTutorResponse({
  response,
  onUseQuestion,
  onVisualAction,
  onNextExercise,
}) {
  const normalized = normalizeTutorResponse(response);
  const diagnosis = normalized.diagnosis;
  const explanation = normalized.explanation;
  const nextQuestion = normalized.nextQuestion;
  const hint = normalized.hint;
  const nextAction = normalized.nextAction;
  const hintLevel = normalized.hintLevel;
  const masterySignal = normalized.masterySignal;
  const warnings = Array.isArray(normalized.warnings) ? normalized.warnings.filter(Boolean) : [];
  const meta = normalized.meta || {};
  const isFallback = meta.degraded || warnings.includes('offline-tutor');
  const visualActions = normalized.visualAction == null
    ? []
    : Array.isArray(normalized.visualAction)
      ? normalized.visualAction
      : [normalized.visualAction];
  const exercises = normalized.nextExercise == null
    ? []
    : Array.isArray(normalized.nextExercise)
      ? normalized.nextExercise
      : [normalized.nextExercise];
  const sourceValue = normalized.citations ?? normalized.sources;
  const sources = sourceValue == null
    ? []
    : Array.isArray(sourceValue)
      ? sourceValue
      : [sourceValue];
  const questionText = typeof nextQuestion === 'object'
    ? nextQuestion.prompt || nextQuestion.question || nextQuestion.text
    : nextQuestion;

  return (
    <div className="av-tutor__structured-response">
      {isFallback && (
        <section className="av-tutor__response-state" role="status">
          <span aria-hidden="true">◌</span>
          <div>
            <b>{warnings.includes('offline-tutor') ? 'Offline tutor fallback' : 'Limited tutor mode'}</b>
            <small>
              {warnings.includes('offline-tutor')
                ? 'Grounded guidance is still available, but live coaching is not.'
                : 'This response used a safe fallback. You can keep learning and retry later.'}
            </small>
          </div>
        </section>
      )}

      {diagnosis != null && (
        <FieldCard
          className="av-tutor__field-card--diagnosis"
          eyebrow="Diagnosis"
          title={objectTitle(diagnosis, null)}
        >
          <TextContent value={diagnosis} />
          {diagnosis?.evidence && (
            <div className="av-tutor__evidence"><span>Evidence</span><TextContent value={diagnosis.evidence} /></div>
          )}
        </FieldCard>
      )}

      {explanation != null && (
        <FieldCard eyebrow="Explanation" title={objectTitle(explanation, null)}>
          <TextContent value={explanation} ordered={Boolean(explanation?.steps)} />
          {explanation?.steps && <TextContent value={explanation.steps} ordered />}
          {explanation?.code && <pre className="av-tutor__code"><code>{String(explanation.code)}</code></pre>}
        </FieldCard>
      )}

      {hint != null && (
        <FieldCard
          className="av-tutor__field-card--hint"
          eyebrow={hint?.level ? `Hint · ${hint.level}` : 'Hint'}
          title={objectTitle(hint, null)}
        >
          <TextContent value={hint} />
        </FieldCard>
      )}

      {(nextAction || hintLevel != null) && (
        <FieldCard className="av-tutor__field-card--action" eyebrow="Recommended next step">
          <div className="av-tutor__next-action">
            <div>
              <b>{humanizeToken(nextAction) || 'Continue reasoning'}</b>
              <small>Do this before asking for a stronger hint.</small>
            </div>
            {hintLevel != null && <span>Hint level {String(hintLevel)} of 3</span>}
          </div>
        </FieldCard>
      )}

      {questionText && (
        <FieldCard className="av-tutor__field-card--question" eyebrow="Your turn">
          <p className="av-tutor__next-question">{String(questionText)}</p>
          {nextQuestion?.reason && <small>{nextQuestion.reason}</small>}
          <button type="button" className="av-tutor__text-action" onClick={() => onUseQuestion(String(questionText))}>
            Answer this question
          </button>
        </FieldCard>
      )}

      {normalized.solutionRevealed && (
        <section className="av-tutor__solution-notice" role="note">
          <b>Solution content was revealed</b>
          <span>Try to restate the invariant from memory before returning to the editor.</span>
        </section>
      )}

      {visualActions.map((action, index) => {
        const label = typeof action === 'object'
          ? action.label || action.title || 'Open visual explanation'
          : String(action);
        const description = typeof action === 'object' ? action.description : null;
        return (
          <FieldCard key={`${label}-${index}`} className="av-tutor__field-card--visual" eyebrow="Visual action">
            <div className="av-tutor__linked-action">
              <div><b>{label}</b>{description && <span>{description}</span>}</div>
              {onVisualAction && (
                <button type="button" onClick={() => onVisualAction(action)}>
                  Open
                </button>
              )}
            </div>
          </FieldCard>
        );
      })}

      {exercises.map((exercise, index) => {
        const title = typeof exercise === 'object'
          ? exercise.title || exercise.label || 'Next exercise'
          : String(exercise);
        return (
          <FieldCard key={`${title}-${index}`} className="av-tutor__field-card--exercise" eyebrow="Next exercise">
            <div className="av-tutor__linked-action">
              <div>
                <b>{title}</b>
                {exercise?.reason && <span>{exercise.reason}</span>}
                {exercise?.difficulty && <small>{exercise.difficulty}</small>}
              </div>
              {onNextExercise && (
                <button type="button" onClick={() => onNextExercise(exercise)}>
                  Practice
                </button>
              )}
            </div>
          </FieldCard>
        );
      })}

      {sources.length > 0 && (
        <section className="av-tutor__sources" aria-label="Tutor sources">
          <p className="av-tutor__eyebrow">Sources</p>
          <ul>
            {sources.map((source, index) => {
              const title = typeof source === 'object'
                ? source.title || source.label || source.url || `Source ${index + 1}`
                : String(source);
              const url = typeof source === 'object' ? safeHttpUrl(source.url) : safeHttpUrl(source);
              return <li key={`${title}-${index}`}>{url ? <a href={url} target="_blank" rel="noreferrer">{title}<span aria-hidden="true"> ↗</span></a> : <span>{title}</span>}</li>;
            })}
          </ul>
        </section>
      )}

      {masterySignal && typeof masterySignal === 'object' && (
        <section className="av-tutor__mastery" aria-label="Advisory learning signal">
          <div>
            <p className="av-tutor__eyebrow">Learning signal</p>
            <b>{humanizeToken(masterySignal.evidence || 'none')} evidence</b>
          </div>
          <span>
            Confidence cue {Number(masterySignal.confidenceDelta) > 0 ? '+' : ''}
            {Number(masterySignal.confidenceDelta) || 0}
          </span>
          <small>Advisory only · your progress changes from completed learning actions.</small>
        </section>
      )}

      {warnings.filter((warning) => warning !== 'offline-tutor').length > 0 && (
        <section className="av-tutor__warnings" aria-label="Tutor response notices">
          <p className="av-tutor__eyebrow">Response notices</p>
          <ul>
            {warnings.filter((warning) => warning !== 'offline-tutor').map((warning, index) => (
              <li key={`${warning}-${index}`}>{warningCopy(warning)}</li>
            ))}
          </ul>
        </section>
      )}

      {(meta.source || meta.requestId) && (
        <footer className="av-tutor__response-meta">
          {meta.source && <span>Source · {humanizeToken(meta.source)}</span>}
          {meta.requestId && <span title={String(meta.requestId)}>Request · {String(meta.requestId).slice(0, 12)}</span>}
        </footer>
      )}
    </div>
  );
}

function LearnerContextSummary({ problem, language, learnerContext = {}, testResults, includeCode }) {
  const customItems = Array.isArray(learnerContext.summaryItems)
    ? learnerContext.summaryItems
    : [];
  const defaultItems = [
    ['Problem', problem?.title],
    ['Language', language],
    ['Learning stage', learnerContext.evidenceLevel || learnerContext.mastery || learnerContext.stage],
    ['Attempts', learnerContext.attemptCount ?? learnerContext.attempts],
    ['Hints used', learnerContext.hintsUsed ?? learnerContext.hintDepth],
    ['Last result', learnerContext.lastResult || summarizeTests(testResults)],
  ];
  const items = [
    ...defaultItems,
    ...customItems.map((item) => [item.label, item.value]),
  ].filter(([, value]) => value != null && value !== '');

  return (
    <details className="av-tutor__context">
      <summary>
        <span><b>Learner context</b><small>{items.length} signals available</small></span>
        <span className={includeCode ? 'is-sharing' : ''}>{includeCode ? 'Code included' : 'Code private'}</span>
      </summary>
      <dl>
        {items.map(([label, value], index) => (
          <div key={`${label}-${index}`}><dt>{label}</dt><dd>{readableValue(value)}</dd></div>
        ))}
      </dl>
      {(learnerContext.plan || learnerContext.invariant) && (
        <div className="av-tutor__context-note">
          <span>Current invariant</span>
          <p>{learnerContext.invariant || learnerContext.plan}</p>
        </div>
      )}
    </details>
  );
}

function ComposerStatus({ online, connected, error }) {
  if (!online) return <span className="av-tutor__composer-status is-offline">Offline · reconnect to ask the tutor</span>;
  if (!connected) return <span className="av-tutor__composer-status">Tutor service is not connected</span>;
  if (error) return <span className="av-tutor__composer-status is-error">The last request did not complete</span>;
  return <span className="av-tutor__composer-status">Ctrl/Command + Enter to send</span>;
}

/**
 * A provider-agnostic contextual tutor for the AlgoVista practice workspace.
 *
 * `onAsk` receives:
 * `{ question, mode, privacy, context, history?, signal }`.
 * The preferred response is the server envelope
 * `{ requestId, source, degraded, tutor: { message, nextQuestion, nextAction,
 * hintLevel, solutionRevealed, citations, masterySignal, warnings } }`.
 * Plain strings and the original structured response fields remain supported for
 * embedders that have not migrated yet.
 */
export default function ContextualPracticeTutor({
  open = true,
  onClose,
  variant = 'drawer',
  closeOnBackdrop = true,
  problem = {},
  code = '',
  language = 'javascript',
  testResults = null,
  learnerContext = {},
  mode,
  defaultMode = 'socratic',
  onModeChange,
  onAsk,
  onResponse,
  onVisualAction,
  onNextExercise,
  initialMessages = [],
  onMessagesChange,
  conversationKey,
  starterQuestion = '',
  online,
  accentColor = '#00d4aa',
  className = '',
}) {
  const messageCounterRef = useRef(0);
  const rootRef = useRef(null);
  const closeButtonRef = useRef(null);
  const composerRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const priorFocusRef = useRef(null);
  const requestControllerRef = useRef(null);
  const modeButtonRefs = useRef([]);
  const previousConversationRef = useRef(conversationKey ?? problem?.id);
  const starterKeyRef = useRef(`${conversationKey ?? problem?.id ?? ''}:${String(starterQuestion || '')}`);
  const [internalMode, setInternalMode] = useState(
    MODE_IDS.has(defaultMode) ? defaultMode : 'socratic'
  );
  const [messages, setMessages] = useState(() => normalizeInitialMessages(initialMessages, messageCounterRef));
  const [draft, setDraft] = useState(() => String(starterQuestion || ''));
  const [includeCode, setIncludeCode] = useState(false);
  const [shareHistory, setShareHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuestion, setLastQuestion] = useState('');
  const isOnline = useOnlineStatus(online);
  const currentConversationKey = conversationKey ?? problem?.id;
  const activeMode = MODE_IDS.has(mode) ? mode : internalMode;
  const currentMode = TUTOR_MODES.find((item) => item.id === activeMode) || TUTOR_MODES[0];
  const canIncludeCode = Boolean(code && String(code).trim());
  const codeWillBeIncluded = includeCode && canIncludeCode;

  useEffect(() => {
    if (previousConversationRef.current === currentConversationKey) return;
    previousConversationRef.current = currentConversationKey;
    requestControllerRef.current?.abort();
    setMessages(normalizeInitialMessages(initialMessages, messageCounterRef));
    setDraft(String(starterQuestion || ''));
    setIncludeCode(false);
    setShareHistory(false);
    setLoading(false);
    setError(null);
    setLastQuestion('');
    starterKeyRef.current = `${currentConversationKey ?? ''}:${String(starterQuestion || '')}`;
  }, [currentConversationKey, initialMessages, starterQuestion]);

  useEffect(() => {
    const starter = String(starterQuestion || '');
    const starterKey = `${currentConversationKey ?? ''}:${starter}`;
    if (!starter || starterKeyRef.current === starterKey) return;
    starterKeyRef.current = starterKey;
    setDraft(starter);
  }, [currentConversationKey, starterQuestion]);

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    priorFocusRef.current = document.activeElement;
    const focusTimer = window.setTimeout(() => {
      const initialFocus = variant === 'drawer'
        ? closeButtonRef.current || modeButtonRefs.current.find(Boolean) || rootRef.current
        : rootRef.current;
      initialFocus?.focus();
    }, 0);
    return () => {
      window.clearTimeout(focusTimer);
      requestControllerRef.current?.abort();
      if (priorFocusRef.current && typeof priorFocusRef.current.focus === 'function') {
        priorFocusRef.current.focus();
      }
    };
  }, [open, variant]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [messages, loading]);

  const changeMode = useCallback((nextMode) => {
    if (!MODE_IDS.has(nextMode)) return;
    if (!MODE_IDS.has(mode)) setInternalMode(nextMode);
    onModeChange?.(nextMode);
  }, [mode, onModeChange]);

  const handleModeKeyDown = (event, index) => {
    let nextIndex = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % TUTOR_MODES.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + TUTOR_MODES.length) % TUTOR_MODES.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = TUTOR_MODES.length - 1;
    if (nextIndex == null) return;
    event.preventDefault();
    const nextMode = TUTOR_MODES[nextIndex].id;
    changeMode(nextMode);
    modeButtonRefs.current[nextIndex]?.focus();
  };

  const handleRootKeyDown = (event) => {
    if (event.key === 'Escape' && onClose) {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || variant !== 'drawer' || !rootRef.current) return;
    const focusable = Array.from(rootRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details > summary, [tabindex]:not([tabindex="-1"])'
    ));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const askTutor = useCallback(async (question, appendUserMessage = true) => {
    const trimmedQuestion = String(question || '').trim();
    if (!trimmedQuestion || loading || !isOnline || typeof onAsk !== 'function') return;

    const userMessage = {
      id: nextMessageId(messageCounterRef),
      role: 'user',
      mode: activeMode,
      content: trimmedQuestion,
      createdAt: new Date().toISOString(),
    };
    const priorHistoryMessages = appendUserMessage
      ? messages
      : messages.at(-1)?.role === 'user' && messages.at(-1)?.content === trimmedQuestion
        ? messages.slice(0, -1)
        : messages;
    const requestHistory = appendUserMessage ? [...messages, userMessage] : messages;
    if (appendUserMessage) setMessages(requestHistory);
    setDraft('');
    setLastQuestion(trimmedQuestion);
    setError(null);
    setLoading(true);

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    const request = {
      question: trimmedQuestion,
      mode: activeMode,
      privacy: {
        shareCode: codeWillBeIncluded,
        shareHistory,
        retainConversation: false,
      },
      context: {
        problem: buildProblemContext(problem),
        learner: stripSensitiveFields(learnerContext),
        execution: buildExecutionContext(
          language,
          testResults,
          codeWillBeIncluded ? String(code) : ''
        ),
      },
      ...(shareHistory ? { history: serializeUserHistory(priorHistoryMessages) } : {}),
      signal: controller.signal,
    };

    try {
      const rawResponse = await onAsk(request);
      if (controller.signal.aborted) return;
      const response = normalizeTutorResponse(rawResponse);
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId(messageCounterRef),
          role: 'assistant',
          mode: activeMode,
          content: response,
          createdAt: new Date().toISOString(),
        },
      ]);
      onResponse?.(response, request);
    } catch (requestError) {
      if (controller.signal.aborted || requestError?.name === 'AbortError') return;
      setError(requestError instanceof Error ? requestError : new Error('The tutor could not answer right now.'));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [
    activeMode,
    code,
    codeWillBeIncluded,
    isOnline,
    language,
    learnerContext,
    loading,
    messages,
    onAsk,
    onResponse,
    problem,
    shareHistory,
    testResults,
  ]);

  const fillQuestion = (question) => {
    setDraft(question);
    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  const clearConversation = () => {
    requestControllerRef.current?.abort();
    setMessages([]);
    setDraft('');
    setLoading(false);
    setError(null);
    setLastQuestion('');
  };

  const contextItems = useMemo(() => ({
    problem,
    language,
    learnerContext,
    testResults,
    includeCode: codeWillBeIncluded,
  }), [codeWillBeIncluded, language, learnerContext, problem, testResults]);

  if (!open) return null;

  const panel = (
    <section
      ref={rootRef}
      className={`av-tutor av-tutor--${variant} ${className}`.trim()}
      style={{ '--tutor-accent': accentColor }}
      role={variant === 'drawer' ? 'dialog' : 'complementary'}
      aria-modal={variant === 'drawer' ? 'true' : undefined}
      aria-labelledby="av-tutor-title"
      aria-describedby="av-tutor-description"
      tabIndex={-1}
      onKeyDown={handleRootKeyDown}
    >
      <header className="av-tutor__header">
        <div className="av-tutor__identity">
          <span className="av-tutor__mark" aria-hidden="true"><i />A</span>
          <div>
            <p>AlgoVista learning coach</p>
            <h2 id="av-tutor-title">Contextual tutor</h2>
          </div>
        </div>
        <div className="av-tutor__header-actions">
          {messages.length > 0 && (
            <button type="button" className="av-tutor__quiet-button" onClick={clearConversation} aria-label="Clear tutor conversation">
              Clear
            </button>
          )}
          {onClose && (
            <button ref={closeButtonRef} type="button" className="av-tutor__close" onClick={onClose} aria-label="Close contextual tutor">
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
        <p id="av-tutor-description" className="av-tutor__sr-only">
          Ask for guided help with the current data structures and algorithms problem.
        </p>
      </header>

      <div className="av-tutor__mode-region">
        <div className="av-tutor__mode-tabs" role="tablist" aria-label="Tutor mode">
          {TUTOR_MODES.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => { modeButtonRefs.current[index] = element; }}
              id={`av-tutor-mode-${item.id}`}
              type="button"
              role="tab"
              aria-selected={activeMode === item.id}
              aria-controls={`av-tutor-mode-panel-${item.id}`}
              tabIndex={activeMode === item.id ? 0 : -1}
              className={activeMode === item.id ? 'is-active' : ''}
              onClick={() => changeMode(item.id)}
              onKeyDown={(event) => handleModeKeyDown(event, index)}
            >
              <span aria-hidden="true">{item.icon}</span>
              <b>{item.shortLabel}</b>
            </button>
          ))}
        </div>
        {TUTOR_MODES.map((item) => (
          <section
            key={item.id}
            id={`av-tutor-mode-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`av-tutor-mode-${item.id}`}
            hidden={activeMode !== item.id}
            className="av-tutor__mode-panel"
          >
            <div><b>{item.label} mode</b><span>{item.description}</span></div>
            <div className="av-tutor__prompt-chips" aria-label={`${item.label} prompt starters`}>
              {item.prompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => fillQuestion(prompt)}>{prompt}</button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <LearnerContextSummary {...contextItems} />

      <div
        className="av-tutor__history"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={loading}
        aria-label="Tutor conversation"
      >
        {messages.length === 0 && (
          <div className="av-tutor__welcome">
            <span aria-hidden="true">{currentMode.icon}</span>
            <h3>Start with the smallest useful question.</h3>
            <p>{currentMode.description}</p>
            <small>Your editor code stays private unless you explicitly include it below.</small>
          </div>
        )}

        {messages.map((message) => (
          <article key={message.id} className={`av-tutor__message av-tutor__message--${message.role}`}>
            <header>
              <span>{message.role === 'assistant' ? 'Coach' : 'You'}</span>
              <small>{TUTOR_MODES.find((item) => item.id === message.mode)?.label || 'Tutor'}</small>
            </header>
            {message.role === 'assistant' ? (
              <StructuredTutorResponse
                response={message.content}
                onUseQuestion={fillQuestion}
                onVisualAction={onVisualAction ? (action) => onVisualAction(action, message.content) : null}
                onNextExercise={onNextExercise ? (exercise) => onNextExercise(exercise, message.content) : null}
              />
            ) : (
              <p>{message.content}</p>
            )}
          </article>
        ))}

        {loading && (
          <div className="av-tutor__message av-tutor__message--assistant av-tutor__loading" role="status">
            <header><span>Coach</span><small>Thinking with your context</small></header>
            <div><i /><i /><i /></div>
            <p>Building the next useful step…</p>
          </div>
        )}

        {error && (
          <div className="av-tutor__request-error" role="alert">
            <div><b>That request did not complete.</b><span>{error.message || 'Try again when the tutor service is available.'}</span></div>
            <button type="button" onClick={() => askTutor(lastQuestion, false)} disabled={!isOnline || loading}>Retry</button>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <footer className="av-tutor__composer">
        {!isOnline && (
          <div className="av-tutor__offline" role="status">
            <span aria-hidden="true">◌</span><div><b>You are offline</b><small>Your draft is safe. Reconnect to send it.</small></div>
          </div>
        )}
        <label className={`av-tutor__consent ${!canIncludeCode ? 'is-disabled' : ''}`}>
          <input
            type="checkbox"
            checked={codeWillBeIncluded}
            disabled={!canIncludeCode}
            onChange={(event) => setIncludeCode(event.target.checked)}
          />
          <span className="av-tutor__switch" aria-hidden="true"><i /></span>
          <span>
            <b>Include current editor code</b>
            <small>{canIncludeCode ? 'Off by default. Applies only while this switch is on.' : 'No editor code is available to share.'}</small>
          </span>
        </label>
        <label className="av-tutor__consent">
          <input
            type="checkbox"
            checked={shareHistory}
            onChange={(event) => setShareHistory(event.target.checked)}
          />
          <span className="av-tutor__switch" aria-hidden="true"><i /></span>
          <span>
            <b>Share prior questions</b>
            <small>Off by default. Only your last {USER_HISTORY_TURNS} questions are shared; coach replies stay private.</small>
          </span>
        </label>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            askTutor(draft);
          }}
        >
          <label htmlFor="av-tutor-question" className="av-tutor__sr-only">Ask the contextual tutor</label>
          <textarea
            ref={composerRef}
            id="av-tutor-question"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                askTutor(draft);
              }
            }}
            rows="3"
            placeholder={`Ask in ${currentMode.label.toLowerCase()} mode…`}
            aria-describedby="av-tutor-composer-status"
          />
          <button
            type="submit"
            className="av-tutor__send"
            disabled={!draft.trim() || loading || !isOnline || typeof onAsk !== 'function'}
            aria-label={loading ? 'Tutor is responding' : 'Send question to contextual tutor'}
          >
            <span aria-hidden="true">{loading ? '…' : '↑'}</span>
          </button>
        </form>
        <div id="av-tutor-composer-status" className="av-tutor__composer-meta">
          <ComposerStatus online={isOnline} connected={typeof onAsk === 'function'} error={error} />
          <span>
            {codeWillBeIncluded ? 'Code included' : 'Code private'} · {shareHistory ? 'Prior questions included' : 'History private'}
          </span>
        </div>
      </footer>
    </section>
  );

  if (variant !== 'drawer') return panel;

  return (
    <div
      className="av-tutor-layer"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose?.();
      }}
    >
      {panel}
    </div>
  );
}
