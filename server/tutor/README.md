# AlgoVista Tutor Engine

Provider-neutral preparation and response handling for a personalized DSA tutor. This module does not call a model, read environment variables, persist data, or mutate learner progress.

## Integration

```js
const {
  TutorInputError,
  createOfflineTutorResponse,
  resolveCanonicalProblem,
  normalizeProviderResponse,
  prepareTutorTurn,
} = require('./tutor');

const clientProblem = requestBody.context?.problem || {};
const canonicalProblem = resolveCanonicalProblem(clientProblem);
if (!canonicalProblem) {
  // Reject unknown problem ids before invoking a provider.
}

// Canonical metadata is spread last so client title/difficulty/pattern values
// cannot override the server-owned catalog.
const groundedBody = {
  ...requestBody,
  context: {
    ...requestBody.context,
    problem: { ...clientProblem, ...canonicalProblem },
  },
};

let turn;
try {
  turn = prepareTutorTurn(groundedBody, {
    // Derive this only from authenticated, deterministic server-side state.
    allowSolution: solutionReleaseAuthorized,
  });
} catch (error) {
  if (error instanceof TutorInputError) {
    // Return error.status and error.code to the API caller.
  }
  throw error;
}

// `messages` uses plain system/user/assistant roles and is not tied to one SDK.
const rawProviderResponse = await provider.generate({
  messages: turn.messages,
  responseSchema: turn.responseSchema,
});

const response = normalizeProviderResponse(
  rawProviderResponse,
  turn.request,
  turn.grounding
);

// When no provider is configured:
const offline = createOfflineTutorResponse(turn.request, turn.grounding);
```

## Request shape

```js
{
  question: 'Why does this case fail?',
  mode: 'debug', // socratic | debug | dry-run | quiz | complexity | review
  hintLevel: 1,
  privacy: {
    shareCode: false,
    shareHistory: true, // explicit opt-in; only prior user messages are accepted
    retainConversation: false
  },
  context: {
    lesson: { id, title, section, summary, facts: [{ id, text }] },
    problem: {
      id, title, difficulty, description, pattern, invariant,
      constraints, examples, facts
    },
    execution: {
      language, verdict, error, firstMismatch, failedCase,
      code // included only when privacy.shareCode is exactly true
    },
    learner: {
      stage, mastery, dueForReview, weaknesses,
      conceptProgress, practiceRecord
    }
  },
  history: [{ role: 'user', content: '...' }]
}
```

Unknown properties such as names, emails, provider settings, hidden tests, and reference solutions are not copied into normalized context. Code and user-message history sharing are separate, explicit opt-ins. Assistant and system history supplied by a client is discarded. Question, history, fact, diagnostic, and code lengths are bounded.

There is intentionally no client solution-control field. A client-supplied `allowSolution` is ignored by the normalizer and should be rejected by the HTTP contract. Only the second, server-owned argument to `prepareTutorTurn(input, { allowSolution: true })` can authorize an explanation after the application has verified its deterministic release policy.

`loadCanonicalProblemCatalog()` returns defensive copies of all `{ id, title, difficulty, pattern }` records loaded from the NeetCode JSON and the 150 server-owned practice source modules. `resolveCanonicalProblem(idOrObject)` returns the same four canonical fields for an exact known id, or `null`; it never returns client-supplied metadata. The source parser reads scalar metadata without executing the frontend ES modules.

The returned `masterySignal` is advisory. The API layer should update learner progress only from deterministic product events or explicit learner actions, never directly from a model response.
