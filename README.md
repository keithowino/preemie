# PREEMIE

**AI-powered ideation for practical, resource-conscious makers.**

Preemie helps people turn the materials, components, and everyday objects they already have into engineering concepts they can understand, compare, and eventually build.

The product is designed to move beyond a chatbot that lists project ideas. It aims to give users a structured path from **what I have**, to **what I could make**, to **how I could make it**.

> **Project status:** The ideation API and initial idea-comparison experience are implemented. The identity backend is in place, while client-side authentication and the personal project-workspace experience remain under development. See the [roadmap](#phase-based-roadmap) for current status.

[Live demo](https://preemie-three.vercel.app) · [Repository](https://github.com/keithowino/preemie) · [Report a bug or request a feature](https://github.com/keithowino/preemie/issues)

---

## Table of Contents

- [Overview](#overview)
- [Vision](#vision)
- [Core Experiences](#core-experiences)
- [Development and Deployment](#development-and-deployment)
    - [Development Principles](#development-principles)
    - [Current Features](#current-features)
    - [Planned Features](#planned-features)
        - [Identity and Authorization](#1-identity-and-authorization)
        - [Administration](#2-administration)
        - [References and Learning Resources](#3-references-and-learning-resources)
        - [Media and Visual Understanding](#4-media-and-visual-understanding)
        - [Resource Savings and Generation History](#5-resource-savings-and-generation-history)
        - [Preferences and Personalization](#6-preferences-and-personalization)
        - [SEO and Public Pages](#7-seo-and-public-pages)
    - [Phase-Based Roadmap](#phase-based-roadmap)
- [Technology Stack](#technology-stack)
- [Architecture and Project Structure](#architecture-and-project-structure)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Forking and Cloning](#forking-and-cloning)
    - [Environment Configuration](#environment-configuration)
    - [Installing Dependencies](#installing-dependencies)
    - [Running Locally](#running-locally)
    - [Useful Commands](#useful-commands)
- [API Reference](#api-reference)
- [Testing and Quality Checks](#testing-and-quality-checks)
- [Deployment](#deployment)
- [Known Limitations and Security Notes](#known-limitations-and-security-notes)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)
- [Support the Project](#support-the-project)

---

## Overview

Preemie is an AI-assisted making and invention tool. A user records the materials available to them and can add context such as quantities, condition, specifications, goals, environment, skill level, and notes. The server sends the validated input to an AI provider and persists the resulting concepts so they can be retrieved later using a stable generation ID.

Each generation contains three distinct directions:

- **Repurpose** — use existing materials in a different way.
- **Improve** — adapt or improve an existing object or capability.
- **Novel invention** — explore a new solution or use.

The intended experience is practical and educational. Concepts should explain why an approach might work, what it requires, how to assemble it, which scientific principles apply, what assumptions or limitations exist, and what safety considerations matter.

## Vision

Make engineering and invention more approachable by helping people begin with the resources they actually have—not only with a shopping list of parts they do not.

Preemie aims to:

1. **Lower the barrier to making.** Help users discover useful possibilities from ordinary, reused, or overlooked materials.
2. **Encourage informed choices.** Present three meaningfully different concepts and make their trade-offs understandable.
3. **Teach while guiding.** Explain scientific principles, assumptions, limitations, and validation tests instead of presenting build steps without context.
4. **Respect practical constraints.** Account for tools, budget, environment, skill level, and material availability.
5. **Support a complete journey.** Grow from one-off ideation into a personal workspace where users can review, select, and develop projects.
6. **Use AI and external services deliberately.** Prefer useful, verifiable references and lazy-loaded enrichment over unnecessary model calls or eager third-party lookups.

AI-generated instructions are suggestions, not a substitute for qualified engineering review. Users should independently verify structural, electrical, chemical, thermal, and other safety-critical aspects before attempting a build.

## Core Experiences

### 1. Describe what you have

Enter materials and components, including quantities, units, condition, and optional specifications. Add constraints such as the intended goal, working environment, skill level, and notes.

### 2. Explore three alternatives

Preemie generates three concepts—Repurpose, Improve, and Novel Invention—and saves the result. The ideas page retrieves the saved generation rather than depending on transient client state.

### 3. Compare before choosing

The comparison screen presents the original input and the three concepts, including summaries, feasibility, complexity, and required materials. It distinguishes materials already available from additional requirements.

### 4. Develop a selected concept

The planned project workspace will resolve the selected concept from the persisted generation using its `generationId` and concept `ideaId`. It will present the plan, tools, ordered assembly instructions, scientific principles, assumptions, limitations, safety warnings, and validation tests.

### 5. Learn about unfamiliar materials

A planned resource layer will let users request definitions, practical uses, web results, and relevant videos for unfamiliar materials or tools. This enrichment should be loaded when requested, not automatically for every item.

---

# Development and Deployment

## Development Principles

The project is being developed with the following principles:

- **Small, verifiable increments.** Complete and test a workflow-sized change before moving to the next.
- **Architecture before implementation.** Agree on the responsibility and API contract of a new domain before introducing its code.
- **Feature-oriented client organization.** Keep feature-specific pages, components, routes, and API services together.
- **Layered server modules.** Separate routing, controllers, services, repositories, models, validation, and provider integration where those boundaries add clarity.
- **Validate at system boundaries.** Use Zod for request validation and server environment configuration.
- **Centralize API behavior.** Share API configuration and error handling rather than duplicating request logic across components.
- **Treat persisted data as the source of truth.** Dynamic routes should be refreshable and directly navigable; the client should retrieve required data from the API.
- **Use server-state tools intentionally.** TanStack Query is installed and its provider is configured. Feature queries and mutations still need to adopt it where appropriate; the presence of a `QueryClient` alone does not mean the feature is already using React Query.
- **Keep provider integration replaceable.** AI-specific calls are isolated behind a provider boundary so the ideation workflow is not tightly coupled to one vendor.
- **Avoid unnecessary paid calls.** Load optional reference material only when a user asks for it, and evaluate reuse strategies with privacy, consent, correctness, and provenance in mind.
- **Keep secrets out of source control.** Local environment files and production credentials must not be committed.

## Current Features

### Client

- Material editor with quantities, units, condition, and optional specifications.
- Constraint input for goal, environment, skill level, and notes.
- Example starting points to help users begin.
- Ideas comparison route at `/ideas/:generationId`.
- Retrieval of persisted ideation data from the API.
- Exactly three concept cards for a valid generation.
- Display of original materials and constraints, feasibility, complexity, and material requirements.
- Distinct handling for loading, invalid generation IDs, missing generations, and retryable retrieval errors.
- Shared API client with an `ApiError` error surface exposing HTTP status, code, and details.
- Shared application providers for TanStack Query and `react-helmet-async`.

### Server

- Versioned Express API under `/api/v1`.
- Health endpoint that reports API and database status.
- MongoDB persistence through Mongoose for generated ideations.
- Google Gemini integration through the Google GenAI SDK.
- Stable generation IDs for retrieving persisted results.
- Zod request validation and environment validation at startup.
- Centralized asynchronous error handling and consistent response envelopes.
- Request-body size limit.
- Separate configurable rate limits for ideation generation and retrieval.
- Identity backend endpoints for registration, login, refresh, logout, current-user lookup, and session listing/revocation.
- Password hashing, access and refresh tokens, hashed refresh-token storage, and server-side session validation.

The identity API is implemented, but its frontend integration and generation ownership enforcement are not complete. See [Known Limitations and Security Notes](#known-limitations-and-security-notes).

## Planned Features

Items below describe intended work, not functionality that should be assumed to exist today.

### 1. Identity and Authorization

The identity module provides the backend foundation for individual accounts and sessions. The next work is to connect it to the client and make personal project workflows secure.

Planned work:

- Compose an authentication provider into `AppProviders`.
- Build registration and login screens.
- Establish a client-side session lifecycle using the existing refresh endpoint and the agreed token-storage strategy.
- Add protected routes and clear unauthenticated/expired-session states.
- Build a session-management screen to list active sessions and revoke one session or other sessions.
- Associate generations with their owner and enforce ownership at the server/repository boundary.
- Decide how existing anonymous generations should be handled when ownership is introduced.
- Implement password recovery after the email/event-delivery contract and reset-token lifecycle are ready.

**Important:** Client-side route guards improve the user experience, but they are not authorization. The server must enforce access to private generations and workspaces.

### 2. Administration

Potential administration capabilities include:

- User listing and account status management.
- Role assignment for explicitly authorized administrators.
- Session and authentication-event visibility.
- Generation activity and rate-limit monitoring.
- Moderation hooks if public sharing is introduced.

Administration should follow the identity and authorization model. Do not expose administrative actions merely by hiding links in the client.

### 3. References and Learning Resources

A user may be unfamiliar with an additional material, tool, or technique in a generated plan. For example, a concept might require landscape fabric, a material the user has never encountered.

A useful resource panel could offer:

- A concise definition and explanation of typical uses.
- Practical notes on choosing or handling the material.
- A web-search entry point for further research.
- Relevant video results, such as demonstrations of the material in use.
- Links to public build guides or other credible references when a close match exists.

**Recommended approach:** implement this as an explicit, lazy-loaded action inside the selected concept's workspace. Fetch information only when the user expands or requests a material's details. Cache results using a normalized material term and relevant context, and show the source and retrieval time where practical.

This is likely to provide more immediate learning value than generating a decorative image for every concept. It also avoids spending API quota on resources a user never opens. Third-party search and video providers should be chosen after reviewing licensing, availability, attribution requirements, privacy, quotas, and cost.

External references should support—not silently validate—an AI-generated design. A similar-looking public project is evidence that an approach may be possible, not proof that the generated instructions are safe or correct.

### 4. Media and Visual Understanding

The previous version generated concept images and supported uploading images of materials. These capabilities are worth reconsidering, but they solve different problems and should be planned separately.

**A. Community build references**

Search for existing public projects, build write-ups, videos, and demonstrations related to a selected concept. This may offer real-world context at lower cost than generating an image, provided the match is relevant and sources are clearly attributed.

**B. Optional concept visualization**

Allow a user to request an image for a selected concept rather than generating images automatically for all three concepts. This makes the additional latency and model cost explicit and gives users control over when visualization is useful.

**C. Image input for a target object**

Explore letting users upload a photo of an object they want to build or repair. The system could analyze visible components and propose a plan, but it should first clarify the user's goal and ask about hidden dimensions, materials, loads, power sources, or other details that cannot reliably be inferred from a photograph.

Image-based guidance needs explicit uncertainty handling and safety boundaries. A single image is not a reliable basis for structural calculations, electrical specifications, or other safety-critical decisions.

**Suggested order:** build source-linked community references first, then optional visualization, and only then investigate image-based target analysis with a clear validation and safety plan. Image upload, image understanding, and generated imagery are separate capabilities; implementing one does not imply the others are available.

### 5. Resource Savings and Generation History

A repeated request may resemble a generation already stored in the database. Reuse could reduce latency and model costs, but matching inputs is not only a technical problem.

Questions to resolve before implementation:

- **Consent and ownership:** should a user's previous result ever be returned to a different user?
- **Correctness:** identical materials can be used for different goals, skill levels, environments, and constraints.
- **Freshness:** an older result may no longer meet the user's needs or may have been generated under a different prompt/schema.
- **Provenance:** the UI must disclose when a result is reused rather than newly generated.
- **Privacy:** a cache key must not reveal sensitive user input, and cross-user reuse must not expose private data.

**Recommended first step:** offer an opt-in, per-user reuse option after accounts and ownership are implemented. Show the matching prior generation and let the user choose whether to reuse it. Defer cross-user reuse until there is a clear consent, anonymization, retention, and provenance policy.

Generation history and saved projects should be designed with account ownership rather than bolted on as client-only lists.

### 6. Preferences and Personalization

Potential preferences include:

- Preferred units and display conventions.
- Default skill level, working environment, and available tools.
- Accessibility and presentation preferences.
- Saved material inventories or frequently used constraints.
- Preferred learning format, such as concise explanations, diagrams, or video references.
- Optional controls for resource lookup and concept visualization.

Begin with preferences that materially improve repeated workflows. Store account-specific preferences on the server once authentication and ownership are established; avoid collecting personal information that is not needed for the product.

### 7. SEO and Public Pages

- Route-specific titles, descriptions, and Open Graph metadata using the existing head-management provider.
- Prerendering or static generation for suitable public pages.
- `sitemap.xml` and `robots.txt` configuration.
- Explicit exclusion of private generation and workspace routes from indexing.
- A clear decision about which pages, if any, are public and shareable.

SEO work should follow the product's privacy and route-access decisions rather than making private user content indexable.

## Phase-Based Roadmap

Phases are tracked by capability. A checked item means the corresponding implementation is reported as complete; it does not mean the entire phase or the application has been released as production-ready.

### Phase 1 — Project foundation

- [x] Establish the client/server project structure and development tooling.
- [x] Establish the initial API and application foundation.

### Phase 2 — Ideation contract and generation

- [x] Define and validate ideation input and output.
- [x] Generate three distinct concept types.
- [x] Isolate Gemini integration behind a provider boundary.

### Phase 3 — Persistence and retrieval

- [x] Persist generated ideations in MongoDB.
- [x] Assign a stable `generationId`.
- [x] Retrieve a persisted generation by ID.

### Phase 4 — API hardening

- [x] Centralize request validation and error handling.
- [x] Validate server environment configuration at startup.
- [x] Apply request-body limits and configurable ideation rate limits.
- [x] Add automated service/controller/integration tests for key success and failure paths.

### Phase 5 — Ideas comparison page _(partially complete)_

- [x] Fetch `GET /api/v1/ideations/:generationId`.
- [x] Display the original materials and constraints.
- [x] Render exactly three concept cards.
- [x] Compare concept type, summary, feasibility, complexity, and required materials.
- [x] Distinguish available materials from additional requirements.
- [x] Support loading, error, retry, and invalid-generation states.
- [ ] Link each concept card to its project workspace.

**Deliverable:** users can understand the alternatives and select a concept.

### Phase 6 — Project workspace _(not yet implemented)_

- [ ] Resolve the selected concept using `generationId` and `ideaId`.
- [ ] Confirm that `ideaId` identifies the concept's `id` in the persisted `concepts` array.
- [ ] Present rationale, feasibility, and complexity.
- [ ] Display the bill of materials and tools.
- [ ] Render ordered assembly instructions and checkpoints.
- [ ] Explain scientific principles, assumptions, and limitations.
- [ ] Highlight safety warnings and validation tests.
- [ ] Provide navigation back to the other concepts.
- [ ] Add lazy-loaded references for unfamiliar materials after the core workspace is stable.

The workspace can derive its concept from the retrieved parent generation; a separate concept endpoint is not required by the current contract.

**Deliverable:** users can follow a structured project plan for their selected concept.

### Phase 7 — Integration testing and responsive refinement _(remaining work)_

- [ ] Test the full successful generation and retrieval journey.
- [ ] Test invalid inputs, missing generations, provider failures, and API failures.
- [ ] Verify refresh and direct navigation on both dynamic routes.
- [ ] Check smaller screens, keyboard navigation, and visible focus states.
- [ ] Confirm failures do not leave stale or misleading results visible.
- [ ] Run ESLint and production builds.
- [ ] Add client integration tests for the actual query/mutation behavior as the frontend adopts TanStack Query.

**Deliverable:** a verified end-to-end frontend experience.

### Phase 8 — Documentation and release readiness _(in progress)_

- [x] Record the current architecture, API, setup, and roadmap in the root README.
- [ ] Document the final frontend feature organization as it evolves.
- [ ] Verify environment-variable documentation against both `.env.example` files.
- [ ] Verify installation, development, lint, test, and build commands.
- [ ] Verify production routing and deployment configuration.
- [ ] Record known limitations and operational requirements.

**Deliverable:** a documented, deployable MVP.

### Phase 9 — Identity domain integration _(backend implemented; client integration pending)_

- [x] Registration, login, refresh, and logout endpoints.
- [x] Current-user endpoint.
- [x] Session listing and individual/other-session revocation endpoints.
- [x] Access-token middleware with server-side session validation.
- [x] Password hashing and hashed refresh-token storage.
- [ ] Client authentication provider composed into `AppProviders`.
- [ ] Login and registration screens.
- [ ] Session lifecycle and protected-route behavior.
- [ ] Session-management UI.
- [ ] Ownership enforcement for generations and workspace data.
- [ ] Password recovery flow after the email/reset-token workflow is enabled.
- [ ] Tests for authenticated and unauthorized access to owned resources.

**Deliverable:** personal, access-controlled user workflows backed by server-side authorization.

### Phase 10 — References, media, and resource savings _(planned)_

- [ ] Lazy-loaded material definitions and learning resources.
- [ ] Source-linked community build references.
- [ ] Optional concept visualization.
- [ ] Evaluate image input for target-object analysis.
- [ ] Per-user generation history and opt-in reuse.
- [ ] Define consent, provenance, caching, and retention policies before any cross-user reuse.

### Phase 11 — SEO and administration _(planned)_

- [ ] Route-specific metadata and Open Graph tags.
- [ ] Prerendering/static generation for suitable public pages.
- [ ] Sitemap and robots strategy.
- [ ] Admin authorization and user-management tools.
- [ ] Operational visibility for sessions, generation activity, and rate limits.

---

## Technology Stack

### Client

| Concern                | Technology                                                         |
| ---------------------- | ------------------------------------------------------------------ |
| UI                     | React 19                                                           |
| Build tool             | Vite                                                               |
| Routing                | React Router DOM 7                                                 |
| Server-state library   | TanStack Query 5 _(provider configured; feature adoption pending)_ |
| Styling                | Tailwind CSS 3                                                     |
| Animation              | GSAP                                                               |
| Document metadata      | `react-helmet-async`                                               |
| Input validation       | Zod                                                                |
| Utility/class handling | `clsx`, `tailwind-merge`                                           |
| Linting                | ESLint 10                                                          |
| Hosting                | Vercel                                                             |

### Server

| Concern                   | Technology                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Runtime                   | Node.js, ES modules                                                                                                   |
| HTTP framework            | Express 5                                                                                                             |
| Database                  | MongoDB                                                                                                               |
| ODM                       | Mongoose                                                                                                              |
| AI provider               | Google GenAI SDK (`@google/genai`) / Gemini                                                                           |
| Validation                | Zod                                                                                                                   |
| Authentication            | JWT access and refresh tokens                                                                                         |
| Password hashing          | `bcrypt`                                                                                                              |
| Rate limiting             | `express-rate-limit`                                                                                                  |
| File/media infrastructure | Cloudinary integration dependencies are present; product upload workflows are not yet documented as a shipped feature |
| Request metadata          | `ua-parser-js`                                                                                                        |
| Development runner        | Nodemon                                                                                                               |
| Testing                   | Node.js built-in test runner                                                                                          |

Versions listed here reflect the project's current package manifests and may evolve. Check `client/package.json` and `server/package.json` for the installed dependency ranges.

## Architecture and Project Structure

The client uses a **feature-module** structure. Feature-specific pages, components, routes, and API services live together; shared UI, API infrastructure, configuration, and utilities live under `client/src/lib` or `client/src/app`.

The server uses **layered feature modules**. Routes map endpoints to controllers; controllers validate and translate HTTP requests; services orchestrate business workflows; repositories handle persistence; models define stored data; and the AI provider is isolated behind a service boundary.

```text
preemie/
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/          # Client environment configuration
│   │   │   ├── providers/       # QueryClient, Helmet, future auth provider
│   │   │   └── router/          # Application route configuration
│   │   ├── lib/
│   │   │   ├── api/             # Shared API client and error contract
│   │   │   ├── components/      # Shared layouts and UI primitives
│   │   │   ├── config/          # Platform metadata
│   │   │   └── utils/           # Shared validation and styling helpers
│   │   └── modules/
│   │       └── ideations/       # Input form, ideas page, routes, API service
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
├── server/
│   ├── src/
│   │   ├── app/
│   │   │   ├── bootstrap/       # Database connection
│   │   │   ├── config/          # Environment, CORS, rate limits
│   │   │   ├── lib/             # Errors, validation, HTTP helpers
│   │   │   └── routes/          # Versioned API router
│   │   └── modules/
│   │       ├── ideations/       # Controllers, models, provider, repository,
│   │       │                    # routes, service, and validators
│   │       └── identity/        # Auth controllers, middleware, models,
│   │                            # presenters, repositories, security, services
│   ├── tests/
│   │   ├── rest/                # VS Code REST Client request files
│   │   └── unit/                # Automated tests
│   ├── .env.example
│   └── package.json
├── config/                      # Project tooling/configuration
├── package.json                 # Root workspace scripts, if configured
└── README.md
```

This is a high-level map, not an exhaustive file listing. Consult the source tree for the exact current structure.

---

# Getting Started

## Prerequisites

Install or arrange the following before starting:

- **Node.js** compatible with the installed Vite version. Use a current supported LTS release; check Vite's current requirements if you are setting up a new machine.
- **npm**, included with Node.js.
- **MongoDB**, running locally or through a managed deployment.
- A **Google Gemini API key** for ideation generation.
- A **Cloudinary account and credentials** because the server environment schema currently requires them, even though a complete user-facing upload workflow is not part of the current ideation experience.
- **Git**.
- A code editor such as Visual Studio Code.

The exact minimum Node.js version can change with dependency updates. Check the package manifests and the installed Vite documentation if installation reports a runtime-version error.

## Forking and Cloning

1. Open the [Preemie repository](https://github.com/keithowino/preemie).
2. Select **Fork** in GitHub to create your own copy.
3. Clone your fork. Replace `<your-username>` with your GitHub username:

```bash
git clone https://github.com/<your-username>/preemie.git
cd preemie
```

4. Keep the original repository as an upstream remote if you plan to contribute back:

```bash
git remote add upstream https://github.com/keithowino/preemie.git
git remote -v
```

If you only want to run the project without maintaining a fork, clone the original repository instead:

```bash
git clone https://github.com/keithowino/preemie.git
cd preemie
```

## Environment Configuration

The server loads `.env.<NODE_ENV>` and validates its environment at startup. For local development, create `server/.env.development` using the example below, or copy `server/.env.example` and fill in the values. Create `client/.env.development` for the Vite client.

Do not commit real credentials. Use separate credentials and configuration for development, testing, and production.

### Server environment

**File:** `server/.env.development`

```dotenv
NODE_ENV=development
PORT=5000
REQUEST_BODY_LIMIT=64kb

MONGODB_URI=mongodb://localhost:27017/preemie
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_ACCESS_SECRET=replace_with_a_random_secret_at_least_32_characters
JWT_REFRESH_SECRET=replace_with_a_different_random_secret_at_least_32_characters
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=7d
JWT_ISSUER=preemie-three
JWT_AUDIENCE=preemie-three-client

IDEATION_GENERATION_RATE_LIMIT_MAX=5
IDEATION_GENERATION_RATE_LIMIT_WINDOW_MS=900000
IDEATION_RETRIEVAL_RATE_LIMIT_MAX=60
IDEATION_RETRIEVAL_RATE_LIMIT_WINDOW_MS=900000
```

The values above are a local-development template. Use strong, independently generated JWT secrets and production-appropriate limits in deployed environments. The model name is configurable; use a model available to your Google AI project.

### Client environment

**File:** `client/.env.development`

```dotenv
VITE_API_URL=http://localhost:5000
```

The shared API client uses this base URL and the server mounts routes under `/api/v1`. Do not append `/api/v1` to `VITE_API_URL` unless the API client implementation is changed to expect that format.

### Environment files

- `server/.env.example` — canonical server variable reference.
- `client/.env.example` — canonical client variable reference.
- `server/.env.development` and `client/.env.development` — local development values.
- Production environment variables should be configured through the hosting platform's secret/environment settings.

If startup reports missing or malformed configuration, compare your local file with the corresponding `.env.example` and the server's environment schema.

## Installing Dependencies

Install the server and client dependencies separately:

```bash
# From the repository root
npm --prefix server install
npm --prefix client install
```

Or install from each directory:

```bash
cd server
npm install

cd ../client
npm install
```

## Running Locally

Ensure MongoDB is running and the server environment is configured.

Open two terminals from the repository root.

**Terminal 1 — API server**

```bash
cd server
npm run dev
```

The API listens on `http://localhost:5000` by default.

Health check:

```text
GET http://localhost:5000/api/v1/health
```

The response reports API status and database connectivity.

**Terminal 2 — client**

```bash
cd client
npm run dev
```

The Vite development server is configured for `http://localhost:3000` in the documented local setup. If Vite reports a different port, use the address shown in the terminal and ensure `CLIENT_URL` on the server permits that origin.

Open the client in your browser and submit a sample material set to test ideation generation. Generation requires a working MongoDB connection and a valid Gemini API key.

## Useful Commands

Run commands from the relevant directory.

| Directory | Command                 | Purpose                               |
| --------- | ----------------------- | ------------------------------------- |
| `server/` | `npm run dev`           | Start the API with Nodemon            |
| `server/` | `npm start`             | Start the API                         |
| `server/` | `npm run traceWarnings` | Start Node with warning traces        |
| `server/` | `npm test`              | Run the Node.js test runner           |
| `server/` | `npm run apiConnection` | Run the API connection smoke test     |
| `server/` | `npm run modelSupport`  | Check configured Gemini model support |
| `client/` | `npm run dev`           | Start the Vite development server     |
| `client/` | `npm run build`         | Create a production client build      |
| `client/` | `npm run preview`       | Preview the production build locally  |
| `client/` | `npm run lint`          | Run ESLint                            |

The repository root may have additional scripts. Check the root `package.json` before assuming a root-level command exists.

---

## API Reference

All API endpoints are prefixed with `/api/v1`. Responses use a shared `{ success, data, message }` envelope where applicable.

### Health

| Method | Path      | Description                     | Authentication |
| ------ | --------- | ------------------------------- | -------------- |
| `GET`  | `/health` | Reports API and database status | Public         |

### Ideations

| Method | Path                       | Description                                                     | Authentication                            |
| ------ | -------------------------- | --------------------------------------------------------------- | ----------------------------------------- |
| `POST` | `/ideations`               | Validate input, generate three concepts, and persist the result | No user authentication currently enforced |
| `GET`  | `/ideations/:generationId` | Retrieve a persisted generation by its ID                       | No user authentication currently enforced |

Generation accepts materials and optional constraints according to the server's Zod schema. The generated result includes three distinct concept types, feasibility information, complexity, a bill of materials, tools, ordered build steps, scientific principles, assumptions, limitations, safety warnings, and tests.

**Important:** because ownership enforcement is not complete, a generation ID should not be treated as an authorization mechanism for private data. Do not store sensitive information in ideation input.

### Authentication

The following routes are mounted under `/api/v1/auth`.

| Method   | Path                        | Description                                               | Authentication |
| -------- | --------------------------- | --------------------------------------------------------- | -------------- |
| `POST`   | `/auth/register`            | Create an account and issue tokens                        | Public         |
| `POST`   | `/auth/login`               | Authenticate and issue tokens                             | Public         |
| `POST`   | `/auth/refresh`             | Rotate a refresh token and issue a new token pair         | Refresh token  |
| `POST`   | `/auth/logout`              | Revoke the presented refresh-token session                | Refresh token  |
| `GET`    | `/auth/me`                  | Return the current user                                   | Access token   |
| `GET`    | `/auth/sessions`            | List active sessions                                      | Access token   |
| `DELETE` | `/auth/sessions/:sessionId` | Revoke one of the current user's sessions                 | Access token   |
| `DELETE` | `/auth/sessions`            | Revoke other sessions while retaining the current session | Access token   |

Authenticated routes use `Authorization: Bearer <accessToken>` where required. The refresh and logout request bodies follow the server's current request schemas; consult `server/tests/rest/auth.rest` for complete, current request examples.

The password-recovery route is not enabled yet. API availability does not imply that the corresponding client screens or personal-workspace authorization have shipped.

---

## Testing and Quality Checks

### Automated tests

Run the server test suite:

```bash
cd server
npm test
```

Tests use Node.js's built-in test runner. Review the test output rather than relying on a previously reported test count, since coverage changes as features are added.

### REST verification

REST request files are kept under `server/tests/rest/` and are intended for use with the **REST Client extension in Visual Studio Code**.

- `server/tests/rest/ideation.rest`
- `server/tests/rest/auth.rest`

Open a request file in VS Code and use the extension's **Send Request** action. Check status codes, response envelopes, validation errors, and persisted retrieval behavior.

### Client quality checks

```bash
cd client
npm run lint
npm run build
```

Before treating a release as ready, verify the full workflow—not just individual API calls—including generation, retrieval, direct navigation, refresh, failure states, accessibility basics, and smaller-screen layouts.

---

## Deployment

The client and API are separate deployable applications. Configure their origins and environment variables consistently.

### Client — Vercel

The live demo is hosted at [preemie-three.vercel.app](https://preemie-three.vercel.app).

For a deployment from this repository:

1. Import the repository into Vercel.
2. Set the project root/build configuration to the `client/` application.
3. Configure `VITE_API_URL` to the deployed API's origin, without adding `/api/v1` when using the current shared API-client convention.
4. Confirm that the SPA routing configuration in `client/vercel.json` supports direct navigation and refresh on routes such as `/ideas/:generationId`.
5. Redeploy after changing environment variables.

### Server — Node.js host

Deploy `server/` to a host that supports the Node.js application and its required environment variables. Suitable options may include Render, Railway, Fly.io, or a VPS; availability, pricing, and deployment details vary by provider.

Configure at least the variables required by `server/src/app/config/env.js`, including the MongoDB URI, Gemini key/model, Cloudinary credentials, JWT settings, client origin, and rate limits. Set `NODE_ENV=production` and use strong production secrets.

Set `CLIENT_URL` to the actual deployed frontend origin so the server's CORS configuration permits the client. Confirm the host's start command uses the server package's `npm start` script or its equivalent.

### Database — MongoDB

Use a managed MongoDB deployment or a properly secured self-managed instance. For production:

- Use credentials dedicated to the application with least-privilege access.
- Restrict network access to trusted sources where the hosting platform permits it.
- Keep backups and define a retention policy.
- Monitor connection failures and storage usage.
- Never expose database credentials to the browser.

### Release checks

- [ ] Production environment variables are configured and validated.
- [ ] The API health endpoint reports the expected database status.
- [ ] The deployed frontend can reach the deployed API.
- [ ] CORS permits the intended frontend origin only.
- [ ] Dynamic frontend routes work on direct navigation and refresh.
- [ ] Secrets and local environment files are excluded from source control.
- [ ] Authentication and ownership behavior has been verified before private user data is introduced.
- [ ] Lint, build, and relevant automated/REST tests pass.

---

## Known Limitations and Security Notes

- **Authentication is not fully integrated into the client.** The server identity routes exist, but login/register screens, client session lifecycle, protected routes, and session-management UI are still planned.
- **Generation ownership is not enforced yet.** Current ideation retrieval is not restricted to the user who created the generation. Anyone who knows a generation ID may be able to retrieve it. Treat generation IDs as identifiers, not access controls, and avoid sensitive input.
- **TanStack Query is configured but not yet used by the ideation pages.** `AppProviders` creates a shared `QueryClient` with cache and retry defaults, but the current ideas page uses manual fetching. Migrate feature reads and mutations to `useQuery`/`useMutation` deliberately and verify that `ApiError.status` drives the intended retry policy.
- **Password recovery is not shipped.** The related flow remains commented out pending the email delivery/event and reset-token implementation.
- **The project workspace is not implemented.** Concept cards do not yet complete the selection-to-build-plan journey.
- **Generation requests are not guaranteed to be idempotent on client timeout.** A client timeout does not prove that the server stopped processing or that persistence did not happen. Do not automatically retry a generation POST after an ambiguous timeout until an idempotency strategy is implemented.
- **Reference lookup, community build discovery, concept visualization, and image-based target analysis are planned, not current features.**
- **Cloudinary configuration is currently required by server environment validation.** Do not assume this means a complete upload feature is available in the UI.
- **AI output can be incomplete or wrong.** Review feasibility, materials, calculations, and safety-critical steps independently. Do not use generated instructions as a substitute for professional review where injury, fire, electrical hazards, structural loads, chemicals, or other serious risks are involved.
- **Third-party services have their own costs, quotas, privacy policies, and terms.** Review these before enabling optional lookup, media, or AI features in production.

## Contributing

Contributions, bug reports, and design discussions are welcome.

1. Fork the repository and create a focused branch from `main`.
2. Open an issue first for larger changes, new domains, schema changes, or API-contract changes.
3. Follow the existing client feature-module and server layered-module conventions.
4. Add or update tests for behavior changes.
5. Run `npm test` in `server/`, and `npm run lint` plus `npm run build` in `client/`.
6. Open a pull request explaining the motivation, implementation, and verification performed.

Keep pull requests small enough to review. Avoid introducing parallel abstractions when an existing module can be extended cleanly.

## License

**Proprietary.** Copyright © Pickaxe & Shovel. All rights reserved.

This repository is public for review and reference. No permission is granted to use, copy, modify, or distribute the code, in whole or in part, without prior written consent from the copyright holder. Forking the repository on GitHub does not override these terms.

## Acknowledgments

- **ChatGPT** — primary LLM assistance for development guidance, architecture discussions, and debugging.
- **DeepSeek** — secondary LLM assistance for extended reasoning and consistency checks.
- **Bolt.new** — a potential tool for accelerated prototyping and experimentation.
- **Render and Vercel** — hosting platforms considered or used across development and deployment workflows.
- **Google Gemini** — the AI model provider currently integrated for ideation generation.
- **Open-source community** — the maintainers and contributors behind the libraries and tools that make this project possible.

Tools and platforms listed here are acknowledged for their role or potential role in the project; this is not an endorsement or claim of partnership.

## Contact

**Keith Owino — Pickaxe & Shovel**

- **Email:** [designsolutions1629@gmail.com](mailto:designsolutions1629@gmail.com)
- **GitHub:** [@keithowino](https://github.com/keithowino)
- **Portfolio:** [Pickaxe & Shovel](https://pickaxe-and-shovel.vercel.app)
- **Live demo:** [Preemie](https://preemie-three.vercel.app)

## Support the Project

If Preemie is useful or interesting to you:

- Star the [GitHub repository](https://github.com/keithowino/preemie).
- Report bugs or request features through [GitHub Issues](https://github.com/keithowino/preemie/issues).
- Share feedback about the ideation workflow and project roadmap.
- Contribute code, tests, documentation, or design feedback.
- Share the project with makers, students, educators, and practical problem-solvers.

For business inquiries, collaborations, or permissions relating to this proprietary repository, contact the email address above.
