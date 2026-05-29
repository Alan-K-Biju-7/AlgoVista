import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PracticePage from './PracticePage';
import {
  BOOKMARKS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
} from './practice/usePracticeProgress';

jest.mock('./practice/CodeEditor', () => function MockCodeEditor({ value, onChange, language = 'javascript' }) {
  return (
    <textarea
      aria-label={`${language} code editor`}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
});

describe('PracticePage learning workflow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.scrollTo = jest.fn();
    window.requestAnimationFrame = (callback) => {
      callback();
      return 0;
    };
    window.alert = jest.fn();
  });

  test('filters, bookmarks, opens a mission, and marks solved after tests pass', async () => {
    render(<PracticePage />);

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

    userEvent.click(screen.getByRole('button', { name: 'Editor' }));
    userEvent.click(screen.getByRole('button', { name: 'Run Tests' }));

    expect(await screen.findByText('3/3 passed')).toBeInTheDocument();
    expect(screen.getByText(/Mission cleared/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({
        'two-sum': 'solved',
      });
    });
  });

  test('shows trace validation errors inline instead of interrupting with alerts', async () => {
    render(<PracticePage />);

    userEvent.click(screen.getByRole('heading', { level: 3, name: 'Two Sum' }).closest('article'));
    expect(await screen.findByRole('heading', { level: 2, name: 'Two Sum' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Editor' }));
    userEvent.clear(screen.getByLabelText(/javascript code editor/i));
    userEvent.click(screen.getByRole('button', { name: 'Trace Execution' }));

    expect(await screen.findByText(/Code is empty/i)).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
  });

  test('practice command center exports, imports, and resets local learner state', async () => {
    render(<PracticePage />);

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

    userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY))).toEqual({});
      expect(JSON.parse(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY))).toEqual({});
    });
    expect(screen.getByText('Local practice progress reset.')).toBeInTheDocument();
  });
});
