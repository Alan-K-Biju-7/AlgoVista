const frame = ({
  title,
  explanation,
  state,
  invariant,
  activeIndexes = [],
  doneIndexes = [],
  cutIndexes = [],
  boundIndexes = [],
  movingIndexes = [],
  labels = {},
}) => ({
  title,
  explanation,
  state,
  invariant,
  activeIndexes,
  doneIndexes,
  cutIndexes,
  boundIndexes,
  movingIndexes,
  labels,
});

const simulations = {
  complexity: [
    ['Constant work', 'O(1)', 'Input grows, but the operation count stays nearly flat.'],
    ['Halve the search space', 'O(log n)', 'Doubling the input adds roughly one more decision.'],
    ['Touch every item', 'O(n)', 'The amount of work grows in direct proportion to input size.'],
    ['Repeat logarithmic work', 'O(n log n)', 'Each item participates across a logarithmic number of levels.'],
    ['Compare many pairs', 'O(n²)', 'Doubling the input can create roughly four times the work.'],
  ].map(([title, state, explanation], index) => frame({
    title,
    explanation,
    state: `growth class = ${state}`,
    invariant: 'Big-O compares growth as the input becomes large, not one stopwatch reading.',
    activeIndexes: [index],
    doneIndexes: Array.from({ length: index }, (_, itemIndex) => itemIndex),
  })),
  'array-memory': [
    frame({
      title: 'Start with the index',
      explanation: 'The program already knows the base address and receives index 2.',
      state: 'base + (2 × slot size)',
      invariant: 'Every slot has the same width.',
      activeIndexes: [2],
      labels: { 2: 'index 2' },
    }),
    frame({
      title: 'Compute one address',
      explanation: 'Arithmetic jumps directly to the third slot—no earlier values are scanned.',
      state: 'address = base + offset',
      invariant: 'Index order matches memory order.',
      activeIndexes: [2],
      doneIndexes: [0, 1],
      labels: { 2: 'address' },
    }),
    frame({
      title: 'Read the value',
      explanation: 'The value 25 is returned in constant time regardless of array length.',
      state: 'nums[2] = 25',
      invariant: 'One address calculation, one read.',
      activeIndexes: [2],
      doneIndexes: [0, 1, 2],
      labels: { 2: 'read 25' },
    }),
  ],
  'array-traversal': [4, 1, 7, 3].map((value, index) => frame({
    title: `Visit index ${index}`,
    explanation: `Read ${value}, update the running answer, then move forward exactly once.`,
    state: `i = ${index}, current = ${value}`,
    invariant: `Indexes 0 through ${index} are fully processed.`,
    activeIndexes: [index],
    doneIndexes: Array.from({ length: index }, (_, itemIndex) => itemIndex),
    labels: { [index]: 'current' },
  })),
  'array-shift': [
    frame({
      title: 'Open space from the right',
      explanation: 'Copy 12 one slot right first so it is not overwritten.',
      state: 'move nums[3] → nums[4]',
      invariant: 'Everything right of the cursor is already safe.',
      activeIndexes: [3, 4],
      movingIndexes: [3, 4],
    }),
    frame({
      title: 'Continue toward the gap',
      explanation: 'Copy 9 to the newly available slot.',
      state: 'move nums[2] → nums[3]',
      invariant: 'Shift right-to-left during insertion.',
      activeIndexes: [2, 3],
      movingIndexes: [2, 3],
      doneIndexes: [4],
    }),
    frame({
      title: 'Write the new value',
      explanation: 'The target slot is now free, so write 7 at index 2.',
      state: 'nums[2] = 7',
      invariant: 'No original value was overwritten before being copied.',
      activeIndexes: [2],
      doneIndexes: [3, 4],
      labels: { 2: 'insert 7' },
    }),
  ],
  'linear-search': [8, 4, 9].map((value, index) => frame({
    title: value === 9 ? 'Match found' : `Check index ${index}`,
    explanation: value === 9
      ? 'The target equals the current value, so return index 2 immediately.'
      : `${value} is not 9. Only this candidate is eliminated.`,
    state: `nums[${index}] = ${value}, target = 9`,
    invariant: value === 9
      ? 'The first matching index has been found.'
      : `No index before ${index + 1} contains the target.`,
    activeIndexes: [index],
    doneIndexes: Array.from({ length: index }, (_, itemIndex) => itemIndex),
    cutIndexes: Array.from({ length: index }, (_, itemIndex) => itemIndex),
    labels: { [index]: value === 9 ? 'match' : 'compare' },
  })),
  'binary-search': [
    frame({
      title: 'Probe the middle',
      explanation: '12 is smaller than 16, so the target cannot be at index 3 or anywhere left of it.',
      state: 'L = 0, M = 3, R = 6',
      invariant: 'If 16 exists, it remains inside [L, R].',
      activeIndexes: [3],
      boundIndexes: [0, 6],
      labels: { 0: 'L', 3: 'M', 6: 'R' },
    }),
    frame({
      title: 'Discard the left half',
      explanation: '23 is larger than 16, so move the right boundary left of index 5.',
      state: 'L = 4, M = 5, R = 6',
      invariant: 'Indexes 0–3 are proven impossible.',
      activeIndexes: [5],
      cutIndexes: [0, 1, 2, 3],
      boundIndexes: [4, 6],
      labels: { 4: 'L', 5: 'M', 6: 'R' },
    }),
    frame({
      title: 'Find the target',
      explanation: 'The remaining candidate is 16. Return its index, 4.',
      state: 'L = M = R = 4',
      invariant: 'Every discarded value was ruled out by sorted order.',
      activeIndexes: [4],
      cutIndexes: [0, 1, 2, 3, 5, 6],
      doneIndexes: [4],
      labels: { 4: 'found' },
    }),
  ],
  'ternary-search': [
    frame({
      title: 'Place two probes',
      explanation: 'Compare the values at m1 and m2 to learn which outer third cannot contain the peak.',
      state: 'm1 = 2 (9), m2 = 4 (8)',
      invariant: 'The data is unimodal: it rises, then falls.',
      activeIndexes: [2, 4],
      labels: { 2: 'm1', 4: 'm2' },
    }),
    frame({
      title: 'Keep the rising side',
      explanation: 'Because 9 is greater than 8, the peak cannot be strictly to the right of m2.',
      state: 'right = m2 - 1',
      invariant: 'The peak remains in the reduced interval.',
      activeIndexes: [2, 3],
      cutIndexes: [4, 5, 6],
      labels: { 2: 'probe', 3: 'candidate' },
    }),
    frame({
      title: 'Resolve the small range',
      explanation: 'A final scan of the remaining candidates identifies 12 as the peak.',
      state: 'peak index = 3',
      invariant: 'Small integer ranges are checked explicitly.',
      activeIndexes: [3],
      cutIndexes: [0, 1, 4, 5, 6],
      doneIndexes: [3],
      labels: { 3: 'peak' },
    }),
  ],
  'two-pointers': [
    frame({
      title: 'Evaluate both ends',
      explanation: '1 + 9 is too small, so keeping 1 can never work with any smaller partner.',
      state: 'left = 0, right = 4, sum = 10',
      invariant: 'The sorted order makes one movement safe.',
      activeIndexes: [0, 4],
      labels: { 0: 'left', 4: 'right' },
    }),
    frame({
      title: 'Move only the left pointer',
      explanation: '2 + 9 is still too small. Eliminate 2 and keep the largest value.',
      state: 'left = 1, right = 4, sum = 11',
      invariant: 'Every skipped left value is too small with every available right value.',
      activeIndexes: [1, 4],
      cutIndexes: [0],
      labels: { 1: 'left', 4: 'right' },
    }),
    frame({
      title: 'Pair found',
      explanation: '4 + 9 equals 13, so the two indexes form the answer.',
      state: 'left = 2, right = 4, sum = 13',
      invariant: 'Each pointer moved only after a proof.',
      activeIndexes: [2, 4],
      cutIndexes: [0, 1],
      doneIndexes: [2, 4],
      labels: { 2: 'left', 4: 'right' },
    }),
  ],
  'prefix-sum': [
    frame({
      title: 'Seed a leading zero',
      explanation: 'prefix[0] = 0 makes ranges beginning at index 0 use the same formula as every other range.',
      state: 'prefix = [0]',
      invariant: 'prefix[i] stores the sum before nums[i].',
      activeIndexes: [0],
    }),
    frame({
      title: 'Accumulate once',
      explanation: 'Scan the input and carry the running total forward: 0, 2, 6, 7, 14.',
      state: 'prefix[i + 1] = prefix[i] + nums[i]',
      invariant: 'Each input value contributes to all later prefixes.',
      activeIndexes: [1, 2, 3, 4],
      doneIndexes: [0],
    }),
    frame({
      title: 'Answer by subtraction',
      explanation: 'For indexes 1 through 3, subtract the sum before index 1 from the sum through index 3.',
      state: 'prefix[4] − prefix[1] = 14 − 2 = 12',
      invariant: 'The unwanted left prefix cancels exactly.',
      activeIndexes: [1, 4],
      doneIndexes: [2, 3],
    }),
  ],
  'sliding-window': [
    [[0, 1, 2], 8],
    [[1, 2, 3], 7],
    [[2, 3, 4], 9],
    [[3, 4, 5], 6],
  ].map(([indexes, sum], stepIndex) => frame({
    title: stepIndex === 0 ? 'Build the first window' : stepIndex === 2 ? 'Record a new best' : 'Slide one position',
    explanation: stepIndex === 0
      ? 'Add the first three values once.'
      : 'Remove the value leaving on the left and add the value entering on the right.',
    state: `window = [${indexes[0]}, ${indexes[2]}], sum = ${sum}`,
    invariant: 'The running sum always equals exactly the highlighted window.',
    activeIndexes: indexes,
    cutIndexes: Array.from({ length: indexes[0] }, (_, index) => index),
    labels: { [indexes[0]]: 'L', [indexes[2]]: 'R' },
  })),
  kadane: [
    [-2, -2, -2, 'Start with the first value.'],
    [3, 3, 3, 'Restart at 3 because carrying −2 would make the sum worse.'],
    [-1, 2, 3, 'Extend the positive running sum with −1.'],
    [5, 7, 7, 'Extending produces 7, the new global best.'],
    [-6, 1, 7, 'The ending sum falls, but the best-ever answer stays 7.'],
  ].map(([value, current, best, explanation], index) => frame({
    title: index === 0 ? 'Initialize both states' : index === 3 ? 'Update the global best' : `Process index ${index}`,
    explanation,
    state: `value = ${value}, current = ${current}, best = ${best}`,
    invariant: 'current ends here; best may end anywhere seen so far.',
    activeIndexes: [index],
    doneIndexes: Array.from({ length: index }, (_, itemIndex) => itemIndex),
    labels: { [index]: index === 3 ? 'best = 7' : 'current' },
  })),
  'matrix-boundaries': [
    ['Read the top edge', 'Move left to right, then increase top.', [0, 1, 2, 3]],
    ['Read the right edge', 'Move top to bottom, then decrease right.', [7, 11, 15]],
    ['Read the bottom edge', 'Move right to left, then decrease bottom.', [14, 13, 12]],
    ['Read the left edge', 'Move bottom to top, then increase left.', [8, 4]],
  ].map(([title, explanation, indexes], index) => frame({
    title,
    explanation,
    state: `boundary ${index + 1} of 4`,
    invariant: 'Only cells inside top, right, bottom, and left remain unvisited.',
    activeIndexes: indexes,
    doneIndexes: [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4].slice(0, index * 3),
  })),
  'sorted-matrix-search': [
    [3, 11, '11 is too large, so move left.'],
    [2, 7, '7 is too small, so move down.'],
    [6, 8, '8 is too small, so move down again.'],
    [10, 9, '9 matches the target.'],
  ].map(([index, value, explanation], stepIndex) => frame({
    title: value === 9 ? 'Target found' : `Inspect ${value}`,
    explanation,
    state: `current = ${value}, target = 9`,
    invariant: 'Each comparison removes one complete row or column.',
    activeIndexes: [index],
    doneIndexes: [3, 2, 6].slice(0, stepIndex),
    labels: { [index]: value === 9 ? 'found' : 'current' },
  })),
};

export function buildLessonSimulation(lesson) {
  const specificFrames = simulations[lesson.visual];
  if (specificFrames) return specificFrames;

  const reasoningSteps = Array.isArray(lesson.reasoningSteps) && lesson.reasoningSteps.length
    ? lesson.reasoningSteps
    : ['Name the input.', 'Track the state.', 'Apply the rule.', 'Verify the result.'];

  return reasoningSteps.map((reasoningStep, index) => frame({
    title: reasoningStep.replace(/[.]$/, ''),
    explanation: index === 0
      ? lesson.coreIdea
      : `Advance one deliberate step: ${reasoningStep}`,
    state: `reasoning step ${index + 1} of ${reasoningSteps.length}`,
    invariant: lesson.mentalModel,
    activeIndexes: [index],
    doneIndexes: Array.from({ length: index }, (_, itemIndex) => itemIndex),
  }));
}

export function clampSimulationStep(step, frameCount) {
  if (!Number.isFinite(step) || frameCount <= 0) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), frameCount - 1);
}
