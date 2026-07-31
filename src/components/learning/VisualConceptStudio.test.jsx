import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import VisualConceptStudio, { normalizeVisualConcept } from './VisualConceptStudio';

const mockApi = globalThis.jest || globalThis.vi;

const binarySearchConcept = {
  id: 'binary-search',
  title: 'Binary Search',
  section: 'Searching',
  level: 'Beginner',
  color: '#60a5fa',
  headline: 'Prove half of a sorted search space impossible after every comparison.',
  objective: 'Explain why each boundary update preserves the answer if it exists.',
  tags: ['sorted input', 'divide and conquer'],
  explanation: {
    coreIdea: 'Compare the target with a midpoint and discard the impossible half.',
    intuition: 'Think of the remaining interval as the only territory where the answer can live.',
    invariant: 'If the target exists, it remains inside the inclusive left-to-right interval.',
    whenToUse: 'Use it when the search space is sorted or the answer condition is monotonic.',
    sections: [{ title: 'Boundary contract', body: 'Choose inclusive or half-open boundaries and stay consistent.' }],
  },
  mentalModel: {
    title: 'Shrinking candidate interval',
    kind: 'array',
    description: 'Only values between L and R remain possible.',
    items: [2, 5, 8, 12, 16, 23, 31],
    legend: ['Accent = midpoint', 'Faded = proven impossible'],
  },
  simulation: {
    title: 'Find 16 in a sorted array',
    description: 'Predict which half survives before moving forward.',
    steps: [
      {
        title: 'Inspect the first midpoint',
        explanation: 'The midpoint is 12 and the target is larger.',
        state: 'L = 0, M = 3, R = 6',
        invariant: 'The target remains in [L, R].',
        activeIds: [3],
        labels: { 3: 'mid = 12' },
        decision: 'Which boundary must move?',
      },
      {
        title: 'Discard the smaller half',
        explanation: 'Everything at or left of 12 is now impossible.',
        state: 'L = 4, M = 5, R = 6',
        invariant: 'The target remains in [4, 6].',
        activeIds: [5],
        discardedIds: [0, 1, 2, 3],
        codeLine: 'left = mid + 1;',
      },
      {
        title: 'Match the target',
        explanation: 'The new midpoint is 16, so return its index.',
        state: 'L = 4, M = 4, R = 4',
        invariant: 'Index 4 satisfies the target condition.',
        activeIds: [4],
        completedIds: [0, 1, 2, 3, 4],
      },
    ],
  },
  complexity: {
    summary: 'Each comparison halves the remaining candidate count.',
    metrics: [
      { label: 'Search time', value: 'O(log n)', note: 'At most one interval survives.' },
      { label: 'Extra space', value: 'O(1)', note: 'For the iterative form.' },
    ],
    tradeoffs: [{
      choice: 'Sort, then search',
      gain: 'Many later lookups become logarithmic.',
      cost: 'Sorting costs O(n log n) and may change order.',
      useWhen: 'The same mostly-static data receives many queries.',
    }],
  },
  misconceptions: [{
    myth: 'Binary search works on every array.',
    truth: 'It needs sorted data or another monotonic decision rule.',
    example: '[8, 1, 7] gives no safe half to discard.',
  }],
  interviewPrompts: [{
    question: 'How would you find the first occurrence among duplicates?',
    followUp: 'What changes after finding a match?',
    hint: 'A match can be recorded without ending the search.',
    strongAnswer: ['Store the match.', 'Continue searching left.', 'Keep one boundary convention.'],
  }],
  retrievalCheck: {
    questions: [{
      id: 'boundary-update',
      prompt: 'Target is larger than nums[mid]. What update preserves the invariant?',
      options: ['right = mid - 1', 'left = mid + 1', 'left = mid'],
      correctAnswer: 1,
      explanation: 'The midpoint and every smaller value are proven too small.',
      criteria: ['Name the discarded interval.', 'Explain why the target cannot be there.'],
    }],
  },
};

describe('VisualConceptStudio', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test('normalizes legacy lesson fields and renders the complete learning loop', () => {
    const legacy = normalizeVisualConcept({
      id: 'stack',
      title: 'Stack',
      mentalModel: 'The newest unfinished task is handled first.',
      coreIdea: 'A stack is last-in, first-out.',
      reasoningSteps: ['Push work.', 'Pop completed work.'],
      dryRun: ['Push A.', 'Push B.', 'Pop B.'],
      complexity: { time: 'O(1)', space: 'O(n)' },
      traps: ['Popping an empty stack.'],
      practice: 'Trace a bracket string.',
      template: 'stack.push(value);',
    });

    expect(legacy.title).toBe('Stack');
    expect(legacy.simulation.steps).toHaveLength(3);
    expect(legacy.complexity.metrics.map((metric) => metric.value)).toEqual(['O(1)', 'O(n)']);
    expect(legacy.misconceptions[0].myth).toBe('Popping an empty stack.');
    expect(legacy.explanation.sections.map((section) => section.id)).toEqual(expect.arrayContaining([
      'reasoning-recipe',
      'practice-transfer',
      'implementation-template',
    ]));

    render(<VisualConceptStudio concept={binarySearchConcept} />);

    expect(screen.getByRole('heading', { name: 'Binary Search' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /Concept learning loop/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Build the model before memorizing code/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Shrinking candidate interval.' })).toBeInTheDocument();
    expect(screen.getByText('Boundary contract')).toBeInTheDocument();
    expect(screen.getByText('O(log n)')).toBeInTheDocument();
    expect(screen.getByText('Sort, then search')).toBeInTheDocument();
    expect(screen.getByText('Binary search works on every array.')).toBeInTheDocument();
    expect(screen.getByText('How would you find the first occurrence among duplicates?')).toBeInTheDocument();
    expect(screen.getByText(/Target is larger than nums\[mid\]/i)).toBeInTheDocument();
  });

  test('steps with buttons and keyboard while reporting the active frame', async () => {
    const onStepChange = mockApi.fn();
    render(<VisualConceptStudio concept={binarySearchConcept} onStepChange={onStepChange} />);

    expect(screen.getByRole('heading', { name: 'Inspect the first midpoint' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next simulation step/i }));
    expect(screen.getByRole('heading', { name: 'Discard the smaller half' })).toBeInTheDocument();
    expect(screen.getByText('left = mid + 1;')).toBeInTheDocument();

    const canvas = screen.getByLabelText(/Simulation canvas/i);
    fireEvent.keyDown(canvas, { key: 'End' });
    expect(screen.getByRole('heading', { name: 'Match the target' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByLabelText(/Simulation canvas/i), { key: 'Home' });
    expect(screen.getByRole('heading', { name: 'Inspect the first midpoint' })).toBeInTheDocument();

    await waitFor(() => expect(onStepChange).toHaveBeenLastCalledWith(expect.objectContaining({
      conceptId: 'binary-search',
      stepIndex: 0,
      totalSteps: 3,
    })));
  });

  test('checks retrieval answers and emits an advisory result', () => {
    const onRetrievalAnswer = mockApi.fn();
    render(<VisualConceptStudio concept={binarySearchConcept} onRetrievalAnswer={onRetrievalAnswer} />);

    const retrieval = screen.getByRole('region', { name: /Close the notes/i });
    fireEvent.click(within(retrieval).getByRole('radio', { name: 'left = mid + 1' }));
    fireEvent.click(within(retrieval).getByRole('button', { name: 'Check answer' }));

    expect(within(retrieval).getByRole('status')).toHaveTextContent('Correct');
    expect(within(retrieval).getByText(/midpoint and every smaller value/i)).toBeInTheDocument();
    expect(onRetrievalAnswer).toHaveBeenCalledWith({
      conceptId: 'binary-search',
      questionId: 'boundary-update',
      answer: '1',
      correct: true,
    });
  });

  test('disables autoplay for reduced motion while preserving manual controls', () => {
    window.matchMedia = mockApi.fn().mockReturnValue({
      matches: true,
      addEventListener: mockApi.fn(),
      removeEventListener: mockApi.fn(),
    });

    render(<VisualConceptStudio concept={binarySearchConcept} autoPlay />);

    expect(screen.getByRole('button', { name: /Play trace/i })).toBeDisabled();
    expect(screen.getByText(/Autoplay is off for reduced motion/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next simulation step/i }));
    expect(screen.getByRole('heading', { name: 'Discard the smaller half' })).toBeInTheDocument();
  });

  test('supports a custom visual renderer without changing the learning shell', () => {
    const renderVisual = mockApi.fn(({ step, isSimulation }) => (
      <div data-testid={isSimulation ? 'custom-simulation' : 'custom-model'}>
        {step?.title || 'Static model'}
      </div>
    ));

    render(<VisualConceptStudio concept={binarySearchConcept} renderVisual={renderVisual} />);

    expect(screen.getByTestId('custom-model')).toHaveTextContent('Static model');
    expect(screen.getByTestId('custom-simulation')).toHaveTextContent('Inspect the first midpoint');
    expect(renderVisual).toHaveBeenCalledWith(expect.objectContaining({
      isSimulation: true,
      stepIndex: 0,
    }));
  });
});
