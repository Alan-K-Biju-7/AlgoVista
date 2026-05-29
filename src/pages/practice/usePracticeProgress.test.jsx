import { act, render, screen, waitFor } from '@testing-library/react';
import {
  BOOKMARKS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  usePracticeProgress,
} from './usePracticeProgress';

function ProgressHarness() {
  const progress = usePracticeProgress();

  return (
    <div>
      <span data-testid="status">{progress.getStatus('two-sum')}</span>
      <span data-testid="bookmark">{String(progress.isBookmarked('two-sum'))}</span>
      <button type="button" onClick={() => progress.markAttempted('two-sum')}>attempt</button>
      <button type="button" onClick={() => progress.markSolved('two-sum')}>solve</button>
      <button type="button" onClick={() => progress.toggleBookmark('two-sum')}>bookmark</button>
      <button type="button" onClick={() => progress.importSnapshot({
        progress: { 'three-sum': 'attempted', bad: 'wrong' },
        bookmarks: { 'three-sum': true, nope: false },
      })}>import</button>
      <button type="button" onClick={() => progress.resetPracticeData()}>reset</button>
      <output data-testid="snapshot">{JSON.stringify(progress.exportSnapshot())}</output>
    </div>
  );
}

describe('usePracticeProgress', () => {
  beforeEach(() => {
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
});
