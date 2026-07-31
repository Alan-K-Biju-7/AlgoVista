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
  const visualLabels = {
    graphs: 'Graph nodes connected by edges',
    'dynamic-programming': 'Dynamic programming table with solved states',
    'linked-list': 'Linked list nodes connected in sequence',
    stack: 'Stack values arranged from base to top',
    strings: 'String characters with a highlighted matching window',
  };
  const accessibilityProps = {
    role: 'img',
    'aria-label': visualLabels[sectionId] || 'Array values with active indexes highlighted',
  };

  if (sectionId === 'graphs') {
    return (
      <div className="beginner-visual beginner-visual--graph" style={{ '--viz-color': color }} {...accessibilityProps}>
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
      <div className="beginner-visual beginner-visual--dp" style={{ '--viz-color': color }} {...accessibilityProps}>
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className={index % 5 === 0 || index > 13 ? 'is-filled' : ''} />
        ))}
      </div>
    );
  }

  if (sectionId === 'linked-list') {
    return (
      <div className="beginner-visual beginner-visual--list" style={{ '--viz-color': color }} {...accessibilityProps}>
        {[12, 24, 36, 48].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    );
  }

  if (sectionId === 'stack') {
    return (
      <div className="beginner-visual beginner-visual--stack" style={{ '--viz-color': color }} {...accessibilityProps}>
        {[4, 8, 15, 16].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    );
  }

  if (sectionId === 'strings') {
    return (
      <div className="beginner-visual beginner-visual--string" style={{ '--viz-color': color }} {...accessibilityProps}>
        {'KMPMATCH'.split('').map((letter, index) => (
          <span key={`${letter}-${index}`}>{letter}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="beginner-visual beginner-visual--array" style={{ '--viz-color': color }} {...accessibilityProps}>
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
    <aside className="beginners-rail" aria-label="Curriculum sections">
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
              aria-pressed={active}
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
    <Link
      to={`/dsa-beginners/${concept.id}`}
      className={active ? 'beginner-concept is-active' : 'beginner-concept'}
      style={{ '--concept-color': concept.color }}
      onClick={() => onSelect(concept)}
      aria-current={active ? 'true' : undefined}
    >
      <span className="beginner-concept__index">{String(concept.order).padStart(3, '0')}</span>
      <span className="beginner-concept__body">
        <strong>{concept.title}</strong>
        <small>{concept.focus}</small>
      </span>
      <span className={`beginner-concept__status beginner-concept__status--${status}`}>
        {statusMeta[status]?.label || 'Not started'}
      </span>
    </Link>
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
    <aside className="beginners-cockpit" aria-labelledby="active-concept-title">
      <div>
        <p className="section-label">Active concept</p>
        <h2 id="active-concept-title">{concept.title}</h2>
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
          maxLength="2000"
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
            aria-pressed={progressItem?.status === status}
          >
            {statusMeta[status].label}
          </button>
        ))}
      </div>

      {!isAuthenticated && (
        <p className="beginners-cockpit__hint">Log in to sync this progress through the backend.</p>
      )}
      {message && <p className="beginners-cockpit__hint" role="status">{message}</p>}

      <Link
        to={`/coach?concept=${encodeURIComponent(concept.id)}`}
        className={isAuthenticated ? 'beginners-cockpit__coach' : 'beginners-cockpit__coach is-locked'}
      >
        {isAuthenticated ? 'Open personal tutor for this concept' : 'Sign in to use personal tutoring'}
      </Link>
      <Link
        to={`/dsa-beginners/${concept.id}`}
        className="beginners-cockpit__lesson"
      >
        Open full lesson page
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
    return DSA_BEGINNER_CONCEPTS.filter((concept) => {
      return `${concept.title} ${concept.focus} ${concept.sectionTitle}`
        .toLowerCase()
        .includes(cleanQuery);
    });
  }, [activeSection, query]);

  const handleSectionSelect = (sectionId) => {
    setQuery('');
    setActiveSectionId(sectionId);
  };

  const handleConceptSelect = (concept) => {
    setActiveConcept(concept);
    setActiveSectionId(concept.sectionId);
  };

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
            A complete beginner-to-advanced DSA map with visual checkpoints, synced progress,
            and personal concept coaching after sign-in.
          </p>
          <div className="beginners-hero__actions">
            <a href="#beginner-curriculum" className="btn-primary">Start the map</a>
            <Link to="/coach" className="btn-ghost">
              {isAuthenticated ? 'Personal tutor' : 'Sign in for tutoring'}
            </Link>
            <Link to="/simulator" className="btn-ghost">Visual lab</Link>
          </div>
        </div>

        <div className="beginners-progress-panel">
          <p className="section-label">Your beginner arc</p>
          <strong>{completionPct}% mastered</strong>
          <div
            className="beginners-progress-panel__bar"
            role="progressbar"
            aria-label="Curriculum mastery"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={completionPct}
          >
            <span style={{ width: `${completionPct}%` }} />
          </div>
          <div className="beginners-progress-panel__stats">
            <span><b>{DSA_BEGINNER_TOTAL}</b> concepts</span>
            <span><b>{learning}</b> learning</span>
            <span><b>{confident}</b> confident</span>
            <span><b>{mastered}</b> mastered</span>
          </div>
          <div id="beginner-account">
            <AuthPanel compact purpose="Sign in to save progress and unlock personal tutoring." />
          </div>
        </div>
      </section>

      <section className="beginners-learning-loop" aria-labelledby="learning-loop-title">
        <div>
          <p className="section-label">Designed for retention</p>
          <h2 id="learning-loop-title">One repeatable loop for every concept</h2>
        </div>
        <ol>
          <li><span>01</span><strong>Understand</strong><small>Build the mental model</small></li>
          <li><span>02</span><strong>Simulate</strong><small>Predict every state change</small></li>
          <li><span>03</span><strong>Practice</strong><small>Apply it to interview code</small></li>
          <li><span>04</span><strong>Review</strong><small>Retrieve it after a delay</small></li>
        </ol>
      </section>

      <section id="beginner-curriculum" className="beginners-shell">
        <SectionRail
          activeSectionId={activeSectionId}
          onSelect={handleSectionSelect}
          progress={progress}
        />

        <section className="beginners-main" style={{ '--active-section-color': activeSection.color }} aria-label="DSA curriculum concepts">
          <div className="beginners-main__header">
            <div>
              <p className="section-label">{query.trim() ? 'Entire curriculum' : activeSection.track}</p>
              <h2>{query.trim() ? 'Search results' : activeSection.title}</h2>
              <p>{query.trim()
                ? `${filteredConcepts.length} concepts match across every learning track.`
                : activeSection.description}</p>
            </div>
            <div className="beginners-search">
              <label htmlFor="beginner-search">Search curriculum</label>
              <input
                id="beginner-search"
                type="search"
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
                onSelect={handleConceptSelect}
              />
            ))}
            {!filteredConcepts.length && (
              <div className="beginners-main__empty" role="status">
                <strong>No concept matched “{query.trim()}”</strong>
                <span>Try a shorter topic such as graph, search, tree, or DP.</span>
                <button type="button" onClick={() => setQuery('')}>Clear search</button>
              </div>
            )}
          </div>
        </section>

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
