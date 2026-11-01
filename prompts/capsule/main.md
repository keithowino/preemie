Configure a architecture-specification document.

The important distinction is that each stage has a different job. The input experience should make describing materials effortless; the results experience should make the ideas easy to compare; and the development experience should make a selected idea actionable.

We should make those three stages excellent before adding accounts, a community, an invention museum, or other secondary features.

## UX and required pages

My recommendation is a small, focused application with three primary screens and one optional supporting page. We should not build a separate page for every feature we might eventually want.

1. Home — /

_Essential_

The entry point and primary conversion screen.

- A clear headline explaining what Preemie does.
- A large materials input area, not merely a single-line text box.
- Example materials users can click to populate the input.
- Optional project constraints such as available tools or skill level, kept secondary.
- One prominent Generate ideas action.

2. Ideas — /ideas/:generationId

_Essential_

The decision-making screen.

- Show the materials submitted.
- Present exactly three differentiated concepts.
- Make the differences between concepts immediately apparent.
- Show feasibility, estimated complexity, required materials, and key caveats.
- Let users open one concept for further development.
- Provide loading, error, retry, and empty states.

3. Project workspace — /ideas/:generationId/:ideaId

_Essential_

The implementation screen.

- Concept overview and design rationale.
- Bill of materials, distinguishing available items from additional requirements.
- Ordered assembly instructions.
- Scientific principles and design trade-offs.
- Safety precautions and validation tests.
- A way to return to the other two concepts.

4. My projects — /projects

_Optional for first release_

A future home for saved and previously generated ideas. Add it to the MVP only if persistence is already straightforward and does not delay the main workflow.

---

Preemie MVP scope

- Materials submission: Text input, validation, optional constraints, example prompts.
- Three AI-generated concepts: Repurpose, Improve, and Invent with a defined response schema.
- Concept comparison: Rationale, feasibility, complexity, required parts, and limitations.
- Detailed build plan: Materials, ordered instructions, scientific principles, safety, and testing.
- Backend AI integration: Server-side API key, request validation, error handling, and basic rate limiting.
- Responsive interface: Loading, error, empty, success, and mobile layouts.

Deferred

- Persistence and accounts
- Generated concept imagery
- PDF export, community, and public gallery

---

> While working on session mng.

## What we should verify

The session lifecycle should satisfy these requirements:

1. Initial application load
    - Show a loading state while restoring the session.
    - If valid session credentials exist, retrieve the current user.
    - If the access token has expired, attempt a refresh and retry the request.
    - If the refresh token is invalid or revoked, clear local credentials and treat the user as unauthenticated.
2. Successful login or registration
    - Save both tokens.
    - Retrieve the authenticated user's profile.
    - Update the identity context.
    - Navigate to the requested destination.
3. Access-token expiration
    - Refresh the session through the shared API infrastructure.
    - Store the rotated tokens.
    - Retry the original request only once.
    - Clear the session if refresh fails.
4. Logout
    - Revoke the current server-side session when possible.
    - Always clear local credentials, even if the server is unavailable.
    - Update the identity context so protected pages are no longer accessible.
5. Concurrent requests
    - Ensure multiple requests encountering an expired access token share a single refresh operation.
    - Prevent failed requests from entering an infinite retry loop.

---

## Token storage

tokenStorage.js stores both tokens in localStorage. This matches the current implementation, although it means JavaScript running on the page can access the refresh token as well as the access token. We might have to migration to an HTTP-only refresh-token cookie.

---
