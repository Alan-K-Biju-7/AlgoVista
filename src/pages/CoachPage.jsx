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
  return [
    `Let's reason about ${concept.title}.`,
    '',
    `Question: ${message}`,
    '',
    `Mental model: ${concept.focus}`,
    '',
    'Study loop:',
    '1. State the invariant in one sentence.',
    '2. Dry run the smallest useful input.',
    '3. Name every pointer, index, or state value.',
    '4. Finish with time and space complexity.',
    '',
    'This static-demo tutor is active because the backend is not connected. The full backend can add live AI, login, and synced progress.',
  ].join('\n');
}

function ChatBubble({ message }) {
  return (
    <div className={`coach-bubble coach-bubble--${message.role}`}>
      <p>{message.content}</p>
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
    setMessages((prev) => [...prev, { role: 'user', content: cleanMessage }]);

    try {
      const response = await askCoach({ message: cleanMessage, concept });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          provider: response.provider === 'ai-provider' ? 'AI Coach' : 'Offline tutor',
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: localCoachReply(cleanMessage, concept),
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
