import { useEffect, useId, useMemo, useState } from 'react';
import { buildVisualSteps } from './visualStepBuilder';

function compactSentence(text = '') {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const sentence = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return (sentence ? sentence[0] : trimmed).trim();
}

function stateRows(state = []) {
  return state.map(([key, value]) => (
    <div key={`${key}-${value}`} className="visual-state-row">
      <span>{key}</span>
      <code>{String(value)}</code>
    </div>
  ));
}

function CellStrip({ items = [], color }) {
  return (
    <div className="visual-cell-strip">
      {items.map((item, index) => (
        <span
          key={`${item.value}-${index}`}
          className={`visual-cell visual-cell--${item.role || 'idle'}`}
          style={item.role === 'active' || item.role === 'match' ? { borderColor: color, color } : null}
        >
          <b>{item.value}</b>
          <small>{index}</small>
        </span>
      ))}
    </div>
  );
}

function LinkedListView({ visual, color }) {
  return (
    <div className="visual-linked-list">
      {(visual.nodes || []).map((node, index) => (
        <span key={`${node.value}-${index}`} className="visual-linked-list__item">
          <b
            className={`visual-cell visual-cell--${node.role || 'idle'}`}
            style={node.role === 'active' ? { borderColor: color, color } : null}
          >
            {node.value}
          </b>
          {index < visual.nodes.length - 1 && <i style={{ color }}>→</i>}
        </span>
      ))}
    </div>
  );
}

function TreeView({ visual, color }) {
  const nodes = visual.nodes || [];
  const rows = [[nodes[0]], nodes.slice(1, 3), nodes.slice(3, 7)].filter((row) => row.some(Boolean));

  return (
    <div className="visual-tree">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="visual-tree__row">
          {row.map((node, index) => (
            <b
              key={`${node?.value}-${rowIndex}-${index}`}
              className={`visual-tree__node visual-cell--${node?.role || 'idle'}`}
              style={node?.role === 'active' ? { borderColor: color, color } : null}
            >
              {node?.value ?? 'null'}
            </b>
          ))}
        </div>
      ))}
    </div>
  );
}

function MatrixView({ visual, color }) {
  const cols = Math.max(...(visual.cells || [[]]).map((row) => row.length), 1);

  return (
    <div className={`visual-matrix visual-matrix--${visual.mode || 'grid'}`} style={{ '--visual-cols': cols }}>
      {(visual.cells || []).flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <b
            key={`${rowIndex}-${colIndex}`}
            className={`visual-matrix__cell visual-cell--${cell.role || 'idle'}`}
            style={cell.role === 'active' ? { borderColor: color, color, background: `${color}14` } : null}
          >
            {String(cell.value)}
          </b>
        ))
      )}
    </div>
  );
}

function IntervalView({ visual, color }) {
  const intervals = visual.intervals || [];
  const min = Math.min(...intervals.map((item) => Number(item.start) || 0), 0);
  const max = Math.max(...intervals.map((item) => Number(item.end) || 0), 1);
  const span = Math.max(1, max - min);

  return (
    <div className="visual-intervals">
      {intervals.map((item, index) => {
        const start = Number(item.start) || 0;
        const end = Number(item.end) || start + 1;
        return (
          <div key={`${start}-${end}-${index}`} className="visual-interval">
            <span>[{start}, {end}]</span>
            <i>
              <b
                className={`visual-cell--${item.role || 'idle'}`}
                style={{
                  marginLeft: `${((start - min) / span) * 72}%`,
                  width: `${Math.max(14, ((end - start) / span) * 72)}%`,
                  background: item.role === 'active' ? color : undefined,
                }}
              />
            </i>
          </div>
        );
      })}
    </div>
  );
}

function GraphView({ visual, color }) {
  const nodeLabel = (value) => (Number.isInteger(value) ? String.fromCharCode(65 + value) : String(value));

  return (
    <div className="visual-graph">
      <div className="visual-graph__nodes">
        {(visual.nodes || []).map((node, index) => (
          <b
            key={`${node.value}-${index}`}
            className={`visual-graph__node visual-cell--${node.role || 'idle'}`}
            style={node.role === 'active' ? { borderColor: color, color, background: `${color}14` } : null}
          >
            {node.value}
          </b>
        ))}
      </div>
      <div className="visual-graph__edges">
        {(visual.edges || []).slice(0, 6).map((edge, index) => (
          <span key={`${edge}-${index}`}>{nodeLabel(edge[0])} → {nodeLabel(edge[1])}</span>
        ))}
        {!visual.edges?.length && <span>discover neighbors</span>}
      </div>
    </div>
  );
}

function BitView({ visual, color }) {
  return (
    <div className="visual-bit-row">
      {(visual.bits || []).map((bit, index) => (
        <b
          key={`${bit.value}-${index}`}
          className={`visual-cell--${bit.role || 'idle'}`}
          style={bit.role === 'active' ? { borderColor: color, color, background: `${color}14` } : null}
        >
          {bit.value}
          <small>{index}</small>
        </b>
      ))}
    </div>
  );
}

function TrieView({ visual, color }) {
  return (
    <div className="visual-trie">
      {(visual.chars || []).map((char, index) => (
        <span key={`${char.value}-${index}`}>
          <b
            className={`visual-cell--${char.role || 'idle'}`}
            style={char.role === 'active' ? { borderColor: color, color, background: `${color}14` } : null}
          >
            {char.value}
          </b>
          {index < visual.chars.length - 1 && <i style={{ background: color }} />}
        </span>
      ))}
    </div>
  );
}

function RecursionTreeView({ visual, color }) {
  const nodes = visual.nodes || [];
  const rows = [[nodes[0]], nodes.slice(1, 3), nodes.slice(3, 5)];

  return (
    <div className="visual-recursion">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((node, index) => (
            <b
              key={`${node?.value}-${index}`}
              className={`visual-cell--${node?.role || 'idle'}`}
              style={node?.role === 'active' ? { borderColor: color, color, background: `${color}14` } : null}
            >
              {node?.value}
            </b>
          ))}
        </div>
      ))}
    </div>
  );
}

function StringPair({ visual, color }) {
  const renderRow = (label, value) => (
    <div className="visual-string-row">
      <span>{label}</span>
      <div>
        {String(value).split('').map((ch, index) => {
          const active = visual.active?.row === label && visual.active?.index === index;
          return (
            <b
              key={`${label}-${index}`}
              style={active ? { borderColor: color, color, background: `${color}14` } : null}
            >
              {ch || ' '}
            </b>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="visual-string-pair">
      {renderRow('s', visual.source)}
      {renderRow('t', visual.target)}
    </div>
  );
}

function StackView({ visual, color }) {
  return (
    <div className="visual-stack-layout">
      <CellStrip items={visual.items} color={color} />
      <div className="visual-stack-box">
        <span>Stack top</span>
        <div>
          {[...(visual.stack || [])].reverse().map((item, index) => (
            <b key={`${item}-${index}`} style={index === 0 ? { borderColor: color, color } : null}>
              {item}
            </b>
          ))}
          {!visual.stack?.length && <em>empty</em>}
        </div>
      </div>
    </div>
  );
}

function VisualCanvas({ visual, color }) {
  if (visual.kind === 'string-pair') return <StringPair visual={visual} color={color} />;
  if (visual.kind === 'stack') return <StackView visual={visual} color={color} />;
  if (visual.kind === 'linked-list') return <LinkedListView visual={visual} color={color} />;
  if (visual.kind === 'tree') return <TreeView visual={visual} color={color} />;
  if (visual.kind === 'matrix') return <MatrixView visual={visual} color={color} />;
  if (visual.kind === 'intervals') return <IntervalView visual={visual} color={color} />;
  if (visual.kind === 'graph') return <GraphView visual={visual} color={color} />;
  if (visual.kind === 'bit') return <BitView visual={visual} color={color} />;
  if (visual.kind === 'trie') return <TrieView visual={visual} color={color} />;
  if (visual.kind === 'recursion-tree') return <RecursionTreeView visual={visual} color={color} />;

  return <CellStrip items={visual.items} color={color} />;
}

export default function ProblemVisualLab({ problem, topicColor }) {
  const steps = useMemo(() => buildVisualSteps(problem), [problem]);
  const [stepIndex, setStepIndex] = useState(0);
  const [confirmedSteps, setConfirmedSteps] = useState(() => new Set());
  const visualId = useId();
  const visualTitleId = `${visualId}-title`;
  const visualStageId = `${visualId}-stage`;
  const visualStepTitleId = `${visualId}-step-title`;
  const step = steps[stepIndex];
  const pct = Math.round(((stepIndex + 1) / steps.length) * 100);
  const masteryPct = Math.round((confirmedSteps.size / steps.length) * 100);
  const example = problem.examples?.[0];
  const stepConfirmed = confirmedSteps.has(stepIndex);

  useEffect(() => {
    setStepIndex(0);
    setConfirmedSteps(new Set());
  }, [problem.id]);

  const confirmStep = () => {
    setConfirmedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepIndex);
      return next;
    });
  };

  const moveToStep = (nextIndex) => {
    setStepIndex(Math.max(0, Math.min(steps.length - 1, nextIndex)));
  };

  return (
    <section className="visual-lab" aria-labelledby={visualTitleId}>
      <div className="visual-lab__header" style={{ borderColor: `${topicColor}45` }}>
        <div>
          <p style={{ color: topicColor }}>In-page visualization</p>
          <h3 id={visualTitleId}>{problem.title}</h3>
          <span>{compactSentence(problem.description)}</span>
          {example && (
            <div className="visual-lab__example">
              <code>{example.input}</code>
              <b style={{ color: topicColor }}>returns {example.output}</b>
            </div>
          )}
        </div>
        <div
          className="visual-lab__progress"
          role="progressbar"
          aria-label="Visualization progress"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={stepIndex + 1}
          aria-valuetext={`Step ${stepIndex + 1} of ${steps.length}`}
        >
          <b style={{ color: topicColor }}>{stepIndex + 1}/{steps.length}</b>
          <div><i style={{ width: `${pct}%`, background: topicColor }} /></div>
        </div>
      </div>

      <div className="visual-lab__grid">
        <div id={visualStageId} className="visual-lab__stage" aria-labelledby={visualStepTitleId} style={{ borderColor: `${topicColor}38` }}>
          <div className="visual-lab__stage-top">
            <p style={{ color: topicColor }}>Step {stepIndex + 1}</p>
            <h3 id={visualStepTitleId}>{step.title}</h3>
            <p className="practice-sr-only" role="status" aria-live="polite" aria-atomic="true">
              Step {stepIndex + 1} of {steps.length}: {step.title}. {step.narration}
            </p>
          </div>
          <VisualCanvas visual={step.visual} color={topicColor} />
          <div className="visual-lab__controls">
            <button type="button" onClick={() => moveToStep(0)} disabled={stepIndex === 0}>Reset</button>
            <button type="button" onClick={() => moveToStep(stepIndex - 1)} disabled={stepIndex === 0}>Previous</button>
            <button
              type="button"
              onClick={confirmStep}
              disabled={stepConfirmed}
              aria-pressed={stepConfirmed}
              style={stepConfirmed ? { borderColor: `${topicColor}55`, color: topicColor } : null}
            >
              {stepConfirmed ? 'Explained' : 'I Can Explain This'}
            </button>
            <button
              type="button"
              onClick={() => moveToStep(stepIndex + 1)}
              disabled={stepIndex === steps.length - 1}
              style={{ background: topicColor, borderColor: topicColor, color: '#031a14', fontWeight: 900 }}
            >
              Next Step
            </button>
          </div>
        </div>

        <aside className="visual-lab__explain" style={{ borderColor: `${topicColor}38` }}>
          <p style={{ color: topicColor }}>What changed?</p>
          <h3>{step.narration}</h3>
          <div className="visual-focus">
            <i style={{ background: topicColor }} />
            <span>{step.focus}</span>
          </div>
          <div className="visual-mastery" style={{ borderColor: `${topicColor}35` }}>
            <div>
              <p>Mastery check</p>
              <b style={{ color: topicColor }}>{masteryPct}% locked</b>
            </div>
            <span>
              Explain why this step keeps the {problem.pattern || 'pattern'} state truthful before moving to code.
            </span>
            <div
              role="progressbar"
              aria-label="Explained steps"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={masteryPct}
            >
              <i style={{ width: `${masteryPct}%`, background: topicColor }} />
            </div>
          </div>
          <div className="visual-state" role="status" aria-label="Current algorithm state" aria-live="polite" aria-atomic="true">
            <p>Live state</p>
            {stateRows(step.visual.state)}
          </div>
          <nav className="visual-step-list" aria-label="Visualization steps">
            {steps.map((item, index) => (
              <button
                key={`${item.title}-${index}`}
                type="button"
                className={index === stepIndex ? 'is-active' : ''}
                aria-current={index === stepIndex ? 'step' : undefined}
                aria-controls={visualStageId}
                aria-label={`${item.title}${confirmedSteps.has(index) ? ', explained' : ''}`}
                onClick={() => moveToStep(index)}
                style={index === stepIndex ? { borderColor: topicColor, color: topicColor } : null}
              >
                <span>{confirmedSteps.has(index) ? '✓' : index + 1}</span>
                {item.title}
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}
