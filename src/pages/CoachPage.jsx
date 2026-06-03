import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { useAuth } from '../context/AuthContext';
import {
  DSA_BEGINNER_CONCEPTS,
  getBeginnerConceptById,
} from '../data/dsaBeginnersCurriculum';
import './CoachPage.css';

const starterPrompts = [
  'Explain this like I am new to DSA.',
  'Give me a tiny dry run with variables.',
  'Quiz me with one question.',
  'Show time and space complexity.',
];

function localCoachReply(message, concept) {
  const question = extractCoachQuestion(message);
  const lowerQuestion = question.toLowerCase();
  const directAnswer = (() => {
    if (/\bwhat\s+is\s+an?\s+algorithm\b|\balgorithm\b/.test(lowerQuestion)) {
      return 'An algorithm is a clear, finite sequence of steps for solving a problem. Example: to find the largest number in [3, 8, 2], scan once, keep the biggest value seen so far, and return 8.';
    }

    if (/\bdata\s+structure\b/.test(lowerQuestion)) {
      return 'A data structure is a way to organize data so operations like lookup, insert, delete, and traversal are efficient. Arrays, stacks, queues, hash maps, trees, and graphs are common examples.';
    }

    if (/\btime\s+complexity\b|\bbig\s*o\b/.test(lowerQuestion)) {
      return 'Time complexity describes how running time grows as input size grows. O(n) means one pass over n items; O(log n) usually means the search space shrinks each step.';
    }

    return `The key idea for ${concept.title}: ${concept.focus}`;
  })();

  return [
    directAnswer,
    '',
    `Question: ${question}`,
    '',
    `Mental model: ${concept.focus}`,
    '',
    'Study loop:',
    '1. State the invariant in one sentence.',
    '2. Dry run the smallest useful input.',
    '3. Name every pointer, index, or state value.',
    '4. Finish with time and space complexity.',
    '',
    'Static safety answer shown because live coaching was unavailable or returned an unusable reply.',
  ].join('\n');
}

function cleanCoachText(text) {
  return String(text || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .trim();
}

function extractCoachQuestion(message) {
  const text = cleanCoachText(message);
  const explicitQuestion = text.match(/^Answer this exact DSA question directly:\s*(.+)$/m);
  return explicitQuestion ? explicitQuestion[1].trim() : text;
}

function isFollowUpCoachRequest(message) {
  const text = String(message || '').trim().toLowerCase();

  return [
    /^now\s+answer\s+my\s+question[.!?]*$/,
    /^answer\s+(my\s+)?(question|previous question|last question)[.!?]*$/,
    /^please\s+answer\s+(my\s+)?(question|previous question|last question)[.!?]*$/,
    /^(explain|answer|solve|show|do)\s+(it|that|this|the previous one|the last one)[.!?]*$/,
    /^what\s+about\s+(it|that|this)[?!.]*$/,
  ].some((pattern) => pattern.test(text));
}

function buildCoachHistory(messages) {
  return messages
    .filter((message) => ['user', 'assistant'].includes(message.role))
    .map((message) => ({
      role: message.role,
      content: cleanCoachText(message.content),
    }))
    .filter((message) => message.content)
    .slice(-8);
}

function buildCoachRequestMessage(message, history) {
  if (!history.length || !isFollowUpCoachRequest(message)) return message;

  const previousUserQuestion = [...history].reverse().find((item) => item.role === 'user')?.content;
  if (!previousUserQuestion) return message;

  return [
    `Answer this exact DSA question directly: ${previousUserQuestion}`,
    `Learner follow-up: ${message}`,
    'Do not introduce yourself, say welcome, or switch to a different example.',
  ].join('\n');
}

function isUnhelpfulCoachReply(reply, requestedMessage) {
  const text = cleanCoachText(reply).toLowerCase();
  if (!text) return true;
  const question = extractCoachQuestion(requestedMessage).toLowerCase();

  const genericFailure = [
    'i could not generate a response',
    'welcome to algovista',
    'welcome to the foundations',
    "i'm algovista coach",
    'i am algovista coach',
  ].some((snippet) => text.includes(snippet));

  if (genericFailure) return true;
  if (/\balgorithm\b/.test(question) && !/\balgorithm\b/.test(text)) return true;
  if (/\bdata\s+structure\b/.test(question) && !/\bdata\s+structure\b/.test(text)) return true;
  if (/\btime\s+complexity\b|\bbig\s*o\b/.test(question) && !/\bcomplexity\b|\bo\(/.test(text)) return true;

  return false;
}

function ChatBubble({ message }) {
  return (
    <div className={`coach-bubble coach-bubble--${message.role}`}>
      <p>{cleanCoachText(message.content)}</p>
      {message.provider && <span>{message.provider}</span>}
    </div>
  );
}

export default function CoachPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryConceptId = searchParams.get('concept') || DSA_BEGINNER_CONCEPTS[0].id;
  const { askCoach, isAuthenticated, progress } = useAuth();
  const [conceptId, setConceptId] = useState(queryConceptId);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Pick a concept and ask a concrete question. I will coach from intuition to implementation.',
    },
  ]);

  const concept = useMemo(() => {
    return getBeginnerConceptById(conceptId) || DSA_BEGINNER_CONCEPTS[0];
  }, [conceptId]);

  useEffect(() => {
    if (queryConceptId !== conceptId) setConceptId(queryConceptId);
  }, [queryConceptId, conceptId]);

  const sendMessage = async (messageText) => {
    const cleanMessage = messageText.trim();
    if (!cleanMessage || busy) return;

    setInput('');
    setBusy(true);
    const history = buildCoachHistory(messages);
    const coachMessage = buildCoachRequestMessage(cleanMessage, history);
    setMessages((prev) => [...prev, { role: 'user', content: cleanMessage }]);

    try {
      const response = await askCoach({
        message: coachMessage,
        concept,
        history,
      });
      const coachReply = cleanCoachText(response.reply);
      const hasLiveAnswer = !isUnhelpfulCoachReply(coachReply, coachMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: hasLiveAnswer ? coachReply : localCoachReply(coachMessage, concept),
          provider: hasLiveAnswer && response.provider === 'ai-provider' ? 'AI Coach' : 'Static tutor',
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: localCoachReply(coachMessage, concept),
          provider: 'Static tutor',
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const handleConceptChange = (nextConceptId) => {
    setConceptId(nextConceptId);
    setSearchParams({ concept: nextConceptId });
  };

  const conceptProgress = progress[concept.id]?.status || 'not-started';

  return (
    <div className="coach-page">
      <section className="coach-header">
        <div>
          <span className="badge-teal">AI Coaching</span>
          <h1>DSA coach that knows your learning map.</h1>
          <p>
            Ask for intuition, dry runs, edge cases, complexity, or a proof. The frontend talks
            only to the backend, so the AI key stays private.
          </p>
        </div>
        <AuthPanel compact />
      </section>

      <section className="coach-shell">
        <aside className="coach-sidebar">
          <div>
            <label htmlFor="coach-concept">Concept</label>
            <select
              id="coach-concept"
              value={concept.id}
              onChange={(event) => handleConceptChange(event.target.value)}
            >
              {DSA_BEGINNER_CONCEPTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {String(item.order).padStart(3, '0')} - {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="coach-concept-panel" style={{ '--coach-color': concept.color }}>
            <p className="section-label">{concept.sectionTitle}</p>
            <h2>{concept.title}</h2>
            <p>{concept.focus}</p>
            <div className="coach-concept-panel__meta">
              <span>{concept.milestone}</span>
              <span>{conceptProgress}</span>
              <span>{isAuthenticated ? 'Synced' : 'Guest'}</span>
            </div>
          </div>

          <div className="coach-prompts">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="btn-ghost"
                onClick={() => sendMessage(prompt)}
                disabled={busy}
              >
                {prompt}
              </button>
            ))}
          </div>

          <Link to="/dsa-beginners" className="coach-map-link">
            Back to DSA for Beginners
          </Link>
        </aside>

        <main className="coach-chat">
          <div className="coach-chat__messages" aria-live="polite">
            {messages.map((message, index) => (
              <ChatBubble key={`${message.role}-${index}`} message={message} />
            ))}
            {busy && (
              <div className="coach-bubble coach-bubble--assistant">
                <p>Thinking through the concept...</p>
              </div>
            )}
          </div>

          <form
            className="coach-chat__composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={`Ask about ${concept.title}`}
              rows="3"
            />
            <button type="submit" className="btn-primary" disabled={busy || !input.trim()}>
              Send
            </button>
          </form>
        </main>
      </section>
    </div>
  );
}
