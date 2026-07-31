import ArrayTracer from './visuals/ArrayTracer';
import { HashMapTracer, StackTracer } from './visuals/HashMapTracer';
import VariableInspector from './visuals/VariableInspector';
import StepControls from './visuals/StepControls';
import CodeHighlighter from './visuals/CodeHighlighter';

export default function TracerPanel({ tracer, code, topicColor }) {
  const { steps, currentIdx, currentStep, prevStep, changed, isPlaying, hasRun, next, prev, play, pause, reset } = tracer;

  if (!hasRun) {
    return (
      <div style={{ padding: '2.5rem', textAlign: 'center', border: '1px dashed var(--border-default)', borderRadius: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Reference Algorithm Trace</p>
        <p style={{ fontSize: '0.78rem' }}>Run the reference trace to inspect the canonical algorithm events step by step.</p>
      </div>
    );
  }

  if (!currentStep) return null;

  const isError = currentStep.type === 'error';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Step message */}
      <div style={{
        padding: '0.65rem 0.85rem', borderRadius: '0.5rem',
        background: isError ? '#ff6b6b12' : topicColor + '10',
        border: `1px solid ${isError ? '#ff6b6b40' : topicColor + '35'}`,
        fontSize: '0.83rem', color: isError ? '#ff6b6b' : 'var(--text-primary)',
        lineHeight: 1.5, fontWeight: isError ? '600' : '400',
      }}>
        {isError ? currentStep.message : currentStep.message || `Step ${currentIdx + 1}`}
        {isError && (
          <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #ff6b6b25', fontSize: '0.76rem', color: '#ff6b6b99', lineHeight: 1.6 }}>
            💡 <strong>Common fixes:</strong> Check your function name matches the starter, avoid infinite loops, don't use async/await or browser APIs inside tracer mode.
          </div>
        )}
      </div>

      {/* Structure visuals */}
      {currentStep.structure?.type === 'array'      && <ArrayTracer snapshot={currentStep.structure} prevSnapshot={prevStep?.structure} />}
      {currentStep.structure?.type === 'two_arrays' && <ArrayTracer snapshot={currentStep.structure} prevSnapshot={prevStep?.structure} />}
      {currentStep.structure?.type === 'pointers'   && <ArrayTracer snapshot={currentStep.structure} prevSnapshot={prevStep?.structure} />}
      {currentStep.structure?.type === 'hashmap'    && <HashMapTracer snapshot={currentStep.structure} />}
      {currentStep.structure?.type === 'stack'      && <StackTracer snapshot={currentStep.structure} />}

      {/* Variable inspector */}
      {currentStep.vars && <VariableInspector vars={currentStep.vars} changed={changed} />}

      {/* Code with active line */}
      <CodeHighlighter code={code} activeLine={currentStep.line} topicColor={topicColor} />

      {/* Controls */}
      <StepControls
        currentIdx={currentIdx} total={steps.length}
        isPlaying={isPlaying}
        onPrev={prev} onNext={next} onPlay={play} onPause={pause} onReset={reset}
        topicColor={topicColor}
      />
    </div>
  );
}
