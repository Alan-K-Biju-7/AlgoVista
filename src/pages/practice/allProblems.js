import { NEETCODE_TOPICS } from './neetcode150';

export const TOPIC_ORDER = NEETCODE_TOPICS.map((topic) => topic.id);

export const PHASE_META = {
  P1: { id: 'P1', label: 'Linear Patterns', color: '#00d4aa' },
  P2: { id: 'P2', label: 'Search & Structures', color: '#8b7cf8' },
  P3: { id: 'P3', label: 'Decision Graphs', color: '#ff6b6b' },
  P4: { id: 'P4', label: 'Optimization', color: '#f5a623' },
  P5: { id: 'P5', label: 'Interview Finishers', color: '#4a9eff' },
};

export const ALL_PROBLEMS = NEETCODE_TOPICS.reduce((acc, topic) => {
  acc[topic.id] = topic;
  return acc;
}, {});

export const getTopicList = () =>
  TOPIC_ORDER.map((id) => ALL_PROBLEMS[id]).filter(Boolean);

export const getAllProblemsFlat = () =>
  getTopicList().flatMap((topic) => topic.problems);


export const getTopicProblemCount = (topicId) =>
  ALL_PROBLEMS[topicId]?.problems?.length || 0;

export const getSolvedCountForTopic = (topicId, getStatus) =>
  (ALL_PROBLEMS[topicId]?.problems || []).filter(
    (problem) => getStatus(problem.id) === 'solved'
  ).length;
