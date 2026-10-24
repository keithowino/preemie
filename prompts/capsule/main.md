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
