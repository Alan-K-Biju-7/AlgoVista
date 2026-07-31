import { runWithTracer, diffSnapshots } from './tracerEngine';
import { validateCodeForTracer } from './validateCode';
import { snapArray, snapWindow } from './recorders/arrayRecorder';
import { snapHashMap, snapPointers, snapStack } from './recorders/hashMapRecorder';

describe('tracer validation', () => {
  test('rejects empty code and warns on unsupported or risky patterns', () => {
    expect(validateCodeForTracer('', { expectedFnName: 'solve' })).toEqual(
      expect.objectContaining({
        valid: false,
        errors: ['Code is empty. Write your solution first.'],
      })
    );

    const result = validateCodeForTracer(
      `async function other() {
        while (true) {}
        await fetch('/api');
      }`,
      { expectedFnName: 'solve' }
    );

    expect(result.valid).toBe(true);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Infinite loop'),
        expect.stringContaining('Network/storage'),
        expect.stringContaining('async/await'),
        expect.stringContaining('Expected function "solve"'),
      ])
    );
  });
});

describe('tracer engine', () => {
  test('runs a trusted trace recipe and deep-clones logged snapshots', () => {
    const config = {
      runner(args, log) {
        const arr = args[0];
        log({ line: 1, vars: { first: arr[0] }, structure: { type: 'array', items: arr } });
        arr[0] = 99;
        log({ line: 2, vars: { first: arr[0] }, structure: { type: 'array', items: arr } });
      },
    };

    const steps = runWithTracer('function solve(nums) { return nums; }', [[1, 2, 3]], config);

    expect(steps).toHaveLength(2);
    expect(steps[0]).toEqual(
      expect.objectContaining({
        line: 1,
        vars: { first: 1 },
        structure: { type: 'array', items: [1, 2, 3] },
        timestamp: 0,
      })
    );
    expect(steps[1]).toEqual(
      expect.objectContaining({
        line: 2,
        vars: { first: 99 },
        structure: { type: 'array', items: [99, 2, 3] },
        timestamp: 1,
      })
    );
  });

  test('never evaluates learner source in the application realm', () => {
    const steps = runWithTracer(
      'throw new Error("LEARNER_SOURCE_EXECUTED");',
      [[4, 2]],
      {
        runner(args, log) {
          const arr = args[0];
          log({ line: 1, vars: { smallest: Math.min(...arr) }, structure: null });
        },
      }
    );

    expect(steps).toEqual([
      expect.objectContaining({ line: 1, vars: { smallest: 2 } }),
    ]);
    expect(steps[0].message).toBeUndefined();
  });

  test('normalizes runtime errors into trace steps', () => {
    const steps = runWithTracer('', [], {
      runner() {
        missingFunction();
      },
    });

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual(
      expect.objectContaining({
        type: 'error',
        message: expect.stringContaining('missingFunction is not defined'),
      })
    );
  });

  test('fails closed when no repository-owned trace function exists', () => {
    const steps = runWithTracer('function solve() {}', [], { runnerBody: 'return 1;' });
    expect(steps).toEqual([
      expect.objectContaining({
        type: 'error',
        message: 'This problem does not have a trusted reference trace yet.',
      }),
    ]);
  });

  test('diffSnapshots reports changed keys only', () => {
    expect(diffSnapshots(null, { a: 1 })).toEqual(new Set());
    expect(diffSnapshots({ a: 1, b: [1] }, { a: 2, b: [1] })).toEqual(new Set(['a']));
  });
});

describe('tracer recorders', () => {
  test('array and hash recorders emit structured snapshots for visuals', () => {
    expect(snapArray([3, 1], { 0: 'active' }, 'Nums')).toEqual({
      type: 'array',
      label: 'Nums',
      items: [
        { idx: 0, val: 3, role: 'active' },
        { idx: 1, val: 1, role: null },
      ],
    });

    expect(snapWindow([1, 2, 3], 1, 2).items.map((item) => item.role)).toEqual([
      null,
      'lo',
      'hi',
    ]);

    expect(snapHashMap(new Map([['a', 1]]), { a: 'hit' }, 'Seen')).toEqual({
      type: 'hashmap',
      label: 'Seen',
      entries: [{ key: 'a', val: '1', role: 'hit' }],
    });

    expect(snapStack(['(', '['], { 0: 'top' }, 'Stack').items).toEqual([
      { val: '[', role: 'top', isTop: true },
      { val: '(', role: null, isTop: false },
    ]);

    expect(snapPointers([10, 20], { left: 0, right: 1 }, 'Pointers').items).toEqual([
      { idx: 0, val: 10, pointers: ['left'] },
      { idx: 1, val: 20, pointers: ['right'] },
    ]);
  });
});
