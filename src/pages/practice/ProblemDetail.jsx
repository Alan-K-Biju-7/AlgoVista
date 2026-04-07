import { useState } from 'react';
import { Link } from 'react-router-dom';
import HintSystem from './HintSystem';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';
import { runTests } from './testRunner';
import TracerPanel from './tracer/TracerPanel';
import { useTracerSteps } from './tracer/useTracerSteps';
import { TRACER_CONFIGS } from './tracer/configs/index';

const DIFF_COLOR = { Easy: '#00d4aa', Medium: '#f5a623', Hard: '#ff6b6b' };

export default function ProblemDetail({ problem, topicColor, onBack, onSolved, onAttempted }) {
  const [code, setCode]         = useState(problem.solution || '// Write your solution here\n');
  const [results, setResults]   = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [tab, setTab]           = useState('problem');
  const tracer        = useTracerSteps();
  const tracerConfig  = TRACER_CONFIGS[problem.id] || null;

  const handleTrace = () => {
    if (!tracerConfig) return;
    onAttempted(problem.id);
    const inputArgs = tracerConfig.defaultInput;
    tracer.run(code, inputArgs, tracerConfig);
    setTab('trace');
  };

  const handleRun = () => {
    onAttempted(problem.id);
    const res = runTests(code, problem.testCases);
    setResults(res);
    if (res.every(r => r.passed)) onSolved(problem.id);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.25rem 0' }}>← Back</button>
        <span style={{ color: 'var(--border-default)' }}>|</span>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', flex: 1 }}>{problem.title}</h2>
        <span style={{ padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700',
          color: DIFF_COLOR[problem.difficulty], background: DIFF_COLOR[problem.difficulty] + '18',
          border: `1px solid ${DIFF_COLOR[problem.difficulty]}40` }}>{problem.difficulty}</span>
        <span style={{ padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600',
          color: topicColor, background: topicColor + '18', border: `1px solid ${topicColor}40` }}>{problem.pattern}</span>
        <Link to={`/simulator#${problem.viz}`} style={{ padding: '0.3rem 0.75rem', borderRadius: '0.4rem', fontSize: '0.78rem',
          fontWeight: '600', background: topicColor + '20', color: topicColor, border: `1px solid ${topicColor}40`,
          textDecoration: 'none' }}>Open Visualizer →</Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-default)', paddingBottom: '0' }}>
        {['problem', ...(tracerConfig ? ['trace'] : []), 'solution'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.45rem 1rem', borderRadius: '0.4rem 0.4rem 0 0', border: 'none', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: tab === t ? '700' : '400',
            background: tab === t ? 'var(--bg-card)' : 'transparent',
            color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: tab === t ? `2px solid ${topicColor}` : '2px solid transparent',
          }}>{t === 'problem' ? '📋 Problem' : t === 'trace' ? '🔍 Trace' : '💡 Solution'}</button>
        ))}
      </div>

      {tab === 'problem' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Left: problem info */}
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{problem.description}</p>
            <p style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Examples</p>
            {problem.examples.map((ex, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Input: <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{ex.input}</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Output: <span style={{ color: '#00d4aa', fontFamily: 'monospace' }}>{ex.output}</span></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{ex.explanation}</div>
              </div>
            ))}
            <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem', background: topicColor + '0d', border: `1px solid ${topicColor}30` }}>
              <p style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: topicColor, marginBottom: '0.35rem' }}>Pattern</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{problem.pattern_explanation}</p>
            </div>
            <HintSystem hints={problem.hints} />
          </div>
          {/* Right: editor + run */}
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Your Solution</p>
            <CodeEditor value={code} onChange={setCode} height="300px" />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button onClick={handleRun} style={{
                padding: '0.55rem 1.25rem', borderRadius: '0.45rem', border: 'none', cursor: 'pointer',
                background: topicColor, color: '#000', fontWeight: '700', fontSize: '0.85rem',
              }}>▶ Run Tests</button>
              <button onClick={() => { setCode(problem.solution); setShowSolution(true); setTab('solution'); }} style={{
                padding: '0.55rem 1.25rem', borderRadius: '0.45rem', cursor: 'pointer',
                background: 'transparent', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem',
                border: '1px solid var(--border-default)',
              }}>Show Solution</button>
            </div>
            <TestResults results={results} />
          </div>
        </div>
      )}

      {tab === 'trace' && (
        <div>
          {!tracerConfig ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Visual tracer not yet available for this problem.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Your Code</p>
                <CodeEditor value={code} onChange={setCode} height="260px" />
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.6rem' }}>
                  <button onClick={handleTrace} style={{ padding: '0.5rem 1.1rem', borderRadius: '0.45rem', border: 'none', cursor: 'pointer', background: topicColor, color: '#000', fontWeight: '700', fontSize: '0.83rem' }}>
                    🔍 Trace Execution
                  </button>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                    Input: {JSON.stringify(tracerConfig.defaultInput)}
                  </div>
                </div>
              </div>
              <TracerPanel tracer={tracer} code={code} topicColor={topicColor} />
            </div>
          )}
        </div>
      )}

      {tab === 'solution' && (
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
            <pre style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', overflowX: 'auto', lineHeight: 1.6, fontFamily: 'monospace' }}>{problem.solution}</pre>
          </div>
          <div style={{ padding: '0.85rem', borderRadius: '0.5rem', background: topicColor + '0d', border: `1px solid ${topicColor}30` }}>
            <p style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: topicColor, marginBottom: '0.35rem' }}>Key Insight</p>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-primary)', lineHeight: 1.65 }}>{problem.pattern_explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
