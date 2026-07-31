# AlgoVista security model

AlgoVista handles account credentials, revocable sessions, learning progress, and optional model-provider requests. Security is treated as a maintained engineering property, not a one-time claim. No software can honestly guarantee zero vulnerabilities.

## Reporting a vulnerability

Please do not publish exploit details, credentials, learner data, or provider keys in a public issue. Use the repository's private security-advisory channel when it is enabled, or contact the maintainers privately and include:

- the affected route, component, or commit;
- the smallest reproducible proof of concept;
- expected and observed behavior;
- realistic impact and prerequisites; and
- any safe mitigation you already tested.

Do not access data belonging to another person, persist access, degrade the service, or run destructive tests. Maintainers should acknowledge a complete report, reproduce it in an isolated environment, rotate exposed credentials, prepare regression tests, and disclose only after a fix is available.

## Supported production boundary

The supported authenticated topology is one HTTPS origin serving both the built React application and `/api`, with a private managed PostgreSQL database behind the Node service.

```text
internet ──HTTPS──> AlgoVista Node service ──private connection──> PostgreSQL
                              │
                              └──HTTPS──> configured model provider (optional)
```

The checked-in Render Blueprint follows this topology. A frontend and API on unrelated sites are not the preferred production boundary because cross-site cookies are increasingly blocked. If a split deployment is unavoidable, configure an exact `FRONTEND_ORIGINS` allowlist, HTTPS, `SameSite=None`, and credentialed CORS, then test it against target browser privacy settings.

Local JSON storage exists for development and tests. It is not the production database and should not be shared by multiple application processes.

## Data stored by AlgoVista

Production PostgreSQL stores:

- a user id, display name, normalized email, password hash, and timestamps;
- digested session/CSRF material, expiry, revocation state, and user ownership;
- per-user concept status, confidence, and bounded notes;
- per-user, per-problem, per-language practice evidence; and
- a bounded tutor profile containing learning stage, preferences, strengths, and focus areas.

AlgoVista does not intentionally persist plaintext passwords, raw bearer/session secrets, raw CSRF secrets, tutor conversations, hidden tests, or editor source in the learner profile. Provider requests are transient from AlgoVista's perspective; the selected provider's own logging and retention terms still apply and must be configured separately.

## Implemented controls

### Authentication and sessions

- New passwords are hashed with Node 24's Argon2id implementation using independent random salts and bounded concurrent/queued hashing work; saturation fails closed with HTTP 503 and a short `Retry-After`.
- Supported legacy PBKDF2 hashes are verified in constant time and upgraded after successful authentication.
- A dummy hash is evaluated for unknown emails to reduce account-enumeration timing differences.
- Session values use cryptographic randomness. Only digested session material reaches storage.
- Production sessions use a `Secure`, `HttpOnly`, path-scoped `__Host-` cookie and are revocable individually or across an account.
- Authentication responses expose public user fields, not password hashes or raw cookie values.

### Browser request integrity

- State-changing API requests require a trusted browser `Origin` and a session-bound CSRF token.
- Cross-origin access uses exact normalized origins rather than wildcard credentialed CORS.
- The recommended deployment uses `SameSite=Lax`; the session cookie is inaccessible to application JavaScript.
- Request bodies are JSON-only and size-bounded. Server header, request, keep-alive, provider, and queue limits reduce resource exhaustion.
- Registration, login, coach, and tutor routes have IP/account budgets. Provider concurrency and queue length are bounded.

### Storage isolation

- PostgreSQL foreign keys and composite keys bind concept/practice/profile rows to a user id.
- Repository validation bounds identifiers, text, counters, arrays, dates, statuses, and profile values before persistence.
- Database migrations run transactionally under an advisory lock.
- Local JSON writes use a private file, serialized writes, fsync, and atomic replacement; malformed or oversized state fails closed.

### AI tutoring boundary

- Coach and contextual tutor endpoints require an authenticated session and CSRF validation.
- Provider credentials are server-only and must never be placed in `VITE_*` variables.
- Practice tutoring resolves server-owned canonical problem metadata; client-supplied titles, constraints, solutions, provider settings, and hidden tests are not trusted.
- Code and prior-question sharing are separate explicit choices and request fields are length-bounded.
- Client input cannot authorize solution release. Model output is advisory and cannot directly mark mastery or change deterministic progress.
- Provider failures degrade to a structured local tutor instead of bypassing policy.

### Response and browser hardening

Production responses apply HSTS, content-type sniffing protection, frame denial, restrictive permissions/referrer policies, cross-origin opener/resource policies, and a Content Security Policy. API responses are non-cacheable.

The production CSP permits same-origin scripts, workers, images, fonts, and connections. Inline styles are currently permitted because parts of the learning UI use dynamic style values. Reducing that allowance is a future hardening task.

## Learner-code execution boundary

AlgoVista currently executes only JavaScript practice code. The interactive path uses a one-shot dedicated Web Worker. Trusted messaging and evaluator capabilities stay inside a closure that learner-created functions cannot resolve; network, module-loading, storage, messaging, and evaluator escape hatches are sealed across reachable globals/prototypes before execution. The worker refuses to run if that boundary cannot be established, rejects module syntax again inside the worker, bounds returned values, and is terminated on timeout. If the worker cannot be created, the asynchronous practice runner fails closed and does not fall back to page-realm execution. The Node deployment additionally serves the worker with a `connect-src 'none'`/`worker-src 'none'` CSP as defense in depth; static hosts may not support that response header.

Reference visual traces never evaluate learner source. Their recipes are repository-owned imported functions, so the main application CSP does not need `unsafe-eval`.

This is useful isolation for an educational browser experience, but it is **not a security-equivalent replacement for a hostile-code judge**. It does not provide OS/container isolation, a multi-language compiler boundary, strong memory accounting, hidden cases, or a separate execution origin. Do not run untrusted submissions on the Node application server.

A production multi-language judge should be a separately deployed service with ephemeral sandboxes or microVMs, a non-privileged user, read-only runtime images, no ambient credentials, no network by default, strict CPU/wall-clock/memory/process/output limits, syscall filtering, per-user quotas, signed job/result messages, and aggressive teardown. It should not share the web service's database credentials or cookie origin.

## Known limitations

- Rate limits are process-local. Horizontal scaling requires a shared limiter such as Redis or a gateway/WAF policy.
- Authentication does not yet include verified email, password reset, MFA, compromised-password screening, or account-recovery workflows.
- There is no production-grade multi-language judge or remote hidden-test bank.
- The browser worker is a DOM/availability boundary, not a complete hostile-code sandbox.
- Monaco, the selected language definitions, and its worker are pinned in the lockfile and served from the application origin. The accessible text editor remains a fallback when a browser cannot create the local worker.
- Security event aggregation, immutable audit trails, anomaly detection, and automated incident paging are not yet implemented.
- Model-provider privacy depends on the provider account's contract and retention configuration.
- Backups, restore drills, retention windows, deletion/export procedures, and secret-rotation runbooks are operator responsibilities and must be verified for each deployment.
- Automated tests and dependency audits reduce risk but do not replace threat modeling, code review, penetration testing, or infrastructure review.

## Production checklist

Before accepting real learner accounts:

- [ ] Deploy the built frontend and API on one HTTPS origin.
- [ ] Use managed PostgreSQL through `DATABASE_URL`; never production JSON storage.
- [ ] Generate independent high-entropy `SESSION_DIGEST_PEPPER`, `CSRF_DIGEST_PEPPER`, and `RATE_LIMIT_PEPPER` values.
- [ ] Keep `COOKIE_SAME_SITE=Lax`; enable `TRUST_PROXY=true` only behind the trusted hosting proxy.
- [ ] Leave `FRONTEND_ORIGINS` empty for same-origin operation or set only exact HTTPS origins.
- [ ] Store the provider key only in the server's secret manager and restrict its account/quota.
- [ ] Confirm `/api/health` reports a healthy PostgreSQL adapter.
- [ ] Run `npm run test:ci`, `npm run build`, and `npm run audit:production` from a clean lockfile install.
- [ ] Verify register, login, session restore, logout, logout-all, stale/invalid CSRF, origin rejection, and rate-limit paths in staging.
- [ ] Test database backups and a restore into an isolated environment.
- [ ] Configure log redaction; never log cookies, CSRF values, passwords, editor code, database URLs, or provider keys.
- [ ] Add uptime/error monitoring and alerts for auth failures, provider saturation, database health, and unusual request volume.
- [ ] Arrange an independent security review before storing sensitive or high-value production data.

## Secret rotation and incidents

- Rotating session/CSRF peppers should be treated as a global session invalidation unless a deliberate multi-key migration is implemented.
- Rotate a leaked provider key and database credential at the provider first, then update the deployment secret and redeploy.
- Revoke affected sessions, preserve sanitized evidence, determine the exposure window, and notify impacted users when required.
- Add a regression test for every confirmed vulnerability before closing the incident.
