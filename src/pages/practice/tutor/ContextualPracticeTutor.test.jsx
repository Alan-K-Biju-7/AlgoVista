import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContextualPracticeTutor from './ContextualPracticeTutor';

const problem = {
  id: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  pattern: 'Arrays & Hashing',
  description: 'Return the two indices whose values add to the target.',
  examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
  solution: 'function solve() { return [0, 1]; }',
};

function tutorEnvelope(overrides = {}) {
  return {
    requestId: 'tutor-request-123456789',
    source: 'local-fallback',
    degraded: true,
    tutor: {
      version: 1,
      mode: 'debug',
      message: 'Check the complement before adding the current value.',
      nextQuestion: 'Why must lookup happen before insertion?',
      nextAction: 'inspect-state',
      hintLevel: 1,
      solutionRevealed: false,
      citations: ['problem:invariant'],
      masterySignal: { evidence: 'attempted', confidenceDelta: 1 },
      warnings: ['offline-tutor', 'grounding-missing'],
      ...overrides,
    },
  };
}

describe('ContextualPracticeTutor', () => {
  beforeEach(() => {
    window.requestAnimationFrame = (callback) => {
      callback();
      return 0;
    };
    if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = vi.fn();
  });

  test('keeps code and history private by default and renders the tutor server envelope', async () => {
    const onAsk = vi.fn().mockResolvedValue(tutorEnvelope());

    render(
      <ContextualPracticeTutor
        variant="panel"
        problem={problem}
        code="function solve(nums, target) { return []; }"
        language="javascript"
        learnerContext={{ evidenceLevel: 'Guided', attempts: 2, hintsUsed: 1 }}
        testResults={[{ passed: false, input: '[3, 3]', expected: '[0, 1]', actual: '[]' }]}
        onAsk={onAsk}
      />
    );

    expect(screen.getByRole('complementary', { name: /Contextual tutor/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Think/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Code private')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Share prior questions/i })).not.toBeChecked();

    userEvent.type(screen.getByLabelText(/Ask the contextual tutor/i), 'Why did the duplicate case fail?');
    userEvent.click(screen.getByRole('button', { name: /Send question/i }));

    await waitFor(() => expect(onAsk).toHaveBeenCalledTimes(1));
    const request = onAsk.mock.calls[0][0];
    expect(request).toEqual(expect.objectContaining({
      question: 'Why did the duplicate case fail?',
      mode: 'socratic',
      privacy: {
        shareCode: false,
        shareHistory: false,
        retainConversation: false,
      },
    }));
    expect(request).not.toHaveProperty('history');
    expect(request.context.execution).toEqual(expect.objectContaining({ language: 'javascript' }));
    expect(request.context.execution).not.toHaveProperty('code');
    expect(request.context.problem).not.toHaveProperty('solution');

    expect(await screen.findByText(/Check the complement before adding/i)).toBeInTheDocument();
    expect(screen.getByText(/Why must lookup happen before insertion/i)).toBeInTheDocument();
    expect(screen.getByText('Inspect State')).toBeInTheDocument();
    expect(screen.getByText('Hint level 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('problem:invariant')).toBeInTheDocument();
    expect(screen.getByText('Offline tutor fallback')).toBeInTheDocument();
    expect(screen.getByText('Attempted evidence')).toBeInTheDocument();
    expect(screen.getByText(/Some lesson context was unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/Source · Local Fallback/i)).toBeInTheDocument();
  });

  test('includes code only after explicit consent and supports keyboard mode navigation', async () => {
    const onAsk = vi.fn().mockResolvedValue('Start by naming what stays true after each iteration.');

    render(
      <ContextualPracticeTutor
        variant="panel"
        problem={problem}
        code="function solve(nums, target) { return []; }"
        onAsk={onAsk}
      />
    );

    const socraticTab = screen.getByRole('tab', { name: /Think/i });
    fireEvent.keyDown(socraticTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /Debug/i })).toHaveAttribute('aria-selected', 'true');

    const consent = screen.getByRole('checkbox', { name: /Include current editor code/i });
    expect(consent).not.toBeChecked();
    userEvent.click(consent);
    expect(consent).toBeChecked();
    expect(screen.getByText('Code included')).toBeInTheDocument();

    userEvent.type(screen.getByLabelText(/Ask the contextual tutor/i), 'Find the first divergence.');
    userEvent.click(screen.getByRole('button', { name: /Send question/i }));

    await waitFor(() => expect(onAsk).toHaveBeenCalledTimes(1));
    expect(onAsk.mock.calls[0][0]).toEqual(expect.objectContaining({
      mode: 'debug',
      privacy: expect.objectContaining({ shareCode: true, shareHistory: false }),
      context: expect.objectContaining({
        execution: expect.objectContaining({
          code: 'function solve(nums, target) { return []; }',
        }),
      }),
    }));
    expect(await screen.findByText(/Start by naming what stays true/i)).toBeInTheDocument();
  });

  test('shares bounded prior user text only after explicit history opt-in', async () => {
    const onAsk = vi.fn()
      .mockResolvedValueOnce(tutorEnvelope({ message: 'First coach reply.' }))
      .mockResolvedValueOnce(tutorEnvelope({ message: 'Second coach reply.' }));
    const longQuestion = `First question ${'x'.repeat(700)}`;

    render(<ContextualPracticeTutor variant="panel" problem={problem} onAsk={onAsk} />);

    fireEvent.change(screen.getByLabelText(/Ask the contextual tutor/i), { target: { value: longQuestion } });
    userEvent.click(screen.getByRole('button', { name: /Send question/i }));
    expect(await screen.findByText('First coach reply.')).toBeInTheDocument();
    expect(onAsk.mock.calls[0][0]).not.toHaveProperty('history');

    userEvent.click(screen.getByRole('checkbox', { name: /Share prior questions/i }));
    userEvent.type(screen.getByLabelText(/Ask the contextual tutor/i), 'What should I inspect next?');
    userEvent.click(screen.getByRole('button', { name: /Send question/i }));

    await waitFor(() => expect(onAsk).toHaveBeenCalledTimes(2));
    const history = onAsk.mock.calls[1][0].history;
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual({ role: 'user', content: longQuestion.slice(0, 600) });
    expect(JSON.stringify(history)).not.toMatch(/First coach reply|assistant|diagnosis|masterySignal/);
  });

  test('prefills a keyed debug starter without sending or sharing code', () => {
    const onAsk = vi.fn();
    const { rerender } = render(
      <ContextualPracticeTutor
        variant="panel"
        mode="debug"
        problem={problem}
        code="private editor code"
        starterQuestion="Explain the first mismatch in test 2."
        onAsk={onAsk}
      />
    );

    expect(screen.getByRole('tab', { name: /Debug/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(/Ask the contextual tutor/i)).toHaveValue('Explain the first mismatch in test 2.');
    expect(screen.getByRole('checkbox', { name: /Include current editor code/i })).not.toBeChecked();
    expect(onAsk).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Ask the contextual tutor/i), { target: { value: 'My edited draft' } });
    rerender(
      <ContextualPracticeTutor
        variant="panel"
        mode="debug"
        problem={{ ...problem, id: 'three-sum' }}
        code="private editor code"
        starterQuestion="Trace the failing three-sum case."
        onAsk={onAsk}
      />
    );
    expect(screen.getByLabelText(/Ask the contextual tutor/i)).toHaveValue('Trace the failing three-sum case.');
    expect(onAsk).not.toHaveBeenCalled();
  });

  test('announces offline and request error states, then retries without duplicating the question', async () => {
    const offlineAsk = vi.fn();
    const { rerender } = render(
      <ContextualPracticeTutor
        variant="panel"
        problem={problem}
        online={false}
        onAsk={offlineAsk}
      />
    );

    expect(screen.getByText('You are offline')).toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/Ask the contextual tutor/i), 'Can you help?');
    expect(screen.getByRole('button', { name: /Send question/i })).toBeDisabled();
    expect(offlineAsk).not.toHaveBeenCalled();

    const onAsk = vi.fn()
      .mockRejectedValueOnce(new Error('Tutor gateway unavailable'))
      .mockResolvedValueOnce(tutorEnvelope({ message: 'Connection restored.' }));
    rerender(
      <ContextualPracticeTutor
        variant="panel"
        problem={problem}
        online
        onAsk={onAsk}
      />
    );

    userEvent.click(screen.getByRole('button', { name: /Send question/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Tutor gateway unavailable');
    userEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Connection restored.')).toBeInTheDocument();
    expect(onAsk).toHaveBeenCalledTimes(2);
    expect(screen.getAllByText('Can you help?')).toHaveLength(1);
    expect(onAsk.mock.calls[1][0]).not.toHaveProperty('history');
  });

  test('uses dialog semantics and closes on Escape', () => {
    const onClose = vi.fn();
    render(<ContextualPracticeTutor problem={problem} onAsk={vi.fn()} onClose={onClose} />);

    const dialog = screen.getByRole('dialog', { name: /Contextual tutor/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
