import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { useAuth } from '../context/AuthContext';
import {
  DSA_BEGINNER_CONCEPTS,
  DSA_BEGINNER_TOTAL,
  DSA_BEGINNERS_CURRICULUM,
} from '../data/dsaBeginnersCurriculum';
import './DSABeginnersPage.css';

const statusMeta = {
  'not-started': { label: 'Not started', confidence: 0 },
  learning: { label: 'Learning', confidence: 35 },
  confident: { label: 'Confident', confidence: 70 },
  mastered: { label: 'Mastered', confidence: 100 },
};

function getProgressStatus(progress, conceptId) {
  return progress[conceptId]?.status || 'not-started';
}

function CurriculumVisual({ sectionId, color }) {
  if (sectionId === 'graphs') {
    return (
      <div className="beginner-visual beginner-visual--graph" style={{ '--viz-color': color }}>
        {['A', 'B', 'C', 'D', 'E'].map((node, index) => (
          <span key={node} className={`graph-node graph-node--${index}`}>{node}</span>
        ))}
        <span className="graph-edge graph-edge--one" />
        <span className="graph-edge graph-edge--two" />
        <span className="graph-edge graph-edge--three" />
      </div>
    );
  }

  if (sectionId === 'dynamic-programming') {
    return (
      <div className="beginner-visual beginner-visual--dp" style={{ '--viz-color': color }}>
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className={index % 5 === 0 || index > 13 ? 'is-filled' : ''} />
        ))}
      </div>
    );
  }

  if (sectionId === 'linked-list') {
    return (
      <div className="beginner-visual beginner-visual--list" style={{ '--viz-color': color }}>
        {[12, 24, 36, 48].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    );
  }

  if (sectionId === 'stack') {
    return (
      <div className="beginner-visual beginner-visual--stack" style={{ '--viz-color': color }}>
        {[4, 8, 15, 16].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    );
  }

  if (sectionId === 'strings') {
    return (
      <div className="beginner-visual beginner-visual--string" style={{ '--viz-color': color }}>
        {'KMPMATCH'.split('').map((letter, index) => (
          <span key={`${letter}-${index}`}>{letter}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="beginner-visual beginner-visual--array" style={{ '--viz-color': color }}>
      {[3, 1, 4, 1, 5, 9, 2].map((item, index) => (
        <span key={`${item}-${index}`} className={index === 2 || index === 5 ? 'is-active' : ''}>
          {item}
        </span>
      ))}
    </div>
  );
}

function SectionRail({ activeSectionId, onSelect, progress }) {
  return (
    <aside className="beginners-rail">
      <p className="beginners-rail__eyebrow">Curriculum</p>
      <div className="beginners-rail__list">
        {DSA_BEGINNERS_CURRICULUM.map((section) => {
          const mastered = section.concepts.filter(
            (concept) => getProgressStatus(progress, concept.id) === 'mastered'
          ).length;
          const pct = Math.round((mastered / section.concepts.length) * 100);
          const active = section.id === activeSectionId;

          return (
            <button
              key={section.id}
              type="button"
              className={active ? 'beginners-rail__item is-active' : 'beginners-rail__item'}
              style={{ '--section-color': section.color }}
              onClick={() => onSelect(section.id)}
            >
              <span>
                <strong>{section.title}</strong>
                <small>{section.concepts.length} concepts</small>
              </span>
              <em>{pct}%</em>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ConceptCard({ concept, active, status, onSelect }) {
  return (
    <button
      type="button"
      className={active ? 'beginner-concept is-active' : 'beginner-concept'}
      style={{ '--concept-color': concept.color }}
      onClick={() => onSelect(concept)}
    >
      <span className="beginner-concept__index">{String(concept.order).padStart(3, '0')}</span>
      <span className="beginner-concept__body">
        <strong>{concept.title}</strong>
        <small>{concept.focus}</small>
      </span>
      <span className={`beginner-concept__status beginner-concept__status--${status}`}>
        {statusMeta[status]?.label || 'Not started'}
      </span>
    </button>
  );
}

function LearningCockpit({ concept, section, progressItem, onSave, isAuthenticated }) {
  const [notes, setNotes] = useState(progressItem?.notes || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setNotes(progressItem?.notes || '');
    setMessage('');
  }, [concept.id, progressItem?.notes]);

  const saveStatus = async (status) => {
    setMessage('');
    try {
      await onSave({
        conceptId: concept.id,
        status,
        confidence: statusMeta[status].confidence,
        notes,
      });
      setMessage(`${statusMeta[status].label} saved.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <aside className="beginners-cockpit">
      <div>
        <p className="section-label">Active concept</p>
        <h2>{concept.title}</h2>
        <p>{concept.focus}</p>
      </div>

      <CurriculumVisual sectionId={section.id} color={section.color} />

      <div className="beginners-cockpit__meta">
        <span>{section.title}</span>
        <span>{concept.milestone}</span>
        <span>{concept.level}</span>
      </div>

      <div>
        <label htmlFor="concept-notes">Learning notes</label>
        <textarea
          id="concept-notes"
          rows="4"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Write the invariant, tricky edge case, or mistake to revisit."
        />
      </div>

      <div className="beginners-cockpit__actions">
        {['learning', 'confident', 'mastered'].map((status) => (
          <button
            key={status}
            type="button"
            className={status === 'mastered' ? 'btn-primary' : 'btn-ghost'}
            onClick={() => saveStatus(status)}
            disabled={!isAuthenticated}
          >
            {statusMeta[status].label}
          </button>
        ))}
      </div>

      {!isAuthenticated && (
        <p className="beginners-cockpit__hint">Log in to sync this progress through the backend.</p>
      )}
      {message && <p className="beginners-cockpit__hint">{message}</p>}

      <Link
        to={`/coach?concept=${encodeURIComponent(concept.id)}`}
        className="beginners-cockpit__coach"
      >
        Open AI coach for this concept
      </Link>
    </aside>
  );
}

export default function DSABeginnersPage() {
  const { progress, updateConceptProgress, isAuthenticated } = useAuth();
  const [activeSectionId, setActiveSectionId] = useState('foundations');
  const [activeConcept, setActiveConcept] = useState(DSA_BEGINNERS_CURRICULUM[0].concepts[0]);
  const [query, setQuery] = useState('');

  const activeSection = useMemo(() => {
    return DSA_BEGINNERS_CURRICULUM.find((section) => section.id === activeSectionId)
      || DSA_BEGINNERS_CURRICULUM[0];
  }, [activeSectionId]);

  useEffect(() => {
    setActiveConcept(activeSection.concepts[0]);
  }, [activeSection]);

  const filteredConcepts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return activeSection.concepts;
    return activeSection.concepts.filter((concept) => {
      return `${concept.title} ${concept.focus} ${concept.sectionTitle}`
        .toLowerCase()
        .includes(cleanQuery);
    });
  }, [activeSection, query]);

  const mastered = DSA_BEGINNER_CONCEPTS.filter(
    (concept) => getProgressStatus(progress, concept.id) === 'mastered'
  ).length;
  const learning = DSA_BEGINNER_CONCEPTS.filter(
    (concept) => getProgressStatus(progress, concept.id) === 'learning'
  ).length;
  const confident = DSA_BEGINNER_CONCEPTS.filter(
    (concept) => getProgressStatus(progress, concept.id) === 'confident'
  ).length;
  const completionPct = Math.round((mastered / DSA_BEGINNER_TOTAL) * 100);
  const progressItem = progress[activeConcept.id] || {};

  return (
    <div className="beginners-page">
      <section className="beginners-hero">
        <div className="beginners-hero__copy">
          <span className="badge-teal">DSA for Beginners</span>
          <h1>From first array to advanced graph thinking.</h1>
          <p>
            A complete beginner-to-advanced DSA map with visual checkpoints, backend-synced
            progress, and an AI coach ready for concept-level help.
          </p>
          <div className="beginners-hero__actions">
            <a href="#beginner-curriculum" className="btn-primary">Start the map</a>
            <Link to="/coach" className="btn-ghost">AI coach</Link>
            <Link to="/simulator" className="btn-ghost">Visual lab</Link>
          </div>
        </div>

        <div className="beginners-progress-panel">
          <p className="section-label">Your beginner arc</p>
          <strong>{completionPct}% mastered</strong>
          <div className="beginners-progress-panel__bar">
            <span style={{ width: `${completionPct}%` }} />
          </div>
          <div className="beginners-progress-panel__stats">
            <span><b>{DSA_BEGINNER_TOTAL}</b> concepts</span>
            <span><b>{learning}</b> learning</span>
            <span><b>{confident}</b> confident</span>
            <span><b>{mastered}</b> mastered</span>
          </div>
          <AuthPanel compact />
        </div>
      </section>

      <section id="beginner-curriculum" className="beginners-shell">
        <SectionRail
          activeSectionId={activeSectionId}
          onSelect={setActiveSectionId}
          progress={progress}
        />

        <main className="beginners-main" style={{ '--active-section-color': activeSection.color }}>
          <div className="beginners-main__header">
            <div>
              <p className="section-label">{activeSection.track}</p>
              <h2>{activeSection.title}</h2>
              <p>{activeSection.description}</p>
            </div>
            <div className="beginners-search">
              <label htmlFor="beginner-search">Search section</label>
              <input
                id="beginner-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="binary search, trie, dp..."
              />
            </div>
          </div>

          <div className="beginners-main__path">
            {filteredConcepts.map((concept) => (
              <ConceptCard
                key={concept.id}
                concept={concept}
                active={concept.id === activeConcept.id}
                status={getProgressStatus(progress, concept.id)}
                onSelect={setActiveConcept}
              />
            ))}
          </div>
        </main>

        <LearningCockpit
          concept={activeConcept}
          section={activeSection}
          progressItem={progressItem}
          onSave={updateConceptProgress}
          isAuthenticated={isAuthenticated}
        />
      </section>
    </div>
  );
}
