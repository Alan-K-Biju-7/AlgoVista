import { useState } from 'react';

const initialProgressState = {};
const initialBookmarksState = {};

export function usePracticeProgress() {
  const [progress, setProgress] = useState(initialProgressState);
  const [bookmarks, setBookmarks] = useState(initialBookmarksState);

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
