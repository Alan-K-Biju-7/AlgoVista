import { useEffect, useState } from 'react';

export const PROGRESS_STORAGE_KEY = 'algovista.practice.progress.v1';
export const BOOKMARKS_STORAGE_KEY = 'algovista.practice.bookmarks.v1';

function readStoredObject(key) {
  if (typeof window === 'undefined') return {};
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return {};
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function persistObject(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private browsing or embedded previews.
  }
}

export function usePracticeProgress() {
  const [progress, setProgress] = useState(() => readStoredObject(PROGRESS_STORAGE_KEY));
  const [bookmarks, setBookmarks] = useState(() => readStoredObject(BOOKMARKS_STORAGE_KEY));

  useEffect(() => {
    persistObject(PROGRESS_STORAGE_KEY, progress);
  }, [progress]);

  useEffect(() => {
    persistObject(BOOKMARKS_STORAGE_KEY, bookmarks);
  }, [bookmarks]);

  const markSolved = (problemId) => {
    setProgress((prev) => ({ ...prev, [problemId]: 'solved' }));
  };

  const markAttempted = (problemId) => {
    setProgress((prev) => ({
      ...prev,
      [problemId]: prev[problemId] === 'solved' ? 'solved' : 'attempted',
    }));
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
