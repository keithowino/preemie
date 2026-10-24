Each phase should be completed and verified before moving to the next.

## Phase 1 — Frontend architecture and dependencies ( presumed to be complete )

Start here

Establish the frontend foundation without building the screens yet.

Before installing packages or creating feature files, inspect the current client/src/app exports, environment configuration, and existing lint/build results. This will establish the exact changes needed without disturbing the working setup.

- Confirm the existing src/app exports and routing conventions.
- Decide where API configuration, API functions, shared components, layouts and feature pages belong.
- Install and configure @tanstack/react-query.
- Configure a shared QueryClient through AppProviders.jsx.
- Define route-level loading and error handling responsibilities.
- Verify the existing Vite build and ESLint checks.
  Deliverable: A stable frontend foundation ready for feature implementation.

## Phase 2 — Visual foundation and application shell ( presumed to be complete )

Establish the visual identity before adding complex interactions.

A. Visual direction: industrial editorial

Preemie should feel like an engineering notebook combined with a modern product-design studio. The interface should emphasize materials, practical experimentation, feasibility and build instructions rather than resemble a generic AI dashboard.

- Define the Sage, Signal Orange, Graphite and Warm Canvas palette.
- Configure typography using Inter and Manrope.
    - decisions:
        - Manrope: Display headings and prominent page titles.
        - Inter: Body text, form labels, navigation, metadata and controls.
        - System fallbacks: Keep text readable if web fonts cannot load.

- Establish reusable buttons, inputs, cards, badges, spacing and focus states.
- Build the shared application layout and responsive navigation.

```text
client/src/lib/components/
├── layouts/
│   ├── AppShell.jsx
│   ├── AppHeader.jsx
│   └── AppFooter.jsx
├── ScrollToTop.jsx
└── index.js
```

- Update index.css, tailwind.config.js and the HTML metadata where necessary.
  Deliverable: A consistent, responsive design system with an application shell.

## Phase 3 — Home page and input experience ( covered )

Build the first complete user-facing screen.

Create response: The supplied example demonstrates the retrieval response, not the complete response returned by POST. Confirm its envelope and generation ID location before implementing navigation.

- Create the headline, introduction and primary call to action.
- Implement a repeatable materials editor with name, quantity, unit and condition.
- Add goal, environment, skill level and notes inputs.
- Provide selectable example material sets.
- Validate the input before submitting it.
- Handle submission state and prevent accidental duplicate requests.
  Deliverable: Users can prepare valid ideation requests through the interface.

## Phase 4 — API integration and generation flow ( covered )

Connect the form to the existing backend.

- Create a centralized HTTP/API client using the configured API base URL.
- Implement the POST /api/v1/ideations request.
- Validate the response shape needed by the frontend.
- Extract generationId from the successful response.
- Navigate to /ideas/:generationId.
- Handle validation errors, rate limits, provider failures, network errors and timeouts.
  Deliverable: A submitted form creates a persisted generation and navigates to its results.

## Phase 5 — Ideas comparison page ( partially covered )

Implement the decision-making screen using persisted API data.

- Fetch GET /api/v1/ideations/:generationId.
- Display the original materials and constraints.
- Render exactly three concept cards.
- Compare concept type, summary, feasibility, complexity and required materials.
- Distinguish available materials from additional requirements.
- Link each card to its project workspace.
- Support loading, error, retry and invalid-generation states.
  Deliverable: Users can understand the alternatives and select a concept.

## Phase 6 — Project workspace

Turn the selected concept into an actionable build guide.

Concept selection: The workspace route identifies a concept by ideaId. Confirm that this is the concept's id in the persisted concepts array, and derive the workspace from the retrieved generation. A separate concept API endpoint is not required by the supplied contract.

- Resolve the requested concept using generationId and ideaId.
- Present its rationale, feasibility and complexity.
- Display the bill of materials and tools.
- Render ordered assembly instructions and checkpoints.
- Explain scientific principles, assumptions and limitations.
- Highlight safety warnings and validation tests.
- Provide navigation back to the other concepts.
  Deliverable: Users can follow a structured project plan based on the selected concept.

## Phase 7 — Integration testing and responsive refinement

Verify the complete workflow rather than only individual components.

- Test successful generation and retrieval.
- Test invalid inputs, missing generations and API failures.
- Verify refresh and direct navigation on both dynamic routes.
- Check smaller screens, keyboard navigation and visible focus states.
- Confirm that API failures do not leave stale or misleading results.
- Run ESLint and production builds.
  Deliverable: A verified end-to-end frontend experience.

## Phase 8 — Documentation and release readiness

- Document frontend architecture and feature organization.
- Document environment variables and API configuration.
- Record installation, development, lint and build commands.
- Update the project README and known limitations.
- Verify production routing and deployment configuration.
  Deliverable: A documented, deployable MVP.

---

React Query should manage server state, caching, loading and error states. Local form state should manage the materials editor and unsent constraints. We should not duplicate retrieved generations in a separate global state store.

---

## Route-level loading and error responsibilities

We should distinguish between navigation errors, data-fetching errors and form-submission errors. They have different causes and should not all be handled by one generic loading screen.

| Situation                           | Where it belongs      | Expected behavior                                                          |
| ----------------------------------- | --------------------- | -------------------------------------------------------------------------- |
| Initial page navigation             | Route/page            | Render the requested page                                                  |
| Generation submission               | Home page             | Show submission progress and disable duplicate submissions                 |
| Loading a generation                | Ideas page            | Show a skeleton or loading indicator                                       |
| Generation not found                | Ideas page            | Explain that the generation could not be found and provide navigation home |
| Retrieval network/server failure    | Ideas page            | Show a recoverable error and a retry action                                |
| Loading a selected concept          | Workspace page        | Show workspace loading state while retrieving the generation               |
| Invalid concept ID                  | Workspace page        | Explain that the requested concept was not found                           |
| Unexpected rendering or route error | Router error boundary | Render a controlled fallback rather than a blank screen                    |

React Query will manage asynchronous query states, but it does not replace route-level error handling.

When we implement the routes, React Router's errorElement or equivalent route error-boundary mechanism can handle unexpected route errors. Expected API failures should remain within the relevant page so that users can retry without losing their context.
