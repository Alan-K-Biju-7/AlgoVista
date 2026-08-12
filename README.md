# AlgoVista

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff)
![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?logo=node.js&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-production-4169E1?logo=postgresql&logoColor=fff)
[![Static demo](https://img.shields.io/badge/static%20demo-GitHub%20Pages-2EA44F?logo=github)](https://Alan-K-Biju-7.github.io/AlgoVista/)

**AlgoVista is a visual, full-stack DSA learning platform that connects understanding, simulation, deliberate practice, failure diagnosis, and personalized coaching.**

The product is designed around a learning loop, not a problem counter:

1. Build a mental model in a detailed concept lesson.
2. Predict the next state before revealing it.
3. Manipulate the idea in an interactive simulator.
4. Transfer the pattern to an interview problem.
5. Inspect the first failed state, revise, and review later.

![AlgoVista dashboard](docs/assets/algovista-dashboard.svg)

## Product experience

### Visual concept learning

- A guided beginner-to-advanced curriculum with 100+ concept checkpoints.
- Eighteen interactive modules spanning linear structures, trees, heaps, hashing, tries, graphs, shortest paths, searching, and sorting.
- Lessons connect the invariant, a worked trace, complexity, retrieval questions, interview prompts, and the relevant simulator.
- Searchable concept phases and keyboard-accessible controls make it easier to enter at the right level.

![DSA learning path](docs/assets/dsa-path.jpg)

### Practice command center

- A curated 150-problem interview deck with topic, difficulty, status, bookmark, and review filters.
- Daily recommendations, mastery evidence, review queues, Story Mode, progressive hints, submission history, and transferable local progress.
- A resizable code workspace with language-specific drafts, keyboard controls, run/submit states, and a resilient text-editor fallback.
- Test diagnostics identify the first mismatching index or field, compare actual and expected structures, classify likely causes, and suggest the next debugging experiment.
- Contextual tutoring modes include Socratic, Debug, Dry run, Quiz, Complexity, and Review.

![Practice command center](docs/assets/practice-command-center.svg)

The language selector currently provides independent starter templates and drafts for JavaScript, TypeScript, Python, Java, C++, C, C#, Go, Rust, Kotlin, and Swift. **Only JavaScript executes in the browser today.** Other languages are editing mode until a separately isolated multi-language judge is connected. Visible local tests are learning evidence, not a claim that hidden production judge cases passed.

### Failure-first feedback

A failed case is treated as a learning event. AlgoVista shows:

- the verdict and smallest visible failing case;
- the first structural divergence between the learner's value and the expected value;
- a likely failure category such as boundary, state update, early termination, or invariant;
- a focused experiment to run next; and
- an authenticated “Explain this failure” tutor handoff using bounded evidence.

### Interactive simulations

Learners can step, play, pause, reset, change speed, and inspect algorithm state in visual labs. The lesson and simulator share vocabulary so the visualization reinforces the same invariant instead of becoming a disconnected animation.

![Simulator workspace](docs/assets/simulator-workspace.svg)

### Authenticated AI coaching

AI coaching is available only after sign-in. Provider credentials remain on the server; the browser authenticates with an opaque `HttpOnly` session cookie and sends a CSRF token for mutations.

The backend grounds practice tutoring in AlgoVista's canonical problem catalog and the signed-in learner's bounded profile. Complete solutions and hidden tests are withheld by policy. Sharing editor code and prior practice questions requires separate, explicit consent; AlgoVista does not store tutor conversations or raw code in the learner profile.

When no model provider is configured, authenticated learners receive a deterministic local tutor response with the same structured contract. Guests can still use lessons, simulations, and local practice, but AI controls remain locked rather than silently calling a model.

![AI coach](docs/assets/ai-coach.jpg)

## Dedicated tutor model or model API?

AlgoVista currently uses a **dedicated tutoring orchestration layer over a replaceable model provider**. This is the stronger option at this stage than training a foundation model from scratch:

- AlgoVista owns the pedagogy, canonical content, privacy boundary, response schema, hint policy, mastery signals, and evaluations.
- The underlying model can be upgraded or replaced without rewriting the learning product.
- Deterministic visual diagnostics and progress events remain authoritative; model output is advisory.
- The system can collect quality measurements before committing to an expensive training path.

A later fine-tuned tutor may be useful for tone, misconception classification, or response structure, but only after there is a consented, de-identified, high-quality dataset and repeatable safety/learning evaluations. Training a general DSA model from scratch is not required to deliver personalized tutoring and would add substantial cost and risk.

### Adaptive tutor v2

`POST /api/tutor/v2/turn` extends the stable v1 contract with opaque coaching session and attempt identifiers, consumed hint levels, and a learning objective. Responses add a bounded misconception diagnosis, teaching intervention, understanding check, and recommended follow-up. The v1 endpoint remains available during migration.

External retrieval records fail closed unless they carry a license, source URL, revision, and an explicit `grounding` or `evaluation` permitted use. No scraped LeetCode statements, submissions, editorials, or hidden tests are bundled. Model-improvement examples require separate active consent, are de-identified into quarantine, and are excluded from exports until approved; revoked records are excluded from subsequent exports.

## Full-stack architecture

```text
Browser (React + Vite)
  ├─ guest lessons, simulations, drafts and portable local progress
  └─ same-origin /api requests with HttpOnly session cookie + CSRF token
                         │
                         ▼
Node.js application server
  ├─ authentication, sessions, origin checks and rate limits
  ├─ concept/practice progress and bounded tutor profiles
  ├─ canonical tutoring policy and deterministic fallback
  ├─ production static asset serving
  ├──────────────────────────► managed PostgreSQL
  └──────────────────────────► replaceable AI provider (optional)
```

Production uses PostgreSQL with idempotent transactional migrations for users, revocable sessions, concept progress, language-specific practice evidence, and tutor preferences. Local development uses an atomic private JSON adapter when `DATABASE_URL` is absent.

Raw session and CSRF secrets are not stored in the database. Passwords are hashed with Argon2id on Node 24; supported legacy PBKDF2 hashes are upgraded after a successful login.

See [SECURITY.md](SECURITY.md) for trust boundaries, controls, deployment requirements, and known limitations. Security is an ongoing process; this repository does not claim a literal guarantee of zero vulnerabilities.

## Tech stack

- React 19 and React Router 7
- Vite 8 and Vitest 4
- Feature-scoped CSS with responsive, reduced-motion, focus, and high-contrast considerations
- Node.js 24 built-in HTTP/crypto APIs
- PostgreSQL through `pg` in production
- Atomic JSON repository for local development
- Provider-neutral, OpenAI-compatible tutor adapter

## Local setup

Prerequisite: Node.js 24.14.x (the supported engine is declared in `package.json`).

```bash
npm ci
cp server/.env.example server/.env
```

Start the API in one terminal:

```bash
npm run backend
```

Start Vite in a second terminal:

```bash
npm start
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The API and health endpoint are available at [http://127.0.0.1:8787](http://127.0.0.1:8787) and [http://127.0.0.1:8787/api/health](http://127.0.0.1:8787/api/health). Vite proxies `/api` to the backend, so no browser API-base setting is needed locally.

The local database defaults to `server/data/db.json` and is gitignored. Set a dedicated `LOCAL_DATABASE_PATH` when running parallel local instances.

To enable the live provider, put the key only in `server/.env`:

```env
AI_TUTOR_OFFLINE=false
GEMINI_API_KEY=replace_with_your_server_side_key
AI_PROVIDER_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
AI_PROVIDER_MODEL=gemini-3.6-flash
```

Leave the key empty or set `AI_TUTOR_OFFLINE=true` to exercise the deterministic authenticated tutor. Never put provider keys in a `VITE_*` variable: Vite variables are shipped to every browser.

## Important environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string; required whenever `NODE_ENV=production` |
| `LOCAL_DATABASE_PATH` | Atomic JSON database used only when `DATABASE_URL` is absent |
| `SESSION_DIGEST_PEPPER` | Server secret used when digesting session material |
| `CSRF_DIGEST_PEPPER` | Independent server secret for CSRF material |
| `RATE_LIMIT_PEPPER` | Independent secret for privacy-preserving rate-limit identities |
| `SESSION_TTL_DAYS` | Revocable session lifetime; defaults to seven days |
| `COOKIE_SAME_SITE` | Use `Lax` for the recommended same-origin deployment |
| `TRUST_PROXY` | Trust the platform's forwarding headers; enable only behind a trusted proxy |
| `FRONTEND_ORIGINS` | Exact comma-separated allowlist used only for an intentionally separate frontend |
| `PASSWORD_HASH_CONCURRENCY` | Bounds concurrent memory-hard password work |
| `PASSWORD_HASH_QUEUE_LIMIT` | Fails excess password work closed instead of allowing an unbounded queue |
| `AI_DAILY_REQUEST_LIMIT` | Per-account daily tutor/coach budget |
| `AI_PROVIDER_CONCURRENCY` | Maximum simultaneous provider requests |
| `AI_PROVIDER_QUEUE_LIMIT` | Maximum bounded wait queue for provider calls |
| `AI_PROVIDER_TIMEOUT_MS` | Upstream provider deadline |
| `AI_TUTOR_OFFLINE` | Forces deterministic tutor mode when `true` |
| `VITE_API_BASE_URL` | Browser-visible API origin for an intentional split deployment; omit for same-origin |

Use long, independently generated production peppers. Do not reuse a provider key, database password, or cookie secret as another secret.

## Production deployment on Render

[`render.yaml`](render.yaml) defines:

- one Node web service that builds the Vite app, serves it, and handles `/api` on the same origin;
- one managed PostgreSQL database injected through `DATABASE_URL`;
- `Secure`, `HttpOnly`, `SameSite=Lax` production sessions;
- generated session, CSRF, and rate-limit peppers; and
- a manually supplied provider key that never enters the frontend build.

Create a Render Blueprint from the repository, review the selected service/database plans and current pricing, set `GEMINI_API_KEY` if live provider responses are wanted, and deploy. The checked-in Blueprint selects paid starter/database plans suitable for persistent accounts; switch the database to `free` only for disposable evaluation data.

The same-origin topology is intentional. A static site on one domain calling an API on another needs `SameSite=None`, exact credentialed CORS, and browser acceptance of third-party cookies; modern privacy controls make that less reliable. Serve authenticated AlgoVista from the Node service (or same-site custom subdomains) for production.

GitHub Pages, Netlify, and Vercel can still host a static guest demo. They cannot provide durable auth, synced progress, or server-side AI without a separately deployed API. The one-shot JavaScript practice worker keeps trusted capabilities closure-private and refuses execution when its runtime isolation checks cannot be established; the Node deployment adds a worker-specific no-network CSP that a generic static host may not provide. This browser boundary remains an educational runner, not a hostile-code judge. Monaco and its workers are bundled from pinned npm packages and served from the application origin, so the professional editor remains compatible with the strict production script policy; the accessible textarea remains a compatibility fallback. Reference traces use imported repository-owned functions and do not require `unsafe-eval` in the application CSP.

## Verification

Run all frontend, backend, storage, security, and tutor tests:

```bash
npm run test:ci
```

Build the same artifact used by the Node production service:

```bash
npm run build
```

Build a static-host artifact with an SPA `404.html` fallback:

```bash
npm run build:spa
```

Check production dependencies:

```bash
npm run audit:production
```

Test totals are intentionally not hard-coded here; use the command output as the current source of truth.

## Repository map

```text
src/
  components/              auth gates and reusable learning UI
  context/                 in-memory auth/CSRF and learner state
  data/                    curriculum and lesson content
  modules/                 interactive DSA visualizers
  pages/
    practice/              editor, diagnostics, planner, tracer and tutor UI
server/
  index.js                 HTTP API and production static server
  storage/                 PostgreSQL/JSON repository and migrations
  tutor/                   tutoring contract, grounding and pedagogy policy
  security.js              cookies, CORS/origin checks and security headers
docs/assets/               product screenshots and diagrams
render.yaml                same-origin app + managed PostgreSQL Blueprint
```

## Current boundaries and next platform steps

AlgoVista already provides the complete learning flow, durable signed-in profiles, and an authenticated tutor contract. The largest production expansion still required for parity with mature online judges is a separately isolated, quota-controlled judge for non-JavaScript compilation, hidden cases, CPU/memory limits, and hostile-code containment. The browser worker is deliberately not presented as that service.

Other high-value next steps are adding email verification/password reset through a transactional email provider, database backup/restore drills, shared abuse controls, provider-response evaluations, and independent penetration testing before storing high-value production data.

---

<p align="center"><b>AlgoVista — understand the state, then write the code.</b></p>
