import { useEffect, useId, useRef } from 'react';
import AuthPanel from './AuthPanel';
import { useOptionalAuth } from '../context/AuthContext';
import './AuthRequired.css';

const DEFAULT_BENEFITS = [
  'Personalized hints grounded in your current lesson or failed test',
  'Private, account-scoped learning history and progress',
  'Secure server-side AI access—provider credentials never reach the browser',
];

/**
 * A reusable, in-place authentication boundary. Keeping the requested feature
 * mounted at its original URL makes a successful sign-in the return flow: the
 * gate is replaced by `children` without losing the lesson/problem context.
 */
export default function AuthRequired({
  children,
  variant = 'page',
  feature = 'AI coaching',
  title = 'Sign in to unlock your personal DSA coach',
  description = 'Your coach uses your learning context to guide you with questions, hints, and targeted explanations.',
  benefits = DEFAULT_BENEFITS,
  onDismiss,
}) {
  const auth = useOptionalAuth();
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);
  const onDismissRef = useRef(onDismiss);
  const headingId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (variant !== 'dialog' || auth?.isAuthenticated) return undefined;
    const previousFocus = document.activeElement;
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onDismissRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus?.();
    };
  }, [auth?.isAuthenticated, variant]);

  if (auth?.loading) {
    const checking = (
      <section className={`auth-required auth-required--${variant}`} aria-live="polite" aria-busy="true">
        <div className="auth-required__checking">
          <span className="auth-required__spinner" aria-hidden="true" />
          <div><b>Checking your secure session</b><p>Your learning context will be restored automatically.</p></div>
        </div>
      </section>
    );
    return variant === 'dialog'
      ? <div className="auth-required-layer">{checking}</div>
      : <div className="auth-required-page">{checking}</div>;
  }

  if (auth?.isAuthenticated) return children;

  const content = (
    <section
      ref={panelRef}
      className={`auth-required auth-required--${variant}`}
      role={variant === 'dialog' ? 'dialog' : 'region'}
      aria-modal={variant === 'dialog' ? 'true' : undefined}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      {variant === 'dialog' && onDismiss && (
        <button
          ref={closeButtonRef}
          type="button"
          className="auth-required__close"
          onClick={onDismiss}
          aria-label={`Close ${feature} sign-in`}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}

      <div className="auth-required__intro">
        <div className="auth-required__mark" aria-hidden="true">
          <span>AI</span><i>⌁</i>
        </div>
        <p className="auth-required__eyebrow">Account-protected · {feature}</p>
        <h1 id={headingId}>{title}</h1>
        <p id={descriptionId}>{description}</p>

        <ul className="auth-required__benefits" aria-label={`${feature} account benefits`}>
          {benefits.map((benefit) => (
            <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>
          ))}
        </ul>

        <div className="auth-required__trust">
          <span aria-hidden="true">▣</span>
          <p><b>Why sign-in is required</b>Your session protects coaching access and keeps each learner’s data isolated.</p>
        </div>
      </div>

      <div className="auth-required__form">
        {auth ? (
          <AuthPanel
            purpose={`Continue to ${feature}. You will stay on this page after signing in.`}
          />
        ) : (
          <div className="auth-required__unavailable" role="note">
            <b>Open this feature from the AlgoVista app to sign in.</b>
            <p>The embedded learning content remains available, but account-protected coaching needs the secure app session.</p>
          </div>
        )}
        <p className="auth-required__return"><span aria-hidden="true">↳</span>Your current page and problem context will be preserved.</p>
      </div>
    </section>
  );

  if (variant !== 'dialog') return <div className="auth-required-page">{content}</div>;

  return (
    <div
      className="auth-required-layer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onDismiss?.();
      }}
    >
      {content}
    </div>
  );
}
