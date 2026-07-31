import { useEffect, useRef, useState } from 'react';
import { useOptionalAuth } from '../../context/AuthContext';

export const PROGRESS_STORAGE_KEY = 'algovista.practice.progress.v1';
export const BOOKMARKS_STORAGE_KEY = 'algovista.practice.bookmarks.v1';
export const PRACTICE_RECORDS_STORAGE_KEY = 'algovista.practice.records.v1';
export const PRACTICE_ACTIVITY_STORAGE_KEY = 'algovista.practice.activity.v1';

const REVIEW_INTERVAL_DAYS = {
  shaky: 1,
  developing: 3,
  confident: 7,
};

const STATUS_WEIGHT = { unsolved: 0, attempted: 1, solved: 2 };
const EVIDENCE_WEIGHT = { seen: 1, guided: 2, independent: 3, durable: 4, transfer: 5 };
const MAX_COUNTER = 1_000_000;
const MAX_EXPLANATION_LENGTH = 2_000;
const MAX_LANGUAGE_LENGTH = 40;
const SYNC_DELAY_MS = 180;
const MAX_SYNC_BATCH = 24;

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

function storageKeyForScope(key, accountId) {
  if (!accountId) return key;
  return `${key}.account.${encodeURIComponent(String(accountId).slice(0, 160))}`;
}

function readScopedObject(key, accountId) {
  return readStoredObject(storageKeyForScope(key, accountId));
}

function persistScopedObject(key, value, accountId) {
  persistObject(storageKeyForScope(key, accountId), value);
}

function clearGuestSnapshot() {
  persistObject(PROGRESS_STORAGE_KEY, {});
  persistObject(BOOKMARKS_STORAGE_KEY, {});
  persistObject(PRACTICE_RECORDS_STORAGE_KEY, {});
  persistObject(PRACTICE_ACTIVITY_STORAGE_KEY, {});
}

function sanitizeStatusMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.entries(value).reduce((acc, [problemId, status]) => {
    if (['unsolved', 'attempted', 'solved'].includes(status)) {
      acc[problemId] = status;
    }
    return acc;
  }, {});
}

function sanitizeBooleanMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.entries(value).reduce((acc, [problemId, flag]) => {
    if (flag) acc[problemId] = true;
    return acc;
  }, {});
}

function boundedCounter(value, max = MAX_COUNTER) {
  return Math.min(max, Math.max(0, Math.floor(Number(value) || 0)));
}

function validTimestamp(value) {
  if (!value || Number.isNaN(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function sanitizeRecords(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.entries(value).reduce((acc, [problemId, record]) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return acc;
    acc[problemId] = {
      attempts: boundedCounter(Math.max(Number(record.attempts) || 0, Number(record.passes) || 0)),
      passes: boundedCounter(record.passes),
      hintsUsed: boundedCounter(record.hintsUsed),
      hintDepth: boundedCounter(record.hintDepth, 20),
      solutionViewed: Boolean(record.solutionViewed),
      evidenceLevel: ['seen', 'guided', 'independent', 'durable', 'transfer'].includes(record.evidenceLevel)
        ? record.evidenceLevel
        : null,
      reviewCount: boundedCounter(record.reviewCount),
      explanation: String(record.explanation || '').trim().slice(0, MAX_EXPLANATION_LENGTH),
      lastAttemptAt: validTimestamp(record.lastAttemptAt),
      solvedAt: validTimestamp(record.solvedAt),
      nextReviewAt: validTimestamp(record.nextReviewAt),
      confidence: ['shaky', 'developing', 'confident'].includes(record.confidence)
        ? record.confidence
        : null,
      lastDurationSeconds: boundedCounter(record.lastDurationSeconds, 86_400),
      lastLanguage: String(record.lastLanguage || 'javascript').trim().toLowerCase().slice(0, MAX_LANGUAGE_LENGTH) || 'javascript',
    };
    return acc;
  }, {});
}

function readSnapshot(accountId = '') {
  return {
    progress: sanitizeStatusMap(readScopedObject(PROGRESS_STORAGE_KEY, accountId)),
    bookmarks: sanitizeBooleanMap(readScopedObject(BOOKMARKS_STORAGE_KEY, accountId)),
    records: sanitizeRecords(readScopedObject(PRACTICE_RECORDS_STORAGE_KEY, accountId)),
    activity: readScopedObject(PRACTICE_ACTIVITY_STORAGE_KEY, accountId),
  };
}

function newestTimestamp(left, right) {
  const leftTime = left ? Date.parse(left) : Number.NEGATIVE_INFINITY;
  const rightTime = right ? Date.parse(right) : Number.NEGATIVE_INFINITY;
  if (leftTime === Number.NEGATIVE_INFINITY && rightTime === Number.NEGATIVE_INFINITY) return null;
  return leftTime >= rightTime ? left : right;
}

function oldestTimestamp(left, right) {
  if (!left) return right || null;
  if (!right) return left;
  return Date.parse(left) <= Date.parse(right) ? left : right;
}

function strongerStatus(left = 'unsolved', right = 'unsolved') {
  return STATUS_WEIGHT[left] >= STATUS_WEIGHT[right] ? left : right;
}

function mergeRecord(localRecord, serverRecord) {
  const local = sanitizeRecords({ record: localRecord }).record;
  const server = sanitizeRecords({ record: serverRecord }).record;
  if (!local) return server;
  if (!server) return local;

  const localTime = local.lastAttemptAt ? Date.parse(local.lastAttemptAt) : Number.NEGATIVE_INFINITY;
  const serverTime = server.lastAttemptAt ? Date.parse(server.lastAttemptAt) : Number.NEGATIVE_INFINITY;
  const fresher = serverTime > localTime ? server : local;
  const assistanceUsed = local.solutionViewed || server.solutionViewed || local.hintDepth > 0 || server.hintDepth > 0;
  const strongestEvidence = EVIDENCE_WEIGHT[local.evidenceLevel] >= EVIDENCE_WEIGHT[server.evidenceLevel]
    ? local.evidenceLevel
    : server.evidenceLevel;
  const evidenceLevel = ['durable', 'transfer'].includes(strongestEvidence)
    ? strongestEvidence
    : assistanceUsed
      ? 'guided'
      : strongestEvidence;
  const explanation = local.explanation.length >= server.explanation.length
    ? local.explanation
    : server.explanation;

  return sanitizeRecords({
    record: {
      attempts: Math.max(local.attempts, server.attempts, local.passes, server.passes),
      passes: Math.max(local.passes, server.passes),
      hintsUsed: Math.max(local.hintsUsed, server.hintsUsed),
      hintDepth: Math.max(local.hintDepth, server.hintDepth),
      solutionViewed: local.solutionViewed || server.solutionViewed,
      evidenceLevel,
      reviewCount: Math.max(local.reviewCount, server.reviewCount),
      explanation,
      lastAttemptAt: newestTimestamp(local.lastAttemptAt, server.lastAttemptAt),
      solvedAt: oldestTimestamp(local.solvedAt, server.solvedAt),
      nextReviewAt: newestTimestamp(local.nextReviewAt, server.nextReviewAt),
      confidence: fresher.confidence || local.confidence || server.confidence,
      lastDurationSeconds: Math.max(local.lastDurationSeconds, server.lastDurationSeconds),
      lastLanguage: fresher.lastLanguage || local.lastLanguage || server.lastLanguage,
    },
  }).record;
}

export function normalizeAccountPracticeProgress(value) {
  const progress = {};
  const bookmarks = {};
  const records = {};
  const entries = Array.isArray(value)
    ? value.map((item) => [item?.problemId, item])
    : Object.entries(value && typeof value === 'object' ? value : {});

  entries.forEach(([key, item]) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return;
    const problemId = String(item.problemId || key || '').trim().slice(0, 160);
    if (!problemId) return;

    // Older/local adapters expose one flattened item per problem. The durable
    // repository exposes one item per language instead:
    // { "two-sum": { javascript: {...}, python: {...} } }.
    const isFlatItem = Object.prototype.hasOwnProperty.call(item, 'record')
      || Object.prototype.hasOwnProperty.call(item, 'status')
      || Object.prototype.hasOwnProperty.call(item, 'attempts')
      || Object.prototype.hasOwnProperty.call(item, 'passes');
    const languageEntries = isFlatItem
      ? [[item.language || item.record?.lastLanguage || '', item]]
      : Object.entries(item).filter(([, languageRecord]) => (
          languageRecord && typeof languageRecord === 'object' && !Array.isArray(languageRecord)
        ));

    let mergedRecord;
    let mergedStatus = 'unsolved';
    let latestLanguage = '';
    let latestLanguageTimestamp = Number.NEGATIVE_INFINITY;
    let latestBookmark = false;
    let latestBookmarkTimestamp = Number.NEGATIVE_INFINITY;
    languageEntries.forEach(([language, languageItem]) => {
      const rawRecord = languageItem.record && typeof languageItem.record === 'object'
        ? languageItem.record
        : languageItem;
      const record = sanitizeRecords({
        [problemId]: {
          ...rawRecord,
          lastLanguage: rawRecord.lastLanguage || language || 'javascript',
        },
      })[problemId];
      if (!record) return;
      mergedRecord = mergeRecord(mergedRecord, record);
      const inferredStatus = record.passes > 0
        ? 'solved'
        : record.attempts > 0
          ? 'attempted'
          : 'unsolved';
      mergedStatus = strongerStatus(
        mergedStatus,
        ['unsolved', 'attempted', 'solved'].includes(languageItem.status)
          ? languageItem.status
          : inferredStatus
      );
      const languageTimestamp = Date.parse(
        languageItem.updatedAt || record.lastAttemptAt || ''
      );
      if (Number.isFinite(languageTimestamp) && languageTimestamp >= latestLanguageTimestamp) {
        latestLanguageTimestamp = languageTimestamp;
        latestLanguage = String(language || record.lastLanguage || '').trim().toLowerCase();
      } else if (!latestLanguage) {
        latestLanguage = String(language || record.lastLanguage || '').trim().toLowerCase();
      }
      const bookmarkTimestamp = Number.isFinite(languageTimestamp)
        ? languageTimestamp
        : latestBookmarkTimestamp === Number.NEGATIVE_INFINITY
          ? 0
          : latestBookmarkTimestamp + 1;
      if (typeof languageItem.bookmarked === 'boolean' && bookmarkTimestamp >= latestBookmarkTimestamp) {
        latestBookmarkTimestamp = bookmarkTimestamp;
        latestBookmark = languageItem.bookmarked;
      }
    });

    if (mergedRecord) {
      records[problemId] = sanitizeRecords({
        [problemId]: {
          ...mergedRecord,
          lastLanguage: latestLanguage || mergedRecord.lastLanguage,
        },
      })[problemId];
    }
    progress[problemId] = mergedStatus;
    if (isFlatItem && typeof item.bookmarked === 'boolean') latestBookmark = item.bookmarked;
    if (latestBookmark) bookmarks[problemId] = true;
  });

  return { progress, bookmarks, records, activity: {} };
}

export function mergePracticeSnapshots(localSnapshot = {}, serverValue = {}) {
  const local = {
    progress: sanitizeStatusMap(localSnapshot.progress),
    bookmarks: sanitizeBooleanMap(localSnapshot.bookmarks),
    records: sanitizeRecords(localSnapshot.records),
    activity: localSnapshot.activity && typeof localSnapshot.activity === 'object' ? localSnapshot.activity : {},
  };
  const server = serverValue.progress || serverValue.records || serverValue.bookmarks
    ? {
        progress: sanitizeStatusMap(serverValue.progress),
        bookmarks: sanitizeBooleanMap(serverValue.bookmarks),
        records: sanitizeRecords(serverValue.records),
        activity: {},
      }
    : normalizeAccountPracticeProgress(serverValue);
  const problemIds = new Set([
    ...Object.keys(local.progress), ...Object.keys(server.progress),
    ...Object.keys(local.bookmarks), ...Object.keys(server.bookmarks),
    ...Object.keys(local.records), ...Object.keys(server.records),
  ]);
  const merged = { progress: {}, bookmarks: {}, records: {}, activity: local.activity };

  problemIds.forEach((problemId) => {
    const record = mergeRecord(local.records[problemId], server.records[problemId]);
    const inferredStatus = record?.passes > 0 ? 'solved' : record?.attempts > 0 ? 'attempted' : 'unsolved';
    const status = strongerStatus(strongerStatus(local.progress[problemId], server.progress[problemId]), inferredStatus);
    if (status !== 'unsolved') merged.progress[problemId] = status;
    if (local.bookmarks[problemId] || server.bookmarks[problemId]) merged.bookmarks[problemId] = true;
    if (record) merged.records[problemId] = record;
  });
  return merged;
}

export function createPracticeSyncPayload(problemId, snapshot) {
  const id = String(problemId || '').trim().slice(0, 160);
  const record = sanitizeRecords({ [id]: snapshot?.records?.[id] || {} })[id];
  const evidenceLevel = record?.evidenceLevel || 'unknown';
  return {
    problemId: id,
    status: ['attempted', 'solved'].includes(snapshot?.progress?.[id]) ? snapshot.progress[id] : 'unsolved',
    bookmarked: Boolean(snapshot?.bookmarks?.[id]),
    language: record?.lastLanguage || 'javascript',
    record: record && {
      attempts: record.attempts,
      passes: record.passes,
      hintsUsed: record.hintsUsed,
      // The shared storage contract intentionally exposes three assistance
      // levels. Keep richer UI counters local while sending the accepted cap.
      hintDepth: Math.min(3, record.hintDepth),
      solutionViewed: record.solutionViewed,
      evidenceLevel,
      lastVerdict: record.passes > 0 ? 'accepted' : 'not-run',
      reviewCount: record.reviewCount,
      explanation: record.explanation,
      confidence: record.confidence,
      lastAttemptAt: record.lastAttemptAt,
      solvedAt: record.solvedAt,
      nextReviewAt: record.nextReviewAt,
      lastDurationSeconds: record.lastDurationSeconds,
    },
  };
}

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function accountIdForAuth(auth) {
  if (!auth || auth.loading || !auth.isAuthenticated || !auth.user) return '';
  return String(auth.user.id || auth.user.email || '').trim();
}

function snapshotProblemIds(snapshot) {
  return new Set([
    ...Object.keys(snapshot.progress || {}),
    ...Object.keys(snapshot.bookmarks || {}),
    ...Object.keys(snapshot.records || {}),
  ]);
}

function mergeActivity(left = {}, right = {}) {
  const merged = { ...left };
  Object.entries(right).forEach(([day, count]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
    merged[day] = Math.max(boundedCounter(merged[day]), boundedCounter(count));
  });
  return merged;
}

export function usePracticeProgress() {
  const auth = useOptionalAuth();
  const initialAccountId = accountIdForAuth(auth);
  const initialSnapshotRef = useRef(null);
  if (!initialSnapshotRef.current) initialSnapshotRef.current = readSnapshot(initialAccountId);

  const [progress, setProgress] = useState(initialSnapshotRef.current.progress);
  const [bookmarks, setBookmarks] = useState(initialSnapshotRef.current.bookmarks);
  const [records, setRecords] = useState(initialSnapshotRef.current.records);
  const [activity, setActivity] = useState(initialSnapshotRef.current.activity);
  const progressRef = useRef(progress);
  const bookmarksRef = useRef(bookmarks);
  const recordsRef = useRef(records);
  const activityRef = useRef(activity);
  const authRef = useRef(auth);
  const accountScopeRef = useRef(initialAccountId);
  const hydratedAccountRef = useRef(initialAccountId ? '' : null);
  const hydrationAttemptedRef = useRef('');
  const hydrationInFlightRef = useRef('');
  const hydrateAccountRef = useRef(null);
  const pendingSyncRef = useRef(new Map());
  const syncTimerRef = useRef(null);
  const syncInFlightRef = useRef(false);
  const flushSyncRef = useRef(null);
  const queueProblemSyncRef = useRef(null);
  const mountedRef = useRef(true);
  authRef.current = auth;

  const currentSnapshot = () => ({
    progress: progressRef.current,
    bookmarks: bookmarksRef.current,
    records: recordsRef.current,
    activity: activityRef.current,
  });

  const applySnapshot = (snapshot) => {
    const next = {
      progress: sanitizeStatusMap(snapshot.progress),
      bookmarks: sanitizeBooleanMap(snapshot.bookmarks),
      records: sanitizeRecords(snapshot.records),
      activity: snapshot.activity && typeof snapshot.activity === 'object' ? snapshot.activity : {},
    };
    progressRef.current = next.progress;
    bookmarksRef.current = next.bookmarks;
    recordsRef.current = next.records;
    activityRef.current = next.activity;
    setProgress(next.progress);
    setBookmarks(next.bookmarks);
    setRecords(next.records);
    setActivity(next.activity);
    return next;
  };

  const scheduleSync = (delay = SYNC_DELAY_MS) => {
    if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
    syncTimerRef.current = window.setTimeout(() => flushSyncRef.current?.(), delay);
  };

  flushSyncRef.current = async () => {
    const currentAuth = authRef.current;
    const accountId = accountIdForAuth(currentAuth);
    if (
      !accountId
      || hydratedAccountRef.current !== accountId
      || syncInFlightRef.current
      || typeof currentAuth.updatePracticeProgress !== 'function'
    ) return;

    const batch = Array.from(pendingSyncRef.current.entries())
      .filter(([, queued]) => queued.accountId === accountId)
      .slice(0, MAX_SYNC_BATCH);
    if (!batch.length) return;
    syncInFlightRef.current = true;
    const results = await Promise.allSettled(
      batch.map(([, queued]) => currentAuth.updatePracticeProgress(queued.payload))
    );
    let successCount = 0;
    results.forEach((result, index) => {
      if (result.status !== 'fulfilled') return;
      successCount += 1;
      const [problemId, queued] = batch[index];
      if (pendingSyncRef.current.get(problemId) === queued) pendingSyncRef.current.delete(problemId);
    });
    syncInFlightRef.current = false;
    if (successCount > 0 && pendingSyncRef.current.size > 0) scheduleSync();
  };

  queueProblemSyncRef.current = (problemId, snapshot = currentSnapshot()) => {
    const accountId = accountIdForAuth(authRef.current);
    if (!accountId || !problemId) return;
    pendingSyncRef.current.set(problemId, {
      accountId,
      payload: createPracticeSyncPayload(problemId, snapshot),
    });
    if (hydratedAccountRef.current === accountId) scheduleSync();
  };

  useEffect(() => {
    persistScopedObject(PROGRESS_STORAGE_KEY, progress, accountScopeRef.current);
  }, [progress]);

  useEffect(() => {
    persistScopedObject(BOOKMARKS_STORAGE_KEY, bookmarks, accountScopeRef.current);
  }, [bookmarks]);

  useEffect(() => {
    persistScopedObject(PRACTICE_RECORDS_STORAGE_KEY, records, accountScopeRef.current);
  }, [records]);

  useEffect(() => {
    persistScopedObject(PRACTICE_ACTIVITY_STORAGE_KEY, activity, accountScopeRef.current);
  }, [activity]);

  hydrateAccountRef.current = async (accountId) => {
    const currentAuth = authRef.current;
    if (
      !accountId
      || accountIdForAuth(currentAuth) !== accountId
      || typeof currentAuth.refreshPracticeProgress !== 'function'
      || hydrationInFlightRef.current === accountId
    ) return;

    const previousScope = accountScopeRef.current;
    if (previousScope && previousScope !== accountId) pendingSyncRef.current.clear();
    accountScopeRef.current = accountId;
    const accountCache = readSnapshot(accountId);
    const guestCache = readSnapshot();
    const liveSameAccount = previousScope === accountId ? currentSnapshot() : accountCache;
    const preliminary = mergePracticeSnapshots(liveSameAccount, guestCache);
    preliminary.activity = mergeActivity(liveSameAccount.activity, guestCache.activity);
    applySnapshot(preliminary);
    hydrationInFlightRef.current = accountId;
    hydrationAttemptedRef.current = accountId;

    try {
      const serverValue = await currentAuth.refreshPracticeProgress();
      if (!mountedRef.current || accountIdForAuth(authRef.current) !== accountId) return;
      const serverSnapshot = normalizeAccountPracticeProgress(serverValue);
      const merged = mergePracticeSnapshots(currentSnapshot(), serverSnapshot);
      merged.activity = activityRef.current;
      applySnapshot(merged);
      hydratedAccountRef.current = accountId;

      persistScopedObject(PROGRESS_STORAGE_KEY, merged.progress, accountId);
      persistScopedObject(BOOKMARKS_STORAGE_KEY, merged.bookmarks, accountId);
      persistScopedObject(PRACTICE_RECORDS_STORAGE_KEY, merged.records, accountId);
      persistScopedObject(PRACTICE_ACTIVITY_STORAGE_KEY, merged.activity, accountId);
      clearGuestSnapshot();

      const serverIds = snapshotProblemIds(serverSnapshot);
      snapshotProblemIds(merged).forEach((problemId) => {
        const mergedPayload = createPracticeSyncPayload(problemId, merged);
        const serverPayload = createPracticeSyncPayload(problemId, serverSnapshot);
        if (!serverIds.has(problemId) || JSON.stringify(mergedPayload) !== JSON.stringify(serverPayload)) {
          queueProblemSyncRef.current?.(problemId, merged);
        }
      });
      flushSyncRef.current?.();
    } catch {
      // Local/account-scoped progress remains usable. A later online event or
      // practice action retries only after the server snapshot can be merged.
    } finally {
      if (hydrationInFlightRef.current === accountId) hydrationInFlightRef.current = '';
    }
  };

  const accountId = accountIdForAuth(auth);
  useEffect(() => {
    if (auth?.loading) return;
    if (!accountId) {
      pendingSyncRef.current.clear();
      hydratedAccountRef.current = null;
      hydrationAttemptedRef.current = '';
      if (accountScopeRef.current) {
        accountScopeRef.current = '';
        applySnapshot(readSnapshot());
      }
      return;
    }
    if (hydratedAccountRef.current !== accountId && hydrationAttemptedRef.current !== accountId) {
      hydrateAccountRef.current?.(accountId);
    }
  }, [accountId, auth?.loading]);

  useEffect(() => {
    const handleOnline = () => {
      const onlineAccountId = accountIdForAuth(authRef.current);
      if (!onlineAccountId) return;
      if (hydratedAccountRef.current !== onlineAccountId) {
        hydrationAttemptedRef.current = '';
        hydrateAccountRef.current?.(onlineAccountId);
      } else {
        flushSyncRef.current?.();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
    };
  }, []);

  const commitProblem = (problemId, updates = {}) => {
    if (updates.status) {
      progressRef.current = { ...progressRef.current, [problemId]: updates.status };
      setProgress(progressRef.current);
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'bookmarked')) {
      const nextBookmarks = { ...bookmarksRef.current };
      if (updates.bookmarked) nextBookmarks[problemId] = true;
      else delete nextBookmarks[problemId];
      bookmarksRef.current = nextBookmarks;
      setBookmarks(nextBookmarks);
    }
    if (updates.record) {
      recordsRef.current = {
        ...recordsRef.current,
        [problemId]: sanitizeRecords({ [problemId]: updates.record })[problemId],
      };
      setRecords(recordsRef.current);
    }
    queueProblemSyncRef.current?.(problemId);
  };

  const markSolved = (problemId, metadata = {}) => {
    const current = recordsRef.current[problemId] || {};
    const now = new Date();
    commitProblem(problemId, {
      status: 'solved',
      record: {
        attempts: Math.max(current.attempts || 0, (current.passes || 0) + 1),
        passes: (current.passes || 0) + 1,
        hintsUsed: current.hintsUsed || 0,
        lastAttemptAt: now.toISOString(),
        solvedAt: current.solvedAt || now.toISOString(),
        nextReviewAt: new Date(now.getTime() + (current.hintDepth || current.solutionViewed ? 1 : metadata.mode === 'review' ? Math.min(30, 7 * Math.max(1, (current.reviewCount || 0) + 1)) : 3) * 24 * 60 * 60 * 1000).toISOString(),
        confidence: current.confidence || null,
        hintDepth: current.hintDepth || 0,
        solutionViewed: Boolean(current.solutionViewed),
        evidenceLevel: metadata.mode === 'review'
          ? 'durable'
          : current.hintDepth || current.solutionViewed
            ? 'guided'
            : 'independent',
        reviewCount: (current.reviewCount || 0) + (metadata.mode === 'review' ? 1 : 0),
        explanation: current.explanation || '',
        lastDurationSeconds: Math.max(0, Number(metadata.durationSeconds) || current.lastDurationSeconds || 0),
        lastLanguage: metadata.language || current.lastLanguage || 'javascript',
      },
    });
  };

  const markAttempted = (problemId, metadata = {}) => {
    const status = progressRef.current[problemId] === 'solved' ? 'solved' : 'attempted';
    if (metadata.track === false) {
      commitProblem(problemId, { status });
      return;
    }
    const now = new Date();
    const current = recordsRef.current[problemId] || {};
    const alreadyPracticedToday = current.lastAttemptAt && dateKey(new Date(current.lastAttemptAt)) === dateKey(now);
    commitProblem(problemId, {
      status,
      record: {
        ...current,
        attempts: (current.attempts || 0) + 1,
        passes: current.passes || 0,
        hintsUsed: current.hintsUsed || 0,
        hintDepth: current.hintDepth || 0,
        solutionViewed: Boolean(current.solutionViewed),
        evidenceLevel: current.evidenceLevel || 'seen',
        reviewCount: current.reviewCount || 0,
        explanation: current.explanation || '',
        lastAttemptAt: now.toISOString(),
        solvedAt: current.solvedAt || null,
        nextReviewAt: current.nextReviewAt || null,
        confidence: current.confidence || null,
        lastDurationSeconds: Math.max(0, Number(metadata.durationSeconds) || current.lastDurationSeconds || 0),
        lastLanguage: metadata.language || current.lastLanguage || 'javascript',
      },
    });
    if (!alreadyPracticedToday) {
      const today = dateKey(now);
      activityRef.current = { ...activityRef.current, [today]: (Number(activityRef.current[today]) || 0) + 1 };
      setActivity(activityRef.current);
    }
  };

  const recordHintViewed = (problemId, depth = 1) => {
    const current = recordsRef.current[problemId] || {};
    commitProblem(problemId, {
      record: {
        ...current,
        attempts: current.attempts || 0,
        passes: current.passes || 0,
        hintsUsed: (current.hintsUsed || 0) + 1,
        hintDepth: Math.max(current.hintDepth || 0, Number(depth) || 1),
        solutionViewed: Boolean(current.solutionViewed),
        evidenceLevel: current.evidenceLevel || 'seen',
        reviewCount: current.reviewCount || 0,
        explanation: current.explanation || '',
        lastLanguage: current.lastLanguage || 'javascript',
      },
    });
  };

  const recordSolutionViewed = (problemId) => {
    const current = recordsRef.current[problemId] || {};
    commitProblem(problemId, {
      record: {
        ...current,
        attempts: current.attempts || 0,
        passes: current.passes || 0,
        hintsUsed: current.hintsUsed || 0,
        hintDepth: current.hintDepth || 0,
        solutionViewed: true,
        evidenceLevel: current.evidenceLevel || 'seen',
        reviewCount: current.reviewCount || 0,
        explanation: current.explanation || '',
        lastLanguage: current.lastLanguage || 'javascript',
      },
    });
  };

  const recordReflection = (problemId, reflection) => {
    const confidence = typeof reflection === 'string' ? reflection : reflection?.confidence;
    const explanation = typeof reflection === 'object' ? String(reflection?.explanation || '').trim() : '';
    const normalized = REVIEW_INTERVAL_DAYS[confidence] ? confidence : 'developing';
    const current = recordsRef.current[problemId] || {};
    const evidenceDays = current.evidenceLevel === 'durable'
      ? Math.min(30, 7 * Math.max(1, current.reviewCount || 1))
      : current.evidenceLevel === 'independent'
        ? 3
        : 1;
    const calibrationAdjustment = normalized === 'shaky' ? -1 : normalized === 'confident' ? 1 : 0;
    const intervalDays = Math.max(1, evidenceDays + calibrationAdjustment);
    const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();
    commitProblem(problemId, {
      record: {
        ...current,
        attempts: current.attempts || 0,
        passes: current.passes || 0,
        hintsUsed: current.hintsUsed || 0,
        lastLanguage: current.lastLanguage || 'javascript',
        confidence: normalized,
        explanation,
        nextReviewAt,
      },
    });
    return nextReviewAt;
  };

  const getStatus = (problemId) => progress[problemId] || 'unsolved';

  const getStats = (problemIds) => ({
    solved: problemIds.filter((id) => progress[id] === 'solved').length,
    attempted: problemIds.filter((id) => progress[id] === 'attempted').length,
    total: problemIds.length,
  });

  const toggleBookmark = (problemId) => {
    commitProblem(problemId, { bookmarked: !bookmarksRef.current[problemId] });
  };

  const isBookmarked = (problemId) => Boolean(bookmarks[problemId]);
  const getRecord = (problemId) => records[problemId] || {
    attempts: 0,
    passes: 0,
    hintsUsed: 0,
    hintDepth: 0,
    solutionViewed: false,
    evidenceLevel: null,
    reviewCount: 0,
    explanation: '',
    confidence: null,
    nextReviewAt: null,
  };
  const isDueForReview = (problemId, now = Date.now()) => {
    const reviewAt = records[problemId]?.nextReviewAt;
    return Boolean(reviewAt && new Date(reviewAt).getTime() <= now);
  };

  const exportSnapshot = () => ({
    version: 1,
    exportedAt: new Date().toISOString(),
    progress,
    bookmarks,
    records,
    activity,
  });

  const importSnapshot = (snapshot) => {
    const parsed = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;
    const nextProgress = sanitizeStatusMap(parsed?.progress);
    const nextBookmarks = sanitizeBooleanMap(parsed?.bookmarks);
    const nextRecords = sanitizeRecords(parsed?.records);
    const nextActivity = parsed?.activity && typeof parsed.activity === 'object' ? parsed.activity : {};
    const previousIds = snapshotProblemIds(currentSnapshot());
    applySnapshot({ progress: nextProgress, bookmarks: nextBookmarks, records: nextRecords, activity: nextActivity });
    new Set([...previousIds, ...snapshotProblemIds(currentSnapshot())]).forEach((problemId) => {
      queueProblemSyncRef.current?.(problemId);
    });
    return { progress: nextProgress, bookmarks: nextBookmarks, records: nextRecords, activity: nextActivity };
  };

  const resetPracticeData = () => {
    const previousIds = snapshotProblemIds(currentSnapshot());
    applySnapshot({ progress: {}, bookmarks: {}, records: {}, activity: {} });
    previousIds.forEach((problemId) => queueProblemSyncRef.current?.(problemId));
  };

  return {
    markSolved,
    markAttempted,
    getStatus,
    getStats,
    toggleBookmark,
    isBookmarked,
    getRecord,
    isDueForReview,
    recordHintViewed,
    recordSolutionViewed,
    recordReflection,
    records,
    activity,
    exportSnapshot,
    importSnapshot,
    resetPracticeData,
  };
}
