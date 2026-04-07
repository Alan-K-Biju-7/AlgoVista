import { useState, useCallback, useRef } from 'react';
import { runWithTracer, diffSnapshots } from './tracerEngine';

export function useTracerSteps() {
  const [steps, setSteps]         = useState([]);
  const [currentIdx, setIdx]      = useState(0);
  const [isPlaying, setPlaying]   = useState(false);
  const [hasRun, setHasRun]       = useState(false);
  const timerRef                  = useRef(null);

  const run = useCallback((code, inputArgs, tracerConfig) => {
    clearInterval(timerRef.current);
    setPlaying(false);
    const s = runWithTracer(code, inputArgs, tracerConfig);
    setSteps(s);
    setIdx(0);
    setHasRun(true);
  }, []);

  const next = useCallback(() => setIdx(i => Math.min(i + 1, steps.length - 1)), [steps.length]);
  const prev = useCallback(() => setIdx(i => Math.max(i - 1, 0)), []);
  const goTo = useCallback((i) => setIdx(Math.max(0, Math.min(i, steps.length - 1))), [steps.length]);

  const play = useCallback((speed = 700) => {
    setPlaying(true);
    timerRef.current = setInterval(() => {
      setIdx(i => {
        if (i >= steps.length - 1) {
          clearInterval(timerRef.current);
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed);
  }, [steps.length]);

  const pause = useCallback(() => {
    clearInterval(timerRef.current);
    setPlaying(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setPlaying(false);
    setIdx(0);
  }, []);

  const currentStep = steps[currentIdx] || null;
  const prevStep    = steps[currentIdx - 1] || null;
  const changed     = diffSnapshots(prevStep?.vars, currentStep?.vars);

  return {
    steps, currentIdx, currentStep, prevStep, changed,
    isPlaying, hasRun,
    run, next, prev, goTo, play, pause, reset,
  };
}
