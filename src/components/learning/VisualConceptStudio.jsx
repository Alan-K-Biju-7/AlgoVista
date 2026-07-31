import { useEffect, useId, useMemo, useState } from 'react';
import './VisualConceptStudio.css';

const DEFAULT_ACCENT = '#2dd4bf';

function isRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function asArray(value) {
  if (value == null || value === '') return [];
  return Array.isArray(value) ? value : [value];
}

function asText(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (isRecord(value)) {
    return asText(value.text ?? value.content ?? value.summary ?? value.description, fallback);
  }
  return fallback;
}

function stableId(value, fallback) {
  const id = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return id || fallback;
}

function normalizeList(value) {
  return asArray(value).map((item) => asText(item)).filter(Boolean);
}

function normalizeItems(value) {
  return asArray(value).map((item, index) => {
    if (isRecord(item)) {
      return {
        ...item,
        id: String(item.id ?? item.key ?? index),
        label: asText(item.label ?? item.title ?? item.value, `Item ${index + 1}`),
        value: asText(item.value ?? item.label ?? item.title, ''),
        detail: asText(item.detail ?? item.description ?? item.caption, ''),
      };
    }
    return { id: String(index), label: String(item), value: String(item), detail: '' };
  });
}

function normalizeStep(step, index, fallbackInvariant, fallbackItems) {
  const source = isRecord(step) ? step : { explanation: step };
  const visual = isRecord(source.visual) ? source.visual : {};
  const items = normalizeItems(source.items ?? visual.items ?? fallbackItems);
  const suppliedActiveIds = asArray(source.activeIds ?? source.activeIndexes ?? visual.activeIds);
  const suppliedCompletedIds = asArray(source.completedIds ?? source.doneIndexes ?? visual.completedIds);
  return {
    id: String(source.id ?? index),
    title: asText(source.title, `Step ${index + 1}`),
    explanation: asText(source.explanation ?? source.description ?? source.text, `Advance to step ${index + 1}.`),
    state: asText(source.state ?? source.snapshot, `Step ${index + 1}`),
    invariant: asText(source.invariant, fallbackInvariant),
    codeLine: asText(source.codeLine ?? source.code, ''),
    decision: asText(source.decision ?? source.question, ''),
    items,
    activeIds: suppliedActiveIds.length || !items.length ? suppliedActiveIds : [index % items.length],
    completedIds: suppliedCompletedIds.length
      ? suppliedCompletedIds
      : items.slice(0, Math.min(index, items.length)).map((item) => item.id),
    discardedIds: asArray(source.discardedIds ?? source.cutIndexes ?? visual.discardedIds),
    labels: isRecord(source.labels) ? source.labels : {},
  };
}

function normalizeMisconceptions(value) {
  return asArray(value).map((item, index) => {
    if (isRecord(item)) {
      return {
        id: String(item.id ?? index),
        myth: asText(item.myth ?? item.title ?? item.mistake, `Misconception ${index + 1}`),
        truth: asText(item.truth ?? item.correction ?? item.explanation, ''),
        example: asText(item.example ?? item.counterexample, ''),
      };
    }
    return {
      id: String(index),
      myth: String(item),
      truth: 'Test this claim against the invariant and a smallest counterexample.',
      example: '',
    };
  });
}

function normalizeInterviewPrompts(value) {
  return asArray(value).map((item, index) => {
    if (isRecord(item)) {
      return {
        id: String(item.id ?? index),
        question: asText(item.question ?? item.prompt ?? item.title, `Interview prompt ${index + 1}`),
        followUp: asText(item.followUp ?? item.followup, ''),
        hint: asText(item.hint, ''),
        strongAnswer: normalizeList(item.strongAnswer ?? item.answerPoints ?? item.rubric ?? item.answer),
      };
    }
    return { id: String(index), question: String(item), followUp: '', hint: '', strongAnswer: [] };
  });
}

function normalizeRetrievalQuestions(value, conceptTitle, invariant, fallbackCriteria = []) {
  const suppliedValue = isRecord(value)
    ? value.questions ?? (value.prompt || value.options || value.criteria ? value : value.question)
    : value;
  const supplied = asArray(suppliedValue);
  const questions = supplied.length ? supplied : [{
    prompt: `Explain ${conceptTitle} in your own words.`,
    criteria: normalizeList(fallbackCriteria).length
      ? normalizeList(fallbackCriteria)
      : [invariant || 'Name the state, update rule, and stopping condition.'],
  }];

  return questions.map((item, index) => {
    const source = isRecord(item) ? item : { prompt: item };
    const options = asArray(source.options).map((option, optionIndex) => {
      if (isRecord(option)) {
        return {
          id: String(option.id ?? option.value ?? optionIndex),
          label: asText(option.label ?? option.text ?? option.value, `Option ${optionIndex + 1}`),
        };
      }
      return { id: String(optionIndex), label: String(option) };
    });
    let correctAnswer = source.correctAnswer ?? source.answer ?? source.correctOption;
    if (typeof correctAnswer === 'number' && options[correctAnswer]) correctAnswer = options[correctAnswer].id;
    const matchingOption = options.find((option) => option.label === String(correctAnswer));
    if (matchingOption) correctAnswer = matchingOption.id;
    return {
      id: String(source.id ?? index),
      prompt: asText(source.prompt ?? source.question, `Retrieval question ${index + 1}`),
      options,
      correctAnswer: correctAnswer == null ? null : String(correctAnswer),
      explanation: asText(source.explanation ?? source.feedback, ''),
      criteria: normalizeList(source.criteria ?? source.answerPoints ?? source.rubric),
    };
  });
}

function normalizeConcept(input) {
  const concept = isRecord(input) ? input : {};
  const title = asText(concept.title ?? concept.name, 'Untitled concept');
  const explanation = isRecord(concept.explanation) ? concept.explanation : {};
  const mentalInput = isRecord(concept.mentalModel)
    ? concept.mentalModel
    : isRecord(concept.visualModel)
      ? concept.visualModel
      : {};
  const mentalModelCopy = asText(
    isRecord(concept.mentalModel) ? concept.mentalModel.description : concept.mentalModel,
    asText(concept.intuition ?? explanation.mentalModel ?? explanation.intuition, '')
  );
  const invariant = asText(concept.invariant ?? explanation.invariant, mentalModelCopy);
  const modelItems = normalizeItems(mentalInput.items ?? mentalInput.nodes ?? concept.visualItems);
  const defaultItems = modelItems.length ? modelItems : normalizeItems(['Input', 'State', 'Rule', 'Output']);
  const simulationInput = isRecord(concept.simulation) ? concept.simulation : {};
  const rawSteps = asArray(
    simulationInput.steps ?? concept.steps ?? concept.dryRun ?? explanation.steps ?? concept.reasoningSteps
  );
  const fallbackSteps = rawSteps.length
    ? rawSteps
    : ['Name the input and target.', 'Track the smallest useful state.', 'Apply one update rule.', 'Verify the invariant and result.'];
  const steps = fallbackSteps.map((step, index) => normalizeStep(step, index, invariant, defaultItems));
  const complexityInput = isRecord(concept.complexity) ? concept.complexity : {};
  const metrics = asArray(complexityInput.metrics ?? concept.complexityMetrics);
  const inferredMetrics = [
    ['Time', complexityInput.time ?? concept.timeComplexity],
    ['Space', complexityInput.space ?? concept.spaceComplexity],
    ['Best case', complexityInput.best],
    ['Average case', complexityInput.average],
    ['Worst case', complexityInput.worst],
  ].filter(([, value]) => value != null && value !== '').map(([label, value]) => ({ label, value }));
  const normalizedMetrics = (metrics.length ? metrics : inferredMetrics).map((metric, index) => {
    if (isRecord(metric)) {
      return {
        id: String(metric.id ?? index),
        label: asText(metric.label ?? metric.operation ?? metric.case, `Metric ${index + 1}`),
        value: asText(metric.value ?? metric.complexity ?? metric.cost, 'Depends'),
        note: asText(metric.note ?? metric.explanation, ''),
      };
    }
    return { id: String(index), label: `Metric ${index + 1}`, value: String(metric), note: '' };
  });
  const tradeoffSource = complexityInput.tradeoffs ?? concept.tradeoffs;
  const tradeoffs = asArray(tradeoffSource).map((tradeoff, index) => {
    if (isRecord(tradeoff)) {
      return {
        id: String(tradeoff.id ?? index),
        choice: asText(tradeoff.choice ?? tradeoff.title ?? tradeoff.benefit, `Tradeoff ${index + 1}`),
        gain: asText(tradeoff.gain ?? tradeoff.benefit ?? tradeoff.pro, ''),
        cost: asText(tradeoff.cost ?? tradeoff.downside ?? tradeoff.con, ''),
        useWhen: asText(tradeoff.useWhen ?? tradeoff.when, ''),
      };
    }
    return { id: String(index), choice: String(tradeoff), gain: '', cost: '', useWhen: '' };
  });
  const customSections = asArray(explanation.sections ?? concept.sections).map((section, index) => {
    if (isRecord(section)) {
      return {
        id: String(section.id ?? index),
        eyebrow: asText(section.eyebrow, 'Deep dive'),
        title: asText(section.title, `Explanation ${index + 1}`),
        body: normalizeList(section.body ?? section.content ?? section.text),
        points: normalizeList(section.points ?? section.items),
        code: asText(section.code ?? section.template, ''),
      };
    }
    return { id: String(index), eyebrow: 'Deep dive', title: `Explanation ${index + 1}`, body: [String(section)], points: [], code: '' };
  });
  if (normalizeList(concept.reasoningSteps).length) {
    customSections.push({
      id: 'reasoning-recipe',
      eyebrow: 'Reasoning recipe',
      title: 'How to derive it',
      body: [],
      points: normalizeList(concept.reasoningSteps),
      code: '',
    });
  }
  if (asText(concept.practice, '')) {
    customSections.push({
      id: 'practice-transfer',
      eyebrow: 'Apply',
      title: 'Try it without notes',
      body: [asText(concept.practice)],
      points: [],
      code: '',
    });
  }
  if (asText(concept.template, '')) {
    customSections.push({
      id: 'implementation-template',
      eyebrow: 'Code shape',
      title: 'Implementation skeleton',
      body: [],
      points: [],
      code: asText(concept.template),
    });
  }

  return {
    raw: concept,
    id: String(concept.id ?? stableId(title, 'concept')),
    title,
    section: asText(concept.section ?? concept.sectionTitle ?? concept.category, 'Concept studio'),
    level: asText(concept.level ?? concept.difficulty, 'All levels'),
    headline: asText(concept.headline ?? concept.summary ?? concept.focus, `Build a visual, explainable mental model for ${title}.`),
    objective: asText(concept.objective ?? concept.outcome ?? explanation.objective, ''),
    tags: normalizeList(concept.tags ?? concept.patterns ?? concept.useCases).slice(0, 6),
    accent: asText(concept.color ?? concept.accentColor, DEFAULT_ACCENT),
    explanation: {
      coreIdea: asText(explanation.coreIdea ?? concept.coreIdea ?? concept.description, ''),
      intuition: asText(explanation.intuition ?? concept.intuition, mentalModelCopy),
      invariant,
      whenToUse: asText(explanation.whenToUse ?? concept.whenToUse ?? concept.pattern, ''),
      sections: customSections,
    },
    mentalModel: {
      title: asText(mentalInput.title, `${title} mental model`),
      description: asText(mentalInput.description, mentalModelCopy || invariant),
      kind: stableId(mentalInput.kind ?? concept.kind ?? concept.visual ?? 'flow', 'flow'),
      items: defaultItems,
      legend: normalizeList(mentalInput.legend),
    },
    simulation: {
      title: asText(simulationInput.title, 'Trace the state change'),
      description: asText(simulationInput.description, 'Move one decision at a time and predict the next state before advancing.'),
      steps,
    },
    complexity: {
      summary: asText(complexityInput.summary ?? concept.complexitySummary, ''),
      metrics: normalizedMetrics.length
        ? normalizedMetrics
        : [{ id: 'implementation', label: 'Cost', value: 'Implementation-dependent', note: 'Count repeated work and extra state.' }],
      tradeoffs,
    },
    misconceptions: normalizeMisconceptions(concept.misconceptions ?? concept.traps),
    interviewPrompts: normalizeInterviewPrompts(concept.interviewPrompts ?? concept.interviewQuestions),
    retrievalQuestions: normalizeRetrievalQuestions(
      concept.retrievalCheck ?? concept.retrievalQuestions,
      title,
      invariant,
      concept.checkpoints
    ),
  };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => (
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  ));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    if (media.addEventListener) media.addEventListener('change', update);
    else media.addListener?.(update);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', update);
      else media.removeListener?.(update);
    };
  }, []);

  return reduced;
}

function itemMatches(values, item, index) {
  return values.some((value) => String(value) === String(item.id) || Number(value) === index);
}

function DefaultConceptVisual({ model, step, label, compact = false }) {
  const items = step?.items?.length ? step.items : model.items;
  return (
    <div
      className={`avls-visual avls-visual--${model.kind} ${compact ? 'is-compact' : ''}`.trim()}
      role="img"
      aria-label={label}
      data-layout={model.kind}
    >
      <div className="avls-visual__rail" aria-hidden="true" />
      <div className="avls-visual__items">
        {items.map((item, index) => {
          const active = step && itemMatches(step.activeIds, item, index);
          const complete = step && itemMatches(step.completedIds, item, index);
          const discarded = step && itemMatches(step.discardedIds, item, index);
          const itemLabel = step?.labels?.[item.id] ?? step?.labels?.[index] ?? item.detail;
          return (
            <div
              key={`${item.id}-${index}`}
              className={`avls-visual__item ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''} ${discarded ? 'is-discarded' : ''}`.trim()}
            >
              <span>{item.value || item.label}</span>
              <small>{itemLabel || item.label}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConceptVisual({ concept, model, step, stepIndex, isSimulation, renderVisual, compact }) {
  const custom = typeof renderVisual === 'function'
    ? renderVisual({ concept: concept.raw, model, step, stepIndex, isSimulation })
    : null;
  if (custom != null) return custom;
  const activeDetail = step ? ` ${step.title}. ${step.explanation}` : '';
  return (
    <DefaultConceptVisual
      model={model}
      step={step}
      compact={compact}
      label={`${model.title}.${activeDetail}`}
    />
  );
}

function ExplanationCard({ eyebrow, title, children, accent = false }) {
  if (!children) return null;
  return (
    <article className={`avls-card avls-explanation-card ${accent ? 'is-accent' : ''}`.trim()}>
      <p className="avls-eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      {children}
    </article>
  );
}

function TextBlocks({ value }) {
  const blocks = normalizeList(value);
  if (!blocks.length) return null;
  return blocks.map((block, index) => <p key={`${block}-${index}`}>{block}</p>);
}

function RetrievalQuestion({ question, index, namespace, answer, result, onAnswer, onCheck }) {
  const hasOptions = question.options.length > 0;
  const isCorrect = result && question.correctAnswer != null
    ? answer === question.correctAnswer
    : null;
  return (
    <article className="avls-retrieval__question">
      <div className="avls-retrieval__question-header">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <p className="avls-eyebrow">Retrieval prompt</p>
          <h3>{question.prompt}</h3>
        </div>
      </div>

      {hasOptions ? (
        <fieldset>
          <legend className="avls-sr-only">Choose one answer</legend>
          {question.options.map((option) => (
            <label key={option.id} className={answer === option.id ? 'is-selected' : ''}>
              <input
                type="radio"
                name={`${namespace}-retrieval-${question.id}`}
                value={option.id}
                checked={answer === option.id}
                onChange={() => onAnswer(option.id)}
              />
              <span aria-hidden="true" />
              <b>{option.label}</b>
            </label>
          ))}
        </fieldset>
      ) : (
        <label className="avls-retrieval__free-response">
          <span>Answer from memory</span>
          <textarea
            rows="4"
            value={answer || ''}
            onChange={(event) => onAnswer(event.target.value)}
            placeholder="State the idea, invariant, and one edge case without opening notes."
          />
        </label>
      )}

      <div className="avls-retrieval__actions">
        <button type="button" onClick={onCheck} disabled={!String(answer || '').trim()}>
          {hasOptions ? 'Check answer' : result ? 'Hide checklist' : 'Reveal checklist'}
        </button>
        {result && hasOptions && question.correctAnswer != null && (
          <span className={isCorrect ? 'is-correct' : 'is-incorrect'} role="status">
            {isCorrect ? 'Correct — explain why it is true.' : 'Not yet — compare it with the invariant.'}
          </span>
        )}
      </div>

      {result && (question.explanation || question.criteria.length > 0) && (
        <div className="avls-retrieval__feedback" role="note">
          {question.explanation && <p>{question.explanation}</p>}
          {question.criteria.length > 0 && (
            <div>
              <b>Self-check your explanation</b>
              <ul>{question.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * Schema-driven concept learning surface.
 *
 * Required: `concept.title`. All other fields degrade gracefully. Useful fields:
 * `explanation`, `mentalModel`, `simulation.steps`, `complexity`, `tradeoffs`,
 * `misconceptions`, `interviewPrompts`, and `retrievalCheck.questions`.
 */
export default function VisualConceptStudio({
  concept,
  accentColor,
  initialStep = 0,
  autoPlay = false,
  playbackMs = 1800,
  renderVisual,
  onStepChange,
  onRetrievalAnswer,
  className = '',
}) {
  const normalized = useMemo(() => normalizeConcept(concept), [concept]);
  const reactId = useId().replace(/:/g, '');
  const namespace = `avls-${stableId(normalized.id, 'concept')}-${reactId}`;
  const reducedMotion = useReducedMotion();
  const lastStep = Math.max(normalized.simulation.steps.length - 1, 0);
  const clampStep = (value) => Math.max(0, Math.min(lastStep, Number(value) || 0));
  const [stepIndex, setStepIndex] = useState(() => clampStep(initialStep));
  const [playing, setPlaying] = useState(Boolean(autoPlay && !reducedMotion));
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const activeStep = normalized.simulation.steps[stepIndex] || normalized.simulation.steps[0];
  const accent = accentColor || normalized.accent || DEFAULT_ACCENT;

  useEffect(() => {
    const nextStep = Math.max(0, Math.min(normalized.simulation.steps.length - 1, Number(initialStep) || 0));
    setStepIndex(nextStep);
    setPlaying(Boolean(autoPlay && !reducedMotion));
    setAnswers({});
    setResults({});
  }, [autoPlay, initialStep, normalized.id, normalized.simulation.steps.length, reducedMotion]);

  useEffect(() => {
    onStepChange?.({
      conceptId: normalized.id,
      step: activeStep,
      stepIndex,
      totalSteps: normalized.simulation.steps.length,
    });
  }, [activeStep, normalized.id, normalized.simulation.steps.length, onStepChange, stepIndex]);

  useEffect(() => {
    if (!playing || reducedMotion) return undefined;
    if (stepIndex >= lastStep) {
      setPlaying(false);
      return undefined;
    }
    const delay = Math.max(500, Math.min(10000, Number(playbackMs) || 1800));
    const timer = window.setTimeout(() => setStepIndex((current) => Math.min(current + 1, lastStep)), delay);
    return () => window.clearTimeout(timer);
  }, [lastStep, playbackMs, playing, reducedMotion, stepIndex]);

  const goToStep = (nextStep) => {
    setPlaying(false);
    setStepIndex(clampStep(nextStep));
  };

  const togglePlayback = () => {
    if (reducedMotion) return;
    if (playing) {
      setPlaying(false);
      return;
    }
    if (stepIndex >= lastStep) setStepIndex(0);
    setPlaying(true);
  };

  const handleSimulationKeyboard = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToStep(stepIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToStep(stepIndex + 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goToStep(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goToStep(lastStep);
    } else if ((event.key === ' ' || event.key === 'Spacebar') && !reducedMotion) {
      event.preventDefault();
      togglePlayback();
    }
  };

  const checkRetrieval = (question) => {
    const wasOpen = Boolean(results[question.id]);
    const selected = answers[question.id] || '';
    setResults((current) => ({ ...current, [question.id]: !wasOpen }));
    if (wasOpen) return;
    const correct = question.correctAnswer == null ? null : selected === question.correctAnswer;
    onRetrievalAnswer?.({
      conceptId: normalized.id,
      questionId: question.id,
      answer: selected,
      correct,
    });
  };

  const explanationCards = [
    ['Core idea', 'What it is', normalized.explanation.coreIdea],
    ['Intuition', 'How to picture it', normalized.explanation.intuition],
    ['Correctness lens', 'Invariant to protect', normalized.explanation.invariant],
    ['Pattern signal', 'When to reach for it', normalized.explanation.whenToUse],
  ].filter(([, , body]) => body);

  return (
    <article
      className={`av-learning-studio ${className}`.trim()}
      style={{ '--avls-accent': accent }}
      aria-labelledby={`${namespace}-title`}
    >
      <div className="avls-hero">
        <div className="avls-hero__copy">
          <p className="avls-eyebrow">{normalized.section}</p>
          <h2 id={`${namespace}-title`}>{normalized.title}</h2>
          <p>{normalized.headline}</p>
          {normalized.objective && <div className="avls-objective"><span>Learning objective</span><b>{normalized.objective}</b></div>}
        </div>
        <div className="avls-hero__meta" aria-label="Concept metadata">
          <span>{normalized.level}</span>
          <span>{normalized.simulation.steps.length} trace steps</span>
          {normalized.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>

      <nav className="avls-loop" aria-label="Concept learning loop">
        {[
          ['01', 'Understand', 'mental model', 'understand'],
          ['02', 'Trace', 'state changes', 'simulate'],
          ['03', 'Reason', 'costs and traps', 'reason'],
          ['04', 'Retrieve', 'from memory', 'retrieve'],
        ].map(([number, title, detail, target]) => (
          <a key={number} href={`#${namespace}-${target}`}>
            <span>{number}</span><b>{title}</b><small>{detail}</small>
          </a>
        ))}
      </nav>

      <section id={`${namespace}-understand`} className="avls-section" aria-labelledby={`${namespace}-understand-title`}>
        <div className="avls-section__header">
          <div><p className="avls-eyebrow">Understand</p><h2 id={`${namespace}-understand-title`}>Build the model before memorizing code</h2></div>
          <p>Connect the definition, moving state, and correctness rule in one picture.</p>
        </div>
        <div className="avls-understand">
          <div className="avls-explanation-grid">
            {explanationCards.map(([eyebrow, title, body], index) => (
              <ExplanationCard key={eyebrow} eyebrow={eyebrow} title={title} accent={index === 2}>
                <TextBlocks value={body} />
              </ExplanationCard>
            ))}
            {normalized.explanation.sections.map((section) => (
              <ExplanationCard key={section.id} eyebrow={section.eyebrow} title={section.title}>
                <TextBlocks value={section.body} />
                {section.points.length > 0 && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
                {section.code && <pre className="avls-explanation-card__code"><code>{section.code}</code></pre>}
              </ExplanationCard>
            ))}
          </div>
          <figure className="avls-card avls-model">
            <figcaption><p className="avls-eyebrow">Visual mental model</p><h3>{normalized.mentalModel.title}</h3></figcaption>
            <ConceptVisual
              concept={normalized}
              model={normalized.mentalModel}
              step={null}
              stepIndex={-1}
              isSimulation={false}
              renderVisual={renderVisual}
              compact
            />
            <p>{normalized.mentalModel.description}</p>
            {normalized.mentalModel.legend.length > 0 && (
              <ul className="avls-model__legend">{normalized.mentalModel.legend.map((item) => <li key={item}>{item}</li>)}</ul>
            )}
          </figure>
        </div>
      </section>

      <section id={`${namespace}-simulate`} className="avls-section" aria-labelledby={`${namespace}-simulate-title`}>
        <div className="avls-section__header">
          <div><p className="avls-eyebrow">Interactive trace</p><h2 id={`${namespace}-simulate-title`}>{normalized.simulation.title}</h2></div>
          <p>{normalized.simulation.description}</p>
        </div>
        <div className="avls-simulator avls-card">
          <div className="avls-simulator__toolbar">
            <div><span className="avls-live-dot" aria-hidden="true" /><b>State simulator</b></div>
            <span>Step {stepIndex + 1} of {normalized.simulation.steps.length}</span>
          </div>
          <div
            className="avls-simulator__canvas"
            tabIndex="0"
            onKeyDown={handleSimulationKeyboard}
            aria-label={`Simulation canvas. ${activeStep.title}. Use left and right arrows to change steps, Home and End to jump.`}
            aria-keyshortcuts="ArrowLeft ArrowRight Home End Space"
            data-step={stepIndex}
          >
            <ConceptVisual
              concept={normalized}
              model={normalized.mentalModel}
              step={activeStep}
              stepIndex={stepIndex}
              isSimulation
              renderVisual={renderVisual}
            />
          </div>
          <div className="avls-simulator__narration" aria-live="polite" aria-atomic="true">
            <div>
              <p className="avls-eyebrow">Observe</p>
              <h3>{activeStep.title}</h3>
              <p>{activeStep.explanation}</p>
              {activeStep.decision && <strong>Predict: {activeStep.decision}</strong>}
            </div>
            <dl>
              <div><dt>State</dt><dd>{activeStep.state}</dd></div>
              <div><dt>Invariant</dt><dd>{activeStep.invariant || 'Verify what must remain true.'}</dd></div>
            </dl>
            {activeStep.codeLine && <pre><code>{activeStep.codeLine}</code></pre>}
          </div>
          <div className="avls-simulator__controls" aria-label="Simulation controls">
            <button type="button" onClick={() => goToStep(stepIndex - 1)} disabled={stepIndex === 0} aria-label="Previous simulation step">← Previous</button>
            <button
              type="button"
              className="is-primary"
              onClick={togglePlayback}
              disabled={reducedMotion || normalized.simulation.steps.length < 2}
              aria-pressed={playing}
              title={reducedMotion ? 'Autoplay is disabled because reduced motion is enabled.' : undefined}
            >
              {playing ? 'Pause trace' : stepIndex >= lastStep ? 'Replay trace' : 'Play trace'}
            </button>
            <button type="button" onClick={() => goToStep(stepIndex + 1)} disabled={stepIndex >= lastStep} aria-label="Next simulation step">Next →</button>
            <div className="avls-simulator__timeline" aria-label="Choose a simulation step">
              {normalized.simulation.steps.map((step, index) => (
                <button
                  key={`${step.id}-${index}`}
                  type="button"
                  className={index === stepIndex ? 'is-current' : index < stepIndex ? 'is-complete' : ''}
                  onClick={() => goToStep(index)}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                  aria-current={index === stepIndex ? 'step' : undefined}
                >
                  <span>{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="avls-simulator__keyboard-note">
            Keyboard: focus the canvas, then use ←/→, Home/End{reducedMotion ? '. Autoplay is off for reduced motion.' : ', or Space to play/pause.'}
          </p>
        </div>
      </section>

      <section id={`${namespace}-reason`} className="avls-section" aria-labelledby={`${namespace}-reason-title`}>
        <div className="avls-section__header">
          <div><p className="avls-eyebrow">Reason</p><h2 id={`${namespace}-reason-title`}>Costs, choices, and failure modes</h2></div>
          <p>Complexity is a consequence of repeated work and stored state—not a label to memorize.</p>
        </div>
        <div className="avls-reason-grid">
          <article className="avls-card avls-complexity">
            <p className="avls-eyebrow">Complexity</p>
            <h3>Cost model</h3>
            {normalized.complexity.summary && <p>{normalized.complexity.summary}</p>}
            <dl>
              {normalized.complexity.metrics.map((metric) => (
                <div key={metric.id}><dt>{metric.label}</dt><dd><b>{metric.value}</b>{metric.note && <small>{metric.note}</small>}</dd></div>
              ))}
            </dl>
          </article>

          <article className="avls-card avls-tradeoffs">
            <p className="avls-eyebrow">Engineering judgment</p>
            <h3>Tradeoffs</h3>
            {normalized.complexity.tradeoffs.length ? (
              <div className="avls-tradeoffs__list">
                {normalized.complexity.tradeoffs.map((tradeoff) => (
                  <section key={tradeoff.id}>
                    <h4>{tradeoff.choice}</h4>
                    {tradeoff.gain && <p><span>Gain</span>{tradeoff.gain}</p>}
                    {tradeoff.cost && <p><span>Cost</span>{tradeoff.cost}</p>}
                    {tradeoff.useWhen && <p><span>Use when</span>{tradeoff.useWhen}</p>}
                  </section>
                ))}
              </div>
            ) : <p>Compare the simplest correct approach with the faster approach: what extra state, assumptions, or implementation risk does the optimization introduce?</p>}
          </article>

          <article className="avls-card avls-misconceptions">
            <p className="avls-eyebrow">Debug your model</p>
            <h3>Common misconceptions</h3>
            {normalized.misconceptions.length ? normalized.misconceptions.map((item, index) => (
              <details key={item.id} open={index === 0}>
                <summary><span aria-hidden="true">×</span>{item.myth}</summary>
                <div><b>Correction</b><p>{item.truth}</p>{item.example && <p><strong>Counterexample:</strong> {item.example}</p>}</div>
              </details>
            )) : <p>No misconceptions were supplied. Try to invent a smallest input that breaks a tempting shortcut.</p>}
          </article>

          <article className="avls-card avls-interview">
            <p className="avls-eyebrow">Interview lens</p>
            <h3>Explain, defend, extend</h3>
            {normalized.interviewPrompts.length ? normalized.interviewPrompts.map((prompt, index) => (
              <details key={prompt.id}>
                <summary><span>{String(index + 1).padStart(2, '0')}</span>{prompt.question}</summary>
                <div>
                  {prompt.followUp && <p><b>Follow-up</b>{prompt.followUp}</p>}
                  {prompt.hint && <p><b>Hint</b>{prompt.hint}</p>}
                  {prompt.strongAnswer.length > 0 && <div><b>A strong answer covers</b><ul>{prompt.strongAnswer.map((point) => <li key={point}>{point}</li>)}</ul></div>}
                </div>
              </details>
            )) : <p>Practice explaining the invariant, the dominant operation, and one edge case aloud.</p>}
          </article>
        </div>
      </section>

      <section id={`${namespace}-retrieve`} className="avls-section avls-retrieval" aria-labelledby={`${namespace}-retrieve-title`}>
        <div className="avls-section__header">
          <div><p className="avls-eyebrow">Retrieve</p><h2 id={`${namespace}-retrieve-title`}>Close the notes. Rebuild the idea.</h2></div>
          <p>Retrieval reveals understanding more reliably than rereading. Answer first; inspect feedback second.</p>
        </div>
        <div className="avls-retrieval__list">
          {normalized.retrievalQuestions.map((question, index) => (
            <RetrievalQuestion
              key={question.id}
              question={question}
              index={index}
              namespace={namespace}
              answer={answers[question.id]}
              result={results[question.id]}
              onAnswer={(answer) => {
                setAnswers((current) => ({ ...current, [question.id]: answer }));
                setResults((current) => ({ ...current, [question.id]: false }));
              }}
              onCheck={() => checkRetrieval(question)}
            />
          ))}
        </div>
      </section>
    </article>
  );
}

export { normalizeConcept as normalizeVisualConcept };
