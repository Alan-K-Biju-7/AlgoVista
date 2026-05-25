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
});
