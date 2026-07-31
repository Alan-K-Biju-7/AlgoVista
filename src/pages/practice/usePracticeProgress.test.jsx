import { act, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  BOOKMARKS_STORAGE_KEY,
  PRACTICE_RECORDS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  createPracticeSyncPayload,
  mergePracticeSnapshots,
  normalizeAccountPracticeProgress,
  usePracticeProgress,
} from './usePracticeProgress';

const mockAuth = vi.hoisted(() => ({ current: null }));

vi.mock('../../context/AuthContext', () => ({
  useOptionalAuth: () => mockAuth.current,
}));

function ProgressHarness() {
  const progress = usePracticeProgress();

  return (
    <div>
      <span data-testid="status">{progress.getStatus('two-sum')}</span>
      <span data-testid="bookmark">{String(progress.isBookmarked('two-sum'))}</span>
      <button type="button" onClick={() => progress.markAttempted('two-sum')}>attempt</button>
      <button type="button" onClick={() => progress.markSolved('two-sum')}>solve</button>
      <button type="button" onClick={() => progress.recordHintViewed('two-sum', 2)}>hint</button>
      <button type="button" onClick={() => progress.recordSolutionViewed('two-sum')}>view solution</button>
      <button type="button" onClick={() => progress.markSolved('two-sum', { mode: 'review' })}>review solve</button>
      <button type="button" onClick={() => progress.toggleBookmark('two-sum')}>bookmark</button>
      <button type="button" onClick={() => progress.importSnapshot({
        progress: { 'three-sum': 'attempted', bad: 'wrong' },
        bookmarks: { 'three-sum': true, nope: false },
      })}>import</button>
      <button type="button" onClick={() => progress.resetPracticeData()}>reset</button>
      <output data-testid="snapshot">{JSON.stringify(progress.exportSnapshot())}</output>
      <output data-testid="record">{JSON.stringify(progress.getRecord('two-sum'))}</output>
    </div>
  );
}

describe('usePracticeProgress', () => {
  beforeEach(() => {
    mockAuth.current = null;
    window.localStorage.clear();
  });

  test('persists progress and bookmarks between mounts', async () => {
    const view = render(<ProgressHarness />);

    act(() => {
      screen.getByText('attempt').click();
      screen.getByText('bookmark').click();
    });

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({ 'two-sum': 'attempted' });
      expect(JSON.parse(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY))).toEqual({ 'two-sum': true });
    });

    view.unmount();
    render(<ProgressHarness />);

    expect(screen.getByTestId('status')).toHaveTextContent('attempted');
    expect(screen.getByTestId('bookmark')).toHaveTextContent('true');
  });

  test('imports sanitized snapshots and resets local practice data', async () => {
    render(<ProgressHarness />);

    act(() => {
      screen.getByText('import').click();
    });

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({ 'three-sum': 'attempted' });
      expect(JSON.parse(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY))).toEqual({ 'three-sum': true });
    });

    expect(JSON.parse(screen.getByTestId('snapshot').textContent)).toEqual(
      expect.objectContaining({
        version: 1,
        progress: { 'three-sum': 'attempted' },
        bookmarks: { 'three-sum': true },
      })
    );

    act(() => {
      screen.getByText('reset').click();
    });

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({});
      expect(JSON.parse(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY))).toEqual({});
    });
  });

  test('records assistance honestly and upgrades later recall evidence', async () => {
    render(<ProgressHarness />);

    act(() => {
      screen.getByText('hint').click();
      screen.getByText('view solution').click();
      screen.getByText('solve').click();
    });

    await waitFor(() => {
      const record = JSON.parse(window.localStorage.getItem(PRACTICE_RECORDS_STORAGE_KEY));
      expect(record['two-sum']).toEqual(expect.objectContaining({
        passes: 1,
        hintDepth: 2,
        solutionViewed: true,
        evidenceLevel: 'guided',
      }));
    });

    act(() => {
      screen.getByText('review solve').click();
    });

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('record').textContent)).toEqual(expect.objectContaining({
        passes: 2,
        reviewCount: 1,
        evidenceLevel: 'durable',
        nextReviewAt: expect.any(String),
      }));
    });
  });

  test('merges account progress without erasing richer offline learning evidence', async () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ 'two-sum': 'attempted' }));
    window.localStorage.setItem(PRACTICE_RECORDS_STORAGE_KEY, JSON.stringify({
      'two-sum': {
        attempts: 5,
        passes: 0,
        hintsUsed: 2,
        hintDepth: 2,
        solutionViewed: true,
        evidenceLevel: 'guided',
        explanation: 'I use a complement map while scanning once.',
        lastLanguage: 'javascript',
      },
    }));
    const refreshPracticeProgress = vi.fn().mockResolvedValue({
      'two-sum': {
        problemId: 'two-sum',
        status: 'solved',
        bookmarked: true,
        record: {
          attempts: 2,
          passes: 1,
          evidenceLevel: 'independent',
          lastLanguage: 'python',
        },
      },
    });
    const updatePracticeProgress = vi.fn().mockResolvedValue({});
    mockAuth.current = {
      loading: false,
      isAuthenticated: true,
      user: { id: 'learner-1' },
      refreshPracticeProgress,
      updatePracticeProgress,
    };

    render(<ProgressHarness />);

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('solved');
      expect(screen.getByTestId('bookmark')).toHaveTextContent('true');
      expect(JSON.parse(screen.getByTestId('record').textContent)).toEqual(expect.objectContaining({
        attempts: 5,
        passes: 1,
        hintsUsed: 2,
        solutionViewed: true,
        evidenceLevel: 'guided',
      }));
    });

    await waitFor(() => expect(updatePracticeProgress).toHaveBeenCalledTimes(1));
    expect(updatePracticeProgress).toHaveBeenCalledWith(expect.objectContaining({
      problemId: 'two-sum',
      status: 'solved',
      bookmarked: true,
      record: expect.objectContaining({ attempts: 5, passes: 1, hintDepth: 2 }),
    }));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 240));
    });
    expect(updatePracticeProgress).toHaveBeenCalledTimes(1);
  });

  test('does not echo an unchanged server snapshot back to the account API', async () => {
    const serverProgress = {
      'two-sum': {
        javascript: {
          status: 'attempted',
          attempts: 2,
          passes: 0,
          evidenceLevel: 'guided',
          updatedAt: '2026-07-19T10:00:00.000Z',
        },
        python: {
          status: 'solved',
          attempts: 3,
          passes: 1,
          hintsUsed: 0,
          hintDepth: 0,
          solutionViewed: false,
          evidenceLevel: 'independent',
          updatedAt: '2026-07-20T10:00:00.000Z',
        },
      },
    };
    const updatePracticeProgress = vi.fn().mockResolvedValue(serverProgress);
    mockAuth.current = {
      loading: false,
      isAuthenticated: true,
      user: { id: 'learner-2' },
      refreshPracticeProgress: vi.fn().mockResolvedValue(serverProgress),
      updatePracticeProgress,
    };

    render(<ProgressHarness />);
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('solved'));
    expect(JSON.parse(screen.getByTestId('record').textContent)).toEqual(expect.objectContaining({
      attempts: 3,
      passes: 1,
      lastLanguage: 'python',
    }));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 240));
    });

    expect(updatePracticeProgress).not.toHaveBeenCalled();
  });

  test('treats the newest language record as the cross-language bookmark state', () => {
    const normalized = normalizeAccountPracticeProgress({
      'two-sum': {
        javascript: {
          status: 'attempted',
          attempts: 1,
          bookmarked: true,
          updatedAt: '2026-07-18T10:00:00.000Z',
        },
        python: {
          status: 'attempted',
          attempts: 2,
          bookmarked: false,
          updatedAt: '2026-07-20T10:00:00.000Z',
        },
      },
    });

    expect(normalized.bookmarks).toEqual({});
    expect(normalized.records['two-sum'].lastLanguage).toBe('python');
  });

  test('coalesces rapid account changes into one bounded write for a problem', async () => {
    const updatePracticeProgress = vi.fn().mockResolvedValue({});
    const refreshPracticeProgress = vi.fn().mockResolvedValue({});
    mockAuth.current = {
      loading: false,
      isAuthenticated: true,
      user: { id: 'learner-rapid' },
      refreshPracticeProgress,
      updatePracticeProgress,
    };

    render(<ProgressHarness />);
    await waitFor(() => expect(refreshPracticeProgress).toHaveBeenCalledTimes(1));

    act(() => {
      screen.getByText('attempt').click();
      screen.getByText('attempt').click();
      screen.getByText('attempt').click();
    });

    await waitFor(() => expect(updatePracticeProgress).toHaveBeenCalledTimes(1));
    expect(updatePracticeProgress).toHaveBeenCalledWith(expect.objectContaining({
      problemId: 'two-sum',
      language: 'javascript',
      status: 'attempted',
      record: expect.objectContaining({ attempts: 3, evidenceLevel: 'seen' }),
    }));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 240));
    });
    expect(updatePracticeProgress).toHaveBeenCalledTimes(1);
  });

  test('keeps account-scoped progress out of the signed-out guest view', async () => {
    mockAuth.current = {
      loading: false,
      isAuthenticated: true,
      user: { id: 'private-learner' },
      refreshPracticeProgress: vi.fn().mockResolvedValue({
        'two-sum': {
          javascript: {
            status: 'solved',
            attempts: 1,
            passes: 1,
            evidenceLevel: 'independent',
            updatedAt: '2026-07-20T10:00:00.000Z',
          },
        },
      }),
      updatePracticeProgress: vi.fn().mockResolvedValue({}),
    };
    const view = render(<ProgressHarness />);
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('solved'));

    mockAuth.current = {
      loading: false,
      isAuthenticated: false,
      user: null,
    };
    view.rerender(<ProgressHarness />);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unsolved'));
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBe('{}');
    expect(window.localStorage.getItem(`${PROGRESS_STORAGE_KEY}.account.private-learner`)).toBeTruthy();
  });

  test('keeps offline changes local and retries hydration before syncing when connectivity returns', async () => {
    const refreshPracticeProgress = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({});
    const updatePracticeProgress = vi.fn().mockResolvedValue({});
    mockAuth.current = {
      loading: false,
      isAuthenticated: true,
      user: { id: 'learner-3' },
      refreshPracticeProgress,
      updatePracticeProgress,
    };

    render(<ProgressHarness />);
    await waitFor(() => expect(refreshPracticeProgress).toHaveBeenCalledTimes(1));

    act(() => {
      screen.getByText('attempt').click();
    });
    expect(screen.getByTestId('status')).toHaveTextContent('attempted');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 240));
    });
    expect(updatePracticeProgress).not.toHaveBeenCalled();

    act(() => window.dispatchEvent(new Event('online')));

    await waitFor(() => expect(refreshPracticeProgress).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(updatePracticeProgress).toHaveBeenCalledWith(expect.objectContaining({
      problemId: 'two-sum',
      status: 'attempted',
      record: expect.objectContaining({ attempts: 1 }),
    })));
  });

  test('bounds account payloads and merges status monotonically', () => {
    const merged = mergePracticeSnapshots(
      {
        progress: { 'two-sum': 'solved' },
        records: {
          'two-sum': {
            attempts: 2_000_000,
            passes: 3,
            hintDepth: 20,
            explanation: 'x'.repeat(3_000),
          },
        },
      },
      {
        progress: { 'two-sum': 'attempted' },
        records: { 'two-sum': { attempts: 4, passes: 1 } },
      }
    );
    const payload = createPracticeSyncPayload('two-sum', merged);

    expect(payload.status).toBe('solved');
    expect(payload.language).toBe('javascript');
    expect(payload.record.attempts).toBe(1_000_000);
    expect(payload.record.hintDepth).toBe(3);
    expect(payload.record.evidenceLevel).toBe('guided');
    expect(payload.record.explanation).toHaveLength(2_000);
    expect(payload.record.reviewCount).toBe(0);
    expect(payload.record.lastDurationSeconds).toBe(0);
  });
});
