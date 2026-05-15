import { useState } from 'react';

const initialProgressState = {};
const initialBookmarksState = {};
const PROGRESS_KEY = 'algovista.practice.progress';
const BOOKMARKS_KEY = 'algovista.practice.bookmarks';

function readStoredState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredState(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep in-memory progress working when storage is unavailable.
  }
}

export function usePracticeProgress() {
  const [progress, setProgress] = useState(() => readStoredState(PROGRESS_KEY, initialProgressState));
  const [bookmarks, setBookmarks] = useState(() => readStoredState(BOOKMARKS_KEY, initialBookmarksState));

  const markSolved = (problemId) => {
    setProgress((prev) => {
      const next = { ...prev, [problemId]: 'solved' };
      writeStoredState(PROGRESS_KEY, next);
      return next;
    });
  };

  const markAttempted = (problemId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        [problemId]: prev[problemId] === 'solved' ? 'solved' : 'attempted',
      };
      writeStoredState(PROGRESS_KEY, next);
      return next;
    });
  };

  const getStatus = (problemId) => progress[problemId] || 'unsolved';

  const getStats = (problemIds) => ({
    solved: problemIds.filter((id) => progress[id] === 'solved').length,
    attempted: problemIds.filter((id) => progress[id] === 'attempted').length,
    total: problemIds.length,
  });

  const toggleBookmark = (problemId) => {
    setBookmarks((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  const isBookmarked = (problemId) => Boolean(bookmarks[problemId]);

  return {
    markSolved,
    markAttempted,
    getStatus,
    getStats,
    toggleBookmark,
    isBookmarked,
  };
}
