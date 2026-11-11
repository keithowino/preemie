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

```js
import { isValidPhoneNumber } from "react-phone-number-input";

z.string().refine(
	(value) => !value || isValidPhoneNumber(value),
	"Enter a valid phone number",
);
```

That's stronger validation — it catches "+441" — but it depends on a library that has its own opinions about what's valid, and it returns true/false without telling you why a number failed, so the error message stays generic.

## Phase 9: Ownership enforcement roadmap

One particular issue with the existing routing deserves attention.

ideation.routes.js currently registers creation, listing and retrieval without authentication middleware. Although the frontend workspace routes are protected, that does not protect the backend API.

We must secure the backend independently.

### Stage 1 — Ownership architecture and data modelling (covered)

- Introduce ownership into the Ideation model.
- Establish ownership rules for existing and future generations.
- Define the account preferences structure.
- Identify which resources belong to the user.
- Define authorization and resource-access policies.

### Stage 2 — Backend ideation ownership (covered)

- Require authentication when creating ideations.
- Associate every new ideation with req.user.\_id.
- Restrict retrieval to the owner.
- Implement authenticated listing with pagination.
- Implement deletion of owned ideations.
- Prevent users from accessing another user's generations.

### Stage 3 — Backend account preferences

- Introduce persistent application preferences.
- Move theme preference from local-only state into the account.
    - When the user changes the theme, the application should:
        1. Update the UI immediately.
        2. Persist the preference through the backend.
        3. Restore that preference when the user signs in again or opens another session.

        We should also consider what happens when the user changes their theme on one device while another session is active.

        When a user changes their theme, the frontend should optimistically update the UI and then persist the new value through an authenticated endpoint. If persistence fails, the frontend should reconcile its state with the server.

        For multiple sessions, I recommend account-level persistence without real-time synchronization in this stage. The next time another session fetches the account preferences, it receives the latest theme. We can later add synchronization on window focus or real-time events if the user experience requires it.

- Introduce persistent presence/status.
  The status should be persisted against the user account.

    We should distinguish manually selected status from actual session activity. For example, a user selecting offline should not necessarily invalidate or terminate their active sessions.

    There is also an architectural consideration: presence across multiple devices is different from presence stored on a single user document. We can begin with account-level status and introduce real-time presence tracking only when necessary

    Actual online/offline detection across multiple devices is a separate concern. We can introduce session-derived or real-time presence later without changing the meaning of this manual status.

- Implement authenticated profile and preferences endpoints.
- Update the user presenter and validators.

#### Implementation sequence

1. User model and validation. (covered)
2. Repository and services. (covered)
3. Controllers and routes. (covered)
4. REST testing. (covered)
5. Frontend integration: update theme state from the backend and restore it during authentication bootstrap.

### Stage 4 — Backend profile management and avatar

- Manage contact information.
- Support avatar URL and or image uploads.

    Establish image validation, storage and deletion rules.

    I would avoid storing image binaries directly in MongoDB.

    We should also avoid tying the avatar implementation to a specific storage provider before reviewing the available infrastructure and cost implications.

    One additional consideration: external image URLs can disappear, redirect or become unsafe. We should validate their format and restrict dangerous URL schemes.

### Stage 5 — Frontend identity integration

- Update IdentityProvider and identity services.
- Implement profile editing.
- Implement preference management.
- Connect theme changes to persisted preferences.
- Connect status selection to the backend.
- Update AccountMenu and WorkspaceUserMenu.

### Stage 6 — Workspace ownership integration

- Replace sample sidebar ideations with actual user generations.
- Implement personal generation listing.
- Add loading, empty and error states.
- Implement deletion from the sidebar.
- Connect the Library page to the authenticated user's resources.
- Implement appropriate workspace navigation.

### Stage 7 — REST and frontend integration testing

- Test authenticated generation creation.
- Test owner-only retrieval.
- Test cross-account access rejection.
- Test listing and deletion.
- Test profile and avatar updates.
- Test theme and status persistence.
- Test unauthorized requests and expired sessions.

### Stage 8 — Documentation and completion

- Update API documentation.
- Update architecture documentation.
- Document data migration requirements.
- Update the Phase 9 checklist.
- Git commit the completed work.

## Implementation sequence: where we begin

```bash
One decision before we implement avatar uploads
Since avatar uploads introduce external storage infrastructure, I would like to settle the intended storage approach before we reach Stage 4.

Would you prefer to initially support external image URLs and introduce actual image uploads later, or should we implement both capabilities in this phase?

My recommendation is to implement both, but keep the storage provider behind a dedicated service so that we can change providers without restructuring the identity domain.
```

---

We should distinguish these two concepts:

- Generation: the original output produced by the ideation engine.
- Workspace resource: an item the user organizes, saves, archives or otherwise manages.

We should not introduce a separate workspace collection prematurely. First, establish what the Library actually needs beyond the existing ideation records.

The Library should not simply duplicate the entire Ideation collection.

---

## Uploaded images

| Property          | Proposed rule         |
| ----------------- | --------------------- |
| Maximum file size | 5 MB                  |
| JPEG/ PNG/ WebP   | Allowed               |
| SVG               | Not allowed           |
| GIF               | Not allowed initially |

If we later introduce server-side image importing, we will need additional SSRF protections, including redirect validation and restrictions on private and internal IP addresses.

## Proposed account avatar data structure

```js
avatar: {
    url: String,

    source: {
        type: String,
        enum: ["UPLOAD", "EXTERNAL"],
    },

    storage: {
        provider: String,
        key: String,
    },

    metadata: {
        format: String,
        width: Number,
        height: Number,
        bytes: Number,
    },
},
```

The purpose of each property:

url -> URL used by the frontend to display the avatar.
source -> Distinguishes uploaded images from externally hosted images.
storage.provider -> Identifies the storage provider for uploaded images.
storage.key -> Identifies the stored asset for future deletion.
metadata.format -> Actual image format.
metadata.width -> Image width.
metadata.height -> Image height.
metadata.bytes -> Stored image size.

For an external URL, storage and image metadata can be absent.
For an uploaded image, the storage information is necessary to manage replacement and deletion.
This structure also gives us room to change storage providers without changing the account API contract.

| Method | Endpoint        | Responsibility                          |
| ------ | --------------- | --------------------------------------- |
| PATCH  | /auth/me        | Update first name, last name and phone. |
| PUT    | /auth/me/avatar | Upload and replace an avatar.           |
| PATCH  | /auth/me/avatar | Set an externally hosted avatar URL.    |
| DELETE | /auth/me/avatar | Remove the current avatar.              |

## Implementation plan

Here is the sequence I recommend following.

Step 1 — Architecture and storage preparation (covered)

- Finalize avatar schema.
- Establish storage provider interface.
- Review and prepare the Cloudinary adapter without coupling the Identity module to it.
- Review environment configuration.

Step 2 — User model and presenter (in process)

- Update User.js.
- Update user.presenter.js.
- Preserve existing profile and preference behavior.

Step 3 — Image upload infrastructure (in process)

- Install and configure file-type and Sharp
- Refine Multer upload middleware
- Introduce actual image-content validation.
- Implement provider-independent storage service
- Establish storage upload and deletion operations.
- Refine upload error handling.

Step 4 — Avatar service and repository

- Implement upload, external URL assignment and removal.
- Implement safe replacement and cleanup behavior.
- Keep account ownership enforced through req.user.\_id.

Step 5 — Controllers, validators and routes

- Extend AccountController.
- Introduce avatar request validation.
- Implement the three avatar endpoints.
- Retain the existing profile endpoint.
- Verify standardized error handling.

Step 6 — REST testing

- Test profile updates.
- Test valid and invalid uploads.
- Test external URL validation.
- Test avatar replacement and deletion.
- Test authentication and account isolation.
- Test storage failure scenarios.

Step 7 - Frontend integration

- Update account API methods
- Connect avatar upload and removal
- Connect external URL updates
- Synchronize authenticated user state
- Implement loading, error and success feedback

Step 8 - Documentation and completion

- Document API contracts and environment variables
- Document image storage architecture
- Update project implementation notes
- Review changes and commit

After every completed state you mention document this, document that. for instance here you said "Document API contracts and environment variables". What does this entail, where am i to document this.

## Upload security and processing

Receive multipart request.
Check file size and preliminary MIME type.
Inspect actual file signature using file-type.
Decode and validate image using Sharp.
Normalize the image and remove unnecessary metadata.
Upload the processed image to Cloudinary.
Persist its reference and metadata in MongoDB.

For the initial implementation, Cloudinary remains the only configured adapter. We should also eventually make the Cloudinary credential requirements conditional on the selected provider. Otherwise, even a future deployment using a different provider would still need Cloudinary credentials merely to start the application.

---

One important distinction concerning contact information: changing an email address should eventually be a separate, verified identity workflow. We should not allow an ordinary profile update to silently change the account's login email.

---

We may proceed to REST tests, in each test give me the complete REST example.

Tests ... all passed successfully and or returned the expected responses.

For your information so as to avoid inconsistencies, here is the current state(s) of a portion of the folder structure and files we recently created or optimized:

Access and respond to what i have just attached

---
