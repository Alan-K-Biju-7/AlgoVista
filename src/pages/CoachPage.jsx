import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
    // Only learner-authored turns leave the browser. Provider responses are not
    // retained or echoed into a later request without explicit product consent.
    .filter((message) => message.role === 'user')
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
  const { askCoach, isAuthenticated, progress, user } = useAuth();
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
    if (!isAuthenticated || !cleanMessage || busy) return;

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
          content: hasLiveAnswer
            ? coachReply
            : 'I could not produce a reliable answer for that request. Rephrase it with the exact input or step you want to inspect.',
          provider: hasLiveAnswer && response.provider === 'ai-provider'
            ? 'AI-generated coaching'
            : 'Built-in guide · not AI',
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: error.status === 401
            ? 'Your secure session expired. Sign in again before continuing this coaching session.'
            : 'The coaching service is temporarily unavailable. Your question was not saved; please retry in a moment.',
          provider: 'Not sent',
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
          <span className="badge-teal">Signed-in AI coaching</span>
          <h1>DSA coach that knows your learning map.</h1>
          <p>
            Ask for intuition, dry runs, edge cases, complexity, or a proof. Coaching is tied to
            your secure learner session, and provider credentials never reach the browser.
          </p>
        </div>
        <div className="coach-session" aria-label="Active coaching session">
          <span aria-hidden="true">✓</span>
          <div><b>Private session active</b><p>Learning as {user?.name || 'signed-in learner'}</p></div>
        </div>
      </section>

      <aside className="coach-disclosure" role="note">
        <span aria-hidden="true">i</span>
        <p><b>Clear answer provenance</b>AI-generated coaching is labeled. Unavailable or rejected answers are never replaced with content presented as live AI.</p>
      </aside>

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
              <span>{isAuthenticated ? 'Synced' : 'Session required'}</span>
            </div>
          </div>

          <div className="coach-prompts">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="btn-ghost"
                onClick={() => sendMessage(prompt)}
                disabled={busy || !isAuthenticated}
              >
                {prompt}
              </button>
            ))}
          </div>

          <Link to="/dsa-beginners" className="coach-map-link">
            Back to DSA for Beginners
          </Link>
        </aside>

        <section className="coach-chat" aria-label="AI coaching conversation">
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
              aria-label={`Ask the AI coach about ${concept.title}`}
              disabled={!isAuthenticated}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={!isAuthenticated || busy || !input.trim()}
            >
              Send
            </button>
          </form>
        </section>
      </section>
    </div>
  );
}
