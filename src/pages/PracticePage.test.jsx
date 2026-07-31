import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PracticePage, { PRACTICE_RESET_UNDO_MS } from './PracticePage';
import {
  BOOKMARKS_STORAGE_KEY,
  PRACTICE_RECORDS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
} from './practice/usePracticeProgress';
import twoSum from './practice/neetcode150/problems/arrays-hashing/two-sum';

vi.mock('./practice/testRunner', () => ({
  runTestsAsync: vi.fn(async (code, testCases) => {
    const accepted = String(code).includes('new Map');
    return testCases.map((testCase) => {
      const actual = accepted ? testCase.expected : [1, 1];
      return {
        passed: accepted,
        kind: accepted ? 'accepted' : 'wrong-answer',
        input: JSON.stringify(testCase.input),
        expected: JSON.stringify(testCase.expected),
        got: JSON.stringify(actual),
        actualValue: actual,
        expectedValue: testCase.expected,
        durationMs: 0,
        error: null,
      };
    });
  }),
}));

vi.mock('./practice/CodeEditor', () => ({
  default: function MockCodeEditor({ value, onChange, language = 'javascript' }) {
    return (
      <textarea
        aria-label={`${language} code editor`}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
    );
  },
}));

function renderPracticePage() {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:problemId" element={<PracticePage />} />
      </Routes>
    </BrowserRouter>
  );
}

describe('PracticePage learning workflow', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/practice');
    window.localStorage.clear();
    window.scrollTo = vi.fn();
    window.requestAnimationFrame = (callback) => {
      callback();
      return 0;
    };
    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('filters, bookmarks, opens a mission, and marks solved after tests pass', async () => {
    renderPracticePage();

    expect(screen.getByText(/Story Mode Learning Path/i)).toBeInTheDocument();

    userEvent.type(screen.getByLabelText(/Search missions/i), 'two sum');
    expect(screen.getByRole('heading', { level: 3, name: 'Two Sum' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /Bookmark Two Sum/i }));
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY))).toEqual({
        'two-sum': true,
      });
    });

    userEvent.selectOptions(screen.getByLabelText(/Status filter/i), 'bookmarked');
    expect(screen.getByText('1/9 problems')).toBeInTheDocument();

    userEvent.click(screen.getByRole('heading', { level: 3, name: 'Two Sum' }).closest('article'));
    expect(await screen.findByRole('heading', { level: 2, name: 'Two Sum' })).toBeInTheDocument();
    expect(screen.getByText('Story Mode')).toBeInTheDocument();

    userEvent.click(screen.getByRole('tab', { name: 'Editor' }));
    const editor = await screen.findByLabelText(/javascript code editor/i);
    expect(editor.value).toContain('function solve(nums, target)');
    expect(editor.value).not.toContain('new Map');

    fireEvent.change(editor, { target: { value: twoSum.solution } });
    userEvent.click(screen.getByRole('button', { name: 'Run Tests' }));
    expect(await screen.findByText('Visible tests passed')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Accepted locally')).toBeInTheDocument();
    expect(await screen.findByText('3/3 passed')).toBeInTheDocument();
    expect(screen.getByText(/Mission cleared/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({
        'two-sum': 'solved',
      });
    });
  });

  test('shows trace validation errors inline instead of interrupting with alerts', async () => {
    renderPracticePage();

    userEvent.click(screen.getByRole('heading', { level: 3, name: 'Two Sum' }).closest('article'));
    expect(await screen.findByRole('heading', { level: 2, name: 'Two Sum' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('tab', { name: 'Editor' }));
    userEvent.clear(await screen.findByLabelText(/javascript code editor/i));
    userEvent.click(screen.getByRole('button', { name: 'Trace Execution' }));

    expect(await screen.findByText(/Code is empty/i)).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
  });

  test('practice command center exports, imports, and resets local learner state', async () => {
    renderPracticePage();

    expect(screen.getByText(/Mastery Signal/i)).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Export' }));

    const snapshotBox = screen.getByLabelText(/Practice progress snapshot/i);
    expect(snapshotBox.value).toContain('"version": 1');
    expect(screen.getByText('Snapshot ready.')).toBeInTheDocument();

    fireEvent.change(snapshotBox, {
      target: {
        value: JSON.stringify({
          progress: { 'valid-anagram': 'solved' },
          bookmarks: { 'two-sum': true },
        }),
      },
    });
    userEvent.click(screen.getByRole('button', { name: 'Import' }));

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({ 'valid-anagram': 'solved' });
      expect(JSON.parse(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY))).toEqual({ 'two-sum': true });
    });
    expect(screen.getByText('Snapshot imported.')).toBeInTheDocument();

    vi.useFakeTimers();
    fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));
    expect(window.confirm).toHaveBeenCalledWith(expect.stringMatching(/locally on this device[\s\S]*synced to your AlgoVista account/i));
    expect(screen.getByText(/Reset scheduled/i)).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({ 'valid-anagram': 'solved' });

    act(() => {
      vi.advanceTimersByTime(PRACTICE_RESET_UNDO_MS);
    });
    vi.useRealTimers();
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({});
      expect(JSON.parse(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY))).toEqual({});
    });
    expect(screen.getByText(/reset locally and, when signed in, queued for account sync/i)).toBeInTheDocument();
  });

  test('cancels a reset safely before confirmation or during the undo window', () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ 'two-sum': 'solved' }));
    renderPracticePage();

    window.confirm.mockReturnValueOnce(false);
    fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));
    expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({ 'two-sum': 'solved' });
    expect(screen.queryByRole('button', { name: 'Undo reset' })).not.toBeInTheDocument();

    vi.useFakeTimers();
    window.confirm.mockReturnValueOnce(true);
    fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));
    fireEvent.click(screen.getByRole('button', { name: 'Undo reset' }));
    act(() => {
      vi.advanceTimersByTime(PRACTICE_RESET_UNDO_MS);
    });

    expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({ 'two-sum': 'solved' });
    expect(screen.getByText(/No local or synced progress was changed/i)).toBeInTheDocument();
  });

  test('opens shareable problem URLs and records solution help from the editor', async () => {
    window.history.pushState({}, '', '/practice/two-sum');
    renderPracticePage();

    expect(await screen.findByRole('heading', { level: 2, name: 'Two Sum' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('tab', { name: 'Editor' }));
    const solutionButtons = screen.getAllByRole('button', { name: 'Solution' });
    userEvent.click(solutionButtons[solutionButtons.length - 1]);

    expect(await screen.findByText('Key Insight')).toBeInTheDocument();
    await waitFor(() => {
      const records = JSON.parse(window.localStorage.getItem(PRACTICE_RECORDS_STORAGE_KEY));
      expect(records['two-sum']).toEqual(expect.objectContaining({ solutionViewed: true }));
    });
  });

  test('preserves the failed problem while gating personal tutoring behind sign-in', async () => {
    window.history.pushState({}, '', '/practice/two-sum');
    renderPracticePage();

    userEvent.click(await screen.findByRole('tab', { name: 'Editor' }));
    fireEvent.change(await screen.findByLabelText(/javascript code editor/i), {
      target: { value: 'function solve() { return [1, 1]; }' },
    });
    userEvent.click(screen.getByRole('button', { name: 'Run Tests' }));

    expect(await screen.findByText('Wrong Answer')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /Sign in to explain this failure/i }));

    expect(await screen.findByRole('dialog', { name: /Sign in to continue with this problem/i })).toBeInTheDocument();
    expect(screen.getByText(/account-protected · the personal tutor/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Two Sum' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: /Contextual tutor/i })).not.toBeInTheDocument();
  });
});
