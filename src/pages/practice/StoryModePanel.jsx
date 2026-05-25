import { useMemo, useState } from 'react';
import { buildStoryMode } from './storyMode';

function SignalVisual({ color }) {
  return (
    <div className="story-signal" aria-hidden="true">
      <div className="story-signal__track">
        {[0, 1, 2, 3, 4].map((item) => (
          <span key={item} style={{ borderColor: `${color}55`, background: `${color}${item === 2 ? '2b' : '12'}` }}>
            {item === 2 ? 'hit' : item}
          </span>
        ))}
      </div>
      <div className="story-signal__flow">
        <i style={{ background: color }} />
        <i style={{ background: '#4a9eff' }} />
        <i style={{ background: '#f5a623' }} />
      </div>
      <div className="story-signal__ledger">
        <b style={{ color }}>state</b>
        <code>answer = ready</code>
      </div>
    </div>
  );
}

export default function StoryModePanel({
  problem,
  topicColor,
  onStartEditor,
  onTrace,
  hasTracer,
}) {
  const story = useMemo(() => buildStoryMode(problem), [problem]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = story.scenes[sceneIndex];
  const progress = Math.round(((sceneIndex + 1) / story.scenes.length) * 100);

  return (
    <div className="story-mode-shell">
      <section className="story-stage" style={{ borderColor: `${topicColor}45` }}>
        <div className="story-stage__main">
          <div className="story-kicker" style={{ color: topicColor }}>
            {story.pace}
          </div>
          <h3>{story.title}</h3>
          <p>{story.setting}</p>
          <div className="story-progress" aria-label={`Story progress ${progress}%`}>
            <span style={{ width: `${progress}%`, background: topicColor }} />
          </div>
        </div>
        <SignalVisual color={topicColor} />
      </section>

      <div className="story-layout">
        <aside className="story-scenes" aria-label="Story scenes">
          {story.scenes.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={index === sceneIndex ? 'is-active' : ''}
              onClick={() => setSceneIndex(index)}
              style={{
                borderColor: index === sceneIndex ? `${topicColor}70` : 'var(--border-default)',
                color: index === sceneIndex ? topicColor : 'var(--text-secondary)',
              }}
            >
              <span>{item.label}</span>
              <b>{item.title}</b>
            </button>
          ))}
        </aside>

        <main className="story-card" style={{ borderColor: `${topicColor}38` }}>
          <div className="story-card__label" style={{ color: topicColor }}>
            {scene.label}
          </div>
          <h3>{scene.title}</h3>
          <p>{scene.body}</p>
          <div className="story-focus">
            <span style={{ background: topicColor }} />
            <p>{scene.focus}</p>
          </div>

          <div className="story-actions">
            <button
              type="button"
              onClick={() => setSceneIndex(Math.max(0, sceneIndex - 1))}
              disabled={sceneIndex === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setSceneIndex(Math.min(story.scenes.length - 1, sceneIndex + 1))}
              disabled={sceneIndex === story.scenes.length - 1}
              style={{
                background: `${topicColor}18`,
                borderColor: `${topicColor}55`,
                color: topicColor,
                fontWeight: 850,
              }}
            >
              Next Scene
            </button>
            <button
              type="button"
              onClick={onStartEditor}
              style={{
                background: topicColor,
                borderColor: topicColor,
                color: '#031a14',
                fontWeight: 900,
              }}
            >
              Start Coding
            </button>
            <button type="button" onClick={onTrace}>
              {hasTracer ? 'Watch Trace' : 'Open Visual'}
            </button>
          </div>
        </main>

        <aside className="story-coach">
          <div>
            <div className="story-card__label" style={{ color: topicColor }}>Checkpoints</div>
            {story.checkpoints.map((checkpoint, index) => (
              <div key={checkpoint} className="story-checkpoint">
                <span style={{ borderColor: topicColor, color: topicColor }}>
                  {index + 1}
                </span>
                <p>{checkpoint}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="story-card__label" style={{ color: '#ff6b6b' }}>Avoid These</div>
            {story.pitfalls.map((pitfall) => (
              <p key={pitfall} className="story-pitfall">{pitfall}</p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
